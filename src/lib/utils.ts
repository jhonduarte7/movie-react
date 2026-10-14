import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional classes and resolves Tailwind CSS precedence conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats date timestamps cleanly for chat display.
 */
export function formatTime(isoString?: string): string {
  if (!isoString) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
