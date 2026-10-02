import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BedDouble, CalendarDays, Camera, CarFront, Check,
  CheckCircle2, ConciergeBell, Flower2, Heart, HeartHandshake, LoaderCircle,
  MapPin, Music2, Palmtree, Plane, RefreshCw, Sparkles, Star, Utensils, Users,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'
import { ComingSoonPage } from '../common/ComingSoonPage'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { getPublishedDestinationWeddingPackages } from '../../utils/weddingPackages'

const WEDDING_ROUTE = '/destination-weddings/international/bali'
const DESTINATION_NAMES = ['Bali']
const PACKAGE_LIST_ROUTE = '/packages?destination=Bali&packageType=wedding'
const WEDDING_TYPES = [
  'Beach Wedding', 'Clifftop Wedding', 'Luxury Resort Wedding', 'Traditional Balinese Wedding',
  'Garden Wedding', 'Intimate Wedding', 'Grand Wedding', 'Custom Wedding',
]
const GUEST_RANGES = ['Below 50', '50–100', '100–200', '200–300', '300–500', '500+']
const FIELD_CLASS = 'mt-1 w-full min-w-0 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-navy-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:text-sm'
const TODAY = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const isValidDate = value => {
  const [year, month, day] = String(value).split('-').map(Number)
  if (![year, month, day].every(Number.isInteger) || !year || !month || !day) return false
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

const FEATURES = [
  { icon: Palmtree, label: 'Beachfront Venues' },
  { icon: Camera, label: 'Pre-Wedding Photoshoots' },
  { icon: Flower2, label: 'Balinese Culture & Traditions' },
  { icon: Users, label: 'Customized Wedding Packages' },
  { icon: Utensils, label: 'International Cuisine' },
  { icon: Music2, label: 'Live Music & Entertainment' },
  { icon: CarFront, label: 'Guest Travel & Stay' },
  { icon: HeartHandshake, label: 'Complete Wedding Support' },
]

const HERO_IMAGE = 'https://images.unsplash.com/photo-1671034456366-77aff6bd3316?auto=format&fit=crop&w=2200&h=900&q=88'
const HERO_WEDDING_IMAGE = 'https://images.unsplash.com/photo-1693576588167-2e7148490dc5?auto=format&fit=crop&w=1100&h=800&q=86'
const VENUES = [
  { title: 'Uluwatu Clifftop', image: 'photo-1636619306699-2d27a100605e', alt: 'Dramatic green cliffs above the ocean at Uluwatu, Bali' },
  { title: 'Nusa Dua Beach', image: 'photo-1519046904884-53103b34b206', alt: 'Palm-lined tropical beach and clear water on Bali' },
  { title: 'Seminyak Luxury Resort', image: 'photo-1518509562904-e7ef99cdcc86', alt: 'Tropical island coastline and resort scenery in Bali' },
  { title: 'Ubud Gardens', image: 'photo-1555400038-63f5ba517a47', alt: 'Tropical garden swing surrounded by lush greenery in Bali' },
  { title: 'Tanah Lot Temple', image: 'photo-1537996194471-e657df975ab4', alt: 'Traditional Balinese sea temple beside the ocean' },
  { title: 'Jimbaran Bay', image: 'photo-1575573334553-4d5633270377', alt: 'Oceanfront wedding ceremony setup among palm trees in Bali' },
]
const SERVICES = [
  { icon: Flower2, title: 'Wedding Planning', detail: 'End-to-end support' },
  { icon: BedDouble, title: 'Luxury Stays', detail: 'Best resorts and private villas' },
  { icon: ConciergeBell, title: 'Multi-Cuisine', detail: 'Local & international menus' },
  { icon: Camera, title: 'Photography & Videography', detail: 'Capture your special moments' },
  { icon: Music2, title: 'Entertainment', detail: 'Live music, cultural shows & DJs' },
  { icon: CarFront, title: 'Travel & Transfers', detail: 'Airport transfers and local travel support' },
]
const WHY_BALI = [
  'Stunning beaches, cliffs and exotic venues',
  'Perfect for intimate and grand weddings',
  'Unique Balinese culture and traditions',
  'Luxury resorts and private villas',
  'Mesmerizing pre & post-wedding photoshoots',
  'Multi-cuisine gourmet experiences',
  'Adventure and leisure activities for guests',
  'Complete travel, stay and event support',
]

function packageInclusions(pkg) {
  const raw = pkg.inclusions || pkg.highlights || []
  const values = Array.isArray(raw) ? raw : String(raw).split(/[,;\n|]/)
  return values.map(item => String(item).trim()).filter(Boolean).slice(0, 3)
}

function packagePrice(pkg) {
  if (pkg.startingPrice === null || pkg.startingPrice === undefined || pkg.startingPrice === '') return ''
  const amount = Number(pkg.startingPrice)
  if (!Number.isFinite(amount) || amount <= 0) return ''
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: pkg.currency || 'INR', maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${pkg.currency || ''} ${amount.toLocaleString('en-IN')}`.trim()
  }
}

function PackageCard({ pkg }) {
  const location = pkg.city || pkg.destination || pkg.state || 'Bali, Indonesia'
  const duration = pkg.durationDays
    ? `${pkg.durationDays} Days${pkg.durationNights != null ? ` / ${pkg.durationNights} Nights` : ''}`
    : pkg.durationNights ? `${pkg.durationNights} Nights` : 'Duration not listed'
  const detailPath = `/packages/${encodeURIComponent(pkg.slug || pkg.id)}`
  const image = pkg.coverImage || pkg.image || pkg.bannerImage || ''
  const inclusions = packageInclusions(pkg)
  const price = packagePrice(pkg)

  return <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
    <Link to={detailPath} aria-label={`View ${pkg.title} package details`} className="block aspect-[16/9] overflow-hidden bg-slate-100">
      {image ? <img src={image} alt={`${pkg.title} package in ${location}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-50 to-sky-100"><Palmtree size={34} className="text-orange-500" aria-hidden="true" /></div>}
    </Link>
    <div className="flex flex-1 flex-col p-3">
      <h3 className="line-clamp-2 min-h-10 font-display text-sm font-bold leading-tight text-navy-900 sm:text-base">{pkg.title}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><MapPin size={14} className="shrink-0" aria-hidden="true" />{location}</p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><CalendarDays size={14} className="shrink-0" aria-hidden="true" />{duration}</p>
      {inclusions.length > 0 && <p className="mt-1 flex items-start gap-1.5 text-xs leading-snug text-navy-700"><Users size={14} className="mt-px shrink-0" aria-hidden="true" /><span>{inclusions.join(', ')}</span></p>}
      {price && <p className="mt-auto pt-3 font-display text-lg font-bold leading-tight text-navy-900">{price} <span className="font-sans text-[11px] font-normal text-navy-600">onwards</span></p>}
      <Link to={detailPath} className="mt-3 flex min-h-9 items-center justify-center gap-1 rounded border border-orange-500 px-2 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300">View Details <ArrowRight size={13} aria-hidden="true" /></Link>
    </div>
  </article>
}

export default function BaliWeddingPage() {
  const { user } = useAuth()
  const [packages, setPackages] = useState([])
  const [packageState, setPackageState] = useState('loading')
  const [packageError, setPackageError] = useState('')
  const [form, setForm] = useState({ weddingType: '', guests: '', date: '', name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
  const [formState, setFormState] = useState('form')
  const [contactOpen, setContactOpen] = useState(false)
  const [formError, setFormError] = useState('')

  const loadPackages = useCallback(async () => {
    setPackageState('loading')
    setPackageError('')
    try {
      const response = await api.get('/packages', { params: { status: 'published' } })
      if (!Array.isArray(response.data)) throw new Error('Package response was not a list.')
      setPackages(getPublishedDestinationWeddingPackages(response.data, DESTINATION_NAMES))
      setPackageState('loaded')
    } catch {
      setPackageError('We could not load Bali wedding packages right now. Please try again.')
      setPackageState('error')
    }
  }, [])

  useEffect(() => { loadPackages() }, [loadPackages])

  const update = (field, value) => {
    setForm(previous => ({ ...previous, [field]: value }))
    setFormError('')
    if (formState === 'error') setFormState('form')
  }

  const submitQuote = async event => {
    event.preventDefault()
    if (formState === 'submitting') return
    const missing = [
      ['weddingType', 'Please select a wedding type.'],
      ['guests', 'Please select an estimated guest count.'],
      ['date', 'Please select your preferred date.'],
    ].find(([field]) => !form[field])
    if (missing) { setFormError(missing[1]); return }
    if (!isValidDate(form.date)) { setFormError('Please select a valid preferred date.'); return }
    if (form.date < TODAY()) { setFormError('Preferred date cannot be in the past.'); return }
    if (!form.name.trim()) {
      setContactOpen(true)
      setFormError('Please add your name and contact details so our wedding team can reach you.')
      return
    }
    if (!(form.email.trim() || form.phone.trim())) {
      setContactOpen(true)
      setFormError('Please provide an email address or phone number for your quote.')
      return
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (form.phone.trim() && !/^[+\d][\d\s()-]{6,19}$/.test(form.phone.trim())) {
      setFormError('Please enter a valid phone number.')
      return
    }

    setFormState('submitting')
    setFormError('')
    const guestCount = { 'Below 50': 25, '50–100': 75, '100–200': 150, '200–300': 250, '300–500': 400, '500+': 500 }[form.guests]
    try {
      await api.post('/leads/public/submit', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        destination: 'Bali',
        travelDate: form.date,
        travelers: guestCount,
        leadType: 'destination-wedding',
        sourceUrl: `${window.location.origin}${WEDDING_ROUTE}`,
        message: `Bali Wedding Page quote request. Destination: Bali. Country: Indonesia. Wedding type: ${form.weddingType}. Guest count: ${form.guests}. Preferred date: ${form.date}.`,
      })
      setFormState('success')
    } catch (error) {
      setFormError(error.response?.data?.error || error.response?.data?.message || 'We could not send your quote request. Please try again.')
      setFormState('error')
    }
  }

  return <div className="relative isolate min-w-0 overflow-hidden bg-white text-navy-900">
    <SEOHead title="Bali Destination Wedding Packages | Maqlaim Tours" description="Plan your dream destination wedding in Bali with curated beach, clifftop, luxury resort and traditional Balinese wedding experiences from Maqlaim Tours." />
    <section className="relative isolate min-h-[390px] overflow-hidden bg-[#203142] text-white sm:min-h-[360px] lg:min-h-[285px]" aria-labelledby="bali-wedding-title">
      <img src={HERO_IMAGE} alt="Sunset over the dramatic ocean cliffs of Uluwatu, Bali" loading="eager" className="absolute inset-0 h-full w-full object-cover object-center" />
      <img src={HERO_WEDDING_IMAGE} alt="A bride and groom celebrating at sunset beside a rocky ocean cliff" loading="eager" className="absolute inset-y-0 right-0 hidden h-full w-[48%] object-cover object-center lg:block" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#10202e]/90 via-[#10202e]/65 to-[#10202e]/15 lg:right-[40%]" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-gradient-to-r from-[#10202e]/10 via-transparent to-transparent lg:block" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[390px] max-w-8xl items-center px-4 py-6 sm:min-h-[360px] sm:px-6 lg:min-h-[285px] lg:px-8">
        <div className="max-w-[610px]">
          <Breadcrumb light items={[{ label: 'Destination Weddings', href: '/destination-weddings' }, { label: 'International Weddings', href: '/destination-weddings/international' }, { label: 'Bali Weddings' }]} />
          <h1 id="bali-wedding-title" className="font-display text-5xl font-bold leading-[0.98] sm:text-6xl lg:text-[3.5rem]">Bali <span className="text-orange-400">Weddings</span></h1>
          <p className="mt-2 text-base font-semibold sm:text-lg">A Romantic Paradise for Your Dream Celebration</p>
          <p className="mt-2 max-w-[550px] text-sm leading-snug text-white/95 sm:text-[15px]">Exchange your vows on the breathtaking island of Bali, where pristine beaches, lush landscapes, and rich cultural heritage create the perfect setting for a once-in-a-lifetime wedding. A Bali wedding offers an exotic blend of natural beauty, spiritual charm and luxury, making your special day truly unforgettable.</p>
        </div>
        <div className="pointer-events-none absolute right-7 top-1/2 hidden -translate-y-1/2 rotate-[-6deg] text-right font-display text-2xl italic leading-tight text-white drop-shadow-lg xl:block" aria-hidden="true">
          <span>Tropical Vibes<br />Dream Weddings<br />Forever Together</span>
          <span className="mt-2 flex items-center justify-end gap-2 text-orange-100"><span className="w-14 border-b border-dashed border-white/80" /><Heart size={20} /><Plane size={20} /></span>
        </div>
        <div className="pointer-events-none absolute bottom-5 right-5 flex items-center gap-2 text-white/80 xl:hidden" aria-hidden="true"><Heart size={18} /><Plane size={19} /></div>
      </div>
    </section>

    <section aria-label="Bali wedding features" className="border-b border-gray-100 bg-white/95">
      <div className="mx-auto grid max-w-8xl grid-cols-2 gap-y-3 px-3 py-3 sm:grid-cols-4 lg:flex lg:justify-between lg:gap-1 lg:px-8">
        {FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-0 flex-col items-center justify-center gap-1 border-r border-slate-100 px-2 text-center last:border-0 sm:px-3 lg:min-w-0 lg:flex-1"><Icon size={22} strokeWidth={2.4} className="text-orange-600" aria-hidden="true" /><span className="text-[11px] font-medium leading-tight text-navy-800 sm:text-xs">{label}</span></div>)}
      </div>
    </section>

    <div className="mx-auto grid max-w-8xl grid-cols-1 items-start gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(300px,1fr)] lg:gap-5 lg:px-8 lg:py-2">
      <div className="min-w-0 space-y-2">
        <section aria-labelledby="bali-packages-title">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <div><h2 id="bali-packages-title" className="font-display text-xl font-bold leading-tight text-navy-900 sm:text-2xl">Popular Bali <span className="text-orange-600">Wedding Packages</span></h2><p className="mt-0.5 text-xs text-navy-700 sm:text-sm">Curated wedding experiences to make your special day magical in Bali.</p></div>
            <Link to={PACKAGE_LIST_ROUTE} className="inline-flex min-h-9 items-center gap-1 text-xs font-medium text-orange-700 hover:text-orange-800 sm:text-sm">View All Bali Wedding Packages <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          {packageState === 'loading' && <div className="mt-3 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 xl:grid-cols-4" aria-label="Loading Bali wedding packages">{[1, 2, 3, 4].map(index => <div key={index} className="h-[320px] animate-pulse rounded-lg border border-slate-100 bg-slate-50" />)}</div>}
          {packageState === 'error' && <div role="alert" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-navy-800"><p>{packageError}</p><button type="button" onClick={loadPackages} className="mt-2 inline-flex min-h-10 items-center gap-2 font-semibold text-orange-700 hover:text-orange-900"><RefreshCw size={15} aria-hidden="true" />Try again</button></div>}
          {packageState === 'loaded' && packages.length > 0 && <div className="mt-2.5 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 xl:grid-cols-4">{packages.slice(0, 4).map(pkg => <PackageCard key={pkg.id || pkg.slug} pkg={pkg} />)}</div>}
          {packageState === 'loaded' && packages.length === 0 && <div className="mt-3 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm"><ComingSoonPage pageName="Bali Wedding Packages" compact /></div>}
        </section>

        <section aria-labelledby="bali-venues-title" className="pt-1">
          <h2 id="bali-venues-title" className="font-display text-xl font-bold leading-tight text-navy-900 sm:text-2xl">Top Wedding Venues in <span className="text-orange-600">Bali</span></h2>
          <p className="mt-0.5 text-xs text-navy-700 sm:text-sm">Explore the most beautiful venues for a dream wedding in Bali.</p>
          <div className="mt-2 grid grid-cols-2 gap-2 min-[540px]:grid-cols-3 xl:grid-cols-6">
            {VENUES.map(venue => <article key={venue.title} className="group min-w-0 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="aspect-[16/9] overflow-hidden bg-slate-100"><img src={`https://images.unsplash.com/${venue.image}?auto=format&fit=crop&w=560&h=320&q=82`} alt={venue.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><h3 className="px-2 py-1.5 font-display text-xs font-bold leading-tight text-navy-900 sm:text-sm">{venue.title}</h3></article>)}
          </div>
        </section>
      </div>

      <aside className="min-w-0 space-y-2.5 lg:sticky lg:top-28 lg:self-start">
        <section className="overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm" aria-labelledby="bali-quote-title">
          <div className="flex items-center gap-2 bg-sky-50 px-3 py-2"><Palmtree size={28} className="shrink-0 text-orange-600" aria-hidden="true" /><div><h2 id="bali-quote-title" className="font-display text-base font-bold leading-tight text-navy-900 sm:text-lg">Plan Your Bali Wedding</h2><p className="text-[11px] leading-tight text-navy-800">Get a customized wedding plan with the best venues, packages and services.</p></div></div>
          {formState === 'success' ? <div className="p-5 text-center" role="status"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={25} aria-hidden="true" /></span><h3 className="mt-2 font-display text-lg font-bold text-navy-900">Quote request received</h3><p className="mt-1 text-sm text-navy-700">Thank you. Our wedding expert will contact you shortly.</p><button type="button" onClick={() => { setFormState('form'); setForm(previous => ({ ...previous, weddingType: '', guests: '', date: '' })) }} className="mt-3 min-h-9 text-sm font-semibold text-orange-700 underline">Send another request</button></div> : <form onSubmit={submitQuote} className="space-y-2 p-2.5">
            {formError && <div role="alert" className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">{formError}</div>}
            <div className="grid grid-cols-1 gap-x-3 gap-y-2 min-[420px]:grid-cols-2">
              <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Wedding Type<select className={FIELD_CLASS} value={form.weddingType} onChange={event => update('weddingType', event.target.value)} required aria-label="Wedding Type"><option value="">Select Wedding Type</option>{WEDDING_TYPES.map(option => <option key={option}>{option}</option>)}</select></label>
              <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Guest Count<select className={FIELD_CLASS} value={form.guests} onChange={event => update('guests', event.target.value)} required aria-label="Guest Count"><option value="">Select Guests</option>{GUEST_RANGES.map(option => <option key={option}>{option}</option>)}</select></label>
              <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:col-span-2 sm:text-xs">Preferred Date<input className={FIELD_CLASS} type="date" min={TODAY()} value={form.date} onChange={event => update('date', event.target.value)} required /></label>
            </div>
            <details open={contactOpen} onToggle={event => setContactOpen(event.currentTarget.open)} className="rounded border border-slate-100 px-2.5 py-1.5 text-xs"><summary className="cursor-pointer font-medium text-navy-700">Contact details (required to request a quote)</summary><div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-2 min-[420px]:grid-cols-2"><label className="min-w-0 text-[11px] font-medium text-navy-800 sm:col-span-2 sm:text-xs">Your Name<input className={FIELD_CLASS} type="text" autoComplete="name" value={form.name} onChange={event => update('name', event.target.value)} placeholder="Full name" /></label><label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Email<input className={FIELD_CLASS} type="email" autoComplete="email" value={form.email} onChange={event => update('email', event.target.value)} placeholder="Email address" /></label><label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Phone<input className={FIELD_CLASS} type="tel" autoComplete="tel" value={form.phone} onChange={event => update('phone', event.target.value)} placeholder="Phone number" /></label></div><p className="mt-1 text-[10px] text-navy-500">Share an email or phone number so our wedding planner can reach you.</p></details>
            <button type="submit" disabled={formState === 'submitting'} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{formState === 'submitting' ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Sending Request...</> : <>Get a Free Quote <ArrowRight size={16} aria-hidden="true" /></>}</button>
          </form>}
        </section>

        <section className="overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm" aria-labelledby="why-bali-title"><h2 id="why-bali-title" className="flex items-center gap-2 bg-slate-50 px-3 py-2 font-display text-base font-bold leading-tight text-navy-900 sm:text-lg"><Star size={20} className="fill-amber-500 text-amber-500" aria-hidden="true" />Why Choose Bali for Your Wedding?</h2><ul className="space-y-1 px-3 py-2.5">{WHY_BALI.map(reason => <li key={reason} className="flex items-start gap-2 text-xs leading-snug text-navy-800 sm:text-sm"><CheckCircle2 size={15} className="mt-px shrink-0 fill-green-600 text-green-600 [&>path:last-child]:stroke-white" aria-hidden="true" />{reason}</li>)}</ul></section>
      </aside>

      <section aria-labelledby="bali-services-title" className="rounded-lg bg-[#fff9ed] px-3 py-3 lg:col-span-2">
        <h2 id="bali-services-title" className="sr-only">Bali wedding planning services</h2>
        <div className="grid grid-cols-1 divide-y divide-orange-100 min-[500px]:grid-cols-2 min-[500px]:divide-y-0 lg:grid-cols-6">{SERVICES.map(({ icon: Icon, title, detail }) => <article key={title} className="flex min-w-0 items-center justify-center gap-3 px-2 py-2 min-[500px]:justify-start lg:border-r lg:border-orange-100 lg:last:border-0"><Icon size={34} strokeWidth={2.2} className="shrink-0 text-orange-500" aria-hidden="true" /><div className="min-w-0"><h3 className="font-display text-sm font-bold leading-tight text-navy-900">{title}</h3><p className="text-[11px] leading-tight text-navy-700">{detail}</p></div></article>)}</div>
      </section>
    </div>
  </div>
}
