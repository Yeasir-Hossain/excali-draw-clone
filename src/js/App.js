import { useLayoutEffect, useState } from "react";
import rough from 'roughjs/bundled/rough.esm';

const generator = rough.generator()

const createElement = (x1, y1, x2, y2, type) => {
  const roughElement =
    type === "line" ? generator.line(x1, y1, x2, y2) : generator.rectangle(x1, y1, x2 - x1, y2 - y1)
  return { x1, y1, x2, y2, roughElement }
}

function App() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;
  const [elements, setElements] = useState([])
  const [drawing, setDrawing] = useState(false)
  const [elementType, setElementType] = useState("line")


  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height)

    const roughCanvas = rough.canvas(canvas)
    elements.forEach(element => roughCanvas.draw(element.roughElement))

  }, [elements]);

  const handleMouseDown = (e) => {
    setDrawing(true)
    const { clientX, clientY } = e
    const element = createElement(clientX, clientY, clientX, clientY, elementType)
    setElements(prevState => [...prevState, element])
  }
  const handleMouseMove = (e) => {
    if (!drawing)
      return
    else {
      const { clientX, clientY } = e
      const index = elements.length - 1;
      const { x1, y1 } = elements[index]
      const updatedElement = createElement(x1, y1, clientX, clientY, elementType)
      const elementscpy = [...elements]
      elementscpy[index] = updatedElement;
      setElements(elementscpy)
    }
  }
  const handleMouseUp = () => {
    setDrawing(false)
  }

  return (
    <div>
      <div className="fixed">
        <input
          type="radio"
          id="line"
          checked={elementType === "line"}
          onChange={() => setElementType("line")}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={elementType === "rectangle"}
          onChange={() => setElementType("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>
      </div>
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
    </div>
  );
}

export default App;
