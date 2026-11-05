import { useEffect, useState } from 'react'
import { analyticsConfigured, getAnalyticsConsent, setAnalyticsConsent, subscribeAnalyticsConsent } from '../../utils/analytics'

/**
 * Minimal analytics consent prompt. Rendered only when a GA4 measurement ID is
 * configured and no choice has been stored yet. GA4 never loads before consent.
 */
export default function AnalyticsConsent() {
  const [consent, setConsent] = useState(() => getAnalyticsConsent())

  useEffect(() => subscribeAnalyticsConsent(setConsent), [])

  if (!analyticsConfigured || consent) return null

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="fixed bottom-4 left-4 right-4 z-[70] rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:left-6 sm:right-auto sm:max-w-sm"
    >
      <p className="text-sm font-semibold text-[#003B73]">Help us improve your experience</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">
        We use analytics cookies to understand how visitors use our website. You can accept or decline at any time.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setAnalyticsConsent('granted')}
          className="rounded-lg bg-[#FF8500] px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-600"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => setAnalyticsConsent('denied')}
          className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Decline
        </button>
      </div>
    </div>
  )
}
