import { create } from "zustand";
import { Canvas } from "fabric";

export interface DrawingTool {
  type: "brush" | "eraser" | "line" | "rectangle" | "circle";
  color: string;
  width: number;
}

export interface DrawingState {
  canvas: Canvas | null;
  currentTool: DrawingTool;
  isDrawing: boolean;
  history: string[];
  historyIndex: number;
  setCanvas: (canvas: Canvas) => void;
  setTool: (tool: Partial<DrawingTool>) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  addToHistory: (canvasData: string) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  syncCanvas: (canvasData: string) => void;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  canvas: null,
  currentTool: {
    type: "brush",
    color: "#000000",
    width: 5,
  },
  isDrawing: false,
  history: [],
  historyIndex: -1,
  setCanvas: (canvas) => set({ canvas }),
  setTool: (tool) =>
    set((state) => ({
      currentTool: { ...state.currentTool, ...tool },
    })),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  addToHistory: (canvasData) =>
    set((state) => {
      // Prevent duplicate consecutive states
      if (state.history.length > 0 && state.history[state.historyIndex] === canvasData) {
        return state;
      }

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(canvasData);

      // Limit history size to prevent memory issues
      if (newHistory.length > 50) {
        newHistory.shift();
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }),
  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (canvas && historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      canvas.loadFromJSON(prevState).then(() => {
        // Ensure all objects are non-selectable after loading
        canvas.forEachObject((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });
        canvas.selection = false;
        canvas.renderAll();
        set({ historyIndex: historyIndex - 1 });
      });
    }
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (canvas && historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      canvas.loadFromJSON(nextState).then(() => {
        // Ensure all objects are non-selectable after loading
        canvas.forEachObject((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });
        canvas.selection = false;
        canvas.renderAll();
        set({ historyIndex: historyIndex + 1 });
      });
    }
  },

  clearCanvas: () => {
    const { canvas, addToHistory } = get();
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.renderAll();
      addToHistory(JSON.stringify(canvas.toJSON()));
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
  syncCanvas: (canvasData) => {
    const { canvas } = get();
    if (canvas && canvasData) {
      canvas.loadFromJSON(canvasData).then(() => {
        // Ensure all objects are non-selectable after loading
        canvas.forEachObject((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });
        canvas.selection = false;
        canvas.renderAll();
      });
    }
  },
}));
