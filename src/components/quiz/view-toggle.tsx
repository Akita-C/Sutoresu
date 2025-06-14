"use client";

import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const isGridView = view === "grid";
  const isListView = view === "list";

  return (
    <div className="flex items-center border rounded-lg p-1">
      <Button
        variant={isGridView ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="h-8 w-8 p-0"
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
      <Button
        variant={isListView ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className="h-8 w-8 p-0"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
