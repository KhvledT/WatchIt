import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : (error as Error)?.message || 'Something went wrong'
  return (
    <div className="max-w-2xl mx-auto my-16 rounded-xl border border-slate-800 bg-slate-900 p-8 text-slate-100">
      <h1 className="text-2xl font-bold mb-2">Oops!</h1>
      <p className="text-slate-300">{message}</p>
      <a href="/" className="inline-block mt-6 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500">Go Home</a>
    </div>
  )
}

export default RouteError


