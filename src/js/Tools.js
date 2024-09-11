import React from 'react';
import { FaMousePointer,FaSquare } from 'react-icons/fa';
import { AiOutlineLine } from 'react-icons/ai';
import { RiPencilFill } from 'react-icons/ri';
import { ImTextColor } from 'react-icons/im';

const Tools = ({ tool, setTool }) => {
    return (
        <div className="inline absolute top-0 mt-2 ml-2">
            <div className='flex shadow-lg gap-1 p-2 rounded-lg'>
                <input
                    type="radio"
                    id="selection"
                    checked={tool === "selection"}
                    onChange={() => setTool("selection")}
                />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-lg hover:text-purple-600' htmlFor="selection"><span className='mt-[25%]'><FaMousePointer/></span></label>
                <input
                    type="radio"
                    id="line"
                    checked={tool === "line"}
                    onChange={() => setTool("line")}
                />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-2xl hover:text-purple-600' htmlFor="line"> <span className='mt-[5px]'><AiOutlineLine/></span></label>
                <input
                    type="radio"
                    id="rectangle"
                    checked={tool === "rectangle"}
                    onChange={() => setTool("rectangle")}
                />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-2xl hover:text-purple-600' htmlFor="rectangle"> <span className='mt-[5px]'><FaSquare/></span></label>
                <input
                    type="radio"
                    id="pencil"
                    checked={tool === "pencil"}
                    onChange={() => setTool("pencil")}
                />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-2xl hover:text-purple-600' htmlFor="pencil"><span className='mt-[5px]'><RiPencilFill/></span></label>
                <input
                    type="radio"
                    id="text"
                    checked={tool === "text"}
                    onChange={() => setTool("text")} />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-2xl hover:text-purple-600' htmlFor="text"><span className='mt-[5px]'><ImTextColor/></span> </label>
            </div>

        </div>
    );
};

export default Tools;