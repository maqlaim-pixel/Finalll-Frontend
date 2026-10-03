import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getOtpErrorMessage } from '../../utils/otpErrors'
import { clearLocalTravelReturnPath, getLocalTravelReturnPath } from '../../hooks/useLocalTravelFlow'

function readChallenge() {
  try {
    const data = JSON.parse(sessionStorage.getItem('tv_otp'))
    return data?.transactionId && data?.email && ['REGISTRATION', 'LOGIN'].includes(data.purpose) ? data : null
  } catch { return null }
}

export default function VerifyOtpPage() {
  const [challenge, setChallenge] = useState(readChallenge)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [now, setNow] = useState(Date.now())
  const inFlight = useRef(false)
  const { verifyRegistration, verifyLoginOtp, resendRegistration, resendLoginOtp } = useAuth()
  const navigate = useNavigate()
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  if (!challenge) return <Navigate to="/login" replace />
  const registration = challenge.purpose === 'REGISTRATION'
  const cooldown = Math.max(0, Math.ceil((challenge.requestedAt + 60000 - now) / 1000))
  const verify = async event => {
    event.preventDefault()
    if (inFlight.current || !/^\d{6}$/.test(otp)) return
    inFlight.current = true; setBusy(true); setError('')
    try {
      if (registration) await verifyRegistration(challenge.email, otp, challenge.transactionId)
      else await verifyLoginOtp({ email: challenge.email, otp, transactionId: challenge.transactionId })
      const returnPath = getLocalTravelReturnPath()
      clearLocalTravelReturnPath()
      navigate(returnPath || '/', { replace: true })
    } catch (err) { setError(getOtpErrorMessage(err)) }
    finally { inFlight.current = false; setBusy(false) }
  }
  const resend = async () => {
    if (inFlight.current || cooldown) return
    inFlight.current = true; setBusy(true); setError('')
    try {
      const result = registration ? await resendRegistration(challenge.email) : await resendLoginOtp(challenge.email, challenge.transactionId)
      setChallenge(result); setOtp(''); setMessage('A new code has been sent. The previous code is no longer valid.')
    } catch (err) { setError(getOtpErrorMessage(err)) }
    finally { inFlight.current = false; setBusy(false) }
  }
  const masked = challenge.email[0] + '***' + challenge.email.slice(challenge.email.indexOf('@'))
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md bg-white border rounded-xl p-8">
      <h1 className="text-2xl font-bold mb-3">{registration ? 'Verify Your Email' : 'Verify Your Login'}</h1>
      <p className="text-sm text-navy-600 mb-5">OTP sent to {masked}. Your code is valid for 10 minutes.</p>
      {error && <p role="alert" className="bg-red-50 text-red-600 rounded-lg p-3 mb-4">{error}</p>}
      {message && <p role="status" className="text-green-700 mb-4">{message}</p>}
      <form onSubmit={verify}>
        <label htmlFor="otp" className="block text-sm mb-2">Six-digit verification code</label>
        <input id="otp" autoFocus autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={otp}
          onChange={event => setOtp(event.target.value.replace(/\D/g, ''))} disabled={busy}
          className="w-full border rounded-lg p-3 text-center text-2xl tracking-widest" />
        <button disabled={busy || otp.length !== 6} className="w-full btn-primary mt-5 disabled:opacity-50">{busy ? 'Please wait...' : 'Verify & Continue'}</button>
      </form>
      <button type="button" onClick={resend} disabled={busy || cooldown > 0} className="mt-5 text-sky-600 disabled:text-gray-400">{cooldown ? `Resend in ${cooldown}s` : 'Resend code'}</button>
      <button type="button" disabled={busy} className="block mt-4 text-sm" onClick={() => { sessionStorage.removeItem('tv_otp'); navigate(registration ? '/register' : '/login', { replace: true }) }}>Back to {registration ? 'registration' : 'login'}</button>
    </div>
  </div>
}
