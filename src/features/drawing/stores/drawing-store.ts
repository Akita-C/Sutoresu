import { create } from "zustand";
import { Canvas, Circle, FabricObject, Line, Path, Rect } from "fabric";
import {
  ActionData,
  DrawAction,
  DrawActionType,
  LiveShapeMoveData,
  LiveShapeStartData,
  LiveStrokeMoveData,
  LiveStrokeStartData,
  ShapeActionData,
  StrokeActionData,
  UndoRedoActionData,
} from "../types";

export interface DrawingTool {
  type: "brush" | "eraser" | "line" | "rectangle" | "circle";
  color: string;
  width: number;
}

export interface DrawingState {
  canvas: Canvas | null;
  currentTool: DrawingTool;
  isDrawing: boolean;
  actions: DrawAction[];
  undoneActions: string[]; // IDs of undone actions

  // Simple current drawing state
  currentStroke: Path | null;
  currentShape: FabricObject | null;
  currentShapeStartX: number;
  currentShapeStartY: number;

  setCanvas: (canvas: Canvas) => void;
  setTool: (tool: Partial<DrawingTool>) => void;
  setIsDrawing: (isDrawing: boolean) => void;

  // Action-based methods
  addAction: (action: DrawAction) => void;
  applyAction: (action: DrawAction) => void;
  createStrokeAction: (pathData: string) => DrawAction;
  createShapeAction: (shapeType: ShapeActionData["shapeType"], properties: ShapeActionData["properties"]) => DrawAction;
  createClearAction: () => DrawAction;
  createUndoAction: () => DrawAction | null;
  createRedoAction: () => DrawAction | null;
  rebuildCanvas: () => void;

  // New real-time methods
  applyLiveAction: (action: DrawAction) => void;
  createLiveStrokeStartAction: (x: number, y: number) => DrawAction;
  createLiveStrokeMoveAction: (x: number, y: number) => DrawAction;
  createLiveStrokeEndAction: () => DrawAction;
  createLiveShapeStartAction: (shapeType: ShapeActionData["shapeType"], x: number, y: number) => DrawAction;
  createLiveShapeMoveAction: (x: number, y: number) => DrawAction;
  createLiveShapeEndAction: () => DrawAction;

