"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LocalQuestion } from "./types";
import { GripVertical, MoreVertical, Edit, Trash2, Clock, Trophy } from "lucide-react";
import * as utils from "./utils";

interface QuestionsListProps {
  questions: LocalQuestion[];
  onEdit: (question: LocalQuestion) => void;
  onDelete: (questionId: string) => void;
}

export function QuestionsList({ questions, onEdit, onDelete }: QuestionsListProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <GripVertical className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
        <p className="text-muted-foreground">Add your first question to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <SortableQuestionItem key={question.id} question={question} index={index} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

interface SortableQuestionItemProps {
  question: LocalQuestion;
  index: number;
  onEdit: (question: LocalQuestion) => void;
  onDelete: (questionId: string) => void;
}

function SortableQuestionItem({ question, index, onEdit, onDelete }: SortableQuestionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group transition-all duration-200 ${
        isDragging ? "shadow-lg scale-105 rotate-1" : ""
      } ${question.isNew ? "border-green-200 bg-green-50/30" : ""} ${
        question.isModified ? "border-blue-200 bg-blue-50/30" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Question Number */}
          <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${utils.getQuestionTypeColor(question.questionType)}`}
              >
                {utils.getQuestionTypeLabel(question.questionType)}
              </div>

              {question.isNew && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  New
                </Badge>
              )}

              {question.isModified && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Modified
                </Badge>
              )}
            </div>

            <p className="text-sm font-medium line-clamp-2 mb-2">{question.content || "Untitled Question"}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{question.timeLimitInSeconds}s</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>{question.points} pts</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(question)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(question.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
