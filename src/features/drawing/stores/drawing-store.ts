import { create } from "zustand";
import { Canvas, Circle, Line, Path, Rect } from "fabric";
import {
  ActionData,
  DrawAction,
  DrawActionType,
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
      shapeType,
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
