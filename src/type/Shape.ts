export const SHAPES = [
    {
        id: '123',
        x: 10,
        y: 10,
        fill: '#fff',
        draggable: true,
        rotation: 0,
        width: 100,
        height: 100,
        type: 'rect',
        text:'react text 01'
    },

    {
        id: '234',
        x: 32,
        y: 54,
        fill: '#fff',
        draggable: true,
        rotation: 0,
        radius: 0,
        width: 100,
        height: 100,
        type: 'rect',
        text:'react text 02'
    },
]

export type Shape = {
    id: string,
    x: number,
    y: number,
    fill: string,
    draggable: boolean,
    rotation: number,
    radius?: number,
    width?: number,
    height?: number,
    type: string,
    text: string
}

