import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateQuizRequest, UpdateQuizRequest } from "../types";
import { quizService } from "../services/quiz-service";
import { toast } from "sonner";

export const useCreateQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizData: CreateQuizRequest) =>
      quizService.createQuiz(quizData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success(response.message || "Quiz created successfully!");

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["quizzes"] });
        queryClient.invalidateQueries({ queryKey: ["quizzes", "my"] });
      } else {
        toast.error(response.message || "Failed to create quiz");
      }
    },
    onError: (error) => {
      toast.error("Failed to create quiz");
      console.error("Create quiz error:", error);
    },
  });
};

export const useUpdateQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      quizData,
    }: {
      id: string;
      quizData: UpdateQuizRequest;
    }) => quizService.updateQuiz(id, quizData),
    onSuccess: (response, { id }) => {
      if (response.success && response.data) {
        toast.success(response.message || "Quiz updated successfully!");

        // Invalidate specific queries
        queryClient.invalidateQueries({ queryKey: ["quiz", id] });
        queryClient.invalidateQueries({ queryKey: ["quizzes"] });
        queryClient.invalidateQueries({ queryKey: ["quizzes", "my"] });
      } else {
        toast.error(response.message || "Failed to update quiz");
      }
    },
    onError: (error) => {
      toast.error("Failed to update quiz");
      console.error("Update quiz error:", error);
    },
  });
};

export const useDeleteQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quizService.deleteQuiz(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success(response.message || "Quiz deleted successfully!");

        // Invalidate queries and remove specific quiz
        queryClient.invalidateQueries({ queryKey: ["quizzes"] });
        queryClient.invalidateQueries({ queryKey: ["quizzes", "my"] });
        queryClient.removeQueries({ queryKey: ["quiz", id] });
      } else {
        toast.error(response.message || "Failed to delete quiz");
      }
    },
    onError: (error) => {
      toast.error("Failed to delete quiz");
      console.error("Delete quiz error:", error);
    },
  });
};

export const useBatchDeleteQuizzesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => quizService.batchDeleteQuizzes(ids),
    onSuccess: (response, ids) => {
      if (response.success) {
        toast.success(response.message || "Quizzes deleted successfully!");

        // Invalidate queries and remove specific quizzes
        queryClient.invalidateQueries({ queryKey: ["quizzes"] });
        queryClient.invalidateQueries({ queryKey: ["quizzes", "my"] });
        ids.forEach((id) => {
          queryClient.removeQueries({ queryKey: ["quiz", id] });
        });
      } else {
        toast.error(response.message || "Failed to delete quizzes");
      }
    },
    onError: (error) => {
      toast.error("Failed to delete quizzes");
      console.error("Batch delete quizzes error:", error);
    },
  });
};
