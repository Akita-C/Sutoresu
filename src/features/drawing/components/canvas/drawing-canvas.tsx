"use client";

import { Ref, useEffect, useImperativeHandle, useRef } from "react";
import { useDrawingStore } from "../../stores/drawing-store";
import { useShallow } from "zustand/react/shallow";
import { Canvas, PencilBrush } from "fabric";
import { useThrottledCallback } from "use-debounce";
import { DrawAction } from "../../types";
import { useDrawGameStore } from "../../stores/draw-game-store";
import { useAuthStore } from "@/features/auth";

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  onActionEmit?: (action: DrawAction) => void;
  ref?: Ref<DrawingCanvasRef>;
}

export interface DrawingCanvasRef {
  applyExternalAction: (action: DrawAction) => void;
}

export function DrawingCanvas({
  width = 800,
  height = 600,
  className = "",
  onActionEmit,
  // onLiveActionEmit,
  ref,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const canDraw =
    useAuthStore.getState().user?.id === useDrawGameStore.getState().currentDrawerId &&
    useDrawGameStore.getState().phase === "drawing";

  const {
    canvas,
    currentTool,
    setCanvas,
    // isDrawing,
    setIsDrawing,
    addAction,
    createStrokeAction,
    // createShapeAction,
    applyAction,
  } = useDrawingStore(
    useShallow((state) => ({
      canvas: state.canvas,
      currentTool: state.currentTool,
      setCanvas: state.setCanvas,
      isDrawing: state.isDrawing,
      setIsDrawing: state.setIsDrawing,
      addAction: state.addAction,
      createStrokeAction: state.createStrokeAction,
      createShapeAction: state.createShapeAction,
      applyAction: state.applyAction,
    })),
  );

  useImperativeHandle(
    ref,
    () => ({
      applyExternalAction: (action: DrawAction) => {
        if (action.type.startsWith("Live")) {
          // applyLiveAction(action);
        } else {
          addAction(action);
          applyAction(action);
        }
      },
    }),
    [addAction, applyAction],
  );

  const throttledActionEmit = useThrottledCallback(
    (action: DrawAction) => {
      if (onActionEmit) {
        onActionEmit(action);
      }
    },
    100,
    { leading: true, trailing: true },
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const fabricCanvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
      selection: false,
      skipOffscreen: false,
    });

    fabricCanvasRef.current = fabricCanvas;
    setCanvas(fabricCanvas);

    // Handle stroke completion
    fabricCanvas.on("path:created", (e) => {
      // Do this way because can get the latest state of the store and does not trigger useEffect
      if (
        e.path &&
        useAuthStore.getState().user?.id === useDrawGameStore.getState().currentDrawerId &&
        useDrawGameStore.getState().phase === "drawing"
      ) {
        const pathData = JSON.stringify(e.path.toDatalessObject());
        const action = createStrokeAction(pathData);
        addAction(action);
        throttledActionEmit(action);

        // const endAction = createLiveStrokeEndAction();
        // throttledLiveActionEmit(endAction);
      }
    });

    fabricCanvas.on("mouse:down", () => {
      // Do this way because can get the latest state of the store and does not trigger useEffect
      if (
        useAuthStore.getState().user?.id !== useDrawGameStore.getState().currentDrawerId ||
        useDrawGameStore.getState().phase !== "drawing"
      )
        return;

      setIsDrawing(true);
    });

    fabricCanvas.on("mouse:up", () => {
      // Do this way because still can get the latest state of the store and does not trigger useEffect
      if (
        useAuthStore.getState().user?.id !== useDrawGameStore.getState().currentDrawerId ||
        useDrawGameStore.getState().phase !== "drawing"
      )
        return;

      setIsDrawing(false);
    });

    return () => {
      fabricCanvas.dispose();
    };
  }, [width, height, setCanvas, addAction, createStrokeAction, setIsDrawing]);

  // Update canvas settings when tool changes
  useEffect(() => {
    if (!canvas) return;

    // Disable selection for all objects
    canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });

    if (canDraw) {
      switch (currentTool.type) {
        case "brush":
          canvas.isDrawingMode = true;
          if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new PencilBrush(canvas);
          }
          canvas.freeDrawingBrush.color = currentTool.color;
          canvas.freeDrawingBrush.width = currentTool.width;
          canvas.selection = false;
          break;

        case "eraser":
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush = new PencilBrush(canvas);
          canvas.freeDrawingBrush.width = currentTool.width;
          canvas.freeDrawingBrush.color = "#ffffff";
          canvas.selection = false;
          break;

        default:
          canvas.isDrawingMode = false;
          canvas.selection = false;
          break;
      }
    } else {
      canvas.isDrawingMode = false;
      canvas.selection = false;
    }

    canvas.renderAll();
  }, [canvas, currentTool.type, currentTool.color, currentTool.width, canDraw]);

  // Handle real-time brush/eraser updates
  // useEffect(() => {
  //   if (!canvas || (currentTool.type !== "brush" && currentTool.type !== "eraser")) return;

  //   const handleMouseMove = (options: TPointerEventInfo<TPointerEvent>) => {
  //     if (!canvas.isDrawingMode || !isDrawing) return;

  //     const pointer = canvas.getScenePoint(options.e);
  //     const moveAction = createLiveStrokeMoveAction(pointer.x, pointer.y);
  //     throttledLiveActionEmit(moveAction);
  //   };

  //   canvas.on("mouse:move", handleMouseMove);

  //   return () => {
  //     canvas.off("mouse:move", handleMouseMove);
  //   };
  // }, [canvas, currentTool.type, createLiveStrokeMoveAction, throttledLiveActionEmit, isDrawing]);

  // Handle real-time shape drawing
  // useEffect(() => {
  //   if (!canvas || currentTool.type === "brush" || currentTool.type === "eraser") return;

  //   let isDown = false;
  //   let origX = 0;
  //   let origY = 0;
  //   let shape: FabricObject | null = null;

  //   const handleMouseDown = (options: TPointerEventInfo<TPointerEvent>) => {
  //     isDown = true;
  //     const pointer = canvas.getScenePoint(options.e);
  //     origX = pointer.x;
  //     origY = pointer.y;

  //     const startAction = createLiveShapeStartAction(currentTool.type as ShapeActionData["shapeType"], origX, origY);
  //     throttledLiveActionEmit(startAction);

  //     // Create local shape for immediate feedback
  //     switch (currentTool.type) {
  //       case "rectangle":
  //         shape = new Rect({
  //           left: origX,
  //           top: origY,
  //           width: 0,
  //           height: 0,
  //           fill: "transparent",
  //           stroke: currentTool.color,
  //           strokeWidth: currentTool.width,
  //           selectable: false,
  //           evented: false,
  //         });
  //         break;
  //       case "circle":
  //         shape = new Circle({
  //           left: origX,
  //           top: origY,
  //           radius: 0,
  //           fill: "transparent",
  //           stroke: currentTool.color,
  //           strokeWidth: currentTool.width,
  //           selectable: false,
  //           evented: false,
  //         });
  //         break;
  //       case "line":
  //         shape = new Line([origX, origY, origX, origY], {
  //           stroke: currentTool.color,
  //           strokeWidth: currentTool.width,
  //           selectable: false,
  //           evented: false,
  //         });
  //         break;
  //     }

  //     if (shape) {
  //       canvas.add(shape);
  //     }
  //   };

  //   const handleMouseMove = (options: TPointerEventInfo<TPointerEvent>) => {
  //     if (!isDown || !shape) return;

  //     const pointer = canvas.getScenePoint(options.e);

  //     const moveAction = createLiveShapeMoveAction(pointer.x, pointer.y);
  //     throttledLiveActionEmit(moveAction);

  //     // Update local shape for immediate feedback
  //     switch (currentTool.type) {
  //       case "rectangle":
  //         const rect = shape as Rect;
  //         rect.set({
  //           left: Math.min(origX, pointer.x),
  //           top: Math.min(origY, pointer.y),
  //           width: Math.abs(pointer.x - origX),
  //           height: Math.abs(pointer.y - origY),
  //         });
  //         break;
  //       case "circle":
  //         const circle = shape as Circle;
  //         const radius = Math.sqrt(Math.pow(pointer.x - origX, 2) + Math.pow(pointer.y - origY, 2)) / 2;
  //         circle.set({ radius });
  //         break;
  //       case "line":
  //         const line = shape as Line;
  //         line.set({ x2: pointer.x, y2: pointer.y });
  //         break;
  //     }

  //     canvas.renderAll();
  //   };

  //   const handleMouseUp = () => {
  //     if (!isDown || !shape) return;

  //     // const endAction = createLiveShapeEndAction();
  //     // throttledLiveActionEmit(endAction);

  //     // Create final shape action for history
  //     const properties: ShapeActionData["properties"] = {
  //       left: origX,
  //       top: origY,
  //       color: currentTool.color,
  //       strokeWidth: currentTool.width,
  //     };

  //     switch (currentTool.type) {
  //       case "rectangle":
  //         const rect = shape as Rect;
  //         properties.width = rect.width;
  //         properties.height = rect.height;
  //         if (rect.left !== origX) properties.left = rect.left;
  //         if (rect.top !== origY) properties.top = rect.top;
  //         break;
  //       case "circle":
  //         const circle = shape as Circle;
  //         properties.radius = circle.radius;
  //         break;
  //       case "line":
  //         const line = shape as Line;
  //         properties.x1 = origX;
  //         properties.y1 = origY;
  //         properties.x2 = line.x2;
  //         properties.y2 = line.y2;
  //         break;
  //     }
  //     const action = createShapeAction(currentTool.type as ShapeActionData["shapeType"], properties);
  //     addAction(action);
  //     throttledActionEmit(action);

  //     isDown = false;
  //     shape = null;
  //   };

  //   canvas.on("mouse:down", handleMouseDown);
  //   canvas.on("mouse:move", handleMouseMove);
  //   canvas.on("mouse:up", handleMouseUp);

  //   return () => {
  //     canvas.off("mouse:down", handleMouseDown);
  //     canvas.off("mouse:move", handleMouseMove);
  //     canvas.off("mouse:up", handleMouseUp);
  //   };
  // }, [
  //   canvas,
  //   currentTool,
  //   addAction,
  //   createShapeAction,
  //   createLiveShapeStartAction,
  //   createLiveShapeMoveAction,
  //   createLiveShapeEndAction,
  //   throttledLiveActionEmit,
  //   throttledActionEmit,
  // ]);

  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
