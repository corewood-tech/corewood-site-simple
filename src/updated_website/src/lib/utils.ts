import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the base URL from environment variables or defaults to window.location.origin
 */
export function getBaseUrl(): string {
  // Use environment variable if available (during build time)
  if (import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL;
  }

  // Fallback to window.location.origin in browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Default fallback
  return '';
}
