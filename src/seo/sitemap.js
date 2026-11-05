import { INDEXABLE_ROUTES, dynamicRouteMeta } from './routes.js'
import { canonicalFor } from './siteConfig.js'
import { fetchPublishedContent, contentEntries } from './content.js'

const xmlEscape = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const isoDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

/**
 * Build the complete sitemap from the static route registry plus every
 * published API record. Regenerated on every request, so new packages,
 * destinations and blog posts appear without a redeploy.
 */
export async function buildSitemapEntries() {
  const entries = INDEXABLE_ROUTES.map((route) => ({
    loc: canonicalFor(route.path),
    changefreq: route.changefreq,
    priority: route.priority,
    lastmod: '',
  }))

  let content = {}
  try {
    content = await fetchPublishedContent()
  } catch {
    content = {}
  }

  contentEntries(content).forEach(({ type, record }) => {
    const route = dynamicRouteMeta(type, record)
    if (!route) return
    entries.push({
      loc: canonicalFor(route.path),
      changefreq: type === 'blog' ? 'monthly' : 'weekly',
      priority: route.priority,
      lastmod: isoDate(record.updatedAt || record.publishedAt || record.createdAt),
    })
  })

  const seen = new Set()
  return entries.filter((entry) => {
    if (!entry.loc || seen.has(entry.loc)) return false
    seen.add(entry.loc)
    return true
  })
}

export async function buildSitemapXml() {
  const entries = await buildSitemapEntries()
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}
