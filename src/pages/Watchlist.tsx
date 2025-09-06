import MovieCard from '../components/MovieCard'
import TVCard from '../components/TVCard'
import { useWatchlist } from '../hooks/useWatchlist'

function Watchlist() {
  const { items, remove } = useWatchlist()
  const movies = items.filter((i) => i.type === 'movie')
  const tv = items.filter((i) => i.type === 'tv')

  const Empty = (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/10 text-center">
      <div className="absolute -inset-24 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.12),rgba(15,23,42,0))]" />
      <div className="relative">
        <h3 className="text-xl md:text-2xl font-semibold">Your watchlist is empty</h3>
        <p className="mt-2 text-slate-300">Browse Movies or TV Shows and add items to your watchlist.</p>
      </div>
    </div>
  )

  return (
    <section className="relative space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/10">
        <div className="absolute -inset-24 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.18),rgba(15,23,42,0))]" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Watchlist</h1>
          <p className="mt-2 text-slate-300 max-w-2xl text-sm md:text-base">All your saved movies and TV shows.</p>
        </div>
      </div>

      {items.length === 0 ? Empty : null}

      

      {movies.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Movies</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((m) => (
              <div key={`m-${m.id}`} className="group relative">
                <MovieCard title={m.title} posterUrl={m.posterUrl} to={`/movie/${m.id}`} />
                <button
                  aria-label="Remove from watchlist"
                  onClick={() => remove('movie', m.id)}
                  className="absolute top-2 right-2 hidden group-hover:inline-flex px-2 py-1 rounded-md text-xs bg-black/60 hover:bg-black/80 border border-slate-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tv.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">TV Shows</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tv.map((t) => (
              <div key={`t-${t.id}`} className="group relative">
                <TVCard name={t.title} posterUrl={t.posterUrl} to={`/tv/${t.id}`} />
                <button
                  aria-label="Remove from watchlist"
                  onClick={() => remove('tv', t.id)}
                  className="absolute top-2 right-2 hidden group-hover:inline-flex px-2 py-1 rounded-md text-xs bg-black/60 hover:bg-black/80 border border-slate-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default Watchlist


