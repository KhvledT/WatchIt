import { Link } from 'react-router-dom'

type PersonCardProps = {
  name: string
  profileUrl?: string
  subtitle?: string
  to?: string
}

function PersonCard({ name, profileUrl, subtitle, to }: PersonCardProps) {
  const content = (
    <article className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900 text-center">
      <div className="aspect-[3/4] bg-slate-800">
        {profileUrl ? (
          <img src={profileUrl} alt={name} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <div className="p-3">
        <h3 className="text-slate-100 font-medium line-clamp-1">{name}</h3>
        {subtitle ? <p className="text-slate-400 text-sm line-clamp-1">{subtitle}</p> : null}
      </div>
    </article>
  )
  return to ? <Link to={to} className="block">{content}</Link> : content
}

export default PersonCard


