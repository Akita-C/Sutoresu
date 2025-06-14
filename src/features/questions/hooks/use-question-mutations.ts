import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateQuestionRequest,
  UpdateQuestionRequest,
  BulkCreateQuestionData,
  UpdateQuestionBulkItem,
} from "../types";
import { questionService } from "../services/question-service";
import { toast } from "sonner";

export const useCreateQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionData: CreateQuestionRequest) =>
      questionService.createQuestion(questionData),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        toast.success(response.message || "Question created successfully!");

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        if (variables.quizId) {
          queryClient.invalidateQueries({
            queryKey: ["questions", "quiz", variables.quizId],
          });
          queryClient.invalidateQueries({
            queryKey: ["quiz", variables.quizId],
          }); // Update quiz question count
        }
      } else {
        toast.error(response.message || "Failed to create question");
      }
    },
    onError: (error) => {
      toast.error("Failed to create question");
      console.error("Create question error:", error);
    },
  });
};

export const useUpdateQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      questionData,
    }: {
      id: string;
      questionData: UpdateQuestionRequest;
    }) => questionService.updateQuestion(id, questionData),
    onSuccess: (response, { id }) => {
      if (response.success && response.data) {
        toast.success(response.message || "Question updated successfully!");

        // Invalidate specific queries
        queryClient.invalidateQueries({ queryKey: ["question", id] });
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        if (response.data.quizId) {
          queryClient.invalidateQueries({
            queryKey: ["questions", "quiz", response.data.quizId],
          });
        }
      } else {
        toast.error(response.message || "Failed to update question");
      }
    },
    onError: (error) => {
      toast.error("Failed to update question");
      console.error("Update question error:", error);
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionService.deleteQuestion(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success(response.message || "Question deleted successfully!");

        // Invalidate queries and remove specific question
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        queryClient.removeQueries({ queryKey: ["question", id] });

        // Note: We don't know the quizId here, so we invalidate all quiz questions
        queryClient.invalidateQueries({ queryKey: ["questions", "quiz"] });
        queryClient.invalidateQueries({ queryKey: ["quiz"] }); // Update question counts
      } else {
        toast.error(response.message || "Failed to delete question");
      }
    },
    onError: (error) => {
      toast.error("Failed to delete question");
      console.error("Delete question error:", error);
    },
  });
};

export const useBulkCreateQuestionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateQuestionData) =>
      questionService.bulkCreateQuestions(data),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        const { successCount, failureCount } = response.data;

        if (failureCount && failureCount > 0) {
          toast.warning(
            `Created ${successCount} questions. ${failureCount} failed.`,
          );
        } else {
          toast.success(
            response.message ||
              `Successfully created ${successCount} questions!`,
          );
        }

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        queryClient.invalidateQueries({
          queryKey: ["questions", "quiz", variables.quizId],
        });
        queryClient.invalidateQueries({ queryKey: ["quiz", variables.quizId] });
      } else {
        toast.error(response.message || "Failed to create questions");
      }
    },
    onError: (error) => {
      toast.error("Failed to create questions");
      console.error("Bulk create questions error:", error);
    },
  });
};

export const useBatchDeleteQuestionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => questionService.batchDeleteQuestions(ids),
    onSuccess: (response, ids) => {
      if (response.success) {
        toast.success(response.message || "Questions deleted successfully!");

        // Invalidate queries and remove specific questions
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        ids.forEach((id) => {
          queryClient.removeQueries({ queryKey: ["question", id] });
        });

        // Update all quiz questions since we don't know which quizzes these belong to
        queryClient.invalidateQueries({ queryKey: ["questions", "quiz"] });
        queryClient.invalidateQueries({ queryKey: ["quiz"] });
      } else {
        toast.error(response.message || "Failed to delete questions");
      }
    },
    onError: (error) => {
      toast.error("Failed to delete questions");
      console.error("Batch delete questions error:", error);
    },
  });
};

export const useBatchUpdateQuestionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UpdateQuestionBulkItem[]) =>
      questionService.batchUpdateQuestions(updates),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        toast.success(response.message || "Questions updated successfully!");

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["questions"] });

        // Invalidate specific questions
        variables.forEach((update) => {
          if (update.questionId) {
            queryClient.invalidateQueries({
              queryKey: ["question", update.questionId],
            });
          }
        });

        // Update quiz questions based on returned data
        const quizIds = new Set(
          response.data.map((q) => q.quizId).filter(Boolean),
        );
        quizIds.forEach((quizId) => {
          if (quizId) {
            queryClient.invalidateQueries({
              queryKey: ["questions", "quiz", quizId],
            });
          }
        });
      } else {
        toast.error(response.message || "Failed to update questions");
      }
    },
    onError: (error) => {
      toast.error("Failed to update questions");
      console.error("Batch update questions error:", error);
    },
  });
};
