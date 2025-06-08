"use client";

import { authService } from "@/features/auth";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { apiClient } from "@/lib/api";
import { PropsWithChildren, useEffect, useRef } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  const {
    accessToken,
    refreshToken,
    isAuthenticated,
    updateTokens,
    clearAuth,
  } = useAuthStore();

  // Prevent multiple concurrent refresh attempts
  const isRefreshing = useRef(false);
  const failedQueue = useRef<
    Array<{
      resolve: (token: string) => void;
      reject: (error: Error) => void;
    }>
  >([]);

  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.current.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });

    failedQueue.current = [];
  };

  useEffect(() => {
    const requestInterceptor = apiClient
      .getAxiosInstance()
      .interceptors.request.use(
        (config) => {
          if (accessToken && isAuthenticated) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error),
      );

    return () => {
      apiClient
        .getAxiosInstance()
        .interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    const responseInterceptor = apiClient
      .getAxiosInstance()
      .interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing.current) {
              // Nếu đang refresh, đưa request vào queue
              return new Promise((resolve, reject) => {
                failedQueue.current.push({ resolve, reject });
              })
                .then((token) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  return apiClient.getAxiosInstance()(originalRequest);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing.current = true;

            if (refreshToken) {
              try {
                const refreshResult =
                  await authService.refreshToken(refreshToken);

                if (refreshResult.success && refreshResult.data) {
                  const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                  } = refreshResult.data;

                  // Ensure tokens exist before proceeding
                  if (newAccessToken && newRefreshToken) {
                    // Update tokens in store
                    updateTokens(newAccessToken, newRefreshToken);

                    // Process queued requests
                    processQueue(null, newAccessToken);

                    // Retry original request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient.getAxiosInstance()(originalRequest);
                  } else {
                    // Invalid token response
                    processQueue(new Error("Invalid token response"), null);
                    clearAuth();
                  }
                } else {
                  // Refresh failed
                  processQueue(new Error("Token refresh failed"), null);
                  clearAuth();
                }
              } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                processQueue(new Error("Token refresh failed"), null);
                clearAuth();
              } finally {
                isRefreshing.current = false;
              }
            } else {
              // No refresh token
              isRefreshing.current = false;
              clearAuth();
            }

            // Return rejected promise để tránh request tiếp tục
            return Promise.reject(error);
          }

          return Promise.reject(error);
        },
      );

    return () => {
      apiClient
        .getAxiosInstance()
        .interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken, updateTokens, clearAuth]);

  return <>{children}</>;
}
