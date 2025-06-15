"use client";

import { useEffect, useRef } from "react";
import { useDrawingStore } from "../stores/drawing-store";
import { useShallow } from "zustand/react/shallow";
import { Canvas, Circle, Line, Rect, PencilBrush, TPointerEvent, TPointerEventInfo, FabricObject } from "fabric";

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export function DrawingCanvas({ width = 800, height = 600, className = "" }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  const { canvas, currentTool, setCanvas, setIsDrawing, addToHistory } = useDrawingStore(
    useShallow((state) => ({
      canvas: state.canvas,
      currentTool: state.currentTool,
      setCanvas: state.setCanvas,
      setIsDrawing: state.setIsDrawing,
      addToHistory: state.addToHistory,
    })),
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

    // Add initial state to history
    addToHistory(JSON.stringify(fabricCanvas.toJSON()));

    // Event listeners for history
    fabricCanvas.on("path:created", () => {
      setTimeout(() => {
        addToHistory(JSON.stringify(fabricCanvas.toJSON()));
      }, 10);
    });

    fabricCanvas.on("mouse:down", () => setIsDrawing(true));
    fabricCanvas.on("mouse:up", () => setIsDrawing(false));

    return () => {
      fabricCanvas.dispose();
    };
  }, [width, height, setCanvas, addToHistory, setIsDrawing]);

  // Update canvas settings when tool changes
  useEffect(() => {
    if (!canvas) return;

    // Disable selection for all objects
    canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });

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

    canvas.renderAll();
  }, [canvas, currentTool.type, currentTool.color, currentTool.width]);

  // Handle shape drawing
  useEffect(() => {
    if (!canvas || currentTool.type === "brush" || currentTool.type === "eraser") return;

    let isDown = false;
    let origX = 0;
    let origY = 0;
    let shape: FabricObject | null = null;

    const handleMouseDown = (options: TPointerEventInfo<TPointerEvent>) => {
      isDown = true;
      const pointer = canvas.getScenePoint(options.e);
      origX = pointer.x;
      origY = pointer.y;

      switch (currentTool.type) {
        case "rectangle":
          shape = new Rect({
            left: origX,
            top: origY,
            width: 0,
            height: 0,
            fill: "transparent",
            stroke: currentTool.color,
            strokeWidth: currentTool.width,
            selectable: false,
            evented: false,
            hoverCursor: "default",
            moveCursor: "default",
          });
          break;

        case "circle":
          shape = new Circle({
            left: origX,
            top: origY,
            radius: 0,
            fill: "transparent",
            stroke: currentTool.color,
            strokeWidth: currentTool.width,
            selectable: false,
            evented: false,
            hoverCursor: "default",
            moveCursor: "default",
          });
          break;

        case "line":
          shape = new Line([origX, origY, origX, origY], {
            stroke: currentTool.color,
            strokeWidth: currentTool.width,
            selectable: false,
            evented: false,
            hoverCursor: "default",
            moveCursor: "default",
          });
          break;
      }

      if (shape) {
        canvas.add(shape);
      }
    };

    const handleMouseMove = (options: TPointerEventInfo<TPointerEvent>) => {
      if (!isDown || !shape) return;

      const pointer = canvas.getScenePoint(options.e);

      switch (currentTool.type) {
        case "rectangle":
          const rect = shape as Rect;
          rect.set({
            width: Math.abs(pointer.x - origX),
            height: Math.abs(pointer.y - origY),
          });
          if (pointer.x < origX) rect.set({ left: pointer.x });
          if (pointer.y < origY) rect.set({ top: pointer.y });
          break;

        case "circle":
          const circle = shape as Circle;
          const radius = Math.sqrt(Math.pow(pointer.x - origX, 2) + Math.pow(pointer.y - origY, 2)) / 2;
          circle.set({ radius });
          break;

        case "line":
          const line = shape as Line;
          line.set({ x2: pointer.x, y2: pointer.y });
          break;
      }

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (isDown && shape) {
        // Add to history only when shape drawing is complete
        setTimeout(() => {
          addToHistory(JSON.stringify(canvas.toJSON()));
        }, 10);
      }
      isDown = false;
      shape = null;
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [canvas, currentTool, addToHistory]);

  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
