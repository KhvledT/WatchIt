function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-black text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm flex items-center justify-between">
        <p>
          © {new Date().getFullYear()} WatchIt.
        </p>
        <p>
          Data from TMDB.
        </p>
      </div>
    </footer>
  )
}

export default Footer


