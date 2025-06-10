"use client";

import { ReactNode } from "react";
import { useAuth } from "../stores/auth-store";
import { useProfileQuery } from "@/features/users";

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({
  children,
  fallback,
  requireAuth = true,
}: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth();

  const { isLoading: isProfileLoading } = useProfileQuery();

  if (!requireAuth) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (isProfileLoading || !user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
