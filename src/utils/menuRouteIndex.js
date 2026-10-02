import { MAIN_NAV, SECONDARY_NAV, MEGA_MENU_MAP } from '../data/megaMenuData.js'
import { getCityData } from '../data/cityData.js'

const normalizePath = value => {
  if (typeof value !== 'string' || !value.startsWith('/')) return null
  const pathname = value.split(/[?#]/, 1)[0]
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'
}

function collectLinks(value, routes) {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    value.forEach(item => collectLinks(item, routes))
    return
  }
  const path = normalizePath(value.href)
  const label = value.label || value.title
  if (path && label && !routes.has(path)) routes.set(path, label)
  Object.values(value).forEach(item => collectLinks(item, routes))
}

const menuRoutes = new Map()
collectLinks(MAIN_NAV, menuRoutes)
collectLinks(SECONDARY_NAV, menuRoutes)
collectLinks(MEGA_MENU_MAP, menuRoutes)
menuRoutes.set('/destination-weddings/india/jaisalmer', 'Jaisalmer Weddings')
menuRoutes.set('/destination-weddings/india/pushkar', 'Pushkar Weddings')
menuRoutes.set('/destination-weddings/india', 'Weddings in India')

// App.jsx route patterns. This inventory is used only to distinguish links
// that need the shared fallback from menu links handled by existing pages.
const APP_ROUTES = [
  '/', '/destinations', '/destinations/:slug', '/packages', '/packages/:slug',
  '/adventure/trekking-packages', '/packages/adventure/trekking',
  '/hotels', '/hotels/:slug', '/activities', '/activities/:slug', '/blog', '/blog/:slug',
  '/guides/travel-tips', '/guides/best-time', '/guides/how-to-reach',
  '/travel-guide/all-guides', '/travel-guide/travel-cost', '/travel-guide/travel-cost/:destinationSlug',
  '/travel-guide/visa-information', '/travel-guide/visa-information/:countrySlug',
  '/travel-guide/best-time-to-visit', '/travel-guide/best-time-to-visit/:season',
  '/travel-guide/packing-guides', '/travel-guide/packing-guides/:slug',
  '/local-travel/airport-transfer', '/local-travel/railway-station-transfer',
  '/local-travel/full-day-city-tour', '/local-travel/half-day-city-tour', '/local-travel/outstation-cab',
  '/local-travel/car-rental', '/local-travel/local-taxi-cab', '/local-travel/corporate-transportation', '/local-travel/:service',
  '/india/national-parks/:destinationSlug/how-to-reach', '/offers', '/about', '/contact', '/plan-trip',
  '/india', '/india/popular-destinations', '/india/heritage-destinations', '/india/religious-destinations',
  '/india/hill-stations', '/india/beaches', '/india/wildlife-destinations', '/india/national-parks',
  '/india/weekend-getaways', '/india/offbeat-destinations', '/india/destinations', '/india/famous-destinations',
  '/india/national-parks/gir-national-park', '/india/national-parks/ranthambore-national-park',
  '/india/national-parks/bandhavgarh-national-park', '/india/national-parks/pench-national-park',
  '/india/national-parks/jim-corbett-national-park', '/india/national-parks/sundarbans-national-park',
  '/india/national-parks/kaziranga-national-park', '/india/national-parks/kaziranga', '/india/national-parks/sundarbans',
  '/india/national-parks/ranthambore', '/india/national-parks/bandhavgarh', '/india/national-parks/pench',
  '/india/national-parks/jim-corbett', '/india/experiences', '/india/experiences/:categorySlug',
  '/india/things-to-do', '/india/things-to-do/:categorySlug', '/india/:destSlug', '/india/:stateSlug/:citySlug',
  '/international', '/international/destinations', '/international/destinations/:catSlug',
  '/international/places', '/international/places/:placeSlug', '/international/cities',
  '/international/europe',
  '/international/things-to-do', '/international/things-to-do/:actSlug', '/international/:destSlug',
  '/international/:countrySlug/packages', '/international/:countrySlug/:citySlug',
  '/international/south-korea/seoul', '/international/china/beijing', '/international/nepal/kathmandu',
  '/holiday', '/holiday/:destSlug', '/holidays', '/holidays/:typeSlug', '/holidays/domestic-honeymoon',
  '/holidays/international-honeymoon', '/holidays/beach-honeymoon', '/holidays/hill-station-honeymoon',
  '/holidays/luxury-honeymoon', '/holidays/adventure-honeymoon', '/holidays/budget-honeymoon',
  '/holidays/honeymoon-packages', '/holidays/:typeSlug/:subSlug',
  '/mice', '/mice/destinations', '/mice/destinations/:destSlug', '/mice/corporate-travel',
  '/mice/corporate-travel/:serviceSlug', '/mice/support', '/mice/support/:serviceSlug',
  '/destination-wedding', '/destination-weddings', '/destination-wedding/:destSlug', '/destination-weddings/:destSlug',
  '/destination-weddings/india/goa', '/destination-weddings/india/rajasthan', '/destination-weddings/india/udaipur',
  '/destination-weddings/india/jaipur', '/destination-weddings/india/jodhpur', '/destination-weddings/india/kerala',
  '/destination-weddings/india/maharashtra', '/destination-weddings/india/himachal', '/destination-weddings/india/kashmir', '/destination-weddings/india/ayodhya', '/destination-weddings/india/varanasi',
  '/weddings/rajasthan', '/medical-tourism', '/medical-tourism/:destSlug',

  ...['gujarat', 'rajasthan', 'maharashtra', 'goa', 'kerala', 'tamil-nadu', 'himachal-pradesh', 'uttarakhand',
    'karnataka', 'jammu-kashmir', 'uttar-pradesh', 'madhya-pradesh', 'west-bengal', 'andaman', 'north-east']
    .map(path => `/${path}`),
  '/login', '/admin/login', '/verify-otp', '/register', '/forgot-password',
]

function routeMatches(pathname, route) {
  const actual = pathname.split('/').filter(Boolean)
  const pattern = route.split('/').filter(Boolean)
  return actual.length === pattern.length && pattern.every((part, index) => part.startsWith(':') || part === actual[index])
}

function hasAppRoute(pathname) {
  return APP_ROUTES.some(route => routeMatches(pathname, route))
}

const AUDITED_UNFINISHED_MENU_ROUTES = new Set([
  '/packages/family', '/packages/adventure', '/packages/luxury', '/packages/budget',
  '/packages/weekend', '/packages/group', '/packages/solo',
  '/packages/adventure/camping', '/packages/adventure/wildlife', '/packages/adventure/water',
  '/packages/adventure/mountain', '/packages/adventure/road-trip', '/packages/adventure/winter',
  '/packages/family/beach', '/packages/family/hill-station', '/packages/family/wildlife',
  '/packages/family/theme-park', '/packages/family/budget',
  '/local-travel/bus-tempo-traveller', '/local-travel/custom-local-travel',
  '/india/cities', '/india/places', '/india/places/heritage', '/india/places/temples',
  '/india/places/beaches', '/india/places/lakes', '/india/places/hill-stations',
  '/india/places/museums', '/india/places/historical', '/india/destinations/attractions',
  '/travel-guide/itineraries', '/guides/itineraries', '/guides/packing', '/guides/visa', '/guides',
  '/experiences', '/mice/meetings/board', '/mice/meetings/team', '/mice/meetings/corporate',
  '/mice/meetings/executive', '/mice/meetings/agm', '/mice/meetings/launch', '/mice/meetings/strategy',
  '/mice/incentives/travel', '/mice/incentives/rewards', '/mice/incentives/performance',
  '/mice/incentives/motivational', '/mice/incentives/corporate', '/mice/incentives/recognition',
  '/mice/conferences/industry', '/mice/conferences/business', '/mice/conferences/academic',
  '/mice/conferences/medical', '/mice/conferences/tech', '/mice/conferences/international',
  '/mice/conferences/support', '/mice/exhibitions/trade-shows', '/mice/exhibitions',
  '/mice/exhibitions/product', '/mice/events/corporate', '/mice/events/activations',
  '/mice/events/gala', '/mice/events/awards', '/mice/corporate-travel/management',
  '/mice/corporate-travel/flights', '/mice/corporate-travel/hotels', '/mice/corporate-travel/visa',
  '/mice/corporate-travel/transfers', '/mice/corporate-travel/insurance', '/mice/corporate-travel/support',
  '/mice/support/venue', '/mice/support/planning', '/mice/support/logistics', '/mice/support/accommodation',
  '/mice/support/av', '/mice/support/decor', '/mice/support/catering',
])

const HOLIDAY_CATEGORY_ROUTES = new Set([
  ...['family-getaways', 'family-beach', 'family-hill', 'theme-park', 'wildlife-holidays', 'road-trip', 'budget-family',
    'honeymoon-getaways', 'honeymoon-beach', 'honeymoon-mountain', 'romantic-getaways', 'beach-honeymoons',
    'hill-station-honeymoons', 'luxury-honeymoons', 'international-honeymoons', 'adventure-honeymoons',
    'budget-honeymoons', 'adventure-holidays', 'adventure-rafting', 'adventure-trekking', 'adventure-camping',
    'adventure-safari', 'trekking-holidays', 'camping-holidays', 'wildlife-adventures', 'water-adventure',
    'mountain-adventures', 'desert-adventures', 'winter-adventures', 'beach-holidays', 'beach-romantic',
    'beach-adventure', 'beach-getaways', 'island-holidays', 'tropical-beach-holidays', 'luxury-beach-holidays',
    'budget-beach-holidays', 'water-sports-holidays', 'spiritual-holidays', 'spiritual-yoga', 'spiritual-temple',
    'spiritual-ayurveda', 'pilgrimage-tours', 'temple-tours', 'spiritual-retreats', 'meditation-holidays',
    'yoga-holidays', 'festival-holidays', 'luxury-holidays', 'luxury-resorts', 'luxury-cruise', 'weekend-getaways',
    'weekend-nature', 'weekend-city', 'offbeat-destinations', 'offbeat-northeast', 'offbeat-hills']
    .map(slug => `/holidays/${slug}`),
])

const AUDITED_UNFINISHED_WEDDING_ROUTES = new Set(
  [
    ...['india/rajasthan', 'india/jaisalmer', 'india/pushkar',
      'international/bali', 'international/thailand', 'international/dubai', 'international/maldives',
      'international/singapore', 'international/europe', 'international/sri-lanka', 'international/mauritius',
      'international/turkey', 'international/australia', 'international/usa', 'venues/beach', 'venues/palace',
      'venues/resort', 'venues/garden', 'venues/island', 'venues/fort', 'venues/backwater', 'venues/banquet',
      'venues/vineyard', 'venues/mountain', 'venues/yacht', 'themes/royal', 'themes/beach', 'themes/boho',
      'themes/traditional', 'themes/modern', 'themes/intimate', 'themes/luxury', 'themes/eco', 'themes/pre-wedding',
      'themes/mehendi', 'themes/sangeet', 'guides/planning', 'guides/best-time', 'guides/budget', 'guides/legal',
      'guides/guests', 'guides/decor', 'guides/catering', 'guides/entertainment', 'guides/honeymoon',
      'guides/checklist', 'guides/real-weddings', 'guides/faqs']
      .map(path => `/destination-weddings/${path}`),
  ]
)

const WORKING_HOLIDAY_MENU_ROUTES = new Set([
  '/holidays/family/getaways', '/holidays/family/beach', '/holidays/family/hill',
  '/holidays/family/theme-park', '/holidays/family/wildlife', '/holidays/family/road-trip',
  '/holidays/family/budget', '/holidays/domestic-honeymoon', '/holidays/beach-honeymoon',
  '/holidays/hill-station-honeymoon', '/holidays/luxury-honeymoon', '/holidays/international-honeymoon',
  '/holidays/adventure-honeymoon', '/holidays/budget-honeymoon',
  '/holidays/adventure/trekking', '/holidays/adventure/camping', '/holidays/adventure/wildlife',
  '/holidays/adventure/water', '/holidays/adventure/mountain', '/holidays/adventure/desert',
  '/holidays/adventure/winter', '/holidays/beach/getaways', '/holidays/beach/island',
  '/holidays/beach/tropical', '/holidays/beach/luxury', '/holidays/beach/budget',
  '/holidays/beach/water-sports', '/holidays/spiritual/pilgrimage', '/holidays/spiritual/temples',
  '/holidays/spiritual/retreats', '/holidays/spiritual/meditation', '/holidays/spiritual/yoga',
  '/holidays/spiritual/festival', '/holidays/honeymoon-packages', '/holidays/luxury',
  '/holidays/budget', '/holidays/weekend', '/holidays/group', '/holidays/solo', '/holidays/festival',
])

const INTERNATIONAL_CATEGORY_ROUTES = new Set([
  ...['adventure', 'beach', 'family', 'heritage', 'hill-stations', 'honeymoon', 'island', 'luxury', 'weekend', 'offbeat']
    .map(slug => `/international/destinations/${slug}`),
  ...['landmarks', 'museums', 'theme-parks', 'beaches', 'national-parks', 'waterfalls', 'religious', 'shopping']
    .map(slug => `/international/places/${slug}`),
  ...['adventure', 'water-sports', 'trekking', 'wildlife', 'cruises', 'desert', 'scuba', 'skydiving', 'camping', 'culture', 'nightlife']
    .map(slug => `/international/things-to-do/${slug}`),
])

function prettifyPathName(pathname) {
  const lastPart = normalizePath(pathname)?.split('/').filter(Boolean).at(-1)
  return lastPart?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || ''
}

const UNFINISHED_MENU_LABELS = {
  '/packages/family/getaways': 'Family Getaways',
  '/packages/adventure': 'Adventure Packages',
  '/packages/adventure/camping': 'Camping Packages',
  '/packages/adventure/wildlife': 'Wildlife Packages',
  '/packages/adventure/water': 'Water Adventure Packages',
  '/packages/adventure/mountain': 'Mountain Adventure Packages',
  '/packages/adventure/road-trip': 'Road Trip Packages',
  '/packages/adventure/winter': 'Winter Adventure Packages',
  '/packages/family': 'Family Packages',
  '/packages/family/beach': 'Family Beach Holidays',
  '/packages/family/hill-station': 'Family Hill Station Holidays',
  '/packages/family/wildlife': 'Family Wildlife Holidays',
  '/packages/family/theme-park': 'Family Theme Park Holidays',
  '/packages/family/budget': 'Budget Family Holidays',
  '/packages/luxury': 'Luxury Packages',
  '/packages/budget': 'Budget Packages',
  '/packages/weekend': 'Weekend Packages',
  '/packages/group': 'Group Packages',
  '/packages/solo': 'Solo Travel Packages',
  '/international/europe/switzerland/zurich': 'Zurich',
  '/international/europe/france/paris': 'Paris',
  '/international/europe/uk/london': 'London',
}

export function getKnownMenuRouteName(pathname) {
  const path = normalizePath(pathname)
  return path ? UNFINISHED_MENU_LABELS[path] || menuRoutes.get(path) || (AUDITED_UNFINISHED_MENU_ROUTES.has(path) || AUDITED_UNFINISHED_WEDDING_ROUTES.has(path) ? prettifyPathName(path) : '') : ''
}

export function isKnownMenuRoute(pathname) {
  const path = normalizePath(pathname)
  if (!path || !menuRoutes.has(path)) return false
  if (path === '/packages/family/getaways') return true
  if (AUDITED_UNFINISHED_MENU_ROUTES.has(path) || AUDITED_UNFINISHED_WEDDING_ROUTES.has(path)) return true
  if (path.startsWith('/medical-tourism/') && path.split('/').filter(Boolean).length > 2) return true
  if (path.startsWith('/international/') && !path.startsWith('/international/europe/') && !hasAppRoute(path)) return true
  if (INTERNATIONAL_CATEGORY_ROUTES.has(path) || WORKING_HOLIDAY_MENU_ROUTES.has(path)) return false
  if (HOLIDAY_CATEGORY_ROUTES.has(path)) return true
  if (path.startsWith('/international/')) {
    const parts = path.split('/').filter(Boolean)
    if (parts.length === 4) return true
    if (parts.at(-1) === 'packages') return false
    if (parts.length === 3 && !getCityData(`${parts[1]}/${parts[2]}`)) return true
  }
  return !hasAppRoute(path)
}

export const knownMenuRoutes = Object.freeze([...menuRoutes.keys()])
