import {
  apiClient,
  ChangePasswordRequest,
  ImageResponse,
  UpdateUserProfileRequest,
  UserProfileDto,
  UsersApi,
} from "@/lib/api";
import { BaseService } from "@/lib/services";
import { ServiceResponse } from "@/lib/types";

export class UserService extends BaseService {
  private usersApi: UsersApi;

  constructor() {
    super();
    this.usersApi = new UsersApi(
      apiClient.getConfiguration(),
      undefined,
      apiClient.getAxiosInstance(),
    );
  }

  async getProfile(): Promise<ServiceResponse<UserProfileDto>> {
    try {
      const response = await this.usersApi.apiV1UsersProfileGet();

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Profile retrieved successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to get profile",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get profile");
    }
  }

  async updateProfile(
    request: UpdateUserProfileRequest,
  ): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.usersApi.apiV1UsersProfilePut(request);

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "Profile updated successfully",
      );
    } catch (error) {
      return this.handleError(error, "Failed to update profile");
    }
  }

  async changePassword(
    request: ChangePasswordRequest,
  ): Promise<ServiceResponse<boolean>> {
    try {
      const response =
        await this.usersApi.apiV1UsersChangePasswordPost(request);

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "Password changed successfully",
      );
    } catch (error) {
      return this.handleError(error, "Failed to change password");
    }
  }

  async updateAvatar(avatar: File): Promise<ServiceResponse<ImageResponse>> {
    try {
      const response = await this.usersApi.apiV1UsersAvatarPost(avatar);

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Avatar updated successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to update avatar",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to update avatar");
    }
  }

  async deleteAvatar(): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.usersApi.apiV1UsersAvatarDelete();

      return this.createSuccessResponse(
        response.data.data || true,
        response.data.message || "Avatar deleted successfully",
      );
    } catch (error) {
      return this.handleError(error, "Failed to delete avatar");
    }
  }
}

export const userService = new UserService();
