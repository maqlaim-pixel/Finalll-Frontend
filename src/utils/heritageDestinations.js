const INDIA_COUNTRY = 'india'

const HERITAGE_SIGNAL = /\b(?:heritage|unesco|historic(?:al)?|history|ancient|archaeolog(?:y|ical)|monuments?|forts?|palaces?|temples?|royal|kingdom|cultural|culture)\b/i

export const HERITAGE_FILTERS = [
  { id: 'forts-palaces', label: 'Forts & Palaces', pattern: /\b(?:forts?|palaces?|fortresses|citadels?)\b/i },
  { id: 'temples', label: 'Temples', pattern: /\b(?:temples?|shrines?|monasteries)\b/i },
  { id: 'unesco', label: 'UNESCO Sites', pattern: /\bunesco\b/i },
  { id: 'royal', label: 'Royal Cities', pattern: /\b(?:royal|royalty|kings?|kingdom|dynast(?:y|ies))\b/i },
  { id: 'historical', label: 'Historical Cities', pattern: /\b(?:historic(?:al)?|history|ancient|archaeolog(?:y|ical)|ruins?|monuments?)\b/i },
  { id: 'cultural', label: 'Cultural Trails', pattern: /\b(?:cultur(?:e|al)|heritage\s+(?:walk|trail)|festivals?|handicrafts?|folk)\b/i },
]

const RELIGIOUS_SIGNAL = /\b(?:religious|spiritual|pilgrimages?|temples?|shrines?|monaster(?:y|ies)|sacred|holy|jyotirlingas?|dham|shakti[\s-]+peethas?|gurudwaras?|gurdwaras?|buddhist|jain(?:ism)?|church(?:es)?|cathedrals?|mosques?|dargahs?|stupas?|ghats?|aarti|ashrams?)\b/i
const HILL_STATION_SIGNAL = /\b(?:hill\s*stations?|hills?|mountains?)\b/i
const BEACH_SIGNAL = /\b(?:beach(?:es)?|beachfront|beachside|coastal|coastline|coasts?|seaside)\b/i
const BEACH_METADATA_FIELDS = [
  'category', 'destinationCategory', 'destinationType', 'type', 'theme', 'themes', 'tags', 'experienceType',
]
const BEACH_FEATURE_FIELDS = BEACH_METADATA_FIELDS
const BEACH_CMS_FIELDS = ['experiences']
const BEACH_NESTED_METADATA_KEYS = ['category', 'type', 'theme', 'themes', 'tags']
const BEACH_FILTER_DEFAULT = { id: 'all', label: 'All Beach Destinations' }
const BEACH_REGION_FILTER_PREFIX = 'region:'

const WILDLIFE_SIGNAL = /\b(?:wildlife|national parks?|tiger reserves?|wildlife sanctuar(?:y|ies)|bird sanctuar(?:y|ies)|nature reserves?|game reserves?|biosphere reserves?|wildlife parks?|marine wildlife|marine parks?|marine sanctuar(?:y|ies)|safaris?)\b/i
const WILDLIFE_METADATA_FIELDS = [
  'category', 'destinationCategory', 'destinationType', 'type', 'subtype', 'subCategory',
  'theme', 'themes', 'tags', 'wildlife', 'wildlifeCategory', 'wildlifeType', 'experienceType',
]
const WILDLIFE_FEATURE_FIELDS = [...WILDLIFE_METADATA_FIELDS, 'highlights']
const WILDLIFE_NESTED_METADATA_KEYS = [
  'category', 'type', 'subtype', 'subCategory', 'theme', 'themes', 'tags', 'experienceType',
]
const WILDLIFE_FILTERS = [
  { id: 'national-parks', label: 'National Parks', pattern: /\bnational parks?\b/i },
  { id: 'tiger-reserves', label: 'Tiger Reserves', pattern: /\btiger reserves?\b/i },
  { id: 'wildlife-sanctuaries', label: 'Wildlife Sanctuaries', pattern: /\bwildlife sanctuar(?:y|ies)\b/i },
  { id: 'bird-sanctuaries', label: 'Bird Sanctuaries', pattern: /\bbird sanctuar(?:y|ies)\b/i },
  { id: 'marine-wildlife', label: 'Marine Wildlife', pattern: /\b(?:marine wildlife|marine parks?|marine sanctuar(?:y|ies))\b/i },
  { id: 'forest-experiences', label: 'Forest Experiences', pattern: /\b(?:forest|rainforest|jungle)\b/i },
  { id: 'safari-destinations', label: 'Safari Destinations', pattern: /\bsafaris?\b/i },
]
const WILDLIFE_FILTER_DEFAULT = { id: 'all', label: 'All Wildlife Destinations' }

