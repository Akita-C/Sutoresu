import { QuizSummaryDto } from "@/features/quizzes";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, BookOpen, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  quiz: QuizSummaryDto;
  variant?: "grid" | "list";
}

export function QuizCard({ quiz, variant = "grid" }: QuizCardProps) {
  const isListView = variant === "list";

  const cardClasses = cn(
    "group hover:shadow-lg transition-all duration-200 cursor-pointer",
    isListView && "flex flex-row",
  );

  const thumbnailClasses = cn(
    "relative overflow-hidden",
    isListView ? "w-48 h-32 flex-shrink-0" : "w-full h-48",
  );

  const contentWrapperClasses = cn("flex flex-col", isListView && "flex-1");

  const headerClasses = cn(isListView && "pb-2");

  const contentClasses = cn("flex-1", isListView ? "py-2" : "");

  const statsClasses = cn(
    "flex gap-4 text-sm text-muted-foreground",
    isListView ? "flex-wrap" : "flex-col gap-2",
  );

  const footerClasses = cn("pt-0", isListView && "pb-4");

  return (
    <Link href={`/quizzes/${quiz.id}`}>
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
          <Badge
            variant={quiz.isPublic ? "default" : "secondary"}
            className="absolute top-2 right-2"
          >
            {quiz.isPublic ? "Public" : "Private"}
          </Badge>
        </div>

        <div className={contentWrapperClasses}>
          <CardHeader className={headerClasses}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {quiz.title}
              </h3>
              {quiz.category && (
                <Badge variant="outline" className="flex-shrink-0">
                  {quiz.category}
                </Badge>
              )}
            </div>

            {quiz.description && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {quiz.description}
              </p>
            )}
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
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs">
                    {quiz.creatorName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {quiz.creatorName || "Unknown"}
                </span>
              </div>

              {quiz.isPublic && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>Public</span>
                </div>
              )}
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}
