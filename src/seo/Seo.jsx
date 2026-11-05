import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  BRAND_TERMS,
  canonicalFor,
  absoluteUrl,
} from './siteConfig.js'
import { ROUTE_MAP, fallbackMeta, breadcrumbsFor, isNoIndexPath } from './routes.js'
import { breadcrumbSchema, organizationSchema, websiteSchema } from './schema.js'

const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const NOINDEX_ROBOTS = 'noindex, nofollow'

let appliedKey = ''

const brand = (value = '') => String(value).replace(BRAND_TERMS, SITE_NAME)

const ensureMeta = (attribute, key, content) => {
  if (content === undefined || content === null || content === '') return
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', String(content))
}

const ensureLink = (rel, href) => {
  if (!href) return
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

const replaceJsonLd = (items = []) => {
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((node) => node.remove())
  items.filter(Boolean).forEach((item) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-jsonld', 'true')
    script.textContent = JSON.stringify(item)
    document.head.appendChild(script)
  })
}

/**
 * Apply a full metadata set. Canonical, robots and social tags are upserted so
 * client-side navigation never leaves a stale canonical from the previous page.
 */
export function applyMetadata(meta = {}) {
  const title = brand(meta.title || SITE_NAME)
  const description = brand(meta.description || '')
  const canonical = meta.canonical || canonicalFor(meta.pathname || '/')
  const image = meta.image ? absoluteUrl(meta.image) : DEFAULT_OG_IMAGE
  const imageAlt = meta.imageAlt || DEFAULT_OG_IMAGE_ALT
  const robots = meta.noindex ? NOINDEX_ROBOTS : INDEX_ROBOTS
  const type = meta.type || 'website'

  document.title = title
  ensureMeta('name', 'description', description)
  ensureMeta('name', 'robots', robots)
  ensureMeta('name', 'googlebot', robots)
  ensureLink('canonical', canonical)

  ensureMeta('property', 'og:type', type)
  ensureMeta('property', 'og:site_name', SITE_NAME)
  ensureMeta('property', 'og:locale', 'en_IN')
  ensureMeta('property', 'og:title', meta.ogTitle ? brand(meta.ogTitle) : title)
  ensureMeta('property', 'og:description', description)
  ensureMeta('property', 'og:url', canonical)
  ensureMeta('property', 'og:image', image)
  ensureMeta('property', 'og:image:alt', imageAlt)

  ensureMeta('name', 'twitter:card', 'summary_large_image')
  ensureMeta('name', 'twitter:title', meta.twitterTitle ? brand(meta.twitterTitle) : title)
  ensureMeta('name', 'twitter:description', description)
  ensureMeta('name', 'twitter:image', image)

  if (meta.keywords) ensureMeta('name', 'keywords', brand(meta.keywords))
  if (meta.publishedTime) ensureMeta('property', 'article:published_time', meta.publishedTime)
  if (meta.modifiedTime) ensureMeta('property', 'article:modified_time', meta.modifiedTime)

  replaceJsonLd(
    Array.isArray(meta.jsonLd) && meta.jsonLd.length
      ? meta.jsonLd
      : [meta.pathname === '/' ? organizationSchema() : null, meta.pathname === '/' ? websiteSchema() : null],
  )

  appliedKey = `${meta.pathname || meta.canonical || '/'}|${title}`
}

/**
 * Route-level defaults. Runs after child page effects (deferred to a task), so
 * it only fills metadata for pages that did not render their own <SEOHead />.
 */
export function applyRouteMetadata(pathname = '/') {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/'
  if (appliedKey.startsWith(`${path}|`)) return

  const route = ROUTE_MAP.get(path) || fallbackMeta(path)
  const noindex = isNoIndexPath(path)
  if (!route && !noindex) return

  const crumbs = breadcrumbsFor(path)
  applyMetadata({
    pathname: path,
    title: route?.title || 'Page Not Found | Maqlaim Tours',
    description: route?.description || 'The page you are looking for could not be found.',
    keywords: undefined,
    noindex,
    jsonLd: [organizationSchema(), websiteSchema(), breadcrumbsFor(path).length > 1 ? breadcrumbSchema(crumbs) : null],
  })
}

/**
 * Reusable per-page SEO component. Existing pages pass title/description/
 * keywords/image; new pages can also pass jsonLd, breadcrumbs and noindex.
 */
export default function SEOHead({
  title,
  description,
  keywords,
  url,
  image,
  imageAlt,
  type = 'website',
  noindex = false,
  jsonLd,
  breadcrumbs,
  publishedTime,
  modifiedTime,
  canonicalPath,
}) {
  const location = useLocation()

  useEffect(() => {
    const pathname = (canonicalPath || location.pathname || '/').split(/[?#]/, 1)[0]
    const route = ROUTE_MAP.get(pathname) || fallbackMeta(pathname)
    const crumbs = breadcrumbs ? [{ name: 'Home', url: '/' }, ...breadcrumbs] : breadcrumbsFor(pathname)
    const schemaItems = Array.isArray(jsonLd) ? [...jsonLd] : jsonLd ? [jsonLd] : []

    if (pathname === '/') schemaItems.unshift(organizationSchema(), websiteSchema())
    if (crumbs.length > 1) schemaItems.push(breadcrumbSchema(crumbs))

    applyMetadata({
      pathname,
      title: title || route?.title,
      description: description || route?.description,
      keywords,
      canonical: url ? absoluteUrl(url) : canonicalFor(pathname),
      image: image || route?.image,
      imageAlt,
      type,
      noindex: noindex || isNoIndexPath(pathname),
      jsonLd: schemaItems,
      publishedTime,
      modifiedTime,
    })
  }, [title, description, keywords, url, image, imageAlt, type, noindex, jsonLd, breadcrumbs, publishedTime, modifiedTime, canonicalPath, location.pathname])

  return null
}
