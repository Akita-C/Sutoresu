import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user-service";
import { useAuthActions } from "@/features/auth/stores/auth-store";
import { toast } from "sonner";
import { UpdateUserProfileRequest, ChangePasswordRequest } from "@/lib/api";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateUserProfileRequest) =>
      userService.updateProfile(request),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Update profile error:", error);
    },
  });
};

export const useChangePasswordMutation = () => {
  const { clearAuth } = useAuthActions();

  return useMutation({
    mutationFn: (request: ChangePasswordRequest) =>
      userService.changePassword(request),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          response.message ||
            "Password changed successfully. Please login again.",
        );
        // Clear auth after password change for security
        clearAuth();
      } else {
        toast.error(response.message || "Failed to change password");
      }
    },
    onError: (error) => {
      toast.error("Failed to change password");
      console.error("Change password error:", error);
    },
  });
};

export const useUpdateAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatar: File) => userService.updateAvatar(avatar),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Avatar updated successfully");
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      } else {
        toast.error(response.message || "Failed to update avatar");
      }
    },
    onError: (error) => {
      toast.error("Failed to update avatar");
      console.error("Update avatar error:", error);
    },
  });
};

export const useDeleteAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.deleteAvatar(),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Avatar deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      } else {
        toast.error(response.message || "Failed to delete avatar");
      }
    },
    onError: (error) => {
      toast.error("Failed to delete avatar");
      console.error("Delete avatar error:", error);
    },
  });
};
