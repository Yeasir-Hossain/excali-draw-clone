import React from 'react';
import '../css/Tools.css'
import { FaMousePointer,FaSquare } from 'react-icons/fa';
import { AiOutlineLine } from 'react-icons/ai';
import { GiPlainCircle } from 'react-icons/gi';
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
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-lg hover:text-purple-600' htmlFor="selection"><span className='icon'><FaMousePointer/></span></label>
                <input
                    type="radio"
                    id="line"
                    checked={tool === "line"}
                    onChange={() => setTool("line")}
                />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-2xl hover:text-purple-600' htmlFor="line"> <span className='icon2'><AiOutlineLine/></span></label>
                {/* <input
                    type="radio"
                    id="circle"
                    checked={tool === "circle"}
                    onChange={() => setTool("circle")}
                />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-2xl hover:text-purple-600' htmlFor="circle"> <span className='icon2'><GiPlainCircle/></span></label> */}
                <input
                    type="radio"
                    id="rectangle"
                    checked={tool === "rectangle"}
                    onChange={() => setTool("rectangle")}
                />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-2xl hover:text-purple-600' htmlFor="rectangle"> <span className='icon2'><FaSquare/></span></label>
                <input
                    type="radio"
                    id="pencil"
                    checked={tool === "pencil"}
                    onChange={() => setTool("pencil")}
                />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-2xl hover:text-purple-600' htmlFor="pencil"><span className='icon2'><RiPencilFill/></span></label>
                <input
                    type="radio"
                    id="text"
                    checked={tool === "text"}
                    onChange={() => setTool("text")} />
                <label className='w-10 h-10 border-2 flex justify-center border-transparent rounded-md text-2xl hover:text-purple-600' htmlFor="text"><span className='icon2'><ImTextColor/></span> </label>
            </div>

        </div>
    );
};

export default Tools;