import { useEffect, useState } from 'react'
import { getGlobalStats, getStatsByRange } from '../services/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { TrendingUp, Ticket, Users, Route } from 'lucide-react'

const COLORS = ['#2563eb', '#ef4444', '#f59e0b', '#10b981']

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [rangeStats, setRangeStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1)
    return d.toISOString().split('T')[0]
  })
  const [to, setTo] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    getGlobalStats()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleRangeSearch = () => {
    getStatsByRange(from, to).then(res => setRangeStats(res.data))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
    </div>
  )

  const ticketChartData = stats ? [
    { name: 'Confirmed', value: stats.confirmedTickets },
    { name: 'Cancelled', value: stats.cancelledTickets },
  ] : []

  const summaryCards = stats ? [
    { label: 'Total Revenue', value: `€${stats.totalRevenue?.toFixed(2)}`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Total Tickets', value: stats.totalTickets, icon: Ticket, color: 'text-brand-600 bg-brand-50' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Active Routes', value: stats.totalRoutes, icon: Route, color: 'text-orange-600 bg-orange-50' },
  ] : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and sales statistics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`inline-flex p-2 rounded-xl ${card.color} mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Ticket Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ticketChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Ticket Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={ticketChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {ticketChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Date range stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Stats by Date Range</h2>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-sm text-gray-500 w-10">From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <label className="text-sm text-gray-500 w-10">To</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <button onClick={handleRangeSearch}
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors">
            Search
          </button>
        </div>

        {rangeStats && (
          <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{rangeStats.totalTickets}</p>
              <p className="text-sm text-gray-500">Tickets</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">€{rangeStats.revenue?.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {rangeStats.totalTickets > 0
                  ? `€${(rangeStats.revenue / rangeStats.totalTickets).toFixed(2)}`
                  : '—'}
              </p>
              <p className="text-sm text-gray-500">Avg per ticket</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
