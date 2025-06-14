import {
  QuestionsApi,
  QuestionDto,
  QuestionDtoPagedResponse,
  BulkCreateQuestionsRequest,
  BulkCreateQuestionsResponse,
  UpdateQuestionBulkItem,
} from "@/lib/api/generated";
import { BaseService } from "@/lib/services";
import { ServiceResponse } from "@/lib/types";
import {
  QuestionFilters,
  QuestionPaginationParams,
  CreateQuestionRequest,
  BulkCreateQuestionData,
  UpdateQuestionRequest,
} from "../types";
import { apiClient } from "@/lib/api";

export class QuestionService extends BaseService {
  private questionsApi: QuestionsApi;

  constructor() {
    super();
    this.questionsApi = new QuestionsApi(
      apiClient.getConfiguration(),
      undefined,
      apiClient.getAxiosInstance(),
    );
  }

  async getQuestions(
    filters?: QuestionFilters,
    pagination?: QuestionPaginationParams,
  ): Promise<ServiceResponse<QuestionDtoPagedResponse>> {
    try {
      const response = await this.questionsApi.apiV1QuestionsGet(
        filters?.quizId,
        filters?.search,
        filters?.questionType,
        filters?.sortBy,
        filters?.isDescending,
        pagination?.pageSize,
        pagination?.cursor,
      );

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Questions retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get questions",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get questions");
    }
  }

  async getQuestionById(id: string): Promise<ServiceResponse<QuestionDto>> {
    try {
      const response = await this.questionsApi.apiV1QuestionsIdGet(id);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Question retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Question not found",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get question");
    }
  }

  async getQuestionsByQuizId(
    quizId: string,
  ): Promise<ServiceResponse<QuestionDto[]>> {
    try {
      const response =
        await this.questionsApi.apiV1QuestionsQuizQuizIdGet(quizId);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Quiz questions retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get quiz questions",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get quiz questions");
    }
  }

  async createQuestion(
    questionData: CreateQuestionRequest,
  ): Promise<ServiceResponse<QuestionDto>> {
    try {
      const response = await this.questionsApi.apiV1QuestionsPost(
        questionData.content,
        questionData.questionType,
        questionData.timeLimitInSeconds,
        questionData.points,
        questionData.image,
        questionData.configuration,
        questionData.explanation,
        questionData.quizId,
      );

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Question created successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to create question",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to create question");
    }
  }

  async updateQuestion(
    id: string,
    questionData: UpdateQuestionRequest,
  ): Promise<ServiceResponse<QuestionDto>> {
    try {
      const response = await this.questionsApi.apiV1QuestionsIdPut(
        id,
        questionData.content ?? undefined,
        questionData.questionType,
        questionData.timeLimitInSeconds,
        questionData.points,
        questionData.image ?? undefined,
        questionData.configuration ?? undefined,
        questionData.explanation ?? undefined,
      );

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Question updated successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to update question",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to update question");
    }
  }

  async deleteQuestion(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.questionsApi.apiV1QuestionsIdDelete(id);

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "Question deleted successfully",
      );
    } catch (error) {
      return this.handleError(error, "Failed to delete question");
    }
  }

  async bulkCreateQuestions(
    data: BulkCreateQuestionData,
  ): Promise<ServiceResponse<BulkCreateQuestionsResponse>> {
    try {
      const request: BulkCreateQuestionsRequest = {
        quizId: data.quizId,
        questions: data.questions,
      };

      const response = await this.questionsApi.apiV1QuestionsBulkPost(request);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Questions created successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to create questions",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to create questions");
    }
  }

  async batchDeleteQuestions(ids: string[]): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.questionsApi.apiV1QuestionsBatchDelete(ids);

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "Questions deleted successfully",
      );
    } catch (error) {
      return this.handleError(error, "Failed to delete questions");
    }
  }

  async batchUpdateQuestions(
    updates: UpdateQuestionBulkItem[],
  ): Promise<ServiceResponse<QuestionDto[]>> {
    try {
      const response = await this.questionsApi.apiV1QuestionsBatchPut(updates);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Questions updated successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to update questions",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to update questions");
    }
  }

  async batchGetQuestionsByQuizzes(
    quizIds: string[],
  ): Promise<ServiceResponse<QuestionDto[]>> {
    try {
      const response =
        await this.questionsApi.apiV1QuestionsBatchByQuizzesPost(quizIds);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Questions retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get questions",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get questions");
    }
  }

  async getQuestionCounts(
    quizIds: string[],
  ): Promise<ServiceResponse<Record<string, number>>> {
    try {
      const response =
        await this.questionsApi.apiV1QuestionsBatchCountsPost(quizIds);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Question counts retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get question counts",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get question counts");
    }
  }
}

export const questionService = new QuestionService();
