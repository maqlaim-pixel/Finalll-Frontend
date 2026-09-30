import test from 'node:test'
import assert from 'node:assert/strict'
import {
  countHeritageDestinations,
  getDestinationFeatureTags,
  getAllIndiaDestinations,
  isDestinationListResponse,
  getIndiaDestinationStates,
  getSupportedIndiaDestinationCategories,
  matchesIndiaDestinationCategory,
  matchesIndiaDestinationSearch,
  matchesIndiaDestinationFilters,
  getIndiaDestinationPaginationPages,
  getHeritagePackageCount,
  getHillStationFeatureTags,
  getIndiaBeachDestinations,
  getBeachDestinationRegion,
  getBeachFeatureTags,
  getSupportedBeachFilters,
  getIndiaHeritageDestinations,
  getIndiaHillStations,
  getIndiaReligiousDestinations,
  getIndiaWildlifeDestinations,
  getWildlifeFeatureTags,
  getWildlifeDestinationRegion,
  getSupportedWildlifeFilters,
  isWildlifeDestination,
  matchesWildlifeFilter,
  getIndiaWeekendGetaways,
  getWeekendGetawayDestinationRegion,
  getWeekendGetawayFeatureTags,
  getWeekendGetawayOriginCities,
  getSupportedWeekendGetawayFilters,
  isWeekendGetawayDestination,
  matchesWeekendGetawayFilter,
  getIndiaOffbeatDestinations,
  getIndiaFamousDestinations,
  getFamousDestinationRegion,
  getSupportedFamousFilters,
  matchesFamousFilter,
  isFamousDestination,
  getOffbeatDestinationRegion,
  getOffbeatFeatureTags,
  getSupportedOffbeatFilters,
  isOffbeatDestination,
  matchesOffbeatFilter,
  isBeachDestination,
  matchesBeachFilter,
  getSupportedHeritageFilters,
  getSupportedHillStationFilters,
  getSupportedReligiousFilters,
  isReligiousDestination,
  isHillStationDestination,
  matchesHeritageFilter,
  matchesHillStationFilter,
  matchesReligiousFilter,
} from './heritageDestinations.js'

const destinations = [
  {
    id: 1,
    name: 'Royal destination',
    slug: 'royal-destination',
    country: 'India',
    type: 'domestic',
    status: 'published',
    state: 'Rajasthan',
    category: 'Royal',
    tagline: 'A historic destination',
    experiences: '[{"category":"Heritage","title":"Palace tour","isActive":true}]',
    destinationHighlights: '[{"title":"UNESCO World Heritage Site","isActive":true}]',
  },
  {
    id: 2,
    name: 'Draft Fort',
    country: 'India',
    type: 'domestic',
    status: 'draft',
    experiences: '[{"category":"Heritage","isActive":true}]',
  },
  {
    id: 3,
    name: 'International temple',
    country: 'Nepal',
    type: 'international',
    status: 'published',
    attractions: '[{"title":"Ancient temple","isActive":true}]',
  },
  {
    id: 4,
    name: 'Beach destination',
    country: 'India',
    type: 'domestic',
    status: 'published',
    description: 'Heritage from the past, but no structured heritage classification.',
  },
  {
    id: 5,
    name: 'Inactive CMS fort',
    country: 'India',
    type: 'domestic',
    status: 'published',
    experiences: '[{"category":"Heritage","title":"Fort tour","isActive":false}]',
  },
]

const allIndiaDestinations = [
  { id: 90, name: 'Published state match', country: 'India', type: 'domestic', status: 'published', state: 'Rajasthan', category: 'Royal' },
  { id: 91, name: 'Published without a special category', country: 'India', type: 'domestic', status: 'published', state: 'Goa', category: 'Other' },
  { id: 92, name: 'Published country match', country: 'iNdIa', type: 'international', status: 'published', state: 'Kerala', category: 'Coastal' },
  { id: 93, name: 'Domestic with no country', country: '', type: 'domestic', status: 'published', state: 'No country state' },
  { id: 94, name: 'India without domestic type', country: 'India', type: 'international', status: 'published', state: 'Kerala' },
  { id: 95, name: 'Inactive destination', country: 'India', type: 'domestic', status: 'published', state: 'Delhi', isActive: false },
  { id: 96, name: 'String inactive destination', country: 'India', type: 'domestic', status: 'published', state: 'Punjab', published: 'false' },
  { id: 97, name: 'Draft destination', country: 'India', type: 'domestic', status: 'draft', state: 'Sikkim' },
  { id: 98, name: 'International destination', country: 'France', type: 'international', status: 'published', state: 'Paris' },
]

test('all India listing includes every category, respects country with domestic type as fallback, and excludes inactive or draft records', () => {
  assert.deepEqual(getAllIndiaDestinations(allIndiaDestinations).map(item => item.id), [93, 94, 92, 90, 91])
  assert.deepEqual(getAllIndiaDestinations(null), [])
})

test('destination API response validation rejects malformed records instead of displaying Coming Soon', () => {
  assert.equal(isDestinationListResponse([]), true)
  assert.equal(isDestinationListResponse([{ id: 1, name: 'Goa', slug: 'goa', status: 'published' }]), true)
  assert.equal(isDestinationListResponse([{ id: 1, name: 'Goa', slug: 'goa' }]), false)
  assert.equal(isDestinationListResponse([{ id: 1, name: 'Goa', slug: 'goa', status: 'published' }, null]), false)
  assert.equal(isDestinationListResponse({ error: 'server failure' }), false)
})

