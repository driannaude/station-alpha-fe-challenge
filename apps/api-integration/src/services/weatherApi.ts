import {
  getEnvironmentConfig,
  cacheData,
  getCachedData,
} from "../utils/environment";
import { WeatherApiResponse, WeatherApiLocationSearchResponse } from "../types/api.types";
import { WeatherData, SearchHistoryItem } from "../types/app.types";
import { createCacheKey } from "../utils";

// Environment variables for API configuration
const config = getEnvironmentConfig();

/**
 * Get forecast weather data for a location
 * @param location - City name, zip code, or coordinates
 * @param days - Number of days for forecast (1-10)
 * @returns Promise with weather forecast data
 */
export const getWeatherForecast = async (
  location: string,
  days: number = 5
): Promise<WeatherData> => {
  // Include alerts in the request; bump cache key to fetch fresh
  const cacheKey = createCacheKey(
    "weather-forecast-alerts",
    `${location}-${days}`
  );

  // Try to get cached data first
  const cachedData = getCachedWeatherData<WeatherData>(cacheKey);
  if (cachedData) return cachedData;

  try {
    // Fetch weather data
    const response = await fetch(
      `${config.weather.baseUrl}/forecast.json?key=${config.weather.apiKey}&q=${location}&days=${days}&alerts=yes`
    );
    if (!response.ok) throw new Error("Weather forecast not found");
    const data = await response.json();

    // Transform and cache
    const forecastData = transformWeatherData(data);
    cacheWeatherData(cacheKey, forecastData);
    return forecastData;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
};

/**
 * Search for locations (autocomplete)
 * @param query - Partial location name
 * @returns Promise with location suggestions
 */
export const searchLocations = async (
  query: string
): Promise<WeatherApiLocationSearchResponse> => {
  const cacheKey = createCacheKey("location-search", query);

  // Try to get cached data first
  const cachedData =
    getCachedWeatherData<WeatherApiLocationSearchResponse>(cacheKey);
  if (cachedData) return cachedData;

  try {
    console.log("Fetching fresh location search for:", query);
    const response = await fetch(
      `${config.weather.baseUrl}/search.json?key=${config.weather.apiKey}&q=${query}`
    );
    if (!response.ok) throw new Error("Location search failed");
    const data = await response.json();

    // Cache the search results with shorter expiration (15 minutes for searches)
    cacheWeatherData(cacheKey, data, 15);

    return data;
  } catch (error) {
    console.error("Error searching locations:", error);
    throw error;
  }
};

/**
 * Transform raw API data to our application's data structure
 * @param data - Raw data from WeatherAPI
 * @returns Transformed WeatherData object
 */
export const transformWeatherData = (data: WeatherApiResponse): WeatherData => {
  return {
    location: {
      name: data.location?.name || "Unknown",
      country: data.location?.country || "Unknown",
      lat: data.location?.lat || 0,
      lon: data.location?.lon || 0,
    },
    current: {
      temp_c: data.current?.temp_c || 0,
      temp_f: data.current?.temp_f || 0,
      condition: {
        text: data.current?.condition?.text || "Unknown",
        icon: data.current?.condition?.icon || "",
        code: data.current?.condition?.code || 0,
      },
      wind_kph: data.current?.wind_kph || 0,
      wind_dir: data.current?.wind_dir || "N",
      humidity: data.current?.humidity || 0,
      feelslike_c: data.current?.feelslike_c || 0,
      feelslike_f: data.current?.feelslike_f || 0,
      uv: data.current?.uv || 0,
    },
    forecast: data.forecast
      ? {
          forecastday: data.forecast.forecastday.map((day) => ({
            date: day.date,
            day: {
              maxtemp_c: day.day.maxtemp_c,
              mintemp_c: day.day.mintemp_c,
              condition: {
                text: day.day.condition.text,
                icon: day.day.condition.icon,
              },
              daily_chance_of_rain: day.day.daily_chance_of_rain,
            },
          })),
        }
      : undefined,
    alerts: data.alerts
      ? {
          alert: data.alerts.alert.map((alert) => ({
            headline: alert.headline,
            severity: alert.severity,
            urgency: alert.urgency,
            areas: alert.areas,
            desc: alert.desc,
            effective: alert.effective,
            expires: alert.expires,
          })),
        }
      : undefined,
  };
};

/**
 * Cache weather data in localStorage
 * @param key - Cache key
 * @param data - Data to cache
 * @param expirationMinutes - Cache expiration in minutes (default from env)
 */
export const cacheWeatherData = <T>(
  key: string,
  data: T,
  expirationMinutes: number = config.weather.cacheDuration
): void => {
  cacheData(key, data, expirationMinutes);
};

/**
 * Get cached weather data from localStorage
 * @param key - Cache key
 * @returns Cached data or null if expired/not found
 */
export const getCachedWeatherData = <T>(key: string): T | null => {
  return getCachedData<T>(key);
};

/**
 * Get search history from localStorage
 * @returns Array of search history items
 */
export const getSearchHistory = (): SearchHistoryItem[] => {
  const cached = getCachedData<SearchHistoryItem[]>("search-history");
  return cached || [];
};

/**
 * Save search history to localStorage
 * @param history - Array of search history items
 */
export const saveSearchHistory = (history: SearchHistoryItem[]): void => {
  // Cache search history for 30 days
  cacheData("search-history", history, 30 * 24 * 60);
};

/**
 * Add item to search history and save to localStorage
 * @param query - Search query to add
 * @returns Updated search history array
 */
export const addToSearchHistory = (query: string): SearchHistoryItem[] => {
  const currentHistory = getSearchHistory();
  const newItem: SearchHistoryItem = { query, timestamp: Date.now() };

  // Remove existing entry if it exists and add new one at the beginning
  const updatedHistory = [
    newItem,
    ...currentHistory.filter((item) => item.query !== query).slice(0, 4), // Keep last 5 unique searches
  ];

  saveSearchHistory(updatedHistory);
  return updatedHistory;
};

/**
 * Clear all cached data (weather, search history, location searches)
 * Useful for development or user preference
 */
export const clearAllCache = (): void => {
  // Clear search history
  localStorage.removeItem("search-history");

  // Clear all weather and location search cache
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (
      key.startsWith("weather-current-") ||
      key.startsWith("weather-forecast-") ||
      key.startsWith("location-search-")
    ) {
      localStorage.removeItem(key);
    }
  });

  console.log("All weather cache and search history cleared");
};