const WEEKEND_GETAWAY_SIGNAL = /\b(?:weekend[\s-]*(?:getaways?|escapes?|trips?)|short[\s-]*(?:getaways?|escapes?|breaks?))\b/i
const WEEKEND_GETAWAY_METADATA_FIELDS = [
  'category', 'destinationCategory', 'destinationType', 'type', 'subtype', 'subCategory',
  'theme', 'themes', 'tags', 'weekendCategory', 'weekendType', 'experienceType',
]
const WEEKEND_GETAWAY_NESTED_METADATA_KEYS = [
  'category', 'type', 'subtype', 'subCategory', 'theme', 'themes', 'tags', 'experienceType',
]
const WEEKEND_GETAWAY_ORIGIN_FIELDS = ['weekendFrom', 'fromCity', 'departureCity', 'originCity', 'originCities']
const WEEKEND_GETAWAY_FILTER_DEFAULT = { id: 'all', label: 'All Weekend Getaways' }

const OFFBEAT_SIGNAL = /\b(?:offbeat|hidden[\s-]*gems?|unexplored|undiscovered)\b/i
const OFFBEAT_METADATA_FIELDS = [
  'category', 'destinationCategory', 'destinationType', 'type', 'subcategory', 'subCategory',
  'offbeatCategory', 'offbeatType', 'theme', 'themes', 'tags', 'experienceType',
]
const OFFBEAT_NESTED_METADATA_KEYS = [
  'category', 'type', 'subcategory', 'subCategory', 'theme', 'themes', 'tags', 'experienceType',
]
const OFFBEAT_FILTER_DEFAULT = { id: 'all', label: 'All Offbeat Destinations' }
const FAMOUS_FILTER_DEFAULT = { id: 'all', label: 'All Famous Destinations' }

function normalizeBeachMetadataText(text) {
  return text.replace(/[_-]+/g, ' ')
}

function wildlifeMetadataText(destination) {
  if (!destination) return ''

  const destinationMetadata = WILDLIFE_METADATA_FIELDS.map(field =>
    fieldText(destination[field], WILDLIFE_NESTED_METADATA_KEYS)
  )
  const experienceMetadata = fieldText(destination.experiences, WILDLIFE_NESTED_METADATA_KEYS)

  // Only structured taxonomy fields and active experience metadata classify a
  // destination. Names, states, highlights, CMS titles, and prose are excluded.
  return [...destinationMetadata, experienceMetadata].filter(Boolean).join(' ')
}

function normalizedWildlifeMetadataText(destination) {
  return wildlifeMetadataText(destination).replace(/[_-]+/g, ' ')
}

function beachRegionFilterId(region) {
  return `${BEACH_REGION_FILTER_PREFIX}${encodeURIComponent(String(region || '').trim().toLowerCase())}`
}

function getBeachRegionValue(destination) {
  for (const value of [destination?.state, destination?.region]) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function getBeachFilterMetadataText(destination) {
  if (!destination) return ''

  const destinationMetadata = BEACH_METADATA_FIELDS.map(field =>
    fieldText(destination[field], BEACH_NESTED_METADATA_KEYS)
  )
  const cmsMetadata = BEACH_CMS_FIELDS.map(field =>
    fieldText(destination[field], BEACH_NESTED_METADATA_KEYS)
  )

  // Classification comes from structured category/type/theme/tag metadata;
  // names, states, descriptions, highlights and CMS titles are not signals.
  return [...destinationMetadata, ...cmsMetadata].filter(Boolean).join(' ')
}

export const RELIGIOUS_FILTERS = [
  { id: 'pilgrimage', label: 'Pilgrimage Sites', pattern: /\bpilgrimages?\b/i },
  { id: 'temples-shrines', label: 'Temples & Shrines', pattern: /\b(?:temples?|shrines?)\b/i },
  { id: 'jyotirlingas', label: 'Jyotirlingas', pattern: /\bjyotirlingas?\b/i },
  { id: 'char-dham', label: 'Char Dham', pattern: /\bchar\s+dham\b/i },
  { id: 'shakti-peethas', label: 'Shakti Peethas', pattern: /\bshakti[\s-]+peethas?\b/i },
  { id: 'buddhist-sites', label: 'Buddhist Sites', pattern: /\b(?:buddhist|stupas?)\b/i },
  { id: 'jain-sites', label: 'Jain Sites', pattern: /\bjain(?:ism)?\b/i },
  { id: 'sikh-gurudwaras', label: 'Sikh Gurudwaras', pattern: /\b(?:sikh|gurudwaras?|gurdwaras?)\b/i },
  { id: 'sacred-rivers-ghats', label: 'Sacred Rivers & Ghats', pattern: /\b(?:sacred\s+rivers?|ghats?|aarti)\b/i },
  { id: 'monasteries', label: 'Monasteries', pattern: /\bmonaster(?:y|ies)\b/i },
  { id: 'churches', label: 'Churches & Cathedrals', pattern: /\b(?:church(?:es)?|cathedrals?)\b/i },
  { id: 'mosques', label: 'Mosques & Dargahs', pattern: /\b(?:mosques?|dargahs?)\b/i },
  { id: 'spiritual-sites', label: 'Spiritual Sites', pattern: /\b(?:spiritual|sacred|holy|ashrams?)\b/i },
]

const DESTINATION_METADATA_FIELDS = [
  'category', 'destinationCategory', 'destinationType', 'heritageCategory',
  'heritageType', 'theme', 'themes', 'tags', 'highlights', 'experienceType',
]
const CMS_METADATA_FIELDS = ['destinationHighlights', 'experiences', 'attractions']
const RELIGIOUS_METADATA_FIELDS = [
  'category', 'destinationCategory', 'destinationType', 'religiousCategory', 'religiousType',
  'spiritualCategory', 'pilgrimageType', 'theme', 'themes', 'tags', 'highlights',
  'experienceType', 'subcategory', 'subCategory',
]
const RELIGIOUS_CMS_METADATA_FIELDS = ['destinationHighlights', 'experiences', 'attractions']
const RELIGIOUS_NESTED_METADATA_KEYS = [
  'category', 'type', 'theme', 'themes', 'tags', 'title', 'name', 'label',
]
const HILL_STATION_METADATA_FIELDS = [
  'category', 'destinationCategory', 'destinationType', 'hillStationCategory', 'hillStationType',
  'type', 'theme', 'themes', 'tags', 'highlights', 'experienceType', 'terrain', 'terrainType',
  'landscape', 'landscapeType', 'regionType',
]
const HILL_STATION_CMS_FIELDS = ['destinationHighlights', 'experiences', 'attractions']
const HILL_STATION_NESTED_METADATA_KEYS = [
  'category', 'type', 'theme', 'themes', 'tags', 'title', 'name', 'label',
]
const HILL_STATION_CMS_NESTED_KEYS = ['category', 'type', 'theme', 'themes', 'tags']
const HILL_STATION_FEATURE_FIELDS = [
  'category', 'destinationCategory', 'destinationType', 'hillStationCategory', 'hillStationType',
  'theme', 'themes', 'tags', 'highlights',
]
const NESTED_METADATA_KEYS = [
  'category', 'type', 'theme', 'themes', 'tags', 'title', 'name', 'label',
]

function parseField(value) {
  if (value == null || value === '') return []
  if (Array.isArray(value)) return value
  if (typeof value === 'object') return [value]

  const text = String(value).trim()
  if (!text) return []

  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      // Keep non-JSON CMS text usable as plain metadata.
    }
  }

  return text.split(/[,|]/).map(part => part.trim()).filter(Boolean)
}

