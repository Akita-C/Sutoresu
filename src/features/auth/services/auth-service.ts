import {
  apiClient,
  AuthApi,
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  UserProfileDto,
} from "@/lib/api";
import { ServiceResponse } from "@/lib/types";
import { AxiosError } from "axios";

export class AuthService {
  private authApi: AuthApi;

  constructor() {
    this.authApi = new AuthApi(
      apiClient.getConfiguration(),
      undefined,
      apiClient.getAxiosInstance(),
    );
  }

  async login(
    credentials: LoginRequest,
  ): Promise<ServiceResponse<AuthResponse>> {
    try {
      const response = await this.authApi.apiV1AuthLoginPost(credentials);

      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Login successful",
        };
      }

      return {
        success: false,
        message: response.data.message || "Login failed",
        errors: response.data.errors || [],
      };
    } catch (error) {
      return this.handleError(error, "Login failed");
    }
  }

  async register(
    userData: RegisterRequest,
  ): Promise<ServiceResponse<AuthResponse>> {
    try {
      const response = await this.authApi.apiV1AuthRegisterPost(userData);

      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Registration successful",
        };
      }

      return {
        success: false,
        message: response.data.message || "Registration failed",
        errors: response.data.errors || [],
      };
    } catch (error) {
      return this.handleError(error, "Registration failed");
    }
  }

  async logout(
    accessToken: string,
    refreshToken: string,
  ): Promise<ServiceResponse<boolean>> {
    try {
      const request: LogoutRequest = { accessToken, refreshToken };
      const response = await this.authApi.apiV1AuthLogoutPost(request);

      return {
        success: true,
        data: response.data.data || true,
        message: response.data.message || "Logout successful",
      };
    } catch (error) {
      return this.handleError(error, "Logout failed");
    }
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<ServiceResponse<AuthResponse>> {
    try {
      const request: RefreshTokenRequest = { refreshToken };
      const response = await this.authApi.apiV1AuthRefreshPost(request);

      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Token refreshed successfully",
        };
      }

      return {
        success: false,
        message: response.data.message || "Token refresh failed",
        errors: response.data.errors || [],
      };
    } catch (error) {
      return this.handleError(error, "Token refresh failed");
    }
  }

  async getProfile(): Promise<ServiceResponse<UserProfileDto>> {
    try {
      const response = await this.authApi.apiV1AuthProfileGet();

      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Profile retrieved successfully",
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to get profile",
        errors: response.data.errors || [],
      };
    } catch (error) {
      return this.handleError(error, "Failed to get profile");
    }
  }

  async revokeToken(refreshToken: string): Promise<ServiceResponse<boolean>> {
    try {
      const request: RefreshTokenRequest = { refreshToken };
      const response = await this.authApi.apiV1AuthRevokePost(request);

      return {
        success: true,
        data: response.data.data || true,
        message: response.data.message || "Token revoked successfully",
      };
    } catch (error) {
      return this.handleError(error, "Failed to revoke token");
    }
  }

  async revokeAllTokens(): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.authApi.apiV1AuthRevokeAllPost();

      return {
        success: true,
        data: response.data.data || true,
        message: response.data.message || "All tokens revoked successfully",
      };
    } catch (error) {
      return this.handleError(error, "Failed to revoke all tokens");
    }
  }

  private handleError(
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
}

export const authService = new AuthService();