test('all India state filters are generated only from matching real records', () => {
  assert.deepEqual(getIndiaDestinationStates(getAllIndiaDestinations(allIndiaDestinations)), ['Goa', 'Kerala', 'No country state', 'Rajasthan'])
})

test('all India optional category filters reuse destination taxonomy and All includes every record', () => {
  const listed = getAllIndiaDestinations([
    ...allIndiaDestinations,
    { id: 99, name: 'Beach with structured metadata', country: 'India', type: 'domestic', status: 'published', category: 'Beach' },
    { id: 100, name: 'Famous from the admin flag', country: 'India', type: 'domestic', status: 'published', isFamous: true },
  ])
  const categories = getSupportedIndiaDestinationCategories(listed)
  assert.ok(categories.some(category => category.id === 'beach' && category.count === 2))
  assert.ok(categories.some(category => category.id === 'famous' && category.count === 1))
  assert.deepEqual(listed.filter(item => matchesIndiaDestinationCategory(item, 'all')).map(item => item.id), [99, 93, 100, 94, 92, 90, 91])
  assert.deepEqual(listed.filter(item => matchesIndiaDestinationCategory(item, 'beach')).map(item => item.id), [99, 92])
  assert.equal(matchesIndiaDestinationCategory(listed[0], 'unsupported'), false)
  assert.deepEqual(getSupportedIndiaDestinationCategories([]), [])
})

test('all India search matches real case-insensitive destination and backend metadata fields', () => {
  const goa = allIndiaDestinations[1]
  assert.equal(matchesIndiaDestinationSearch(goa, 'GOA'), true)
  assert.equal(matchesIndiaDestinationSearch({ state: 'Himachal Pradesh' }, 'himachal'), true)
  assert.equal(matchesIndiaDestinationSearch({ experiences: '[{"category":"Wildlife","title":"Safari"}]' }, 'safari'), true)
  assert.equal(matchesIndiaDestinationSearch(goa, 'not present'), false)
  assert.equal(matchesIndiaDestinationSearch(null, 'anything'), false)
})

test('all India card highlights come only from active API metadata and omit non-highlight fields', () => {
  assert.deepEqual(getDestinationFeatureTags({
    highlights: 'Best Time: October to March, Sunset views',
    destinationHighlights: '[{"title":"UNESCO Site","isActive":true},{"title":"Hidden","isActive":false}]',
    experiences: '[{"title":"Heritage walk","isActive":true}]',
  }), ['Sunset views', 'UNESCO Site', 'Heritage walk'])
  assert.deepEqual(getDestinationFeatureTags({ id: 20 }), [])
})

test('all India search, category and state selections combine with AND semantics', () => {
  const record = { name: 'Coast Escape', country: 'India', state: 'Goa', category: 'Beach', type: 'domestic', status: 'published' }
  assert.equal(matchesIndiaDestinationFilters(record, { query: 'coast', categoryId: 'beach', state: 'Goa' }), true)
  assert.equal(matchesIndiaDestinationFilters(record, { query: 'coast', categoryId: 'heritage', state: 'Goa' }), false)
  assert.equal(matchesIndiaDestinationFilters(record, { query: 'coast', categoryId: 'beach', state: 'Kerala' }), false)
})

test('all India pagination page numbers are derived from result count and remain bounded', () => {
  assert.deepEqual(getIndiaDestinationPaginationPages(0, 1), [])
  assert.deepEqual(getIndiaDestinationPaginationPages(5, 4), [1, 2, 3, 4, 5])
  assert.deepEqual(getIndiaDestinationPaginationPages(12, 6), [1, 'ellipsis', 5, 6, 7, 'ellipsis', 12])
  assert.deepEqual(getIndiaDestinationPaginationPages(12, 99), [1, 'ellipsis', 11, 12])
})

test('heritage listing includes only published India destinations with explicit metadata', () => {
  assert.deepEqual(getIndiaHeritageDestinations(destinations).map(item => item.id), [1])
})

test('heritage filter options are shown only when actual destination metadata supports them', () => {
  const filters = getSupportedHeritageFilters(getIndiaHeritageDestinations(destinations))
  assert.deepEqual(filters.map(item => item.id), ['all', 'forts-palaces', 'unesco', 'royal'])
})

test('a selected metadata filter returns only matching destinations and real count', () => {
  const listed = getIndiaHeritageDestinations(destinations)
  assert.equal(matchesHeritageFilter(listed[0], 'unesco'), true)
  assert.equal(matchesHeritageFilter(listed[0], 'temples'), false)
  assert.equal(countHeritageDestinations(listed, 'unesco'), 1)
})

test('destination cards derive optional feature tags from active backend metadata', () => {
  const listed = getIndiaHeritageDestinations(destinations)
  assert.deepEqual(getDestinationFeatureTags(listed[0]), ['UNESCO World Heritage Site', 'Palace tour'])
  assert.deepEqual(getDestinationFeatureTags({ id: 20 }), [])
})

