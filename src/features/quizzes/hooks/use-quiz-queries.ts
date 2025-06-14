import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { quizService } from "../services/quiz-service";
import { QuizFilters, QuizPaginationParams } from "../types";

export const useQuiz = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["quiz", id],
    queryFn: () => quizService.getQuizById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useQuizzes = (
  filters?: QuizFilters,
  pagination?: QuizPaginationParams,
) => {
  return useInfiniteQuery({
    queryKey: ["quizzes", filters],
    queryFn: ({ pageParam }) =>
      quizService.getQuizzes(filters, {
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
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useMyQuizzes = () => {
  return useQuery({
    queryKey: ["quizzes", "my"],
    queryFn: () => quizService.getMyQuizzes(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePublicQuizzes = (limit?: number) => {
  return useQuery({
    queryKey: ["quizzes", "public", limit],
    queryFn: () => quizService.getPublicQuizzes(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useQuizSearch = (
  query: string,
  limit?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["quizzes", "search", query, limit],
    queryFn: () => quizService.searchQuizzes(query, limit),
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCategoryCounts = () => {
  return useQuery({
    queryKey: ["quizzes", "categories", "counts"],
    queryFn: () => quizService.getCategoryCounts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useQuizzesByCategory = (
  category: string,
  limit?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["quizzes", "category", category, limit],
    queryFn: () => quizService.getQuizzesByCategory(category, limit),
    enabled: enabled && !!category,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBatchQuizzes = (ids: string[], enabled = true) => {
  return useQuery({
    queryKey: ["quizzes", "batch", ids],
    queryFn: () => quizService.batchGetQuizzes(ids),
    enabled: enabled && ids.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
