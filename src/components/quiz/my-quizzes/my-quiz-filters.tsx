"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { QuizFilters } from "@/features/quizzes";

interface MyQuizFiltersProps {
  filters: QuizFilters;
  onFiltersChange: (filters: QuizFilters) => void;
  onSearch: (query: string) => void;
}

export function MyQuizFilters({ filters, onFiltersChange, onSearch }: MyQuizFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");

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

  const hasSearchQuery = searchQuery.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search your quizzes..."
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
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">FILTERS</h4>
        <div className="space-y-3">
          {/* Visibility Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Visibility</label>
            <Select
              value={filters.isPublic === undefined ? "all" : filters.isPublic.toString()}
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
                <SelectValue />
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
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Sort By</label>
            <Select
              value={filters.sortBy || "createdAt"}
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="questionCount">Question Count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Order</label>
            <Select
              value={filters.isDescending?.toString() || "true"}
              onValueChange={(value) => {
                const newFilters = { ...filters };
                newFilters.isDescending = value === "true";
                onFiltersChange(newFilters);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Newest First</SelectItem>
                <SelectItem value="false">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
