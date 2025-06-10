import { AxiosError } from "axios";
import { ServiceResponse } from "../types";

export abstract class BaseService {
  protected handleError(
    error: unknown,
    defaultMessage: string,
  ): ServiceResponse<never> {
    if (error instanceof AxiosError) {
      const response = error.response?.data;

      return {
        success: false,
        message: response?.message || error.message || defaultMessage,
        errors: response?.errors || [error.message || defaultMessage],
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || defaultMessage,
        errors: [error.message || defaultMessage],
      };
    }

    return {
      success: false,
      message: defaultMessage,
      errors: [defaultMessage],
    };
  }

  protected createSuccessResponse<T>(
    data: T,
    message: string,
  ): ServiceResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  protected createErrorResponse(
    message: string,
    errors: string[],
  ): ServiceResponse<never> {
    return {
      success: false,
      message,
      errors: errors || [message],
    };
  }
}