  // Legacy methods for UI
  undo: () => DrawAction | null;
  redo: () => DrawAction | null;
  clearCanvas: () => DrawAction;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const generateActionId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useDrawingStore = create<DrawingState>((set, get) => ({
  canvas: null,
  currentTool: {
    type: "brush",
    color: "#000000",
    width: 5,
  },
  isDrawing: false,
  actions: [],
  undoneActions: [],
  currentStroke: null,
  currentShape: null,
  currentShapeStartX: 0,
  currentShapeStartY: 0,

  setCanvas: (canvas) => set({ canvas }),
  setTool: (tool) =>
    set((state) => ({
      currentTool: { ...state.currentTool, ...tool },
    })),
  setIsDrawing: (isDrawing) => set({ isDrawing }),

  addAction: (action) =>
    set((state) => {
      if (action.type === "Undo" || action.type === "Redo") {
        return {
          actions: [...state.actions, action],
          undoneActions: state.undoneActions,
        };
      } else {
        const filteredActions = state.actions.filter((a) => !state.undoneActions.includes(a.id));

        return {
          actions: [...filteredActions, action],
          undoneActions: [],
        };
      }
    }),

  applyAction: (action) => {
    const { canvas } = get();
    if (!canvas) return;

    switch (action.type) {
      case "Stroke": {
        const data = action.data as StrokeActionData;
        const pathObject = JSON.parse(data.path);
        pathObject.stroke = data.color;
        pathObject.strokeWidth = data.width;
        pathObject.fill = "";
        pathObject.selectable = false;
        pathObject.evented = false;
        const path = new Path(pathObject.path, pathObject);
        canvas.add(path);
        break;
      }
      case "Shape": {
        const data = action.data as ShapeActionData;
        let shape;

        switch (data.shapeType) {
          case "rectangle":
            shape = new Rect({
              left: data.properties.left,
              top: data.properties.top,
              width: data.properties.width,
              height: data.properties.height,
              fill: "transparent",
              stroke: data.properties.color,
              strokeWidth: data.properties.strokeWidth,
              selectable: false,
              evented: false,
            });
            break;
          case "circle":
            shape = new Circle({
              left: data.properties.left,
              top: data.properties.top,
              radius: data.properties.radius,
              fill: "transparent",
              stroke: data.properties.color,
              strokeWidth: data.properties.strokeWidth,
              selectable: false,
              evented: false,
            });
            break;
          case "line":
            shape = new Line([data.properties.x1!, data.properties.y1!, data.properties.x2!, data.properties.y2!], {
              stroke: data.properties.color,
              strokeWidth: data.properties.strokeWidth,
              selectable: false,
              evented: false,
            });
            break;
        }

        if (shape) {
          canvas.add(shape);
        }
        break;
      }
      case "Clear": {
        canvas.clear();
        canvas.backgroundColor = "#ffffff";
        break;
      }
      case "Undo": {
        const data = action.data as UndoRedoActionData;
        set((state) => ({
          undoneActions: [...state.undoneActions, data.targetActionId],
        }));
        get().rebuildCanvas();
        return;
      }
      case "Redo": {
        const data = action.data as UndoRedoActionData;
        set((state) => ({
          undoneActions: state.undoneActions.filter((id) => id !== data.targetActionId),
        }));
        get().rebuildCanvas();
        return;
      }
    }

    canvas.renderAll();
  },

  applyLiveAction: (action) => {
    const { canvas } = get();
    if (!canvas) return;

    switch (action.type) {
      case "LiveStrokeStart": {
        const data = action.data as LiveStrokeStartData;
        const path = new Path(`M ${data.x} ${data.y}`, {
          stroke: data.color,
          strokeWidth: data.width,
          fill: "",
          selectable: false,
          evented: false,
        });
        canvas.add(path);
        set({ currentStroke: path });
        break;
      }
      case "LiveStrokeMove": {
        const { currentStroke } = get();
        if (!currentStroke) return;

        const data = action.data as LiveStrokeMoveData;
        const currentPath = currentStroke.path || [];
        currentPath.push(["L", data.x, data.y]);
        currentStroke.set({ path: currentPath });
        break;
      }
      case "LiveStrokeEnd": {
        set({ currentStroke: null });
        break;
      }
      case "LiveShapeStart": {
        const data = action.data as LiveShapeStartData;
        set({
          currentShapeStartX: data.startX,
          currentShapeStartY: data.startY,
        });

        let shape;
        switch (data.shapeType) {
          case "rectangle":
            shape = new Rect({
              left: data.startX,
              top: data.startY,
              width: 0,
              height: 0,
              fill: "transparent",
              stroke: data.color,
              strokeWidth: data.strokeWidth,
              selectable: false,
              evented: false,
            });
            break;
          case "circle":
            shape = new Circle({
              left: data.startX,
              top: data.startY,
              radius: 0,
              fill: "transparent",
              stroke: data.color,
              strokeWidth: data.strokeWidth,
              selectable: false,
              evented: false,
            });
            break;
          case "line":
            shape = new Line([data.startX, data.startY, data.startX, data.startY], {
              stroke: data.color,
              strokeWidth: data.strokeWidth,
              selectable: false,
              evented: false,
            });
            break;
        }

        if (shape) {
          canvas.add(shape);
          set({ currentShape: shape });
        }
        break;
      }
      case "LiveShapeMove": {
        const { currentShape, currentShapeStartX, currentShapeStartY, currentTool } = get();
        if (!currentShape) return;

        const data = action.data as LiveShapeMoveData;
        switch (currentTool.type) {
          case "rectangle":
            const rect = currentShape as Rect;
            rect.set({
              left: Math.min(currentShapeStartX, data.currentX),
              top: Math.min(currentShapeStartY, data.currentY),
              width: Math.abs(data.currentX - currentShapeStartX),
              height: Math.abs(data.currentY - currentShapeStartY),
            });
            break;
          case "circle":
            const circle = currentShape as Circle;
            const radius =
              Math.sqrt(
                Math.pow(data.currentX - currentShapeStartX, 2) + Math.pow(data.currentY - currentShapeStartY, 2),
              ) / 2;
            circle.set({ radius });
            break;
          case "line":
            const line = currentShape as Line;
            line.set({
              x2: data.currentX,
              y2: data.currentY,
            });
            break;
        }
        break;
      }
      case "LiveShapeEnd": {
        set({ currentShape: null });
        break;
      }
    }

    canvas.renderAll();
  },

  rebuildCanvas: () => {
    const { canvas, actions, undoneActions } = get();
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = "#ffffff";

    // Apply all actions except undone ones
    actions.forEach((action) => {
      if (!undoneActions.includes(action.id) && action.type !== "Undo" && action.type !== "Redo") {
        get().applyAction(action);
      }
    });
  },

  createLiveStrokeStartAction: (x, y) => ({
    id: generateActionId(),
    type: "LiveShapeStart" as DrawActionType,
    timestamp: Date.now(),
    data: {
      x: x,
      y: y,
      color: get().currentTool.type === "eraser" ? "#ffffff" : get().currentTool.color,
      width: get().currentTool.width,
      tool: get().currentTool.type === "eraser" ? "eraser" : "brush",
    } as LiveStrokeStartData,
  }),

  createLiveStrokeMoveAction: (x, y) => ({
    id: generateActionId(),
    type: "LiveStrokeMove" as DrawActionType,
    timestamp: Date.now(),
    data: { x: x, y: y } as LiveStrokeMoveData,
  }),

  createLiveStrokeEndAction: () => ({
    id: generateActionId(),
    type: "LiveStrokeEnd" as DrawActionType,
    timestamp: Date.now(),
    data: {} as ActionData,
  }),

  createLiveShapeStartAction: (shapeType, x, y) => ({
    id: generateActionId(),
    type: "LiveShapeStart" as DrawActionType,
    timestamp: Date.now(),
    data: {
      shapeType: shapeType,
      startX: x,
      startY: y,
      color: get().currentTool.color,
      strokeWidth: get().currentTool.width,
    } as LiveShapeStartData,
  }),

  createLiveShapeMoveAction: (x, y) => ({
    id: generateActionId(),
    type: "LiveShapeMove" as DrawActionType,
    timestamp: Date.now(),
    data: { currentX: x, currentY: y } as LiveShapeMoveData,
  }),

  createLiveShapeEndAction: () => ({
    id: generateActionId(),
    type: "LiveShapeEnd" as DrawActionType,
    timestamp: Date.now(),
    data: {} as ActionData,
  }),

  createStrokeAction: (pathData) => ({
    id: generateActionId(),
    type: "Stroke" as DrawActionType,
    timestamp: Date.now(),
    data: {
      path: pathData,
      color: get().currentTool.type === "eraser" ? "#ffffff" : get().currentTool.color,
      width: get().currentTool.width,
      tool: get().currentTool.type === "eraser" ? "eraser" : "brush",
    } as StrokeActionData,
  }),

  createShapeAction: (shapeType, properties) => ({
    id: generateActionId(),
    type: "Shape" as DrawActionType,
    timestamp: Date.now(),
    data: {
      shapeType: shapeType,
      properties: {
        ...properties,
        color: get().currentTool.color,
        strokeWidth: get().currentTool.width,
      },
    } as ShapeActionData,
  }),

  createClearAction: () => ({
    id: generateActionId(),
    type: "Clear" as DrawActionType,
    timestamp: Date.now(),
    data: {} as ActionData,
  }),

  createUndoAction: () => {
    const { actions, undoneActions } = get();
    const availableActions = actions.filter(
      (a) => !undoneActions.includes(a.id) && a.type !== "Undo" && a.type !== "Redo",
    );

    if (availableActions.length === 0) return null;

    const lastAction = availableActions[availableActions.length - 1];
    return {
      id: generateActionId(),
      type: "Undo" as DrawActionType,
      timestamp: Date.now(),
      data: { targetActionId: lastAction.id } as UndoRedoActionData,
    };
  },

  createRedoAction: () => {
    const { undoneActions } = get();
    if (undoneActions.length === 0) return null;

    const lastUndoneId = undoneActions[undoneActions.length - 1];
    return {
      id: generateActionId(),
      type: "Redo" as DrawActionType,
      timestamp: Date.now(),
      data: { targetActionId: lastUndoneId } as UndoRedoActionData,
    };
  },

  // UI methods that return actions for syncing
  undo: () => {
    const action = get().createUndoAction();
    if (action) {
      get().addAction(action);
      get().applyAction(action);
    }
    return action;
  },

  redo: () => {
    const action = get().createRedoAction();
    if (action) {
      get().addAction(action);
      get().applyAction(action);
    }
    return action;
  },

  clearCanvas: () => {
    const action = get().createClearAction();
    get().addAction(action);
    get().applyAction(action);
    return action;
  },

  canUndo: () => {
    const { actions, undoneActions } = get();
    return actions.some((a) => !undoneActions.includes(a.id) && a.type !== "Undo" && a.type !== "Redo");
  },

  canRedo: () => get().undoneActions.length > 0,
}));
