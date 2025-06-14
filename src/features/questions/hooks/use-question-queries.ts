import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { questionService } from "../services/question-service";
import { QuestionFilters, QuestionPaginationParams } from "../types";

export const useQuestion = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => questionService.getQuestionById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useQuestions = (
  filters?: QuestionFilters,
  pagination?: QuestionPaginationParams,
) => {
  return useInfiniteQuery({
    queryKey: ["questions", filters],
    queryFn: ({ pageParam }) =>
      questionService.getQuestions(filters, {
        ...pagination,
        cursor: pageParam || undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.success && lastPage.data?.hasNextPage) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useQuestionsByQuiz = (quizId: string, enabled = true) => {
  return useQuery({
    queryKey: ["questions", "quiz", quizId],
    queryFn: () => questionService.getQuestionsByQuizId(quizId),
    enabled: enabled && !!quizId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useBatchQuestionsByQuizzes = (
  quizIds: string[],
  enabled = true,
) => {
  return useQuery({
    queryKey: ["questions", "batch", "quizzes", quizIds],
    queryFn: () => questionService.batchGetQuestionsByQuizzes(quizIds),
    enabled: enabled && quizIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useQuestionCounts = (quizIds: string[], enabled = true) => {
  return useQuery({
    queryKey: ["questions", "counts", quizIds],
    queryFn: () => questionService.getQuestionCounts(quizIds),
    enabled: enabled && quizIds.length > 0,
    staleTime: 1000 * 60 * 10,
  });
};
