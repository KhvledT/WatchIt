import { useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getTrendingAll } from '../services/api'
import { getMovieDetails, getTVDetails } from '../services/api'
import ErrorMessage from '../components/ErrorMessage'
import MovieCard from '../components/MovieCard'
import TVCard from '../components/TVCard'
import SkeletonCard from '../components/SkeletonCard'

type Window = 'day' | 'week'

function Trending() {
  const [searchParams, setSearchParams] = useSearchParams()
  const qc = useQueryClient()
  const win = (searchParams.get('win') as Window) || 'day'
  const query = useQuery({ queryKey: ['trending', win], queryFn: () => getTrendingAll(win) })
  const results = query.data?.results ?? []

  return (
    <section className="relative space-y-10">
      {/* Local decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-100">
        <div className="absolute -inset-24 bg-[radial-gradient(1200px_400px_at_-10%_0%,rgba(59,130,246,0.06),transparent_60%)]" />
        <div className="absolute -inset-24 bg-[radial-gradient(1000px_500px_at_110%_20%,rgba(250,204,21,0.05),transparent_60%)]" />
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(148,163,184,0.06),rgba(148,163,184,0.06)_1px,transparent_1px,transparent_24px),repeating-linear-gradient(90deg,rgba(148,163,184,0.06),rgba(148,163,184,0.06)_1px,transparent_1px,transparent_24px)]" />
      </div>

      {/* Header + tabs */}
      <div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/10">
          <div className="absolute -inset-24 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.18),rgba(15,23,42,0))]" />
          <div className="relative flex items-end justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Trending</h1>
            <div className="flex gap-2">
              {(['day','week'] as Window[]).map((w) => (
                <button
                  key={w}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors border ${win === w ? 'bg-blue-600 border-blue-600 text-white shadow shadow-blue-500/20' : 'bg-transparent border-slate-800 text-slate-300 hover:bg-slate-800'}`}
                  onClick={() => setSearchParams({ win: w })}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {query.isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : query.isError ? (
        <ErrorMessage />
      ) : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {results.map((it: any) => (
              it.media_type === 'movie' ? (
                <div key={`m-${it.id}`} onMouseEnter={() => qc.prefetchQuery({ queryKey: ['movie', it.id], queryFn: () => getMovieDetails(it.id) })}>
                  <MovieCard title={it.title} posterUrl={it.poster_path ? `https://image.tmdb.org/t/p/w342${it.poster_path}` : undefined} caption={it.overview} rating={it.vote_average} to={`/movie/${it.id}`} />
                </div>
              ) : it.media_type === 'tv' ? (
                <div key={`t-${it.id}`} onMouseEnter={() => qc.prefetchQuery({ queryKey: ['tv', it.id], queryFn: () => getTVDetails(it.id) })}>
                  <TVCard name={it.name} posterUrl={it.poster_path ? `https://image.tmdb.org/t/p/w342${it.poster_path}` : undefined} caption={it.overview} rating={it.vote_average} to={`/tv/${it.id}`} />
                </div>
              ) : null
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Trending


