 
import { createRoot } from 'react-dom/client'
import './index.css'
import {HeroUIProvider} from "@heroui/react";
import SessionProvider from './components/SessionProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import NotFound from './pages/NotFound'
 
import RouteError from './components/RouteError'

import Home from './pages/Home'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import Trending from './pages/Trending'
import MovieDetails from './pages/MovieDetails'
import TVDetails from './pages/TVDetails'
import Search from './pages/Search'
import PersonDetails from './pages/PersonDetails'
import Watchlist from './pages/Watchlist'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'movies', element: <Movies /> },
      { path: 'tv', element: <TVShows /> },
      { path: 'trending', element: <Trending /> },
      { path: 'movie/:id', element: <MovieDetails /> },
      { path: 'tv/:id', element: <TVDetails /> },
      { path: 'search', element: <Search /> },
      { path: 'watchlist', element: <Watchlist /> },
      { path: 'person/:id', element: <PersonDetails /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <HeroUIProvider>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </QueryClientProvider>
  </HeroUIProvider>,
)
