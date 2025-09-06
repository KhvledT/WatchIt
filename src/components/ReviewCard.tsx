import { useState } from 'react'

type ReviewCardProps = {
  author: string
  content: string
}

function ReviewCard({ author, content }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const shouldShowToggle = content.length > 200

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <p className={`text-slate-300 whitespace-pre-line ${expanded ? '' : 'line-clamp-4 md:line-clamp-8'}`}>{content}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">— {author}</p>
        {shouldShowToggle ? (
          <button
            type="button"
            className="text-xs px-2 py-1 rounded-md border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'See less' : 'See more'}
          </button>
        ) : null}
      </div>
    </article>
  )
}

export default ReviewCard


