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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { SortableOptionItem } from "./sortable-option-item";
import { MultipleChoiceConfig } from "../types";

interface MultipleChoiceEditorProps {
  config: MultipleChoiceConfig;
  onChange: (config: MultipleChoiceConfig) => void;
}

export function MultipleChoiceEditor({ config, onChange }: MultipleChoiceEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addOption = () => {
    const newConfig = {
      ...config,
      options: [...config.options, { text: "" }],
    };
    onChange(newConfig);
  };

  const removeOption = (index: number) => {
    const newOptions = config.options.filter((_, i) => i !== index);
    const newCorrectAnswers = config.correctAnswerIndices
      .filter((idx) => idx !== index)
      .map((idx) => (idx > index ? idx - 1 : idx));

    onChange({
      ...config,
      options: newOptions,
      correctAnswerIndices: newCorrectAnswers,
    });
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...config.options];
    newOptions[index] = { ...newOptions[index], text };
    onChange({ ...config, options: newOptions });
  };

  const toggleCorrectAnswer = (index: number) => {
    let newCorrectAnswers: number[];

    if (config.allowMultipleSelection) {
      newCorrectAnswers = config.correctAnswerIndices.includes(index)
        ? config.correctAnswerIndices.filter((i) => i !== index)
        : [...config.correctAnswerIndices, index];
    } else {
      newCorrectAnswers = config.correctAnswerIndices.includes(index) ? [] : [index];
    }

    onChange({ ...config, correctAnswerIndices: newCorrectAnswers });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = config.options.findIndex((_, index) => index.toString() === active.id);
    const newIndex = config.options.findIndex((_, index) => index.toString() === over.id);

    const newOptions = arrayMove(config.options, oldIndex, newIndex);

    // Update correct answer indices after reordering
    const newCorrectAnswers = config.correctAnswerIndices.map((correctIndex) => {
      if (correctIndex === oldIndex) return newIndex;
      if (correctIndex === newIndex) return oldIndex;
      if (oldIndex < newIndex && correctIndex > oldIndex && correctIndex <= newIndex) return correctIndex - 1;
      if (oldIndex > newIndex && correctIndex >= newIndex && correctIndex < oldIndex) return correctIndex + 1;
      return correctIndex;
    });

    onChange({
      ...config,
      options: newOptions,
      correctAnswerIndices: newCorrectAnswers,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Options</Label>
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={config.options.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {config.options.map((option, index) => (
              <SortableOptionItem
                key={index}
                id={index.toString()}
                index={index}
                option={option}
                isCorrect={config.correctAnswerIndices.includes(index)}
                onToggleCorrect={() => toggleCorrectAnswer(index)}
                onUpdateText={(text) => updateOption(index, text)}
                onRemove={() => removeOption(index)}
                canRemove={config.options.length > 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="grid grid-cols-1 gap-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="multiple-selection" className="text-sm">
            Allow multiple selection
          </Label>
          <Switch
            id="multiple-selection"
            checked={config.allowMultipleSelection}
            onCheckedChange={(checked) => onChange({ ...config, allowMultipleSelection: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="shuffle-options" className="text-sm">
            Shuffle options for students
          </Label>
          <Switch
            id="shuffle-options"
            checked={config.shuffleOptions}
            onCheckedChange={(checked) => onChange({ ...config, shuffleOptions: checked })}
          />
        </div>
      </div>

      {config.correctAnswerIndices.length === 0 && (
        <div className="text-sm text-destructive">Please select at least one correct answer.</div>
      )}
    </div>
  );
}