test('heritage package count uses actual India package metadata', () => {
  assert.equal(getHeritagePackageCount([
    { country: 'India', category: 'domestic', title: 'Royal heritage circuit' },
    { country: 'India', category: 'domestic', title: 'Beach break' },
    { country: 'France', category: 'international', title: 'Palace heritage' },
  ]), 1)
  assert.equal(getHeritagePackageCount(null), null)
})

const religiousDestinations = [
  {
    id: 10,
    name: 'Sacred mountain circuit',
    slug: 'sacred-mountain-circuit',
    country: 'India',
    type: 'domestic',
    status: 'published',
    category: 'Pilgrimage',
    tags: '["Char Dham", "Hindu Temple"]',
  },
  {
    id: 11,
    name: 'Sikh spiritual centre',
    country: 'India',
    type: 'domestic',
    status: 'published',
    experiences: '[{"title":"Gurudwara visit","category":"Sikh","isActive":true}]',
  },
  {
    id: 12,
    name: 'Jain shrine region',
    country: 'India',
    type: 'domestic',
    status: 'published',
    religiousCategory: 'Jain Temple',
  },
  {
    id: 13,
    name: 'Varanasi',
    country: 'India',
    type: 'domestic',
    status: 'published',
    description: 'A destination whose name and description must not imply a classification.',
  },
  {
    id: 14,
    name: 'Inactive shrine metadata',
    country: 'India',
    type: 'domestic',
    status: 'published',
    attractions: '[{"title":"Ancient temple","isActive":false}]',
  },
  {
    id: 15,
    name: 'Published overseas temple',
    country: 'Nepal',
    type: 'international',
    status: 'published',
    category: 'Religious Temple',
  },
  {
    id: 16,
    name: 'Draft pilgrimage',
    country: 'India',
    type: 'domestic',
    status: 'draft',
    category: 'Pilgrimage',
  },
]

test('religious listing includes only published India destinations with explicit religious metadata', () => {
  assert.deepEqual(getIndiaReligiousDestinations(religiousDestinations).map(item => item.id), [12, 10, 11])
  assert.equal(isReligiousDestination(religiousDestinations[3]), false)
  assert.equal(isReligiousDestination(religiousDestinations[4]), false)
})

test('religious filters are limited to classifications present in the loaded destinations', () => {
  const listed = getIndiaReligiousDestinations(religiousDestinations)
  assert.deepEqual(getSupportedReligiousFilters(listed).map(item => item.id), [
    'all', 'pilgrimage', 'temples-shrines', 'char-dham', 'jain-sites', 'sikh-gurudwaras',
  ])
  assert.deepEqual(getSupportedReligiousFilters([]).map(item => item.id), ['all'])
})

test('religious filter selection matches backend metadata and leaves all results available', () => {
  const listed = getIndiaReligiousDestinations(religiousDestinations)
  assert.deepEqual(listed.filter(item => matchesReligiousFilter(item, 'all')).map(item => item.id), [12, 10, 11])
  assert.deepEqual(listed.filter(item => matchesReligiousFilter(item, 'char-dham')).map(item => item.id), [10])
  assert.deepEqual(listed.filter(item => matchesReligiousFilter(item, 'sikh-gurudwaras')).map(item => item.id), [11])
  assert.deepEqual(listed.filter(item => matchesReligiousFilter(item, 'jain-sites')).map(item => item.id), [12])
  assert.equal(matchesReligiousFilter(listed[0], 'not-a-filter'), false)
})

test('a successful result with no religious metadata is an empty listing, not fabricated destinations', () => {
  assert.deepEqual(getIndiaReligiousDestinations([
    { id: 20, name: 'Kedarnath', country: 'India', type: 'domestic', status: 'published' },
    { id: 21, name: 'Goa', country: 'India', type: 'domestic', status: 'published', tags: 'beaches' },
  ]), [])
})

const hillStationDestinations = [
  {
    id: 30,
    name: 'Alpine escape',
    slug: 'alpine-escape',
    country: 'India',
    state: 'Himachal Pradesh',
    type: 'domestic',
    status: 'published',
    category: 'HILL_STATION',
    highlights: '["Mountain Views", "Forest Trails"]',
  },
  {
    id: 31,
    name: 'Highland retreat',
    country: 'India',
    state: 'Uttarakhand',
    type: 'domestic',
    status: 'published',
    theme: 'mountain',
    experiences: '[{"category":"Trekking","isActive":true}]',
  },
  {
    id: 32,
    name: 'Hillside resort',
    country: 'India',
    state: 'Kerala',
    type: 'domestic',
    status: 'published',
    attractions: '[{"category":"Hill Station","title":"Mountain viewpoint","isActive":true}]',
  },
  {
    id: 33,
    name: 'Shimla',
    country: 'India',
    type: 'domestic',
    status: 'published',
    description: 'Hill station example in a description is not a classification.',
  },
  {
    id: 34,
    name: 'Inactive mountains',
    country: 'India',
    type: 'domestic',
    status: 'published',
    isActive: false,
    category: 'Hill Station',
  },
  {
    id: 35,
    name: 'Draft hill station',
    country: 'India',
    type: 'domestic',
    status: 'draft',
    category: 'Hill Station',
  },
  {
    id: 36,
    name: 'Overseas mountain resort',
    country: 'Nepal',
    type: 'international',
    status: 'published',
    theme: 'mountain',
  },
]

