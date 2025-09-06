import axios, { type AxiosInstance } from 'axios'

// Base URLs
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// API keys/config (support either v3 api_key or v4 bearer token)
const TMDB_API_KEY: string | undefined = (import.meta as any).env?.VITE_TMDB_API_KEY
// Fallback to README token if env not provided
const DEFAULT_TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwN2FlOGZlZTE1MDllMWRmYmVmYzZmMTNlOWVjMWQ1MSIsIm5iZiI6MTc1MzA3NDYyNi4xODQsInN1YiI6IjY4N2RjYmMyMDFmN2QwMjQzODhhNGFiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4oDt7ahKDwJhUgzTg-zv_Qsuo_nIlHAKQ7OKofKn5Dg'
const TMDB_ACCESS_TOKEN: string | undefined = (import.meta as any).env?.VITE_TMDB_ACCESS_TOKEN || (import.meta as any).env?.VITE_TMDB_BEARER_TOKEN || DEFAULT_TMDB_ACCESS_TOKEN

// Axios instances
export const tmdbApi: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  params: TMDB_API_KEY ? { api_key: TMDB_API_KEY } : undefined,
  headers: TMDB_ACCESS_TOKEN ? { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` } : undefined,
})
// Normalize errors
tmdbApi.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.status_message || error.message || 'Request failed'
    return Promise.reject(new Error(`${status ?? ''} ${message}`.trim()))
  }
)

// Types (minimal, extend as needed)
export type PaginatedResponse<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type MovieSummary = {
  id: number
  title: string
  overview?: string
  poster_path?: string
  release_date?: string
  vote_average?: number
}

export type TVSummary = {
  id: number
  name: string
  overview?: string
  poster_path?: string
  first_air_date?: string
  vote_average?: number
}

export type PersonSummary = {
  id: number
  name: string
  profile_path?: string
  known_for_department?: string
}

export type Review = {
  id: string
  author: string
  content: string
}

export type Credit = {
  id: number
  name: string
  character?: string
  profile_path?: string
}

export type Video = {
  id: string
  key: string
  name: string
  site: 'YouTube' | string
  type: string
}

export type Genre = { id: number; name: string }

// Helpers
const get = async <T>(url: string, params?: Record<string, unknown>) => {
  const { data } = await tmdbApi.get<T>(url, { params })
  return data
}

// Movies
export const getPopularMovies = (page = 1) => get<PaginatedResponse<MovieSummary>>('/movie/popular', { page })
export const getTopRatedMovies = (page = 1) => get<PaginatedResponse<MovieSummary>>('/movie/top_rated', { page })
export const getUpcomingMovies = (page = 1) => get<PaginatedResponse<MovieSummary>>('/movie/upcoming', { page })
export const getNowPlayingMovies = (page = 1) => get<PaginatedResponse<MovieSummary>>('/movie/now_playing', { page })
export const getMovieDetails = (id: number) => get<any>(`/movie/${id}`)
export const getMovieSimilar = (id: number, page = 1) => get<PaginatedResponse<MovieSummary>>(`/movie/${id}/similar`, { page })
export const getMovieCredits = (id: number) => get<{ cast: Credit[] }>(`/movie/${id}/credits`)
export const getMovieReviews = (id: number, page = 1) => get<PaginatedResponse<Review>>(`/movie/${id}/reviews`, { page })
export const getMovieVideos = (id: number) => get<{ results: Video[] }>(`/movie/${id}/videos`)

// TV Shows
export const getPopularTV = (page = 1) => get<PaginatedResponse<TVSummary>>('/tv/popular', { page })
export const getTopRatedTV = (page = 1) => get<PaginatedResponse<TVSummary>>('/tv/top_rated', { page })
export const getOnTheAirTV = (page = 1) => get<PaginatedResponse<TVSummary>>('/tv/on_the_air', { page })
export const getTVDetails = (id: number) => get<any>(`/tv/${id}`)
export const getTVSimilar = (id: number, page = 1) => get<PaginatedResponse<TVSummary>>(`/tv/${id}/similar`, { page })
export const getTVCredits = (id: number) => get<{ cast: Credit[] }>(`/tv/${id}/credits`)
export const getTVReviews = (id: number, page = 1) => get<PaginatedResponse<Review>>(`/tv/${id}/reviews`, { page })
export const getTVVideos = (id: number) => get<{ results: Video[] }>(`/tv/${id}/videos`)

// Trending
export const getTrendingAll = (timeWindow: 'day' | 'week' = 'day') => get<PaginatedResponse<any>>(`/trending/all/${timeWindow}`)

// People
export const getPopularPeople = (page = 1) => get<PaginatedResponse<PersonSummary>>('/person/popular', { page })
export const getPersonDetails = (id: number) => get<any>(`/person/${id}`)
export const getPersonCombinedCredits = (id: number) => get<any>(`/person/${id}/combined_credits`)

// Search
export const searchMovies = (query: string, page = 1) => get<PaginatedResponse<MovieSummary>>('/search/movie', { query, page })
export const searchTV = (query: string, page = 1) => get<PaginatedResponse<TVSummary>>('/search/tv', { query, page })
export const searchPeople = (query: string, page = 1) => get<PaginatedResponse<PersonSummary>>('/search/person', { query, page })
// Genres
export const getMovieGenres = () => get<{ genres: Genre[] }>('/genre/movie/list')
export const getTVGenres = () => get<{ genres: Genre[] }>('/genre/tv/list')

// Discover
export type DiscoverMoviesParams = {
  page?: number
  with_genres?: string // comma separated ids
  primary_release_year?: number
  'vote_average.gte'?: number
  'with_runtime.gte'?: number
  sort_by?:
    | 'popularity.desc'
    | 'popularity.asc'
    | 'vote_average.desc'
    | 'vote_average.asc'
    | 'release_date.desc'
    | 'release_date.asc'
}
export const getDiscoverMovies = (params: DiscoverMoviesParams) => get<PaginatedResponse<MovieSummary>>('/discover/movie', params)

export type DiscoverTVParams = {
  page?: number
  with_genres?: string
  first_air_date_year?: number
  'vote_average.gte'?: number
  'with_runtime.gte'?: number
  sort_by?:
    | 'popularity.desc'
    | 'popularity.asc'
    | 'vote_average.desc'
    | 'vote_average.asc'
    | 'first_air_date.desc'
    | 'first_air_date.asc'
}
export const getDiscoverTV = (params: DiscoverTVParams) => get<PaginatedResponse<TVSummary>>('/discover/tv', params)

// Favorites (custom backend)
// Favorites and site reviews backend removed in this build


