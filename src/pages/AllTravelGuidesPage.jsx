import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { isDestinationListResponse } from '../utils/heritageDestinations'
import { resolveImageUrl } from '../utils/imageUtils'
import {
  ArrowRight, Backpack, CalendarDays, ChevronRight, CircleHelp,
  Coins, Compass, Grid2X2, Headphones, Lightbulb, MapPin,
  Search, Stamp, Sun, X,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import SEOHead from '../components/common/SEOHead'
import { ARTICLES as TRAVEL_TIP_ARTICLES } from './TravelTipsPage'
import { PACKING_GUIDES } from './PackingGuidesPage'
import { SEASONS } from './BestTimeToVisitPage'
import { DAILY_BREAKDOWN, MONEY_TIPS } from './TravelCostPage'
import { VISA_TYPES } from './VisaInformationPage'
import { GIR_DESTINATION } from './india/HowToReachPage'

const image = (photo, width = 920, height = 580) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&h=${height}&q=82`

const GUIDE_CATEGORIES = [
  { id: 'travel-tips', title: 'Travel Tips', path: '/guides/travel-tips', icon: Lightbulb, tone: 'amber', image: image('photo-1719952739528-e801d3904bfa'), alt: 'Traveler with backpack enjoying a scenic destination', description: 'Expert tips to make your travel easier, safer and more enjoyable.' },
  { id: 'how-to-reach', title: 'How to Reach', path: '/guides/how-to-reach', icon: MapPin, tone: 'sky', image: image('photo-1500530855697-b586d89ba3ee'), alt: 'Winding road through a green mountain valley', description: 'Complete guidance on how to reach popular destinations by air, train, road and more.' },
  { id: 'itineraries', title: 'Itineraries', path: '/packages', icon: CalendarDays, tone: 'red', image: image('photo-1455390582262-044cdead277a'), alt: 'Travel planning notebook and route notes', description: 'Ready-to-follow itineraries for different destinations and travel styles.' },
  { id: 'packing-guides', title: 'Packing Guides', path: '/travel-guide/packing-guides', icon: Backpack, tone: 'green', image: image('photo-1553062407-98eeb64c6a62'), alt: 'Open travel backpack packed with essentials', description: 'Essential packing checklists and tips for hassle-free travel.' },
  { id: 'best-time-to-visit', title: 'Best Time to Visit', path: '/travel-guide/best-time-to-visit', icon: Sun, tone: 'amber', image: image('photo-1501785888041-af3ef285b470'), alt: 'Mountain lake and valley in clear seasonal light', description: 'Find the ideal time to plan your trip based on weather, festivals and local experiences.' },
  { id: 'travel-cost', title: 'Travel Cost', path: '/travel-guide/travel-cost', icon: Coins, tone: 'red', image: image('photo-1444653614773-995cb1ef9efa'), alt: 'Travel budgeting with a map and notebook', description: 'Detailed cost information on accommodation, food, transport and activities.' },
  { id: 'visa-information', title: 'Visa Information', path: '/travel-guide/visa-information', icon: Stamp, tone: 'blue', image: image('photo-1655722724447-2d2a3071e7f8'), alt: 'Passport and travel documents arranged for an international trip', description: 'Visa requirements, application process, documents and fee guidance for international travel.' },
  { id: 'all-guides', title: 'All Guides', path: '/travel-guide/all-guides', icon: Grid2X2, tone: 'green', image: image('photo-1524666041070-9a8762d75c4d'), alt: 'Map and compass for planning a journey', description: 'Browse all available travel guides in one place and plan your perfect trip.' },
]

const ICON_TONES = {
  amber: 'bg-amber-100 text-amber-700', sky: 'bg-sky-100 text-sky-700',
  red: 'bg-rose-100 text-rose-700', green: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
}
const ICON_BAR_TONES = {
  amber: 'text-amber-700', sky: 'text-rose-700', red: 'text-orange-800',
  green: 'text-emerald-700', blue: 'text-violet-700',
}
const QUICK_LINK_TONE = {
  'Travel Tips': 'text-amber-600', 'How to Reach': 'text-rose-600', Itineraries: 'text-orange-700',
  'Packing Guides': 'text-blue-600', 'Best Time to Visit': 'text-amber-600',
  'Travel Cost': 'text-orange-700', 'Visa Information': 'text-violet-700', 'All Guides': 'text-orange-500',
}
// Search records currently exposed by the Travel Tips and Packing Guides pages,
// the explicit Gir travel-direction guide, and itinerary data from packages.
const EXISTING_ENTRIES = [
  ...TRAVEL_TIP_ARTICLES.map(article => ({
    id: `tip-${article.id}`, title: article.title, category: 'Travel Tips', featured: article.featured,
    description: article.description, image: article.image, alt: article.alt,
    path: '/guides/travel-tips', date: article.publishedAt || article.createdAt || '',
    searchText: `${article.title} ${article.category} ${article.description} ${article.content?.join(' ') || ''}`,
  })),
  ...PACKING_GUIDES.map(guide => ({
    id: `packing-${guide.slug}`, title: guide.title, category: 'Packing Guides', featured: false,
    description: guide.description, image: guide.image, alt: guide.alt,
    path: `/travel-guide/packing-guides/${guide.slug}`, date: guide.publishedAt || guide.createdAt || '',
    searchText: `${guide.title} ${guide.description} ${guide.categories?.join(' ') || ''} ${guide.introduction || ''}`,
  })),
  { id: 'reach-gir', title: `How to Reach ${GIR_DESTINATION.name}`, category: 'How to Reach', description: GIR_DESTINATION.introduction, image: GIR_DESTINATION.transport.find(option => option.id === 'road')?.image, alt: 'Scenic road through a green landscape', path: '/india/national-parks/gir-national-park/how-to-reach', date: '', featured: false, searchText: `Gir National Park Gujarat air train road directions transport Junagadh Diu ${GIR_DESTINATION.summary} ${GIR_DESTINATION.cities.map(city => city.name).join(' ')}` },
]

function parseItinerary(value) {
  if (Array.isArray(value)) return value.filter(day => day && typeof day === 'object')
  if (typeof value !== 'string' || !value.trim()) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter(day => day && typeof day === 'object') : []
  } catch {
    return []
  }
}

function buildFixedGuideEntries() {
  const bestTime = SEASONS.map(season => ({
    id: `season-${season.slug}`, title: `${season.name} Travel Guide`, category: 'Best Time to Visit',
    description: `${season.months}: ${season.description}`, image: season.image, alt: season.alt,
    path: `/travel-guide/best-time-to-visit/${season.slug}`, date: '', featured: false,
    searchText: `${season.name} ${season.months} ${season.description} ${season.overview} ${season.destinations?.join(' ') || ''} ${season.activities?.join(' ') || ''}`,
  }))
  const travelCost = [{
    id: 'india-travel-cost-guide', title: 'India Travel Cost Guide', category: 'Travel Cost',
    description: 'The existing Travel Cost guide includes a general India daily-cost reference for accommodation, food, transport and activities, plus practical money-saving tips.',
    image: image('photo-1444653614773-995cb1ef9efa'), alt: 'Travel budget and expense planning',
    path: '/travel-guide/travel-cost', date: '', featured: false,
    searchText: `India travel cost budget ${DAILY_BREAKDOWN.map(item => `${item.expense} ${item.values.join(' ')}`).join(' ')} ${MONEY_TIPS.join(' ')}`,
  }]
  const visa = [{
    id: 'visa-information-guide', title: 'Visa Information & Application Guide', category: 'Visa Information',
    description: 'The existing visa guide covers visa categories, general application steps and a document-preparation checklist. Verify current requirements with official authorities.',
    image: image('photo-1655722724447-2d2a3071e7f8'), alt: 'Passport and visa travel documents',
    path: '/travel-guide/visa-information', date: '', featured: false,
    searchText: `visa information passport requirements application documents fees ${VISA_TYPES.map(type => `${type.title} ${type.text}`).join(' ')}`,
  }]
  return [...bestTime, ...travelCost, ...visa]
}

function normalizeGuideValue(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function buildDestinationGuideEntries(destinations, packages) {
  return destinations.flatMap(destination => {
    const name = destination.name || destination.title
    const slug = destination.slug || destination.id
    if (!name || !slug) return []
    const cover = resolveImageUrl(destination.image || destination.coverImage) || image('photo-1501785888041-af3ef285b470')
    const summary = destination.shortDescription || destination.description || ''
    const searchText = `${name} ${destination.state || ''} ${destination.country || ''} ${destination.tagline || ''} ${summary} ${destination.bestTime || ''} ${destination.howToReach ? Object.values(destination.howToReach).join(' ') : ''}`
    const records = []
    if (typeof destination.bestTime === 'string' && destination.bestTime.trim()) {
      records.push({ id: `best-time-${slug}`, title: `Best Time to Visit ${name}`, category: 'Best Time to Visit', description: destination.bestTime.trim(), image: cover, alt: `${name} destination`, path: `/travel-guide/best-time-to-visit`, date: '', featured: false, searchText })
    }
    const costPackages = packages.filter(pkg => {
      const matchesDestination = [pkg.destination, pkg.state].some(value => normalizeGuideValue(value) === normalizeGuideValue(name))
      const price = Number(pkg.startingPrice)
      const days = Number(pkg.durationDays)
      return matchesDestination && Number.isFinite(price) && price > 0 && Number.isFinite(days) && days > 0
    })
    if (costPackages.length) {
      records.push({
        id: `cost-${slug}`, title: `${name} Travel Cost Guide`, category: 'Travel Cost',
        description: `Published TravelVista package pricing and trip durations are available for ${name}; see the existing destination cost guide for an indicative estimate.`,
        image: cover, alt: `${name} destination`, path: `/travel-guide/travel-cost/${encodeURIComponent(slug)}`,
        date: '', featured: false,
        searchText: `${searchText} travel cost budget ${costPackages.map(pkg => `${pkg.title || ''} ${pkg.destination || ''} ${pkg.startingPrice} ${pkg.currency || 'INR'} ${pkg.durationDays} days`).join(' ')}`,
      })
    }
    return records
  })
}

function GuideImage({ src, alt }) {
  const [failed, setFailed] = useState(false)
  return failed || !src
    ? <div className="flex h-full min-h-0 items-center justify-center bg-gradient-to-br from-sky-100 to-amber-50 text-sky-700" aria-hidden="true"><Compass size={34} /></div>
    : <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
}

function getCategoryCountLabel(category, count) {
  const labels = {
    'travel-tips': ['travel tip', 'travel tips'],
    'how-to-reach': ['destination guide', 'destination guides'],
    itineraries: ['itinerary', 'itineraries'],
    'packing-guides': ['packing guide', 'packing guides'],
    'best-time-to-visit': ['seasonal guide', 'seasonal guides'],
    'travel-cost': ['budget resource', 'budget resources'],
    'visa-information': ['visa guide', 'visa guides'],
    'all-guides': ['available guide', 'available guides'],
  }
  return labels[category.id]?.[count === 1 ? 0 : 1] || 'guides'
}

function CategoryCard({ category, count }) {
  const Icon = category.icon
  return <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <Link to={category.path} aria-label={`Browse ${category.title}`} className="relative block h-32 overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:h-28">
      <GuideImage src={category.image} alt={category.alt} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" aria-hidden="true" />
    </Link>
    <div className="relative flex flex-1 flex-col px-3.5 pb-3 pt-5 sm:px-3.5">
      <span className={`absolute -top-4 left-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-sm ${ICON_TONES[category.tone]}`}><Icon size={20} aria-hidden="true" /></span>
      <h3 className="font-display text-lg font-bold leading-snug text-navy-950">{category.title}</h3>
      {count > 0 && <p className="mt-0.5 text-xs font-medium text-sky-800">{count} {getCategoryCountLabel(category, count)}</p>}
      <p className="mt-1.5 flex-1 text-sm leading-snug text-navy-700">{category.description}</p>
      <Link to={category.path} className="mt-3 inline-flex min-h-9 w-fit items-center justify-center gap-2 rounded-full border border-orange-500 px-4 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Read Guide <ArrowRight size={15} aria-hidden="true" /></Link>
    </div>
  </article>
}

function GuideEntryCard({ entry }) {
  return <article className="group flex min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
    <Link to={entry.path} aria-label={`Read ${entry.title}`} className="h-24 w-28 shrink-0 overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:h-28 sm:w-36"><GuideImage src={entry.image} alt={entry.alt} /></Link>
    <div className="flex min-w-0 flex-1 flex-col p-3">
      <span className="w-fit rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-800">{entry.category}</span>
      <Link to={entry.path} className="mt-1 line-clamp-2 font-display text-sm font-bold leading-snug text-navy-900 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500">{entry.title}</Link>
      <p className="mt-1 line-clamp-2 text-xs text-navy-600">{entry.description}</p>
    </div>
  </article>
}

function Sidebar({ availableGuides, contentLoading }) {
  const quickLinks = GUIDE_CATEGORIES
  return <aside className="min-w-0 space-y-3" aria-label="Travel guide resources">
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="popular-guides-title">
      <div className="flex items-center justify-between gap-2 bg-sky-50 px-3 py-2.5"><h2 id="popular-guides-title" className="flex items-center gap-2 font-display text-lg font-bold text-navy-950"><Compass size={21} className="text-sky-600" />Guides to Explore</h2><Link to="/travel-guide/all-guides" className="shrink-0 text-xs font-semibold text-sky-800 hover:underline">View All <ArrowRight size={13} className="inline" /></Link></div>
      <ul className="divide-y divide-slate-100 px-3">{availableGuides.length ? availableGuides.map(entry => <li key={entry.id}><Link to={entry.path} className="flex min-h-11 items-center gap-2 py-1.5 text-xs font-medium text-navy-800 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500"><span className="h-8 w-10 shrink-0 overflow-hidden rounded bg-slate-100"><GuideImage src={entry.image} alt="" /></span><span className="min-w-0 flex-1 line-clamp-2">{entry.title}</span><ChevronRight size={15} className="shrink-0 text-sky-800" aria-hidden="true" /></Link></li>) : <li className="py-3 text-xs text-navy-500">{contentLoading ? 'Loading available guides…' : 'Browse the guide categories below.'}</li>}</ul>
    </section>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="quick-links-title">
      <h2 id="quick-links-title" className="flex items-center gap-2 bg-emerald-50 px-3 py-2.5 font-display text-lg font-bold text-navy-950"><Grid2X2 size={20} className="text-emerald-700" />Quick Links</h2>
      <ul className="grid grid-cols-2 gap-x-2 px-3 py-2">{quickLinks.map(category => { const Icon = category.icon; return <li key={category.id}><Link to={category.path} className="flex min-h-10 items-center gap-1.5 border-b border-slate-100 py-1.5 text-xs font-medium text-navy-800 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500"><Icon size={16} className={`shrink-0 ${QUICK_LINK_TONE[category.title] || 'text-sky-700'}`} aria-hidden="true" /><span className="min-w-0 leading-tight">{category.title}</span></Link></li> })}</ul>
    </section>
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4" aria-labelledby="planning-help-title">
      <h2 id="planning-help-title" className="flex items-center gap-2 font-display text-lg font-bold text-navy-950"><Headphones size={23} className="text-orange-600" />Need Help Planning?</h2>
      <p className="mt-1 text-sm leading-snug text-navy-800">Our travel experts are here to help you plan your perfect trip.</p>
      <Link to="/contact" className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 text-sm font-bold text-white transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2">Contact Our Experts <ArrowRight size={15} /></Link>
    </section>
  </aside>
}

export default function AllTravelGuidesPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [packages, setPackages] = useState([])
  const [destinations, setDestinations] = useState([])
  const [contentLoading, setContentLoading] = useState(true)
  const [contentError, setContentError] = useState(false)
  const [retried, setRetried] = useState(false)
  const query = search.trim().toLowerCase()

  const loadGuideContent = useCallback(async () => {
    setRetried(true)
    setContentLoading(true)
    setContentError(false)
    const [packageResult, destinationResult] = await Promise.allSettled([
      api.get('/packages?status=published'),
      api.get('/destinations?status=published'),
    ])
    let failed = false
    if (packageResult.status === 'fulfilled' && Array.isArray(packageResult.value.data)) {
      setPackages(packageResult.value.data.filter(pkg => pkg && typeof pkg === 'object' && String(pkg.status || 'published').toLowerCase() === 'published'))
    } else {
      setPackages([])
      failed = true
    }
    if (destinationResult.status === 'fulfilled' && isDestinationListResponse(destinationResult.value.data)) {
      setDestinations(destinationResult.value.data.filter(destination => destination.status.toLowerCase() === 'published'))
    } else {
      setDestinations([])
      failed = true
    }
    setContentError(failed)
    setContentLoading(false)
  }, [])

  useEffect(() => { loadGuideContent() }, [loadGuideContent])

  const itineraryEntries = useMemo(() => packages.flatMap(pkg => {
    const itinerary = parseItinerary(pkg.itinerary)
    if (!itinerary.length) return []
    const title = pkg.title || pkg.destination || 'Travel package itinerary'
    const destination = pkg.destination || pkg.state || ''
    const id = pkg.id || pkg.slug || `${title}-${destination}`
    const imageUrl = resolveImageUrl(pkg.coverImage || pkg.image)
    return [{
      id: `itinerary-${id}`, title: `${title} Itinerary`, category: 'Itineraries', featured: Boolean(pkg.featured),
      description: `${itinerary.length}-day itinerary${destination ? ` for ${destination}` : ''} from a published TravelVista package.`,
      image: imageUrl, alt: `${title} travel package`, path: pkg.slug ? `/packages/${encodeURIComponent(pkg.slug)}` : `/packages?destination=${encodeURIComponent(destination)}`,
      date: pkg.publishedAt || pkg.createdAt || '', searchText: `${title} ${destination} ${pkg.state || ''} ${pkg.shortDescription || ''} ${pkg.description || ''} ${itinerary.map(day => `${day.title || ''} ${day.desc || ''}`).join(' ')}`,
    }]
  }), [packages])

  const fixedEntries = useMemo(() => buildFixedGuideEntries(), [])
  const fixedDestinationEntries = useMemo(() => buildDestinationGuideEntries(destinations, packages), [destinations, packages])
  const availableEntries = useMemo(() => {
    const entries = [...EXISTING_ENTRIES, ...fixedEntries, ...itineraryEntries, ...fixedDestinationEntries]
    if (sort === 'az') entries.sort((a, b) => a.title.localeCompare(b.title))
    else if (sort === 'newest') entries.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0) || a.title.localeCompare(b.title))
    else entries.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.title.localeCompare(b.title))
    return entries
  }, [fixedDestinationEntries, fixedEntries, itineraryEntries, sort])
  const categoryRecords = useMemo(() => {
    const records = { 'All Guides': availableEntries.length }
    for (const entry of availableEntries) records[entry.category] = (records[entry.category] || 0) + 1
    return records
  }, [availableEntries])
  const matchingCategories = useMemo(() => GUIDE_CATEGORIES.filter(category => {
    const content = availableEntries.filter(entry => entry.category === category.title)
    const categoryMatch = `${category.title} ${category.description}`.toLowerCase().includes(query)
    return !query || categoryMatch || content.some(entry => entry.searchText.toLowerCase().includes(query))
  }), [availableEntries, query])
  const matchingEntries = useMemo(() => query ? availableEntries.filter(entry => `${entry.searchText} ${entry.category}`.toLowerCase().includes(query)) : [], [availableEntries, query])
  const searchHasResults = matchingEntries.length > 0 || matchingCategories.some(category => category.id !== 'all-guides')
  const displayedEntries = query ? matchingEntries : availableEntries
  const supportsNewest = availableEntries.some(entry => Boolean(entry.date) && Number.isFinite(Date.parse(entry.date)))
  const availableGuides = useMemo(() => GUIDE_CATEGORIES
    .filter(category => category.id !== 'all-guides')
    .map(category => availableEntries.find(entry => entry.category === category.title))
    .filter(Boolean)
    .slice(0, 7), [availableEntries])
  const noResults = Boolean(query) && !searchHasResults

  const clearSearch = () => setSearch('')

  return <div className="min-w-0 overflow-x-hidden bg-white text-navy-900">
    <SEOHead title="All Travel Guides | Travel Tips & Planning Resources | TravelVista" description="Explore TravelVista travel guides including travel tips, itineraries, packing guides, destination information, travel costs, visa guidance and more." />
    <section className="relative isolate min-h-[205px] overflow-hidden bg-navy-950 text-white sm:min-h-[215px] lg:min-h-[220px]" aria-labelledby="all-guides-title">
      <img src={image('photo-1719952739528-e801d3904bfa', 2200, 850)} alt="A backpacker overlooking a mountain valley and lake at sunrise" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[58%_52%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/76 to-navy-950/10" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[205px] max-w-[1600px] items-center px-4 py-4 sm:min-h-[215px] sm:px-6 lg:min-h-[220px] lg:px-10">
        <div className="max-w-4xl"><Breadcrumb light items={[{ label: 'Travel Guide' }, { label: 'All Travel Guides' }]} /><h1 id="all-guides-title" className="font-display text-4xl font-bold leading-tight drop-shadow sm:text-5xl md:text-6xl"><span className="text-white">All Travel </span><span className="text-gold-400">Guides</span></h1><p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/95 sm:text-base md:text-lg">Your complete resource for smarter travel. Explore expert travel tips, destination information, itineraries, packing guides, travel costs, visa details and more.</p></div>
        <div className="pointer-events-none absolute bottom-5 right-8 hidden text-right text-white drop-shadow-lg lg:block xl:right-14" aria-hidden="true"><p className="-rotate-6 font-display text-2xl font-bold italic leading-tight xl:text-3xl">Plan<br />Learn<br />Travel Better</p><svg className="ml-auto mt-1 h-12 w-44" viewBox="0 0 176 48" fill="none"><path d="M4 38C49 5 119 8 158 26" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" /><path d="M151 16l17 9-14 11 3-9-6-11z" fill="currentColor" /></svg></div>
      </div>
    </section>

    <nav className="border-b border-orange-100 bg-[#fcfaf6]" aria-label="Travel guide categories"><div className="mx-auto max-w-[1600px] overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:thin] sm:px-6 lg:px-8"><ul className="flex min-w-max items-stretch lg:min-w-0 lg:justify-between">{GUIDE_CATEGORIES.map(category => { const Icon = category.icon; return <li key={category.id} className="flex shrink-0 border-r border-orange-200 last:border-0 lg:flex-1"><Link to={category.path} aria-current={category.id === 'all-guides' ? 'page' : undefined} className="flex min-h-[76px] min-w-[110px] flex-1 flex-col items-center justify-center gap-1.5 px-1.5 py-2 text-center text-navy-900 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 lg:min-w-0"><Icon size={24} className={`${ICON_BAR_TONES[category.tone]} fill-current/10`} strokeWidth={2} aria-hidden="true" /><span className="whitespace-nowrap text-xs font-semibold">{category.title === 'All Guides' ? 'All Guides' : category.title}</span></Link></li> })}</ul></div></nav>

    <main className="mx-auto grid w-full max-w-[1600px] items-start gap-5 px-4 py-5 sm:px-6 sm:py-7 lg:grid-cols-[minmax(0,3fr)_minmax(290px,0.92fr)] lg:gap-6 lg:px-8">
      <section className="min-w-0" aria-labelledby="explore-guides-heading">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div><h2 id="explore-guides-heading" className="font-display text-2xl font-bold leading-tight text-navy-950 sm:text-3xl">Explore Our Travel Guides</h2><span className="mt-2 block h-1 w-11 rounded-full bg-orange-500" aria-hidden="true" /><p className="mt-2 text-sm text-navy-700 sm:text-base">Discover helpful guides and resources to plan your next trip with confidence.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="relative min-w-0 sm:w-60"><span className="sr-only">Search travel guides</span><Search size={16} className="absolute left-3 top-3 text-slate-500" aria-hidden="true" /><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search travel guides..." className="min-h-10 w-full rounded-lg border border-slate-200 py-2 pl-9 pr-9 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />{search && <button type="button" onClick={clearSearch} aria-label="Clear search" className="absolute right-2 top-2 rounded p-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={16} /></button>}</label>
            <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-navy-800">Sort by:<select aria-label="Sort travel guides" value={sort} onChange={event => setSort(event.target.value)} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"><option value="featured">Featured first</option><option value="az">A–Z</option>{supportsNewest && <option value="newest">Newest</option>}</select></label>
          </div>
        </div>

        {contentLoading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1440px]:grid-cols-4" role="status" aria-label="Loading travel guide content">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-xl bg-slate-100" />)}</div> : noResults ? <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center" role="status"><CircleHelp size={32} className="mx-auto text-sky-700" /><h3 className="mt-3 font-display text-xl font-bold text-navy-950">No Travel Guides Found</h3><p className="mt-2 text-sm text-navy-700">Try another search or clear the current filters.</p><button type="button" onClick={clearSearch} className="mt-4 min-h-10 rounded-full bg-orange-500 px-5 font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2">Clear Search</button><Link to="/travel-guide/all-guides" onClick={clearSearch} className="ml-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-sky-700 px-4 text-sm font-semibold text-sky-800 hover:bg-sky-50">View All Guides <ArrowRight size={15} /></Link></div> : <>
          {query && matchingEntries.length > 0 && <section className="mb-5" aria-labelledby="matching-content-title"><h3 id="matching-content-title" className="mb-3 font-display text-xl font-bold text-navy-950">Matching Available Guides <span className="font-sans text-sm font-normal text-navy-600">({matchingEntries.length} records)</span></h3><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{matchingEntries.map(entry => <GuideEntryCard key={entry.id} entry={entry} />)}</div></section>}
          {matchingCategories.length > 0 && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1440px]:grid-cols-4">{matchingCategories.map(category => <CategoryCard key={category.id} category={category} count={categoryRecords[category.title]} />)}</div>}
          {(!query || (searchHasResults && matchingEntries.length === 0)) && <section className="mt-7" aria-labelledby="all-available-guides-title"><div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h3 id="all-available-guides-title" className="font-display text-xl font-bold text-navy-950">All Available Guides</h3><p className="mt-1 text-sm text-navy-600">Browse the available guide records and package itineraries currently on TravelVista.</p></div><span className="text-xs text-navy-500">{displayedEntries.length} available records</span></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{displayedEntries.map(entry => <GuideEntryCard key={entry.id} entry={entry} />)}</div></section>}
          {contentError && <div role="alert" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><h3 className="font-semibold">Unable to Load Travel Guides</h3><p className="mt-1">Some published package or destination guides couldn’t be loaded. Other available guides are still shown.</p><button type="button" onClick={loadGuideContent} className="mt-2 inline-flex min-h-9 items-center gap-2 font-semibold underline">{retried ? 'Retry' : 'Please try again'} <ArrowRight size={14} /></button></div>}
        </>}
      </section>
      <Sidebar availableGuides={availableGuides} contentLoading={contentLoading} />
    </main>
  </div>
}
