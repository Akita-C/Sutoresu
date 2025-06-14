"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { QuizFilters } from "@/features/quizzes";
import { useCategoryCounts } from "@/features/quizzes";

interface QuizFiltersProps {
  filters: QuizFilters;
  onFiltersChange: (filters: QuizFilters) => void;
  onSearch: (query: string) => void;
}

export function QuizFiltersComponent({
  filters,
  onFiltersChange,
  onSearch,
}: QuizFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const { data: categoryCounts } = useCategoryCounts();

  useEffect(() => {
    setSearchQuery(filters.search || "");
  }, [filters.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    const newFilters = { ...filters };
    delete newFilters.search;
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    onFiltersChange({});
  };

  const removeFilter = (filterKey: keyof QuizFilters) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];

    if (filterKey === "search") {
      setSearchQuery("");
    }

    onFiltersChange(newFilters);
  };

  const activeFiltersCount = [
    filters.search && filters.search.trim() !== "",
    filters.category,
    filters.isPublic !== undefined,
    filters.sortBy,
    filters.isDescending === true,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;
  const hasSearchQuery = searchQuery.length > 0;

  // Helper functions to get display values
  const getCategoryDisplayValue = () => {
    if (!filters.category) return "All Categories";

    // If we have category counts data, show with count
    if (
      categoryCounts?.success &&
      categoryCounts.data &&
      categoryCounts.data[filters.category]
    ) {
      return `${filters.category} (${categoryCounts.data[filters.category]})`;
    }

    // Otherwise just show the category name
    return filters.category;
  };

  const getVisibilityDisplayValue = () => {
    if (filters.isPublic === undefined) return "All Quizzes";
    return filters.isPublic ? "Public Only" : "Private Only";
  };

  const getSortByDisplayValue = () => {
    if (!filters.sortBy) return "Default";

    const sortLabels: Record<string, string> = {
      title: "Title",
      createdAt: "Created Date",
      questionCount: "Question Count",
    };

    return sortLabels[filters.sortBy] || filters.sortBy;
  };

  const getOrderDisplayValue = () => {
    return filters.isDescending ? "Descending" : "Ascending";
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
          {hasSearchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={handleClearSearch}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>

      {/* Filters */}
      <div>
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">
          FILTERS
        </h4>
        <div className="space-y-3">
          {/* Category Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Category
            </label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => {
                const newFilters = { ...filters };
                if (value === "all") {
                  delete newFilters.category;
                } else {
                  newFilters.category = value;
                }
                onFiltersChange(newFilters);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{getCategoryDisplayValue()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryCounts?.success &&
                  categoryCounts.data &&
                  Object.entries(categoryCounts.data).map(
                    ([category, count]) => (
                      <SelectItem key={category} value={category}>
                        {category} ({count})
                      </SelectItem>
                    ),
                  )}
              </SelectContent>
            </Select>
          </div>

          {/* Visibility Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Visibility
            </label>
            <Select
              value={
                filters.isPublic === undefined
                  ? "all"
                  : filters.isPublic.toString()
              }
              onValueChange={(value) => {
                const newFilters = { ...filters };
                if (value === "all") {
                  delete newFilters.isPublic;
                } else {
                  newFilters.isPublic = value === "true";
                }
                onFiltersChange(newFilters);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{getVisibilityDisplayValue()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quizzes</SelectItem>
                <SelectItem value="true">Public Only</SelectItem>
                <SelectItem value="false">Private Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Sort By
            </label>
            <Select
              value={filters.sortBy || "default"}
              onValueChange={(value) => {
                const newFilters = { ...filters };
                if (value === "default") {
                  delete newFilters.sortBy;
                } else {
                  newFilters.sortBy = value;
                }
                onFiltersChange(newFilters);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{getSortByDisplayValue()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="questionCount">Question Count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Order
            </label>
            <Select
              value={filters.isDescending?.toString() || "false"}
              onValueChange={(value) => {
                const newFilters = { ...filters };
                newFilters.isDescending = value === "true";
                onFiltersChange(newFilters);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{getOrderDisplayValue()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Ascending</SelectItem>
                <SelectItem value="true">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <div className="pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            ACTIVE FILTERS
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && filters.search.trim() !== "" && (
              <div className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs border">
                Search: {filters.search}
                <button
                  className="ml-1 w-3 h-3 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter("search");
                  }}
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            )}

            {filters.category && (
              <div className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs border">
                {filters.category}
                <button
                  className="ml-1 w-3 h-3 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter("category");
                  }}
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            )}

            {filters.isPublic !== undefined && (
              <div className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs border">
                {filters.isPublic ? "Public" : "Private"}
                <button
                  className="ml-1 w-3 h-3 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter("isPublic");
                  }}
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            )}

            {filters.sortBy && (
              <div className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs border">
                Sort: {getSortByDisplayValue()}
                <button
                  className="ml-1 w-3 h-3 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter("sortBy");
                  }}
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            )}

            {filters.isDescending === true && (
              <div className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs border">
                Descending
                <button
                  className="ml-1 w-3 h-3 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter("isDescending");
                  }}
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
