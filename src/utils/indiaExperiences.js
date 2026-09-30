const CATEGORY_ALIASES = {
  adventure: ['adventure', 'trekking', 'trekking hiking', 'hiking', 'water sports', 'camping'],
  wildlife: ['wildlife'],
  culture: ['culture', 'culture heritage', 'cultural', 'culture and heritage', 'heritage'],
  food: ['food', 'food cuisine', 'cuisine', 'culinary'],
  spiritual: ['spiritual', 'pilgrimage', 'pilgrimage tours', 'religious'],
  luxury: ['luxury'],
  family: ['family', 'family friendly'],
  'water-sports': ['water sports', 'water sport'],
  trekking: ['trekking', 'trekking hiking', 'hiking'],
  camping: ['camping'],
  pilgrimage: ['pilgrimage', 'pilgrimage tours', 'spiritual', 'religious'],
  shopping: ['shopping'],
}

function normalizeCategory(value) {
  return typeof value === 'string'
    ? value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    : ''
}

export function getPublishedActivities(activities) {
  if (!Array.isArray(activities)) return []
  return activities.filter(activity => (
    activity && typeof activity === 'object' &&
    normalizeCategory(activity.status) === 'published'
  ))
}

export function filterIndiaExperienceActivities(activities, categorySlug = 'all') {
  const published = getPublishedActivities(activities)
  const slug = normalizeCategory(categorySlug).replace(/ /g, '-') || 'all'
  if (slug === 'all' || slug === 'experiences' || slug === 'things-to-do') return published

  const acceptedCategories = CATEGORY_ALIASES[slug] || [slug.replace(/-/g, ' ')]
  const accepted = new Set(acceptedCategories.map(normalizeCategory))
  return published.filter(activity => accepted.has(normalizeCategory(activity.category)))
}
