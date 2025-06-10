import { useAuth, useAuthActions } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user-service";

export const useProfileQuery = () => {
  const { isAuthenticated } = useAuth();
  const { setUser } = useAuthActions();

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await userService.getProfile();

      if (response.success && response.data) {
        setUser(response.data);
        return response.data;
      }

      throw new Error(response.message || "Failed to get profile");
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
