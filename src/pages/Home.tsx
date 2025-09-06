import imgURL from '../assets/imgs/homeHead.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPopularMovies, getPopularTV, getTrendingAll } from '../services/api'
import { getMovieDetails, getTVDetails } from '../services/api'
import MovieCard from '../components/MovieCard'
import TVCard from '../components/TVCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import HorizontalScroll from '../components/HorizontalScroll'
// Remove heavy runtime animations to avoid load issues on route changes

function Home() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const trendingQ = useQuery({ queryKey: ['trending','home'], queryFn: () => getTrendingAll('day') })
  const popularMoviesQ = useQuery({ queryKey: ['popular','movies','home'], queryFn: () => getPopularMovies(1) })
  const popularTVQ = useQuery({ queryKey: ['popular','tv','home'], queryFn: () => getPopularTV(1) })

  const loading = trendingQ.isLoading || popularMoviesQ.isLoading || popularTVQ.isLoading
  const error = trendingQ.isError || popularMoviesQ.isError || popularTVQ.isError

  return (
    <section className="relative space-y-12">
      {/* Local decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-100">
        <div className="absolute -inset-24 bg-[radial-gradient(1200px_400px_at_-10%_0%,rgba(59,130,246,0.06),transparent_60%)]" />
        <div className="absolute -inset-24 bg-[radial-gradient(1000px_500px_at_110%_20%,rgba(250,204,21,0.05),transparent_60%)]" />
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(148,163,184,0.06),rgba(148,163,184,0.06)_1px,transparent_1px,transparent_24px),repeating-linear-gradient(90deg,rgba(148,163,184,0.06),rgba(148,163,184,0.06)_1px,transparent_1px,transparent_24px)]" />
      </div>


      {/* Secondary main section with imported image background */}
      <section className="relative overflow-hidden rounded-2xl border border-black p-8 md:p-12 h-[70vh] flex flex-col items-center justify-center">
        <img src={imgURL} alt="Featured" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        <div className="relative z-20 bg-black/50 p-8 md:p-12 rounded-2xl text-center">
          <h2 className="text-3xl md:text-3xl tracking-tight">Featured Collections</h2>
          <p className="mt-2 text-slate-300 max-w-2xl">Handpicked movies and TV shows to get you started.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate('/movies?category=popular&page=1')} className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20">Browse Movies</button>
            <button onClick={() => navigate('/tv?category=popular&page=1')} className="px-5 py-3 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700">Browse TV</button>
          </div>
        </div>
      </section>
      
      {loading ? <Loader /> : null}
      {error ? <ErrorMessage /> : null}

      {!loading && !error ? (
        <>
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-semibold">Trending</h2>
              <Link to="/trending" className="text-sm text-blue-400 hover:underline">See all</Link>
            </div>
            <HorizontalScroll>
              {trendingQ.data?.results?.map((it: any) => (
                it.media_type === 'movie' ? (
                  <div key={`m-${it.id}`} className="w-40 shrink-0" onMouseEnter={() => qc.prefetchQuery({ queryKey: ['movie', it.id], queryFn: () => getMovieDetails(it.id) })}>
                    <MovieCard title={it.title} posterUrl={it.poster_path ? `https://image.tmdb.org/t/p/w342${it.poster_path}` : undefined} rating={it.vote_average} to={`/movie/${it.id}`} />
                  </div>
                ) : it.media_type === 'tv' ? (
                  <div key={`t-${it.id}`} className="w-40 shrink-0" onMouseEnter={() => qc.prefetchQuery({ queryKey: ['tv', it.id], queryFn: () => getTVDetails(it.id) })}>
                    <TVCard name={it.name} posterUrl={it.poster_path ? `https://image.tmdb.org/t/p/w342${it.poster_path}` : undefined} rating={it.vote_average} to={`/tv/${it.id}`} />
                  </div>
                ) : null
              ))}
            </HorizontalScroll>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

          <div className="space-y-3 border border-slate-800 rounded-2xl md:p-10 p-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-semibold">Popular Movies</h2>
              <Link to="/movies?category=popular&page=1" className="text-sm text-blue-400 hover:underline">Explore</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularMoviesQ.data?.results?.slice(0, 10).map((m: any) => (
                <div key={m.id} onMouseEnter={() => qc.prefetchQuery({ queryKey: ['movie', m.id], queryFn: () => getMovieDetails(m.id) })}>
                  <MovieCard title={m.title} posterUrl={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined} rating={m.vote_average} to={`/movie/${m.id}`} />
                </div>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

          <div className="space-y-3 border border-slate-800 rounded-2xl md:p-10 p-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-semibold">Popular TV Shows</h2>
              <Link to="/tv?category=popular&page=1" className="text-sm text-blue-400 hover:underline">Explore</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularTVQ.data?.results?.slice(0, 10).map((t: any) => (
                <div key={t.id} onMouseEnter={() => qc.prefetchQuery({ queryKey: ['tv', t.id], queryFn: () => getTVDetails(t.id) })}>
                  <TVCard name={t.name} posterUrl={t.poster_path ? `https://image.tmdb.org/t/p/w342${t.poster_path}` : undefined} rating={t.vote_average} to={`/tv/${t.id}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

          <div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 p-6 md:p-8 bg-gradient-to-r from-blue-600/10 via-slate-900 to-amber-400/10">
              <div className="absolute -inset-28 bg-[radial-gradient(400px_200px_at_10%_0%,rgba(59,130,246,0.18),transparent_60%)]" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold">Ready to explore more?</h3>
                  <p className="text-slate-300 mt-1">Dive into daily and weekly trending across movies and TV.</p>
                </div>
                <Link to="/trending" className="inline-block px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20">Browse Trending</Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}

export default Home


