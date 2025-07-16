"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MailIcon, ShieldIcon, UserIcon } from "lucide-react";
import {
  useAuth,
  useLogoutMutation,
  useAuthTokens,
  useRevokeAllTokensMutation,
} from "@/features/auth";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { AvatarUploadForm } from "@/components/profile/avatar-upload-form";
import { PasswordChangeForm } from "@/components/profile/password-change-form";
import { getInitials, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

interface UserProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileSheet({ isOpen, onClose }: UserProfileSheetProps) {
  const { user } = useAuth();
  const { accessToken, refreshToken } = useAuthTokens();
  const logoutMutation = useLogoutMutation();
  const revokeAllTokensMutation = useRevokeAllTokensMutation();

  if (!user) return null;

  const initials = getInitials(user.name || "");
  const avatarUrl = user.avatarTransformations?.medium || user.avatarUrl || "";

  const handleLogout = async () => {
    if (accessToken && refreshToken) {
      await logoutMutation.mutateAsync({ accessToken, refreshToken });
      onClose();
    }
  };

  const handleRevokeAllTokens = async () => {
    await revokeAllTokensMutation.mutateAsync();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-card/60">
        <SheetHeader>
          <SheetTitle>Profile Settings</SheetTitle>
          <SheetDescription>Manage your account information and preferences.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Overview */}
          <Card className="bg-card/40">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="size-20">
                  <AvatarImage src={avatarUrl} alt={user.name || "User"} className="object-cover" />
                  <AvatarFallback className="bg-primary text-white text-lg font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-lg">{user.name || "User"}</CardTitle>
              <div className="flex justify-center">
                <Badge variant="secondary" className="capitalize">
                  {user.role || "user"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <ShieldIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {user.isEmailVerified ? (
                    <Badge variant="default" className="text-xs">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Unverified
                    </Badge>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Joined</span>
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>

              {user.lastLoginAt && (
                <div className="flex items-center gap-3 text-sm">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Last Login</span>
                    <span>{formatDate(user.lastLoginAt)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Settings Tabs */}
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-card/40">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="avatar">Avatar</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="danger" className="text-red-400 data-[state=active]:text-red-400">
                Danger
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-4">
              <Card className="bg-card/40">
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileEditForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="avatar" className="mt-4">
              <Card className="bg-card/40">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvatarUploadForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <Card className="bg-card/40">
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <PasswordChangeForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="danger" className="mt-4">
              <Card className="bg-card/40">
                <CardHeader>
                  <CardTitle className="text-red-400 dark:text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Log out of your account</p>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="w-full cursor-pointer"
                    >
                      {logoutMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Revoke all login sessions on all devices
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleRevokeAllTokens}
                        disabled={revokeAllTokensMutation.isPending}
                        className="w-full border-red-200 text-red-400 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-4ed-950 cursor-pointer"
                      >
                        {revokeAllTokensMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Revoking sessions...
                          </>
                        ) : (
                          <>
                            <ShieldIcon className="mr-2 h-4 w-4" />
                            Revoke all login sessions
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