test('hill-station listing requires explicit metadata and published active India data', () => {
  assert.deepEqual(getIndiaHillStations(hillStationDestinations).map(item => item.id), [30, 31, 32])
  assert.equal(isHillStationDestination(hillStationDestinations[3]), false)
  assert.equal(isHillStationDestination(hillStationDestinations[4]), true)
})

test('hill-station filters are generated from actual states and include all destinations', () => {
  const listed = getIndiaHillStations(hillStationDestinations)
  const filters = getSupportedHillStationFilters(listed)
  assert.deepEqual(filters.map(filter => filter.label), [
    'All Hill Stations', 'Himachal Pradesh', 'Kerala', 'Uttarakhand',
  ])
  assert.deepEqual(listed.filter(item => matchesHillStationFilter(item, 'all')).map(item => item.id), [30, 31, 32])
  assert.deepEqual(listed.filter(item => matchesHillStationFilter(item, 'region:uttarakhand')).map(item => item.id), [31])
  assert.deepEqual(getSupportedHillStationFilters([]), [{ id: 'all', label: 'All Hill Stations' }])
})

test('hill-station feature labels come from real active classification and CMS metadata', () => {
  const listed = getIndiaHillStations(hillStationDestinations)
  assert.deepEqual(getHillStationFeatureTags(listed[0]), ['HILL_STATION', 'Mountain Views', 'Forest Trails'])
  assert.deepEqual(getHillStationFeatureTags(listed[1]), ['mountain', 'Trekking'])
  assert.deepEqual(getHillStationFeatureTags({ id: 40, type: 'domestic', status: 'published' }), [])
})

test('a successful API result with no explicit India hill-station metadata is empty', () => {
  assert.deepEqual(getIndiaHillStations([
    { id: 41, name: 'Manali', country: 'India', type: 'domestic', status: 'published' },
    { id: 42, name: 'Coastal city', country: 'India', type: 'domestic', status: 'published', description: 'Near hills' },
  ]), [])
})

const beachDestinations = [
  {
    id: 50,
    name: 'Coastal destination',
    slug: 'coastal-destination',
    country: 'India',
    type: 'domestic',
    status: 'published',
    state: 'Goa',
    category: 'BEACH',
    tags: '["Family", "Water sports"]',
    image: 'https://images.example.test/coast.jpg',
  },
  {
    id: 51,
    name: 'Island escape',
    country: 'India',
    type: 'domestic',
    status: 'published',
    state: 'Andaman and Nicobar Islands',
    destinationType: 'coastal_destination',
    experiences: '[{"category":"Beach","title":"Snorkelling","isActive":true}]',
  },
  {
    id: 52,
    name: 'CMS-classified shore',
    country: 'India',
    type: 'domestic',
    status: 'published',
    state: 'Kerala',
    experiences: '[{"category":"Beach","title":"Coastline trip","isActive":true}]',
    destinationHighlights: '[{"title":"Beach destinations","description":"Calm coastal escapes","isActive":true}]',
  },
  {
    id: 53,
    name: 'Name-only Goa',
    country: 'India',
    type: 'domestic',
    status: 'published',
    name: 'Goa',
    state: 'Goa',
    tagline: 'Beach Paradise',
    description: 'A coastal destination with beautiful beaches.',
    attractions: '[{"title":"Mandvi Beach","isActive":true}]',
    experiences: '[{"category":"Culture","title":"Beach Festival","isActive":true}]',
  },
  {
    id: 54,
    name: 'Inactive beach',
    country: 'India',
    type: 'domestic',
    status: 'published',
    isActive: false,
    category: 'Beach',
  },
  {
    id: 55,
    name: 'Draft beach',
    country: 'India',
    type: 'domestic',
    status: 'draft',
    category: 'Beach',
  },
  {
    id: 56,
    name: 'Overseas coast',
    country: 'Sri Lanka',
    type: 'international',
    status: 'published',
    category: 'Coastal',
  },
  {
    id: 57,
    name: 'Inactive CMS beach',
    country: 'India',
    type: 'domestic',
    status: 'published',
    experiences: '[{"category":"Beach","title":"Beach excursion","isActive":false}]',
  },
]

test('beach listing accepts only published active India destinations with explicit structured metadata', () => {
  assert.deepEqual(getIndiaBeachDestinations(beachDestinations).map(item => item.id), [52, 50, 51])
  assert.equal(isBeachDestination(beachDestinations[3]), false)
  assert.equal(isBeachDestination(beachDestinations[7]), false)
})

test('beach classification supports canonical category, coastal type, and active CMS category/type metadata', () => {
  assert.equal(isBeachDestination({ category: 'BEACHES' }), true)
  assert.equal(isBeachDestination({ theme: 'coastal' }), true)
  assert.equal(isBeachDestination({ experiences: [{ category: 'Beach', isActive: true }] }), true)
  assert.equal(isBeachDestination({ experiences: [{ type: 'seaside', isActive: true }] }), true)
  assert.equal(isBeachDestination({ attractions: [{ category: 'Beach', isActive: true }] }), false)
  assert.equal(isBeachDestination({ destinationHighlights: [{ title: 'Beach', isActive: true }] }), false)
  assert.equal(isBeachDestination({ tags: ['island'] }), false)
})

