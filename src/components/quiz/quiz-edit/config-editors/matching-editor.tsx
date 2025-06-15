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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GripVertical, Plus, Trash2, Link } from "lucide-react";
import { MatchingConfig, MatchItem, MatchPair } from "../types";

interface MatchingEditorProps {
  config: MatchingConfig;
  onChange: (config: MatchingConfig) => void;
}

interface SortableMatchItemProps {
  id: string;
  item: MatchItem;
  onUpdate: (text: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  side: "left" | "right";
}

function SortableMatchItem({ id, item, onUpdate, onRemove, canRemove, side }: SortableMatchItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const placeholderText = side === "left" ? "Left item" : "Right item";

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-3 border rounded-lg bg-background">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <Input
        value={item.text}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={placeholderText}
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

export function MatchingEditor({ config, onChange }: MatchingEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addLeftItem = () => {
    const newId = `left-${Date.now()}`;
    const newItem: MatchItem = { id: newId, text: "" };
    onChange({
      ...config,
      leftItems: [...config.leftItems, newItem],
    });
  };

  const addRightItem = () => {
    const newId = `right-${Date.now()}`;
    const newItem: MatchItem = { id: newId, text: "" };
    onChange({
      ...config,
      rightItems: [...config.rightItems, newItem],
    });
  };

  const removeLeftItem = (id: string) => {
    const newLeftItems = config.leftItems.filter((item) => item.id !== id);
    const newMatches = config.correctMatches.filter((match) => match.leftId !== id);

    onChange({
      ...config,
      leftItems: newLeftItems,
      correctMatches: newMatches,
    });
  };

  const removeRightItem = (id: string) => {
    const newRightItems = config.rightItems.filter((item) => item.id !== id);
    const newMatches = config.correctMatches.filter((match) => match.rightId !== id);

    onChange({
      ...config,
      rightItems: newRightItems,
      correctMatches: newMatches,
    });
  };

  const updateLeftItem = (id: string, text: string) => {
    const newLeftItems = config.leftItems.map((item) => (item.id === id ? { ...item, text } : item));
    onChange({ ...config, leftItems: newLeftItems });
  };

  const updateRightItem = (id: string, text: string) => {
    const newRightItems = config.rightItems.map((item) => (item.id === id ? { ...item, text } : item));
    onChange({ ...config, rightItems: newRightItems });
  };

  const addMatch = () => {
    if (config.leftItems.length > 0 && config.rightItems.length > 0) {
      const newMatch: MatchPair = {
        leftId: config.leftItems[0].id,
        rightId: config.rightItems[0].id,
      };
      onChange({
        ...config,
        correctMatches: [...config.correctMatches, newMatch],
      });
    }
  };

  const removeMatch = (index: number) => {
    const newMatches = config.correctMatches.filter((_, i) => i !== index);
    onChange({ ...config, correctMatches: newMatches });
  };

  const updateMatch = (index: number, leftId?: string, rightId?: string) => {
    const newMatches = config.correctMatches.map((match, i) =>
      i === index
        ? {
            leftId: leftId || match.leftId,
            rightId: rightId || match.rightId,
          }
        : match,
    );
    onChange({ ...config, correctMatches: newMatches });
  };

  const handleLeftDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = config.leftItems.findIndex((item) => item.id === active.id);
    const newIndex = config.leftItems.findIndex((item) => item.id === over.id);

    const newLeftItems = arrayMove(config.leftItems, oldIndex, newIndex);
    onChange({ ...config, leftItems: newLeftItems });
  };

  const handleRightDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = config.rightItems.findIndex((item) => item.id === active.id);
    const newIndex = config.rightItems.findIndex((item) => item.id === over.id);

    const newRightItems = arrayMove(config.rightItems, oldIndex, newIndex);
    onChange({ ...config, rightItems: newRightItems });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Left Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addLeftItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLeftDragEnd}>
            <SortableContext items={config.leftItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {config.leftItems.map((item) => (
                  <SortableMatchItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    onUpdate={(text) => updateLeftItem(item.id, text)}
                    onRemove={() => removeLeftItem(item.id)}
                    canRemove={config.leftItems.length > 1}
                    side="left"
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Right Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addRightItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleRightDragEnd}>
            <SortableContext items={config.rightItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {config.rightItems.map((item) => (
                  <SortableMatchItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    onUpdate={(text) => updateRightItem(item.id, text)}
                    onRemove={() => removeRightItem(item.id)}
                    canRemove={config.rightItems.length > 1}
                    side="right"
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Correct Matches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">Correct Matches</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMatch}
            disabled={config.leftItems.length === 0 || config.rightItems.length === 0}
          >
            <Link className="h-4 w-4 mr-1" />
            Add Match
          </Button>
        </div>

        <div className="space-y-2">
          {config.correctMatches.map((match, index) => {
            return (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                <Select value={match.leftId} onValueChange={(value) => updateMatch(index, value, undefined)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select left item" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.leftItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.text || `Item ${item.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-muted-foreground">
                  <Link className="h-4 w-4" />
                </div>

                <Select value={match.rightId} onValueChange={(value) => updateMatch(index, undefined, value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select right item" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.rightItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.text || `Item ${item.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMatch(index)}
                  className="flex-shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {config.correctMatches.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
            No matches defined. Add some matches to complete the question.
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="shuffle-items" className="text-sm">
            Shuffle items for students
          </Label>
          <Switch
            id="shuffle-items"
            checked={config.shuffleItems}
            onCheckedChange={(checked) => onChange({ ...config, shuffleItems: checked })}
          />
        </div>
      </div>

      {/* Validation Messages */}
      {config.leftItems.length === 0 && (
        <div className="text-sm text-destructive">Please add at least one left item.</div>
      )}
      {config.rightItems.length === 0 && (
        <div className="text-sm text-destructive">Please add at least one right item.</div>
      )}
      {config.correctMatches.length === 0 && config.leftItems.length > 0 && config.rightItems.length > 0 && (
        <div className="text-sm text-destructive">Please define at least one correct match.</div>
      )}
    </div>
  );
}
