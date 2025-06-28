export type DrawAction = {
  id: string;
  type: DrawActionType;
  timestamp: number;
  data: ActionData;
};

export type DrawActionType =
  | "Stroke"
  | "Shape"
  | "Clear"
  | "Undo"
  | "Redo"
  | "LiveStrokeStart"
  | "LiveStrokeMove"
  | "LiveStrokeEnd"
  | "LiveShapeStart"
  | "LiveShapeMove"
  | "LiveShapeEnd";

export type ActionData =
  | StrokeActionData
  | ShapeActionData
  | UndoRedoActionData
  | LiveStrokeStartData
  | LiveStrokeMoveData
  | LiveShapeStartData
  | LiveShapeMoveData;

export interface LiveStrokeStartData {
  x: number;
  y: number;
  color: string;
  width: number;
  tool: "brush" | "eraser";
}

export interface LiveStrokeMoveData {
  x: number;
  y: number;
}

export interface LiveShapeStartData {
  shapeType: "rectangle" | "circle" | "line";
  startX: number;
  startY: number;
  color: string;
  strokeWidth: number;
}

export interface LiveShapeMoveData {
  currentX: number;
  currentY: number;
}

export interface StrokeActionData {
  path: string;
  color: string;
  width: number;
  tool: "brush" | "eraser";
}

export interface ShapeActionData {
  shapeType: "rectangle" | "circle" | "line";
  properties: {
    left: number;
    top: number;
    width?: number; // for rectangle
    height?: number; // for rectangle
    radius?: number; // for circle
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number; // for line
    color: string;
    strokeWidth: number;
  };
}

export interface UndoRedoActionData {
  targetActionId: string;
}
