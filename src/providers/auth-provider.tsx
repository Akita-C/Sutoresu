"use client";

import { useAuthStore } from "@/features/auth/stores/auth-store";
import { apiClient } from "@/lib/api";
import { PropsWithChildren, useEffect } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Setup token interceptor
  useEffect(() => {
    const interceptor = apiClient.getAxiosInstance().interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      apiClient.getAxiosInstance().interceptors.request.eject(interceptor);
    };
  }, [accessToken]);

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener("api:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("api:unauthorized", handleUnauthorized);
  }, [clearAuth]);

  return <>{children}</>;
}
