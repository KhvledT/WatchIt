import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Navbar as HNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/react'

function Navbar() {
  // Subscribe to location changes so sessionStorage-driven links recompute
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const computeMoviesTo = () => {
    const saved = sessionStorage.getItem('watchit_movies_state')
    if (!saved) return '/movies'
    try {
      const { category, page } = JSON.parse(saved) as { category?: string; page?: number }
      if (category && page) return `/movies?category=${encodeURIComponent(category)}&page=${encodeURIComponent(String(page))}`
    } catch {}
    return '/movies'
  }

  const computeTVTo = () => {
    const saved = sessionStorage.getItem('watchit_tv_state')
    if (!saved) return '/tv'
    try {
      const { category, page } = JSON.parse(saved) as { category?: string; page?: number }
      if (category && page) return `/tv?category=${encodeURIComponent(category)}&page=${encodeURIComponent(String(page))}`
    } catch {}
    return '/tv'
  }
  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
    // Clear desktop search once we navigate to search page
    if (location.pathname.startsWith('/search')) {
      setSearchText('')
      inputRef.current?.blur()
    }
  }, [location.pathname, location.search])
  return (
    <HNavbar isMenuOpen={open} onMenuOpenChange={setOpen} className=" border-slate-800 bg-black supports-[backdrop-filter]:bg-black">
      <NavbarContent className="max-w-7xl mx-auto w-full" justify="start">
        <NavbarBrand className="mr-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="WatchIt" className="h-6 w-6" />
            <span className="text-lg md:text-xl font-bold tracking-tight text-slate-100">WatchIt</span>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex gap-1" justify="center">
          {[
            { to: '/', label: 'Home' },
            { to: computeMoviesTo(), label: 'Movies' },
            { to: computeTVTo(), label: 'TV Shows' },
            { to: '/trending', label: 'Trending' },
            { to: '/watchlist', label: 'Watchlist' },
          ].map((item) => (
            <NavbarItem key={item.label}>
              <NavLink to={item.to} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 text-slate-300'}`}>{item.label}</NavLink>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent className="hidden md:flex" justify="end">
          <NavbarItem>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const q = searchText.trim()
                if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
                else navigate('/search')
                setSearchText('')
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search movies, TV, people"
                className="w-50 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
              />
              <button type="submit" className="px-3 py-2 rounded-lg text-sm bg-slate-800/60 hover:bg-slate-800 text-slate-200">Go</button>
            </form>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="md:hidden" justify="end">
          <NavbarMenuToggle aria-label={open ? 'Close menu' : 'Open menu'} />
        </NavbarContent>
      </NavbarContent>

      <NavbarMenu className="bg-slate-900">
        {[
          { to: '/', label: 'Home' },
          { to: computeMoviesTo(), label: 'Movies' },
          { to: computeTVTo(), label: 'TV Shows' },
          { to: '/trending', label: 'Trending' },
          { to: '/watchlist', label: 'Watchlist' },
          { to: '/search', label: 'Search' },
        ].map((item) => (
          <NavbarMenuItem key={item.label}>
            <NavLink to={item.to} className={({ isActive }) => `block w-full px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-200'}`}>{item.label}</NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HNavbar>
  )
}

export default Navbar


