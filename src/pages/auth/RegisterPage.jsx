import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalTravelReturnPath } from '../../hooks/useLocalTravelFlow'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react'
import { COUNTRY_CODES } from '../../utils/countryCodes'
import { getOtpErrorMessage, isValidEmail, validatePhoneDigits } from '../../utils/otpErrors'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [countryCode, setCountryCode] = useState('+91')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const phoneDigits = COUNTRY_CODES.find(c => c.code === countryCode)?.digits ?? 15
  useEffect(() => { if (user) navigate(isAdmin ? '/admin' : (getLocalTravelReturnPath() || '/'), { replace: true }) }, [user, isAdmin, navigate])
  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Name is required')
    if (!isValidEmail(form.email)) return setError('Please enter a valid email address')
    const phoneError = validatePhoneDigits(form.phone, countryCode)
    if (phoneError) return setError(phoneError)
    if (form.password.length < 6 || new TextEncoder().encode(form.password).length > 72) return setError('Password must be at least 6 characters and at most 72 bytes')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      await register(
        form.name.trim(),
        form.email.trim().toLowerCase(),
        countryCode + form.phone,
        form.password,
        form.confirm,
      )
      navigate('/verify-otp')
    } catch (err) { setError(getOtpErrorMessage(err)) }
    finally { setLoading(false) }
  }
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4"><div className="max-w-md w-full bg-white rounded-xl border p-8">
    <h1 className="text-2xl font-bold text-navy-900 mb-6">Create Account</h1>
    {error && <p role="alert" className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium text-navy-700 mb-1">Full Name</label><div className="relative"><User size={18} className="absolute left-3 top-3.5 text-navy-400" /><input type="text" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" required /></div></div>
                <div><label className="block text-sm font-medium text-navy-700 mb-1">Email</label><div className="relative"><Mail size={18} className="absolute left-3 top-3.5 text-navy-400" /><input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="john@example.com" className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" required /></div></div>
                <div><label className="block text-sm font-medium text-navy-700 mb-1">Mobile Number <span className="text-navy-400 font-normal">(saved to your account)</span></label><div className="flex gap-2"><select value={countryCode} onChange={event => setCountryCode(event.target.value)} className="px-2 py-3 rounded-lg border bg-white text-sm text-navy-700 focus:ring-2 focus:ring-sky-500 focus:outline-none">{COUNTRY_CODES.map(country => <option key={country.code} value={country.code}>{country.label}</option>)}</select><div className="relative flex-1"><Phone size={18} className="absolute left-3 top-3.5 text-navy-400" /><input type="tel" inputMode="numeric" pattern="[0-9]*" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value.replace(/[^0-9]/g, '').slice(0, phoneDigits) })} placeholder="9876543210" className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" required /></div></div></div>
                <div><label className="block text-sm font-medium text-navy-700 mb-1">Password</label><div className="relative"><Lock size={18} className="absolute left-3 top-3.5 text-navy-400" /><input type={showPw ? 'text' : 'password'} value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder="Min 6 characters" className="w-full pl-10 pr-12 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" required /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-navy-400">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                <div><label className="block text-sm font-medium text-navy-700 mb-1">Confirm Password</label><div className="relative"><Lock size={18} className="absolute left-3 top-3.5 text-navy-400" /><input type="password" value={form.confirm} onChange={event => setForm({ ...form, confirm: event.target.value })} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" required /></div></div>
                <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">{loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : <><UserPlus size={18} /> Create Account</>}</button>
              </form>
<p className="text-center text-sm mt-6">Already have an account? <Link to="/login" className="text-sky-600">Sign In</Link></p>
  </div></div>
}
