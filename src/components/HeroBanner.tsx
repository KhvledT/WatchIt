import { Link } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getTrendingAll } from '../services/api'

type HeroBannerProps = {
  title?: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  bgImages?: string[]
  bgImage?: string
}

function HeroBanner(
  { 
    title = 'Discover Movies & TV',
    subtitle = 'Explore trending titles, cast, and reviews',
    ctaLabel = 'Explore Now',
    ctaHref = '/trending',
    bgImages,
    bgImage
  }: HeroBannerProps) 
  {
  const trendingQ = useQuery({ queryKey: ['hero','marquee'], queryFn: () => getTrendingAll('day') })
  const tmdbImages = (trendingQ.data?.results ?? [])
    .map((r: any) => r.backdrop_path || r.poster_path)
    .filter(Boolean)
    .slice(0, 12)
    .map((p: string) => `https://image.tmdb.org/t/p/w500${p}`)

  const images = (bgImages && bgImages.length > 0) ? bgImages : tmdbImages
  const bgUrl = bgImage ?? images[0]
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 p-8 md:p-12">
      {/* Single background image */}
      {bgUrl ? (
        <img src={bgUrl} alt="hero background" className="absolute inset-0 w-full h-full object-cover -z-10" />
      ) : null}
      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 -z-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 drop-shadow">{title}</h2>
        <p className="mt-3 text-lg text-slate-300 max-w-2xl">{subtitle}</p>
        <Link to={ctaHref} className="inline-block mt-6 px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20">
          {ctaLabel}
        </Link>
      </div>
      <div className="absolute -bottom-20 -right-20 z-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -top-16 -left-16 z-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
    </section>
  )
}

export default HeroBanner


