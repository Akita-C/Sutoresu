"use client";

import { useState, useRef } from "react";
import { Loader2, UploadIcon, TrashIcon, CameraIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  useUpdateAvatarMutation,
  useDeleteAvatarMutation,
} from "@/features/users";
import { UserProfileDto } from "@/lib/api";
import { getInitials } from "@/lib/utils";

interface AvatarUploadFormProps {
  user: UserProfileDto;
}

export function AvatarUploadForm({ user }: AvatarUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateAvatarMutation = useUpdateAvatarMutation();
  const deleteAvatarMutation = useDeleteAvatarMutation();

  const initials = getInitials(user.name || "");
  const currentAvatarUrl =
    user.avatarTransformations?.medium || user.avatarUrl || "";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await updateAvatarMutation.mutateAsync(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAvatarMutation.mutateAsync();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Avatar deletion failed:", error);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isUploading = updateAvatarMutation.isPending;
  const isDeleting = deleteAvatarMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={previewUrl || currentAvatarUrl}
              alt={user.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-white text-2xl font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isDeleting}
          >
            <CameraIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Recommended: Square image, at least 300x300 pixels
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum file size: 5MB
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadError && (
        <Alert variant="destructive">
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {updateAvatarMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {updateAvatarMutation.error.message || "Failed to upload avatar"}
          </AlertDescription>
        </Alert>
      )}

      {deleteAvatarMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {deleteAvatarMutation.error.message || "Failed to delete avatar"}
          </AlertDescription>
        </Alert>
      )}

      {selectedFile && (
        <div className="flex gap-2 justify-center">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="min-w-[100px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      )}

      {currentAvatarUrl && !selectedFile && (
        <div className="flex justify-center">
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <TrashIcon className="mr-2 h-4 w-4" />
                Remove Avatar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Avatar</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove your profile picture? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Remove"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
