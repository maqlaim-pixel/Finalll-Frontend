/**
 * Central, dependency-free site configuration shared by the React app,
 * the build-time prerenderer and the Vercel sitemap function.
 *
 * The canonical production domain is https://www.maqlaimtours.com and can be
 * overridden per environment with VITE_SITE_URL (build) or SITE_URL (server).
 */

const viteEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}
const nodeEnv = typeof process !== 'undefined' && process.env ? process.env : {}

const configuredUrl = (nodeEnv.VITE_SITE_URL || nodeEnv.SITE_URL || viteEnv.VITE_SITE_URL || '').trim()

export const SITE_URL = (configuredUrl || 'https://www.maqlaimtours.com').replace(/\/+$/, '')
export const SITE_NAME = 'Maqlaim Tours'
export const SITE_LEGAL_NAME = 'Maqlaim Tours'
export const SITE_LANGUAGE = 'en-IN'
export const SITE_LOCALE = 'en_IN'

export const HOME_TITLE = 'Maqlaim Tours | India & International Tour Packages'
export const HOME_DESCRIPTION =
  'Explore India and international holiday packages with Maqlaim Tours. Discover beautiful destinations, customised itineraries and travel experiences.'

export const DEFAULT_OG_IMAGE = `${SITE_URL}/maqlaim-tours-logo.jpeg`
export const DEFAULT_OG_IMAGE_ALT = 'Maqlaim Tours — the purity of new destinations'

export const CONTACT = {
  phone: '+91 93137 10465',
  phoneHref: '+919313710465',
  email: 'sales@maqlaimtours.com',
  areaServed: 'India',
}

export const BRAND_TERMS = /TravelVista/gi

export const absoluteUrl = (path = '/') => {
  if (!path) return `${SITE_URL}/`
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** Normalise a path for canonical URLs: no query, no hash, no trailing slash. */
export const canonicalPath = (value = '/') => {
  const raw = String(value || '/').split(/[?#]/, 1)[0]
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, '/')
  const trimmed = collapsed.length > 1 ? collapsed.replace(/\/+$/, '') : '/'
  return trimmed || '/'
}

/** Route aliases that must consolidate to a single canonical URL. */
export const CANONICAL_OVERRIDES = {
  '/holiday': '/holidays',
  '/destination-wedding': '/destination-weddings',
  '/guides/best-time': '/travel-guide/best-time-to-visit',
  '/india/things-to-do': '/india/experiences',
  '/packages/adventure/trekking': '/adventure/trekking-packages',
}

export const canonicalFor = (value = '/') => {
  const path = canonicalPath(value)
  return absoluteUrl(CANONICAL_OVERRIDES[path] || path)
}
