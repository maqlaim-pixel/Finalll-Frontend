import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { Camera, Save, Loader2, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const { user, token } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', profileImage: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef()

  useEffect(() => {
    api.get('/customer/profile')
      .then(res => {
        setForm({
          name: res.data.name || '',
          phone: res.data.phone || '',
          profileImage: res.data.profileImage || ''
        })
      })
      .catch(() => {
        setForm({
          name: user?.name || '',
          phone: user?.phone || '',
          profileImage: ''
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploaded(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const data = res.data
      if (data.url) {
        setForm(prev => ({ ...prev, profileImage: data.url }))
      }
    } catch (err) {
      setError('Failed to upload image')
    }
    setUploaded(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await api.put('/customer/profile', form)
      setSuccess(res.data.message || 'Profile updated!')
      // Update local user data
      const updated = { ...user, name: form.name, phone: form.phone }
      localStorage.setItem('tv_user', JSON.stringify(updated))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile')
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-sky-600" size={32} />
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-navy-900 mb-6">My Profile</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          <p className="text-green-700 text-sm font-medium">{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border p-6 max-w-xl">
        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
              {form.profileImage ? (
                <img src={form.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600">
                  <span className="text-3xl font-bold text-white">{form.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-700 transition-colors shadow-lg">
              {uploaded ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <div>
            <p className="font-semibold text-navy-900">{form.name || 'Your Name'}</p>
            <p className="text-sm text-navy-500">{user?.email}</p>
            <p className="text-xs text-navy-400 mt-1">Click camera icon to change photo</p>
          </div>
        </div>

        {/* Name Field */}
        <div className="mb-5">
          <label className="text-sm font-medium text-navy-700 mb-2 block">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>

        {/* Phone Field (Optional) */}
        <div className="mb-5">
          <label className="text-sm font-medium text-navy-700 mb-2 block">
            Phone Number <span className="text-navy-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            placeholder="Enter phone number"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
