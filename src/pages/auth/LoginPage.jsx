import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getLocalTravelReturnPath } from '../../hooks/useLocalTravelFlow'
import { useAuth } from '../../context/AuthContext'
import { getOtpErrorMessage, isValidEmail } from '../../utils/otpErrors'

export default function LoginPage({ admin = false }) {
  const { login, adminLogin, resendRegistration, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  useEffect(() => { if (user) navigate(isAdmin ? '/admin' : (getLocalTravelReturnPath() || '/'), { replace: true }) }, [user, isAdmin, navigate])
  const submit = async event => {
    event.preventDefault()
    if (!isValidEmail(email)) { setError('Please enter a valid email address'); return }
    setLoading(true); setError(''); setNeedsVerification(false)
    try {
      if (admin) { await adminLogin(email.trim().toLowerCase(), password); navigate('/admin', { replace: true }) }
      else { await login(email.trim().toLowerCase(), password); navigate('/verify-otp') }
    } catch (err) {
      setError(getOtpErrorMessage(err))
      setNeedsVerification(!admin && err.response?.status === 403 && /complete email verification/i.test(err.response?.data?.error || ''))
    }
    finally { setLoading(false) }
  }
  const completeVerification = async () => {
    setLoading(true); setError('')
    try { await resendRegistration(email.trim().toLowerCase()); navigate('/verify-otp') }
    catch (err) { setError(getOtpErrorMessage(err)) }
    finally { setLoading(false) }
  }
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md bg-white rounded-xl border p-8">
      <h1 className="text-2xl font-bold text-navy-900 mb-2">{admin ? 'Admin Sign In' : 'Welcome Back'}</h1>
      <p className="text-sm text-navy-500 mb-6">{admin ? 'Sign in to manage MAQLAIM TOURS.' : 'Sign in with your password, then verify the code sent to your email.'}</p>
      {error && <p role="alert" className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</p>}
      <form onSubmit={submit} className="space-y-5">
        <label className="block">Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="block w-full border rounded-lg p-3 mt-1" /></label>
        <label className="block">Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="block w-full border rounded-lg p-3 mt-1" /></label>
        <button disabled={loading} className="w-full btn-primary disabled:opacity-60">{loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
      {needsVerification && <button type="button" disabled={loading} onClick={completeVerification} className="mt-4 text-sky-600">Send email verification code</button>}
      {!admin && <div className="mt-5 text-sm flex justify-between"><Link to="/forgot-password">Forgot password?</Link><Link to="/register">Create account</Link></div>}
      <Link className="block mt-5 text-sm text-sky-600" to={admin ? '/login' : '/admin/login'}>{admin ? 'Customer sign in' : 'Admin sign in'}</Link>
    </div>
  </div>
}
