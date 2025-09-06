import { useCallback, useEffect, useMemo, useState } from 'react'

export type WatchlistItem = {
  id: number
  type: 'movie' | 'tv'
  title: string
  posterUrl?: string
}

const STORAGE_KEY = 'watchit_watchlist'

function readStorage(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as WatchlistItem[]) : []
  } catch {
    return []
  }
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>(() => readStorage())

  useEffect(() => {
    const onUpdate = () => {
      setItems(readStorage())
    }
    window.addEventListener('storage', onUpdate)
    window.addEventListener('watchlist:updated', onUpdate as EventListener)
    return () => {
      window.removeEventListener('storage', onUpdate)
      window.removeEventListener('watchlist:updated', onUpdate as EventListener)
    }
  }, [])

  const ids = useMemo(() => new Set(items.map((i) => `${i.type}:${i.id}`)), [items])

  const add = useCallback((item: WatchlistItem) => {
    setItems((prev) => {
      const key = `${item.type}:${item.id}`
      if (prev.some((i) => `${i.type}:${i.id}` === key)) return prev
      const next = [item, ...prev]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      try { window.dispatchEvent(new Event('watchlist:updated')) } catch {}
      return next
    })
  }, [])

  const remove = useCallback((type: WatchlistItem['type'], id: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => !(i.type === type && i.id === id))
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      try { window.dispatchEvent(new Event('watchlist:updated')) } catch {}
      return next
    })
  }, [])

  const toggle = useCallback((item: WatchlistItem) => {
    const key = `${item.type}:${item.id}`
    if (ids.has(key)) remove(item.type, item.id)
    else add(item)
  }, [add, remove, ids])

  const has = useCallback((type: WatchlistItem['type'], id: number) => ids.has(`${type}:${id}`), [ids])

  return { items, add, remove, toggle, has }
}


