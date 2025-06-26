export type DrawAction = {
  id: string;
  type: DrawActionType;
  timestamp: number;
  data: ActionData;
};

export type DrawActionType = "Stroke" | "Shape" | "Clear" | "Undo" | "Redo";

export type ActionData = StrokeActionData | ShapeActionData | UndoRedoActionData;

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
