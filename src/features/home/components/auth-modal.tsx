"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const handleModeToggle = () => {
    onModeChange(mode === "login" ? "register" : "login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === "login" ? "Sign in" : "Sign up"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mode === "login" ? (
            <LoginForm onSuccess={onClose} />
          ) : (
            <RegisterForm onSuccess={() => onModeChange("login")} />
          )}

          <div className="text-center">
            <Button
              variant="link"
              onClick={handleModeToggle}
              className="text-sm cursor-pointer text-muted-foreground"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