test('beach card feature tags come from real active destination metadata', () => {
  assert.deepEqual(getBeachFeatureTags(beachDestinations[0]), ['BEACH', 'Family', 'Water sports'])
  assert.deepEqual(getBeachFeatureTags(beachDestinations[1]), ['coastal_destination', 'Snorkelling'])
  assert.deepEqual(getBeachFeatureTags({ id: 70 }), [])
})

test('beach filters are generated only from the real matched destination regions', () => {
  const listed = getIndiaBeachDestinations(beachDestinations)
  const filters = getSupportedBeachFilters(listed)
  assert.deepEqual(filters.map(filter => filter.label), [
    'All Beach Destinations', 'Andaman and Nicobar Islands', 'Goa', 'Kerala',
  ])
  assert.deepEqual(listed.filter(item => matchesBeachFilter(item, 'all')).map(item => item.id), [52, 50, 51])
  assert.deepEqual(listed.filter(item => matchesBeachFilter(item, 'region:goa')).map(item => item.id), [50])
  assert.equal(getBeachDestinationRegion(listed[0]), 'Kerala')
  assert.deepEqual(getSupportedBeachFilters([]), [{ id: 'all', label: 'All Beach Destinations' }])
})

test('a successful published India response with no beach classifications remains an empty list', () => {
  assert.deepEqual(getIndiaBeachDestinations([
    { id: 60, name: 'Goa', country: 'India', type: 'domestic', status: 'published' },
    { id: 61, name: 'Coastal description only', country: 'India', type: 'domestic', status: 'published', description: 'A beach escape' },
    { id: 62, name: 'Inactive', country: 'India', type: 'domestic', status: 'published', active: 'false', category: 'Beach' },
  ]), [])
})

const wildlifeDestinations = [
  {
    id: 70,
    name: 'Canopy Reserve',
    slug: 'canopy-reserve',
    country: 'India',
    type: 'domestic',
    status: 'published',
    state: 'Central India',
    category: 'WILDLIFE',
    tags: '["Tiger Reserve", "Forest Trails"]',
    highlights: '["Wildlife safari"]',
  },
  {
    id: 71,
    name: 'Riverland',
    country: 'India',
    type: 'domestic',
    status: 'published',
    destinationType: 'national_park',
    experiences: '[{"category":"Wildlife Safari","title":"Guided trip","isActive":true}]',
  },
  {
    id: 72,
    name: 'Wetland habitat',
    country: 'India',
    type: 'domestic',
    status: 'published',
    tags: '["Bird Sanctuary"]',
  },
  {
    id: 73,
    name: 'Forest-only prose',
    country: 'India',
    type: 'domestic',
    status: 'published',
    state: 'Wildlife State',
    description: 'A national park with a tiger safari and rich wildlife.',
    highlights: '["Wildlife safari"]',
    experiences: '[{"title":"National Park safari","isActive":true}]',
    attractions: '[{"title":"Wildlife Sanctuary","isActive":true}]',
    destinationHighlights: '[{"title":"Tiger Reserve","isActive":true}]',
  },
  {
    id: 74,
    name: 'Inactive experience',
    country: 'India',
    type: 'domestic',
    status: 'published',
    experiences: '[{"category":"Wildlife Safari","isActive":false}]',
  },
  {
    id: 75,
    name: 'Inactive destination',
    country: 'India',
    type: 'domestic',
    status: 'published',
    active: 'false',
    category: 'Wildlife',
  },
  {
    id: 76,
    name: 'Unpublished habitat',
    country: 'India',
    type: 'domestic',
    status: 'draft',
    category: 'Wildlife',
  },
  {
    id: 77,
    name: 'Overseas habitat',
    country: 'Nepal',
    type: 'international',
    status: 'published',
    category: 'Wildlife',
  },
]

test('wildlife classification uses structured taxonomy and excludes names, prose, highlights, attractions and CMS titles', () => {
  assert.equal(isWildlifeDestination({ category: 'WILDLIFE' }), true)
  assert.equal(isWildlifeDestination({ destinationType: 'national_park' }), true)
  assert.equal(isWildlifeDestination({ tags: ['Tiger Reserve'] }), true)
  assert.equal(isWildlifeDestination({ experiences: [{ category: 'Wildlife Safari', isActive: true }] }), true)
  assert.equal(isWildlifeDestination({ name: 'Wildlife Park', description: 'National Park' }), false)
  assert.equal(isWildlifeDestination({ state: 'Wildlife State', highlights: 'Wildlife Safari' }), false)
  assert.equal(isWildlifeDestination({ experiences: [{ title: 'National Park safari', isActive: true }] }), false)
  assert.equal(isWildlifeDestination({ attractions: [{ category: 'Wildlife', isActive: true }] }), false)
  assert.equal(isWildlifeDestination({ destinationHighlights: [{ title: 'Tiger Reserve', isActive: true }] }), false)
  assert.equal(isWildlifeDestination({ experiences: [{ category: 'Wildlife Safari', isActive: false }] }), false)
})

test('wildlife listing includes only active, published India destinations with classification metadata', () => {
  assert.deepEqual(getIndiaWildlifeDestinations(wildlifeDestinations).map(item => item.id), [70, 71, 72])
})

