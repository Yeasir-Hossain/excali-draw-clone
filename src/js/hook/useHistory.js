import { useState } from "react";

const useHistory = initialState => {
    const [history, setHistory] = useState([initialState])
    const [index, setIndex] = useState(0)

    const setState = (action, overwrite = false) => {
        const newState = typeof action === "function" ? action(history[index]) : action;
        if (!overwrite) {
            const updatedState = [...history].slice(0, index + 1)
            setHistory([...updatedState, newState])
            setIndex(prevState => prevState + 1)
        }
        else {
            const historyCpy = [...history]
            historyCpy[index] = newState;
            setHistory(historyCpy)
        }
    }
    const handleUndo = () => {
        index > 0 && setIndex(prevState => prevState - 1)
    }
    const handleRedo = () => {
        index < history.length - 1 && setIndex(prevState => prevState + 1)
    }

    return [history[index], setState, handleUndo, handleRedo]
}
export default useHistory