import { useState } from "react";
import "./App.css";
import { SearchHistoryItem, WeatherData } from "./types/app.types";
import { getCurrentWeather } from "./services/weatherApi";
import CurrentWeather from "./components/CurrentWeather";

function App() {
  // Weather data state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Error state
  const [error, setError] = useState<string | null>(null);
  // Search query state
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Search history
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const data = await getCurrentWeather(searchQuery);
      setWeatherData(data);
      setSearchHistory((prev) => [
        ...prev,
        { query: searchQuery, timestamp: Date.now() },
      ]);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
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
      </header>

      <main className="app-content">
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

        <section className="implementation-area">
          <h2>Your Implementation</h2>

          {/* Search Component Placeholder */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

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
              <div className="weather-content">
                {/* Current Weather */}
                <CurrentWeather weatherData={weatherData} />

                {/* Forecast Placeholder */}
                <div className="forecast">
                  <h3>Forecast Placeholder</h3>
                  <p>Implement the 5-day forecast here</p>
                </div>

                {/* Weather Map Placeholder */}
                <div className="weather-map">
                  <h3>Weather Map Placeholder</h3>
                  <p>Implement the weather map here</p>
                </div>

                {/* Alerts Placeholder */}
                <div className="weather-alerts">
                  <h3>Weather Alerts Placeholder</h3>
                  <p>Implement weather alerts here</p>
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
