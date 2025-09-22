import { useState, useEffect } from "react";
import "./App.css";
import { SearchHistoryItem, WeatherData } from "./types/app.types";
import {
  getWeatherForecast,
  getSearchHistory,
  addToSearchHistory as saveToSearchHistory,
} from "./services/weatherApi";
import CurrentWeather from "./components/CurrentWeather";
import SearchBar from "./components/SearchBar";
import Forecast from "./components/Forecast";
import WeatherMap from "./components/WeatherMap";
import WeatherAlerts from "./components/WeatherAlerts";

function App() {
  // Weather data state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Error state
  const [error, setError] = useState<string | null>(null);
  // Search history
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  // Instructions visibility
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const loadedHistory = getSearchHistory();
    setSearchHistory(loadedHistory);
  }, []);

  const handleSearch = async (location: string) => {
    try {
      if (!location.trim()) return;
      setIsLoading(true);
      setError(null);
      const data = await getWeatherForecast(location);
      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToSearchHistory = (query: string) => {
    // Save to localStorage and update local state
    const updatedHistory = saveToSearchHistory(query);
    setSearchHistory(updatedHistory);
  };

  const handleLocationSelect = async (lat: number, lon: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const locationQuery = `${lat},${lon}`;
      const data = await getWeatherForecast(locationQuery);
      setWeatherData(data);
      // Add the location name to search history
      addToSearchHistory(data.location.name);
    } catch (err) {
      setError(
        "Failed to fetch weather data for selected location. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <p className="app-description">
          Get real-time weather information for any location
        </p>
        <button
          className="instructions-toggle"
          onClick={() => setShowInstructions((v) => !v)}
        >
          {showInstructions ? "Hide Instructions" : "Show Instructions"}
        </button>
      </header>

      <main className={`app-content ${!showInstructions ? "no-instructions" : ""}`}>
        {showInstructions && (
        <section className="instructions">
          <h2>API Integration Challenge</h2>
          <p>
            Welcome to the Weather Dashboard API Integration Challenge! Your
            task is to implement a weather application that integrates with a
            public weather API.
          </p>
          <div className="task-list">
            <h3>Your Tasks:</h3>
            <ol>
              <li>
                <strong>Current Weather Display</strong>
                <p>
                  Implement a search function and display current weather
                  conditions for the searched location.
                </p>
              </li>
              <li>
                <strong>Search Functionality</strong>
                <p>
                  Add autocomplete/suggestions for city search and remember
                  recent searches.
                </p>
              </li>
              <li>
                <strong>Extended Forecast</strong>
                <p>Show a 5-day forecast with temperature and conditions.</p>
              </li>
              <li>
                <strong>Weather Map</strong>
                <p>
                  Implement a visual map showing weather patterns and allow
                  users to select locations from the map.
                </p>
              </li>
              <li>
                <strong>Weather Alerts</strong>
                <p>
                  Display any weather alerts or warnings for the selected
                  location.
                </p>
              </li>
            </ol>
          </div>
          <div className="api-info">
            <h3>Recommended APIs:</h3>
            <ul>
              <li>
                <a
                  href="https://www.weatherapi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WeatherAPI.com
                </a>
              </li>
              <li>
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenWeatherMap
                </a>
              </li>
              <li>
                <a
                  href="https://www.visualcrossing.com/weather-api"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visual Crossing Weather
                </a>
              </li>
            </ul>
          </div>
        </section>
        )}

        <section className="implementation-area">
          <h2>Your Implementation</h2>

          {/* Search Component */}
          <SearchBar
            onSearch={handleSearch}
            searchHistory={searchHistory}
            addToSearchHistory={addToSearchHistory}
          />

          {/* Weather Display Placeholders */}
          <div className="weather-display">
            {isLoading && (
              <div className="loading">Loading weather data...</div>
            )}

            {error && <div className="error-message">{error}</div>}

            {!isLoading && !error && !weatherData && (
              <div className="no-data">
                Search for a location to see weather information
              </div>
            )}

            {weatherData && (
              <div className="weather-content bento-layout">
                {/* Current Weather - Narrow column */}
                <div className="bento-current-weather">
                  <CurrentWeather weatherData={weatherData} />
                </div>

                {/* Weather Map - Wide area */}
                <div className="bento-map">
                  <WeatherMap
                    weatherData={weatherData}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>

                {/* Forecast - Full width bottom */}
                <div className="bento-forecast">
                  <Forecast weatherData={weatherData} />
                </div>

                {/* Alerts - Sidebar */}
                <div className="bento-alerts">
                  <WeatherAlerts weatherData={weatherData} />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          API Integration Challenge | Created for Station Alpha Frontend
          Developer Interviews
        </p>
      </footer>
    </div>
  );
}

export default App;
