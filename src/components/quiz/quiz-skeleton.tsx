import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QuizSkeletonProps {
  variant?: "grid" | "list";
  count?: number;
}

export function QuizSkeleton({
  variant = "grid",
  count = 6,
}: QuizSkeletonProps) {
  const isListView = variant === "list";

  const cardClasses = cn(isListView && "flex flex-row");

  const thumbnailClasses = cn(
    isListView ? "w-48 h-32 flex-shrink-0" : "w-full h-48",
  );

  const contentWrapperClasses = cn("flex flex-col", isListView && "flex-1");

  const headerClasses = cn(isListView && "pb-2");

  const contentClasses = cn("flex-1", isListView && "py-2");

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className={cardClasses}>
          {/* Thumbnail Skeleton */}
          <Skeleton className={thumbnailClasses} />

          <div className={contentWrapperClasses}>
            <CardHeader className={headerClasses}>
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>

            <CardContent className={contentClasses}>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            </CardFooter>
          </div>
        </Card>
      ))}
    </>
  );
}
