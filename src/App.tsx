import {TbRectangle} from "react-icons/tb";
import {IoMdDownload} from "react-icons/io";
import {FaLongArrowAltRight} from "react-icons/fa";
import {LuPencil} from "react-icons/lu";
import {GiArrowCursor} from "react-icons/gi";
import {FaRegCircle} from "react-icons/fa6";
import {
    Arrow,
    Circle,
    Layer,
    Line,
    Rect,
    Stage,
    Transformer,
} from "react-konva";
import {useRef, useState} from "react";
import Konva from "konva";
import {ACTIONS} from "./constants";
import {v4 as uuidv4} from "uuid";
import CustomShape from "./Shape.tsx";
import {useShapeStore} from "./store/shapeStore.ts";
import {Shape} from "./type/Shape.ts";

function App() {

    const stageRef = useRef(null);
    const [action, setAction] = useState(ACTIONS.SELECT);
    const [fillColor, setFillColor] = useState("#ff0000");

    const [arrows, setArrows] = useState([]);

    const shapes = useShapeStore(state => state.shapes);
    const updateShapes = useShapeStore(state => state.updateShapes);

    const [scribbles, setScribbles] = useState([]);
    const strokeColor = "#000";

    const isDraggable = action === ACTIONS.SELECT;
    const isPaining = useRef(false);
    const currentShapeId = useRef();
    const transformerRef = useRef(null);

    const [textSelectedShape, setTextSelectedShape] = useState('');

    console.log(shapes)
    const onPointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (action === ACTIONS.SELECT || !isPaining.current) return;

        const stage = stageRef.current;
        const {x, y} = stage.getPointerPosition();

        switch (action) {
            case ACTIONS.RECTANGLE:
                const updatedShapes: Shape[] = shapes.map((rectangle) => {
                    if (rectangle.id === currentShapeId.current) {
                        return {
                            ...rectangle,
                            width: x - rectangle.x,
                            height: y - rectangle.y,
                        };
                    }
                    return rectangle;
                });

                updateShapes(updatedShapes)


                break;
            case ACTIONS.CIRCLE:
                const updatedCircles: Shape[] = shapes.map((circle) => {
                    if (circle.id === currentShapeId.current) {
                        return {
                            ...circle,
                            radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
                        };
                    }
                    return circle;
                })
                updateShapes(updatedCircles)
                break;
            case ACTIONS.ARROW:
                setArrows((arrows) =>
                    arrows.map((arrow) => {
                        if (arrow.id === currentShapeId.current) {
                            return {
                                ...arrow,
                                points: [arrow.points[0], arrow.points[1], x, y],
                            };
                        }
                        return arrow;
                    })
                );
                break;
            case ACTIONS.SCRIBBLE:
                setScribbles((scribbles) =>
                    scribbles.map((scribble) => {
                        if (scribble.id === currentShapeId.current) {
                            return {
                                ...scribble,
                                points: [...scribble.points, x, y],
                            };
                        }
                        return scribble;
                    })
                );
                break;
        }
    }

    const onPointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {

        if (action === ACTIONS.SELECT) return;

        const stage = stageRef.current;
        const {x, y} = stage.getPointerPosition();
        const id = uuidv4();
        let updatedShapes: Shape[] = shapes

        currentShapeId.current = id;
        isPaining.current = true;

        switch (action) {
            case ACTIONS.RECTANGLE:

                updatedShapes.push({
                    id,
                    x,
                    y,
                    fill: fillColor,
                    draggable: true,
                    rotation: 0,
                    width: 0,
                    height: 0,
                    type: 'rect',
                    text: 'double click to write text'
                })
                updateShapes(updatedShapes)
                break;
            case ACTIONS.CIRCLE:
                updatedShapes.push(
                    {
                        id,
                        x,
                        y,
                        radius: 20,
                        draggable: true,
                        type: 'circle',
                        fill: fillColor,
                        rotation: 0,
                        text: 'double click to write text'
                    }
                )
                updateShapes(updatedShapes)
                break;
            case ACTIONS.ARROW:
                setArrows((arrows) => [
                    ...arrows,
                    {
                        id,
                        points: [x, y, x + 20, y + 20],
                        fillColor,
                    },
                ]);
                break;
            case ACTIONS.SCRIBBLE:
                setScribbles((scribbles) => [
                    ...scribbles,
                    {
                        id,
                        points: [x, y],
                        fillColor,
                    },
                ]);
                break;
        }
    }

    const onPointerUp = (e: Konva.KonvaEventObject<PointerEvent>) => {
        isPaining.current = false;
    }

    const handleExport = () => {
        const uri = stageRef.current.toDataURL();
        const link = document.createElement("a");
        link.download = "image.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function onClick(e) {
        if (action !== ACTIONS.SELECT) return;
        const target = e.currentTarget;
        transformerRef.current.nodes([target]);
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">

            <div className="absolute top-0 z-10 w-full py-2">
                <div
                    className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
                    <button
                        className={
                            action === ACTIONS.SELECT
                                ? "bg-violet-300 p-1 rounded"
                                : "p-1 hover:bg-violet-100 rounded"
                        }
                        onClick={() => setAction(ACTIONS.SELECT)}
                    >
                        <GiArrowCursor size={"2rem"}/>
                    </button>
                    <button
                        className={
                            action === ACTIONS.RECTANGLE
                                ? "bg-violet-300 p-1 rounded"
                                : "p-1 hover:bg-violet-100 rounded"
                        }
                        onClick={() => setAction(ACTIONS.RECTANGLE)}
                    >
                        <TbRectangle size={"2rem"}/>
                    </button>
                    <button
                        className={
                            action === ACTIONS.CIRCLE
                                ? "bg-violet-300 p-1 rounded"
                                : "p-1 hover:bg-violet-100 rounded"
                        }
                        onClick={() => setAction(ACTIONS.CIRCLE)}
                    >
                        <FaRegCircle size={"1.5rem"}/>
                    </button>
                    <button
                        className={
                            action === ACTIONS.ARROW
                                ? "bg-violet-300 p-1 rounded"
                                : "p-1 hover:bg-violet-100 rounded"
                        }
                        onClick={() => setAction(ACTIONS.ARROW)}
                    >
                        <FaLongArrowAltRight size={"2rem"}/>
                    </button>
                    <button
                        className={
                            action === ACTIONS.SCRIBBLE
                                ? "bg-violet-300 p-1 rounded"
                                : "p-1 hover:bg-violet-100 rounded"
                        }
                        onClick={() => setAction(ACTIONS.SCRIBBLE)}
                    >
                        <LuPencil size={"1.5rem"}/>
                    </button>

                    <button>
                        <input
                            className="w-6 h-6"
                            type="color"
                            value={fillColor}
                            onChange={(e) => setFillColor(e.target.value)}
                        />
                    </button>

                    <button onClick={handleExport}>
                        <IoMdDownload size={"1.5rem"}/>
                    </button>
                </div>
            </div>

            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        height={window.innerHeight}
                        width={window.innerWidth}
                        fill="#ffffff"
                        id="bg"
                        onClick={() => {
                            transformerRef.current.nodes([]);
                            setTextSelectedShape('')
                        }}
                    />
                    {
                        shapes.map((shape) => (
                            <CustomShape
                                onDoubleClick={() => setTextSelectedShape(shape.id)}
                                shape={shape}
                                onClick={onClick}
                            />
                        ))
                    }

                    {/*{*/}
                    {/*    rectangles.map((rectangle) => (*/}
                    {/*        <Rect*/}
                    {/*            key={rectangle.id}*/}
                    {/*            x={rectangle.x}*/}
                    {/*            y={rectangle.y}*/}
                    {/*            stroke={strokeColor}*/}
                    {/*            strokeWidth={2}*/}
                    {/*            fill={rectangle.fillColor}*/}
                    {/*            height={rectangle.height}*/}
                    {/*            width={rectangle.width}*/}
                    {/*            draggable={isDraggable}*/}
                    {/*            onClick={onClick}*/}
                    {/*        />*/}
                    {/*    ))*/}
                    {/*}*/}
                    {/*{*/}
                    {/*    circles.map((circle) => (*/}
                    {/*        <Circle*/}
                    {/*            key={circle.id}*/}
                    {/*            radius={circle.radius}*/}
                    {/*            x={circle.x}*/}
                    {/*            y={circle.y}*/}
                    {/*            stroke={strokeColor}*/}
                    {/*            strokeWidth={2}*/}
                    {/*            fill={circle.fillColor}*/}
                    {/*            draggable={isDraggable}*/}
                    {/*            onClick={onClick}*/}
                    {/*        />*/}
                    {/*    ))*/}
                    {/*}*/}
                    {
                        arrows.map((arrow) => (
                            <Arrow
                                key={arrow.id}
                                points={arrow.points}
                                stroke={strokeColor}
                                strokeWidth={2}
                                fill={arrow.fillColor}
                                draggable={isDraggable}
                                onClick={onClick}
                            />
                        ))
                    }
                    {
                        scribbles.map((scribble) => (
                            <Line
                                key={scribble.id}
                                lineCap="round"
                                lineJoin="round"
                                points={scribble.points}
                                stroke={strokeColor}
                                strokeWidth={2}
                                fill={scribble.fillColor}
                                draggable={isDraggable}
                                onClick={onClick}
                            />
                        ))
                    }
                    <Transformer ref={transformerRef}/>
                </Layer>
            </Stage>
        </div>
    )
}

export default App