function valueText(value, allowedKeys = NESTED_METADATA_KEYS) {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(item => valueText(item, allowedKeys)).filter(Boolean).join(' ')
  if (typeof value !== 'object' || value.isActive === false) return ''

  return allowedKeys
    .map(key => value[key])
    .filter(item => item != null)
    .map(item => valueText(item, allowedKeys))
    .filter(Boolean)
    .join(' ')
}

function fieldText(value, allowedKeys = NESTED_METADATA_KEYS) {
  return parseField(value)
    .filter(item => typeof item !== 'object' || item.isActive !== false)
    .map(item => valueText(item, allowedKeys))
    .filter(Boolean)
    .join(' ')
}

export function isIndiaDestination(destination) {
  const country = String(destination?.country || '').trim().toLowerCase()
  const type = String(destination?.type || '').trim().toLowerCase()
  return country ? country === INDIA_COUNTRY : type === 'domestic'
}

export function isPublishedDestination(destination) {
  return String(destination?.status || '').trim().toLowerCase() === 'published'
}

export function isDestinationListResponse(destinations) {
  return Array.isArray(destinations) && destinations.every(destination => {
    if (!destination || typeof destination !== 'object' || Array.isArray(destination)) return false

    const hasId = (typeof destination.id === 'number' && Number.isFinite(destination.id))
      || (typeof destination.id === 'string' && Boolean(destination.id.trim()))
    return hasId
      && typeof destination.name === 'string' && Boolean(destination.name.trim())
      && typeof destination.slug === 'string' && Boolean(destination.slug.trim())
      && typeof destination.status === 'string' && Boolean(destination.status.trim())
  })
}

