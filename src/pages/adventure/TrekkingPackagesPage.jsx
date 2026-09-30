import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, Backpack, BedDouble, CalendarDays, Camera, Check, Compass,
  Headphones, MapPin, Mountain, ShieldCheck, Trees, Users, Utensils,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'
import api from '../../services/api'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2200&h=700&q=88'
const TREK_FALLBACK = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'
const FEATURES = [
  { icon: Mountain, label: 'Scenic Trails' },
  { icon: Backpack, label: 'Published Treks' },
  { icon: Compass, label: 'Explore Destinations' },
  { icon: CalendarDays, label: 'Itinerary Details' },
  { icon: BedDouble, label: 'Stay Details' },
  { icon: Utensils, label: 'Package Inclusions' },
  { icon: Users, label: 'Group Options' },
  { icon: Headphones, label: 'Travel Enquiries' },
]
const REGIONS = [
  { name: 'Uttarakhand Treks', value: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&h=420&q=78', alt: 'Snow-covered Himalayan peaks in Uttarakhand' },
  { name: 'Himachal Pradesh Treks', value: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1597075085698-6d3f2b002b0f?auto=format&fit=crop&w=700&h=420&q=78', alt: 'Mountain trail in Himachal Pradesh' },
  { name: 'Ladakh Treks', value: 'Ladakh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&h=420&q=78', alt: 'High-altitude mountain landscape in Ladakh' },
  { name: 'Sikkim Treks', value: 'Sikkim', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&h=420&q=78', alt: 'Green mountain scenery in Sikkim' },
  { name: 'North East Treks', value: 'North East', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&h=420&q=78', alt: 'Lush mountain valleys in northeast India' },
]
const NORTH_EAST_STATES = ['assam', 'arunachal pradesh', 'meghalaya', 'manipur', 'mizoram', 'nagaland', 'tripura']
const WHY_CHOOSE = [
  'Trekking options drawn from published packages',
  'Itinerary details shown when provided',
  'Safety information shown when provided',
  'Accommodation details based on package data',
  'Meals listed according to package inclusions',
  'Group options shown when available',
  'Routes and destinations from package details',
  'Travel support for planning enquiries',
]
const EXPERIENCES = [
  { icon: Mountain, title: 'Breathtaking Landscapes', description: 'Snowy peaks, alpine meadows and pristine lakes', color: 'text-sky-600', bg: 'bg-sky-50' },
  { icon: Trees, title: 'Explore Nature', description: 'Rich biodiversity and serene trails', color: 'text-green-700', bg: 'bg-green-50' },
  { icon: Camera, title: 'Perfect for Photography', description: 'Capture unforgettable moments', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Users, title: 'Adventure with Friends', description: 'Ideal for groups, families and solo travelers', color: 'text-blue-700', bg: 'bg-blue-50' },
]
const DURATION_RANGES = [
  { value: '1-3', label: '1–3 Days', min: 1, max: 3 },
  { value: '4-6', label: '4–6 Days', min: 4, max: 6 },
  { value: '7-10', label: '7–10 Days', min: 7, max: 10 },
  { value: '10+', label: '10+ Days', min: 11, max: Infinity },
]
const BUDGET_RANGES = [
  { value: '0-10000', label: 'Under ₹10,000', min: 0, max: 10000 },
  { value: '10000-25000', label: '₹10,000–₹25,000', min: 10000, max: 25000 },
  { value: '25000-50000', label: '₹25,000–₹50,000', min: 25000, max: 50000 },
  { value: '50000+', label: '₹50,000+', min: 50000, max: Infinity },
]
const emptyFilters = { destination: '', difficulty: '', duration: '', budget: '' }
const normalized = value => String(value || '').trim().toLowerCase()
const stringList = value => Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,;\n]/).map(item => item.trim()).filter(Boolean) : []
const valuesFor = pkg => [pkg.category, pkg.tags].filter(Boolean).join(' ').toLowerCase()
const isTrekkingPackage = pkg => /\b(treks?|trekking|hiking)\b/.test(valuesFor(pkg))
const packageDestination = pkg => pkg.state || pkg.destination || pkg.country || ''
const difficultyFrom = pkg => {
  const direct = pkg.difficulty || pkg.difficultyLevel || pkg.level
  if (typeof direct === 'string' && direct.trim()) return direct.trim()
  const known = ['easy to moderate', 'moderate to difficult', 'moderate', 'difficult', 'easy']
  const tags = stringList(pkg.tags).map(normalized)
  return known.find(level => tags.includes(level) || tags.some(tag => tag === `difficulty:${level}` || tag === `difficulty-${level.replaceAll(' ', '-')}`)) || ''
}
const regionFor = value => {
  const text = normalized(value)
  if (text === 'north east' || text.includes('north-east') || NORTH_EAST_STATES.includes(text)) return 'North East'
  if (text.includes('uttarakhand')) return 'Uttarakhand'
  if (text.includes('himachal')) return 'Himachal Pradesh'
  if (text.includes('ladakh') || text.includes('leh')) return 'Ladakh'
  if (text.includes('sikkim')) return 'Sikkim'
  return ''
}
const packageInRegion = (pkg, region) => {
  if (!region) return true
  const fields = [pkg.state, pkg.destination, pkg.country, pkg.tags].filter(Boolean)
  return fields.some(field => regionFor(field) === region || (region === 'North East' && normalized(field).includes('northeast')))
}
const formatPrice = (price, currency = 'INR') => {
  const normalizedCurrency = String(currency || '').toUpperCase()
  const code = /^[A-Z]{3}$/.test(normalizedCurrency) ? normalizedCurrency : 'INR'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(Number(price))
}

function TrekkingPackageCard({ pkg }) {
  const [image, setImage] = useState(pkg.coverImage || pkg.image || TREK_FALLBACK)
  const difficulty = difficultyFrom(pkg)
  const days = Number(pkg.durationDays)
  const nights = Number(pkg.durationNights)
  const hasPrice = pkg.startingPrice != null && pkg.startingPrice !== '' && Number.isFinite(Number(pkg.startingPrice)) && Number(pkg.startingPrice) > 0
  return <article className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <img src={image} alt={pkg.title ? `${pkg.title} trekking scenery` : 'Mountain trekking landscape'} loading="lazy" decoding="async" onError={() => setImage(TREK_FALLBACK)} className="h-full w-full object-cover" />
      {pkg.featured && <span className="absolute left-3 top-3 rounded-md bg-green-700 px-3 py-1 text-xs font-bold text-white">Popular</span>}
    </div>
    <div className="flex flex-1 flex-col p-3">
      <h3 className="font-display text-lg font-bold leading-tight text-navy-900">{pkg.title}</h3>
      <ul className="mt-2 space-y-1 text-xs text-navy-800">
        {packageDestination(pkg) && <li className="flex items-center gap-2"><MapPin size={14} className="shrink-0 text-sky-800" aria-hidden="true" />{packageDestination(pkg)}</li>}
        {days > 0 && <li className="flex items-center gap-2"><CalendarDays size={14} className="shrink-0 text-sky-800" aria-hidden="true" />{days} Days{nights > 0 && Number.isFinite(nights) ? ` / ${nights} Nights` : ''}</li>}
        {difficulty && <li className="flex items-center gap-2"><Backpack size={14} className="shrink-0 text-sky-800" aria-hidden="true" />{difficulty}</li>}
      </ul>
      <div className="mt-auto pt-3">
        {hasPrice ? <p className="mb-2 text-lg font-bold text-sky-800">{formatPrice(pkg.startingPrice, pkg.currency)} <span className="text-xs font-normal text-navy-600">per person</span></p> : <p className="mb-2 text-sm font-semibold text-navy-700">Price on Request</p>}
        <Link to={`/packages/${pkg.slug || pkg.id}`} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-orange-500 px-3 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">View Details <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
    </div>
  </article>
}

function PackageSkeleton() {
  return <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm" aria-hidden="true"><div className="aspect-[16/10] animate-pulse bg-slate-200" /><div className="space-y-3 p-3"><div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" /><div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" /><div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" /><div className="h-10 animate-pulse rounded bg-slate-100" /></div></div>
}

function SearchPanel({ packages, filters, setFilters, onSearch }) {
  const destinations = useMemo(() => [...new Set(packages.map(packageDestination).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [packages])
  const difficulties = useMemo(() => [...new Set(packages.map(difficultyFrom).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [packages])
  const durations = useMemo(() => DURATION_RANGES.filter(range => packages.some(pkg => { const days = Number(pkg.durationDays); return Number.isFinite(days) && days >= range.min && days <= range.max })), [packages])
  const budgets = useMemo(() => BUDGET_RANGES.filter(range => packages.some(pkg => { const price = Number(pkg.startingPrice); return (!pkg.currency || String(pkg.currency).toUpperCase() === 'INR') && Number.isFinite(price) && price > 0 && price >= range.min && price < range.max })), [packages])
  return <section className="overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm" aria-labelledby="trek-search-title">
    <div className="flex items-center gap-3 bg-sky-50 px-4 py-3"><Backpack size={29} className="shrink-0 text-sky-700" aria-hidden="true" /><div><h2 id="trek-search-title" className="font-display text-xl font-bold text-navy-900">Find Your Trekking Package</h2><p className="text-xs leading-snug text-navy-700">Filter treks based on your preference and plan your adventure.</p></div></div>
    <form onSubmit={event => { event.preventDefault(); onSearch() }} className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
      <label className="min-w-0 text-xs font-medium text-navy-800" htmlFor="trek-destination">Destination<select id="trek-destination" value={filters.destination} onChange={event => setFilters(previous => ({ ...previous, destination: event.target.value }))} className="mt-1.5 min-h-10 w-full rounded-md border border-navy-200 bg-white px-3 text-sm text-navy-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"><option value="">Select Destination</option>{destinations.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
      <label className="min-w-0 text-xs font-medium text-navy-800" htmlFor="trek-difficulty">Difficulty Level<select id="trek-difficulty" value={filters.difficulty} onChange={event => setFilters(previous => ({ ...previous, difficulty: event.target.value }))} className="mt-1.5 min-h-10 w-full rounded-md border border-navy-200 bg-white px-3 text-sm text-navy-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"><option value="">Select Level</option>{difficulties.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
      <label className="min-w-0 text-xs font-medium text-navy-800" htmlFor="trek-duration">Duration<select id="trek-duration" value={filters.duration} onChange={event => setFilters(previous => ({ ...previous, duration: event.target.value }))} className="mt-1.5 min-h-10 w-full rounded-md border border-navy-200 bg-white px-3 text-sm text-navy-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"><option value="">Select Duration</option>{durations.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <label className="min-w-0 text-xs font-medium text-navy-800" htmlFor="trek-budget">Budget Range<select id="trek-budget" value={filters.budget} onChange={event => setFilters(previous => ({ ...previous, budget: event.target.value }))} className="mt-1.5 min-h-10 w-full rounded-md border border-navy-200 bg-white px-3 text-sm text-navy-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"><option value="">Select Budget</option>{budgets.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <button type="submit" className="col-span-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:col-span-2">Search Treks <ArrowRight size={17} aria-hidden="true" /></button>
    </form>
  </section>
}

function WhyChooseCard() {
  return <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-labelledby="trek-why-title"><h2 id="trek-why-title" className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-navy-900"><span className="text-xl text-amber-500" aria-hidden="true">★</span>Why Choose Our Trekking Packages?</h2><ul className="space-y-1.5">{WHY_CHOOSE.map(item => <li key={item} className="flex items-start gap-2 text-xs leading-snug text-navy-800"><Check size={15} className="mt-0.5 shrink-0 rounded-full bg-green-700 p-0.5 text-white" aria-hidden="true" />{item}</li>)}</ul></section>
}

export default function TrekkingPackagesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [filters, setFilters] = useState(() => ({
    destination: searchParams.get('destination') || '',
    difficulty: searchParams.get('difficulty') || '',
    duration: searchParams.get('duration') || '',
    budget: searchParams.get('budget') || '',
  }))
  const [appliedFilters, setAppliedFilters] = useState(() => ({
    destination: searchParams.get('destination') || '',
    difficulty: searchParams.get('difficulty') || '',
    duration: searchParams.get('duration') || '',
    budget: searchParams.get('budget') || '',
  }))

  useEffect(() => {
    let current = true
    setLoading(true)
    setLoadError(false)
    api.get('/packages', { params: { status: 'published' } })
      .then(response => {
        if (!current) return
        if (!Array.isArray(response.data)) throw new Error('Unexpected package response')
        setPackages(response.data.filter(pkg => pkg?.status === 'published').filter(pkg => pkg && isTrekkingPackage(pkg)))
      })
      .catch(() => { if (current) { setPackages([]); setLoadError(true) } })
      .finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [retry])

  useEffect(() => {
    const destinationParam = searchParams.get('destination') || ''
    const regionValue = REGIONS.find(region => region.value.toLowerCase().replaceAll(' ', '-') === destinationParam.toLowerCase())?.value
    const next = {
      destination: regionValue || destinationParam,
      difficulty: searchParams.get('difficulty') || '',
      duration: searchParams.get('duration') || '',
      budget: searchParams.get('budget') || '',
    }
    setFilters(next)
    setAppliedFilters(next)
  }, [searchParams])

  const visiblePackages = useMemo(() => packages.filter(pkg => {
    if (appliedFilters.destination) {
      const selected = appliedFilters.destination
      const selectedRegion = regionFor(selected)
      if (selectedRegion) {
        if (!packageInRegion(pkg, selectedRegion)) return false
      } else if (normalized(packageDestination(pkg)) !== normalized(selected)) return false
    }
    if (appliedFilters.difficulty && normalized(difficultyFrom(pkg)) !== normalized(appliedFilters.difficulty)) return false
    if (appliedFilters.duration) {
      const range = DURATION_RANGES.find(item => item.value === appliedFilters.duration)
      const days = Number(pkg.durationDays)
      if (!range || !Number.isFinite(days) || days < range.min || days > range.max) return false
    }
    if (appliedFilters.budget) {
      const range = BUDGET_RANGES.find(item => item.value === appliedFilters.budget)
      const price = Number(pkg.startingPrice)
      if (!range || (pkg.currency && String(pkg.currency).toUpperCase() !== 'INR') || pkg.startingPrice == null || pkg.startingPrice === '' || !Number.isFinite(price) || price <= 0 || price < range.min || price >= range.max) return false
    }
    return true
  }), [packages, appliedFilters])

  const applyFilters = () => {
    setAppliedFilters(filters)
    const next = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    setSearchParams(next, { replace: false })
    document.getElementById('popular-treks')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const clearFilters = () => {
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setSearchParams({}, { replace: false })
  }
  const showRegion = region => {
    const next = { ...emptyFilters, destination: region }
    setFilters(next)
    setAppliedFilters(next)
    setSearchParams({ destination: region.toLowerCase().replaceAll(' ', '-') }, { replace: false })
    document.getElementById('popular-treks')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <div className="min-w-0 overflow-x-clip bg-white text-navy-900">
    <SEOHead title="Trekking Packages in India | Adventure Treks | TravelVista" description="Explore trekking packages across India with TravelVista. Discover Himalayan treks, scenic trails, adventure packages, trekking destinations and customized trekking experiences." keywords="trekking packages India, Himalayan treks, trekking destinations, adventure treks, TravelVista" />
    <section className="relative isolate min-h-[310px] overflow-hidden bg-navy-950 text-white sm:min-h-[285px] lg:min-h-[270px]" aria-labelledby="trekking-page-title">
      <img src={HERO_IMAGE} alt="Trekkers hiking along a Himalayan mountain trail" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[center_48%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071321]/95 via-[#0a1e31]/75 via-55% to-[#0a1c2b]/20" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[310px] max-w-8xl items-center px-4 py-7 sm:min-h-[285px] sm:px-6 lg:min-h-[270px] lg:px-8">
        <div className="max-w-3xl lg:max-w-[68%]">
          <Breadcrumb light items={[{ label: 'Adventure' }, { label: 'Trekking Packages' }]} />
          <h1 id="trekking-page-title" className="font-display text-4xl font-bold leading-[1.02] drop-shadow sm:text-5xl md:text-6xl lg:text-7xl"><span className="text-white">Trekking </span><span className="text-gold-400">Packages</span></h1>
          <p className="mt-3 font-display text-lg font-bold text-white sm:text-xl">Explore Nature, One Step at a Time</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/95 sm:text-base">Discover scenic trekking destinations with carefully curated trekking packages. From nature trails to high-altitude treks, explore breathtaking landscapes, serene nature and unforgettable adventures.</p>
        </div>
        <div className="absolute bottom-6 right-5 hidden -rotate-6 text-right font-display text-2xl font-semibold italic leading-tight text-white drop-shadow-lg lg:block xl:right-10 xl:text-3xl" aria-hidden="true">Trek<br />Explore<br />Unwind<span className="mt-2 flex items-center justify-end gap-3"><span className="w-12 border-b border-dashed border-white/80" /><ArrowRight size={22} className="-rotate-45" /></span></div>
      </div>
    </section>

    <section aria-label="Trekking package features" className="border-b border-gray-100 bg-white"><div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:thin] sm:flex-wrap sm:justify-center lg:flex-nowrap lg:justify-between lg:px-8">{FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-h-[58px] min-w-[132px] shrink-0 flex-col items-center justify-center gap-1 border-r border-gray-100 px-3 text-center last:border-0 sm:min-w-[160px] lg:min-w-0 lg:flex-1"><Icon size={21} strokeWidth={2.2} className="text-orange-500" aria-hidden="true" /><span className="whitespace-nowrap text-xs font-medium text-navy-800">{label}</span></div>)}</div></section>

    <main className="mx-auto grid max-w-8xl grid-cols-1 gap-5 px-4 py-4 sm:px-6 xl:grid-cols-[minmax(0,2.7fr)_minmax(300px,1fr)] xl:gap-6 lg:px-8 lg:py-5">
        <section id="popular-treks" className="scroll-mt-24" aria-labelledby="popular-treks-title">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3"><div><h2 id="popular-treks-title" className="font-display text-2xl font-bold leading-tight text-navy-900 sm:text-3xl">Popular Trekking Packages</h2><p className="mt-1 text-sm text-navy-800">Explore our available trekking packages across India.</p></div><button type="button" onClick={() => { clearFilters(); document.getElementById('popular-treks')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-orange-700 hover:text-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">View All Trekking Packages <ArrowRight size={15} aria-hidden="true" /></button></div>
          {loading && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="Loading trekking packages" role="status"><PackageSkeleton /><PackageSkeleton /><PackageSkeleton /><PackageSkeleton /><PackageSkeleton /></div>}
          {loadError && !loading && <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center" role="alert"><h3 className="font-display text-lg font-bold text-red-900">Unable to Load Trekking Packages</h3><p className="mt-1 text-sm text-navy-800">We couldn’t load trekking packages right now. Please try again.</p><button type="button" onClick={() => setRetry(value => value + 1)} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">Try Again <ArrowRight size={15} aria-hidden="true" /></button></div>}
          {!loading && !loadError && packages.length === 0 && <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-6 text-center shadow-sm sm:p-8"><Mountain size={38} className="mx-auto text-sky-700" aria-hidden="true" /><h3 className="mt-3 font-display text-xl font-bold text-navy-900">Trekking Packages Coming Soon</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-navy-800">We’re currently preparing exciting trekking experiences for you. Our new trekking packages will be available soon.</p><p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-navy-700">Looking for a custom trekking trip? Tell us your destination, travel dates and requirements and our team can help you plan your adventure.</p><div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row"><Link to="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Plan a Custom Trek <ArrowRight size={15} aria-hidden="true" /></Link><Link to="/contact" className="inline-flex min-h-11 items-center justify-center rounded-md border border-orange-500 px-5 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Contact Us</Link></div></div>}
          {!loading && !loadError && packages.length > 0 && visiblePackages.length > 0 && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{visiblePackages.map(pkg => <TrekkingPackageCard key={pkg.id || pkg.slug} pkg={pkg} />)}</div>}
          {!loading && !loadError && packages.length > 0 && visiblePackages.length === 0 && <div className="rounded-lg border border-slate-200 bg-slate-50 p-7 text-center" role="status"><h3 className="font-display text-xl font-bold text-navy-900">No Trekking Packages Found</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-navy-800">We couldn’t find a trekking package matching your selected preferences. Try changing the destination, difficulty, duration or budget.</p><button type="button" onClick={clearFilters} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500">Clear Filters</button></div>}
        </section>

        <aside className="min-w-0 xl:col-start-2 xl:row-start-1" aria-label="Trekking package filters"><SearchPanel packages={packages} filters={filters} setFilters={setFilters} onSearch={applyFilters} /></aside>

        <section className="min-w-0 xl:col-start-1 xl:row-start-2" aria-labelledby="regions-title"><h2 id="regions-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Trekking Destinations by Region</h2><p className="mt-1 text-sm text-navy-800">Explore trekking packages in the most beautiful regions of India.</p><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{REGIONS.map(region => { const available = packages.some(pkg => packageInRegion(pkg, region.value)); return <article key={region.value} className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm"><img src={region.image} alt={region.alt} loading="lazy" decoding="async" className="aspect-[16/8] w-full object-cover" /><div className="p-3"><h3 className="font-display text-sm font-bold text-navy-900">{region.name}</h3>{loading ? <span className="mt-1 inline-flex min-h-9 items-center text-sm text-navy-600" role="status">Checking availability…</span> : loadError ? <span className="mt-1 inline-flex min-h-9 items-center text-sm text-navy-600">Availability unavailable</span> : available ? <button type="button" onClick={() => showRegion(region.value)} className="mt-1 inline-flex min-h-9 items-center gap-1 text-sm font-medium text-orange-700 hover:text-orange-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">View Treks <ArrowRight size={14} aria-hidden="true" /></button> : <span className="mt-1 inline-flex min-h-9 items-center text-sm font-medium text-navy-500">Coming Soon</span>}</div></article>})}</div></section>

        <section className="min-w-0 xl:col-start-1 xl:row-start-3" aria-labelledby="trek-experiences-title"><h2 id="trek-experiences-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Trekking Experiences</h2><p className="mt-1 text-sm text-navy-800">More than just a trek — it’s a journey of a lifetime.</p><div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">{EXPERIENCES.map(({ icon: Icon, title, description, color, bg }) => <article key={title} className="flex items-center gap-3 border-b border-slate-100 p-3 sm:border-b-0 sm:border-r sm:last:border-r-0"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}><Icon size={30} aria-hidden="true" /></span><div><h3 className="font-display text-base font-bold leading-tight text-navy-900">{title}</h3><p className="mt-1 text-xs leading-snug text-navy-700">{description}</p></div></article>)}</div></section>
      <aside className="min-w-0 xl:col-start-2 xl:row-start-2" aria-label="Why choose MAQLAIM TOURS trekking"><WhyChooseCard /></aside>
      <aside className="min-w-0 rounded-lg border border-amber-100 bg-amber-50/80 p-5 xl:col-start-2 xl:row-start-3" aria-labelledby="trek-help-title"><div className="flex items-start gap-3"><Headphones size={31} className="shrink-0 text-orange-500" aria-hidden="true" /><div><h2 id="trek-help-title" className="font-display text-xl font-bold text-navy-900">Need Help Choosing a Trek?</h2><p className="mt-2 text-sm leading-relaxed text-navy-800">Contact our team with your destination, travel dates and preferences for help planning a trekking trip.</p><Link to="/contact" className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Contact Us <ArrowRight size={15} aria-hidden="true" /></Link></div></div></aside>
    </main>
  </div>
}
