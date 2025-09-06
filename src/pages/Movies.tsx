import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMovieDetails, getMovieGenres, getDiscoverMovies, type DiscoverMoviesParams } from '../services/api'
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from '../services/api'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import MovieCard from '../components/MovieCard'
import Pagination from '../components/Pagination'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SkeletonCard from '../components/SkeletonCard'
import Modal from '../components/Modal'
import FiltersBar from '../components/FiltersBar'
// Removed heavy route-change animations to prevent load stalls

type Category = 'popular' | 'top_rated' | 'upcoming' | 'now_playing'

const categoryToFetcher: Record<Category, (page: number) => Promise<any>> = {
  popular: getPopularMovies,
  top_rated: getTopRatedMovies,
  upcoming: getUpcomingMovies,
  now_playing: getNowPlayingMovies,
}

function Movies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const qc = useQueryClient()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const category = (searchParams.get('category') as Category) || 'popular'
  const page = Number(searchParams.get('page') || '1')
  const genre = searchParams.get('genre') || ''
  const year = searchParams.get('year') || ''
  const rating = searchParams.get('rating') || ''
  const runtime = searchParams.get('runtime') || ''
  const sort = (searchParams.get('sort') as DiscoverMoviesParams['sort_by']) || ''

  const genresQuery = useQuery({
    queryKey: ['movieGenres'],
    queryFn: () => getMovieGenres(),
    staleTime: 1000 * 60 * 60,
  })

  const useDiscover = Boolean(genre || year || rating || runtime || sort)
  const query = useQuery({
    queryKey: useDiscover ? ['discover', { page, genre, year, rating, runtime, sort }] : ['movies', category, page],
    queryFn: () => {
      if (useDiscover) {
        const params: DiscoverMoviesParams = {
          page,
          with_genres: genre || undefined,
          primary_release_year: year ? Number(year) : undefined,
          'vote_average.gte': rating ? Number(rating) : undefined,
          'with_runtime.gte': runtime ? Number(runtime) : undefined,
          sort_by: sort || undefined,
        }
        return getDiscoverMovies(params)
      }
      return categoryToFetcher[category](page)
    },
  })

  const results = query.data?.results ?? []
  const totalPages = query.data?.total_pages ?? 1

  // Initialize from session storage if no params provided
  useEffect(() => {
    const hasCategory = searchParams.has('category')
    const hasPage = searchParams.has('page')
    if (!hasCategory || !hasPage) {
      const raw = sessionStorage.getItem('watchit_movies_state')
      if (raw) {
        const saved = JSON.parse(raw) as { category: Category; page: number }
        setSearchParams({ category: saved.category, page: String(saved.page) }, { replace: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist current state only when query params are set
  useEffect(() => {
    const hasCategory = searchParams.has('category')
    const hasPage = searchParams.has('page')
    if (hasCategory && hasPage) {
      sessionStorage.setItem('watchit_movies_state', JSON.stringify({ category, page, genre, year, rating, runtime, sort }))
    }
  }, [category, page, genre, year, rating, runtime, sort, searchParams])

  return (
    <section className="relative space-y-10">
      {/* Local decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-100">
        <div className="absolute -inset-24 bg-[radial-gradient(1200px_400px_at_-10%_0%,rgba(59,130,246,0.06),transparent_60%)]" />
        <div className="absolute -inset-24 bg-[radial-gradient(1000px_500px_at_110%_20%,rgba(250,204,21,0.05),transparent_60%)]" />
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(148,163,184,0.06),rgba(148,163,184,0.06)_1px,transparent_1px,transparent_24px),repeating-linear-gradient(90deg,rgba(148,163,184,0.06),rgba(148,163,184,0.06)_1px,transparent_1px,transparent_24px)]" />
      </div>

      {/* Decorative header */}
      <div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/10">
          <div className="absolute -inset-24 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.18),rgba(15,23,42,0))]" />
          <div className="relative flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Movies</h1>
              <p className="mt-2 text-slate-300 max-w-2xl text-sm md:text-base">Browse popular titles, discover top rated gems, see what’s now playing, and what’s coming soon.</p>
            </div>
            <span className="hidden md:inline-block text-sm text-slate-400">Page {page}{query.data?.total_pages ? ` of ${Math.min(500, totalPages)}` : ''}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

      {/* Mobile filters trigger */}
      <div className="md:hidden">
        <button
          className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800"
          onClick={() => setFiltersOpen(true)}
        >
          Filters
        </button>
      </div>

      {/* Sticky filters (desktop/tablet) */}
      <div className="hidden md:block">
        <FiltersBar
          wrapperClassName=""
          categories={[
            { key: 'popular', label: 'popular' },
            { key: 'top_rated', label: 'top rated' },
            { key: 'upcoming', label: 'upcoming' },
            { key: 'now_playing', label: 'now playing' },
          ]}
          activeCategory={category}
          onCategoryChange={(key) => setSearchParams({ category: key as Category, page: '1', genre, year, rating, runtime, sort })}
          genres={genresQuery.data?.genres ?? []}
          genreValue={genre}
          yearValue={year}
          yearPlaceholder="Year"
          ratingValue={rating}
          runtimeValue={runtime}
          sortValue={sort || ''}
          sortOptions={[
            { value: 'popularity.desc', label: 'Popularity ↓' },
            { value: 'popularity.asc', label: 'Popularity ↑' },
            { value: 'vote_average.desc', label: 'Rating ↓' },
            { value: 'vote_average.asc', label: 'Rating ↑' },
            { value: 'release_date.desc', label: 'Release date ↓' },
            { value: 'release_date.asc', label: 'Release date ↑' },
          ]}
          onChange={(u) => setSearchParams({ category, page: '1', genre: u.genre ?? genre, year: u.year ?? year, rating: u.rating ?? rating, runtime: u.runtime ?? runtime, sort: u.sort ?? sort })}
        />
      </div>

      {/* Filters modal for mobile */}
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="space-y-3">
          <div role="tablist" aria-label="Movie categories" className="flex items-center gap-2">
            {(['popular','top_rated','upcoming','now_playing'] as Category[]).map((c) => {
              const active = category === c
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors border ${active ? 'bg-blue-600 border-blue-600 text-white shadow shadow-blue-500/20' : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                  onClick={() => setSearchParams({ category: c, page: '1', genre, year, rating, runtime, sort })}
                >
                  {c.replace('_',' ')}
                </button>
              )
            })}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <select aria-label="Genre" className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm" value={genre} onChange={(e) => setSearchParams({ category, page: '1', genre: e.target.value, year, rating, runtime, sort })}>
              <option value="">All Genres</option>
              {genresQuery.data?.genres?.map((g) => (
                <option key={g.id} value={String(g.id)}>{g.name}</option>
              ))}
            </select>
            <input aria-label="Year" type="number" placeholder="Year" className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm" value={year} onChange={(e) => setSearchParams({ category, page: '1', genre, year: e.target.value, rating, runtime, sort })} />
            <input aria-label="Min rating" type="number" min={0} max={10} step="0.1" placeholder="Min rating" className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm" value={rating} onChange={(e) => setSearchParams({ category, page: '1', genre, year, rating: e.target.value, runtime, sort })} />
            <input aria-label="Min runtime" type="number" min={0} placeholder="Min runtime (min)" className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm" value={runtime} onChange={(e) => setSearchParams({ category, page: '1', genre, year, rating, runtime: e.target.value, sort })} />
            <select aria-label="Sort by" className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm" value={sort} onChange={(e) => setSearchParams({ category, page: '1', genre, year, rating, runtime, sort: e.target.value })}>
              <option value="">Default sort</option>
              <option value="popularity.desc">Popularity ↓</option>
              <option value="popularity.asc">Popularity ↑</option>
              <option value="vote_average.desc">Rating ↓</option>
              <option value="vote_average.asc">Rating ↑</option>
              <option value="release_date.desc">Release date ↓</option>
              <option value="release_date.asc">Release date ↑</option>
            </select>
          </div>
          <div className="pt-2 text-right">
            <button className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800" onClick={() => setFiltersOpen(false)}>Done</button>
          </div>
        </div>
      </Modal>

      {query.isLoading ? <Loader /> : null}
      {query.isError ? <ErrorMessage /> : null}

      {query.isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !query.isError ? (
        <>
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {results.map((m: any) => (
                <div key={m.id} onMouseEnter={() => qc.prefetchQuery({ queryKey: ['movie', m.id], queryFn: () => getMovieDetails(m.id) })}>
                  <MovieCard title={m.title} posterUrl={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined} caption={m.overview} rating={m.vote_average} to={`/movie/${m.id}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Pagination
              page={page}
              totalPages={Math.min(500, totalPages)}
              onChange={(p) => setSearchParams({ category, page: String(p), genre, year, rating, runtime, sort })}
            />
          </div>

          {/* Bottom CTA */}
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 p-6 md:p-8 bg-gradient-to-r from-blue-600/10 via-slate-900 to-amber-400/10">
              <div className="absolute -inset-28 bg-[radial-gradient(400px_200px_at_10%_0%,rgba(59,130,246,0.18),transparent_60%)]" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold">Want TV shows instead?</h3>
                  <p className="text-slate-300 mt-1">Switch over to see what’s trending on TV right now.</p>
                </div>
                <a href="/tv?category=popular&page=1" className="inline-block px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20">Browse TV</a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ErrorMessage />
      )}
    </section>
  )
}

export default Movies


