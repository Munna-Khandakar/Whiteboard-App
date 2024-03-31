import {EditableTextInput} from "./EditableTextInput";
import {Text} from 'react-konva';


const RETURN_KEY = 13;
const ESCAPE_KEY = 27;

export function EditableText({
                                 x,
                                 y,
                                 isEditing,
                                 onToggleEdit,
                                 onChange,
                                 text,
                                 width,
                                 height
                             }) {
    function handleEscapeKeys(e) {
        if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
            onToggleEdit(e);
        }
    }

    function handleTextChange(e) {
        onChange(e.currentTarget.value);
    }

    if (isEditing) {
        return (
            <EditableTextInput
                x={x}
                y={y}
                width={width}
                height={height}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleEscapeKeys}
            />
        );
    } else {
        return (
            <Text
                x={x}
                y={y}
                text={text}
                width={width}
                height={height}
                onClick={onToggleEdit}
            />
        );
    }
}
