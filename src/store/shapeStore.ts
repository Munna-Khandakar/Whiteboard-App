import { create } from 'zustand';
import {Shape, SHAPES} from "../type/Shape.ts";

interface CounterState {
    shapes: Shape[];
    updateShapes: (shapes: Shape[]) => void;
}

export const useShapeStore = create<CounterState>((set) => ({
    shapes: SHAPES,
    updateShapes: (shapes) => set({ shapes }),
}));