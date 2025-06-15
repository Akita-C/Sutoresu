"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { OrderingConfig, OrderItem } from "../types";

interface OrderingEditorProps {
  config: OrderingConfig;
  onChange: (config: OrderingConfig) => void;
}

interface SortableOrderItemProps {
  id: string;
  item: OrderItem;
  index: number;
  correctIndex: number;
  onUpdate: (text: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  showNumbers: boolean;
}

function SortableOrderItem({
  id,
  item,
  index,
  correctIndex,
  onUpdate,
  onRemove,
  canRemove,
  showNumbers,
}: SortableOrderItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-3 border rounded-lg bg-background">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {showNumbers && (
        <Badge variant="outline" className="flex-shrink-0 min-w-[2rem] justify-center">
          {correctIndex + 1}
        </Badge>
      )}

      <Input
        value={item.text}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={`Item ${index + 1}`}
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

export function OrderingEditor({ config, onChange }: OrderingEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addItem = () => {
    const newId = `item-${Date.now()}`;
    const newItem: OrderItem = { id: newId, text: "" };
    const newItems = [...config.items, newItem];
    const newCorrectOrder = [...config.correctOrder, newId];

    onChange({
      ...config,
      items: newItems,
      correctOrder: newCorrectOrder,
    });
  };

  const removeItem = (id: string) => {
    const newItems = config.items.filter((item) => item.id !== id);
    const newCorrectOrder = config.correctOrder.filter((itemId) => itemId !== id);

    onChange({
      ...config,
      items: newItems,
      correctOrder: newCorrectOrder,
    });
  };

  const updateItem = (id: string, text: string) => {
    const newItems = config.items.map((item) => (item.id === id ? { ...item, text } : item));
    onChange({ ...config, items: newItems });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = config.correctOrder.findIndex((id) => id === active.id);
    const newIndex = config.correctOrder.findIndex((id) => id === over.id);

    const newCorrectOrder = arrayMove(config.correctOrder, oldIndex, newIndex);
    onChange({ ...config, correctOrder: newCorrectOrder });
  };

  const moveItemUp = (id: string) => {
    const currentIndex = config.correctOrder.findIndex((itemId) => itemId === id);
    if (currentIndex > 0) {
      const newCorrectOrder = [...config.correctOrder];
      [newCorrectOrder[currentIndex], newCorrectOrder[currentIndex - 1]] = [
        newCorrectOrder[currentIndex - 1],
        newCorrectOrder[currentIndex],
      ];
      onChange({ ...config, correctOrder: newCorrectOrder });
    }
  };

  const moveItemDown = (id: string) => {
    const currentIndex = config.correctOrder.findIndex((itemId) => itemId === id);
    if (currentIndex < config.correctOrder.length - 1) {
      const newCorrectOrder = [...config.correctOrder];
      [newCorrectOrder[currentIndex], newCorrectOrder[currentIndex + 1]] = [
        newCorrectOrder[currentIndex + 1],
        newCorrectOrder[currentIndex],
      ];
      onChange({ ...config, correctOrder: newCorrectOrder });
    }
  };

  const randomizeOrder = () => {
    const shuffled = [...config.correctOrder];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    onChange({ ...config, correctOrder: shuffled });
  };

  // Get ordered items based on correctOrder
  const orderedItems = config.correctOrder
    .map((id) => config.items.find((item) => item.id === id))
    .filter((item): item is OrderItem => item !== undefined);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Items (Correct Order)</Label>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={randomizeOrder} disabled={config.items.length < 2}>
            Randomize
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Drag items to reorder them, or use the arrow buttons. The order shown here is the correct answer.
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={config.correctOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {orderedItems.map((item, index) => {
              const correctIndex = config.correctOrder.findIndex((id) => id === item.id);
              return (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItemUp(item.id)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItemDown(item.id)}
                      disabled={index === orderedItems.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <SortableOrderItem
                      id={item.id}
                      item={item}
                      index={index}
                      correctIndex={correctIndex}
                      onUpdate={(text) => updateItem(item.id, text)}
                      onRemove={() => removeItem(item.id)}
                      canRemove={config.items.length > 1}
                      showNumbers={config.showNumbers}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {config.items.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
          <p className="text-sm">No items added yet.</p>
          <p className="text-xs">Add at least 2 items to create an ordering question.</p>
        </div>
      )}

      {/* Settings */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-numbers" className="text-sm">
            Show numbers in preview
          </Label>
          <Switch
            id="show-numbers"
            checked={config.showNumbers}
            onCheckedChange={(checked) => onChange({ ...config, showNumbers: checked })}
          />
        </div>
      </div>

      {/* Validation */}
      {config.items.length > 0 && config.items.length < 2 && (
        <div className="text-sm text-destructive">Please add at least 2 items for an ordering question.</div>
      )}
    </div>
  );
}
