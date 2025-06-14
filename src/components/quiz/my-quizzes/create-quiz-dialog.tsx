"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BookOpen, Upload, X } from "lucide-react";
import { useCreateQuizMutation } from "@/features/quizzes/hooks";
import { CreateQuizRequest } from "@/features/quizzes/types";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/types/common";

const createQuizSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  isPublic: z.boolean(),
  category: z.string().optional(),
  tags: z.string().optional(),
  estimatedDurationMinutes: z.number().min(1, "Duration must be at least 1 minute").optional(),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported",
    )
    .optional(),
});

type CreateQuizFormData = z.infer<typeof createQuizSchema>;

interface CreateQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateQuizDialog({ open, onOpenChange }: CreateQuizDialogProps) {
  const router = useRouter();
  const createQuizMutation = useCreateQuizMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CreateQuizFormData>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: false,
      category: "",
      tags: "",
      estimatedDurationMinutes: 15,
    },
  });

  const onSubmit = async (data: CreateQuizFormData) => {
    try {
      let processedTags: string | undefined = undefined;

      if (data.tags?.trim()) {
        const tagsArray = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        if (tagsArray.length > 0) {
          processedTags = JSON.stringify(tagsArray);
        }
      }

      const createQuizData: CreateQuizRequest = {
        title: data.title,
        description: data.description || undefined,
        isPublic: data.isPublic,
        category: data.category || undefined,
        tags: processedTags,
        estimatedDurationMinutes: data.estimatedDurationMinutes,
        thumbnail: data.thumbnail,
      };

      const response = await createQuizMutation.mutateAsync(createQuizData);

      if (response.success && response.data?.id) {
        // Close dialog and reset form
        onOpenChange(false);
        form.reset();
        setImagePreview(null);

        // Redirect to edit quiz page
        router.push(`/quizzes/${response.data.id}/edit`);
      }
    } catch {
      toast.error("Failed to create quiz. Please try again.");
    }
  };

  const handleCancel = () => {
    form.reset();
    setImagePreview(null);
    onOpenChange(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | undefined) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size and type before setting
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Only .jpg, .jpeg, .png and .webp formats are supported");
        return;
      }

      onChange(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (onChange: (file: File | undefined) => void) => {
    onChange(undefined);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Create New Quiz
          </DialogTitle>
          <DialogDescription>
            Fill in the basic information for your new quiz. You can add questions and customize settings later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your quiz title..."
                        {...field}
                        disabled={createQuizMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your quiz..."
                        rows={3}
                        {...field}
                        disabled={createQuizMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>Optional. Describe what your quiz is about.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {!imagePreview ? (
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="thumbnail-upload"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, JPEG or WEBP (MAX. 5MB)</p>
                              </div>
                              <Input
                                id="thumbnail-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, onChange)}
                                disabled={createQuizMutation.isPending}
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={imagePreview}
                                alt="Quiz thumbnail preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 500px) 100vw, 500px"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleRemoveImage(onChange)}
                              disabled={createQuizMutation.isPending}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>Optional. Upload an image to represent your quiz (max 5MB).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={createQuizMutation.isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedDurationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="180"
                          placeholder="15"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          disabled={createQuizMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="comma, separated, tags" {...field} disabled={createQuizMutation.isPending} />
                    </FormControl>
                    <FormDescription>Separate tags with commas to help others find your quiz.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public Quiz</FormLabel>
                      <FormDescription>Make this quiz visible to everyone. You can change this later.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={createQuizMutation.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={createQuizMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={createQuizMutation.isPending} className="min-w-[100px]">
                {createQuizMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Quiz"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
