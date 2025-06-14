"use client";

import { useState, useTransition, useOptimistic } from "react";
import { useQuizzes } from "@/features/quizzes";
import { QuizFilters } from "@/features/quizzes";
import { QuizCard } from "./quiz-card";
import { QuizFiltersComponent } from "./quiz-filters";
import { ViewToggle } from "./view-toggle";
import { QuizSkeleton } from "./quiz-skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizListPageProps {
  initialFilters?: Partial<QuizFilters>;
}

export function QuizListPage({ initialFilters = {} }: QuizListPageProps) {
  const [filters, setFilters] = useState<QuizFilters>(initialFilters);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isPending, startTransition] = useTransition();

  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    filters,
    (_, newFilters: QuizFilters) => newFilters,
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useQuizzes(optimisticFilters);

  const handleFiltersChange = (newFilters: QuizFilters) => {
    startTransition(() => {
      setOptimisticFilters(newFilters);
      setFilters(newFilters);

      const params = new URLSearchParams();
      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.category) params.set("category", newFilters.category);
      if (newFilters.isPublic !== undefined)
        params.set("public", newFilters.isPublic.toString());
      if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
      if (newFilters.isDescending) params.set("desc", "true");

      const url = params.toString() ? `?${params.toString()}` : "/quizzes";
      window.history.replaceState(null, "", url);
    });
  };

  const handleSearch = (query: string) => {
    startTransition(() => {
      const newFilters = { ...optimisticFilters };
      if (query.trim()) {
        newFilters.search = query.trim();
      } else {
        delete newFilters.search;
      }
      handleFiltersChange(newFilters);
    });
  };

  const handleLoadMore = () => {
    startTransition(() => {
      fetchNextPage();
    });
  };

  if (error) {
    return (
      <div className="flex gap-8">
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-6">
            <QuizFiltersComponent
              filters={optimisticFilters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load quizzes. Please try again.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const allQuizzes =
    data?.pages?.flatMap((page) =>
      page.success ? page.data?.data || [] : [],
    ) || [];

  const gridClasses = cn(
    "grid gap-6",
    view === "grid"
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid-cols-1",
  );

  return (
    <div className="flex gap-8">
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-18 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
            <QuizFiltersComponent
              filters={optimisticFilters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">View Mode</h3>
            <div className="w-fit">
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>

          {!isLoading && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">
                {allQuizzes.length > 0
                  ? `Found ${allQuizzes.length} quiz${allQuizzes.length === 1 ? "" : "es"}`
                  : "No quizzes found"}
                {isPending && (
                  <div className="mt-2 inline-flex items-center text-xs">
                    <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                    Updating results...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Browse Quizzes</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Discover and take interactive quizzes
              </p>
            </div>
          </div>

          <div className={gridClasses}>
            {isLoading ? (
              <QuizSkeleton variant={view} count={12} />
            ) : allQuizzes.length > 0 ? (
              allQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} variant={view} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {filters.search || filters.category
                    ? "Try adjusting your search terms or filters to find more quizzes"
                    : "Be the first to create a quiz and share your knowledge!"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => handleFiltersChange({})}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-8">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isFetchingNextPage || isPending}
                className="min-w-32"
              >
                {isFetchingNextPage || isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Quizzes"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
