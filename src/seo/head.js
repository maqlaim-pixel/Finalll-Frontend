/**
 * HTML head serialiser used by the build-time prerenderer (Node) so that every
 * public route ships with unique, crawlable metadata before JavaScript runs.
 */

import { SITE_NAME, SITE_LOCALE, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from './siteConfig.js'

export const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const jsonLdScript = (data) =>
  `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

/**
 * Build the metadata block for a route.
 * meta: { title, description, canonical, image, imageAlt, type, robots,
 *         publishedTime, modifiedTime, jsonLd: [] }
 */
export function renderHeadTags(meta = {}) {
  const title = meta.title || SITE_NAME
  const description = meta.description || ''
  const canonical = meta.canonical || ''
  const image = meta.image || DEFAULT_OG_IMAGE
  const imageAlt = meta.imageAlt || DEFAULT_OG_IMAGE_ALT
  const type = meta.type || 'website'
  const robots = meta.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    description ? `<meta name="description" content="${escapeHtml(description)}" />` : '',
    canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : '',
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    `<meta property="og:type" content="${escapeHtml(type)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${escapeHtml(SITE_LOCALE)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.ogTitle || title)}" />`,
    description ? `<meta property="og:description" content="${escapeHtml(meta.ogDescription || description)}" />` : '',
    canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}" />` : '',
    image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : '',
    image ? `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />` : '',
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.twitterTitle || title)}" />`,
    description ? `<meta name="twitter:description" content="${escapeHtml(meta.twitterDescription || description)}" />` : '',
    image ? `<meta name="twitter:image" content="${escapeHtml(meta.twitterImage || image)}" />` : '',
    meta.publishedTime ? `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}" />` : '',
    meta.modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(meta.modifiedTime)}" />` : '',
    ...(Array.isArray(meta.jsonLd) ? meta.jsonLd.filter(Boolean).map(jsonLdScript) : []),
  ]

  return tags.filter(Boolean).join('\n    ')
}

/** Visible-only-when-JS-is-off fallback that gives crawlers real headings and links. */
export function renderNoScript(meta = {}) {
  if (!meta.noScript) return ''
  const { heading, intro, links = [] } = meta.noScript
  const list = links
    .filter((link) => link && link.href && link.label)
    .map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
    .join('')
  return `<noscript><div style="max-width:64rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,-apple-system,sans-serif;color:#0f172a"><h1 style="font-size:1.9rem;line-height:1.2;margin:0 0 1rem">${escapeHtml(heading || meta.title || SITE_NAME)}</h1>${intro ? `<p style="margin:0 0 1rem;line-height:1.6">${escapeHtml(intro)}</p>` : ''}${list ? `<ul style="line-height:1.9">${list}</ul>` : ''}<p style="margin-top:1.5rem"><a href="${escapeHtml(meta.canonical || '/')}">Open ${escapeHtml(SITE_NAME)}</a></p></div></noscript>`
}

export function injectHead(html, meta) {
  const head = renderHeadTags(meta)
  let output = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    .replace(/<meta\s+(?:property|name)="(?:og:[^"]+|twitter:[^"]+|article:[^"]+)"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')

  output = output.replace(/<\/head>/i, `    ${head}\n  </head>`)

  const noScript = renderNoScript(meta)
  if (noScript) {
    output = output.replace(/<div id="root"><\/div>/i, `<div id="root"></div>\n    ${noScript}`)
  }
  return output
}