test('wildlife filters are supported only by actual matching metadata and filter the loaded results', () => {
  const listed = getIndiaWildlifeDestinations(wildlifeDestinations)
  const filters = getSupportedWildlifeFilters(listed)
  assert.deepEqual(filters.map(filter => filter.id), [
    'all', 'national-parks', 'tiger-reserves', 'bird-sanctuaries', 'forest-experiences', 'safari-destinations',
  ])
  assert.deepEqual(listed.filter(item => matchesWildlifeFilter(item, 'all')).map(item => item.id), [70, 71, 72])
  assert.deepEqual(listed.filter(item => matchesWildlifeFilter(item, 'national-parks')).map(item => item.id), [71])
  assert.deepEqual(listed.filter(item => matchesWildlifeFilter(item, 'tiger-reserves')).map(item => item.id), [70])
  assert.deepEqual(listed.filter(item => matchesWildlifeFilter(item, 'safari-destinations')).map(item => item.id), [71])
  assert.equal(matchesWildlifeFilter(listed[0], 'unsupported-filter'), false)
  assert.deepEqual(getSupportedWildlifeFilters([]), [{ id: 'all', label: 'All Wildlife Destinations' }])
})

test('wildlife card metadata omits missing fields and uses the actual state and active feature tags', () => {
  const listed = getIndiaWildlifeDestinations(wildlifeDestinations)
  assert.equal(getWildlifeDestinationRegion(listed[0]), 'Central India')
  assert.equal(getWildlifeDestinationRegion({ region: 'Eastern India' }), 'Eastern India')
  assert.deepEqual(getWildlifeFeatureTags(listed[0]), ['WILDLIFE', 'Tiger Reserve', 'Forest Trails'])
  assert.deepEqual(getWildlifeFeatureTags({ id: 78 }), [])
})

test('a successful India response with no wildlife classification remains empty', () => {
  assert.deepEqual(getIndiaWildlifeDestinations([
    { id: 80, name: 'National Park name only', country: 'India', type: 'domestic', status: 'published' },
    { id: 81, name: 'Wildlife prose only', country: 'India', type: 'domestic', status: 'published', description: 'Wildlife' },
  ]), [])
})

const weekendGetawayDestinations = [
  {
    id: 90,
    name: 'Lake Retreat',
    country: 'India',
    type: 'domestic',
    status: 'published',
    state: 'Maharashtra',
    category: 'WEEKEND_GETAWAY',
    weekendFrom: '["Mumbai", "Pune"]',
    tags: '["Scenic Lakes", "Nature"]',
    image: 'https://images.example.test/lake.jpg',
  },
  {
    id: 91,
    name: 'Hill Escape',
    country: 'India',
    type: 'domestic',
    status: 'published',
    region: 'Uttarakhand',
    theme: 'short_escape',
    originCity: '{"city":"Delhi"}',
    experiences: '[{"category":"Weekend Getaway","title":"Guided escape","isActive":true}]',
  },
  {
    id: 92,
    name: 'Weekend name only',
    country: 'India',
    type: 'domestic',
    status: 'published',
    name: 'Weekend Getaway Valley',
    description: 'A weekend trip destination.',
    highlights: '["Weekend getaway"]',
    experiences: '[{"title":"Weekend getaway","isActive":true}]',
    attractions: '[{"category":"Weekend Getaway","isActive":true}]',
    destinationHighlights: '[{"title":"Weekend Getaway","isActive":true}]',
  },
  {
    id: 93,
    name: 'Inactive getaway',
    country: 'India',
    type: 'domestic',
    status: 'published',
    isActive: false,
    category: 'Weekend Getaway',
  },
  {
    id: 94,
    name: 'Draft getaway',
    country: 'India',
    type: 'domestic',
    status: 'draft',
    category: 'Weekend Getaway',
  },
  {
    id: 95,
    name: 'Overseas getaway',
    country: 'Nepal',
    type: 'international',
    status: 'published',
    category: 'Weekend Getaway',
  },
]

test('weekend getaway classification uses only structured destination or active experience metadata', () => {
  assert.equal(isWeekendGetawayDestination({ category: 'WEEKEND_GETAWAY' }), true)
  assert.equal(isWeekendGetawayDestination({ theme: 'short_escape' }), true)
  assert.equal(isWeekendGetawayDestination({ tags: ['Weekend Trip'] }), true)
  assert.equal(isWeekendGetawayDestination({ tags: ['Weekend Getaway'] }), true)
  assert.equal(isWeekendGetawayDestination({ experiences: [{ category: 'Weekend Getaway', isActive: true }] }), true)
  assert.equal(isWeekendGetawayDestination({ experiences: [{ category: 'Weekend Getaway', isActive: false }] }), false)
  assert.equal(isWeekendGetawayDestination({ name: 'Weekend Getaway', description: 'Weekend escape' }), false)
  assert.equal(isWeekendGetawayDestination({ highlights: ['Weekend Getaway'] }), false)
  assert.equal(isWeekendGetawayDestination({ experiences: [{ title: 'Weekend Getaway', isActive: true }] }), false)
  assert.equal(isWeekendGetawayDestination({ attractions: [{ category: 'Weekend Getaway' }] }), false)
  assert.equal(isWeekendGetawayDestination({ destinationHighlights: [{ title: 'Weekend Getaway' }] }), false)
})

