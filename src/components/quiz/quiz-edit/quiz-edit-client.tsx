"use client";

import { useState, useTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Save, ArrowLeft } from "lucide-react";

import { useQuiz } from "@/features/quizzes/hooks";
import { useBulkCreateQuestionsMutation } from "@/features/questions/hooks";

import { QuizEditForm } from "./quiz-edit-form";
import { QuestionsList } from "./questions-list";
import { CreateQuestionDialog } from "./create-question-dialog";
import { QuestionEditor } from "./question-editor";
import { LocalQuestion } from "./types";
import * as utils from "./utils";

interface QuizEditClientProps {
  quizId: string;
}

export function QuizEditClient({ quizId }: QuizEditClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local state
  const [localQuestions, setLocalQuestions] = useState<LocalQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<LocalQuestion | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Optimistic updates
  const [optimisticQuestions, addOptimisticQuestion] = useOptimistic(
    localQuestions,
    (state, newQuestion: LocalQuestion) => [...state, newQuestion],
  );

  // API hooks
  const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(quizId);
  const bulkCreateMutation = useBulkCreateQuestionsMutation();

  // Drag & drop setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Event handlers
  const handleAddQuestion = (questionData: Partial<LocalQuestion>) => {
    const newQuestion = utils.createNewQuestion(questionData, localQuestions.length);

    startTransition(() => {
      addOptimisticQuestion(newQuestion);
      setLocalQuestions((prev) => [...prev, newQuestion]);
    });

    setCreateDialogOpen(false);
    toast.success("Question added successfully!");
  };

  const handleEditQuestion = (question: LocalQuestion) => {
    setEditingQuestion(question);
  };

  const handleUpdateQuestion = (updatedQuestion: LocalQuestion) => {
    setLocalQuestions((prev) => utils.updateQuestionInList(prev, updatedQuestion));
    setEditingQuestion(null);
    toast.success("Question updated successfully!");
  };

  const handleDeleteQuestion = (questionId: string) => {
    setLocalQuestions((prev) => utils.removeQuestionFromList(prev, questionId));
    toast.success("Question deleted successfully!");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({
          ...item,
          order: index,
          isModified: !item.isNew,
        }));
      });
    }
  };

  const handleBatchCreate = () => {
    const questionsToCreate = utils.getChangedQuestions(localQuestions);

    if (questionsToCreate.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    const bulkRequest = utils.prepareBulkRequest(quizId, questionsToCreate);

    startTransition(() => {
      bulkCreateMutation.mutate(bulkRequest, {
        onSuccess: (response) => {
          if (response.success) {
            toast.success(`Successfully processed ${response.data?.successCount || 0} questions!`);
            setLocalQuestions((prev) => utils.resetQuestionStates(prev));
          } else {
            toast.error("Some questions failed to create. Please check and try again.");
          }
        },
        onError: (error) => {
          toast.error("Failed to save questions. Please try again.");
          console.error("Bulk create error:", error);
        },
      });
    });
  };

  const handleGoBack = () => {
    const hasUnsavedChanges = utils.getChangedQuestions(localQuestions).length > 0;

    if (hasUnsavedChanges) {
      const confirmed = confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmed) return;
    }

    startTransition(() => {
      router.push(`/quizzes/${quizId}`);
    });
  };

  // Computed values
  const changedQuestionsCount = utils.getChangedQuestions(localQuestions).length;

  // Loading state
  if (isLoadingQuiz) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  // Error state
  if (!quiz?.data) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Quiz not found</h2>
          <p className="text-muted-foreground mb-4">The quiz you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Quizzes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Quiz</h1>
            <p className="text-muted-foreground">{quiz.data.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {changedQuestionsCount > 0 && <Badge variant="secondary">{changedQuestionsCount} unsaved changes</Badge>}
          <Button
            onClick={handleBatchCreate}
            disabled={changedQuestionsCount === 0 || isPending || bulkCreateMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {bulkCreateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quiz Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <QuizEditForm quiz={quiz.data} />
            </CardContent>
          </Card>
        </div>

        {/* Questions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Questions ({optimisticQuestions.length})</CardTitle>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext items={optimisticQuestions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                  <QuestionsList
                    questions={optimisticQuestions}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <CreateQuestionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSubmit={handleAddQuestion} />

      {editingQuestion && (
        <QuestionEditor
          question={editingQuestion}
          onSave={handleUpdateQuestion}
          onCancel={() => setEditingQuestion(null)}
        />
      )}
    </div>
  );
}
