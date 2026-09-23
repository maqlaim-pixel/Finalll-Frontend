import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, BookMarked, X, ChevronDown, FileText } from 'lucide-react'
import api from '../../services/api'

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
}

const PAYMENT_COLORS = {
  paid: 'bg-green-100 text-green-700',
  partial: 'bg-yellow-100 text-yellow-700',
  refunded: 'bg-blue-100 text-blue-700',
  unpaid: 'bg-red-100 text-red-700',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const fetchBookings = () => {
    setLoading(true)
    const url = filter === 'all' ? '/admin/data/bookings' : `/admin/data/bookings?status=${filter}`
    api.get(url)
      .then(res => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase()
    return (b.customerName?.toLowerCase().includes(q) || b.packageName?.toLowerCase().includes(q) || b.bookingRef?.toLowerCase().includes(q))
  })

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await api.put(`/admin/data/bookings/${id}/status`, { status: newStatus })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    } catch { alert('Failed to update status') }
    finally { setUpdatingId(null) }
  }

  const handlePaymentUpdate = async (id, newPayment) => {
    setUpdatingId(id)
    try {
      await api.put(`/admin/data/bookings/${id}/status`, { paymentStatus: newPayment })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, paymentStatus: newPayment } : b))
    } catch { alert('Failed to update payment status') }
    finally { setUpdatingId(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Bookings</h1>
          <p className="text-sm text-navy-500">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-sky-600 text-white' : 'bg-white text-navy-600 border hover:bg-navy-50'
            }`}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-2.5 text-navy-400" />
            <input type="text" placeholder="Search by name, package, or ref..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-navy-500 text-sm">Loading bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <BookMarked size={48} className="mx-auto mb-3 text-navy-200" />
            <p className="text-navy-500 font-medium">No bookings found</p>
            <p className="text-sm text-navy-400 mt-1">Bookings will appear here when customers book packages.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Booking Ref</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Package</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Travelers</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Payment</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-4 font-mono text-sm text-navy-700">{b.bookingRef || `#${b.id}`}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-navy-900">{b.customerName || 'Unknown'}</p>
                      <p className="text-xs text-navy-500">{b.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-navy-600">{b.packageName || '—'}</td>
                    <td className="px-5 py-4 text-sm text-navy-700">{b.travelers}</td>
                    <td className="px-5 py-4 text-sm font-medium text-navy-900">₹{(b.totalAmount || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <select value={b.paymentStatus || 'unpaid'} disabled={updatingId === b.id}
                        onChange={e => handlePaymentUpdate(b.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${PAYMENT_COLORS[b.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        <option value="unpaid">unpaid</option>
                        <option value="partial">partial</option>
                        <option value="paid">paid</option>
                        <option value="refunded">refunded</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <select value={b.status || 'pending'} disabled={updatingId === b.id}
                        onChange={e => handleStatusUpdate(b.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-sm text-navy-400">
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => setSelectedBooking(b)} className="p-1.5 text-navy-400 hover:text-sky-600">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <button onClick={async () => { try { const response = await api.post(`/invoices/generate/${selectedBooking.id}`, {}); navigate(`/admin/invoices/${response.data.id}`) } catch (e) { alert(e.response?.data?.error || 'Unable to generate invoice') } }} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"><FileText size={16}/> Generate / View Invoice</button>
              <div className="flex justify-between"><span className="text-navy-500">Ref</span><span className="font-mono font-medium">{selectedBooking.bookingRef || `#${selectedBooking.id}`}</span></div>
              <div className="flex justify-between"><span className="text-navy-500">Customer</span><span className="font-medium">{selectedBooking.customerName}</span></div>
              <div className="flex justify-between"><span className="text-navy-500">Email</span><span>{selectedBooking.customerEmail}</span></div>
              <div className="flex justify-between"><span className="text-navy-500">Package</span><span>{selectedBooking.packageName || '—'}</span></div>
              <div className="flex justify-between"><span className="text-navy-500">Travelers</span><span>{selectedBooking.travelers}</span></div>
              <div className="flex justify-between"><span className="text-navy-500">Travel Date</span><span>{selectedBooking.travelDate || '—'}</span></div>
              <div className="flex justify-between"><span className="text-navy-500">End Date</span><span>{selectedBooking.endDate || '—'}</span></div>
              <div className="flex justify-between"><span className="text-navy-500">Amount</span><span className="font-medium">₹{(selectedBooking.totalAmount || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-navy-500">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedBooking.status] || 'bg-gray-100'}`}>{selectedBooking.status}</span>
              </div>
              <div className="flex justify-between"><span className="text-navy-500">Payment</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PAYMENT_COLORS[selectedBooking.paymentStatus] || 'bg-gray-100'}`}>{selectedBooking.paymentStatus}</span>
              </div>
              <div className="flex justify-between"><span className="text-navy-500">Created</span><span>{selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString() : '—'}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
