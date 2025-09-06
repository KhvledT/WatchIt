import { useNavigate } from 'react-router-dom'

function BackButton() {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => navigate(-1)}
      className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
    >
      <span className="text-xl leading-none">‹</span>
      <span className="text-sm">Back</span>
    </button>
  )
}

export default BackButton


