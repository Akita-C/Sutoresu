"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

import { useUpdateQuizMutation } from "@/features/quizzes/hooks";
import { QuizDto } from "@/lib/api/generated";

const quizEditSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  category: z.string().max(50, "Category too long").optional(),
  tags: z.string().max(200, "Tags too long").optional(),
  estimatedDurationMinutes: z.number().min(1).max(480).optional(),
  isPublic: z.boolean(),
});

type QuizEditFormData = z.infer<typeof quizEditSchema>;

interface QuizEditFormProps {
  quiz: QuizDto;
}

export function QuizEditForm({ quiz }: QuizEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const updateQuizMutation = useUpdateQuizMutation();

  const form = useForm<QuizEditFormData>({
    resolver: zodResolver(quizEditSchema),
    defaultValues: {
      title: quiz.title || "",
      description: quiz.description || "",
      category: quiz.category || "",
      tags: quiz.tags || "",
      estimatedDurationMinutes: quiz.estimatedDurationMinutes || 10,
      isPublic: quiz.isPublic || false,
    },
  });

  const onSubmit = (data: QuizEditFormData) => {
    if (!quiz.id) return;

    startTransition(() => {
      updateQuizMutation.mutate(
        {
          id: quiz.id!,
          quizData: data,
        },
        {
          onSuccess: (response) => {
            if (response.success) {
              toast.success("Quiz updated successfully!");
            } else {
              toast.error(response.message || "Failed to update quiz");
            }
          },
          onError: (error) => {
            toast.error("Failed to update quiz");
            console.error("Update error:", error);
          },
        },
      );
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter quiz title" {...field} />
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
                <Textarea placeholder="Describe your quiz..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Science, History" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Comma-separated tags" {...field} />
              </FormControl>
              <FormDescription>Separate multiple tags with commas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedDurationMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="480"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Public Quiz</FormLabel>
                <FormDescription>Make this quiz visible to everyone</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending || updateQuizMutation.isPending} className="w-full">
          {updateQuizMutation.isPending ? "Updating..." : "Update Quiz"}
        </Button>
      </form>
    </Form>
  );
}
