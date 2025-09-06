import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPersonDetails, getPersonCombinedCredits } from '../services/api'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

function PersonDetails() {
  const { id } = useParams()
  const personId = Number(id)
  const detailsQ = useQuery({ queryKey: ['person', personId], queryFn: () => getPersonDetails(personId), enabled: !!personId })
  const creditsQ = useQuery({ queryKey: ['person', personId, 'credits'], queryFn: () => getPersonCombinedCredits(personId), enabled: !!personId })

  if (detailsQ.isLoading) return <Loader />
  if (detailsQ.isError) return <ErrorMessage />

  const person = detailsQ.data
  const knownFor = creditsQ.data?.cast ?? []
  const filmography = [...(creditsQ.data?.cast ?? []), ...(creditsQ.data?.crew ?? [])]
    .filter((x: any) => x.release_date || x.first_air_date)
    .sort((a: any, b: any) => (b.release_date || b.first_air_date || '').localeCompare(a.release_date || a.first_air_date || ''))

  return (
    <section className="space-y-6">
      <div className="flex gap-6">
        {person?.profile_path ? (
          <img className="w-48 rounded-lg border border-slate-800" src={`https://image.tmdb.org/t/p/w342${person.profile_path}`} alt={person?.name} />
        ) : null}
        <div>
          <h1 className="text-3xl font-semibold">{person?.name}</h1>
          <p className="mt-2 text-slate-300 whitespace-pre-line">{person?.biography}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Known For</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {knownFor.slice(0, 20).map((kf: any) => (
            <div key={`${kf.media_type}-${kf.id}`} className="rounded-md overflow-hidden border border-slate-800 bg-slate-900">
              {kf.poster_path ? <img className="w-full" src={`https://image.tmdb.org/t/p/w342${kf.poster_path}`} alt={kf.title || kf.name} /> : null}
              <div className="p-3">
                <p className="text-slate-200 font-medium line-clamp-1">{kf.title || kf.name}</p>
                {kf.character ? <p className="text-slate-400 text-sm line-clamp-1">as {kf.character}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Filmography</h2>
        <div className="space-y-2 text-sm text-slate-300">
          {filmography.map((entry: any) => {
            const year = (entry.release_date || entry.first_air_date || '').slice(0, 4)
            return (
              <div key={`${entry.credit_id}`} className="flex items-center gap-3">
                <span className="text-slate-400 w-12">{year}</span>
                <span className="font-medium">{entry.title || entry.name}</span>
                {entry.character ? <span className="text-slate-400">as {entry.character}</span> : null}
                {entry.job ? <span className="text-slate-400">({entry.job})</span> : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PersonDetails


