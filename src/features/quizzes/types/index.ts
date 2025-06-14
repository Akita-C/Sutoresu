export type {
  QuizDto,
  QuizSummaryDto,
  QuizSummaryDtoPagedResponse,
  QuizDtoApiResponse,
  QuizDtoIEnumerableApiResponse,
  QuizSummaryDtoIEnumerableApiResponse,
  QuizSummaryDtoPagedResponseApiResponse,
} from "@/lib/api/generated";

export interface QuizFilters {
  search?: string;
  category?: string;
  isPublic?: boolean;
  creatorId?: string;
  sortBy?: string;
  isDescending?: boolean;
}

export interface QuizPaginationParams {
  pageSize?: number;
  cursor?: string;
}

export interface CreateQuizRequest {
  title?: string;
  description?: string;
  thumbnail?: File;
  isPublic?: boolean;
  category?: string;
  tags?: string;
  estimatedDurationMinutes?: number;
}

export interface UpdateQuizRequest {
  title?: string;
  description?: string;
  thumbnail?: File;
  isPublic?: boolean;
  category?: string;
  tags?: string;
  estimatedDurationMinutes?: number;
}
