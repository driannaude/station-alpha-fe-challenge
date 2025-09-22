import { useState, useEffect, FormEvent, useCallback } from "react";
import { SearchHistoryItem } from "../types/app.types";
import { searchLocations } from "../services/weatherApi";
import { WeatherApiLocationSearchResult } from "../types/api.types";
import {
  useDebounce,
  DEBOUNCE_DELAYS,
  formatLocationString,
  searchUIHelpers,
  isValidSearchQuery,
  isSearchInputFocused,
} from "../utils";

interface SearchBarProps {
  onSearch: (location: string) => void;
  searchHistory: SearchHistoryItem[];
  addToSearchHistory: (query: string) => void;
}

const SearchBar = ({
  onSearch,
  searchHistory,
  addToSearchHistory,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    WeatherApiLocationSearchResult[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Create the fetch function that will be debounced
  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      if (!isValidSearchQuery(searchQuery)) {
        setSuggestions([]);
        // Show history when no search query, hide suggestions
        if (isSearchInputFocused()) {
          setShowHistory(searchHistory.length > 0);
          setShowSuggestions(false);
        }
        return;
      }

      try {
        const results = await searchLocations(searchQuery);
        setSuggestions(results);
        // Show suggestions when we have query results, hide history
        if (isSearchInputFocused()) {
          setShowSuggestions(results.length > 0);
          setShowHistory(false);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [searchHistory.length]
  );

  const debouncedFetchSuggestions = useDebounce(
    fetchSuggestions,
    DEBOUNCE_DELAYS.SEARCH
  );

  // Effect to trigger debounced search when query changes
  useEffect(() => {
    debouncedFetchSuggestions(query);
  }, [query, debouncedFetchSuggestions]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      addToSearchHistory(query);
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };

  const handleSuggestionClick = (
    suggestion: WeatherApiLocationSearchResult
  ) => {
    const locationString = formatLocationString(suggestion);
    setQuery(locationString);
    onSearch(locationString);
    addToSearchHistory(locationString);
    setShowSuggestions(false);
    setShowHistory(false);
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    onSearch(historyItem);
    setShowHistory(false);
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (!isValidSearchQuery(query)) {
                setShowHistory(searchHistory.length > 0);
                setShowSuggestions(false);
              } else {
                setShowSuggestions(true);
                setShowHistory(false);
              }
            }}
            onBlur={searchUIHelpers.createBlurHandler(() => {
              setShowSuggestions(false);
              setShowHistory(false);
            })}
            placeholder="Search for a city or zip code..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {formatLocationString(suggestion)}
              </li>
            ))}
          </ul>
        )}

        {/* Search history dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="search-history">
            <h4>Recent Searches</h4>
            <ul className="history-list">
              {searchHistory.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleHistoryClick(item.query)}
                  className="history-item"
                >
                  {item.query}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
