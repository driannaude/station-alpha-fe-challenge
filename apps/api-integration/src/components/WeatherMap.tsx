import { useState, useEffect, useRef } from "react";
import { getEnvironmentConfig } from "../utils/environment";
import { WeatherData } from "../types/app.types";

interface WeatherMapProps {
  weatherData: WeatherData;
  onLocationSelect: (lat: number, lon: number) => void;
}

const WeatherMap = ({ weatherData, onLocationSelect }: WeatherMapProps) => {
  const [mapType, setMapType] = useState<string>("precipitation");
  const [zoom, setZoom] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Get coordinates from weatherData
  const lat = weatherData.location.lat;
  const lon = weatherData.location.lon;

  // Update map when dependencies change
  useEffect(() => {
    setIsLoading(true);
    setImageError(false);

    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [weatherData, mapType, zoom, lat, lon]);

  // Observe container size to determine how many tiles to render
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () =>
      setContainerSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Generate weather map tile URL for specific tile coordinates
  const getWeatherMapTileUrl = (
    tileX: number,
    tileY: number,
    zoom: number,
    mapType: string
  ): string => {
    // Map logical types to OpenWeather Weather Maps 1.0 layer names
    const layerMapping: Record<string, string> = {
      precipitation: "precipitation_new",
      temp: "temp_new",
      wind: "wind_new",
      pressure: "pressure_new",
      clouds: "clouds_new",
    };

    const layer = layerMapping[mapType] || layerMapping.precipitation;

    // Get API key from environment config
    const config = getEnvironmentConfig();

    return `https://tile.openweathermap.org/map/${layer}/${zoom}/${tileX}/${tileY}.png?appid=${config.weather.map.apiKey}`;
  };

  // Generate multiple tiles to fully cover the container
  const generateTileGrid = (
    lat: number,
    lon: number,
    zoom: number,
    width: number,
    height: number
  ) => {
    const n = Math.pow(2, zoom);
    const centerTileX = Math.floor(((lon + 180) / 360) * n);
    const latRad = (lat * Math.PI) / 180;
    const centerTileY = Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
        n
    );

    const tiles = [];

    // Determine how many tiles we need to cover container plus 1 margin on each side
    const tilesX = Math.max(3, Math.ceil(width / 256) + 2);
    const tilesY = Math.max(3, Math.ceil(height / 256) + 2);
    const halfX = Math.floor(tilesX / 2);
    const halfY = Math.floor(tilesY / 2);

    for (let dy = -halfY; dy <= halfY; dy++) {
      for (let dx = -halfX; dx <= halfX; dx++) {
        const tileX = (((centerTileX + dx) % n) + n) % n; // wrap around
        const tileY = Math.max(0, Math.min(n - 1, centerTileY + dy));

        tiles.push({
          x: tileX,
          y: tileY,
          offsetX: dx * 256,
          offsetY: dy * 256,
          baseMapUrl: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
          weatherMapUrl: getWeatherMapTileUrl(tileX, tileY, zoom, mapType),
        });
      }
    }

    return tiles;
  };

  // Calculate the exact pixel position within a tile for the center point
  const getCenterPixelPosition = (lat: number, lon: number, zoom: number) => {
    const n = Math.pow(2, zoom);
    const tileX = ((lon + 180) / 360) * n;
    const latRad = (lat * Math.PI) / 180;
    const tileY =
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      n;

    // Get the pixel position within the tile (0-256)
    const pixelX = (tileX - Math.floor(tileX)) * 256;
    const pixelY = (tileY - Math.floor(tileY)) * 256;

    return {
      pixelX,
      pixelY,
      tileX: Math.floor(tileX),
      tileY: Math.floor(tileY),
    };
  };

  const tiles = generateTileGrid(
    lat,
    lon,
    zoom,
    containerSize.width,
    containerSize.height
  );
  const centerPixel = getCenterPixelPosition(lat, lon, zoom);
  // Scale pin size with zoom so it feels anchored
  const pinSize = Math.max(16, Math.min(36, 12 + zoom * 1.2));

  // Get description for current map type
  const getMapTypeDescription = (type: string): string => {
    switch (type) {
      case "precipitation":
        return "Shows rainfall and precipitation intensity across the area";
      case "temp":
        return "Displays temperature variations with color-coded zones";
      case "wind":
        return "Visualizes wind speed and direction patterns";
      case "pressure":
        return "Shows atmospheric pressure systems and isobars";
      case "clouds":
        return "Displays cloud coverage and density";
      default:
        return "Weather data overlay";
    }
  };
  // TODO: Not really happy with this implementation, it's messy and the multiple coordinate systems
  //  are confusing. Need to revisit and clean up later.
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click position relative to the map container
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Calculate the tile coordinates and pixel position for our center point
    const n = Math.pow(2, zoom);
    const centerTileX = ((lon + 180) / 360) * n;
    const centerLatRad = (lat * Math.PI) / 180;
    const centerTileY =
      ((1 -
        Math.log(Math.tan(centerLatRad) + 1 / Math.cos(centerLatRad)) /
          Math.PI) /
        2) *
      n;

    // Get the pixel position within the center tile
    const centerPixelX = (centerTileX - Math.floor(centerTileX)) * 256;
    const centerPixelY = (centerTileY - Math.floor(centerTileY)) * 256;

    // Calculate the offset from center in container pixels
    const offsetX = clickX - containerWidth / 2;
    const offsetY = clickY - containerHeight / 2;

    // With tiles rendered at 1:1 size, container pixels equal tile pixels
    const tilePixelOffsetX = offsetX;
    const tilePixelOffsetY = offsetY;

    // Calculate the absolute pixel position in the tile coordinate system
    // We need to account for our center point being offset within its tile
    const absolutePixelX =
      Math.floor(centerTileX) * 256 + centerPixelX + tilePixelOffsetX;
    const absolutePixelY =
      Math.floor(centerTileY) * 256 + centerPixelY + tilePixelOffsetY;

    // Convert absolute pixel coordinates back to tile coordinates
    const clickTileX = absolutePixelX / 256;
    const clickTileY = absolutePixelY / 256;

    // Convert tile coordinates back to lat/lon
    const clickLon = (clickTileX / n) * 360 - 180;
    const clickLatRad = Math.atan(
      Math.sinh(Math.PI * (1 - (2 * clickTileY) / n))
    );
    const clickLat = (clickLatRad * 180) / Math.PI;

    // Clamp coordinates to valid ranges
    const clampedLat = Math.max(-85.0511, Math.min(85.0511, clickLat));
    const clampedLon = Math.max(-180, Math.min(180, clickLon));

    console.log(
      `Clicked at: ${clampedLat.toFixed(4)}, ${clampedLon.toFixed(4)}`
    );
    onLocationSelect(clampedLat, clampedLon);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 3));
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  return (
    <div className="weather-map-container">
      <h3>Interactive Weather Map</h3>

      <div className="map-controls">
        <div className="map-type-selector">
          <button
            className={mapType === "precipitation" ? "active" : ""}
            onClick={() => setMapType("precipitation")}
          >
            Precipitation
          </button>
          <button
            className={mapType === "temp" ? "active" : ""}
            onClick={() => setMapType("temp")}
          >
            Temperature
          </button>
          <button
            className={mapType === "wind" ? "active" : ""}
            onClick={() => setMapType("wind")}
          >
            Wind
          </button>
          <button
            className={mapType === "pressure" ? "active" : ""}
            onClick={() => setMapType("pressure")}
          >
            Pressure
          </button>
          <button
            className={mapType === "clouds" ? "active" : ""}
            onClick={() => setMapType("clouds")}
          >
            Clouds
          </button>
        </div>

        <div className="zoom-controls">
          <button onClick={handleZoomOut} disabled={zoom <= 3} title="Zoom Out">
            −
          </button>
          <span className="zoom-level">{zoom}</span>
          <button onClick={handleZoomIn} disabled={zoom >= 18} title="Zoom In">
            +
          </button>
        </div>
      </div>

      <div
        className="map-container"
        ref={containerRef}
        onClick={handleMapClick}
      >
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {imageError && (
          <div className="map-error">
            <p>⚠️ Unable to load map data</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!imageError && (
          <div className="map-tiles-container">
            {/* Base map tiles */}
            {tiles.map((tile, index) => (
              <div key={`base-${index}`}>
                <img
                  src={tile.baseMapUrl}
                  alt="Base map tile"
                  className="base-map-tile"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    // Tiles are already centered via CSS (top/left 50% with -128px margins)
                    // So only adjust by tile offsets and the pixel offset within the center tile
                    transform: `translate(${tile.offsetX + (128 - centerPixel.pixelX)}px, ${tile.offsetY + (128 - centerPixel.pixelY)}px)`,
                  }}
                />
              </div>
            ))}

            {/* Weather overlay tiles */}
            {tiles.map((tile, index) => (
              <div key={`weather-${index}`}>
                <img
                  src={tile.weatherMapUrl}
                  alt={`${mapType} weather tile`}
                  className="weather-overlay-tile"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    opacity: isLoading ? 0.3 : 0.7,
                    transform: `translate(${tile.offsetX + (128 - centerPixel.pixelX)}px, ${tile.offsetY + (128 - centerPixel.pixelY)}px)`,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Weather info overlay */}
        <div className="weather-info-overlay">
          <div className="current-weather-mini">
            <span className="temp">{weatherData.current.temp_c}°C</span>
            <span className="condition">
              {weatherData.current.condition.text}
            </span>
            <span className="wind">
              Wind: {weatherData.current.wind_kph} km/h{" "}
              {weatherData.current.wind_dir}
            </span>
          </div>
        </div>

        <div className="map-overlay">
          <p className="map-instructions">
            Click anywhere on the map to get weather for that location
          </p>
        </div>

        {/* Location marker */}
        <div
          className="location-marker"
          title={`${weatherData.location.name} (${lat.toFixed(4)}, ${lon.toFixed(4)})`}
          style={{ fontSize: `${pinSize}px` }}
        >
          📍
        </div>

        {/* Weather legend */}
        <div className="weather-legend">
          <h4>Legend</h4>
          {mapType === "precipitation" && (
            <div className="legend-items">
              <span className="legend-item">🟦 Light</span>
              <span className="legend-item">🟨 Moderate</span>
              <span className="legend-item">🟧 Heavy</span>
              <span className="legend-item">🟥 Extreme</span>
            </div>
          )}
          {mapType === "temp" && (
            <div className="legend-items">
              <span className="legend-item">🟦 Cold</span>
              <span className="legend-item">🟩 Cool</span>
              <span className="legend-item">🟨 Warm</span>
              <span className="legend-item">🟥 Hot</span>
            </div>
          )}
          {mapType === "wind" && (
            <div className="legend-items">
              <span className="legend-item">🟦 Light</span>
              <span className="legend-item">🟩 Moderate</span>
              <span className="legend-item">🟨 Strong</span>
              <span className="legend-item">🟥 Extreme</span>
            </div>
          )}
          {mapType === "pressure" && (
            <div className="legend-items">
              <span className="legend-item">🟦 Low</span>
              <span className="legend-item">🟩 Normal</span>
              <span className="legend-item">🟨 High</span>
              <span className="legend-item">🟥 Very High</span>
            </div>
          )}
          {mapType === "clouds" && (
            <div className="legend-items">
              <span className="legend-item">🟦 Clear</span>
              <span className="legend-item">🟩 Partly</span>
              <span className="legend-item">🟨 Cloudy</span>
              <span className="legend-item">🟥 Overcast</span>
            </div>
          )}
        </div>
      </div>

      <div className="map-footer">
        <div className="map-footer-main">
          <div className="map-info-primary">
            <p>
              Showing <strong>{mapType}</strong> data for{" "}
              <strong>
                {weatherData.location.name}, {weatherData.location.country}
              </strong>
            </p>
            <p className="map-description">{getMapTypeDescription(mapType)}</p>
          </div>
          <div className="map-info-secondary">
            <p className="map-coordinates">
              {lat.toFixed(4)}°N, {lon.toFixed(4)}°E • Zoom: {zoom}
            </p>
            <p className="map-source">
              Data: OpenWeatherMap • Map: OpenStreetMap
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;
