"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Brush, Eraser, Minus, Square, Circle, Undo2, Redo2, Trash2, Palette } from "lucide-react";
import { useDrawingStore } from "../stores/drawing-store";
import { useShallow } from "zustand/react/shallow";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const COLORS = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ffa500",
  "#800080",
  "#ffc0cb",
  "#a52a2a",
  "#808080",
  "#000080",
  "#008000",
];

const TOOLS = [
  { type: "brush" as const, icon: Brush, label: "Brush" },
  { type: "eraser" as const, icon: Eraser, label: "Eraser" },
  { type: "line" as const, icon: Minus, label: "Line" },
  { type: "rectangle" as const, icon: Square, label: "Rectangle" },
  { type: "circle" as const, icon: Circle, label: "Circle" },
];

export function DrawingToolbar() {
  const { currentTool, setTool, undo, redo, clearCanvas, canUndo, canRedo } = useDrawingStore(
    useShallow((state) => ({
      currentTool: state.currentTool,
      setTool: state.setTool,
      undo: state.undo,
      redo: state.redo,
      clearCanvas: state.clearCanvas,
      canUndo: state.canUndo(),
      canRedo: state.canRedo(),
    })),
  );

  return (
    <div className="flex items-center gap-2 p-4 bg-card/50 border border-border rounded-lg">
      {/* Tools */}
      <div className="flex items-center gap-1">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.type}
              variant={currentTool.type === tool.type ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool({ type: tool.type })}
              title={tool.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: currentTool.color }} />
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-5 gap-1">
            {COLORS.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => setTool({ color })}
                title={color}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-8" />

      {/* Brush Size */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <span className="text-sm text-muted-foreground">Size:</span>
        <Slider
          value={[currentTool.width]}
          onValueChange={([width]) => setTool({ width })}
          min={1}
          max={50}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-6 text-right">{currentTool.width}</span>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo} title="Undo">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo} title="Redo">
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={clearCanvas} title="Clear Canvas">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
