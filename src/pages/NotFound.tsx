import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="text-center">
      <h1 className="text-3xl font-semibold mb-2">404 - Not Found</h1>
      <p className="text-slate-400 mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-blue-400 hover:underline">Return Home</Link>
    </section>
  )
}

export default NotFound


