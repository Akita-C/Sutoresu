"use client";

import { useAuth } from "@/features/auth";
import { UserAvatar } from "@/features/auth/components/user-avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthModal } from "./auth-modal";
import { UserProfileSheet } from "./user-profile-sheet";

export function HomeHeader() {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  const handleLoginClick = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  const handleAvatarClick = () => {
    setShowProfileSheet(true);
  };

  return (
    <>
      {/* Auth Section - Positioned at top right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <button
              onClick={handleAvatarClick}
              className="transition-transform hover:scale-105 cursor-pointer"
            >
              <UserAvatar />
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleLoginClick}
                className="text-sm font-medium bg-white/80 backdrop-blur-sm hover:bg-white/90 cursor-pointer"
              >
                Sign in
              </Button>
              <Button
                variant="outline"
                onClick={handleRegisterClick}
                className="text-sm font-medium bg-white/80 backdrop-blur-sm hover:bg-white/90 cursor-pointer"
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* Profile Sheet */}
      <UserProfileSheet isOpen={showProfileSheet} onClose={() => setShowProfileSheet(false)} />
    </>
  );
}
