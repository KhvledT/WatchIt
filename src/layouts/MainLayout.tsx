import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackButton from '../components/BackButton'

function MainLayout() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.search, location.hash])
  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {location.pathname !== '/' ? (
            <div className="mb-4">
              <BackButton />
            </div>
          ) : null}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout


