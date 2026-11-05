/**
 * Server-side content loading for the sitemap and the build-time prerenderer.
 * Only published records are ever used. Failures degrade to static routes.
 */

const DEFAULT_API_BASE = 'https://final-backend-production-7276.up.railway.app'

const nodeEnv = typeof process !== 'undefined' && process.env ? process.env : {}
const configured = (nodeEnv.API_BASE_URL || nodeEnv.VITE_API_URL || '').trim().replace(/\/+$/, '')

export const API_BASE = configured
  ? configured.endsWith('/api')
    ? configured
    : `${configured}/api`
  : `${DEFAULT_API_BASE}/api`

const withTimeout = async (url, timeoutMs = 12000) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

const listFrom = (payload) => {
  if (Array.isArray(payload)) return payload
  for (const key of ['content', 'data', 'items']) {
    if (Array.isArray(payload?.[key])) return payload[key]
  }
  return []
}

const isPublished = (record) =>
  Boolean(record) && String(record.status || 'published').toLowerCase() === 'published' && record.isActive !== false

const safeList = async (endpoint) => {
  try {
    const payload = await withTimeout(`${API_BASE}${endpoint}`)
    return listFrom(payload).filter(isPublished)
  } catch (error) {
    if (nodeEnv.NODE_ENV !== 'test') {
      console.warn(`[seo] Could not load ${endpoint}: ${error.message}`)
    }
    return []
  }
}

/**
 * Load published content once, in parallel.
 * @returns {Promise<{packages: Array, destinations: Array, blogs: Array, hotels: Array, activities: Array}>}
 */
export async function fetchPublishedContent() {
  const [packages, destinations, blogs, hotels, activities] = await Promise.all([
    safeList('/packages?status=published'),
    safeList('/destinations?status=published'),
    safeList('/blogs'),
    safeList('/hotels'),
    safeList('/activities'),
  ])
  return { packages, destinations, blogs, hotels, activities }
}

export function contentEntries(content = {}) {
  const entries = []
  const add = (type, records = []) => {
    records.forEach((record) => {
      if (record && (record.slug || record.id)) entries.push({ type, record })
    })
  }
  add('package', content.packages)
  add('destination', content.destinations)
  add('blog', content.blogs)
  // Hotel detail pages are excluded until they render per-hotel content instead
  // of the shared sample property; indexing them would create duplicate pages.
  add('activity', content.activities)
  return entries
}
