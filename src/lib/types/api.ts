export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export type ErrorResponse = ServiceResponse<never>;

export enum ApiErrorType {
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN = "UNKNOWN",
}

export interface ExtendedServiceResponse<T = unknown>
  extends ServiceResponse<T> {
  errorType?: ApiErrorType;
  statusCode?: number;
}
