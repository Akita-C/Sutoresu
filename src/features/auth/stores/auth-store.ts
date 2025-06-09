"use client";

import { UserProfileDto } from "../types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

export interface AuthState {
  // State
  isAuthenticated: boolean;
  user: UserProfileDto | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  setAuth: (data: {
    user: UserProfileDto;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setUser: (user: UserProfileDto) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,

        // Actions
        setAuth: (data) => {
          set({
            isAuthenticated: true,
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
        },
        setUser: (user) => {
          set({ user });
        },
        updateTokens: (accessToken, refreshToken) => {
          set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        },
        clearAuth: () => {
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      },
    ),
    { name: "auth-store" },
  ),
);

export const useAuth = () =>
  useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
    })),
  );

export const useAuthActions = () =>
  useAuthStore(
    useShallow((state) => ({
      setAuth: state.setAuth,
      setUser: state.setUser,
      updateTokens: state.updateTokens,
      clearAuth: state.clearAuth,
    })),
  );

export const useAuthTokens = () =>
  useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    })),
  );
