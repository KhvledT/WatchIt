type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="inline-flex items-center gap-px rounded-xl overflow-hidden border border-slate-800 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <button
        className="px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        ‹ Prev
      </button>
      <span className="px-3 py-2 text-sm text-slate-300 border-x border-slate-800">
        {page} / {totalPages}
      </span>
      <button
        className="px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Next ›
      </button>
    </div>
  )
}

export default Pagination