test('weekend getaway listing requires a published, active India destination with classification metadata', () => {
  assert.deepEqual(getIndiaWeekendGetaways(weekendGetawayDestinations).map(item => item.id), [91, 90])
})

test('weekend origin filters are generated only from actual origin fields and accurately filter matches', () => {
  const listed = getIndiaWeekendGetaways(weekendGetawayDestinations)
  assert.deepEqual(getWeekendGetawayOriginCities(listed[0]), ['Delhi'])
  assert.deepEqual(getWeekendGetawayOriginCities(listed[1]), ['Mumbai', 'Pune'])
  assert.deepEqual(getSupportedWeekendGetawayFilters(listed).map(filter => filter.label), [
    'All Weekend Getaways', 'From Delhi', 'From Mumbai', 'From Pune',
  ])
  assert.deepEqual(listed.filter(item => matchesWeekendGetawayFilter(item, 'all')).map(item => item.id), [91, 90])
  assert.deepEqual(listed.filter(item => matchesWeekendGetawayFilter(item, 'from:mumbai')).map(item => item.id), [90])
  assert.deepEqual(listed.filter(item => matchesWeekendGetawayFilter(item, 'from:delhi')).map(item => item.id), [91])
  assert.equal(matchesWeekendGetawayFilter(listed[0], 'from:kolkata'), false)
})

test('weekend filters fall back to real regions when no origin-city relationship is available', () => {
  const listed = getIndiaWeekendGetaways(weekendGetawayDestinations.map(({ weekendFrom, originCity, ...destination }) => destination))
  assert.deepEqual(getSupportedWeekendGetawayFilters(listed).map(filter => filter.label), [
    'All Weekend Getaways', 'Maharashtra', 'Uttarakhand',
  ])
  assert.deepEqual(listed.filter(item => matchesWeekendGetawayFilter(item, 'region:uttarakhand')).map(item => item.id), [91])
  assert.deepEqual(getSupportedWeekendGetawayFilters([]), [{ id: 'all', label: 'All Weekend Getaways' }])
})

test('weekend getaway cards use actual state and active feature data while omitting missing optionals', () => {
  const listed = getIndiaWeekendGetaways(weekendGetawayDestinations)
  const lakeRetreat = listed.find(destination => destination.id === 90)
  assert.equal(getWeekendGetawayDestinationRegion(lakeRetreat), 'Maharashtra')
  assert.equal(getWeekendGetawayDestinationRegion({ region: 'Eastern India' }), 'Eastern India')
  assert.deepEqual(getWeekendGetawayFeatureTags(lakeRetreat), ['WEEKEND_GETAWAY', 'Scenic Lakes', 'Nature'])
  assert.deepEqual(getWeekendGetawayFeatureTags({ id: 98 }), [])
})

test('a successful India response without structured weekend classification remains empty', () => {
  assert.deepEqual(getIndiaWeekendGetaways([
    { id: 99, name: 'Lakeside escape', country: 'India', type: 'domestic', status: 'published', description: 'A short weekend getaway.' },
    { id: 100, name: 'Popular destination', country: 'India', type: 'domestic', status: 'published' },
  ]), [])
})

const offbeatDestinations = [
  {
    id: 110,
    name: 'Quiet Valley',
    country: 'India',
    type: 'domestic',
    status: 'published',
    state: 'Sikkim',
    category: 'OFFBEAT',
    tags: '["Hidden Gem", "Remote Village"]',
  },
  {
    id: 111,
    name: 'Uncharted Coast',
    country: 'India',
    type: 'domestic',
    status: 'published',
    state: 'Karnataka',
    theme: 'unexplored_places',
    experiences: '[{"category":"Local Culture","title":"Village walk","isActive":true}]',
  },
  {
    id: 112,
    name: 'Offbeat name only',
    country: 'India',
    type: 'domestic',
    status: 'published',
    name: 'Offbeat Valley',
    description: 'A hidden gem and an unexplored escape.',
    highlights: '["Hidden Gem"]',
    experiences: '[{"title":"Offbeat experience","isActive":true}]',
    attractions: '[{"category":"Offbeat","isActive":true}]',
    destinationHighlights: '[{"title":"Offbeat","isActive":true}]',
  },
  {
    id: 113,
    name: 'Inactive offbeat record',
    country: 'India',
    type: 'domestic',
    status: 'published',
    isActive: false,
    category: 'Offbeat',
  },
  {
    id: 114,
    name: 'Draft hidden gem',
    country: 'India',
    type: 'domestic',
    status: 'draft',
    category: 'Hidden Gem',
  },
  {
    id: 115,
    name: 'International unexplored coast',
    country: 'Nepal',
    type: 'international',
    status: 'published',
    category: 'Unexplored',
  },
]

