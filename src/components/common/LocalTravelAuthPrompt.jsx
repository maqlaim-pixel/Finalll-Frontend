import { Link } from 'react-router-dom'
import { LockKeyhole, X } from 'lucide-react'

export default function LocalTravelAuthPrompt({ onClose, onContinue }) {
  return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-950/60 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="local-travel-auth-title" className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <button type="button" aria-label="Close sign-in prompt" onClick={onClose} className="absolute right-3 top-3 rounded p-2 text-navy-500 hover:bg-gray-100"><X size={18} /></button>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700"><LockKeyhole size={23} /></div>
      <h2 id="local-travel-auth-title" className="font-display text-xl font-bold text-navy-900">Login required</h2>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">Please login or create an account to submit your Local Travel enquiry. Your form details will be saved during authentication.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => onContinue('/login')} className="btn-primary flex-1">Login</button>
        <button type="button" onClick={() => onContinue('/register')} className="btn-secondary flex-1">Create Account</button>
      </div>
      <p className="mt-4 text-center text-xs text-navy-500">New accounts are verified through our existing email OTP process.</p>
      <Link to="/contact" onClick={onClose} className="mt-3 block text-center text-xs text-sky-700 hover:underline">Need help? Contact us</Link>
    </section>
  </div>
}
