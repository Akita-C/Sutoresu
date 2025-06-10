import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate user initials from full name
 * @param name - The full name string
 * @returns A string with up to 2 uppercase initials
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("Jane") // "J"
 * getInitials("") // "U"
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return "U"; // Default fallback for empty names
  }

  return name
    .trim()
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format a date string to a user-friendly format
 * @param dateString - ISO date string or undefined
 * @param fallback - Text to show when date is not available
 * @returns Formatted date string
 * @example
 * formatDate("2024-01-15T10:30:00Z") // "Jan 15, 2024, 10:30 AM"
 * formatDate(undefined) // "Never"
 * formatDate("", "Not available") // "Not available"
 */
export function formatDate(
  dateString?: string,
  fallback: string = "Never",
): string {
  if (!dateString) return fallback;

  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    console.warn("Invalid date string:", dateString);
    return fallback;
  }
}

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 * @param dateString - ISO date string
 * @param fallback - Text to show when date is not available
 * @returns Relative time string
 * @example
 * formatRelativeDate("2024-01-15T10:30:00Z") // "2 hours ago"
 * formatRelativeDate(undefined) // "Never"
 */
export function formatRelativeDate(
  dateString?: string,
  fallback: string = "Never",
): string {
  if (!dateString) return fallback;

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return formatDate(dateString, fallback);
    }
  } catch {
    console.warn("Invalid date string:", dateString);
    return fallback;
  }
}

/**
 * Format a date to just the date part (no time)
 * @param dateString - ISO date string
 * @param fallback - Text to show when date is not available
 * @returns Formatted date string without time
 * @example
 * formatDateOnly("2024-01-15T10:30:00Z") // "Jan 15, 2024"
 */
export function formatDateOnly(
  dateString?: string,
  fallback: string = "Never",
): string {
  if (!dateString) return fallback;

  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    console.warn("Invalid date string:", dateString);
    return fallback;
  }
}

/**
 * Format a date to just the time part (no date)
 * @param dateString - ISO date string
 * @param fallback - Text to show when date is not available
 * @returns Formatted time string
 * @example
 * formatTimeOnly("2024-01-15T10:30:00Z") // "10:30 AM"
 */
export function formatTimeOnly(
  dateString?: string,
  fallback: string = "Never",
): string {
  if (!dateString) return fallback;

  try {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    console.warn("Invalid date string:", dateString);
    return fallback;
  }
}
