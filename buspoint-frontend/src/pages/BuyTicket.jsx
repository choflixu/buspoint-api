import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRouteById, buyTicket } from '../services/api'
import { MapPin, Clock, Users, Baby, Calendar } from 'lucide-react'

export default function BuyTicket() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const today = new Date()
  today.setDate(today.getDate() + 1)
  const minDate = today.toISOString().split('T')[0]

  const [form, setForm] = useState({
    travelDate: minDate,
    quantityAdult: 1,
    quantityChild: 0
  })

  useEffect(() => {
    getRouteById(id)
      .then(res => setRoute(res.data))
      .catch(() => setError('Route not found'))
      .finally(() => setLoading(false))
  }, [id])

  const total = route
    ? form.quantityAdult * route.priceAdult + form.quantityChild * route.priceChild
    : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await buyTicket({ routeId: id, ...form })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Purchase failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
    </div>
  )

  if (success) return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-500 mb-6">Check your email for the ticket details.</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => navigate('/tickets')}
          className="bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700"
        >
          My Tickets
        </button>
        <button
          onClick={() => navigate('/routes')}
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50"
        >
          More Routes
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/routes')} className="text-brand-600 text-sm mb-6 hover:underline">
        ← Back to routes
      </button>

      {route && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Route header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white">
            <h1 className="text-2xl font-bold">{route.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-brand-100 text-sm">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{route.city}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{route.durationMinutes} min</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" /> Travel Date
              </label>
              <input
                type="date"
                min={minDate}
                value={form.travelDate}
                onChange={e => setForm({ ...form, travelDate: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Quantities */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4" /> Adults — €{route.priceAdult}
                </label>
                <input
                  type="number" min="0" max="20"
                  value={form.quantityAdult}
                  onChange={e => setForm({ ...form, quantityAdult: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Baby className="w-4 h-4" /> Children — €{route.priceChild}
                </label>
                <input
                  type="number" min="0" max="20"
                  value={form.quantityChild}
                  onChange={e => setForm({ ...form, quantityChild: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Total + Submit */}
            <div className="border-t pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-900">€{total.toFixed(2)}</p>
              </div>
              <button
                type="submit"
                disabled={submitting || (form.quantityAdult + form.quantityChild === 0)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-8 py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
