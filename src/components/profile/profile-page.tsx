"use client";

import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MailIcon, ShieldIcon, UserIcon } from "lucide-react";
import { ProfileEditForm } from "./profile-edit-form";
import { AvatarUploadForm } from "./avatar-upload-form";
import { PasswordChangeForm } from "./password-change-form";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { getInitials, formatDate } from "@/lib/utils";

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.name || "");
  const avatarUrl = user.avatarTransformations?.medium || user.avatarUrl || "";

  return (
    <AuthGuard
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              Please log in to view your profile.
            </p>
          </div>
        </div>
      }
    >
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={avatarUrl}
                      alt={user.name || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-white text-lg font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{user.name || "User"}</CardTitle>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="capitalize">
                    {user.role || "user"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <span className="text-xs text-muted-foreground">
                      Joined
                    </span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>

                {user.lastLoginAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Last Login
                      </span>
                      <span>{formatDate(user.lastLoginAt)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings Tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="avatar">Avatar</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileEditForm user={user} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="avatar" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AvatarUploadForm user={user} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PasswordChangeForm />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
