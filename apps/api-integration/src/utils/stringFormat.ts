/**
 * String formatting utilities
 *
 * Provides utility functions for formatting and manipulating strings,
 * particularly for location and weather-related data display.
 */

import { WeatherApiLocationSearchResult } from "../types/api.types";

/**
 * Formats a location object into a readable string
 * Handles cases where region might be undefined or empty
 * @param location - The location object from the API
 * @returns Formatted location string (e.g., "City, Region, Country" or "City, Country")
 */
export const formatLocationString = (
  location: WeatherApiLocationSearchResult
): string => {
  const parts = [location.name];

  if (location.region && location.region.trim()) {
    parts.push(location.region);
  }

  parts.push(location.country);
  return parts.join(", ");
};

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
/**
 * Normalizes a string for consistent comparison/caching
 * Converts to lowercase and trims whitespace
 * @param str - The string to normalize
 * @returns Normalized string
 */
export const normalizeString = (str: string): string => {
  return str.toLowerCase().trim();
};

/**
 * Creates a cache key from a string by normalizing and adding a prefix
 * @param prefix - The prefix for the cache key
 * @param value - The value to include in the key
 * @returns Formatted cache key
 */
export const createCacheKey = (prefix: string, value: string): string => {
  return `${prefix}-${normalizeString(value)}`;
};