export function getPublishedIndiaDestinations(destinations) {
  return (Array.isArray(destinations) ? destinations : [])
    .filter(isPublishedDestination)
    .filter(isIndiaDestination)
    .sort((a, b) => {
      const byOrder = (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      return byOrder !== 0 ? byOrder : (a.name || '').localeCompare(b.name || '')
    })
}

export function getAllIndiaDestinations(destinations) {
  return getPublishedIndiaDestinations(destinations).filter(isNotExplicitlyInactive)
}

export function getIndiaDestinationStates(destinations) {
  const states = new Map()

  for (const destination of Array.isArray(destinations) ? destinations : []) {
    const state = typeof destination?.state === 'string' ? destination.state.trim() : ''
    const normalizedState = state.toLowerCase()
    if (state && !states.has(normalizedState)) states.set(normalizedState, state)
  }

  return [...states.values()].sort((a, b) => a.localeCompare(b))
}

export function destinationHeritageText(destination) {
  if (!destination) return ''

  const destinationMetadata = DESTINATION_METADATA_FIELDS.map(field => fieldText(destination[field]))
  const cmsMetadata = CMS_METADATA_FIELDS.map(field => fieldText(destination[field]))

  // Free-text CMS descriptions are checked only for explicit heritage signals;
  // destination names and generic domestic/international type are never used.
  return [...destinationMetadata, ...cmsMetadata].filter(Boolean).join(' ')
}

export function isHeritageDestination(destination) {
  return HERITAGE_SIGNAL.test(destinationHeritageText(destination))
}

export function getIndiaHeritageDestinations(destinations) {
  return getPublishedIndiaDestinations(destinations).filter(isHeritageDestination)
}

export function destinationReligiousText(destination) {
  if (!destination) return ''

  const destinationMetadata = RELIGIOUS_METADATA_FIELDS.map(field =>
    fieldText(destination[field], RELIGIOUS_NESTED_METADATA_KEYS)
  )
  const cmsMetadata = RELIGIOUS_CMS_METADATA_FIELDS.map(field =>
    fieldText(destination[field], RELIGIOUS_NESTED_METADATA_KEYS)
  )

  // Classification comes from structured destination/CMS metadata only. Names,
  // descriptions, and inactive CMS records cannot turn a destination religious.
  return [...destinationMetadata, ...cmsMetadata].filter(Boolean).join(' ')
}

export function isReligiousDestination(destination) {
  return RELIGIOUS_SIGNAL.test(destinationReligiousText(destination))
}

export function getIndiaReligiousDestinations(destinations) {
  return getPublishedIndiaDestinations(destinations).filter(isReligiousDestination)
}

export function getSupportedReligiousFilters(destinations) {
  const religiousDestinations = Array.isArray(destinations) ? destinations : []
  return [
    { id: 'all', label: 'All Religious Destinations', pattern: null },
    ...RELIGIOUS_FILTERS.filter(filter =>
      religiousDestinations.some(destination => filter.pattern.test(destinationReligiousText(destination)))
    ),
  ]
}

export function matchesReligiousFilter(destination, filterId) {
  if (filterId === 'all') return true
  const filter = RELIGIOUS_FILTERS.find(item => item.id === filterId)
  return filter ? filter.pattern.test(destinationReligiousText(destination)) : false
}

export function destinationHillStationText(destination) {
  if (!destination) return ''

  const destinationMetadata = HILL_STATION_METADATA_FIELDS.map(field =>
    fieldText(destination[field], HILL_STATION_NESTED_METADATA_KEYS)
  )
  const cmsMetadata = HILL_STATION_CMS_FIELDS.map(field =>
    fieldText(destination[field], HILL_STATION_CMS_NESTED_KEYS)
  )

  // Hill classification is read from structured metadata only. Destination
  // names, state names, and general descriptions never classify a record.
  return [...destinationMetadata, ...cmsMetadata].filter(Boolean).join(' ')
}

export function isHillStationDestination(destination) {
  return HILL_STATION_SIGNAL.test(destinationHillStationText(destination).replace(/[_-]+/g, ' '))
}

function isNotExplicitlyInactive(destination) {
  return !['isActive', 'active', 'published'].some(field => {
    const value = destination?.[field]
    return value === false || (typeof value === 'string' && value.trim().toLowerCase() === 'false')
  })
}

export function getIndiaHillStations(destinations) {
  return getPublishedIndiaDestinations(destinations)
    .filter(isNotExplicitlyInactive)
    .filter(isHillStationDestination)
}

export function destinationBeachText(destination) {
  return getBeachFilterMetadataText(destination)
}

export function isBeachDestination(destination) {
  return BEACH_SIGNAL.test(normalizeBeachMetadataText(destinationBeachText(destination)))
}

export function getIndiaBeachDestinations(destinations) {
  return getPublishedIndiaDestinations(destinations)
    .filter(isNotExplicitlyInactive)
    .filter(isBeachDestination)
}

export function getBeachDestinationRegion(destination) {
  return getBeachRegionValue(destination)
}

export function getBeachFeatureTags(destination, limit = 3) {
  if (!destination) return []

  const metadataValues = BEACH_FEATURE_FIELDS.flatMap(field => parseField(destination[field]))
  const metadataLabels = metadataValues
    .filter(value => typeof value !== 'object' || value.isActive !== false)
    .map(value => typeof value === 'string' ? value : valueText(value, BEACH_NESTED_METADATA_KEYS))
  const tags = []

  for (const label of [...metadataLabels, ...getDestinationFeatureTags(destination, limit)]) {
    const cleanLabel = String(label || '').trim()
    if (!cleanLabel || /^(?:domestic|international|published|draft|active|inactive)$/i.test(cleanLabel) || tags.includes(cleanLabel)) continue
    tags.push(cleanLabel)
    if (tags.length >= limit) break
  }

  return tags
}

export function getSupportedBeachFilters(destinations) {
  const regions = new Map()
  for (const destination of Array.isArray(destinations) ? destinations : []) {
    const region = getBeachRegionValue(destination)
    const normalizedRegion = region.toLowerCase()
    if (region && !regions.has(normalizedRegion)) regions.set(normalizedRegion, region)
  }

  return [
    BEACH_FILTER_DEFAULT,
    ...[...regions.values()]
      .sort((a, b) => a.localeCompare(b))
      .map(region => ({ id: beachRegionFilterId(region), label: region })),
  ]
}

export function matchesBeachFilter(destination, filterId) {
  if (filterId === BEACH_FILTER_DEFAULT.id) return true
  const region = getBeachRegionValue(destination)
  return region ? beachRegionFilterId(region) === filterId : false
}

export function destinationWildlifeText(destination) {
  return wildlifeMetadataText(destination)
}

export function isWildlifeDestination(destination) {
  return WILDLIFE_SIGNAL.test(normalizedWildlifeMetadataText(destination))
}

export function getIndiaWildlifeDestinations(destinations) {
  return getPublishedIndiaDestinations(destinations)
    .filter(isNotExplicitlyInactive)
    .filter(isWildlifeDestination)
}

export function getWildlifeDestinationRegion(destination) {
  for (const value of [destination?.state, destination?.region]) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

export function getWildlifeFeatureTags(destination, limit = 3) {
  if (!destination) return []

  const metadataValues = WILDLIFE_FEATURE_FIELDS.flatMap(field => parseField(destination[field]))
  const metadataLabels = metadataValues
    .filter(value => typeof value !== 'object' || value.isActive !== false)
    .map(value => typeof value === 'string' ? value : valueText(value, WILDLIFE_NESTED_METADATA_KEYS))
  const tags = []

  for (const label of [...metadataLabels, ...getDestinationFeatureTags(destination, limit)]) {
    const cleanLabel = String(label || '').trim()
    if (!cleanLabel || /^(?:domestic|international|published|draft|active|inactive)$/i.test(cleanLabel) || tags.includes(cleanLabel)) continue
    tags.push(cleanLabel)
    if (tags.length >= limit) break
  }

  return tags
}

export function getSupportedWildlifeFilters(destinations) {
  const wildlifeDestinations = Array.isArray(destinations) ? destinations : []
  return [
    WILDLIFE_FILTER_DEFAULT,
    ...WILDLIFE_FILTERS.filter(filter =>
      wildlifeDestinations.some(destination => filter.pattern.test(normalizedWildlifeMetadataText(destination)))
    ),
  ]
}

export function matchesWildlifeFilter(destination, filterId) {
  if (filterId === WILDLIFE_FILTER_DEFAULT.id) return true
  const filter = WILDLIFE_FILTERS.find(item => item.id === filterId)
  return filter ? filter.pattern.test(normalizedWildlifeMetadataText(destination)) : false
}

function weekendGetawayMetadataText(destination) {
  if (!destination) return ''

  const destinationMetadata = WEEKEND_GETAWAY_METADATA_FIELDS.map(field =>
    fieldText(destination[field], WEEKEND_GETAWAY_NESTED_METADATA_KEYS)
  )
  const experienceMetadata = fieldText(destination.experiences, WEEKEND_GETAWAY_NESTED_METADATA_KEYS)
  return [...destinationMetadata, experienceMetadata].filter(Boolean).join(' ')
}

function normalizedWeekendGetawayMetadataText(destination) {
  return weekendGetawayMetadataText(destination).replace(/[_-]+/g, ' ')
}

export function isWeekendGetawayDestination(destination) {
  return WEEKEND_GETAWAY_SIGNAL.test(normalizedWeekendGetawayMetadataText(destination))
}

export function getIndiaWeekendGetaways(destinations) {
  return getPublishedIndiaDestinations(destinations)
    .filter(isNotExplicitlyInactive)
    .filter(isWeekendGetawayDestination)
}

export function getWeekendGetawayDestinationRegion(destination) {
  for (const value of [destination?.state, destination?.region]) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

export function getWeekendGetawayOriginCities(destination) {
  if (!destination) return []

  const values = WEEKEND_GETAWAY_ORIGIN_FIELDS.flatMap(field => parseField(destination[field]))
  const cities = []
  for (const value of values) {
    const city = (typeof value === 'string'
      ? value
      : valueText(value, ['city', 'name', 'label', 'value']))
      .trim()
    if (city && !cities.some(existing => existing.toLowerCase() === city.toLowerCase())) cities.push(city)
  }
  return cities
}

function weekendGetawayRegionFilterId(region) {
  return `region:${encodeURIComponent(String(region || '').trim().toLowerCase())}`
}

function weekendGetawayOriginFilterId(city) {
  return `from:${encodeURIComponent(String(city || '').trim().toLowerCase())}`
}

export function getSupportedWeekendGetawayFilters(destinations) {
  const weekendGetaways = Array.isArray(destinations) ? destinations : []
  const originCities = new Map()
  for (const destination of weekendGetaways) {
    for (const city of getWeekendGetawayOriginCities(destination)) {
      const normalizedCity = city.toLowerCase()
      if (!originCities.has(normalizedCity)) originCities.set(normalizedCity, city)
    }
  }

  if (originCities.size > 0) {
    return [
      WEEKEND_GETAWAY_FILTER_DEFAULT,
      ...[...originCities.values()]
        .sort((a, b) => a.localeCompare(b))
        .map(city => ({ id: weekendGetawayOriginFilterId(city), label: `From ${city}` })),
    ]
  }

  const regions = new Map()
  for (const destination of weekendGetaways) {
    const region = getWeekendGetawayDestinationRegion(destination)
    const normalizedRegion = region.toLowerCase()
    if (region && !regions.has(normalizedRegion)) regions.set(normalizedRegion, region)
  }

  return [
    WEEKEND_GETAWAY_FILTER_DEFAULT,
    ...[...regions.values()]
      .sort((a, b) => a.localeCompare(b))
      .map(region => ({ id: weekendGetawayRegionFilterId(region), label: region })),
  ]
}

export function matchesWeekendGetawayFilter(destination, filterId) {
  if (filterId === WEEKEND_GETAWAY_FILTER_DEFAULT.id) return true

  if (filterId.startsWith('from:')) {
    const city = decodeURIComponent(filterId.slice('from:'.length))
    return getWeekendGetawayOriginCities(destination)
      .some(origin => origin.toLowerCase() === city.toLowerCase())
  }

  if (filterId.startsWith('region:')) {
    const region = decodeURIComponent(filterId.slice('region:'.length))
    return getWeekendGetawayDestinationRegion(destination).toLowerCase() === region.toLowerCase()
  }

  return false
}

export function getWeekendGetawayFeatureTags(destination, limit = 3) {
  if (!destination) return []

  const metadataValues = WEEKEND_GETAWAY_METADATA_FIELDS.flatMap(field => parseField(destination[field]))
  const metadataLabels = metadataValues
    .filter(value => typeof value !== 'object' || value.isActive !== false)
    .map(value => typeof value === 'string' ? value : valueText(value, WEEKEND_GETAWAY_NESTED_METADATA_KEYS))
  const tags = []

  for (const label of [...metadataLabels, ...getDestinationFeatureTags(destination, limit)]) {
    const cleanLabel = String(label || '').trim()
    if (!cleanLabel || /^(?:domestic|international|published|draft|active|inactive)$/i.test(cleanLabel) || tags.includes(cleanLabel)) continue
    tags.push(cleanLabel)
    if (tags.length >= limit) break
  }

  return tags
}

function offbeatMetadataText(destination) {
  if (!destination) return ''

  const destinationMetadata = OFFBEAT_METADATA_FIELDS.map(field =>
    fieldText(destination[field], OFFBEAT_NESTED_METADATA_KEYS)
  )
  const experienceMetadata = fieldText(destination.experiences, OFFBEAT_NESTED_METADATA_KEYS)
  return [...destinationMetadata, experienceMetadata].filter(Boolean).join(' ')
}

function normalizedOffbeatMetadataText(destination) {
  return offbeatMetadataText(destination).replace(/[_-]+/g, ' ')
}

export function isOffbeatDestination(destination) {
  return OFFBEAT_SIGNAL.test(normalizedOffbeatMetadataText(destination))
}

export function getIndiaOffbeatDestinations(destinations) {
  return getPublishedIndiaDestinations(destinations)
    .filter(isNotExplicitlyInactive)
    .filter(isOffbeatDestination)
}

export function isFamousDestination(destination) {
  return destination?.isFamous === true
}

export function getIndiaFamousDestinations(destinations) {
  return getPublishedIndiaDestinations(destinations)
    .filter(isNotExplicitlyInactive)
    .filter(isFamousDestination)
}

export function getFamousDestinationRegion(destination) {
  for (const value of [destination?.state, destination?.region]) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function famousRegionFilterId(region) {
  return `region:${encodeURIComponent(String(region || '').trim().toLowerCase())}`
}

export function getSupportedFamousFilters(destinations) {
  const regions = new Map()
  for (const destination of Array.isArray(destinations) ? destinations : []) {
    const region = getFamousDestinationRegion(destination)
    const normalizedRegion = region.toLowerCase()
    if (region && !regions.has(normalizedRegion)) regions.set(normalizedRegion, region)
  }

  return [
    FAMOUS_FILTER_DEFAULT,
    ...[...regions.values()]
      .sort((a, b) => a.localeCompare(b))
      .map(region => ({ id: famousRegionFilterId(region), label: region })),
  ]
}

export function matchesFamousFilter(destination, filterId) {
  if (filterId === FAMOUS_FILTER_DEFAULT.id) return true
  if (typeof filterId !== 'string' || !filterId.startsWith('region:')) return false

  let region
  try {
    region = decodeURIComponent(filterId.slice('region:'.length))
  } catch {
    return false
  }
  return getFamousDestinationRegion(destination).toLowerCase() === region.toLowerCase()
}

const INDIA_DESTINATION_CATEGORY_CLASSIFIERS = [
  { id: 'heritage', label: 'Heritage Destinations', matches: isHeritageDestination },
  { id: 'religious', label: 'Religious Destinations', matches: isReligiousDestination },
  { id: 'hill-station', label: 'Hill Stations', matches: isHillStationDestination },
  { id: 'beach', label: 'Beaches', matches: isBeachDestination },
  { id: 'wildlife', label: 'Wildlife Destinations', matches: isWildlifeDestination },
  { id: 'weekend-getaway', label: 'Weekend Getaways', matches: isWeekendGetawayDestination },
  { id: 'offbeat', label: 'Offbeat Destinations', matches: isOffbeatDestination },
  { id: 'famous', label: 'Famous Destinations', matches: isFamousDestination },
]

export function getSupportedIndiaDestinationCategories(destinations) {
  const records = Array.isArray(destinations) ? destinations : []

  return INDIA_DESTINATION_CATEGORY_CLASSIFIERS.flatMap(category => {
    const count = records.filter(category.matches).length
    return count > 0 ? [{ id: category.id, label: category.label, count }] : []
  })
}

export function matchesIndiaDestinationCategory(destination, categoryId) {
  if (categoryId === 'all') return true
  const category = INDIA_DESTINATION_CATEGORY_CLASSIFIERS.find(item => item.id === categoryId)
  return category ? category.matches(destination) : false
}

function searchableDestinationValue(value) {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return fieldText(value)
}

export function matchesIndiaDestinationSearch(destination, query) {
  const searchTerm = String(query || '').trim().toLowerCase()
  if (!searchTerm) return true
  if (!destination || typeof destination !== 'object') return false

  const searchableFields = [
    destination.name,
    destination.country,
    destination.state,
    destination.type,
    destination.tagline,
    destination.shortDescription,
    destination.description,
    destination.bestTime,
    destination.highlights,
    destination.experiences,
    destination.destinationHighlights,
    destination.attractions,
  ]

  return searchableFields
    .map(searchableDestinationValue)
    .join(' ')
    .toLowerCase()
    .includes(searchTerm)
}

export function matchesIndiaDestinationFilters(destination, { query = '', categoryId = 'all', state = 'all' } = {}) {
  const selectedState = String(state || 'all').trim().toLowerCase()
  const destinationState = String(destination?.state || '').trim().toLowerCase()

  return matchesIndiaDestinationSearch(destination, query)
    && matchesIndiaDestinationCategory(destination, categoryId)
    && (selectedState === 'all' || destinationState === selectedState)
}

export function getIndiaDestinationPaginationPages(totalPages, currentPage) {
  const pageCount = Math.max(0, Math.floor(Number(totalPages) || 0))
  const activePage = Math.min(pageCount, Math.max(1, Math.floor(Number(currentPage) || 1)))
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1)

  const pages = new Set([1, pageCount, activePage - 1, activePage, activePage + 1])
  const orderedPages = [...pages].filter(page => page > 0 && page <= pageCount).sort((a, b) => a - b)
  const result = []

  orderedPages.forEach((page, index) => {
    if (index > 0 && page - orderedPages[index - 1] > 1) result.push('ellipsis')
    result.push(page)
  })
  return result
}

export function getOffbeatDestinationRegion(destination) {
  for (const value of [destination?.state, destination?.region]) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function offbeatRegionFilterId(region) {
  return `region:${encodeURIComponent(String(region || '').trim().toLowerCase())}`
}

export function getSupportedOffbeatFilters(destinations) {
  const regions = [...new Set(
    (Array.isArray(destinations) ? destinations : [])
      .map(getOffbeatDestinationRegion)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b))

  return [
    OFFBEAT_FILTER_DEFAULT,
    ...regions.map(region => ({ id: offbeatRegionFilterId(region), label: region })),
  ]
}

export function matchesOffbeatFilter(destination, filterId) {
  if (filterId === OFFBEAT_FILTER_DEFAULT.id) return true
  if (!filterId.startsWith('region:')) return false

  const region = decodeURIComponent(filterId.slice('region:'.length))
  return getOffbeatDestinationRegion(destination).toLowerCase() === region.toLowerCase()
}

export function getOffbeatFeatureTags(destination, limit = 3) {
  if (!destination) return []

  const metadataValues = OFFBEAT_METADATA_FIELDS.flatMap(field => parseField(destination[field]))
  const metadataLabels = metadataValues
    .filter(value => typeof value !== 'object' || value.isActive !== false)
    .map(value => typeof value === 'string' ? value : valueText(value, OFFBEAT_NESTED_METADATA_KEYS))
  const tags = []

  for (const label of [...metadataLabels, ...getDestinationFeatureTags(destination, limit)]) {
    const cleanLabel = String(label || '').trim()
    if (!cleanLabel || /^(?:domestic|international|published|draft|active|inactive)$/i.test(cleanLabel) || tags.includes(cleanLabel)) continue
    tags.push(cleanLabel)
    if (tags.length >= limit) break
  }

  return tags
}

export function getHillStationRegion(destination) {
  const value = destination?.state || destination?.region || ''
  return typeof value === 'string' ? value.trim() : ''
}

function hillStationRegionFilterId(region) {
  return `region:${encodeURIComponent(String(region || '').trim().toLowerCase())}`
}

export function getSupportedHillStationFilters(destinations) {
  const regions = [...new Set(
    (Array.isArray(destinations) ? destinations : [])
      .map(getHillStationRegion)
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b))

  return [
    { id: 'all', label: 'All Hill Stations' },
    ...regions.map(region => ({ id: hillStationRegionFilterId(region), label: region })),
  ]
}

export function matchesHillStationFilter(destination, filterId) {
  if (filterId === 'all') return true
  const region = getHillStationRegion(destination)
  return region ? hillStationRegionFilterId(region) === filterId : false
}

export function getSupportedHeritageFilters(destinations) {
  const heritageDestinations = Array.isArray(destinations) ? destinations : []
  return [
    { id: 'all', label: 'All Heritage Destinations', pattern: null },
    ...HERITAGE_FILTERS.filter(filter =>
      heritageDestinations.some(destination => filter.pattern.test(destinationHeritageText(destination)))
    ),
  ]
}

export function matchesHeritageFilter(destination, filterId) {
  if (filterId === 'all') return true
  const filter = HERITAGE_FILTERS.find(item => item.id === filterId)
  return filter ? filter.pattern.test(destinationHeritageText(destination)) : false
}

export function getDestinationFeatureTags(destination, limit = 3) {
  if (!destination) return []
  const values = [
    ...parseField(destination.highlights),
    ...parseField(destination.destinationHighlights),
    ...parseField(destination.experiences),
  ]

  const tags = []
  for (const value of values) {
    if (value && typeof value === 'object' && value.isActive === false) continue

    const label = typeof value === 'string'
      ? value
      : value?.title || value?.label || value?.category || value?.name || ''
    const cleanLabel = String(label).trim()
    if (!cleanLabel || /^best time\b/i.test(cleanLabel) || tags.includes(cleanLabel)) continue
    tags.push(cleanLabel)
    if (tags.length >= limit) break
  }

  return tags
}

export function getReligiousFeatureTags(destination, limit = 3) {
  if (!destination) return []

  const metadataValues = RELIGIOUS_METADATA_FIELDS.flatMap(field => parseField(destination[field]))
  const cmsValues = RELIGIOUS_CMS_METADATA_FIELDS.flatMap(field => parseField(destination[field]))
  const labels = [...metadataValues, ...cmsValues]
    .filter(value => typeof value !== 'object' || value.isActive !== false)
    .map(value => typeof value === 'string' ? value : valueText(value, RELIGIOUS_NESTED_METADATA_KEYS))
  const tags = []

  for (const label of labels) {
    const cleanLabel = String(label || '').trim()
    if (!cleanLabel || /^best time\b/i.test(cleanLabel) || tags.includes(cleanLabel)) continue
    tags.push(cleanLabel)
    if (tags.length >= limit) break
  }

  return tags
}

export function getHillStationFeatureTags(destination, limit = 3) {
  if (!destination) return []

  const metadataValues = HILL_STATION_FEATURE_FIELDS.flatMap(field => parseField(destination[field]))
  const metadataLabels = metadataValues
    .filter(value => typeof value !== 'object' || value.isActive !== false)
    .map(value => typeof value === 'string' ? value : valueText(value, HILL_STATION_NESTED_METADATA_KEYS))
  const tags = []

  for (const label of [...metadataLabels, ...getDestinationFeatureTags(destination, limit)]) {
    const cleanLabel = String(label || '').trim()
    if (!cleanLabel || /^(?:domestic|international|published|draft|active|inactive)$/i.test(cleanLabel) || tags.includes(cleanLabel)) continue
    tags.push(cleanLabel)
    if (tags.length >= limit) break
  }

  return tags
}

export function countHeritageDestinations(destinations, filterId) {
  const filter = HERITAGE_FILTERS.find(item => item.id === filterId)
  if (!filter) return 0
  return (Array.isArray(destinations) ? destinations : [])
    .filter(destination => filter.pattern.test(destinationHeritageText(destination))).length
}

export function getHeritagePackageCount(packages) {
  if (!Array.isArray(packages)) return null
  const heritagePackageSignal = /\b(?:heritage|historic(?:al)?|unesco|forts?|palaces?|temples?|royal|cultural|culture)\b/i

  return packages.filter(pkg => {
    const country = String(pkg?.country || '').trim().toLowerCase()
    const category = String(pkg?.category || '').trim().toLowerCase()
    if (country !== INDIA_COUNTRY && category !== 'domestic') return false

    return heritagePackageSignal.test([
      pkg?.title,
      pkg?.description,
      pkg?.shortDescription,
      pkg?.tags,
    ].filter(Boolean).join(' '))
  }).length
}
