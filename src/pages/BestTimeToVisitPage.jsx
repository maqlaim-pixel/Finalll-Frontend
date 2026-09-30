import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Backpack,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  CloudRain,
  Flower2,
  LoaderCircle,
  MapPin,
  Mountain,
  Plane,
  RefreshCw,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  Thermometer,
} from 'lucide-react'
import api from '../services/api'
import Breadcrumb from '../components/common/Breadcrumb'
import SEOHead from '../components/common/SEOHead'
import { resolveImageUrl } from '../utils/imageUtils'
import {
  getAllIndiaDestinations,
  isBeachDestination,
  isDestinationListResponse,
  isHeritageDestination,
  isHillStationDestination,
  isReligiousDestination,
  isWildlifeDestination,
} from '../utils/heritageDestinations'

const IMAGE = (photo, width = 900, height = 600) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&h=${height}&q=82`

const HERO_IMAGE = IMAGE('photo-1719952739528-e801d3904bfa', 2200, 850)
export const SEASONS = [
  {
    slug: 'spring', name: 'Spring', months: 'March – April', description: 'Pleasant weather, blooming flowers and ideal for sightseeing.',
    image: IMAGE('photo-1490750967868-88aa4486c946'), alt: 'Spring flowers beside a scenic mountain lake', icon: Flower2,
    tone: 'rose', temperature: '15°C – 30°C', highlights: 'Pleasant & vibrant',
    overview: 'Spring brings comfortable days and fresh landscapes across many parts of India. It is a good shoulder season for sightseeing before the warmer months arrive.',
    destinations: ['Shimla', 'Ooty', 'Kashmir', 'Rishikesh'],
    activities: ['Walk through flowering gardens and heritage districts', 'Enjoy easy day hikes and scenic viewpoints', 'Explore cities before peak summer crowds'],
    packing: ['Light layers for warm afternoons and cooler evenings', 'Comfortable walking shoes', 'Sun protection and a light rain layer'],
    tips: ['Check local bloom and festival dates before booking.', 'Mountain evenings can still be cool; bring a warm layer.'],
  },
  {
    slug: 'summer', name: 'Summer', months: 'May – June', description: 'Great for hill stations and beach destinations.',
    image: IMAGE('photo-1507525428034-b723cf961d3e'), alt: 'Sunny tropical beach with clear blue water', icon: Sun,
    tone: 'amber', temperature: '25°C – 40°C', highlights: 'Best for hills & beaches',
    overview: 'Summer is hot across much of the plains, while higher-altitude destinations offer cooler air. Coastal and island trips are best planned around local forecasts and heat conditions.',
    destinations: ['Shimla', 'Ooty', 'Andaman', 'Kashmir'],
    activities: ['Explore cooler hill towns and mountain scenery', 'Plan water activities during cooler parts of the day', 'Choose early starts for outdoor sightseeing'],
    packing: ['Breathable, sun-protective clothing', 'Hat, sunglasses and sunscreen', 'Reusable water bottle and comfortable shoes'],
    tips: ['Reserve popular hill-station stays early.', 'Avoid strenuous outdoor plans during peak afternoon heat.'],
  },
  {
    slug: 'monsoon', name: 'Monsoon', months: 'July – September', description: 'Lush greenery, fewer crowds and beautiful landscapes.',
    image: IMAGE('photo-1433086966358-54859d0ed716'), alt: 'Waterfall flowing through lush green mountains', icon: CloudRain,
    tone: 'sky', temperature: '20°C – 32°C', highlights: 'Green landscapes',
    overview: 'The monsoon transforms many landscapes with lush greenery and flowing waterfalls. Rainfall, road access and outdoor conditions vary greatly by region, so local advisories matter.',
    destinations: ['Kerala', 'Ooty', 'Rishikesh', 'Shimla'],
    activities: ['Enjoy scenic drives when roads are open and safe', 'Visit gardens, museums and indoor cultural attractions', 'Experience the region’s seasonal food and festivals'],
    packing: ['Waterproof outerwear and a compact umbrella', 'Quick-drying clothes and water-resistant bags', 'Shoes with reliable grip'],
    tips: ['Check weather and route advisories daily.', 'Avoid trekking or exposed routes whenever local conditions are unsafe.'],
  },
  {
    slug: 'winter', name: 'Winter', months: 'October – February', description: 'Best season for most destinations, perfect for family trips.',
    image: IMAGE('photo-1519681393784-d120267933ba'), alt: 'Snow-covered Himalayan peaks beneath a clear winter sky', icon: Snowflake,
    tone: 'cyan', temperature: '5°C – 25°C', highlights: 'Ideal for travel',
    overview: 'Winter is a comfortable time to explore many parts of India, from heritage cities to warm coastal regions. Snow and mountain access are destination-specific and can change quickly.',
    destinations: ['Jaipur', 'Kerala', 'Goa', 'Rajasthan', 'Rishikesh'],
    activities: ['Explore heritage landmarks in cooler weather', 'Plan coastal stays and outdoor sightseeing', 'Enjoy seasonal food, markets and local celebrations'],
    packing: ['Warm layers for northern and high-altitude areas', 'Comfortable daywear for warmer regions', 'Check mountain forecasts and carry weatherproof layers'],
    tips: ['Peak dates can sell out; compare transport and stays early.', 'Confirm snow access and road conditions with local authorities.'],
  },
]

const DESTINATION_CATEGORIES = [
  { id: 'all', label: 'All', matches: () => true },
  { id: 'hill-stations', label: 'Hill Stations', matches: isHillStationDestination },
  { id: 'beaches', label: 'Beaches', matches: isBeachDestination },
  { id: 'heritage', label: 'Heritage', matches: isHeritageDestination },
  { id: 'wildlife', label: 'Wildlife', matches: isWildlifeDestination },
  { id: 'spiritual', label: 'Spiritual', matches: isReligiousDestination },
  { id: 'adventure', label: 'Adventure', matches: isAdventureDestination },
]

const SEASONAL_MONTHS = {
  shimla: 'March – June; September – November',
  ooty: 'March – June; September – November',
  andaman: 'October – May',
  jaipur: 'October – March',
  kerala: 'September – March',
  rishikesh: 'September – April',
  'leh ladakh': 'May – September',
  'leh-ladakh': 'May – September',
  manali: 'October – March',
  goa: 'November – February',
  rajasthan: 'October – March',
  kashmir: 'March – October',
}

const POPULAR_NAMES = ['Leh Ladakh', 'Leh-Ladakh', 'Ladakh', 'Leh', 'Manali', 'Goa', 'Rajasthan', 'Kerala', 'Kashmir']
const QUICK_TIPS = [
  'Check weather conditions before planning your trip.',
  'Book accommodation early during peak season.',
  'Carry seasonal clothing and travel essentials.',
  'Avoid monsoon trekking and outdoor activities when local weather or route conditions make travel unsafe.',
  'Plan around local festivals for a unique experience.',
]
const EXPERT_TIPS = [
  'Check destination-specific weather and local advisories before booking.',
  'Peak travel seasons may bring higher hotel and transport prices.',
  'Mountain weather can change quickly; confirm access and road conditions.',
  'Wildlife parks can have seasonal closures or restricted safari schedules.',
  'Coastal areas may be affected by heavy monsoon weather.',
  'Verify local conditions with official or on-the-ground sources before travel.',
]
const WEATHER_ROWS = [
  { name: 'Spring', months: 'Mar – Apr', temperature: '15°C – 30°C', highlight: 'Pleasant & vibrant', icon: Flower2, color: 'text-pink-500' },
  { name: 'Summer', months: 'May – Jun', temperature: '25°C – 40°C', highlight: 'Best for hills & beaches', icon: Sun, color: 'text-amber-500' },
  { name: 'Monsoon', months: 'Jul – Sep', temperature: '20°C – 32°C', highlight: 'Green landscapes', icon: CloudRain, color: 'text-sky-600' },
  { name: 'Winter', months: 'Oct – Feb', temperature: '5°C – 25°C', highlight: 'Ideal for travel', icon: Snowflake, color: 'text-cyan-600' },
]

function isAdventureDestination(destination) {
  const metadataFields = [
    'category', 'destinationCategory', 'destinationType', 'type', 'subtype', 'subCategory',
    'theme', 'themes', 'tags', 'experienceType', 'adventureCategory', 'activityType',
    'experiences', 'destinationHighlights',
  ]
  const values = metadataFields.flatMap(field => metadataValues(destination?.[field]))
  const adventureSignal = /\b(?:adventure|trekking|trek|hiking|climbing|rafting|camping|paragliding|safari)\b/i
  return values.some(value => adventureSignal.test(value))
}

function metadataValues(value) {
  if (value == null) return []
  if (Array.isArray(value)) return value.flatMap(metadataValues)
  if (typeof value === 'object') {
    if (value.isActive === false) return []
    return ['category', 'type', 'subtype', 'subCategory', 'theme', 'themes', 'tags', 'experienceType', 'label', 'name']
      .flatMap(key => metadataValues(value[key]))
  }
  const text = String(value).trim()
  if (!text) return []
  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      return metadataValues(JSON.parse(text))
    } catch {
      return []
    }
  }
  return text.split(/[,|]/).map(item => item.trim()).filter(Boolean)
}

function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function destinationNameKey(destination) {
  return normalize(destination?.name || destination?.title)
}

function destinationMonths(destination) {
  if (typeof destination?.bestTime === 'string' && destination.bestTime.trim()) return destination.bestTime.trim()
  return SEASONAL_MONTHS[destinationNameKey(destination)] || 'Seasonal guide coming soon'
}

function destinationHref(destination) {
  return `/destinations/${encodeURIComponent(destination.slug || destination.id)}`
}

function packageMatchesDestination(pkg, destination) {
  const name = destinationNameKey(destination)
  if (!name) return false
  return [pkg?.destination, pkg?.state]
    .some(value => normalize(value) === name)
}

function getDestinationPackages(packages, destination) {
  return packages.filter(pkg => packageMatchesDestination(pkg, destination))
}

function findDestination(destinations, name) {
  const normalizedName = normalize(name)
  return destinations.find(destination => {
    const destinationName = destinationNameKey(destination)
    const destinationSlug = normalize(destination.slug)
    return destinationName === normalizedName || destinationSlug === normalizedName
  })
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function SectionTitle({ children, description, icon: Icon }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-2xl font-bold text-navy-950 sm:text-3xl">
        {Icon && <Icon size={23} className="mr-2 inline-block -translate-y-0.5 text-orange-600" aria-hidden="true" />}
        {children}
      </h2>
      <span className="mt-2 block h-1 w-11 rounded-full bg-orange-500" aria-hidden="true" />
      {description && <p className="mt-2 text-sm leading-relaxed text-navy-600">{description}</p>}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex min-h-56 items-center justify-center gap-3 text-navy-600" role="status" aria-live="polite">
      <LoaderCircle className="animate-spin text-sky-700" size={24} aria-hidden="true" />
      <span>Loading destination guides…</span>
    </div>
  )
}

function EmptyState({ title = 'Coming Soon', children, href = '/india/destinations' }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-9 text-center">
      <MapPin className="mx-auto text-sky-700" size={30} aria-hidden="true" />
      <h3 className="mt-3 font-display text-xl font-bold text-navy-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-navy-600">
        {children || 'We’re adding more travel guides for this category. Please check back soon.'}
      </p>
      <Link to={href} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-sky-700 px-4 py-2 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2">
        Explore All Destinations <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  )
}

function SeasonCard({ season }) {
  const [imageFailed, setImageFailed] = useState(false)
  const Icon = season.icon
  const tones = {
    rose: 'bg-pink-100 text-pink-600 ring-pink-50',
    amber: 'bg-amber-100 text-amber-600 ring-amber-50',
    sky: 'bg-sky-100 text-sky-600 ring-sky-50',
    cyan: 'bg-cyan-100 text-cyan-600 ring-cyan-50',
  }
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-32 shrink-0 sm:h-36">
        {imageFailed ? <div className="h-full w-full bg-gradient-to-br from-sky-100 to-emerald-100" aria-hidden="true" /> : <img src={season.image} alt={season.alt} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" aria-hidden="true" />
        <span className={`absolute bottom-0 right-4 flex h-11 w-11 translate-y-1/2 items-center justify-center rounded-full ring-4 ${tones[season.tone]}`}>
          <Icon size={22} aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 pt-5">
        <h3 className="font-display text-xl font-bold text-navy-950">{season.name}</h3>
        <p className="mt-0.5 text-xs font-semibold text-orange-700">{season.months}</p>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{season.description}</p>
        <Link to={`/travel-guide/best-time-to-visit/${season.slug}`} className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-orange-500 px-3 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          Explore Details <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

function DestinationGuideCard({ destination, packages }) {
  const [imageFailed, setImageFailed] = useState(false)
  const name = destination.name || 'Destination'
  const image = resolveImageUrl(destination.image)
  const matchedPackages = getDestinationPackages(packages, destination)
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={destinationHref(destination)} className="relative block h-28 overflow-hidden bg-sky-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500" aria-label={`Open ${name} destination guide`}>
        {image && !imageFailed ? (
          <img src={image} alt={name} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100 text-sky-700" aria-hidden="true"><Mountain size={32} /></div>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 font-display text-base font-bold text-white">{name}</span>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs leading-relaxed text-navy-600">{destinationMonths(destination)}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <Link to={destinationHref(destination)} className="inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-900 focus:outline-none focus:underline">
            View Guide <ArrowRight size={14} aria-hidden="true" />
          </Link>
          {matchedPackages.length > 0 && (
            <Link to={`/packages?destination=${encodeURIComponent(name)}`} className="text-xs font-semibold text-sky-800 underline decoration-sky-300 underline-offset-2 hover:text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-600">
              View Available Packages
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

function DestinationPhoto({ destination, featured }) {
  const [imageFailed, setImageFailed] = useState(false)
  const image = resolveImageUrl(destination.image)
  if (imageFailed) return null

  return (
    <Link to={destinationHref(destination)} className={`group relative block overflow-hidden rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 ${featured ? 'col-span-2 aspect-[2/1] sm:col-span-1 sm:aspect-[4/3]' : 'aspect-[4/3]'}`}>
      <img src={image} alt={destination.name || 'India destination'} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-8 font-semibold text-white">{destination.name}</span>
    </Link>
  )
}

function SidebarPanel({ children, className = '', id }) {
  return <section id={id} className={`scroll-mt-28 rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4 ${className}`}>{children}</section>
}

function BestTimeSidebar({ destinations, loading, error }) {
  const popularDestinations = POPULAR_NAMES
    .map(name => findDestination(destinations, name))
    .filter(Boolean)
    .filter((destination, index, all) => all.findIndex(item => item.id === destination.id) === index)
    .slice(0, 6)

  return (
    <aside className="min-w-0 space-y-4" aria-label="Travel planning information">
      <SidebarPanel>
        <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold leading-tight text-navy-950"><Mountain size={20} className="text-orange-600" aria-hidden="true" />Best Time by Popular Destinations</h2>
        {loading ? <p className="py-4 text-sm text-navy-500">Loading destinations…</p> : error ? <p className="py-3 text-sm text-navy-600">Popular guides are temporarily unavailable.</p> : popularDestinations.length ? (
          <ul className="divide-y divide-slate-100">
            {popularDestinations.map(destination => {
              const image = resolveImageUrl(destination.image)
              return (
                <li key={destination.id || destination.slug}>
                  <Link to={destinationHref(destination)} className="flex min-h-12 items-center gap-2 py-1.5 text-sm transition-colors hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600">
                    {image ? <img src={image} alt="" loading="lazy" onError={event => { event.currentTarget.style.display = 'none' }} className="h-8 w-12 shrink-0 rounded object-cover" /> : <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded bg-sky-50 text-sky-700"><Mountain size={16} aria-hidden="true" /></span>}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-navy-900">{destination.name}</span>
                      <span className="block truncate text-[11px] text-navy-500 sm:hidden">{destinationMonths(destination)}</span>
                    </span>
                    <span className="hidden shrink-0 text-xs text-navy-500 sm:block">{destinationMonths(destination)}</span>
                    <ChevronRight size={15} className="shrink-0 text-navy-600" aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : <EmptyState title="Popular Guides Coming Soon" />}
        {!loading && popularDestinations.length > 0 && popularDestinations.length < 6 && (
          <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-navy-500">
            Other popular destination guides are being prepared and will appear here when available.
          </p>
        )}
      </SidebarPanel>

      <SidebarPanel id="weather-information" className="overflow-hidden p-0">
        <h2 className="flex items-center gap-2 px-3 pb-2 pt-3 font-display text-lg font-bold text-navy-950 sm:px-4 sm:pt-4"><CloudRain size={20} className="text-sky-700" aria-hidden="true" />India Weather Overview</h2>
        <p className="px-3 pb-3 text-xs text-navy-500 sm:px-4">Broad India-level seasonal guidance; conditions vary by destination.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-left text-[11px] sm:text-xs">
            <thead className="bg-sky-50 text-navy-900">
              <tr><th className="px-2 py-2 font-bold sm:px-3">Season</th><th className="px-2 py-2 font-bold sm:px-3">Months</th><th className="px-2 py-2 font-bold sm:px-3">Avg. Temperature</th><th className="px-2 py-2 font-bold sm:px-3">Highlights</th></tr>
            </thead>
            <tbody>
              {WEATHER_ROWS.map(row => {
                const Icon = row.icon
                return <tr key={row.name} className="border-t border-slate-100"><th scope="row" className="whitespace-nowrap px-2 py-2 font-medium text-navy-800 sm:px-3"><Icon size={13} className={`mr-1 inline ${row.color}`} aria-hidden="true" />{row.name}</th><td className="whitespace-nowrap px-2 py-2 text-navy-600 sm:px-3">{row.months}</td><td className="whitespace-nowrap px-2 py-2 text-navy-600 sm:px-3">{row.temperature}</td><td className="px-2 py-2 text-navy-600 sm:px-3">{row.highlight}</td></tr>
              })}
            </tbody>
          </table>
        </div>
      </SidebarPanel>

      <SidebarPanel id="quick-travel-tips" className="bg-gradient-to-br from-emerald-50 to-white">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy-950"><Sparkles size={20} className="text-amber-500" aria-hidden="true" />Quick Travel Tips</h2>
        <ul className="space-y-2.5">
          {QUICK_TIPS.map(tip => <li key={tip} className="flex gap-2 text-sm leading-relaxed text-navy-700"><Check size={16} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" /><span>{tip}</span></li>)}
        </ul>
      </SidebarPanel>

    </aside>
  )
}

function SeasonDetail({ season, destinations, packages }) {
  const relatedDestinations = season.destinations.map(name => findDestination(destinations, name)).filter(Boolean)
  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead title={`${season.name} Travel Guide | Best Time to Visit India | TravelVista`} description={`${season.overview} Explore seasonal tips, destinations and travel advice for ${season.months}.`} />
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <img src={season.image} alt={season.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/15" aria-hidden="true" />
        <div className="container-wide relative py-10 sm:py-14">
          <Breadcrumb light items={[{ label: 'Travel Guide', href: '/guides/travel-tips' }, { label: 'Best Time to Visit', href: '/travel-guide/best-time-to-visit' }, { label: season.name }]} />
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">Seasonal guide · {season.months}</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{season.name} in India</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">{season.overview}</p>
        </div>
      </section>
      <main className="container-wide grid min-w-0 gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-10">
        <div className="min-w-0 space-y-8">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="font-display text-2xl font-bold text-navy-950">Season overview</h2>
            <p className="mt-3 leading-relaxed text-navy-700">{season.overview}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-sky-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-sky-800">Months</p><p className="mt-1 font-semibold text-navy-900">{season.months}</p></div>
              <div className="rounded-lg bg-orange-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-orange-800">Broad temperature guide</p><p className="mt-1 font-semibold text-navy-900">{season.temperature}; varies by region</p></div>
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 p-5 sm:p-7">
            <h2 className="font-display text-2xl font-bold text-navy-950">Recommended activities</h2>
            <ul className="mt-4 space-y-3">{season.activities.map(item => <li key={item} className="flex gap-2 text-navy-700"><Check size={17} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{item}</li>)}</ul>
          </section>
          <section className="rounded-xl border border-slate-200 p-5 sm:p-7">
            <h2 className="font-display text-2xl font-bold text-navy-950">Packing advice</h2>
            <ul className="mt-4 space-y-3">{season.packing.map(item => <li key={item} className="flex gap-2 text-navy-700"><Backpack size={17} className="mt-0.5 shrink-0 text-sky-700" aria-hidden="true" />{item}</li>)}</ul>
          </section>
          <section className="rounded-xl border border-slate-200 p-5 sm:p-7">
            <h2 className="font-display text-2xl font-bold text-navy-950">Travel tips</h2>
            <ul className="mt-4 space-y-3">{season.tips.map(item => <li key={item} className="flex gap-2 text-navy-700"><Check size={17} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{item}</li>)}</ul>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-navy-950">Best destinations this season</h2>
            {relatedDestinations.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2">{relatedDestinations.map(destination => <DestinationGuideCard key={destination.id || destination.slug} destination={destination} packages={packages} />)}</div> : <div className="mt-4"><EmptyState title="Seasonal Destination Guides Coming Soon" /></div>}
          </section>
        </div>
        <BestTimeSidebar destinations={destinations} loading={false} error="" />
      </main>
    </div>
  )
}

export default function BestTimeToVisitPage() {
  const { season: seasonSlug } = useParams()
  const season = SEASONS.find(item => item.slug === seasonSlug)
  const [destinations, setDestinations] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeNav, setActiveNav] = useState('overview')

  const loadDestinations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/destinations?status=published')
      if (!isDestinationListResponse(response.data)) throw new TypeError('Unexpected destination response')
      setDestinations(getAllIndiaDestinations(response.data))
    } catch {
      setDestinations([])
      setError('Unable to load destination guides right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDestinations()
  }, [loadDestinations])

  useEffect(() => {
    let mounted = true
    api.get('/packages?status=published')
      .then(response => {
        if (mounted) setPackages(Array.isArray(response.data) ? response.data : [])
      })
      .catch(() => {
        if (mounted) setPackages([])
      })
    return () => { mounted = false }
  }, [])

  const category = DESTINATION_CATEGORIES.find(item => item.id === selectedCategory) || DESTINATION_CATEGORIES[0]
  const filteredDestinations = useMemo(() => destinations.filter(category.matches), [destinations, category])

  if (seasonSlug && !season) {
    return <div className="container-wide py-16"><h1 className="font-display text-3xl font-bold text-navy-900">Season guide not found</h1><Link to="/travel-guide/best-time-to-visit" className="mt-4 inline-flex items-center gap-2 text-sky-800 hover:underline">Back to Best Time to Visit <ArrowRight size={16} /></Link></div>
  }
  if (season) return <SeasonDetail season={season} destinations={destinations} packages={packages} />

  const pageNavigation = [
    { id: 'overview', label: 'Overview', icon: CalendarDays, target: 'overview' },
    { id: 'seasonal-guide', label: 'Seasonal Guide', icon: Mountain, target: 'seasonal-guide' },
    { id: 'weather', label: 'Weather Information', icon: Thermometer, target: 'weather-information' },
    { id: 'destinations', label: 'Best Time by Destination', icon: MapPin, target: 'destination-guide' },
    { id: 'tips', label: 'Travel Tips', icon: Backpack, target: 'quick-travel-tips' },
    { id: 'photos', label: 'Photos', icon: Camera, target: 'destination-photos' },
    { id: 'expert-advice', label: 'Expert Advice', icon: Star, target: 'expert-advice' },
  ]

  const navigatePageSection = item => {
    setActiveNav(item.id)
    scrollToSection(item.target)
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-navy-900">
      <SEOHead
        title="Best Time to Visit India | Seasonal Travel Guide | TravelVista"
        description="Discover the best time to visit destinations across India with seasonal travel guides, weather information, destination tips and TravelVista travel recommendations."
        keywords="best time to visit India, India seasons, seasonal travel guide, India weather, destination guide"
      />

      <section className="relative isolate min-h-[300px] overflow-hidden bg-navy-950 text-white sm:min-h-[340px] lg:min-h-[370px]">
        <img src={HERO_IMAGE} alt="A traveler overlooking a mountain valley and lake at sunrise" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/15" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-black/10" aria-hidden="true" />
        <div className="container-wide relative grid min-h-[300px] items-center gap-5 py-7 sm:min-h-[340px] sm:py-9 lg:min-h-[370px] lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="max-w-3xl">
            <Breadcrumb light items={[{ label: 'Travel Guide', href: '/guides/travel-tips' }, { label: 'Best Time to Visit' }]} />
            <h1 className="font-display text-4xl font-bold leading-[1.04] drop-shadow sm:text-5xl md:text-6xl">
              <span className="text-white">Best Time to </span><span className="text-amber-400">Visit</span>
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/95 sm:text-base md:text-lg">
              Discover the ideal time to plan your trip with complete seasonal guides, weather information and expert travel tips for destinations across India and around the world.
            </p>
          </div>
          <div className="relative hidden min-h-44 items-center justify-center lg:flex" aria-hidden="true">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 260 180" fill="none">
              <path d="M18 153C71 143 73 99 121 105C162 110 172 53 224 48" stroke="white" strokeWidth="2" strokeDasharray="5 7" opacity=".8" />
            </svg>
            <div className="relative z-10 -rotate-6 text-right font-serif text-3xl font-semibold italic leading-tight text-white drop-shadow-lg xl:text-4xl">Plan<br />your perfect<br /><span className="text-amber-300">season</span></div>
            <Plane className="absolute bottom-6 right-1 h-8 w-8 rotate-12 text-white" />
            <span className="absolute left-5 top-8 h-2 w-2 rounded-full bg-amber-300" />
          </div>
        </div>
      </section>

      <nav className="border-b border-orange-100 bg-[#fffaf4] shadow-sm" aria-label="Best Time to Visit page sections">
        <div className="container-wide flex gap-2 overflow-x-auto py-2 [scrollbar-width:thin]">
          {pageNavigation.map(item => {
            const Icon = item.icon
            return <button key={item.id} type="button" onClick={() => navigatePageSection(item)} aria-current={activeNav === item.id ? 'location' : undefined} className={`flex min-h-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-4 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 sm:min-w-36 sm:text-sm ${activeNav === item.id ? 'bg-orange-100 text-navy-950' : 'text-navy-800 hover:bg-orange-50'}`}><Icon size={21} className={activeNav === item.id ? 'text-orange-800' : 'text-orange-800'} aria-hidden="true" />{item.label}</button>
          })}
        </div>
      </nav>

      <main id="overview" className="container-wide grid min-w-0 gap-5 py-5 sm:gap-7 sm:py-7 lg:grid-cols-[minmax(0,2.15fr)_minmax(290px,0.9fr)] lg:gap-6">
        <div className="min-w-0 space-y-7 sm:space-y-9">
          <section id="seasonal-guide" className="scroll-mt-40">
            <SectionTitle description="India offers unique experiences in every season. Choose the best time based on your travel preferences and destination." icon={Mountain}>Explore by Season</SectionTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
              {SEASONS.map(item => <SeasonCard key={item.slug} season={item} />)}
            </div>
          </section>

          <section id="destination-guide" className="scroll-mt-40">
            <SectionTitle description="Check the best time to visit popular destinations in India." icon={MapPin}>Destination-Wise Guide</SectionTitle>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" role="group" aria-label="Filter destination guides">
              {DESTINATION_CATEGORIES.map(item => <button key={item.id} type="button" onClick={() => setSelectedCategory(item.id)} aria-pressed={selectedCategory === item.id} className={`min-h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${selectedCategory === item.id ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 text-navy-800 hover:bg-orange-50 hover:text-orange-800'}`}>{item.label}</button>)}
            </div>
            {loading ? <LoadingState /> : error ? <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center" role="alert"><AlertCircle className="mx-auto text-red-600" size={25} aria-hidden="true" /><p className="mt-2 text-sm text-red-800">{error}</p><button type="button" onClick={loadDestinations} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-300 px-4 text-sm font-semibold text-red-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"><RefreshCw size={15} aria-hidden="true" />Try again</button></div> : filteredDestinations.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3">{filteredDestinations.map(destination => <DestinationGuideCard key={destination.id || destination.slug} destination={destination} packages={packages} />)}</div> : <EmptyState title={selectedCategory === 'all' ? 'Destination Guides Coming Soon' : `${category.label} Guides Coming Soon`} />}
          </section>

          <section id="destination-photos" className="scroll-mt-40">
            <SectionTitle description="A glimpse of the destinations in our current India guide collection." icon={Camera}>Destination Photos</SectionTitle>
            {loading ? <LoadingState /> : destinations.filter(destination => resolveImageUrl(destination.image)).length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {destinations.filter(destination => resolveImageUrl(destination.image)).slice(0, 6).map((destination, index) => (
                  <DestinationPhoto key={destination.id || destination.slug} destination={destination} featured={index === 0} />
                ))}
              </div>
            ) : <EmptyState title="Destination Photos Coming Soon" />}
          </section>

          <section id="expert-advice" className="scroll-mt-40 rounded-xl border border-orange-100 bg-orange-50/70 p-5 sm:p-7">
            <SectionTitle description="A few practical checks help make a seasonal trip safer and more enjoyable." icon={Star}>Expert Travel Advice</SectionTitle>
            <ul className="grid gap-3 sm:grid-cols-2">{EXPERT_TIPS.map(tip => <li key={tip} className="flex gap-2 text-sm leading-relaxed text-navy-700"><Check size={17} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{tip}</li>)}</ul>
          </section>
        </div>

        <BestTimeSidebar destinations={destinations} loading={loading} error={error} />
      </main>

    </div>
  )
}
