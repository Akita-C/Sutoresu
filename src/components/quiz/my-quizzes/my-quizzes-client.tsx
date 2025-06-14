"use client";

import { useState } from "react";
import { useMyQuizzes } from "@/features/quizzes/hooks";
import { QuizFilters } from "@/features/quizzes";
import { MyQuizCard } from "@/components/quiz/my-quizzes/my-quiz-card";
import { MyQuizFilters } from "@/components/quiz/my-quizzes/my-quiz-filters";
import { CreateQuizDialog } from "@/components/quiz/my-quizzes/create-quiz-dialog";
import { ViewToggle } from "@/components/quiz/view-toggle";
import { QuizSkeleton } from "@/components/quiz/quiz-skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, BookOpen, Users, Lock, Globe, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewMode } from "@/lib/types/common";

export function MyQuizzesClient() {
  const [filters, setFilters] = useState<QuizFilters>({
    sortBy: "createdAt",
    isDescending: true,
  });
  const [view, setView] = useState<ViewMode>("grid");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useMyQuizzes(filters);

  const allQuizzes = data?.pages?.flatMap((page) => (page.success ? page.data?.data || [] : [])) || [];

  const handleFiltersChange = (newFilters: QuizFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    const newFilters = { ...filters };
    if (query.trim()) {
      newFilters.search = query.trim();
    } else {
      delete newFilters.search;
    }
    handleFiltersChange(newFilters);
  };

  const handleCreateQuiz = () => {
    setCreateDialogOpen(true);
  };

  const handleLoadMore = () => {
    fetchNextPage();
  };

  // Calculate stats
  const stats = {
    total: allQuizzes.length,
    public: allQuizzes.filter((q) => q.isPublic).length,
    private: allQuizzes.filter((q) => !q.isPublic).length,
    totalQuestions: allQuizzes.reduce((sum, q) => sum + (q.questionCount || 0), 0),
  };

  const gridClasses = cn(
    "gap-6",
    view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr" : "flex flex-col",
  );

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-16">
              <div>
                <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
                <MyQuizFilters filters={filters} onFiltersChange={handleFiltersChange} onSearch={handleSearch} />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Failed to load your quizzes. Please try again.</span>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">My Quizzes</h1>
              <p className="text-muted-foreground text-lg">Manage and organize your quiz collection</p>
            </div>

            <Button onClick={handleCreateQuiz}>
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          </div>

          {/* Stats */}
          {!isLoading && allQuizzes.length > 0 && (
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{stats.total}</span>
                <span className="text-muted-foreground">Total Quizzes</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{stats.public}</span>
                <span className="text-muted-foreground">Public</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{stats.private}</span>
                <span className="text-muted-foreground">Private</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{stats.totalQuestions}</span>
                <span className="text-muted-foreground">Total Questions</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content with Sidebar Layout */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-18 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
                <MyQuizFilters filters={filters} onFiltersChange={handleFiltersChange} onSearch={handleSearch} />
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
                    {isLoading && (
                      <div className="mt-2 inline-flex items-center text-xs">
                        <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                        Loading...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              {/* Content Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Your Quiz Collection</h2>
                  <p className="text-muted-foreground text-sm mt-1">Create, edit, and manage your quizzes</p>
                </div>
              </div>

              {/* Results */}
              <div className={gridClasses}>
                {isLoading ? (
                  <QuizSkeleton variant={view} count={9} />
                ) : allQuizzes.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No quizzes yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      {filters.search || filters.isPublic !== undefined
                        ? "No quizzes match your current filters. Try adjusting your search or filter criteria."
                        : "Get started by creating your first quiz and sharing your knowledge with others."}
                    </p>
                    {filters.search || filters.isPublic !== undefined ? (
                      <Button
                        variant="outline"
                        onClick={() => handleFiltersChange({ sortBy: "createdAt", isDescending: true })}
                      >
                        Clear Filters
                      </Button>
                    ) : (
                      <Button onClick={handleCreateQuiz}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Quiz
                      </Button>
                    )}
                  </div>
                ) : (
                  allQuizzes.map((quiz) => <MyQuizCard key={quiz.id} quiz={quiz} variant={view} />)
                )}
              </div>

              {/* Load More */}
              {hasNextPage && (
                <div className="flex justify-center pt-8">
                  <Button variant="outline" onClick={handleLoadMore} disabled={isFetchingNextPage} className="min-w-32">
                    {isFetchingNextPage ? (
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
      </div>

      <CreateQuizDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}
