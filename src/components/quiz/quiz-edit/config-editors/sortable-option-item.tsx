"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Trash2 } from "lucide-react";
import { Option } from "../types";

interface SortableOptionItemProps {
  id: string;
  index: number;
  option: Option;
  isCorrect: boolean;
  onToggleCorrect: () => void;
  onUpdateText: (text: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function SortableOptionItem({
  id,
  index,
  option,
  isCorrect,
  onToggleCorrect,
  onUpdateText,
  onRemove,
  canRemove,
}: SortableOptionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-2 border rounded-lg bg-background">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <Checkbox checked={isCorrect} onCheckedChange={onToggleCorrect} className="flex-shrink-0" />

      <span className="text-sm text-muted-foreground w-6">{String.fromCharCode(65 + index)}</span>

      <Input
        value={option.text}
        onChange={(e) => onUpdateText(e.target.value)}
        placeholder={`Option ${String.fromCharCode(65 + index)}`}
        className="flex-1"
      />

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="flex-shrink-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
