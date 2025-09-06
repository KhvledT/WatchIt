# WatchIt — Movies & TV Explorer

Hi, I’m Khaled Tareq. I built WatchIt to explore movies and TV shows using the TMDB API with a clean, fast, and mobile‑first UX. The app supports rich discovery, typeahead search, watchlist persistence, and smooth navigation with React Router.

## What this project does
- Browse trending, popular movies and TV shows
- Filter by genre, year, rating, runtime, and sort order (Movies & TV)
- Search with debounced suggestions and recent searches
- See details pages with trailers, cast, reviews, and similar titles
- Add/remove items from a persistent watchlist (localStorage)
- Prefetch details on hover for snappy navigation
- Responsive UI with keyboard navigation and accessible controls

## Tech stack & tools I used
- React + TypeScript (Vite)
- React Router v6 (`createBrowserRouter`, `RouterProvider`)
- TanStack Query (React Query) for data fetching/caching
- Axios for HTTP requests
- Tailwind CSS utility classes for styling
- HeroUI (`@heroui/react`) for Navbar and layout primitives
- Netlify redirects for SPA routing (`public/_redirects`)

## Project structure
```
.
├─ public/
│  ├─ _redirects           # Netlify SPA routing → index.html
│  ├─ favicon.svg / .ico   # Icons
│  └─ logo.svg             # App logo
├─ src/
│  ├─ components/
│  │  ├─ Modal.tsx         # Reusable modal (portal to document.body)
│  │  ├─ Navbar.tsx, Footer.tsx, BackButton.tsx
│  │  ├─ MovieCard.tsx, TVCard.tsx, PersonCard.tsx, CastCard.tsx
│  │  ├─ SearchBar.tsx     # Debounced suggestions + recent
│  │  ├─ Pagination.tsx, Loader.tsx, ErrorMessage.tsx, SkeletonCard.tsx
│  │  └─ HorizontalScroll.tsx
│  ├─ hooks/
│  │  └─ useWatchlist.ts   # Watchlist (localStorage + cross‑tab sync)
│  ├─ layouts/
│  │  └─ MainLayout.tsx    # Navbar + Footer + content outlet
│  ├─ pages/
│  │  ├─ Home.tsx          # Trending + popular sections
│  │  ├─ Movies.tsx        # Categories + discover filters + pagination
│  │  ├─ TVShows.tsx       # Categories + discover filters + pagination
│  │  ├─ Trending.tsx
│  │  ├─ Search.tsx        # Search + default trending on small screens
│  │  ├─ MovieDetails.tsx  # Trailer, cast, reviews, similar
│  │  ├─ TVDetails.tsx     # Trailer, cast, reviews, similar
│  │  ├─ PersonDetails.tsx
│  │  ├─ Watchlist.tsx
│  │  └─ NotFound.tsx
│  ├─ services/
│  │  └─ api.ts            # TMDB API client & helpers
│  ├─ components/SessionProvider.tsx
│  ├─ index.css
│  └─ main.tsx             # Router + providers bootstrap
└─ README.md
```

## Routing
- `/` Home
- `/movies` Movie catalog (categories + filters + pagination)
- `/tv` TV shows catalog (categories + filters + pagination)
- `/trending` Trending all
- `/movie/:id` Movie details
- `/tv/:id` TV details
- `/person/:id` Person details
- `/search` Full‑page search
- `/watchlist` Persistent watchlist

The router uses `createBrowserRouter` with an `errorElement` (`RouteError`) for graceful failures.

## State & persistence
- TanStack Query caches TMDB responses for responsive navigation
- Watchlist saves to `localStorage` under `watchit_watchlist`
- Session id stored in `localStorage` as `watchit_session_id`
- Recent searches in `localStorage` as `watchit_recent_searches`
- Last catalog state in `sessionStorage`:
  - `watchit_movies_state`
  - `watchit_tv_state`

## API & environment variables
This app talks to TMDB v3/v4. Configure one or both in a `.env` file at the project root:

```
VITE_TMDB_API_KEY=your_tmdb_v3_key_optional
VITE_TMDB_ACCESS_TOKEN=your_tmdb_v4_bearer_token_optional
```

Notes:
- The API client (`src/services/api.ts`) supports either v3 `api_key` or v4 Bearer token. If you provide both, the Bearer token is used for Authorization and the api key is sent as a param.
- A fallback demo token exists in the code for local trials. Replace it with your own credentials for production.

## Getting started
Prerequisites: Node.js 18+ and npm (or pnpm/yarn).

Install and run:
```bash
npm install
npm run dev
```

Build and preview:
```bash
npm run build
npm run preview
```

## Deployment
- Netlify: `public/_redirects` contains `/* /index.html 200` to support client‑side routing.
- Any static hosting that serves `index.html` for unknown routes will work.

## UX highlights
- Debounced search with keyboard navigation and recent history
- Discover filters with URL and session persistence
- Trailer modal rendered via portal for robust layering
- Prefetch on hover for details pages
- Accessible controls and responsive layout

## A note on simulator warnings
If you see an iframe sandbox warning referencing `simulator.js`, it’s emitted by the device emulator, not by this app (our YouTube iframes don’t use `sandbox`). It’s safe to ignore during local testing.

## Author
Built by Khaled Tareq. I hope you enjoy exploring movies and TV with WatchIt.
