import React from 'react';

const Tools = ({ elementType, setElementType }) => {
    return (
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
    );
};

export default Tools;