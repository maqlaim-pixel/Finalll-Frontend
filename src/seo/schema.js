/**
 * JSON-LD builders. Every value must come from data that is actually shown on
 * the site: no invented ratings, reviews, prices, addresses or offers.
 */

import {
  SITE_URL,
  SITE_NAME,
  SITE_LANGUAGE,
  DEFAULT_OG_IMAGE,
  CONTACT,
  absoluteUrl,
} from './siteConfig.js'

const compact = (value) => {
  if (Array.isArray(value)) {
    const list = value.map(compact).filter(Boolean)
    return list.length ? list : undefined
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, compact(item)])
      .filter(([, item]) => item !== undefined && item !== null && item !== '')
    return entries.length ? Object.fromEntries(entries) : undefined
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || undefined
  }
  return value
}

const asText = (value) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '')

export function organizationSchema() {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: DEFAULT_OG_IMAGE,
    image: DEFAULT_OG_IMAGE,
    description:
      'Maqlaim Tours is a travel company offering India and international tour packages, destination holidays, hotels, activities, local transfers and destination wedding planning.',
    telephone: CONTACT.phoneHref,
    email: CONTACT.email,
    areaServed: CONTACT.areaServed,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT.phoneHref,
      email: CONTACT.email,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  })
}

export function websiteSchema() {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: SITE_LANGUAGE,
    publisher: { '@id': `${SITE_URL}/#organization` },
  })
}

export function breadcrumbSchema(items = []) {
  const valid = items.filter((item) => item && item.name)
  if (!valid.length) return null
  return compact({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: valid.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? absoluteUrl(item.url) : undefined,
    })),
  })
}

/**
 * TouristTrip for a published package. Offers are only emitted when the API
 * supplies a genuine starting price.
 */
export function touristTripSchema(pkg = {}, url = '') {
  if (!pkg || !pkg.title) return null
  const itinerary = Array.isArray(pkg.itinerary)
    ? pkg.itinerary.map((day) => {
        if (!day) return null
        if (typeof day === 'string') return { '@type': 'TouristAttraction', name: day }
        const title = day.title || day.name
        if (!title) return null
        return {
          '@type': 'TouristAttraction',
          name: title,
          description: asText(day.desc || day.description) || undefined,
        }
      })
    : undefined

  const price = Number(pkg.startingPrice)
  const hasPrice = Number.isFinite(price) && price > 0

  return compact({
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: asText(pkg.shortDescription || pkg.description) || undefined,
    image: pkg.coverImage || pkg.image || undefined,
    url: absoluteUrl(url),
    touristType: pkg.category === 'international' ? 'International travellers' : undefined,
    itinerary: itinerary && itinerary.length ? { '@type': 'ItemList', itemListElement: itinerary } : undefined,
    provider: { '@id': `${SITE_URL}/#organization` },
    offers: hasPrice
      ? {
          '@type': 'Offer',
          price: price.toFixed(2),
          priceCurrency: pkg.currency || 'INR',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl(url),
        }
      : undefined,
  })
}

export function articleSchema(post = {}, url = '') {
  if (!post || !post.title) return null
  return compact({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: asText(post.excerpt || post.description) || undefined,
    image: post.image || undefined,
    url: absoluteUrl(url),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(url) },
    datePublished: post.publishedAt || post.createdAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt || undefined,
    author: post.author ? { '@type': 'Person', name: post.author } : undefined,
    publisher: { '@id': `${SITE_URL}/#organization` },
    articleSection: post.category || undefined,
  })
}

export function faqSchema(faqs = []) {
  const items = (Array.isArray(faqs) ? faqs : [])
    .map((faq) => {
      if (!faq) return null
      const question = asText(faq.question || faq.q || faq.title)
      const answer = asText(faq.answer || faq.a || faq.description || faq.content)
      if (!question || !answer) return null
      return {
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      }
    })
    .filter(Boolean)
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items,
  }
}

export function itemListSchema(name, items = []) {
  const list = items.filter((item) => item && item.name)
  if (!list.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: list.length,
    itemListElement: list.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url ? absoluteUrl(item.url) : undefined,
    })),
  }
}
