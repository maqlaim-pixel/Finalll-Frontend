#!/usr/bin/env node
/**
 * Automated SEO verification for the build output and deployment config.
 * Run with `npm run seo:check` after `npm run build`.
 */

import { readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { INDEXABLE_ROUTES, NOINDEX_PREFIXES, COMING_SOON_PATHS } from '../src/seo/routes.js'
import { buildSitemapXml } from '../src/seo/sitemap.js'
import { SITE_URL } from '../src/seo/siteConfig.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok, detail })
const exists = async (file) => {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function main() {
  // 1. Metadata registry integrity
  const paths = INDEXABLE_ROUTES.map((route) => route.path)
  check('Route paths are unique', new Set(paths).size === paths.length, `${paths.length} indexable routes`)
  check('Titles are unique', new Set(INDEXABLE_ROUTES.map((r) => r.title)).size === INDEXABLE_ROUTES.length)
  check('Descriptions are unique', new Set(INDEXABLE_ROUTES.map((r) => r.description)).size === INDEXABLE_ROUTES.length)
  check('No private paths in the registry', !INDEXABLE_ROUTES.some((r) => NOINDEX_PREFIXES.some((p) => r.path.startsWith(p))))
  check('No coming-soon pages in the registry', !INDEXABLE_ROUTES.some((r) => COMING_SOON_PATHS.includes(r.path)))
  check('Every description has a useful length', INDEXABLE_ROUTES.every((r) => r.description.length >= 60))

  // 2. Sitemap
  const xml = await buildSitemapXml()
  const urlCount = (xml.match(/<url>/g) || []).length
  check('Sitemap is well-formed', xml.startsWith('<?xml') && xml.includes('</urlset>'))
  check('Sitemap contains URLs', urlCount > 80, `${urlCount} URLs`)
  check('Sitemap uses the canonical domain', xml.includes(`<loc>${SITE_URL}/`))
  check('Sitemap excludes private areas', !/\/admin|<loc>[^<]*\/account/.test(xml))

  // 3. Build output
  if (!(await exists(path.join(DIST, 'index.html')))) {
    check('dist/index.html exists', false, 'run npm run build first')
  } else {
    const home = await readFile(path.join(DIST, 'index.html'), 'utf8')
    check('Home title is correct', home.includes('<title>Maqlaim Tours | India &amp; International Tour Packages</title>'))
    check('Home has a canonical URL', home.includes(`<link rel="canonical" href="${SITE_URL}/"`))
    check('Home has JSON-LD', home.includes('application/ld+json'))
    check('Home is indexable', !home.includes('name="robots" content="noindex'))

    const notFound = await exists(path.join(DIST, '404.html'))
    check('404.html exists', notFound)
    if (notFound) {
      const html = await readFile(path.join(DIST, '404.html'), 'utf8')
      check('404.html is noindex', html.includes('noindex'))
    }

    check('robots.txt is emitted', await exists(path.join(DIST, 'robots.txt')), 'public/robots.txt')
    check('No static sitemap shadows the function', !(await exists(path.join(DIST, 'sitemap.xml'))))

    const sampleStatic = path.join(DIST, 'packages', 'index.html')
    if (await exists(sampleStatic)) {
      const html = await readFile(sampleStatic, 'utf8')
      check('Static route has its own canonical', html.includes(`<link rel="canonical" href="${SITE_URL}/packages"`))
      check('Static route has a no-JS H1', html.includes('<noscript>') && html.includes('<h1'))
    }
  }

  // 4. Deployment config covers every public app route
  const { rewrites = [], redirects = [] } = JSON.parse(await readFile(path.join(ROOT, 'vercel.json'), 'utf8'))
  const rewriteSources = new Set(rewrites.map((r) => r.source))
  const redirectSources = new Set(redirects.map((r) => r.source))
  const appSource = await readFile(path.join(ROOT, 'src', 'App.jsx'), 'utf8')
  const appPaths = [...appSource.matchAll(/path="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((p) => p.startsWith('/') && !p.startsWith('/admin') && !p.startsWith('/account'))
    .filter((p) => !p.startsWith('/login') && !p.startsWith('/register') && !p.startsWith('/verify-otp') && !p.startsWith('/forgot-password'))

  const missing = []
  for (const routePath of appPaths) {
    if (routePath.includes(':')) {
      if (!rewriteSources.has(routePath) && !redirectSources.has(routePath)) missing.push(routePath)
      continue
    }
    if (COMING_SOON_PATHS.includes(routePath)) continue
    if (redirectSources.has(routePath)) continue
    if (rewriteSources.has(routePath)) continue
    if (!(await exists(path.join(DIST, routePath.replace(/^\//, ''), 'index.html')))) missing.push(routePath)
  }
  check('Every public route is prerendered, rewritten or redirected', missing.length === 0, missing.join(', '))
  check('No catch-all SPA rewrite (so unknown paths can 404)', !rewriteSources.has('/(.*)'))
  check('sitemap.xml rewrite exists', rewriteSources.has('/sitemap.xml'))

  const failed = results.filter((r) => !r.ok)
  results.forEach((r) => console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? ` — ${r.detail}` : ''}`))
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) process.exitCode = 1
}

main().catch((error) => {
  console.error('SEO check crashed:', error)
  process.exitCode = 1
})
