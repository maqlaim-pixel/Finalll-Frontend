/**
 * Single source of truth for every publicly indexable page.
 *
 * Used by:
 *  - src/seo/Seo.jsx          (client-side metadata + breadcrumbs)
 *  - scripts/prerender.mjs    (per-route HTML head at build time)
 *  - src/seo/sitemap.js       (sitemap.xml, reused by the Vercel function)
 *
 * Admin, authentication, account and "coming soon" routes are intentionally
 * absent. Dynamic content (packages, destinations, blogs, hotels, activities)
 * is appended from the published API records.
 */

import CITIES from '../data/cityData.js'
import { HOME_TITLE, HOME_DESCRIPTION } from './siteConfig.js'

const P = (path, label, title, description, priority = 0.7, changefreq = 'monthly') => ({
  path,
  label,
  title,
  description,
  priority,
  changefreq,
})

const truncate = (value = '', limit = 158) => {
  const text = String(value).replace(/\s+/g, ' ').trim()
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : limit).trim()}…`
}

export const STATIC_ROUTES = [
  // ── Core ────────────────────────────────────────────────────────────────
  P('/', 'Home', HOME_TITLE, HOME_DESCRIPTION, 1.0, 'weekly'),
  P('/destinations', 'Destinations', 'Tour Destinations in India & Abroad | Maqlaim Tours', 'Browse Maqlaim Tours destinations across India and abroad. Explore destination guides, attractions, best travel seasons and available holiday packages.', 0.9, 'weekly'),
  P('/packages', 'Tour Packages', 'India & International Tour Packages | Maqlaim Tours', 'Compare Maqlaim Tours holiday packages for India and international destinations, with durations, inclusions and genuine starting prices.', 0.9, 'weekly'),
  P('/hotels', 'Hotels', 'Hotels & Stays in India | Maqlaim Tours', 'Find hotels and stays for your holiday with Maqlaim Tours. Browse published properties by city, category and price per night.', 0.8, 'weekly'),
  P('/activities', 'Activities', 'Travel Activities & Things to Do | Maqlaim Tours', 'Discover bookable travel activities and experiences in India with Maqlaim Tours, from adventure sports to sightseeing and culture.', 0.8, 'weekly'),
  P('/blog', 'Travel Blog', 'Travel Blog: Guides, Tips & Destination Stories | Maqlaim Tours', 'Read Maqlaim Tours travel guides, destination stories, budgeting tips and practical advice for planning your next trip.', 0.8, 'weekly'),
  P('/about', 'About Us', 'About Maqlaim Tours | Our Travel Story', 'Learn about Maqlaim Tours and our approach to curated India and international holidays, personalised itineraries and travel support.', 0.6),
  P('/contact', 'Contact', 'Contact Maqlaim Tours | Travel Enquiries & Support', 'Contact Maqlaim Tours for holiday enquiries, custom itineraries, bookings and travel support. Reach our team by phone, email or enquiry form.', 0.8, 'weekly'),
  P('/plan-trip', 'Plan My Trip', 'Plan Your Trip with Maqlaim Tours', 'Share your destination, travel dates and interests and let Maqlaim Tours build a personalised itinerary around your plans.', 0.7),
  P('/offers', 'Offers', 'Travel Offers & Holiday Deals | Maqlaim Tours', 'Explore current Maqlaim Tours travel offers and seasonal holiday ideas. Contact our team to confirm availability and pricing.', 0.6, 'weekly'),
  P('/adventure/trekking-packages', 'Trekking Packages', 'Trekking Packages in India | Maqlaim Tours', 'Explore trekking holidays in India with Maqlaim Tours, including Himalayan trails, guided treks and adventure itineraries.', 0.7),

  // ── India ───────────────────────────────────────────────────────────────
  P('/india', 'India', 'India Tour Packages | Maqlaim Tours', 'Discover India with Maqlaim Tours through curated state holidays, heritage circuits, wildlife parks, beaches, hill stations and city breaks.', 0.9, 'weekly'),
  P('/india/popular-destinations', 'Popular Destinations', 'Popular Destinations in India | Maqlaim Tours', 'Explore the most popular destinations in India with Maqlaim Tours, from Rajasthan and Kerala to Goa, Ladakh and the Himalayas.', 0.7),
  P('/india/heritage-destinations', 'Heritage Destinations', 'Heritage Destinations in India | Maqlaim Tours', 'Explore India heritage destinations with Maqlaim Tours, including forts, palaces, UNESCO sites and historic cities.', 0.7),
  P('/india/religious-destinations', 'Religious Destinations', 'Religious & Pilgrimage Destinations in India | Maqlaim Tours', 'Plan a pilgrimage with Maqlaim Tours to India religious destinations, temple towns, sacred rivers and spiritual centres.', 0.7),
  P('/india/hill-stations', 'Hill Stations', 'Hill Stations in India | Maqlaim Tours', 'Discover India hill stations with Maqlaim Tours, from Himalayan retreats to Western Ghats getaways and misty mountain towns.', 0.7),
  P('/india/beaches', 'Beaches', 'Beaches in India | Maqlaim Tours', 'Plan a beach holiday in India with Maqlaim Tours, covering coastal escapes in Goa, Kerala, Karnataka, Maharashtra and the islands.', 0.7),
  P('/india/wildlife-destinations', 'Wildlife Destinations', 'Wildlife Destinations in India | Maqlaim Tours', 'Explore India wildlife destinations with Maqlaim Tours, including tiger reserves, national parks and guided safari holidays.', 0.7),
  P('/india/national-parks', 'National Parks', 'National Parks in India | Maqlaim Tours', 'Discover India national parks and tiger reserves with Maqlaim Tours, with safari planning, best seasons and park travel guides.', 0.8),
  P('/india/weekend-getaways', 'Weekend Getaways', 'Weekend Getaways in India | Maqlaim Tours', 'Find short weekend getaways in India with Maqlaim Tours, from hill escapes and heritage towns to beach breaks near major cities.', 0.7),
  P('/india/offbeat-destinations', 'Offbeat Destinations', 'Offbeat Destinations in India | Maqlaim Tours', 'Go beyond the usual routes with Maqlaim Tours offbeat destinations in India, including quiet hills, villages and lesser-known heritage.', 0.6),
  P('/india/destinations', 'All India Destinations', 'All Destinations in India | Maqlaim Tours', 'Browse the complete Maqlaim Tours list of destinations in India, organised by state, region and travel interest.', 0.7),
  P('/india/famous-destinations', 'Famous Destinations', 'Famous Destinations in India | Maqlaim Tours', 'Explore India famous destinations with Maqlaim Tours, including iconic landmarks, cultural cities and celebrated landscapes.', 0.7),
  P('/india/experiences', 'India Experiences', 'India Travel Experiences & Things to Do | Maqlaim Tours', 'Discover India travel experiences with Maqlaim Tours, from heritage walks and wildlife safaris to food, culture and adventure.', 0.7),

  // ── States & regions ────────────────────────────────────────────────────
  P('/gujarat', 'Gujarat', 'Gujarat Tour Packages | Maqlaim Tours', 'Explore Gujarat with Maqlaim Tours: heritage cities, Gir wildlife, temple towns, handicrafts and the distinctive landscapes of Kutch.', 0.8),
  P('/rajasthan', 'Rajasthan', 'Rajasthan Tour Packages | Maqlaim Tours', 'Book Rajasthan tour packages with Maqlaim Tours covering Jaipur, Udaipur, Jodhpur, Jaisalmer, forts, palaces and desert safaris.', 0.9),
  P('/maharashtra', 'Maharashtra', 'Maharashtra Tour Packages | Maqlaim Tours', 'Explore Maharashtra with Maqlaim Tours, from Mumbai and Pune city breaks to Konkan beaches, hill stations and cave heritage.', 0.7),
  P('/goa', 'Goa', 'Goa Tour Packages | Maqlaim Tours', 'Plan a Goa holiday with Maqlaim Tours with beach stays, sightseeing, water activities and flexible packages for families and couples.', 0.9),
  P('/kerala', 'Kerala', 'Kerala Tour Packages | Maqlaim Tours', 'Discover Kerala with Maqlaim Tours: backwater houseboats, tea plantations, beaches, Ayurveda and curated honeymoon itineraries.', 0.9),
  P('/tamil-nadu', 'Tamil Nadu', 'Tamil Nadu Tour Packages | Maqlaim Tours', 'Explore Tamil Nadu with Maqlaim Tours, including temple towns, hill stations, coastal heritage and classic cultural circuits.', 0.7),
  P('/himachal-pradesh', 'Himachal Pradesh', 'Himachal Pradesh Tour Packages | Maqlaim Tours', 'Book Himachal Pradesh holidays with Maqlaim Tours covering Shimla, Manali, Dharamshala, mountain trails and adventure activities.', 0.8),
  P('/uttarakhand', 'Uttarakhand', 'Uttarakhand Tour Packages | Maqlaim Tours', 'Explore Uttarakhand with Maqlaim Tours, from Nainital and Mussoorie to Rishikesh, Haridwar and Himalayan pilgrimage routes.', 0.7),
  P('/karnataka', 'Karnataka', 'Karnataka Tour Packages | Maqlaim Tours', 'Discover Karnataka with Maqlaim Tours: Bengaluru, Mysuru heritage, Hampi, Coorg hills and relaxed coastal escapes.', 0.7),
  P('/jammu-kashmir', 'Jammu & Kashmir', 'Kashmir & Jammu Tour Packages | Maqlaim Tours', 'Plan a Kashmir holiday with Maqlaim Tours covering Srinagar, Gulmarg, Pahalgam, houseboats, gardens and Himalayan scenery.', 0.9),
  P('/uttar-pradesh', 'Uttar Pradesh', 'Uttar Pradesh Tour Packages | Maqlaim Tours', 'Explore Uttar Pradesh with Maqlaim Tours, including Agra, Varanasi, Ayodhya, Lucknow and heritage and pilgrimage circuits.', 0.7),
  P('/madhya-pradesh', 'Madhya Pradesh', 'Madhya Pradesh Tour Packages | Maqlaim Tours', 'Discover Madhya Pradesh with Maqlaim Tours: wildlife parks, temples, forts, heritage cities and central India landscapes.', 0.7),
  P('/west-bengal', 'West Bengal', 'West Bengal Tour Packages | Maqlaim Tours', 'Explore West Bengal with Maqlaim Tours, from Kolkata heritage and Darjeeling hills to Sundarbans wildlife and coastal escapes.', 0.7),
  P('/andaman', 'Andaman', 'Andaman Tour Packages | Maqlaim Tours', 'Plan an Andaman Islands holiday with Maqlaim Tours: beaches, snorkelling, island hopping and relaxed coastal stays.', 0.7),
  P('/north-east', 'North East India', 'North East India Tour Packages | Maqlaim Tours', 'Discover North East India with Maqlaim Tours, including Assam, Meghalaya, Arunachal Pradesh, tea estates and mountain scenery.', 0.7),

  // ── National parks ──────────────────────────────────────────────────────
  P('/india/national-parks/gir-national-park', 'Gir National Park', 'Gir National Park Safari & Tour Guide | Maqlaim Tours', 'Plan a Gir National Park visit with Maqlaim Tours: Asiatic lions, safari planning, best season and travel information for Sasan Gir.', 0.7),
  P('/india/national-parks/ranthambore-national-park', 'Ranthambore National Park', 'Ranthambore National Park Safari Guide | Maqlaim Tours', 'Explore Ranthambore National Park with Maqlaim Tours: tiger safaris, zones, best season and nearby travel planning.', 0.7),
  P('/india/national-parks/bandhavgarh-national-park', 'Bandhavgarh National Park', 'Bandhavgarh National Park Safari Guide | Maqlaim Tours', 'Plan a Bandhavgarh National Park safari with Maqlaim Tours, including tiger tracking, park zones and the best time to visit.', 0.7),
  P('/india/national-parks/pench-national-park', 'Pench National Park', 'Pench National Park Safari Guide | Maqlaim Tours', 'Discover Pench National Park with Maqlaim Tours: jungle safaris, wildlife, park access and seasonal travel advice.', 0.6),
  P('/india/national-parks/jim-corbett-national-park', 'Jim Corbett National Park', 'Jim Corbett National Park Safari Guide | Maqlaim Tours', 'Plan a Jim Corbett National Park trip with Maqlaim Tours: safari zones, wildlife, best season and stay options.', 0.7),
  P('/india/national-parks/sundarbans-national-park', 'Sundarbans National Park', 'Sundarbans National Park Travel Guide | Maqlaim Tours', 'Explore Sundarbans National Park with Maqlaim Tours: mangrove waterways, wildlife, boat safaris and travel guidance.', 0.6),
  P('/india/national-parks/kaziranga-national-park', 'Kaziranga National Park', 'Kaziranga National Park Safari Guide | Maqlaim Tours', 'Plan a Kaziranga National Park visit with Maqlaim Tours: one-horned rhinos, safari zones, seasons and travel information.', 0.7),

  // ── International ───────────────────────────────────────────────────────
  P('/international', 'International', 'International Tour Packages | Maqlaim Tours', 'Explore international tour packages with Maqlaim Tours, covering popular countries, cities, attractions and curated holiday itineraries.', 0.9, 'weekly'),
  P('/international/destinations', 'International Destinations', 'International Destinations | Maqlaim Tours', 'Browse international destinations with Maqlaim Tours by region and travel style, from nearby escapes to long-haul holidays.', 0.7),
  P('/international/places', 'International Places', 'International Places to Visit | Maqlaim Tours', 'Discover international places to visit with Maqlaim Tours, including landmarks, natural wonders and cultural highlights.', 0.7),
  P('/international/cities', 'International Cities', 'International Cities to Visit | Maqlaim Tours', 'Explore international cities with Maqlaim Tours and compare city guides, attractions and available holiday packages.', 0.7),
  P('/international/things-to-do', 'Things to Do Abroad', 'Things to Do Abroad | Maqlaim Tours', 'Find things to do on your international holiday with Maqlaim Tours, from sightseeing and culture to outdoor experiences.', 0.6),

  // ── Local travel & transfers ────────────────────────────────────────────
  P('/local-travel/airport-transfer', 'Airport Transfers', 'Airport Transfers in India | Maqlaim Tours', 'Book airport pickup and drop with Maqlaim Tours at major Indian airports. Comfortable vehicles, professional drivers and 24x7 support.', 0.8, 'weekly'),
  P('/local-travel/railway-station-transfer', 'Railway Station Transfers', 'Railway Station Transfers in India | Maqlaim Tours', 'Book railway station pickup and drop with Maqlaim Tours. Choose a vehicle, share your train details and travel comfortably.', 0.7),
  P('/local-travel/full-day-city-tour', 'Full Day City Tours', 'Full Day City Tours in India | Maqlaim Tours', 'Explore a city in a day with Maqlaim Tours full day city tours, including comfortable transport and flexible sightseeing plans.', 0.7),
  P('/local-travel/half-day-city-tour', 'Half Day City Tours', 'Half Day City Tours in India | Maqlaim Tours', 'See the highlights of a city in a few hours with Maqlaim Tours half day city tours and private, comfortable transport.', 0.6),
  P('/local-travel/outstation-cab', 'Outstation Cabs', 'Outstation Cab Booking in India | Maqlaim Tours', 'Book one-way and round-trip outstation cabs with Maqlaim Tours. Transparent vehicle options, professional drivers and flexible stops.', 0.8, 'weekly'),
  P('/local-travel/car-rental', 'Car Rental', 'Car Rental in India | Maqlaim Tours', 'Rent a car with Maqlaim Tours for city travel, business trips or holidays. Choose hatchbacks, sedans, SUVs and larger vehicles.', 0.7),
  P('/local-travel/local-taxi-cab', 'Local Taxi & Cab', 'Local Taxi & Cab Booking in India | Maqlaim Tours', 'Book a local taxi or cab with Maqlaim Tours for city rides, sightseeing and hourly rentals with professional drivers.', 0.7),
  P('/local-travel/corporate-transportation', 'Corporate Transportation', 'Corporate Transportation Services | Maqlaim Tours', 'Maqlaim Tours provides corporate transportation for executives, client visits, events and business travel with professional drivers.', 0.6),

  // ── Travel guides ───────────────────────────────────────────────────────
  P('/guides/travel-tips', 'Travel Tips', 'Travel Tips for India & Abroad | Maqlaim Tours', 'Practical travel tips from Maqlaim Tours covering planning, packing, budgets, safety and getting the most from your trip.', 0.6),
  P('/guides/how-to-reach', 'How to Reach', 'How to Reach Destinations in India | Maqlaim Tours', 'Find how to reach destinations in India by air, rail and road with Maqlaim Tours travel guidance and trip planning help.', 0.6),
  P('/travel-guide/all-guides', 'All Travel Guides', 'All Travel Guides | Maqlaim Tours', 'Browse every Maqlaim Tours travel guide in one place: destination advice, costs, visas, seasons, packing and how to reach.', 0.7),
  P('/travel-guide/travel-cost', 'Travel Cost Guides', 'Travel Cost & Trip Budget Guides | Maqlaim Tours', 'Understand what a trip may cost with Maqlaim Tours travel cost guides, based on published packages and destination budgets.', 0.7),
  P('/travel-guide/visa-information', 'Visa Information', 'Visa Information for International Travel | Maqlaim Tours', 'Review general visa information for international destinations with Maqlaim Tours and verify requirements with official authorities.', 0.6),
  P('/travel-guide/best-time-to-visit', 'Best Time to Visit', 'Best Time to Visit Destinations | Maqlaim Tours', 'Find the best time to visit destinations in India and abroad with Maqlaim Tours seasonal guides and weather planning advice.', 0.7),
  P('/travel-guide/packing-guides', 'Packing Guides', 'Packing Guides for Every Trip | Maqlaim Tours', 'Use Maqlaim Tours packing guides and checklists for beaches, mountains, safaris, family holidays and international trips.', 0.6),

  // ── Holiday types ───────────────────────────────────────────────────────
  P('/holidays', 'Holidays', 'Holiday Packages in India & Abroad | Maqlaim Tours', 'Explore holiday packages with Maqlaim Tours by theme and destination, including family breaks, honeymoons and adventure trips.', 0.9, 'weekly'),
  P('/holidays/domestic-honeymoon', 'Domestic Honeymoon', 'Domestic Honeymoon Packages | Maqlaim Tours', 'Plan a domestic honeymoon with Maqlaim Tours, from Kerala backwaters and Himalayan hills to Goa beaches and Rajasthan palaces.', 0.7),
  P('/holidays/international-honeymoon', 'International Honeymoon', 'International Honeymoon Packages | Maqlaim Tours', 'Discover international honeymoon packages with Maqlaim Tours for island escapes, city breaks and memorable romantic holidays.', 0.7),
  P('/holidays/beach-honeymoon', 'Beach Honeymoon', 'Beach Honeymoon Packages | Maqlaim Tours', 'Plan a beach honeymoon with Maqlaim Tours, with coastal stays, island escapes and relaxed romantic itineraries.', 0.7),
  P('/holidays/hill-station-honeymoon', 'Hill Station Honeymoon', 'Hill Station Honeymoon Packages | Maqlaim Tours', 'Escape to the hills with Maqlaim Tours honeymoon packages featuring mountain stays, scenic drives and quiet time together.', 0.6),
  P('/holidays/luxury-honeymoon', 'Luxury Honeymoon', 'Luxury Honeymoon Packages | Maqlaim Tours', 'Explore luxury honeymoon packages from Maqlaim Tours with premium stays, private transfers and carefully planned experiences.', 0.6),
  P('/holidays/adventure-honeymoon', 'Adventure Honeymoon', 'Adventure Honeymoon Packages | Maqlaim Tours', 'Combine romance and adventure with Maqlaim Tours honeymoon packages built around trekking, wildlife and outdoor experiences.', 0.6),
  P('/holidays/budget-honeymoon', 'Budget Honeymoon', 'Budget Honeymoon Packages | Maqlaim Tours', 'Find budget-friendly honeymoon packages with Maqlaim Tours and plan a memorable trip without overspending.', 0.6),
  P('/holidays/honeymoon-packages', 'Honeymoon Packages', 'Honeymoon Packages | Maqlaim Tours', 'Browse Maqlaim Tours honeymoon packages for India and international destinations, with flexible durations and private itineraries.', 0.8),

  // ── MICE & corporate ────────────────────────────────────────────────────
  P('/mice', 'MICE', 'MICE & Corporate Events | Maqlaim Tours', 'Maqlaim Tours plans MICE programmes, corporate offsites, conferences and incentive travel with end-to-end destination support.', 0.6),
  P('/mice/destinations', 'MICE Destinations', 'MICE Destinations in India & Abroad | Maqlaim Tours', 'Compare MICE destinations with Maqlaim Tours for conferences, incentive trips and corporate offsites in India and abroad.', 0.6),
  P('/mice/corporate-travel', 'Corporate Travel', 'Corporate Travel Management | Maqlaim Tours', 'Maqlaim Tours supports corporate travel with itinerary planning, transport, stays and on-ground coordination for business groups.', 0.6),
  P('/mice/support', 'MICE Support', 'MICE Planning & On-Site Support | Maqlaim Tours', 'Get Maqlaim Tours MICE support for event logistics, guest movement, hospitality and on-site coordination.', 0.5),

  // ── Destination weddings ────────────────────────────────────────────────
  P('/destination-weddings', 'Destination Weddings', 'Destination Weddings in India & Abroad | Maqlaim Tours', 'Plan a destination wedding with Maqlaim Tours, with venue guidance, guest travel, stays and on-ground coordination in India and abroad.', 0.8),
  P('/destination-weddings/india/rajasthan', 'Rajasthan Weddings', 'Rajasthan Destination Weddings | Maqlaim Tours', 'Plan a Rajasthan destination wedding with Maqlaim Tours amid palace venues, heritage havelis, royal decor and guest travel support.', 0.7),
  P('/destination-weddings/india/goa', 'Goa Weddings', 'Goa Destination Weddings | Maqlaim Tours', 'Plan a Goa beach wedding with Maqlaim Tours, from sunset ceremonies and resort venues to guest stays and local coordination.', 0.7),
  P('/destination-weddings/india/udaipur', 'Udaipur Weddings', 'Udaipur Destination Weddings | Maqlaim Tours', 'Celebrate a Udaipur destination wedding with Maqlaim Tours, with lakefront venues, palace settings and complete guest support.', 0.7),
  P('/destination-weddings/india/jaipur', 'Jaipur Weddings', 'Jaipur Destination Weddings | Maqlaim Tours', 'Plan a Jaipur destination wedding with Maqlaim Tours, including palace venues, heritage stays and guest travel arrangements.', 0.7),
  P('/destination-weddings/india/jodhpur', 'Jodhpur Weddings', 'Jodhpur Destination Weddings | Maqlaim Tours', 'Host a Jodhpur destination wedding with Maqlaim Tours against the backdrop of Mehrangarh, blue city heritage and desert scenery.', 0.7),
  P('/destination-weddings/india/kerala', 'Kerala Weddings', 'Kerala Destination Weddings | Maqlaim Tours', 'Plan a Kerala destination wedding with Maqlaim Tours, with backwater settings, coastal venues and tropical greenery.', 0.7),
  P('/destination-weddings/india/maharashtra', 'Maharashtra Weddings', 'Maharashtra Destination Weddings | Maqlaim Tours', 'Explore Maharashtra destination wedding options with Maqlaim Tours, from coastal venues to hill and heritage settings.', 0.6),
  P('/destination-weddings/india/himachal', 'Himachal Weddings', 'Himachal Destination Weddings | Maqlaim Tours', 'Plan a Himachal destination wedding with Maqlaim Tours amid mountain resorts, pine forests and Himalayan views.', 0.7),
  P('/destination-weddings/india/kashmir', 'Kashmir Weddings', 'Kashmir Destination Weddings | Maqlaim Tours', 'Celebrate a Kashmir destination wedding with Maqlaim Tours, with lake views, gardens, mountain scenery and guest support.', 0.7),
  P('/destination-weddings/india/ayodhya', 'Ayodhya Weddings', 'Ayodhya Destination Weddings | Maqlaim Tours', 'Plan a sacred Ayodhya wedding with Maqlaim Tours, with riverfront settings, temple town atmosphere and guest arrangements.', 0.6),
  P('/destination-weddings/india/varanasi', 'Varanasi Weddings', 'Varanasi Destination Weddings | Maqlaim Tours', 'Host a Varanasi wedding with Maqlaim Tours on the Ganges, with ghat-side ceremonies and complete guest travel support.', 0.6),
  P('/destination-weddings/international/bali', 'Bali Weddings', 'Bali Destination Wedding Packages | Maqlaim Tours', 'Plan a Bali destination wedding with Maqlaim Tours, from beach and clifftop venues to resort ceremonies and guest travel.', 0.7),
  P('/destination-weddings/international/thailand', 'Thailand Weddings', 'Thailand Destination Wedding Packages | Maqlaim Tours', 'Plan a Thailand destination wedding with Maqlaim Tours, with beach resorts, city venues and coordinated guest travel.', 0.7),
  P('/destination-weddings/international/dubai', 'Dubai Weddings', 'Dubai Destination Wedding Packages | Maqlaim Tours', 'Celebrate a Dubai destination wedding with Maqlaim Tours, from beachfront and desert venues to luxury hotel celebrations.', 0.7),
  P('/destination-weddings/international/maldives', 'Maldives Weddings', 'Maldives Destination Wedding Packages | Maqlaim Tours', 'Plan an intimate Maldives wedding with Maqlaim Tours, with island resorts, overwater settings and private ceremonies.', 0.7),
  P('/destination-weddings/international/singapore', 'Singapore Weddings', 'Singapore Destination Wedding Packages | Maqlaim Tours', 'Plan a Singapore destination wedding with Maqlaim Tours, with skyline venues, garden celebrations and guest travel support.', 0.7),

  // ── Medical tourism ─────────────────────────────────────────────────────
  P('/medical-tourism', 'Medical Tourism', 'Medical Tourism in India | Maqlaim Tours', 'Maqlaim Tours assists with medical tourism travel in India, including transport, stays and coordination for patients and families.', 0.6),
]

/**
 * City guide pages that exist in src/data/cityData.js. Only cities with real,
 * substantial guide content are included, so the sitemap never lists thin pages.
 */
export const CITY_ROUTES = Object.entries(CITIES)
  .filter(([, city]) => city && city.name && city.description && city.description.length > 100)
  .map(([slug, city]) =>
    P(
      `/india/${city.stateSlug}/${slug}`,
      city.name,
      `${city.name} Travel Guide & Tour Packages | Maqlaim Tours`,
      truncate(`${city.name}, ${city.state}: ${city.description}`),
      0.6,
    ),
  )

export const INDEXABLE_ROUTES = [...STATIC_ROUTES, ...CITY_ROUTES]

export const ROUTE_MAP = new Map(INDEXABLE_ROUTES.map((route) => [route.path, route]))

/** Paths that must never be indexed (auth, account, admin, placeholders). */
export const NOINDEX_PREFIXES = [
  '/admin',
  '/account',
  '/login',
  '/verify-otp',
  '/register',
  '/forgot-password',
]

export const COMING_SOON_PATHS = [
  '/india/cities',
  '/india/places',
  '/india/places/heritage',
  '/india/places/temples',
  '/india/places/beaches',
  '/india/places/lakes',
  '/india/places/hill-stations',
  '/india/places/museums',
  '/india/places/historical',
  '/india/destinations/attractions',
  '/destination-weddings/international',
]

export function isNoIndexPath(pathname = '/') {
  const path = pathname.split(/[?#]/, 1)[0]
  if (NOINDEX_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return true
  if (COMING_SOON_PATHS.includes(path)) return true
  return false
}

export function humanizeSlug(slug = '') {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((word) => (word.length <= 2 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
}

/** Fill metadata gaps for dynamic detail routes without page-level SEO props. */
export function fallbackMeta(pathname = '/') {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/'
  const known = ROUTE_MAP.get(path)
  if (known) return known

  if (isNoIndexPath(path)) {
    const parts = path.split('/').filter(Boolean)
    let label = 'Maqlaim Tours'
    if (parts[0] === 'login' || parts[1] === 'login') label = 'Login'
    else if (parts[0] === 'register') label = 'Create Account'
    else if (parts[0] === 'verify-otp') label = 'Verify OTP'
    else if (parts[0] === 'forgot-password') label = 'Reset Password'
    else if (parts[0] === 'account') label = parts[1] ? `My ${humanizeSlug(parts[1])}` : 'My Account'
    else if (parts[0] === 'admin') label = parts[1] ? `Admin ${humanizeSlug(parts[1])}` : 'Admin'
    return P(path, label, `${label} | Maqlaim Tours`, `${label} for Maqlaim Tours.`, 0.1, 'yearly')
  }

  const segments = path.split('/').filter(Boolean)
  const last = segments[segments.length - 1] || ''
  const label = humanizeSlug(last)
  const prefix = `/${segments[0] || ''}`

  const templates = {
    '/packages': { noun: 'Tour Package', group: 'Tour Packages' },
    '/destinations': { noun: 'Destination Guide', group: 'Destinations' },
    '/hotels': { noun: 'Hotel', group: 'Hotels' },
    '/activities': { noun: 'Activity', group: 'Activities' },
    '/blog': { noun: 'Travel Guide', group: 'Travel Blog' },
  }
  const template = templates[prefix]
  if (template) {
    return P(
      path,
      label,
      `${label} | ${template.noun} | Maqlaim Tours`,
      `Explore ${label} with Maqlaim Tours, including details, travel information and available ${template.group.toLowerCase()}.`,
      0.6,
    )
  }
  return null
}

/** Breadcrumb trail using only real, linked pages plus the current page. */
export function breadcrumbsFor(pathname = '/') {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/'
  if (path === '/') return [{ name: 'Home', url: '/' }]

  const segments = path.split('/').filter(Boolean)
  const crumbs = [{ name: 'Home', url: '/' }]
  let current = ''
  segments.forEach((segment, index) => {
    current += `/${segment}`
    const isLast = index === segments.length - 1
    const meta = ROUTE_MAP.get(current)
    if (meta) {
      crumbs.push({ name: meta.label, url: current })
    } else if (isLast) {
      crumbs.push({ name: humanizeSlug(segment), url: current })
    }
  })
  return crumbs
}

/** Sitemap metadata for a dynamic record. */
export function dynamicRouteMeta(type, record) {
  if (!record) return null
  if (type === 'package') {
    const duration = record.durationDays ? ` ${record.durationDays}D/${record.durationNights ?? Math.max(0, record.durationDays - 1)}N` : ''
    return P(
      `/packages/${record.slug || record.id}`,
      record.title,
      `${record.title}${duration} Tour Package | Maqlaim Tours`,
      truncate(record.shortDescription || record.description || `Book the ${record.title} tour package with Maqlaim Tours.`),
      0.8,
    )
  }
  if (type === 'destination') {
    return P(
      `/destinations/${record.slug || record.id}`,
      record.name,
      `${record.name} Travel Guide & Tour Packages | Maqlaim Tours`,
      truncate(record.shortDescription || record.description || `Explore ${record.name} with Maqlaim Tours.`),
      0.8,
    )
  }
  if (type === 'blog') {
    return P(
      `/blog/${record.slug || record.id}`,
      record.title,
      `${record.title} | Maqlaim Tours Travel Blog`,
      truncate(record.excerpt || record.description || `Read ${record.title} on the Maqlaim Tours travel blog.`),
      0.7,
    )
  }
  if (type === 'hotel') {
    return P(
      `/hotels/${record.slug || record.id}`,
      record.name,
      `${record.name}${record.city ? `, ${record.city}` : ''} | Maqlaim Tours`,
      truncate(record.description || `View ${record.name} with Maqlaim Tours.`),
      0.6,
    )
  }
  if (type === 'activity') {
    return P(
      `/activities/${record.slug || record.id}`,
      record.name,
      `${record.name}${record.location ? ` in ${record.location}` : ''} | Maqlaim Tours`,
      truncate(record.description || `Explore ${record.name} with Maqlaim Tours.`),
      0.6,
    )
  }
  return null
}
