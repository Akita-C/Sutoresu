import { CreateQuestionItem } from "@/lib/api";

// Re-export types from generated API
export type {
  QuestionDto,
  CreateQuestionItem,
  UpdateQuestionRequest,
  UpdateQuestionBulkItem,
  BulkCreateQuestionsRequest,
  BulkCreateQuestionsResponse,
  QuestionCreationError,
  QuestionType,
  QuestionDtoPagedResponse,
  QuestionDtoApiResponse,
  QuestionDtoIEnumerableApiResponse,
  QuestionDtoPagedResponseApiResponse,
  BulkCreateQuestionsResponseApiResponse,
} from "@/lib/api/generated";

// Custom types for question management
export interface QuestionFilters {
  quizId?: string;
  search?: string;
  questionType?: import("@/lib/api/generated").QuestionType;
  sortBy?: string;
  isDescending?: boolean;
}

export interface QuestionPaginationParams {
  pageSize?: number;
  cursor?: string;
}

export interface CreateQuestionRequest {
  content?: string;
  questionType?: import("@/lib/api/generated").QuestionType;
  timeLimitInSeconds?: number;
  points?: number;
  image?: File;
  configuration?: string;
  explanation?: string;
  quizId?: string;
}

export interface BulkCreateQuestionData {
  quizId: string;
  questions: CreateQuestionItem[];
}
