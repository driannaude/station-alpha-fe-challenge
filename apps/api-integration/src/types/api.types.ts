/**
 * TypeScript interfaces for Weather API data structures
 *
 * This file provides complete type safety for the WeatherAPI.com service.
 * All interfaces match the actual API response structure to eliminate any 'any' types.
 *
 * Main interfaces:
 * - WeatherApiResponse: Complete API response with location, current weather, forecast, alerts
 * - WeatherApiLocationSearchResponse: Location search/autocomplete results
 * - WeatherApiError: API error responses
 *
 * Usage:
 * - Import these types in weatherApi.ts service functions
 * - Use for API response parsing and data transformation
 * - Ensures type safety throughout the weather data flow
 */

// Raw WeatherAPI.com response interfaces
export interface WeatherApiLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherApiCondition {
  text: string;
  icon: string;
  code: number;
}

export interface WeatherApiCurrent {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherApiCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface WeatherApiForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    totalsnow_cm: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: WeatherApiCondition;
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: string;
    is_moon_up: number;
    is_sun_up: number;
  };
  hour: Array<{
    time_epoch: number;
    time: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: WeatherApiCondition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    snow_cm: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    uv: number;
  }>;
}

export interface WeatherApiForecast {
  forecastday: WeatherApiForecastDay[];
}

export interface WeatherApiAlert {
  headline: string;
  msgtype: string;
  severity: string;
  urgency: string;
  areas: string;
  category: string;
  certainty: string;
  event: string;
  note: string;
  effective: string;
  expires: string;
  desc: string;
  instruction: string;
}

export interface WeatherApiAlerts {
  alert: WeatherApiAlert[];
}

// Main WeatherAPI.com response interface
export interface WeatherApiResponse {
  location: WeatherApiLocation;
  current: WeatherApiCurrent;
  forecast?: WeatherApiForecast;
  alerts?: WeatherApiAlerts;
}

// Location search response
export interface WeatherApiLocationSearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export type WeatherApiLocationSearchResponse = WeatherApiLocationSearchResult[];

// API Error response
export interface WeatherApiError {
  error: {
    code: number;
    message: string;
  };
}
