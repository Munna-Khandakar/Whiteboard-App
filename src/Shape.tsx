import {useRef, useState} from 'react';
import {Group, Rect} from 'react-konva';
import {EditableText} from "./EditableText.tsx";
import {Shape} from "./type/Shape.ts";

type CustomShapeProps = {
    shape: Shape
    onDoubleClick: () => void
    onClick: () => void
}

const CustomShape = (props: CustomShapeProps) => {

    const {shape,onClick} = props;

    const shapeRef = useRef(null);

    const [text, setText] = useState("Click to resize. Double click to edit.");
    const [isEditing, setIsEditing] = useState(false);

    const ondblclick = () => {
        props.onDoubleClick();
        setIsEditing(true);
    };

    function toggleEdit() {
        setIsEditing(false);
    }

    return (
        <Group
            ref={shapeRef}
            x={shape.x}
            y={shape.y}
            fill={shape.fill}
            draggable={true}
            rotation={shape.rotation}
            width={shape.width as number}
            height={shape.height as number}
            onDblClick={ondblclick}
            onClick={onClick}
        >

            <Rect
                listening={true}
                strokeWidth={4}
                stroke={'#9646F5' + 90}
                x={0}
                y={0}
                width={shape.width as number + 40}
                height={shape.height as number + 40}
                index={1}
                perfectDrawEnabled={false}
            />
            <EditableText
                x={0}
                y={0}
                text={shape.text}
                width={shape.width}
                height={shape.height}
                isEditing={isEditing}
                onToggleEdit={toggleEdit}
                onChange={(value) => setText(value)}
            />
        </Group>
    );
};

export default CustomShape;