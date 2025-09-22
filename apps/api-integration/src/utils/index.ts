/**
 * Utility functions index
 *
 * Centralized exports for all utility functions used across the application.
 * This provides a clean interface for importing utilities from a single location.
 */

// Debounce utilities
export { debounce, useDebounce, DEBOUNCE_DELAYS } from "./debounce";

// String formatting utilities
export {
  formatLocationString,
  normalizeString,
  createCacheKey,
} from "./stringFormat";

// Search helper utilities
export {
  isValidSearchQuery,
  isSearchInputFocused,
  searchUIHelpers,
} from "./searchHelpers";

// Environment utilities (re-export existing)
export { getEnvironmentConfig, cacheData, getCachedData } from "./environment";
