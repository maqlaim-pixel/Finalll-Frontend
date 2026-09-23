import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from 'lucide-react'
import api from '../../services/api'
import { parseImageList, resolveImageUrl } from '../../utils/imageUtils'

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/destinations').then(res => { setDestinations(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = destinations.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async (id) => {
    if (!confirm('Delete this destination?')) return
    try {
      const res = await api.delete(`/destinations/${id}`)
      setDestinations(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete'
      alert('Delete failed: ' + msg)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Destinations</h1>
        <Link to="/admin/destinations/new" className="btn-primary text-sm flex items-center gap-2"><Plus size={16} /> Add Destination</Link>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-2.5 text-navy-400" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
        </div>
        {loading ? <div className="p-8 text-center text-navy-500">Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Destination</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Country</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-navy-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(d => {
                // Prefer the hero image (first uploaded Cloudinary URL) and fall back to the legacy image field
                const thumb = parseImageList(d.heroImages)[0] || resolveImageUrl(d.image) || ''
                return (
                <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-4 flex items-center gap-3">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-10 h-10 rounded-lg object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={16} /></div>
                    )}
                    <div><p className="font-medium text-navy-900 text-sm">{d.name}</p><p className="text-xs text-navy-500">{d.tagline}</p></div>
                  </td>
                  <td className="px-5 py-4 text-sm text-navy-600">{d.country}</td>
                  <td className="px-5 py-4"><span className="badge-blue">{d.type}</span></td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${d.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status}</span></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/destinations/edit/${d.id}`} className="p-1.5 text-navy-400 hover:text-sky-600"><Edit2 size={14} /></Link>
                      <button onClick={() => handleDelete(d.id)} className="p-1.5 text-navy-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="p-8 text-center text-navy-500">No destinations found</p>}
        </div>
        )}
      </div>
    </div>
  )
}
