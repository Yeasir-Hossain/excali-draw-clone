import React from 'react';

const Tools = ({ tool, setTool }) => {
    return (
        <div className="fixed">
            <input
                type="radio"
                id="selection"
                checked={tool === "selection"}
                onChange={() => setTool("selection")}
            />
            <label htmlFor="selection">Selection</label>
            <input
                type="radio"
                id="line"
                checked={tool === "line"}
                onChange={() => setTool("line")}
            />
            <label htmlFor="line">Line</label>
            <input
                type="radio"
                id="rectangle"
                checked={tool === "rectangle"}
                onChange={() => setTool("rectangle")}
            />
            <label htmlFor="rectangle">Rectangle</label>
            <input
                type="radio"
                id="pencil"
                checked={tool === "pencil"}
                onChange={() => setTool("pencil")}
            />
            <label htmlFor="pencil">Pencil</label>
        </div>
    );
};

export default Tools;