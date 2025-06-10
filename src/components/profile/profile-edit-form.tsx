"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useUpdateProfileMutation } from "@/features/users";
import { UserProfileDto } from "@/lib/api";

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
});

type ProfileFormSchema = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  user: UserProfileDto;
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const updateProfileMutation = useUpdateProfileMutation();

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
    },
  });

  const onSubmit = async (data: ProfileFormSchema) => {
    try {
      setSuccessMessage(null);
      await updateProfileMutation.mutateAsync({
        name: data.name.trim(),
      });
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const isDirty = form.formState.isDirty;
  const isSubmitting = updateProfileMutation.isPending;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {updateProfileMutation.error && (
            <Alert variant="destructive">
              <AlertDescription>
                {updateProfileMutation.error.message ||
                  "Failed to update profile"}
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Email Address</FormLabel>
            <Input value={user.email || ""} disabled className="bg-muted" />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed. Contact support if you need to update
              your email address.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
