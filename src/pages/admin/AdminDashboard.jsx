import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, MapPin, Compass, Hotel, FileText, BookMarked, MessageSquare, Star, Users, Eye, TrendingUp, CarFront, Mail } from 'lucide-react'
import api from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/recent-leads'),
    ]).then(([statsRes, leadsRes]) => {
      setStats(statsRes.data)
      setRecentLeads(leadsRes.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const KPI_CARDS = stats ? [
    { label: 'Packages', value: stats.totalPackages || 0, icon: Package, color: 'bg-sky-100 text-sky-600', link: '/admin/packages' },
    { label: 'Destinations', value: stats.totalDestinations || 0, icon: MapPin, color: 'bg-emerald-100 text-emerald-600', link: '/admin/destinations' },
    { label: 'Activities', value: stats.totalActivities || 0, icon: Compass, color: 'bg-violet-100 text-violet-600', link: '/admin/activities' },
    { label: 'Hotels', value: stats.totalHotels || 0, icon: Hotel, color: 'bg-amber-100 text-amber-600', link: '/admin/hotels' },
    { label: 'Blogs', value: stats.totalBlogs || 0, icon: FileText, color: 'bg-rose-100 text-rose-600', link: '/admin/blogs' },
    { label: 'Bookings', value: stats.totalBookings || 0, icon: BookMarked, color: 'bg-cyan-100 text-cyan-600', link: '/admin/bookings' },
    { label: 'Leads', value: stats.totalLeads || 0, icon: MessageSquare, color: 'bg-orange-100 text-orange-600', link: '/admin/leads' },
    { label: 'Local Travel Enquiries', value: stats.totalLocalTravelEnquiries || 0, pending: stats.newLocalTravelEnquiries || 0, icon: CarFront, color: 'bg-blue-100 text-blue-600', link: '/admin/local-travel-enquiries' },
    { label: 'Contact Enquiries', value: stats.totalContactEnquiries || 0, pending: stats.newContactEnquiries || 0, icon: Mail, color: 'bg-teal-100 text-teal-600', link: '/admin/contact-enquiries' },
    { label: 'Reviews', value: stats.totalReviews || 0, icon: Star, color: 'bg-yellow-100 text-yellow-600', link: '/admin/reviews' },
  ] : []

  const STATUS_COLORS = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-green-100 text-green-700',
    converted: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-navy-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-sm text-navy-500">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/packages" className="btn-primary text-sm !px-4 !py-2">Add Package</Link>
          <Link to="/" target="_blank" className="btn-secondary text-sm !px-4 !py-2 flex items-center gap-1">
            <Eye size={14} /> View Site
          </Link>
        </div>
      </div>

      {/* KPI Grid — All values from database */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {KPI_CARDS.map(kpi => {
          const Icon = kpi.icon
          return (
            <Link key={kpi.label} to={kpi.link} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <TrendingUp size={16} className="text-navy-300 group-hover:text-sky-500 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-navy-900">{kpi.value}</p>
              <p className="text-sm text-navy-500">{kpi.label}</p>
              {kpi.pending > 0 && <p className="mt-1 text-xs font-medium text-amber-700">{kpi.pending} new</p>}
            </Link>
          )
        })}
      </div>

      {/* Recent Leads — From database */}
      <div className="bg-white rounded-xl border">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-navy-900">Recent Leads</h2>
          <Link to="/admin/leads" className="text-sm text-sky-600 hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-navy-400">
              <MessageSquare size={32} className="mx-auto mb-2 text-navy-300" />
              <p>No leads yet. They'll appear here when customers submit enquiries.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Destination</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-navy-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-navy-500">{lead.email || lead.phone || ''}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-navy-600">{lead.destination || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-navy-400">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
