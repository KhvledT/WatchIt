import { Link } from 'react-router-dom'

type MovieCardProps = {
  title: string
  posterUrl?: string
  caption?: string
  to?: string
  rating?: number
}

function MovieCard({ title, posterUrl, caption, to, rating }: MovieCardProps) {
  const content = (
    <article className="group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
      <div className="relative aspect-[2/3] bg-slate-800">
        {posterUrl ? (
          <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
        ) : null}
        {typeof rating === 'number' ? (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium bg-black/70 text-amber-300">
            ★ {rating.toFixed(1)}
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="pointer-events-none absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 blur-xl bg-blue-500/10" />
      </div>
      <div className="p-3">
        <h3 className="text-slate-100 font-medium line-clamp-1">{title}</h3>
        {caption ? <p className="text-slate-400 text-sm line-clamp-2">{caption}</p> : null}
      </div>
    </article>
  )
  return to ? <Link to={to} className="block">{content}</Link> : content
}

export default MovieCard


