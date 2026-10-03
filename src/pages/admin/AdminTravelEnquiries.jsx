import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Loader2, Mail, MapPin, MessageSquare, Phone, RefreshCw, Search, UserRound } from 'lucide-react'
import api from '../../services/api'

const CONFIG = {
  local: {
    title: 'Local Travel Enquiries', endpoint: '/admin/local-travel-enquiries',
    statuses: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
  },
  contact: {
    title: 'Contact Enquiries', endpoint: '/admin/contact-enquiries',
    statuses: ['NEW', 'READ', 'CONTACTED', 'RESOLVED', 'CLOSED'],
  },
}
const PAGE_SIZE = 10
const labelize = value => String(value || '').replace(/([A-Z])/g, ' $1').replaceAll('_', ' ').replace(/\s+/g, ' ').trim().replace(/^./, first => first.toUpperCase())
const dateLabel = value => value ? new Date(value).toLocaleString() : '—'

export default function AdminTravelEnquiries({ type = 'local' }) {
  const config = CONFIG[type]
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [updating, setUpdating] = useState(false)

  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get(config.endpoint, { params: statusFilter ? { status: statusFilter } : {} })
      setItems(Array.isArray(response.data) ? response.data : [])
    } catch (requestError) {
      setError(requestError.response?.data?.error || `Unable to load ${config.title.toLowerCase()}.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [config.endpoint, statusFilter])

  useEffect(() => {
    if (!selected) return
    const latest = items.find(item => item.id === selected.id)
    if (latest && latest !== selected) setSelected(latest)
  }, [items, selected])

  const filtered = useMemo(() => items.filter(item => {
    const searchable = type === 'local'
      ? [item.id, item.customerName, item.customerEmail, item.customerPhone, item.serviceType, ...Object.values(item.formData || {})]
      : [item.id, item.name, item.email, item.phone, item.subject, item.message]
    const matchesSearch = !search || searchable.some(value => String(value || '').toLowerCase().includes(search.toLowerCase()))
    const matchesDate = !dateFilter || (item.createdAt && new Date(item.createdAt).toISOString().slice(0, 10) === dateFilter)
    return matchesSearch && matchesDate
  }), [items, search, dateFilter, type])
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [search, dateFilter, statusFilter])

  const openDetails = async item => {
    setError('')
    try {
      const response = await api.get(`${config.endpoint}/${item.id}`)
      setSelected(response.data)
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load enquiry details.')
    }
  }

  const updateStatus = async (id, status) => {
    setUpdating(true)
    setError('')
    try {
      const response = await api.patch(`${config.endpoint}/${id}`, { status, ...(type === 'local' ? { adminNotes: selected?.adminNotes || '' } : {}) })
      setSelected(response.data)
      setItems(previous => previous.map(item => item.id === id ? response.data : item))
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to update enquiry status.')
    } finally {
      setUpdating(false)
    }
  }

  const updateNotes = async () => {
    if (!selected || type !== 'local') return
    setUpdating(true)
    setError('')
    try {
      const response = await api.patch(`${config.endpoint}/${selected.id}`, { adminNotes: selected.adminNotes || '' })
      setSelected(response.data)
      setItems(previous => previous.map(item => item.id === selected.id ? response.data : item))
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to save admin notes.')
    } finally {
      setUpdating(false)
    }
  }

  return <div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-2xl font-bold text-navy-900">{config.title}</h1><p className="mt-1 text-sm text-navy-500">View and manage enquiries stored in the database.</p></div>
      <button type="button" onClick={fetchItems} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-navy-700 hover:bg-gray-50 disabled:opacity-60"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />Refresh</button>
    </div>
    <div className="mb-4 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-[1fr_190px_190px]">
      <label className="relative"><span className="sr-only">Search enquiries</span><Search size={17} className="absolute left-3 top-3 text-gray-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search customer, email, service..." className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm" /></label>
      <label><span className="sr-only">Filter by status</span><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"><option value="">All statuses</option>{config.statuses.map(status => <option key={status} value={status}>{labelize(status)}</option>)}</select></label>
      <label className="relative"><CalendarDays size={16} className="absolute left-3 top-3 text-gray-400" /><span className="sr-only">Filter by submitted date</span><input type="date" value={dateFilter} onChange={event => setDateFilter(event.target.value)} className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm" /></label>
    </div>
    {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <div className="overflow-hidden rounded-xl border bg-white">
      {loading ? <div className="flex items-center justify-center gap-2 p-12 text-sm text-navy-500"><Loader2 size={19} className="animate-spin" />Loading enquiries...</div>
        : visible.length === 0 ? <div className="p-12 text-center text-sm text-navy-500">No enquiries found.</div>
          : <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left">
            <thead className="bg-gray-50 text-xs uppercase text-navy-500"><tr>
              <th className="px-4 py-3">ID</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Email / Phone</th>
              {type === 'local' ? <><th className="px-4 py-3">Service Type</th><th className="px-4 py-3">Pickup / From</th><th className="px-4 py-3">Destination / To</th><th className="px-4 py-3">Travel Date</th></> : <><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Message Preview</th></>}
              <th className="px-4 py-3">Status</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Action</th>
            </tr></thead>
            <tbody className="divide-y">{visible.map(item => {
              const fields = item.formData || {}
              const pickup = fields.pickupLocation || fields.pickupCity || fields.city || fields.airport || fields.station || '—'
              const destination = fields.dropLocation || fields.dropCity || fields.destination || fields.city || '—'
              return <tr key={item.id} className="align-top hover:bg-gray-50/70">
                <td className="px-4 py-4 text-sm font-semibold">#{item.id}</td>
                <td className="px-4 py-4 text-sm font-medium">{type === 'local' ? item.customerName : item.name}</td>
                <td className="px-4 py-4 text-sm"><div>{type === 'local' ? item.customerEmail : item.email}</div><div className="mt-1 text-xs text-gray-500">{type === 'local' ? item.customerPhone || '—' : item.phone}</div></td>
                {type === 'local' ? <><td className="px-4 py-4 text-sm">{labelize(item.serviceType)}</td><td className="max-w-40 px-4 py-4 text-sm">{pickup}</td><td className="max-w-40 px-4 py-4 text-sm">{destination}</td><td className="px-4 py-4 text-sm">{fields.travelDate || fields.tourDate || fields.pickupDate || '—'}</td></> : <><td className="px-4 py-4 text-sm">{item.subject}</td><td className="max-w-56 px-4 py-4 text-sm text-gray-600">{item.message?.slice(0, 90)}{item.message?.length > 90 ? '…' : ''}</td></>}
                <td className="px-4 py-4"><select aria-label={`Status for enquiry ${item.id}`} value={item.status} disabled={updating} onChange={event => updateStatus(item.id, event.target.value)} className="rounded-lg border bg-white px-2 py-1.5 text-xs"><option value={item.status}>{labelize(item.status)}</option>{config.statuses.filter(status => status !== item.status).map(status => <option key={status} value={status}>{labelize(status)}</option>)}</select></td>
                <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-500">{dateLabel(item.createdAt)}</td>
                <td className="px-4 py-4"><button type="button" onClick={() => openDetails(item)} className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100">View Details</button></td>
              </tr>
            })}</tbody>
          </table></div>}
      {!loading && filtered.length > 0 && <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-500"><span>{filtered.length} enquiries · Page {page} of {pages}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className="rounded border px-3 py-1.5 disabled:opacity-40">Previous</button><button type="button" disabled={page >= pages} onClick={() => setPage(value => value + 1)} className="rounded border px-3 py-1.5 disabled:opacity-40">Next</button></div></div>}
    </div>

    {selected && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-navy-950/60 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null) }}><section role="dialog" aria-modal="true" aria-labelledby="enquiry-detail-title" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="enquiry-detail-title" className="text-xl font-bold text-navy-900">{config.title.slice(0, -1)} #{selected.id}</h2><p className="mt-1 text-sm text-gray-500">Submitted {dateLabel(selected.createdAt)}</p></div><button type="button" onClick={() => setSelected(null)} className="rounded-lg border px-3 py-1.5 text-sm">Close</button></div>
      {type === 'local' ? <><div className="mb-5 grid gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2"><p className="flex items-center gap-2 text-sm"><UserRound size={16} />{selected.customerName}</p><p className="flex items-center gap-2 text-sm"><Mail size={16} />{selected.customerEmail}</p><p className="flex items-center gap-2 text-sm"><Phone size={16} />{selected.customerPhone || 'No registered phone'}</p><p className="flex items-center gap-2 text-sm"><MapPin size={16} />User ID: {selected.userId}</p><p className="sm:col-span-2 text-sm font-semibold">Service: {labelize(selected.serviceType)}</p></div><h3 className="mb-2 font-semibold">Submitted form details</h3><dl className="grid gap-2 rounded-xl border p-4 sm:grid-cols-2">{Object.entries(selected.formData || {}).map(([key, value]) => <div key={key} className="border-b pb-2"><dt className="text-xs font-medium text-gray-500">{labelize(key)}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-navy-900">{value || '—'}</dd></div>)}</dl><div className="mt-4"><label className="mb-1 block text-sm font-semibold">Admin notes</label><textarea value={selected.adminNotes || ''} onChange={event => setSelected(previous => ({ ...previous, adminNotes: event.target.value }))} rows={3} className="w-full rounded-lg border p-3 text-sm" /><button type="button" disabled={updating} onClick={updateNotes} className="mt-2 rounded-lg border px-3 py-2 text-sm disabled:opacity-50">{updating ? 'Saving...' : 'Save Notes'}</button></div></> : <div className="space-y-4 rounded-xl border p-4"><div className="grid gap-4 sm:grid-cols-2"><p className="flex items-center gap-2 text-sm"><UserRound size={16} />{selected.name}</p><p className="flex items-center gap-2 text-sm"><Mail size={16} />{selected.email}</p><p className="flex items-center gap-2 text-sm"><Phone size={16} />{selected.phone}</p><p className="flex items-center gap-2 text-sm"><MessageSquare size={16} />{selected.subject}</p></div><div><h3 className="mb-2 font-semibold">Complete message</h3><p className="whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 text-sm leading-relaxed">{selected.message}</p></div>{selected.userId && <p className="text-xs text-gray-500">Linked account ID: {selected.userId}</p>}</div>}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4"><label htmlFor="detail-status" className="text-sm font-semibold">Status</label><select id="detail-status" value={selected.status} disabled={updating} onChange={event => updateStatus(selected.id, event.target.value)} className="rounded-lg border bg-white px-3 py-2 text-sm">{config.statuses.map(status => <option key={status} value={status}>{labelize(status)}</option>)}</select>{updating && <Loader2 size={16} className="animate-spin" />}</div>
    </section></div>}
  </div>
}
