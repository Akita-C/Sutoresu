"use client";

import { QuizSummaryDto } from "@/features/quizzes";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Users, BookOpen, Calendar, MoreVertical, Edit, Trash2, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { useDeleteQuizMutation } from "@/features/quizzes/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MyQuizCardProps {
  quiz: QuizSummaryDto;
  variant?: "grid" | "list";
}

export function MyQuizCard({ quiz, variant = "grid" }: MyQuizCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteQuizMutation = useDeleteQuizMutation();

  const isListView = variant === "list";

  const cardClasses = cn(
    "group hover:shadow-lg transition-all duration-200",
    isListView && "flex flex-row",
    !isListView && "h-[420px] flex flex-col",
  );

  const thumbnailClasses = cn("relative overflow-hidden", isListView ? "w-48 h-32 flex-shrink-0" : "w-full h-48");

  const contentWrapperClasses = cn("flex flex-col", isListView && "flex-1", !isListView && "flex-1");

  const headerClasses = cn(isListView && "pb-2");

  const contentClasses = cn("flex-1", isListView ? "py-2" : "", !isListView && "flex-grow");

  const statsClasses = cn("flex gap-4 text-sm text-muted-foreground", isListView ? "flex-wrap" : "flex-col gap-2");

  const footerClasses = cn("pt-0", isListView && "pb-4");

  const handleDelete = () => {
    if (!quiz.id) return;

    startTransition(() => {
      deleteQuizMutation.mutate(quiz.id!, {
        onSuccess: () => {
          setShowDeleteDialog(false);
          toast.success("Quiz deleted successfully!");
        },
        onError: (error) => {
          toast.error("Failed to delete quiz");
          console.error("Delete error:", error);
        },
      });
    });
  };

  const handleEdit = () => {
    if (quiz.id) {
      startTransition(() => {
        router.push(`/quizzes/${quiz.id}/edit`);
      });
    }
  };

  const handlePlay = () => {
    if (quiz.id) {
      startTransition(() => {
        router.push(`/quizzes/${quiz.id}`);
      });
    }
  };

  return (
    <>
      <Card className={cardClasses}>
        {/* Thumbnail */}
        <div className={thumbnailClasses}>
          {quiz.thumbnailUrl ? (
            <Image
              src={quiz.thumbnailUrl}
              alt={quiz.title || "Quiz thumbnail"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          )}

          {/* Public/Private Badge */}
          <Badge variant={quiz.isPublic ? "default" : "secondary"} className="absolute top-2 left-2">
            {quiz.isPublic ? "Public" : "Private"}
          </Badge>

          {/* Quick Actions Dropdown */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePlay}>
                  <Play className="mr-2 h-4 w-4" />
                  Play Quiz
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className={contentWrapperClasses}>
          <CardHeader className={headerClasses}>
            <div className="flex items-start justify-between gap-2">
              <Link href={`/quizzes/${quiz.id}`} className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                  {quiz.title}
                </h3>
              </Link>
              {quiz.category && (
                <Badge variant="outline" className="flex-shrink-0">
                  {quiz.category}
                </Badge>
              )}
            </div>

            {quiz.description && <p className="text-muted-foreground text-sm line-clamp-2">{quiz.description}</p>}
          </CardHeader>

          <CardContent className={contentClasses}>
            <div className={statsClasses}>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{quiz.questionCount} questions</span>
              </div>

              {quiz.estimatedDurationMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.estimatedDurationMinutes} min</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(quiz.createdAt || ""), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className={footerClasses}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{quiz.isPublic ? "Public" : "Private"}</span>
              </div>

              {/* Quick Action Buttons - Visible on hover */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="outline" onClick={handlePlay} className="h-7 px-2" disabled={isPending}>
                  <Play className="w-3 h-3 mr-1" />
                  Play
                </Button>
                <Button size="sm" variant="outline" onClick={handleEdit} className="h-7 px-2" disabled={isPending}>
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </CardFooter>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{quiz.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
