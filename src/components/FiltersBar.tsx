import { PropsWithChildren } from 'react'

export type GenreItem = { id: number; name: string }

type Category = { key: string; label: string }
type SortOption = { value: string; label: string }

type FiltersBarProps = {
  wrapperClassName?: string
  categories: Category[]
  activeCategory: string
  onCategoryChange: (key: string) => void
  genres: GenreItem[]
  genreValue: string
  yearValue: string
  yearPlaceholder: string
  ratingValue: string
  runtimeValue: string
  sortValue: string
  sortOptions: SortOption[]
  onChange: (updates: Partial<{ genre: string; year: string; rating: string; runtime: string; sort: string }>) => void
}

function FiltersBar({
  wrapperClassName,
  categories,
  activeCategory,
  onCategoryChange,
  genres,
  genreValue,
  yearValue,
  yearPlaceholder,
  ratingValue,
  runtimeValue,
  sortValue,
  sortOptions,
  onChange,
}: PropsWithChildren<FiltersBarProps>) {
  return (
    <div className={`sticky top-16 z-30 -mx-4 px-4 md:mx-0 md:px-0 ${wrapperClassName ?? ''}`}>
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 p-3 space-y-3">
        <div role="tablist" aria-label="Categories" className="flex items-center gap-2">
          {categories.map((c) => {
            const active = activeCategory === c.key
            return (
              <button
                key={c.key}
                role="tab"
                aria-selected={active}
                className={`px-4 py-2 rounded-lg text-sm transition-colors border ${active ? 'bg-blue-600 border-blue-600 text-white shadow shadow-blue-500/20' : 'bg-transparent border-transparent text-slate-300 hover:bg-slate-800'}`}
                onClick={() => onCategoryChange(c.key)}
              >
                {c.label}
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <select
            aria-label="Genre"
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
            value={genreValue}
            onChange={(e) => onChange({ genre: e.target.value })}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={String(g.id)}>{g.name}</option>
            ))}
          </select>
          <input
            aria-label={yearPlaceholder}
            type="number"
            placeholder={yearPlaceholder}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
            value={yearValue}
            onChange={(e) => onChange({ year: e.target.value })}
          />
          <input
            aria-label="Min rating"
            type="number"
            min={0}
            max={10}
            step="0.1"
            placeholder="Min rating"
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
            value={ratingValue}
            onChange={(e) => onChange({ rating: e.target.value })}
          />
          <input
            aria-label="Min runtime"
            type="number"
            min={0}
            placeholder="Min runtime (min)"
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
            value={runtimeValue}
            onChange={(e) => onChange({ runtime: e.target.value })}
          />
          <select
            aria-label="Sort by"
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
            value={sortValue}
            onChange={(e) => onChange({ sort: e.target.value })}
          >
            <option value="">Default sort</option>
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default FiltersBar


