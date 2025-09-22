/**
 * Environment variables validation and utilities
 */

// Type definitions for environment configuration
export interface WeatherConfig {
  apiKey: string;
  baseUrl: string;
  cacheDuration: number;
  map: {
    apiKey: string;
    zoom: number;
    type: string;
  };
}

export interface FeatureFlags {
  weatherAlerts: boolean;
  weatherMap: boolean;
  locationSearch: boolean;
}

export interface AppConfig {
  port: number;
}

export interface EnvironmentConfig {
  weather: WeatherConfig;
  features: FeatureFlags;
  app: AppConfig;
}

// Valid map types for type safety
export type WeatherMapType =
  | "precipitation"
  | "temp"
  | "wind"
  | "pressure"
  | "clouds";

// Cache data structure
export interface CacheItem<T = unknown> {
  data: T;
  expiry: number;
}

/**
 * Validates that all required environment variables are present
 * @throws Error if required environment variables are missing
 */
export const validateEnvironment = (): void => {
  const requiredVars = ["VITE_WEATHER_API_KEY", "VITE_WEATHER_MAP_API_KEY"];

  const missingVars = requiredVars.filter((varName) => {
    const value = import.meta.env[varName];
    return (
      !value ||
      value === "YOUR_API_KEY" ||
      value === "your_weather_api_key_here" ||
      value === "your_actual_api_key_here" ||
      value === "your_weather_map_api_key_here"
    );
  });

  if (missingVars.length > 0) {
    const errorMessage = `
Missing or invalid environment variables: ${missingVars.join(", ")}

To fix this:
1. Copy .env.example to .env in the project root directory
2. Get a free API key from https://www.weatherapi.com/
3. Get a free API key from https://openweathermap.org/api for weather maps
3. Replace VITE_WEATHER_API_KEY in your .env file with your actual API key

Example:
VITE_WEATHER_API_KEY=abc123def456ghi789

Current values:
${missingVars.map((varName) => `${varName}: ${import.meta.env[varName] || "undefined"}`).join("\n")}
    `.trim();

    throw new Error(errorMessage);
  }
};

/**
 * Gets environment configuration with defaults
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  validateEnvironment();

  return {
    weather: {
      apiKey: import.meta.env.VITE_WEATHER_API_KEY as string,
      baseUrl:
        (import.meta.env.VITE_WEATHER_API_BASE_URL as string) ||
        "https://api.weatherapi.com/v1",
      cacheDuration: Number(import.meta.env.VITE_WEATHER_CACHE_DURATION) || 30,
      map: {
        apiKey: import.meta.env.VITE_WEATHER_MAP_API_KEY as string,
        zoom: Number(import.meta.env.VITE_WEATHER_MAP_ZOOM) || 12,
        type:
          (import.meta.env.VITE_WEATHER_MAP_TYPE as WeatherMapType) ||
          "precipitation",
      },
    },
    features: {
      weatherAlerts: import.meta.env.VITE_ENABLE_WEATHER_ALERTS === "true",
      weatherMap: import.meta.env.VITE_ENABLE_WEATHER_MAP === "true",
      locationSearch: import.meta.env.VITE_ENABLE_LOCATION_SEARCH === "true",
    },
    app: {
      port: Number(import.meta.env.VITE_API_INTEGRATION_PORT) || 5171,
    },
  };
};

/**
 * Cache data in localStorage with proper typing
 * @param key - Cache key
 * @param data - Data to cache
 * @param expirationMinutes - Cache expiration in minutes
 */
export const cacheData = <T>(
  key: string,
  data: T,
  expirationMinutes: number = 30
): void => {
  const now = new Date();
  const item: CacheItem<T> = {
    data,
    expiry: now.getTime() + expirationMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get cached data from localStorage with proper typing
 * @param key - Cache key
 * @returns Cached data or null if expired/not found
 */
export const getCachedData = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item: CacheItem<T> = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  } catch {
    // Invalid JSON, remove the item
    localStorage.removeItem(key);
    return null;
  }
};
