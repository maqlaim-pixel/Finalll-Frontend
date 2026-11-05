import { buildSitemapXml } from '../src/seo/sitemap.js'

/**
 * GET /sitemap.xml (see the rewrite in vercel.json).
 *
 * Generated from the static route registry plus published API content on every
 * request, so newly published packages, destinations and blogs are listed
 * without waiting for a redeploy.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405
    res.setHeader('Allow', 'GET, HEAD')
    res.end('Method Not Allowed')
    return
  }

  try {
    const xml = await buildSitemapXml()
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
    res.end(req.method === 'HEAD' ? undefined : xml)
  } catch (error) {
    console.error('[sitemap] generation failed', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Sitemap temporarily unavailable')
  }
}
