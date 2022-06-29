import { useState, useEffect, useRef } from "react";
import rough from 'roughjs/bundled/rough.esm';
import cursorForPosition from "./cursorForPosition";
import getElementAtPosition from "./getElementAtPostion";
import useHistory from "./hook/useHistory";
import Tools from "./Tools";
import getStroke from "perfect-freehand";
import '../css/app.css'
import { FaUndo, FaRedo } from 'react-icons/fa';

const generator = rough.generator()

//element creation
const createElement = (id, x1, y1, x2, y2, type) => {
  let roughElement
  switch (type) {
    case "line":
      roughElement = generator.line(x1, y1, x2, y2)
      return { id, x1, y1, x2, y2, type, roughElement }
    case "rectangle":
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1)
      return { id, x1, y1, x2, y2, type, roughElement }
    case "pencil":
      return { id, type, points: [{ x: x1, y: y1 }] }
    case "text":
      return { id, type, x1, y1, x2, y2, text: "" };
    default:
      console.error(`Type not recognised: ${type}`)

  }
  return { id, x1, y1, x2, y2, type, roughElement }
}
//resize
const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null; //will not execute normally
  }
};
//adjust element
const adjustElementCoordinates = element => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};
const adjustmentRequired = type => ["line", "rectangle"].includes(type);

const getSvgPathFromStroke = stroke => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};



const drawElement = (roughCanvas, context, element) => {
  switch (element.type) {
    case "line":
    case "rectangle":
      roughCanvas.draw(element.roughElement);
      break;
    case "pencil":
      const stroke = getSvgPathFromStroke(getStroke(element.points, {
        thinning: 0.8
      }));
      context.fill(new Path2D(stroke));
      break;
    case "text":
      context.textBaseline = "top";
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1, element.y1);
      break;
    default:
      console.error(`Type not recognised: ${element.type}`);
  }
};


function App() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;
  const [elements, setElements, handleUndo, handleRedo] = useHistory([])
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("selection")
  const [selected, setSelected] = useState(null)
  const textAreaRef = useRef();

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height)

    const roughCanvas = rough.canvas(canvas)
    elements.forEach(element => drawElement(roughCanvas, context, element))

  }, [elements]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      textArea.focus();
      textArea.value = selected.text;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatedElement = (id, x1, y1, x2, y2, type, options) => {
    const elementscpy = [...elements];

    switch (type) {
      case "line":
        elementscpy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case "rectangle":
        elementscpy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case "pencil":
        elementscpy[id].points = [...elementscpy[id].points, { x: x2, y: y2 }];
        break;
      case "text":
        const textWidth = document
          .getElementById("canvas")
          .getContext("2d")
          .measureText(options.text).width;
        const textHeight = 24;
        elementscpy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text,
        };
        break;
      default:
        console.error(`Type not recognised: ${type}`)
    }
    setElements(elementscpy, true)
  }

  const handleMouseDown = (e) => {
    if (action === "writing") return;

    const { clientX, clientY } = e;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "pencil") {
          const xOffsets = element.points.map(point => clientX - point.x);
          const yOffsets = element.points.map(point => clientY - point.y);
          setSelected({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelected({ ...element, offsetX, offsetY });
        }
        setElements(prevState => prevState);
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(id, clientX, clientY, clientX, clientY, tool);
      setElements(prevState => [...prevState, element]);
      setSelected(element);
      setAction(tool === "text" ? "writing" : "drawing");
    }
  }
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    //for selection
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements)
      e.target.style.cursor = element ? cursorForPosition(element.position) : "default"
    }
    // for drawing
    if (action === "drawing") {
      const index = selected.id;
      const { x1, y1 } = elements[index]
      updatedElement(index, x1, y1, clientX, clientY, tool)
    }
    //moving
    else if (action === "moving") {
      if (selected.type === "pencil") {
        const newPoints = selected.points.map((_, index) => ({
          x: clientX - selected.xOffsets[index],
          y: clientY - selected.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selected.id] = {
          ...elementsCopy[selected.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        //square and line
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selected;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        const options = type === "text" ? { text: selected.text } : {};
        updatedElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options);
      }
    }
    //resizing
    else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selected;
      const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
      updatedElement(id, x1, y1, x2, y2, type);
    }
  }
  const handleMouseUp = e => {
    const { clientX, clientY } = e;

    if (selected) {
      if (
        selected.type === "text" &&
        clientX - selected.offsetX === selected.x1 &&
        clientY - selected.offsetY === selected.y1
      ) {
        setAction("writing");
        return;
      }

      const index = selected.id;
      const { id, type } = elements[index];
      if ((action === "drawing" || action === "resizing") && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updatedElement(id, x1, y1, x2, y2, type);
      }
    }

    if (action === "writing") return;

    setAction("none");
    setSelected(null);
  };
  const handleBlur = e => {
    const { id, x1, y1, type } = selected;
    setAction("none");
    setSelected(null);
    updatedElement(id, x1, y1, null, null, type, { text: e.target.value });
  };

  return (
    <div>
      <Tools
        tool={tool}
        setTool={setTool}
      ></Tools>
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: selected.y1 - 2,
            left: selected.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "white",
          }}
        />
      ) : null}
      <canvas
        id="canvas"
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp} >
      </canvas>
      <div className='fixed bottom-0 p-4 inline-flex gap-2'>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded-lg" onClick={handleUndo}><FaUndo /></button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded-lg" onClick={handleRedo}><FaRedo /></button>
      </div>
    </div >
  );
}

export default App;
