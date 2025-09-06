import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  getMovieDetails,
  getMovieCredits,
  getMovieReviews,
  getMovieSimilar,
  getMovieVideos,
} from '../services/api'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import CastCard from '../components/CastCard'
import MovieCard from '../components/MovieCard'
import HorizontalScroll from '../components/HorizontalScroll'
import ReviewCard from '../components/ReviewCard'
import Modal from '../components/Modal'
import { useState } from 'react'
import { useWatchlist } from '../hooks/useWatchlist'

function MovieDetails() {
  const { id } = useParams()
  const movieId = Number(id)
  const [openTrailer, setOpenTrailer] = useState(false)
  const { has, toggle } = useWatchlist()

  const detailsQuery = useQuery({ queryKey: ['movie', movieId], queryFn: () => getMovieDetails(movieId), enabled: !!movieId })
  const creditsQuery = useQuery({ queryKey: ['movie', movieId, 'credits'], queryFn: () => getMovieCredits(movieId), enabled: !!movieId })
  const reviewsQuery = useQuery({ queryKey: ['movie', movieId, 'reviews'], queryFn: () => getMovieReviews(movieId), enabled: !!movieId })
  const similarQuery = useQuery({ queryKey: ['movie', movieId, 'similar'], queryFn: () => getMovieSimilar(movieId), enabled: !!movieId })
  const videosQuery = useQuery({ queryKey: ['movie', movieId, 'videos'], queryFn: () => getMovieVideos(movieId), enabled: !!movieId })

  if (detailsQuery.isLoading) return <Loader />
  if (detailsQuery.isError) return <ErrorMessage />

  const movie = detailsQuery.data
  const cast = creditsQuery.data?.cast ?? []
  const reviews = reviewsQuery.data?.results ?? []
  const similar = similarQuery.data?.results ?? []
  const trailer = videosQuery.data?.results?.find((v) => v.site === 'YouTube' && v.type.toLowerCase().includes('trailer'))

  const backdrop = movie?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined

  return (
    <section>
      {backdrop ? (
        <div className="relative mb-6 overflow-hidden rounded-xl border border-slate-800">
          <img src={backdrop} alt="backdrop" className="w-full h-48 md:h-72 object-cover opacity-50" />
          <div className="absolute inset-0 p-6 flex items-end">
            <h1 className="text-3xl md:text-4xl font-bold">{movie?.title}</h1>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row gap-6">
        {movie?.poster_path ? (
          <img className="w-64 rounded-lg border border-slate-800" src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={movie?.title} />
        ) : null}
        <div>
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="mt-2 text-slate-300">{movie?.overview}</p>
          <div className="mt-3 text-sm text-slate-400 space-x-3">
            {movie?.release_date ? <span>{new Date(movie.release_date).getFullYear()}</span> : null}
            {movie?.runtime ? <span>{movie.runtime}m</span> : null}
          </div>
          <div className="mt-4 flex gap-2">
            {trailer ? (
              <button
                onClick={() => setOpenTrailer(true)}
                className="inline-flex px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500"
              >
                Watch Trailer
              </button>
            ) : null}
            <button
              onClick={() => toggle({ id: movieId, type: 'movie', title: movie?.title ?? 'Untitled', posterUrl: movie?.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : undefined })}
              className={`inline-flex px-4 py-2 rounded-md border ${has('movie', movieId) ? 'bg-green-600 border-green-600 text-white hover:bg-green-500' : 'bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800'}`}
            >
              {has('movie', movieId) ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>

      <Modal open={openTrailer} onClose={() => setOpenTrailer(false)} title="Trailer">
        {trailer ? (
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            />
          </div>
        ) : null}
      </Modal>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Cast</h2>
        <HorizontalScroll>
          {cast.slice(0, 18).map((c) => (
            <div key={c.id} className="w-32 shrink-0">
              <CastCard name={c.name} character={c.character} profileUrl={c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : undefined} to={`/person/${c.id}`} />
            </div>
          ))}
        </HorizontalScroll>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard key={r.id} author={r.author} content={r.content} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Similar</h2>
        <HorizontalScroll>
          {similar.map((m) => (
            <div key={m.id} className="w-40 shrink-0">
              <MovieCard title={m.title} posterUrl={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined} caption={m.overview} to={`/movie/${m.id}`} />
            </div>
          ))}
        </HorizontalScroll>
      </div>
    </section>
  )
}

export default MovieDetails


