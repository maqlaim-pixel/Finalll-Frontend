import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Building2, Camera, Car, Check, ChevronDown, CircleHelp, Clock3,
  Image as ImageIcon, Info, Leaf, Map, MapPin, Mountain, PawPrint, Plane,
  ShieldCheck, TrainFront, Trees, X,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const PARK = 'Kaziranga National Park'
const HERO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/One_horned_rhino_feeding_in_a_grassland_in_Kaziranga_National_Park%2C_Assam.jpg/1920px-One_horned_rhino_feeding_in_a_grassland_in_Kaziranga_National_Park%2C_Assam.jpg'
const IMAGES = {
  rhino: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/One_horned_rhino_feeding_in_a_grassland_in_Kaziranga_National_Park%2C_Assam.jpg/960px-One_horned_rhino_feeding_in_a_grassland_in_Kaziranga_National_Park%2C_Assam.jpg',
  elephant: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=900&h=650&q=82',
  tiger: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&h=650&q=82',
  deer: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=900&h=650&q=82',
  bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=900&h=650&q=82',
  safari: 'https://images.unsplash.com/photo-1535338454528-1b5f51097792?auto=format&fit=crop&w=1200&h=800&q=85',
  grassland: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&h=800&q=82',
  wetland: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&h=800&q=82',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&h=800&q=82',
  sunset: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&h=800&q=82',
}

const FEATURES = [
  { icon: Leaf, title: 'UNESCO', detail: 'World Heritage Site', color: 'bg-emerald-600' },
  { icon: PawPrint, title: 'Largest population of', detail: 'One-Horned Rhinos', color: 'bg-orange-600' },
  { icon: PawPrint, title: 'Rich Biodiversity', detail: '& Wildlife', color: 'bg-green-700' },
  { icon: Camera, title: 'Perfect for', detail: 'Nature & Photography', color: 'bg-emerald-700' },
]
const ATTRACTIONS = [
  { title: 'One-Horned Rhinoceros', description: 'World’s largest population', image: IMAGES.rhino, alt: 'One-horned rhinoceros feeding in a Kaziranga grassland' },
  { title: 'Elephants', description: 'Majestic herds in the wild', image: IMAGES.elephant, alt: 'Asian elephant in a green natural habitat' },
  { title: 'Royal Bengal Tiger', description: 'A rare and thrilling sight', image: IMAGES.tiger, alt: 'Royal Bengal tiger in a forest habitat' },
  { title: 'Swamp Deer', description: 'Unique wildlife of Kaziranga', image: IMAGES.deer, alt: 'Deer standing in a grassy wildlife habitat' },
  { title: 'Bird Watching', description: 'Rich diversity of birdlife', image: IMAGES.bird, alt: 'Colorful bird among tropical foliage' },
]
const ZONES = [
  { title: 'Central Range (Kohora)', description: 'A popular tourism range with opportunities for wildlife sightings.', image: IMAGES.safari, alt: 'Safari vehicle exploring a green park landscape' },
  { title: 'Western Range (Bagori)', description: 'Known for diverse wildlife and scenic grassland landscapes.', image: IMAGES.rhino, alt: 'Kaziranga rhino in open grassland' },
  { title: 'Eastern Range (Agaratoli)', description: 'Known for bird watching, wetlands and wildlife experiences.', image: IMAGES.wetland, alt: 'Wetland landscape surrounded by trees' },
  { title: 'Burapahar Range', description: 'A scenic range offering forest, hill and nature experiences.', image: IMAGES.forest, alt: 'Green forest landscape in Assam' },
]
const WILDLIFE = [
  { name: 'One-Horned Rhinoceros', image: IMAGES.rhino, alt: 'One-horned rhinoceros in Kaziranga grassland' },
  { name: 'Asian Elephant', image: IMAGES.elephant, alt: 'Asian elephant in a natural habitat' },
  { name: 'Royal Bengal Tiger', image: IMAGES.tiger, alt: 'Royal Bengal tiger in a forest habitat' },
  { name: 'Wild Water Buffalo', image: IMAGES.grassland, alt: 'Wildlife in a grassy wetland landscape' },
  { name: 'Swamp Deer', image: IMAGES.deer, alt: 'Deer in a grassy habitat' },
  { name: 'Birdlife', image: IMAGES.bird, alt: 'Bird among green foliage' },
]
const GALLERY = [
  { image: IMAGES.rhino, alt: 'One-horned rhinoceros grazing in a Kaziranga grassland' },
  { image: IMAGES.safari, alt: 'Safari experience in a green Assam landscape' },
  { image: IMAGES.elephant, alt: 'Asian elephant in a natural landscape' },
  { image: IMAGES.grassland, alt: 'Open grassland with wildlife' },
  { image: IMAGES.wetland, alt: 'Wetland and water landscape' },
  { image: IMAGES.bird, alt: 'Colorful bird in a leafy habitat' },
  { image: IMAGES.forest, alt: 'Sunlight through a forest landscape' },
  { image: IMAGES.sunset, alt: 'Warm sunset over a natural landscape' },
]
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Mountain },
  { id: 'wildlife', label: 'Wildlife', icon: PawPrint },
  { id: 'zones', label: 'Zones & Safari', icon: Map },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'how-to-reach', label: 'How to Reach', icon: MapPin },
  { id: 'stay-options', label: 'Stay Options', icon: Building2 },
  { id: 'packages', label: 'Packages', icon: Clock3 },
  { id: 'travel-tips', label: 'Travel Tips', icon: Info },
  { id: 'faqs', label: 'FAQs', icon: CircleHelp },
]
const FAQS = [
  ['What is Kaziranga National Park famous for?', 'Kaziranga is renowned for its one-horned rhinoceros, UNESCO World Heritage status and diverse grassland and wetland habitats.'],
  ['What wildlife can be seen in Kaziranga?', 'The park is home to one-horned rhinoceros, Asian elephants, Royal Bengal tigers, wild water buffalo, swamp deer and many bird species. Wildlife sightings are never guaranteed.'],
  ['How can I reach Kaziranga?', 'Kaziranga can be reached by air, rail and road through Assam. See the travel options below and check current schedules and onward transport before travelling.'],
  ['What is the best time to visit?', 'Seasonal conditions and park access can change. Check current official park information before selecting your dates.'],
  ['How do safari bookings work?', 'Safari access is subject to official permits, operating conditions and availability. MAQLAIM TOURS can collect your preferred range and dates for a quote; a request is not a permit or confirmed safari.'],
  ['Are wildlife sightings guaranteed?', 'No. Wildlife sightings depend on natural conditions and cannot be guaranteed.'],
  ['What should I carry for a safari?', 'Consider suitable outdoor clothing, sun protection, water and a camera or binoculars. Follow the latest park and operator guidance on permitted items.'],
  ['Can MAQLAIM TOURS arrange a customized Kaziranga trip?', 'Yes. Send your dates and requirements using the visit enquiry form and the MAQLAIM TOURS team can review your request.'],
]
const WHY_VISIT = [
  'Home to the iconic one-horned rhinoceros',
  'Incredible wildlife and bird diversity',
  'Scenic landscapes and grasslands',
  'Exciting safari experiences',
  'Perfect destination for nature lovers and photographers',
  'Well-connected and easy to access',
]
const fieldClass = 'mt-1.5 min-h-10 w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
const today = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
const matchesKaziranga = item => [item?.destination, item?.state, item?.title, item?.name, item?.tags]
  .filter(Boolean).some(value => /kaziranga/i.test(String(value)))
