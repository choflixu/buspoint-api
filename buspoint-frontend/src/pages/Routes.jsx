import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoutes } from '../services/api'
import { MapPin, Clock, Euro } from 'lucide-react'

export default function Routes() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getRoutes()
      .then(res => setRoutes(res.data))
      .catch(() => setError('Could not load routes'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
    </div>
  )

  if (error) return (
    <div className="text-center py-20 text-red-500">{error}</div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Routes</h1>
        <p className="text-gray-500 mt-1">Choose your tour and book your tickets</p>
      </div>

      {routes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <span className="text-5xl">🚌</span>
          <p className="mt-4 text-lg">No routes available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map(route => (
            <div
              key={route.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-6">
                <h2 className="text-white font-bold text-xl">{route.name}</h2>
                <div className="flex items-center gap-1 mt-1 text-brand-100 text-sm">
                  <MapPin className="w-4 h-4" />
                  {route.city}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <p className="text-gray-600 text-sm">{route.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {route.durationMinutes} min
                </div>

                {route.stops && route.stops.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase mb-2">Stops</p>
                    <div className="flex flex-wrap gap-1">
                      {route.stops.map((stop, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {stop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900 text-lg">€{route.priceAdult}</span> adult
                    <span className="mx-2">·</span>
                    <span className="font-semibold text-gray-900">€{route.priceChild}</span> child
                  </div>
                  <button
                    onClick={() => navigate(`/buy/${route.id}`)}
                    className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                  >
                    Buy tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
