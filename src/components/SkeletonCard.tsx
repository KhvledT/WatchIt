function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
      <div className="aspect-[2/3] bg-slate-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-1/2" />
      </div>
    </div>
  )
}

export default SkeletonCard


