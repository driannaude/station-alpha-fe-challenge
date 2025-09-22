/**
 * Debounce utility functions
 *
 * Provides utilities for delaying function execution to improve performance
 * and reduce unnecessary API calls during rapid user input.
 */

import { useCallback, useRef } from "react";

/**
 * Creates a debounced function that delays the execution of the provided function
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * React hook that returns a debounced version of the provided function
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the callback function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

/**
 * Default debounce delays for common use cases
 */
export const DEBOUNCE_DELAYS = {
  SEARCH: 500, // For search/autocomplete inputs
  API_CALL: 300, // For general API calls
  VALIDATION: 1000, // For form validation
  RESIZE: 250, // For window resize events
  SCROLL: 100, // For scroll events
} as const;