test('offbeat classification reads structured taxonomy and excludes names, prose, highlights, attractions and CMS titles', () => {
  assert.equal(isOffbeatDestination({ category: 'OFFBEAT' }), true)
  assert.equal(isOffbeatDestination({ tags: ['Hidden Gem'] }), true)
  assert.equal(isOffbeatDestination({ theme: 'unexplored_places' }), true)
  assert.equal(isOffbeatDestination({ type: 'offbeat' }), true)
  assert.equal(isOffbeatDestination({ experiences: [{ category: 'Offbeat', isActive: true }] }), true)
  assert.equal(isOffbeatDestination({ experiences: [{ category: 'Offbeat', isActive: false }] }), false)
  assert.equal(isOffbeatDestination({ name: 'Offbeat destination', description: 'A hidden gem' }), false)
  assert.equal(isOffbeatDestination({ highlights: ['Unexplored'] }), false)
  assert.equal(isOffbeatDestination({ experiences: [{ title: 'Offbeat experience', isActive: true }] }), false)
  assert.equal(isOffbeatDestination({ attractions: [{ category: 'Offbeat', isActive: true }] }), false)
  assert.equal(isOffbeatDestination({ destinationHighlights: [{ title: 'Offbeat', isActive: true }] }), false)
})

test('offbeat listing includes only active, published India destinations with structured metadata', () => {
  assert.deepEqual(getIndiaOffbeatDestinations(offbeatDestinations).map(item => item.id), [110, 111])
})

test('offbeat filters use only regions present on matching destinations', () => {
  const listed = getIndiaOffbeatDestinations(offbeatDestinations)
  const filters = getSupportedOffbeatFilters(listed)
  assert.deepEqual(filters.map(filter => filter.label), ['All Offbeat Destinations', 'Karnataka', 'Sikkim'])
  assert.deepEqual(listed.filter(item => matchesOffbeatFilter(item, 'all')).map(item => item.id), [110, 111])
  assert.deepEqual(listed.filter(item => matchesOffbeatFilter(item, 'region:sikkim')).map(item => item.id), [110])
  assert.equal(matchesOffbeatFilter(listed[0], 'unsupported-filter'), false)
  assert.deepEqual(getSupportedOffbeatFilters([]), [{ id: 'all', label: 'All Offbeat Destinations' }])
})

test('offbeat cards use real state and metadata labels and omit empty optional fields', () => {
  const listed = getIndiaOffbeatDestinations(offbeatDestinations)
  assert.equal(getOffbeatDestinationRegion(listed[0]), 'Sikkim')
  assert.equal(getOffbeatDestinationRegion({ region: 'North East' }), 'North East')
  assert.deepEqual(getOffbeatFeatureTags(listed[0]), ['OFFBEAT', 'Hidden Gem', 'Remote Village'])
  assert.deepEqual(getOffbeatFeatureTags({ id: 118 }), [])
})

test('a successful published India response without structured offbeat classification remains empty', () => {
  assert.deepEqual(getIndiaOffbeatDestinations([
    { id: 119, name: 'Name-only remote place', country: 'India', type: 'domestic', status: 'published' },
    { id: 120, name: 'Quiet escape', country: 'India', type: 'domestic', status: 'published', description: 'An offbeat hidden gem.' },
  ]), [])
})

const famousDestinations = [
  { id: 130, name: 'Classified destination', slug: 'classified-destination', country: 'India', state: 'Rajasthan', type: 'domestic', status: 'published', isFamous: true },
  { id: 131, name: 'Featured only', country: 'India', state: 'Goa', type: 'domestic', status: 'published', featured: true },
  { id: 132, name: 'Name-only classification', country: 'India', state: 'Uttar Pradesh', type: 'domestic', status: 'published', name: 'Famous destination', isFamous: false },
  { id: 133, name: 'Inactive classified destination', country: 'India', type: 'domestic', status: 'published', isFamous: true, isActive: false },
  { id: 134, name: 'Draft classified destination', country: 'India', type: 'domestic', status: 'draft', isFamous: true },
  { id: 135, name: 'International classified destination', country: 'Japan', type: 'international', status: 'published', isFamous: true },
]

test('famous listing requires the explicit isFamous flag and published, active India data', () => {
  assert.equal(isFamousDestination({ isFamous: true }), true)
  assert.equal(isFamousDestination({ isFamous: false, featured: true }), false)
  assert.equal(isFamousDestination({ name: 'Famous destination' }), false)
  assert.equal(isFamousDestination({ isFamous: 'true' }), false)
  assert.deepEqual(getIndiaFamousDestinations(famousDestinations).map(item => item.id), [130])
})

test('famous filters are generated from real state data on matched destinations only', () => {
  const listed = getIndiaFamousDestinations(famousDestinations)
  const filters = getSupportedFamousFilters(listed)
  assert.deepEqual(filters.map(filter => filter.label), ['All Famous Destinations', 'Rajasthan'])
  assert.deepEqual(listed.filter(item => matchesFamousFilter(item, 'all')).map(item => item.id), [130])
  assert.deepEqual(listed.filter(item => matchesFamousFilter(item, 'region:rajasthan')).map(item => item.id), [130])
  assert.equal(matchesFamousFilter(listed[0], 'unsupported-filter'), false)
  assert.deepEqual(getSupportedFamousFilters([]), [{ id: 'all', label: 'All Famous Destinations' }])
  assert.equal(getFamousDestinationRegion(listed[0]), 'Rajasthan')
})

test('a successful response with no explicitly famous India destinations stays empty', () => {
  assert.deepEqual(getIndiaFamousDestinations([
    { id: 136, name: 'Unclassified destination', country: 'India', type: 'domestic', status: 'published', featured: true },
    { id: 137, name: 'Name-only famous destination', country: 'India', type: 'domestic', status: 'published', name: 'Famous City' },
  ]), [])
})
