import { useState, useEffect } from "react";
import rough from 'roughjs/bundled/rough.esm';
import cursorForPosition from "./cursorForPosition";
import getElementAtPosition from "./getElementAtPostion";
import Tools from "./Tools";

const generator = rough.generator()

//element creation
const createElement = (id, x1, y1, x2, y2, type) => {
  let roughElement
  switch (type) {
    case "line":
      roughElement = generator.line(x1, y1, x2, y2)
      break;
    case "rectangle":
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1)
      break;
    default:

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

function App() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;
  const [elements, setElements] = useState([])
  const [action, setAction] = useState("none")
  const [tool, setTool] = useState("selection")
  const [selected, setSelected] = useState(null)


  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height)

    const roughCanvas = rough.canvas(canvas)
    elements.forEach(element => roughCanvas.draw(element.roughElement))

  }, [elements]);

  const updatedElement = (id, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(id, x1, y1, x2, y2, type)
    const elementscpy = [...elements]
    elementscpy[id] = updatedElement;
    setElements(elementscpy)
  }

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e
    //for selection
    if (tool === "selection") {
      //selection of item
      const element = getElementAtPosition(clientX, clientY, elements)
      if (element) {
        const offsetX = clientX - element.x1
        const offsetY = clientY - element.y1
        setSelected({ ...element, offsetX, offsetY })
        if (element.position === "inside") {
          setAction("moving")
        }
        else
          setAction("resizing")
      }
    }
    else {
      // for drawing
      const id = elements.length
      const element = createElement(id, clientX, clientY, clientX, clientY, tool)
      setElements(prevState => [...prevState, element])
      setAction("drawing")
      setSelected(element)
    }
  }
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e

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
    else if (action === "moving") {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selected;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = clientX - offsetX
      const newY1 = clientY - offsetY
      updatedElement(id, newX1, newY1, newX1 + width, newY1 + height, type)
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selected;
      const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
      updatedElement(id, x1, y1, x2, y2, type);
    }
  }
  const handleMouseUp = () => {
    const index = selected?.id;
    const { id, type } = elements[index];
    if ((action === "drawing" || action === "resizing") && adjustmentRequired(type)) {
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updatedElement(id, x1, y1, x2, y2, type);
    }
    setAction("none")
    setSelected(null)
  }



  return (
    <div>
      <Tools
        tool={tool}
        setTool={setTool}
      ></Tools>
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
    </div >
  );
}

export default App;
