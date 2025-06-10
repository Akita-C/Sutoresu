import {
  apiClient,
  AuthApi,
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "@/lib/api";
import { BaseService } from "@/lib/services";
import { ServiceResponse } from "@/lib/types";

export class AuthService extends BaseService {
  private authApi: AuthApi;

  constructor() {
    super();
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
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Login successful",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Login failed",
        response.data.errors || [],
      );
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
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Registration successful",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Registration failed",
        response.data.errors || [],
      );
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

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "Logout successful",
      );
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
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Token refreshed successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Token refresh failed",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Token refresh failed");
    }
  }

  async revokeToken(refreshToken: string): Promise<ServiceResponse<boolean>> {
    try {
      const request: RefreshTokenRequest = { refreshToken };
      const response = await this.authApi.apiV1AuthRevokePost(request);

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "Token revoked successfully",
      );
    } catch (error) {
      return this.handleError(error, "Failed to revoke token");
    }
  }

  async revokeAllTokens(): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.authApi.apiV1AuthRevokeAllPost();

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "All tokens revoked successfully",
      );
    } catch (error) {
      return this.handleError(error, "Failed to revoke all tokens");
    }
  }
}

export const authService = new AuthService();
