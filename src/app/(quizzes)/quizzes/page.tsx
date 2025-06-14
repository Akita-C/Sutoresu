import { Metadata } from "next";
import { Suspense } from "react";
import { QuizListPage } from "@/components/quiz/quiz-list-page";
import { QuizSkeleton } from "@/components/quiz/quiz-skeleton";

export const metadata: Metadata = {
  title: "Browse Quizzes | Sutoresu",
  description:
    "Discover and take interactive quizzes on various topics. Browse public quizzes, filter by categories, and test your knowledge with our engaging quiz platform.",
  keywords: ["quizzes", "interactive learning", "education", "test", "knowledge", "trivia", "study"],
  openGraph: {
    title: "Browse Quizzes | Sutoresu",
    description: "Discover and take interactive quizzes on various topics. Test your knowledge with engaging quizzes.",
    type: "website",
    siteName: "Sutoresu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Quizzes | Sutoresu",
    description: "Discover and take interactive quizzes on various topics.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/quizzes",
  },
};

export default async function QuizzesPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsPromise;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const isPublic = searchParams.public === "true" ? true : searchParams.public === "false" ? false : undefined;
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : undefined;
  const isDescending = searchParams.desc === "true";

  const initialFilters = {
    search,
    category,
    isPublic,
    sortBy,
    isDescending,
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Quiz Library</h1>
        <p className="text-muted-foreground text-lg">
          Explore our collection of interactive quizzes and expand your knowledge
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex gap-8">
            <div className="w-80 flex-shrink-0">
              <div className="space-y-4">
                <div className="h-10 bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-20" />
                  <div className="h-8 bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-16" />
                  <div className="h-8 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuizSkeleton count={9} />
              </div>
            </div>
          </div>
        }
      >
        <QuizListPage initialFilters={initialFilters} />
      </Suspense>
    </div>
  );
}
