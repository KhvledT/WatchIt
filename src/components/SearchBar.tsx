import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { searchMovies, searchTV } from '../services/api'

type SearchBarProps = {
  placeholder?: string
  onSearch?: (value: string) => void
  value?: string
}

function SearchBar({ placeholder = 'Search movies, TV, people', onSearch, value: externalValue }: SearchBarProps) {
  const [value, setValue] = useState(externalValue ?? '')
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<{ id: number; label: string; href: string }[]>([])
  const [recent, setRecent] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  // Load recent searches
  useEffect(() => {
    try {
      const raw = localStorage.getItem('watchit_recent_searches')
      if (raw) setRecent(JSON.parse(raw))
    } catch {}
  }, [])
  useEffect(() => {
    if (externalValue !== undefined) setValue(externalValue)
  }, [externalValue])

  // Debounced suggestions
  useEffect(() => {
    const q = value.trim()
    if (!q) { setSuggestions([]); setOpen(false); setActiveIndex(-1); return }
    const id = setTimeout(async () => {
      try {
        const [m, t] = await Promise.all([
          searchMovies(q, 1),
          searchTV(q, 1),
        ])
        const s = [
          ...(m.results || []).slice(0, 5).map((r: any) => ({ id: r.id, label: r.title, href: `/movie/${r.id}` })),
          ...(t.results || []).slice(0, 5).map((r: any) => ({ id: r.id, label: r.name, href: `/tv/${r.id}` })),
        ]
        setSuggestions(s)
        setOpen(true)
      } catch {
        setSuggestions([])
      }
    }, 250)
    return () => clearTimeout(id)
  }, [value])

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const commitSearch = useCallback((q: string) => {
    onSearch?.(q)
    if (!q) return
    try {
      const list = [q, ...recent.filter((r) => r !== q)].slice(0, 8)
      setRecent(list)
      localStorage.setItem('watchit_recent_searches', JSON.stringify(list))
    } catch {}
    setOpen(false)
    setActiveIndex(-1)
  }, [onSearch, recent])
  const hasSearchAction = useMemo(() => value.trim().length > 0, [value])
  const totalActionables = (hasSearchAction ? 1 : 0) + suggestions.length
  return (
    <div ref={containerRef} className="relative">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          commitSearch(value)
        }}
      >
        <input
          type="search"
          inputMode="search"
          autoComplete="off"
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-blue-500"
          value={value}
          onChange={(e) => { setValue(e.target.value); setActiveIndex(-1) }}
          placeholder={placeholder}
          onFocus={() => { if (suggestions.length || recent.length || value.trim()) setOpen(true) }}
          onKeyDown={(e) => {
            if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
              setOpen(true)
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActiveIndex((prev) => Math.min(totalActionables - 1, prev + 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActiveIndex((prev) => Math.max(hasSearchAction ? 0 : (suggestions.length ? 0 : -1), prev - 1))
            } else if (e.key === 'Enter') {
              if (activeIndex >= 0) {
                e.preventDefault()
                if (hasSearchAction && activeIndex === 0) {
                  commitSearch(value)
                } else {
                  const idx = hasSearchAction ? activeIndex - 1 : activeIndex
                  const sel = suggestions[idx]
                  if (sel) {
                    setOpen(false)
                    setActiveIndex(-1)
                    commitSearch(sel.label)
                  }
                }
              }
            } else if (e.key === 'Escape') {
              setOpen(false)
              setActiveIndex(-1)
            }
          }}
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500"
          onClick={() => commitSearch(value)}
        >
          Search
        </button>
      </form>
      {/* Dropdown menu */}
      {open ? (
        <div className="absolute z-50 mt-2 w-full rounded-md border border-slate-800 bg-slate-900 shadow-xl">
          {hasSearchAction || suggestions.length > 0 ? (
            <ul className="max-h-80 overflow-auto no-scrollbar divide-y divide-slate-800">
              {hasSearchAction ? (
                <li>
                  <button
                    type="button"
                    role="option"
                    className={`w-full text-left px-3 py-2 ${activeIndex === 0 ? 'bg-slate-800/60' : 'hover:bg-slate-800/60'}`}
                    onMouseEnter={() => setActiveIndex(0)}
                    onClick={() => commitSearch(value)}
                  >
                    Search for "{value}"
                  </button>
                </li>
              ) : null}
              {suggestions.map((s, i) => {
                const idx = (hasSearchAction ? 1 : 0) + i
                return (
                  <li key={`${s.href}-${s.id}`}>
                    <button
                      type="button"
                      role="option"
                      className={`w-full text-left px-3 py-2 ${activeIndex === idx ? 'bg-slate-800/60' : 'hover:bg-slate-800/60'}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => { setOpen(false); setActiveIndex(-1); commitSearch(s.label) }}
                    >
                      {s.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
          {recent.length > 0 ? (
            <div className="p-2">
              <div className="px-2 py-1 text-xs text-slate-400">Recent</div>
              <div className="flex flex-wrap gap-2 p-2">
                {recent.map((r) => (
                  <button key={r} className="px-2 py-1 rounded-md border border-slate-700 text-sm hover:bg-slate-800" onClick={() => commitSearch(r)}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default SearchBar


