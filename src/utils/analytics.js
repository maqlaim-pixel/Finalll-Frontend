/**
 * Google Analytics 4 loader and event helpers.
 *
 * - Loads only when VITE_GA_MEASUREMENT_ID is configured.
 * - Loads only after the visitor grants analytics consent, and the consent
 *   preference is stored locally.
 * - Every event is de-duplicated so page views and button clicks never double
 *   count (including React StrictMode double effects).
 */

const MEASUREMENT_ID = String((import.meta.env && import.meta.env.VITE_GA_MEASUREMENT_ID) || '').trim()
export const analyticsConfigured = Boolean(MEASUREMENT_ID)

const CONSENT_KEY = 'maqlaim_analytics_consent'
const EVENT_DEDUPE_MS = 1200

let initialized = false
let lastPageView = ''
let lastEvent = { key: '', at: 0 }
const consentListeners = new Set()

export function getAnalyticsConsent() {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function hasAnalyticsConsent() {
  return getAnalyticsConsent() === 'granted'
}

export function setAnalyticsConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    /* storage can be blocked; consent still applies for this session */
  }
  consentListeners.forEach((listener) => listener(value))
  if (value === 'granted') loadGtag()
}

export function subscribeAnalyticsConsent(listener) {
  consentListeners.add(listener)
  return () => consentListeners.delete(listener)
}

function loadGtag() {
  if (typeof window === 'undefined' || initialized || !analyticsConfigured || !hasAnalyticsConsent()) return
  initialized = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  })
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
    transport_type: 'beacon',
  })

  if (!document.querySelector(`script[data-ga4="${MEASUREMENT_ID}"]`)) {
    const script = document.createElement('script')
    script.async = true
    script.dataset.ga4 = MEASUREMENT_ID
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
    document.head.appendChild(script)
  }
}

export function initAnalytics() {
  if (typeof window === 'undefined' || !analyticsConfigured) return
  loadGtag()
}

const TRACKABLE_EXCLUSIONS = ['/admin', '/account', '/login', '/register', '/verify-otp', '/forgot-password']

export function isTrackablePath(pathname = '/') {
  const path = pathname.split(/[?#]/, 1)[0]
  return !TRACKABLE_EXCLUSIONS.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

export function trackPageView(pathname = '/') {
  if (!analyticsConfigured || !hasAnalyticsConsent() || !isTrackablePath(pathname)) return
  loadGtag()
  const path = pathname.split(/[?#]/, 1)[0] || '/'
  if (lastPageView === path) return
  lastPageView = path
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(name, params = {}) {
  if (!analyticsConfigured || !hasAnalyticsConsent() || !name) return
  loadGtag()
  const key = `${name}:${JSON.stringify(params)}`
  const now = Date.now()
  if (lastEvent.key === key && now - lastEvent.at < EVENT_DEDUPE_MS) return
  lastEvent = { key, at: now }
  window.gtag('event', name, params)
}
