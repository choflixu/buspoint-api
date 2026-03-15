import { useEffect, useState } from 'react'
import { getMyTickets, cancelTicket } from '../services/api'
import { Calendar, MapPin, QrCode } from 'lucide-react'

const statusColors = {
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  USED: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-yellow-100 text-yellow-700'
}

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    getMyTickets()
      .then(res => setTickets(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this ticket?')) return
    setCancelling(id)
    try {
      const res = await cancelTicket(id)
      setTickets(prev => prev.map(t => t.id === id ? res.data : t))
    } catch (err) {
      alert(err.response?.data?.error || 'Could not cancel ticket')
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
        <p className="text-gray-500 mt-1">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found</p>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <span className="text-5xl">🎫</span>
          <p className="mt-4 text-lg">No tickets yet</p>
          <a href="/routes" className="text-brand-600 text-sm mt-2 inline-block hover:underline">
            Browse routes →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              {/* Left */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span className="font-semibold text-gray-900">{ticket.routeName}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(ticket.travelDate).toLocaleDateString('en-GB', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  {ticket.quantityAdult > 0 && `${ticket.quantityAdult} adult${ticket.quantityAdult > 1 ? 's' : ''}`}
                  {ticket.quantityAdult > 0 && ticket.quantityChild > 0 && ' · '}
                  {ticket.quantityChild > 0 && `${ticket.quantityChild} child${ticket.quantityChild > 1 ? 'ren' : ''}`}
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">€{ticket.totalPrice.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 font-mono">{ticket.qrCode?.slice(0, 8)}...</p>
                </div>
                {ticket.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancel(ticket.id)}
                    disabled={cancelling === ticket.id}
                    className="text-red-500 hover:text-red-700 text-sm font-medium border border-red-200 hover:border-red-300 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {cancelling === ticket.id ? '...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
