import { useMemo } from 'react'
import SearchBar from '../components/SearchBar'
import { useQuery } from '@tanstack/react-query'
import { searchMovies, searchPeople, searchTV, getTrendingAll } from '../services/api'
import ErrorMessage from '../components/ErrorMessage'
import MovieCard from '../components/MovieCard'
import TVCard from '../components/TVCard'
import { useSearchParams } from 'react-router-dom'
import PersonCard from '../components/PersonCard'
import SkeletonCard from '../components/SkeletonCard'

function Search() {
  const [params, setParams] = useSearchParams()
  const query = useMemo(() => params.get('q') ?? '', [params])
  const trendingQ = useQuery({
    queryKey: ['trending', 'default', 'search'],
    queryFn: () => getTrendingAll('day'),
    enabled: query.length === 0,
  })
  const moviesQ = useQuery({
    queryKey: ['search', 'movies', query],
    queryFn: () => searchMovies(query),
    enabled: query.length > 0,
  })
  const tvQ = useQuery({
    queryKey: ['search', 'tv', query],
    queryFn: () => searchTV(query),
    enabled: query.length > 0,
  })
  const peopleQ = useQuery({
    queryKey: ['search', 'people', query],
    queryFn: () => searchPeople(query),
    enabled: query.length > 0,
  })

  const loading = moviesQ.isLoading || tvQ.isLoading || peopleQ.isLoading
  const error = moviesQ.isError || tvQ.isError || peopleQ.isError
  const movies = moviesQ.data?.results ?? []
  const tv = tvQ.data?.results ?? []
  const people = peopleQ.data?.results ?? []
  const hasResults = movies.length + tv.length + people.length > 0
  const hasDefault = Array.isArray(trendingQ.data?.results) && trendingQ.data!.results!.length > 0

  return (
    <section className="relative space-y-8">
      {/* Local decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-100">
        <div className="absolute -inset-24 bg-[radial-gradient(1200px_400px_at_-10%_0%,rgba(59,130,246,0.06),transparent_60%)]" />
        <div className="absolute -inset-24 bg-[radial-gradient(1000px_500px_at_110%_20%,rgba(250,204,21,0.05),transparent_60%)]" />
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(148,163,184,0.06),rgba(148,163,184,0.06)_1px,transparent_1px,transparent_24px),repeating-linear-gradient(90deg,rgba(148,163,184,0.06),rgba(148,163,184,0.06)_1px,transparent_1px,transparent_24px)]" />
      </div>

      {/* Decorative header with search */}
      <div className="relative overflow-visible rounded-2xl border border-slate-800 p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/10">
        <div className="absolute -inset-24 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.18),rgba(15,23,42,0))]" />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Search</h1>
            <p className="mt-2 text-slate-300 max-w-2xl text-sm md:text-base">Find movies, TV shows, and people.</p>
          </div>
          <div className="w-full md:w-auto">
            <SearchBar
              value={query}
              onSearch={(val) => {
                const q = (val || '').trim()
                if (q) setParams({ q })
                else setParams({}, { replace: true })
              }}
            />
          </div>
        </div>
      </div>

      {/* Default results for small screens when no query */}
      {!query ? (
        <div className="md:hidden">
          {trendingQ.isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : trendingQ.isError ? (
            <ErrorMessage />
          ) : hasDefault ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">Trending today</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {trendingQ.data!.results!.map((it: any) => (
                  it.media_type === 'movie' ? (
                    <MovieCard key={`m-${it.id}`} title={it.title} posterUrl={it.poster_path ? `https://image.tmdb.org/t/p/w342${it.poster_path}` : undefined} caption={it.overview} rating={it.vote_average} to={`/movie/${it.id}`} />
                  ) : it.media_type === 'tv' ? (
                    <TVCard key={`t-${it.id}`} name={it.name} posterUrl={it.poster_path ? `https://image.tmdb.org/t/p/w342${it.poster_path}` : undefined} caption={it.overview} rating={it.vote_average} to={`/tv/${it.id}`} />
                  ) : null
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorMessage />
      ) : null}
      {query && !loading && !error ? (
        <div className="space-y-6">
          {!hasResults ? (
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/10 text-center">
              <div className="absolute -inset-24 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.12),rgba(15,23,42,0))]" />
              <div className="relative">
                <h3 className="text-xl md:text-2xl font-semibold">No results found</h3>
                <p className="mt-2 text-slate-300">Try a different search term, or go back to the Home page.</p>
                <a href="/" className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow shadow-blue-500/20">Return Home</a>
              </div>
            </div>
          ) : null}
          {movies.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold">Movies</h2>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((m) => (
                  <MovieCard key={m.id} title={m.title} posterUrl={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined} caption={m.overview} rating={m.vote_average} to={`/movie/${m.id}`} />
                ))}
              </div>
            </div>
          ) : null}
          {tv.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold">TV Shows</h2>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tv.map((t) => (
                  <TVCard key={t.id} name={t.name} posterUrl={t.poster_path ? `https://image.tmdb.org/t/p/w342${t.poster_path}` : undefined} caption={t.overview} rating={t.vote_average} to={`/tv/${t.id}`} />
                ))}
              </div>
            </div>
          ) : null}
          {people.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold">People</h2>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {people.map((p) => (
                  <PersonCard key={p.id} name={p.name} profileUrl={p.profile_path ? `https://image.tmdb.org/t/p/w185${p.profile_path}` : undefined} to={`/person/${p.id}`} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export default Search


