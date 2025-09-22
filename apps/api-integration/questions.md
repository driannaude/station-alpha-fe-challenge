# API Integration Challenge - Questions

1. **API Implementation**
   - Which API did you choose and why?
     - Core weather data (current, 5‑day forecast, alerts) comes from WeatherAPI.com. I chose it for the simple endpoints, generous free tier, and good coverage. For the weather map overlay tiles I used OpenWeatherMap Weather Maps 1.0 (precipitation/temperature/wind/pressure/clouds). Base map tiles are from OpenStreetMap. This combination provides rich visuals while keeping the core data integration straightforward.
   - How did you structure your API service layer?
     - A single service module `src/services/weatherApi.ts` exposes focused functions: `getCurrentWeather`, `getWeatherForecast`, `getWeatherAlerts`, `searchLocations`, plus helpers like `transformWeatherData`, `getWeatherMapUrl`, and caching/search‑history utilities. Environment and cache primitives live in `src/utils/environment.ts` and are re‑exported via `src/utils/index.ts`. The UI imports only these service functions to keep components declarative.
   - How did you handle error cases and rate limiting?
     - Network errors: All fetches check `response.ok` and throw; callers catch and set UI error state (see `App.tsx`). Map tile failures show a localized error with a retry. Environment validation throws a clear, actionable error if keys are missing. Rate limiting: Client‑side mitigation via debounced search (500ms) and localStorage caching with TTLs (default 30 min for weather; 15 min for autocomplete). While I don’t explicitly parse 429 responses, the debounce + caching significantly reduces call volume; exponential backoff could be added if needed.

2. **User Experience**
   - How did you present the weather data effectively?
     - A bento‑style responsive layout: current conditions, an interactive map, a 5‑day forecast, and an alerts panel. The map has a type toggle (precipitation/temp/wind/pressure/clouds) with a simple legend. Forecast cards highlight highs/lows and rain chance. Current conditions surface the essentials (temp, feels like, wind, humidity, UV) with condition icons.
   - How did you handle loading states and errors?
     - Global loading state shows a message; the map uses a spinner overlay and a friendly error fallback with retry. Empty states are explicit: “No forecast data” and “No active weather alerts.” API errors surface a concise banner. Inputs disable/close suggestion lists appropriately while fetching or on blur.
   - What accessibility features did you implement?
     - Semantic structure with headings and buttons, descriptive `alt` text for condition icons and map tiles, clear button labels and disabled states, readable copy, and support for reduced motion via CSS. Controls include titles/tooltips for zoom. The UI is keyboard operable for primary actions; the autocomplete list is clickable and would benefit from additional keyboard navigation/ARIA roles (see Improvements).

3. **Technical Decisions**
   - How did you optimize API calls and performance?
     - Use the WeatherAPI `forecast.json` endpoint (with `alerts=yes`) to fetch current + forecast (+ alerts) in one call. Debounce autocomplete (500ms). LocalStorage caching with expirations prevents redundant requests across sessions. Data is transformed into a compact app shape before reaching components. The map renders only the minimal tile grid needed to cover the container and recalculates on size/zoom changes.
   - How did you handle state management?
     - Local React state in `App.tsx` for `weatherData`, `isLoading`, `error`, and `searchHistory`, passed down via props. Search history persists to localStorage through service helpers. No global store was needed given the app’s scope.
   - How did you ensure the application works well across devices?
     - Responsive CSS grid with breakpoints for mobile/tablet/desktop, plus a ResizeObserver to size the map tile grid to the container. Disabled states and larger click targets help on touch devices. The layout reflows to keep the map readable on small screens.

4. **Challenges**
   - Implementing the interactive slippy‑tile map without a mapping library. Converting container clicks into lat/lon and aligning base and overlay tiles required Web Mercator math, tile wrapping, and clamping. I resolved this by computing center tile/pixel positions, translating click offsets into tile coordinates, I'm still not 100% sure I got it right to be honest, but will be brushing up on some coordinate system knowledge for sure!

5. **Improvements**
   - Accessibility and autocomplete: Add full keyboard navigation for suggestions, ARIA roles (`listbox`/`option`), live region announcements for loading/errors.
   - Data fetching: Move to React Query/SWR for caching, retries, and stale‑while‑revalidate; add exponential backoff for 429/5xx.
   - UX polish: Temperature unit toggle (°C/°F), skeleton loaders, and map pan/drag with inertia (or lightweight map lib) while keeping the current tile overlay approach.
