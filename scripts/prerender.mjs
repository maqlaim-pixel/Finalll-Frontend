#!/usr/bin/env node
/**
 * Post-build SEO prerenderer.
 *
 * Vite emits a single dist/index.html for an SPA. This script reuses that
 * template to emit a real HTML file per public route with a unique title,
 * description, canonical, social tags, JSON-LD and a no-JS content fallback.
 * React still mounts into #root, so the live UI and interactivity are unchanged.
 *
 * Dynamic route metadata is generated from the published API content. If the
 * API is unreachable during a build, static routes are still emitted and the
 * build succeeds (the sitemap function remains fully dynamic at runtime).
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { INDEXABLE_ROUTES, breadcrumbsFor, dynamicRouteMeta } from '../src/seo/routes.js'
import { injectHead } from '../src/seo/head.js'
import { canonicalFor, absoluteUrl, DEFAULT_OG_IMAGE } from '../src/seo/siteConfig.js'
import { fetchPublishedContent, contentEntries } from '../src/seo/content.js'
import {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  touristTripSchema,
  articleSchema,
} from '../src/seo/schema.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')

const HUB_LINKS = [
  { href: '/packages', label: 'Tour Packages' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/india', label: 'India Tours' },
  { href: '/international', label: 'International Tours' },
  { href: '/blog', label: 'Travel Blog' },
  { href: '/contact', label: 'Contact Us' },
]

function buildMeta(route, { type, record } = {}) {
  const crumbs = breadcrumbsFor(route.path)
  const canonical = canonicalFor(route.path)
  const jsonLd = []

  if (route.path === '/') jsonLd.push(organizationSchema(), websiteSchema())
  if (crumbs.length > 1) jsonLd.push(breadcrumbSchema(crumbs))
  if (type === 'package' && record) jsonLd.push(touristTripSchema(record, route.path))
  if (type === 'blog' && record) jsonLd.push(articleSchema(record, route.path))

  const intro = route.description
  const links = [...crumbs.slice(1).map((crumb) => ({ href: crumb.url, label: crumb.name })), ...HUB_LINKS]

  return {
    title: route.title,
    description: route.description,
    canonical,
    image: record?.coverImage || record?.image || DEFAULT_OG_IMAGE,
    type: type === 'blog' ? 'article' : 'website',
    publishedTime: record?.publishedAt || undefined,
    modifiedTime: record?.updatedAt || undefined,
    jsonLd,
    noScript: {
      heading: route.label || route.title,
      intro,
      links: links.filter((link, index, list) => list.findIndex((item) => item.href === link.href) === index),
    },
  }
}

async function writeRoute(template, route, context) {
  const meta = buildMeta(route, context)
  const html = injectHead(template, meta)
  if (route.path === '/') {
    await writeFile(path.join(DIST, 'index.html'), html)
  } else {
    const directory = path.join(DIST, route.path.replace(/^\//, ''))
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, 'index.html'), html)
  }
  return route.path
}

async function run() {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf8')

  let content = {}
  try {
    content = await fetchPublishedContent()
  } catch (error) {
    console.warn(`[prerender] Published content unavailable, emitting static routes only: ${error.message}`)
  }

  const routes = INDEXABLE_ROUTES.map((route) => ({ route, context: {} }))

  contentEntries(content).forEach(({ type, record }) => {
    const route = dynamicRouteMeta(type, record)
    if (route) routes.push({ route, context: { type, record } })
  })

  const seen = new Set()
  const written = []
  for (const { route, context } of routes) {
    if (seen.has(route.path)) continue
    seen.add(route.path)
    written.push(await writeRoute(template, route, context))
  }

  // Branded 404 document. Vercel serves it (with a real 404 status) for paths
  // that match neither a prerendered page nor an SPA route rewrite.
  const notFound = injectHead(template, {
    title: 'Page Not Found | Maqlaim Tours',
    description: 'The page you are looking for could not be found. Explore Maqlaim Tours destinations, tour packages and travel guides.',
    canonical: absoluteUrl('/404'),
    robots: 'noindex, nofollow',
    jsonLd: [],
    noScript: {
      heading: 'Page Not Found',
      intro: 'The page you are looking for could not be found. Explore our tour packages or contact our team for help.',
      links: HUB_LINKS,
    },
  })
  await writeFile(path.join(DIST, '404.html'), notFound)

  const dynamicCount = routes.length - INDEXABLE_ROUTES.length
  console.log(`[prerender] Wrote ${written.length} route shells (${dynamicCount} dynamic) + 404.html`)
}

run().catch((error) => {
  console.error('[prerender] Failed:', error)
  process.exitCode = 1
})
