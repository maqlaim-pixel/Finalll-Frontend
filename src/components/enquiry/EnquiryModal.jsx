import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { trackEvent } from '../../utils/analytics'
import { X, Calendar, Users, MessageSquare, Loader2, CheckCircle, PartyPopper } from 'lucide-react'

export default function EnquiryModal({ packageData, isOpen, onClose }) {
  const { user } = useAuth()
  const [step, setStep] = useState('form') // form | submitting | success | error
  const [form, setForm] = useState({
    travelDate: '',
    travelers: 2,
    budget: '',
    message: '',
    name: '',
    email: '',
    phone: '',
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Pre-fill user info when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }))
    }
  }, [isOpen, user])

  if (!isOpen || !packageData) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStep('submitting')
    setError('')
    try {
      // Use the authenticated customer enquiry endpoint
      const res = await api.post('/customer/enquiries', {
        packageId: packageData.id,
        travelDate: form.travelDate || null,
        travelers: form.travelers,
        budget: form.budget,
        message: form.message,
      })
      trackEvent('package_enquiry', {
        package_id: packageData.id,
        package_name: packageData.title,
        destination: packageData.destination || packageData.state || '',
      })
      setResult({
        success: true,
        enquiryRef: res.data.enquiryRef || 'ENQ-' + Date.now().toString(36).toUpperCase(),
        packageName: res.data.packageName || packageData.title,
        destination: res.data.destination || packageData.destination || packageData.state || '',
      })
      setStep('success')
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to submit enquiry'
      setError(msg)
      setStep('error')
    }
  }

  const handleClose = () => {
    setStep('form')
    setForm(prev => ({ ...prev, travelDate: '', travelers: 2, budget: '', message: '' }))
    setResult(null)
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
        {/* Close button */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-navy-400 hover:text-navy-700 z-10">
          <X size={20} />
        </button>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* SUCCESS STATE */}
        {/* ════════════════════════════════════════════════════════════ */}
        {step === 'success' && (
          <div className="p-8 text-center">
            {/* Confetti particles */}
            <div className="relative mb-4">
              <div className="confetti-container">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      '--x': `${Math.random() * 200 - 100}px`,
                      '--y': `${-100 - Math.random() * 200}px`,
                      '--r': `${Math.random() * 720}deg`,
                      '--d': `${0.5 + Math.random() * 1}s`,
                      '--delay': `${Math.random() * 0.3}s`,
                      '--color': ['#0ea5e9', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'][Math.floor(Math.random() * 5)],
                    }}
                  />
                ))}
              </div>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <PartyPopper size={36} className="text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-display font-bold text-navy-900 mb-2">
              🎉 Thank You for Your Enquiry!
            </h2>
            <p className="text-navy-600 mb-2">
              Your enquiry has been successfully submitted.
            </p>
            <p className="text-sm text-navy-500 mb-6">
              Our travel expert will contact you shortly for more details.
            </p>

            {/* Enquiry details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-navy-500">Enquiry Reference</span>
                <span className="font-mono font-bold text-sky-600">{result?.enquiryRef}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-navy-500">Package</span>
                <span className="font-medium text-navy-900">{result?.packageName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-navy-500">Destination</span>
                <span className="font-medium text-navy-900">{result?.destination}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-navy-200 rounded-lg text-navy-700 font-medium hover:bg-navy-50 transition-colors"
              >
                Close
              </button>
              <a
                href="/account/enquiries"
                onClick={(e) => { e.preventDefault(); handleClose(); window.location.href = '/account/enquiries' }}
                className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors text-center"
              >
                View My Enquiries
              </a>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* FORM STATE */}
        {/* ════════════════════════════════════════════════════════════ */}
        {(step === 'form' || step === 'error') && (
          <div className="p-6">
            <h2 className="text-xl font-display font-bold text-navy-900 mb-1">Enquire Now</h2>
            <p className="text-sm text-navy-500 mb-5">
              {packageData.title} — {packageData.destination || packageData.state || ''}
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (pre-filled from auth) */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm bg-gray-50"
                  disabled
                />
              </div>

              {/* Email (pre-filled from auth) */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm bg-gray-50"
                  disabled
                />
              </div>

              {/* Phone (pre-filled from auth) */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm bg-gray-50"
                  disabled
                />
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Preferred Travel Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3 text-navy-400" />
                  <input
                    type="date"
                    value={form.travelDate}
                    onChange={e => setForm({ ...form, travelDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Travelers */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Number of Travelers</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-3 text-navy-400" />
                  <select
                    value={form.travelers}
                    onChange={e => setForm({ ...form, travelers: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Budget Range (per person)</label>
                <select
                  value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                >
                  <option value="">Select budget</option>
                  <option value="under-10000">Under ₹10,000</option>
                  <option value="10000-25000">₹10,000 – ₹25,000</option>
                  <option value="25000-50000">₹25,000 – ₹50,000</option>
                  <option value="50000-100000">₹50,000 – ₹1,00,000</option>
                  <option value="above-100000">Above ₹1,00,000</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Additional Message</label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-3 top-3 text-navy-400" />
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Any specific requirements..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>

              {step === 'submitting' ? (
                <button disabled className="w-full py-3 bg-sky-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" /> Submitting...
                </button>
              ) : (
                <button type="submit" className="w-full py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Submit Enquiry
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
