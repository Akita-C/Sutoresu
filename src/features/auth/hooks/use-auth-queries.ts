import { useQuery } from "@tanstack/react-query";
import { useAuth, useAuthActions } from "../stores/auth-store";
import { authService } from "../services/auth-service";

export const useProfileQuery = () => {
  const { isAuthenticated } = useAuth();
  const { setUser, clearAuth } = useAuthActions();

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await authService.getProfile();

      if (response.success && response.data) {
        setUser(response.data);
        return response.data;
      }

      throw new Error(response.message || "Failed to get profile");
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (
        error instanceof Error &&
        error.message.includes("401") &&
        error.message.includes("403")
      ) {
        clearAuth();
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
