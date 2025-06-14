// Common view mode type used across quiz components
export type ViewMode = "grid" | "list";

// Common sort options for quiz lists
export type QuizSortOption = "newest" | "oldest" | "title" | "questions";

// Common filter options for quiz visibility
export type QuizVisibilityFilter = "all" | "public" | "private";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
