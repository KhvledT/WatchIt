import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  getTVDetails,
  getTVCredits,
  getTVReviews,
  getTVSimilar,
  getTVVideos,
} from '../services/api'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import CastCard from '../components/CastCard'
import TVCard from '../components/TVCard'
import ReviewCard from '../components/ReviewCard'
import HorizontalScroll from '../components/HorizontalScroll'
import Modal from '../components/Modal'
import { useState } from 'react'
import { useWatchlist } from '../hooks/useWatchlist'

function TVDetails() {
  const { id } = useParams()
  const tvId = Number(id)
  const [openTrailer, setOpenTrailer] = useState(false)
  const { has, toggle } = useWatchlist()

  const detailsQuery = useQuery({ queryKey: ['tv', tvId], queryFn: () => getTVDetails(tvId), enabled: !!tvId })
  const creditsQuery = useQuery({ queryKey: ['tv', tvId, 'credits'], queryFn: () => getTVCredits(tvId), enabled: !!tvId })
  const reviewsQuery = useQuery({ queryKey: ['tv', tvId, 'reviews'], queryFn: () => getTVReviews(tvId), enabled: !!tvId })
  const similarQuery = useQuery({ queryKey: ['tv', tvId, 'similar'], queryFn: () => getTVSimilar(tvId), enabled: !!tvId })
  const videosQuery = useQuery({ queryKey: ['tv', tvId, 'videos'], queryFn: () => getTVVideos(tvId), enabled: !!tvId })

  if (detailsQuery.isLoading) return <Loader />
  if (detailsQuery.isError) return <ErrorMessage />

  const tv = detailsQuery.data
  const cast = creditsQuery.data?.cast ?? []
  const reviews = reviewsQuery.data?.results ?? []
  const similar = similarQuery.data?.results ?? []
  const trailer = videosQuery.data?.results?.find((v) => v.site === 'YouTube' && v.type.toLowerCase().includes('trailer'))

  const backdrop = tv?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tv.backdrop_path}` : undefined

  return (
    <section>
      {backdrop ? (
        <div className="relative mb-6 overflow-hidden rounded-xl border border-slate-800">
          <img src={backdrop} alt="backdrop" className="w-full h-48 md:h-72 object-cover opacity-50" />
          <div className="absolute inset-0 p-6 flex items-end">
            <h1 className="text-3xl md:text-4xl font-bold">{tv?.name}</h1>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row gap-6">
        {tv?.poster_path ? (
          <img className="w-64 rounded-lg border border-slate-800" src={`https://image.tmdb.org/t/p/w342${tv.poster_path}`} alt={tv?.name} />
        ) : null}
        <div>
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="mt-2 text-slate-300">{tv?.overview}</p>
          <div className="mt-3 text-sm text-slate-400 space-x-3">
            {tv?.first_air_date ? <span>{new Date(tv.first_air_date).getFullYear()}</span> : null}
            {tv?.number_of_seasons ? <span>{tv.number_of_seasons} seasons</span> : null}
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
              onClick={() => toggle({ id: tvId, type: 'tv', title: tv?.name ?? 'Untitled', posterUrl: tv?.poster_path ? `https://image.tmdb.org/t/p/w342${tv.poster_path}` : undefined })}
              className={`inline-flex px-4 py-2 rounded-md border ${has('tv', tvId) ? 'bg-green-600 border-green-600 text-white hover:bg-green-500' : 'bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800'}`}
            >
              {has('tv', tvId) ? 'In Watchlist' : 'Add to Watchlist'}
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
          {similar.map((t) => (
            <div key={t.id} className="w-40 shrink-0">
              <TVCard name={t.name} posterUrl={t.poster_path ? `https://image.tmdb.org/t/p/w342${t.poster_path}` : undefined} caption={t.overview} to={`/tv/${t.id}`} />
            </div>
          ))}
        </HorizontalScroll>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Seasons & Episodes</h2>
        <div className="space-y-2 text-sm text-slate-300">
          {tv?.seasons?.map((s: any) => (
            <div key={s.id} className="rounded-md border border-slate-800 p-3">
              <span className="font-medium">{s.name}</span>
              {s.air_date ? <span className="ml-2 text-slate-400">({new Date(s.air_date).getFullYear()})</span> : null}
              {typeof s.episode_count === 'number' ? <span className="ml-2 text-slate-400">{s.episode_count} episodes</span> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TVDetails


