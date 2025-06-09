import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthActions } from "../stores/auth-store";
import { LoginRequest, RegisterRequest } from "../types";
import { authService } from "../services/auth-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { setAuth, clearAuth } = useAuthActions();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;

        if (accessToken && refreshToken && user) {
          setAuth({ user, accessToken, refreshToken });
          toast.success("Welcome back!");
          queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
          router.push("/dashboard");
        }
      } else {
        clearAuth();
        toast.error(response.message || "Login failed");
      }
    },
    onError: (error) => {
      clearAuth();
      toast.error("Login failed");
      console.error("Login error:", error);
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const { setAuth, clearAuth } = useAuthActions();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        if (user && accessToken && refreshToken) {
          setAuth({ user, accessToken, refreshToken });
          toast.success("Account created successfully!");
          queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        }
      } else {
        clearAuth();
        toast.error(response.message || "Registration failed");
      }
    },
    onError: (error) => {
      clearAuth();
      toast.error("Registration failed");
      console.error("Registration error:", error);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthActions();

  return useMutation({
    mutationFn: ({
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    }) => authService.logout(accessToken, refreshToken),
    onSuccess: () => {
      clearAuth();

      // Clear all queries
      queryClient.clear();

      toast.success("Logout successful");
    },
    onError: (error) => {
      // Clear auth even if API call fails
      clearAuth();
      queryClient.clear();

      toast.error("Logout completed");
      console.error("Logout error:", error);
    },
  });
};

export const useRefreshTokenMutation = () => {
  const { updateTokens, clearAuth } = useAuthActions();

  return useMutation({
    mutationFn: (refreshToken: string) =>
      authService.refreshToken(refreshToken),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { accessToken, refreshToken } = response.data;

        if (accessToken && refreshToken) {
          updateTokens(accessToken, refreshToken);
        }
      } else {
        clearAuth();
      }
    },
    onError: () => {
      clearAuth();
    },
  });
};

export const useRevokeTokenMutation = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => authService.revokeToken(refreshToken),
    onSuccess: (response) => {
      toast.success(response.message || "Token revoked successfully");
    },
    onError: (error) => {
      toast.error("Failed to revoke token");
      console.error("Revoke token error:", error);
    },
  });
};

export const useRevokeAllTokensMutation = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthActions();

  return useMutation({
    mutationFn: () => authService.revokeAllTokens(),
    onSuccess: (response) => {
      clearAuth();
      queryClient.clear();

      toast.success(response.message || "All tokens revoked successfully");
    },
    onError: (error) => {
      toast.error("Failed to revoke all tokens");
      console.error("Revoke all tokens error:", error);
    },
  });
};