const parseList = value => {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string' || !value.trim()) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []  } catch {
    return []
  }
}
const isActiveContent = item => item?.isActive !== false && item?.active !== false

function SectionTitle({ id, title, subtitle }) {
  return <div className="mb-3"><h2 id={id} className="font-display text-2xl font-bold leading-tight text-navy-900 sm:text-3xl">{title}</h2>{subtitle && <p className="mt-1 text-sm leading-relaxed text-navy-700">{subtitle}</p>}</div>
}

function PlanVisit({ packages, destination, selectedZone, onZoneClear, packageSelection, onPackageSelection }) {
  const { user } = useAuth()
  const formRef = useRef(null)
  const firstFieldRef = useRef(null)
  const [form, setForm] = useState({ travelDate: '', travelers: '1', packageType: '', name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('form')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(previous => ({ ...previous, name: previous.name || user?.name || '', email: previous.email || user?.email || '', phone: previous.phone || user?.phone || '' }))
  }, [user])

  useEffect(() => {
    if (packageSelection) update('packageType', String(packageSelection))
  }, [packageSelection])

  useEffect(() => {
    if (!selectedZone) return
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => firstFieldRef.current?.focus(), 450)
  }, [selectedZone])

  const update = (key, value) => {
    setForm(previous => ({ ...previous, [key]: value }))
    setErrors(previous => ({ ...previous, [key]: '' }))
    if (status === 'error') setStatus('form')
  }

  const validate = () => {
    const next = {}
    if (!form.travelDate) next.travelDate = 'Please select a travel date.'
    else if (form.travelDate < today()) next.travelDate = 'Travel date cannot be in the past.'
    if (!form.travelers || Number(form.travelers) < 1 || Number(form.travelers) > 20) next.travelers = 'Select between 1 and 20 travelers.'
    if (!form.packageType) next.packageType = 'Please select a package type.'
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (!form.phone.trim()) next.phone = 'Please enter your phone number.'
    else if (!/^[+\d][\d\s()-]{6,19}$/.test(form.phone.trim())) next.phone = 'Please enter a valid phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async event => {
    event.preventDefault()
    if (submitting || !validate()) return
    setSubmitting(true)
    setStatus('submitting')
    const selectedPackage = packages.find(pkg => String(pkg.id) === form.packageType)
    const message = [
      `Source: KAZIRANGA_PAGE`,
      `Package type: ${selectedPackage ? selectedPackage.title : form.packageType}`,
      selectedPackage?.id && `Package ID: ${selectedPackage.id}`,
      selectedZone && `Preferred safari range: ${selectedZone}`,
      `Travel request for ${destination || PARK}`,
    ].filter(Boolean).join('\n')
    try {
      await api.post('/leads/public/submit', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        destination: PARK,
        travelDate: form.travelDate,
        travelers: Number(form.travelers),
        message,
        leadType: 'kaziranga-travel-request',
        sourceUrl: `${window.location.pathname}#packages`,
      })
      setStatus('success')
      onZoneClear()
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return <section ref={formRef} className="overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm" aria-labelledby="plan-visit-title">
    <div className="flex items-center gap-3 bg-sky-50 px-4 py-3">
      <Car size={28} className="shrink-0 text-sky-600" aria-hidden="true" />
      <div><h2 id="plan-visit-title" className="font-display text-xl font-bold text-navy-900">Plan Your Visit to Kaziranga</h2><p className="text-xs leading-snug text-navy-700">Get customized packages, safari planning and travel assistance.</p></div>
    </div>
    {status === 'success' ? <div className="p-5" role="status" aria-live="polite"><h3 className="font-display text-lg font-bold text-emerald-800">Kaziranga Travel Request Submitted</h3><p className="mt-2 text-sm leading-relaxed text-navy-700">Thank you. We have received your Kaziranga travel request. Our travel team will review your dates, package requirements and safari preferences and contact you with suitable options.</p></div> : <form onSubmit={submit} noValidate className="space-y-3 p-3" aria-describedby={status === 'error' ? 'quote-error' : undefined}>
      {status === 'error' && <div id="quote-error" role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"><strong>Unable to Submit Request</strong><p className="mt-1">Something went wrong while sending your Kaziranga travel request. Please try again.</p></div>}
      {selectedZone && <div className="flex items-center justify-between gap-2 rounded-md bg-orange-50 px-3 py-2 text-sm text-navy-800"><span>Safari range: <strong>{selectedZone}</strong></span><button type="button" onClick={onZoneClear} className="rounded p-1 text-navy-600 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500" aria-label="Clear selected safari range"><X size={16} /></button></div>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label htmlFor="kaziranga-date" className="text-xs font-medium text-navy-800">Travel Date <span aria-hidden="true">*</span></label><input ref={firstFieldRef} id="kaziranga-date" type="date" min={today()} required aria-required="true" aria-invalid={Boolean(errors.travelDate)} aria-describedby={errors.travelDate ? 'kaziranga-date-error' : undefined} className={fieldClass} value={form.travelDate} onChange={event => update('travelDate', event.target.value)} />{errors.travelDate && <p id="kaziranga-date-error" role="alert" className="mt-1 text-xs text-red-700">{errors.travelDate}</p>}</div>
        <div><label htmlFor="kaziranga-travelers" className="text-xs font-medium text-navy-800">Number of Travelers <span aria-hidden="true">*</span></label><select id="kaziranga-travelers" required aria-required="true" aria-invalid={Boolean(errors.travelers)} className={fieldClass} value={form.travelers} onChange={event => update('travelers', event.target.value)}>{Array.from({ length: 20 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>)}</select>{errors.travelers && <p role="alert" className="mt-1 text-xs text-red-700">{errors.travelers}</p>}</div>
      </div>
      <div><label htmlFor="kaziranga-package" className="text-xs font-medium text-navy-800">Package Type <span aria-hidden="true">*</span></label><select id="kaziranga-package" required aria-required="true" aria-invalid={Boolean(errors.packageType)} aria-describedby={errors.packageType ? 'kaziranga-package-error' : undefined} className={fieldClass} value={form.packageType} onChange={event => { update('packageType', event.target.value); onPackageSelection('') }}><option value="">Select Package Type</option>{packages.map(pkg => <option key={pkg.id} value={String(pkg.id)}>{pkg.title}</option>)}<option value="custom">Custom Kaziranga Trip</option><option value="safari">Safari Enquiry</option></select>{errors.packageType && <p id="kaziranga-package-error" role="alert" className="mt-1 text-xs text-red-700">{errors.packageType}</p>}</div>
      <div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor="kaziranga-name" className="text-xs font-medium text-navy-800">Your Name <span aria-hidden="true">*</span></label><input id="kaziranga-name" autoComplete="name" required aria-required="true" aria-invalid={Boolean(errors.name)} className={fieldClass} value={form.name} onChange={event => update('name', event.target.value)} />{errors.name && <p role="alert" className="mt-1 text-xs text-red-700">{errors.name}</p>}</div><div><label htmlFor="kaziranga-email" className="text-xs font-medium text-navy-800">Email <span aria-hidden="true">*</span></label><input id="kaziranga-email" type="email" autoComplete="email" required aria-required="true" aria-invalid={Boolean(errors.email)} className={fieldClass} value={form.email} onChange={event => update('email', event.target.value)} />{errors.email && <p role="alert" className="mt-1 text-xs text-red-700">{errors.email}</p>}</div></div>
      <div><label htmlFor="kaziranga-phone" className="text-xs font-medium text-navy-800">Phone <span aria-hidden="true">*</span></label><input id="kaziranga-phone" type="tel" autoComplete="tel" required aria-required="true" aria-invalid={Boolean(errors.phone)} className={fieldClass} value={form.phone} onChange={event => update('phone', event.target.value)} />{errors.phone && <p role="alert" className="mt-1 text-xs text-red-700">{errors.phone}</p>}</div>
      <button type="submit" disabled={submitting || status === 'submitting'} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70">{submitting ? 'Submitting...' : status === 'error' ? 'Try Again' : selectedZone ? 'Request Safari Quote' : 'Get Best Quote'} {!submitting && <ArrowRight size={17} aria-hidden="true" />}</button>
      <p className="text-center text-[11px] leading-snug text-navy-600">A quote request is not a confirmed booking or safari permit.</p>
    </form>}
  </section>
}

function QuickInformation({ destination }) {
  const cmsInfo = parseList(destination?.quickInfo)
  const cmsValue = label => cmsInfo.find(item => String(item.label || '').toLowerCase() === label.toLowerCase())?.value
  const rows = [
    { icon: MapPin, label: 'Location', value: cmsValue('Location') || 'Golaghat & Nagaon districts, Assam' },
    { icon: Trees, label: 'Area', value: cmsValue('Area') || 'Approximately 430 sq. km' },
    { icon: Building2, label: 'UNESCO Status', value: cmsValue('UNESCO Status') || 'World Heritage Site' },
    { icon: PawPrint, label: 'Famous For', value: cmsValue('Famous For') || 'One-Horned Rhinoceros' },
    { icon: Clock3, label: 'Best Time', value: cmsValue('Best Time') || destination?.bestTime || 'Check current official park guidance' },
    { icon: Plane, label: 'Nearest Airport', value: cmsValue('Nearest Airport') || 'Check current Assam airport connections' },
    { icon: TrainFront, label: 'Nearest Railway', value: cmsValue('Nearest Railway') || 'Check current Assam rail connections' },
    { icon: Car, label: 'By Road', value: cmsValue('By Road') || 'Connected with major Assam cities' },
  ]
  return <section className="rounded-lg border border-amber-100 bg-amber-50/70 p-4" aria-labelledby="kaziranga-info-title"><h2 id="kaziranga-info-title" className="mb-2 flex items-center gap-2 font-display text-xl font-bold text-navy-900"><Info className="text-orange-500" size={22} aria-hidden="true" />Quick Information</h2><dl className="space-y-2">{rows.map(({ icon: Icon, label, value }) => <div key={label} className="grid grid-cols-[18px_minmax(78px,0.8fr)_minmax(0,1.35fr)] items-start gap-2 text-xs leading-snug"><Icon size={15} className="mt-0.5 text-navy-800" aria-hidden="true" /><dt className="font-semibold text-navy-900">{label}</dt><dd className="text-navy-800">{value}</dd></div>)}</dl></section>
}

function PlanSidebar({ packages, destination, selectedZone, onZoneClear, packageSelection, onPackageSelection }) {
  return <aside className="min-w-0 space-y-3" aria-label="Plan your Kaziranga visit"><PlanVisit packages={packages} destination={destination?.name} selectedZone={selectedZone} onZoneClear={onZoneClear} packageSelection={packageSelection} onPackageSelection={onPackageSelection} /><QuickInformation destination={destination} /><section className="rounded-lg border border-emerald-100 bg-emerald-50/80 p-4" aria-labelledby="why-visit-title"><h2 id="why-visit-title" className="mb-2 flex items-center gap-2 font-display text-xl font-bold text-navy-900"><Leaf className="text-emerald-800" size={20} aria-hidden="true" />Why Visit Kaziranga?</h2><ul className="space-y-1.5">{WHY_VISIT.map(item => <li key={item} className="flex items-start gap-2 text-xs leading-snug text-navy-800"><Check size={15} className="mt-0.5 shrink-0 rounded-full bg-green-700 p-0.5 text-white" aria-hidden="true" />{item}</li>)}</ul></section></aside>
}

export default function KazirangaNationalParkPage() {
  const [activeNav, setActiveNav] = useState('overview')
  const [destination, setDestination] = useState(null)
  const [packages, setPackages] = useState([])
  const [packagesLoading, setPackagesLoading] = useState(true)
  const [packagesError, setPackagesError] = useState(false)
  const [selectedZone, setSelectedZone] = useState('')
  const [packageSelection, setPackageSelection] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const galleryCloseRef = useRef(null)
  const galleryTriggerRef = useRef(null)
  const quoteRef = useRef(null)
  const cmsAbout = destination?.aboutContent || destination?.description
  const aboutText = cmsAbout || 'Kaziranga National Park, located in the state of Assam, is one of India’s most famous wildlife destinations and a UNESCO World Heritage Site. Spread across approximately 430 sq. km, the park is renowned for its large population of the Indian one-horned rhinoceros. Its diverse landscape of grasslands, wetlands and forests also supports elephants, tigers, swamp deer and hundreds of bird species, making Kaziranga a major destination for nature lovers and wildlife enthusiasts.'

  useEffect(() => {
    let current = true
    api.get('/packages', { params: { status: 'published' } })
      .then(response => {
        if (!current) return
        const data = Array.isArray(response.data) ? response.data : []
        setPackages(data.filter(pkg => matchesKaziranga(pkg) && (!pkg.status || pkg.status === 'published')))
      })
      .catch(() => { if (current) { setPackages([]); setPackagesError(true) } })
      .finally(() => { if (current) setPackagesLoading(false) })
    api.get('/destinations', { params: { status: 'published' } })
      .then(response => {
        if (!current) return
        const destinations = Array.isArray(response.data) ? response.data : []
        setDestination(destinations.find(item => item.slug === 'kaziranga-national-park' || /kaziranga/i.test(item.name || '')) || null)
      })
      .catch(() => {})
    return () => { current = false }
  }, [])

  useEffect(() => {
    if (!selectedImage) return undefined
    galleryCloseRef.current?.focus()
    const closeOnEscape = event => { if (event.key === 'Escape') setSelectedImage(null) }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      galleryTriggerRef.current?.focus()
    }
  }, [selectedImage])

  const scrollTo = id => {
    setActiveNav(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const requestZoneQuote = zone => {
    setSelectedZone(zone)
    setActiveNav('overview')
    window.setTimeout(() => quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }
  const sectionTitle = destination?.aboutTitle || 'About Kaziranga National Park'
  const cmsAttractions = parseList(destination?.attractions).filter(isActiveContent)
  const attractions = ATTRACTIONS.map(item => {
    const cmsItem = cmsAttractions.find(candidate => String(candidate.title || '').toLowerCase() === item.title.toLowerCase())
    return cmsItem ? { ...item, image: cmsItem.image || item.image, description: cmsItem.description || item.description, alt: cmsItem.alt || item.alt } : item
  })
  const galleryImages = useMemo(() => {
    const cmsImages = [
      ...parseList(destination?.heroImages),
      ...parseList(destination?.attractions).filter(isActiveContent),
      ...parseList(destination?.experiences).filter(isActiveContent),
    ]
    if (!cmsImages.length) return GALLERY
    return cmsImages.map((item, index) => typeof item === 'string'
      ? { image: item, alt: `Kaziranga National Park scenery ${index + 1}` }
      : { image: item.image || item.url || item.src, alt: item.alt || item.title || `Kaziranga National Park scenery ${index + 1}` }).filter(item => item.image)
  }, [destination])

  return <div className="min-w-0 overflow-x-clip bg-white text-navy-900">
    <SEOHead title={destination?.seoTitle || 'Kaziranga National Park Travel Guide & Safari | MAQLAIM TOURS'} description={destination?.seoDescription || 'Explore Kaziranga National Park in Assam with MAQLAIM TOURS. Discover one-horned rhinos, wildlife, safari zones, travel information and available Kaziranga tour packages.'} keywords={destination?.seoKeywords || 'Kaziranga National Park, Assam, rhinoceros, wildlife, safari zones, travel guide'} />
    <section className="relative isolate min-h-[320px] overflow-hidden bg-[#132414] text-white sm:min-h-[300px] lg:min-h-[280px]" aria-labelledby="kaziranga-title">
      <img src={HERO_IMAGE} alt="One-horned rhinoceros feeding in a Kaziranga grassland" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[55%_45%]" />
      <img src={IMAGES.safari} alt="Safari through the grasslands and wetlands of Assam" fetchPriority="high" className="absolute inset-y-0 right-0 hidden h-full w-[54%] object-cover object-center md:block" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08180e]/95 via-[#0c1b0f]/85 via-50% to-[#111d12]/25" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-black/10" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[320px] max-w-8xl items-center px-4 py-7 sm:min-h-[300px] sm:px-6 lg:min-h-[280px] lg:px-8">
        <div className="max-w-3xl md:max-w-[57%]">
          <Breadcrumb light items={[{ label: 'India', href: '/india' }, { label: 'National Parks', href: '/india/national-parks' }, { label: PARK }]} />
          <h1 id="kaziranga-title" className="font-display text-4xl font-bold leading-[1.02] drop-shadow sm:text-5xl md:text-6xl lg:text-7xl"><span className="text-white">Kaziranga </span><span className="text-gold-400">National Park</span></h1>
          <p className="mt-3 font-display text-lg font-bold text-white sm:text-xl">Land of the Great One-Horned Rhino</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/95 sm:text-base">Experience the untamed beauty of Kaziranga National Park, a UNESCO World Heritage Site known for its one-horned rhinoceros, rich biodiversity and breathtaking landscapes in the heart of Assam.</p>
        </div>
        <div className="absolute bottom-7 right-5 hidden -rotate-6 text-right font-display text-2xl font-semibold italic leading-tight text-white drop-shadow-lg lg:block xl:right-10 xl:text-3xl" aria-hidden="true">Wildlife<br />Adventure<br />in Assam<span className="mt-2 flex items-center justify-end gap-3"><span className="w-12 border-b border-dashed border-white/80" /><Plane size={22} /></span></div>
      </div>
    </section>

    <nav aria-label="Kaziranga page sections" className="sticky top-16 z-30 border-b border-gray-100 bg-white shadow-sm md:top-24">
      <div className="mx-auto flex max-w-8xl overflow-x-auto px-2 [scrollbar-width:thin] sm:px-4">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => <a key={id} href={`#${id}`} aria-current={activeNav === id ? 'location' : undefined} onClick={event => { event.preventDefault(); scrollTo(id) }} className={`flex min-h-[62px] min-w-[104px] shrink-0 flex-col items-center justify-center gap-1 border-b-2 px-3 py-2 text-center text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500 sm:min-w-0 sm:flex-1 ${activeNav === id ? 'border-orange-500 text-orange-700' : 'border-transparent text-navy-800 hover:text-sky-700'}`}><Icon size={20} strokeWidth={2.2} aria-hidden="true" /><span className="whitespace-nowrap">{label}</span></a>)}
      </div>
    </nav>

    <div className="mx-auto grid max-w-8xl grid-cols-1 gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,2.65fr)_minmax(305px,1fr)] lg:gap-6 lg:px-8 lg:py-5">
      <main className="min-w-0 space-y-3">
        <section id="overview" className="scroll-mt-32 lg:scroll-mt-40" aria-labelledby="about-heading">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(220px,0.9fr)]">
            <div><SectionTitle id="about-heading" title={sectionTitle} /><p className="text-sm leading-[1.55] text-navy-800 sm:text-[15px]">{aboutText}</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-4">{FEATURES.map(({ icon: Icon, title, detail, color }) => <li key={detail} className="flex min-w-0 flex-col items-center text-center"><span className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm ${color}`}><Icon size={22} aria-hidden="true" /></span><span className="mt-1.5 text-xs font-semibold leading-tight text-navy-900">{title}<br />{detail}</span></li>)}</ul>
            </div>
            <div className="relative min-h-[205px] overflow-hidden rounded-lg bg-navy-900 shadow-sm sm:min-h-[230px] lg:min-h-[215px]"><img src={IMAGES.sunset} alt="Warm sunset over a natural grassland landscape" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" /><span className="absolute left-4 top-3 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white">Kaziranga landscapes</span><div className="absolute bottom-3 left-4 font-display text-lg font-bold text-white">Explore Kaziranga</div></div>
          </div>
        </section>

        <section aria-labelledby="attractions-title"><SectionTitle id="attractions-title" title="Major Attractions in Kaziranga" subtitle="Explore the diverse wildlife, landscapes and experiences that make Kaziranga a must-visit destination." /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{attractions.map(({ title, description, image, alt }) => <article key={title} className="group min-w-0 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"><div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={image} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></div><div className="p-2.5"><h3 className="font-display text-sm font-bold leading-tight text-navy-900">{title}</h3><p className="mt-1 text-xs leading-snug text-navy-700">{description}</p></div></article>)}</div></section>

        <section id="zones" className="scroll-mt-32 lg:scroll-mt-40" aria-labelledby="zones-title"><SectionTitle id="zones-title" title="Zones & Safari Options" subtitle="Explore Kaziranga through available safari experiences across its different tourism ranges." /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{ZONES.map(zone => <article key={zone.title} className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm"><div className="aspect-[2.7/1] overflow-hidden bg-slate-100"><img src={zone.image} alt={zone.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" /></div><div className="p-3"><h3 className="font-display text-base font-bold leading-tight text-navy-900">{zone.title}</h3><p className="mt-1 min-h-[40px] text-xs leading-snug text-navy-800">{zone.description}</p><button type="button" onClick={() => requestZoneQuote(zone.title)} className="mt-2 inline-flex min-h-9 w-full items-center justify-center gap-1 rounded-md border border-orange-500 px-3 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500">Request Safari Quote <ArrowRight size={14} aria-hidden="true" /></button></div></article>)}</div></section>

        <section id="wildlife" className="scroll-mt-32 lg:scroll-mt-40" aria-labelledby="wildlife-title"><SectionTitle id="wildlife-title" title="Wildlife of Kaziranga" subtitle="Discover the park’s remarkable wildlife. Animals live in their natural habitat, so sightings are never guaranteed." /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{WILDLIFE.map(item => <article key={item.name} className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm"><img src={item.image} alt={item.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" /><h3 className="px-2 py-2 text-center text-xs font-semibold leading-tight text-navy-900">{item.name}</h3></article>)}</div></section>

        <section id="gallery" className="scroll-mt-32 lg:scroll-mt-40" aria-labelledby="gallery-title"><SectionTitle id="gallery-title" title="Kaziranga Gallery" subtitle="Wildlife, grasslands and landscapes of Assam." /><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{galleryImages.map((item, index) => <button type="button" key={`${item.image}-${index}`} onClick={event => { galleryTriggerRef.current = event.currentTarget; setSelectedImage(item) }} aria-label={`Open image: ${item.alt}`} className="group aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"><img src={item.image} alt={item.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></button>)}</div></section>

        <section id="how-to-reach" className="scroll-mt-32 lg:scroll-mt-40" aria-labelledby="reach-title"><SectionTitle id="reach-title" title="How to Reach Kaziranga" subtitle="Plan your onward journey through Assam and check current transport schedules before departure." /><div className="grid gap-3 sm:grid-cols-3">{[{ icon: Plane, title: 'By Air', body: 'Check current flights to Jorhat and Guwahati and arrange onward road transport to the park.' }, { icon: TrainFront, title: 'By Train', body: 'Furkating and other Assam rail connections can be part of your journey. Verify current routes and onward transport.' }, { icon: Car, title: 'By Road', body: 'Kaziranga is connected by road with major Assam cities. Allow for changing traffic and road conditions.' }].map(({ icon: Icon, title, body }) => <article key={title} className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm"><Icon className="text-sky-800" size={24} aria-hidden="true" /><h3 className="mt-2 font-display text-lg font-bold text-navy-900">{title}</h3><p className="mt-1 text-sm leading-relaxed text-navy-700">{body}</p></article>)}</div></section>

        <section id="stay-options" className="scroll-mt-32 lg:scroll-mt-40" aria-labelledby="stay-title"><SectionTitle id="stay-title" title="Stay Options" /><div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-6 text-center"><Building2 className="mx-auto text-sky-800" size={28} aria-hidden="true" /><h3 className="mt-2 font-display text-lg font-bold text-navy-900">Stay Options Coming Soon</h3><p className="mt-1 text-sm text-navy-700">Accommodation information is not currently available for this destination. Contact our team for help planning your stay.</p></div></section>

        <section id="packages" className="scroll-mt-32 lg:scroll-mt-40" aria-labelledby="packages-title"><SectionTitle id="packages-title" title="Available Kaziranga Packages" subtitle="Active packages are loaded from MAQLAIM TOURS’s published packages service." />{packagesLoading ? <p className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-navy-700" role="status">Loading Kaziranga packages…</p> : packagesError ? <div className="rounded-lg border border-red-200 bg-red-50 p-5" role="alert"><h3 className="font-display text-lg font-bold text-navy-900">Unable to Load Packages</h3><p className="mt-1 text-sm text-navy-700">We couldn’t retrieve package information right now. You can still request a custom Kaziranga quote.</p><button type="button" onClick={() => { setActiveNav('overview'); quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">Request Custom Quote <ArrowRight size={16} aria-hidden="true" /></button></div> : packages.length ? <div className="grid gap-3 sm:grid-cols-2">{packages.map(pkg => <article key={pkg.id || pkg.slug} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><div className="aspect-[16/8] bg-slate-100"><img src={pkg.coverImage || pkg.image || IMAGES.grassland} alt={pkg.title || 'Kaziranga tour package'} loading="lazy" decoding="async" className="h-full w-full object-cover" /></div><div className="p-4"><h3 className="font-display text-lg font-bold text-navy-900">{pkg.title}</h3><p className="mt-1 text-xs text-navy-600">{[pkg.durationDays && `${pkg.durationDays} days`, pkg.durationNights != null && `${pkg.durationNights} nights`, pkg.destination || pkg.state].filter(Boolean).join(' · ')}</p>{(pkg.shortDescription || pkg.description) && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy-700">{pkg.shortDescription || pkg.description}</p>}{parseList(pkg.highlights).length > 0 && <ul className="mt-2 flex flex-wrap gap-1.5">{parseList(pkg.highlights).slice(0, 3).map((highlight, index) => <li key={`${index}-${highlight}`} className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] text-emerald-900">{typeof highlight === 'string' ? highlight : highlight.title || highlight.name}</li>)}</ul>}{pkg.startingPrice != null && pkg.startingPrice !== '' && Number.isFinite(Number(pkg.startingPrice)) && <p className="mt-2 text-sm font-semibold text-navy-900">Starting from {pkg.currency || 'INR'} {Number(pkg.startingPrice).toLocaleString('en-IN')}</p>}<div className="mt-3 flex flex-wrap gap-2"><Link to={`/packages/${pkg.slug || pkg.id}`} className="inline-flex min-h-10 items-center justify-center rounded-md border border-sky-700 px-4 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500">View Details</Link><button type="button" onClick={() => { setPackageSelection(pkg.id); setActiveNav('overview'); quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }} className="inline-flex min-h-10 items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">Enquire / Book</button></div></div></article>)}</div> : <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-5"><h3 className="font-display text-xl font-bold text-navy-900">Kaziranga Packages Coming Soon</h3><p className="mt-1 text-sm leading-relaxed text-navy-800">Our Kaziranga travel packages are currently being updated. You can still send us your travel dates and requirements for a customized Kaziranga trip.</p><button type="button" onClick={() => { setPackageSelection('custom'); setActiveNav('overview'); quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">Request Custom Quote <ArrowRight size={16} aria-hidden="true" /></button></div>}</section>

        <section id="travel-tips" className="scroll-mt-32 lg:scroll-mt-40" aria-labelledby="tips-title"><SectionTitle id="tips-title" title="Kaziranga Travel Tips" /><ul className="grid gap-2 sm:grid-cols-2">{['Follow park and safari rules.', 'Maintain a safe distance from wildlife.', 'Do not feed or disturb animals.', 'Carry suitable outdoor clothing.', 'Follow instructions from authorized guides and drivers.', 'Keep the park clean; avoid littering and single-use plastic where restricted.', 'Carry binoculars and cameras responsibly.', 'Check official guidance for current access and permitted items.'].map(tip => <li key={tip} className="flex items-start gap-2 rounded-md bg-slate-50 p-3 text-sm leading-relaxed text-navy-800"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{tip}</li>)}</ul></section>

        <section id="faqs" className="scroll-mt-32 lg:scroll-mt-40" aria-labelledby="faqs-title"><SectionTitle id="faqs-title" title="Frequently Asked Questions" /><div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">{FAQS.map(([question, answer]) => <details key={question} className="group px-4"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 font-semibold text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600"><span>{question}</span><ChevronDown size={17} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-4 pr-6 text-sm leading-relaxed text-navy-700">{answer}</p></details>)}</div></section>
      </main>

      <div ref={quoteRef} className="scroll-mt-32 lg:scroll-mt-40"><PlanSidebar packages={packages} destination={destination} selectedZone={selectedZone} onZoneClear={() => setSelectedZone('')} packageSelection={packageSelection} onPackageSelection={setPackageSelection} /></div>
    </div>

    {selectedImage && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label="Kaziranga photo viewer" onClick={() => setSelectedImage(null)}><button ref={galleryCloseRef} type="button" onClick={() => setSelectedImage(null)} aria-label="Close image viewer" className="absolute right-4 top-4 rounded-full bg-white/15 p-3 text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"><X size={22} /></button><figure className="max-h-[90vh] max-w-5xl" onClick={event => event.stopPropagation()}><img src={selectedImage.image} alt={selectedImage.alt} className="max-h-[82vh] w-auto max-w-full rounded-lg object-contain" /><figcaption className="mt-2 text-center text-sm text-white">{selectedImage.alt}</figcaption></figure></div>}
  </div>
}
