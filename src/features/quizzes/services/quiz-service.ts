import {
  QuizzesApi,
  QuizDto,
  QuizSummaryDto,
  QuizSummaryDtoPagedResponse,
} from "@/lib/api/generated";
import { BaseService } from "@/lib/services";
import { ServiceResponse } from "@/lib/types";
import {
  QuizFilters,
  QuizPaginationParams,
  CreateQuizRequest,
  UpdateQuizRequest,
} from "../types";
import { apiClient } from "@/lib/api";

export class QuizService extends BaseService {
  private quizzesApi: QuizzesApi;

  constructor() {
    super();
    this.quizzesApi = new QuizzesApi(
      apiClient.getConfiguration(),
      undefined,
      apiClient.getAxiosInstance(),
    );
  }

  async getQuizzes(
    filters?: QuizFilters,
    pagination?: QuizPaginationParams,
  ): Promise<ServiceResponse<QuizSummaryDtoPagedResponse>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesGet(
        filters?.search,
        filters?.category,
        filters?.isPublic,
        filters?.creatorId,
        filters?.sortBy,
        filters?.isDescending,
        pagination?.pageSize,
        pagination?.cursor,
      );

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Quizzes retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get quizzes",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get quizzes");
    }
  }

  async getQuizById(id: string): Promise<ServiceResponse<QuizDto>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesIdGet(id);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Quiz retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Quiz not found",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get quiz");
    }
  }

  async getMyQuizzes(): Promise<ServiceResponse<QuizSummaryDto[]>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesMyGet();

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Your quizzes retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get your quizzes",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get your quizzes");
    }
  }

  async getPublicQuizzes(
    limit?: number,
  ): Promise<ServiceResponse<QuizSummaryDto[]>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesPublicGet(limit);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Public quizzes retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get public quizzes",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get public quizzes");
    }
  }

  async searchQuizzes(
    query: string,
    limit?: number,
  ): Promise<ServiceResponse<QuizSummaryDto[]>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesSearchGet(
        query,
        limit,
      );

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Search completed successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Search failed",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Search failed");
    }
  }

  async getCategoryCounts(): Promise<ServiceResponse<Record<string, number>>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesCategoriesCountsGet();

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Category counts retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get category counts",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get category counts");
    }
  }

  async getQuizzesByCategory(
    category: string,
    limit?: number,
  ): Promise<ServiceResponse<QuizSummaryDto[]>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesCategoryCategoryGet(
        category,
        limit,
      );

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Category quizzes retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get category quizzes",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get category quizzes");
    }
  }

  async createQuiz(
    quizData: CreateQuizRequest,
  ): Promise<ServiceResponse<QuizDto>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesPost(
        quizData.title,
        quizData.description,
        quizData.thumbnail,
        quizData.isPublic,
        quizData.category,
        quizData.tags,
        quizData.estimatedDurationMinutes,
      );

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Quiz created successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to create quiz",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to create quiz");
    }
  }

  async updateQuiz(
    id: string,
    quizData: UpdateQuizRequest,
  ): Promise<ServiceResponse<QuizDto>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesIdPut(
        id,
        quizData.title,
        quizData.description,
        quizData.thumbnail,
        quizData.isPublic,
        quizData.category,
        quizData.tags,
        quizData.estimatedDurationMinutes,
      );

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Quiz updated successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to update quiz",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to update quiz");
    }
  }

  async deleteQuiz(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesIdDelete(id);

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "Quiz deleted successfully",
      );
    } catch (error) {
      return this.handleError(error, "Failed to delete quiz");
    }
  }

  async batchDeleteQuizzes(ids: string[]): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesBatchDelete(ids);

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "Quizzes deleted successfully",
      );
    } catch (error) {
      return this.handleError(error, "Failed to delete quizzes");
    }
  }

  async batchGetQuizzes(ids: string[]): Promise<ServiceResponse<QuizDto[]>> {
    try {
      const response = await this.quizzesApi.apiV1QuizzesBatchPost(ids);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Quizzes retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get quizzes",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get quizzes");
    }
  }
}

export const quizService = new QuizService();
