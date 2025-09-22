/**
 * Search utilities
 *
 * Provides utility functions for search functionality including
 * input validation, query processing, and UI state management.
 */

/**
 * Validates if a search query is suitable for API calls
 * @param query - The search query to validate
 * @param minLength - Minimum length required (default: 3)
 * @returns True if query is valid for searching
 */
export const isValidSearchQuery = (query: string, minLength = 3): boolean => {
  return query.trim().length >= minLength;
};

/**
 * Checks if an element is the active search input
 * Useful for managing dropdown visibility based on focus state
 * @param className - The className to check for (default: 'search-input')
 * @returns True if the active element has the specified class
 */
export const isSearchInputFocused = (className = "search-input"): boolean => {
  return document.activeElement?.className?.includes(className) ?? false;
};

/**
 * Search query processing options
 */
// (Deprecated) Query processing helpers were removed to reduce unused code.

/**
 * Search UI state management helpers
 */
export const searchUIHelpers = {
  /**
   * Determines if suggestions should be shown
   */
  shouldShowSuggestions: (
    query: string,
    hasSuggestions: boolean,
    isInputFocused: boolean,
    minLength = 3
  ): boolean => {
    return isInputFocused && query.length >= minLength && hasSuggestions;
  },

  /**
   * Determines if search history should be shown
   */
  shouldShowHistory: (
    query: string,
    hasHistory: boolean,
    isInputFocused: boolean,
    minLength = 3
  ): boolean => {
    return isInputFocused && query.length < minLength && hasHistory;
  },

  /**
   * Creates blur handler with delay for dropdown interactions
   */
  createBlurHandler: (onHide: () => void, delay = 150): (() => void) => {
    return () => {
      setTimeout(onHide, delay);
    };
  },
};
