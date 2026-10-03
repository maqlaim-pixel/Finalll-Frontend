import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, CalendarDays, CarFront, Check, CheckCircle2,
  Clock3, Compass, Headphones, Luggage, MapPin, Plane, Search,
  ShieldCheck, Star, Users, X, LoaderCircle,
} from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import Breadcrumb from '../components/common/Breadcrumb'
import api from '../services/api'
import useLocalTravelFlow from '../hooks/useLocalTravelFlow'
import LocalTravelAuthPrompt from '../components/common/LocalTravelAuthPrompt'
import { LOCAL_TRANSFER_VEHICLES as VEHICLES } from '../data/localTransferVehicles'
import { resolveImageUrl } from '../utils/imageUtils'

const CITY_TOURS = [
  {
    name: 'Ahmedabad Heritage Tour', duration: '4 Hours',
    attractions: ['Sabarmati Ashram', 'Adalaj Stepwell', 'Kankaria Lake'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&h=520&q=82',
    alt: 'Ahmedabad heritage architecture and historic city sights',
  },
  {
    name: 'Ahmedabad City Highlights', duration: '4 Hours',
    attractions: ['Sidi Saiyyed Mosque', 'Law Garden', 'Riverfront'],
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=900&h=520&q=82',
    alt: 'Historic Ahmedabad mosque and city architecture',
  },
  {
    name: 'Spiritual Tour', duration: '4 Hours',
    attractions: ['Akshardham Temple', 'Hathee Singh Temple', 'Jama Masjid'],
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&h=520&q=82',
    alt: 'Ornate Indian temple architecture',
  },
  {
    name: 'Evening City Tour', duration: '4 Hours',
    attractions: ['Kankaria Lake', 'Atal Bridge', 'Science City', 'Local Markets'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&h=520&q=82',
    alt: 'A colorful waterfront at evening',
  },
]
const BASE_CITIES = [
  { name: 'Ahmedabad', slug: 'ahmedabad', fallbackTours: CITY_TOURS },
  { name: 'Jaipur', slug: 'jaipur', fallbackTours: [] },
  { name: 'Mumbai', slug: 'mumbai', fallbackTours: [] },
  { name: 'Delhi', slug: 'delhi', fallbackTours: [] },
]
const FEATURES = [
  { icon: Compass, label: 'Top Attractions' }, { icon: Clock3, label: 'Short Duration' },
  { icon: CalendarDays, label: 'Flexible Timings' }, { icon: CarFront, label: 'Comfortable Vehicles' },
  { icon: Users, label: 'Experienced Drivers' }, { icon: ShieldCheck, label: 'Safe & Secure' },
  { icon: BadgeCheck, label: 'Affordable Pricing' },
]
const REASONS = [
  'Well-planned short itineraries', 'Professional and experienced drivers',
  'Comfortable and clean vehicles', 'Flexible morning or evening timings',
  'Cover major attractions in limited time', 'Affordable and transparent pricing',
  'Safe and secure travel experience', 'Ideal for business travelers and families',
]
const STEPS = [
  { title: 'Select Tour', text: 'Choose your city & tour type', icon: Search },
  { title: 'Select Date & Time', text: 'Choose your preferred date', icon: CalendarDays },
  { title: 'Get Quote', text: 'Choose vehicle & confirm', icon: CarFront },
  { title: 'Enjoy Your Tour', text: 'Explore the city with comfort', icon: CheckCircle2 },
]
const fieldClass = 'mt-1.5 min-h-10 w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
const emptyForm = { city: '', tourDate: '', preferredTime: '', passengers: '1', vehicleType: '', name: '', email: '', phone: '' }

function Field({ id, label, error, children }) {
  return <div className="min-w-0"><label htmlFor={id} className="block text-xs font-medium text-navy-700">{label}</label>{children}{error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}</div>
}

function parseList(value) {
  if (Array.isArray(value)) return value.map(item => typeof item === 'string' ? item : item?.title || item?.name || '').filter(Boolean)
  if (typeof value !== 'string' || !value.trim()) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.map(item => typeof item === 'string' ? item : item?.title || item?.name || '').filter(Boolean)
  } catch {}
  return value.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean)
}

function isHalfDayPackage(pkg) {
  const text = `${pkg.title || ''} ${pkg.shortDescription || ''} ${pkg.description || ''} ${pkg.tags || ''} ${pkg.duration || ''}`.toLowerCase()
  if (!/half[\s-]?day/.test(text)) return false
  const days = Number(pkg.durationDays)
  return !Number.isFinite(days) || days <= 1
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function getCityName(pkg) {
  return String(pkg.destination || '').trim()
}

function makeAvailableTour(pkg, city) {
  const destinationHighlights = parseList(pkg.highlights)
  const packageImage = resolveImageUrl(pkg.coverImage || pkg.image)
  return {
    id: pkg.id ?? pkg.slug ?? null,
    name: pkg.title || `${city.name} Half Day Tour`,
    city: city.name,
    duration: pkg.duration || (Number(pkg.durationDays) === 1 ? '1 Day' : 'Duration confirmed on request'),
    overview: pkg.shortDescription || pkg.description || `${pkg.title || city.name} half day city tour. Contact our travel team to confirm the itinerary.`,
    attractions: destinationHighlights.length ? destinationHighlights : city.name === 'Ahmedabad' ? CITY_TOURS[0].attractions : [],
    image: packageImage || (city.name === 'Ahmedabad' ? CITY_TOURS[0].image : ''),
    alt: `${pkg.title || city.name} half day city tour`,
    inclusions: parseList(pkg.inclusions),
    exclusions: parseList(pkg.exclusions),
    isPublishedPackage: true,
  }
}

function makeFallbackTour(tour) {
  return { ...tour, id: null, city: 'Ahmedabad', overview: `${tour.name} is a suggested half day Ahmedabad itinerary. Pickup, itinerary details, timings and availability are confirmed by our travel expert when responding to your request.`, inclusions: [], exclusions: [], isPublishedPackage: false }
}

function DetailsModal({ titleId, labelledBy, triggerRef, onClose, children }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  useEffect(() => {
    const previousFocus = triggerRef?.current || document.activeElement
    closeRef.current?.focus()
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = Array.from(dialogRef.current?.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)') || [])
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown); previousFocus?.focus?.() }
  }, [onClose, triggerRef])
  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-navy-950/65 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy} aria-describedby={titleId} className="relative my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <button ref={closeRef} type="button" aria-label="Close details" onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 text-navy-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={19} /></button>
      {children}
    </section>
  </div>
}

function TourDetailsModal({ tour, onClose, onSelect, onEnquire, triggerRef }) {
  const inclusions = tour.inclusions.length ? tour.inclusions : ['No inclusions are specified for this itinerary; confirm details with our travel team.']
  return <DetailsModal labelledBy="half-tour-modal-title" titleId="half-tour-modal-overview" triggerRef={triggerRef} onClose={onClose}>
    {tour.image && <img src={tour.image} alt={tour.alt} className="h-48 w-full object-cover sm:h-60" />}
    <div className="space-y-4 p-5 sm:p-6">
      <div><p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{tour.isPublishedPackage ? 'Available MAQLAIM TOURS package' : 'Suggested itinerary · availability on request'}</p><h2 id="half-tour-modal-title" className="mt-1 font-display text-2xl font-bold text-navy-900">{tour.name}</h2><p className="mt-1 flex items-center gap-2 text-sm text-navy-600"><MapPin size={15} />{tour.city}<span aria-hidden="true">·</span><Clock3 size={15} />{tour.duration}</p></div>
      <div><h3 className="font-semibold text-navy-900">Tour Overview</h3><p id="half-tour-modal-overview" className="mt-1 text-sm leading-relaxed text-navy-700">{tour.overview}</p></div>
      <div><h3 className="font-semibold text-navy-900">Attractions Covered</h3>{tour.attractions.length ? <ul className="mt-1 grid gap-1 text-sm text-navy-700 sm:grid-cols-2">{tour.attractions.map(item => <li key={item} className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-orange-500" />{item}</li>)}</ul> : <p className="mt-1 text-sm text-navy-600">Attractions are confirmed with your itinerary.</p>}</div>
      <div className="grid gap-4 sm:grid-cols-2"><div><h3 className="font-semibold text-navy-900">Pickup Information</h3><p className="mt-1 text-sm text-navy-700">Your preferred pickup point and time are coordinated with our travel team.</p></div><div><h3 className="font-semibold text-navy-900">Tour Timings</h3><p className="mt-1 text-sm text-navy-700">Choose a preferred tour period in your request. Exact start time and availability are confirmed by our travel expert.</p></div></div>
      <div className="grid gap-4 sm:grid-cols-2"><div><h3 className="font-semibold text-navy-900">Vehicle Options</h3><p className="mt-1 text-sm text-navy-700">{VEHICLES.map(vehicle => vehicle.name).join(', ')} — availability is confirmed with your quote.</p></div><div><h3 className="font-semibold text-navy-900">What’s Included</h3><ul className="mt-1 space-y-1 text-sm text-navy-700">{inclusions.map(item => <li key={item} className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-green-600" />{item}</li>)}</ul></div></div>
      <div><h3 className="font-semibold text-navy-900">Important Information</h3><p className="mt-1 text-sm text-navy-700">Tour itinerary, pickup, entry tickets and vehicle availability are confirmed with your quote. No price or unlisted inclusion is assumed.{tour.exclusions.length > 0 ? ` Not included: ${tour.exclusions.join(', ')}.` : ''}</p></div>
      <div className="flex flex-col gap-2 pt-1 sm:flex-row"><button type="button" onClick={() => onSelect(tour)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2.5 font-bold text-white transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600">Select This Tour <ArrowRight size={17} /></button><button type="button" onClick={() => onEnquire(tour)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-orange-500 px-4 py-2.5 font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">Enquire Now <ArrowRight size={17} /></button></div>
    </div>
  </DetailsModal>
}

function VehicleDetailsModal({ vehicle, onClose, onSelect, triggerRef, passengers }) {
  return <DetailsModal labelledBy="half-vehicle-modal-title" titleId="half-vehicle-modal-description" triggerRef={triggerRef} onClose={onClose}>
    <img src={vehicle.image} alt={`${vehicle.name} vehicle`} className="h-40 w-full object-contain" />
    <div className="p-5"><h2 id="half-vehicle-modal-title" className="font-display text-2xl font-bold text-navy-900">{vehicle.name}</h2><p id="half-vehicle-modal-description" className="sr-only">Vehicle details and features</p><div className="mt-3 flex flex-wrap gap-4 text-sm text-navy-700"><span className="flex items-center gap-1"><Users size={16} />1–{vehicle.passengers} passengers</span><span className="flex items-center gap-1"><Luggage size={16} />{vehicle.luggage} bags</span></div><h3 className="mt-4 font-semibold text-navy-900">Vehicle Features</h3><ul className="mt-2 space-y-2">{vehicle.features.map(feature => <li key={feature} className="flex gap-2 text-sm text-navy-700"><CheckCircle2 size={16} className="shrink-0 text-green-600" />{feature}</li>)}</ul><p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-navy-600">Vehicle capacities are indicative. Availability and fare are confirmed by our travel expert.</p>{Number(passengers) > vehicle.passengers && <p role="alert" className="mt-3 text-sm text-red-700">The selected {vehicle.name} supports up to {vehicle.passengers} passengers. Please choose a larger vehicle.</p>}<button type="button" disabled={Number(passengers) > vehicle.passengers} onClick={() => onSelect(vehicle)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-3 font-bold text-white transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50">Select Vehicle <ArrowRight size={17} /></button></div>
  </DetailsModal>
}

export default function HalfDayCityTourPage() {
  const { form, setForm, user, authPromptOpen, setAuthPromptOpen, requireAuthentication, continueToAuth, clearDraft } = useLocalTravelFlow(emptyForm)
  const bookingRef = useRef(null)
  const cityFieldRef = useRef(null)
  const contactFieldRef = useRef(null)
  const vehicleFieldRef = useRef(null)
  const tourTriggerRef = useRef(null)
  const vehicleTriggerRef = useRef(null)
  const [packages, setPackages] = useState([])
  const [packagesLoaded, setPackagesLoaded] = useState(false)
  const [selectedCity, setSelectedCity] = useState(form.city || 'Ahmedabad')
  const [selectedTour, setSelectedTour] = useState(null)
  const [activeTour, setActiveTour] = useState(null)
  const [activeVehicle, setActiveVehicle] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('form')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    api.get('/packages?status=published')
      .then(response => { if (mounted) setPackages(Array.isArray(response.data) ? response.data : []) })
      .catch(() => { if (mounted) setPackages([]) })
      .finally(() => { if (mounted) setPackagesLoaded(true) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (user) setForm(previous => ({ ...previous, name: previous.name || user.name || '', email: previous.email || user.email || '', phone: previous.phone || user.phone || '' }))
  }, [user])

  const tourPackages = useMemo(() => packages.filter(isHalfDayPackage), [packages])
  const cities = useMemo(() => {
    const available = [...BASE_CITIES]
    tourPackages.forEach(pkg => {
      const name = getCityName(pkg)
      if (!name || available.some(city => city.name.toLowerCase() === name.toLowerCase())) return
      available.push({ name, slug: slugify(name), fallbackTours: [] })
    })
    return available
  }, [tourPackages])
  const city = cities.find(item => item.name === selectedCity) || cities.find(item => item.name === 'Ahmedabad') || BASE_CITIES[0]
  const availableTours = useMemo(() => tourPackages.filter(pkg => getCityName(pkg).toLowerCase() === city.name.toLowerCase()).map(pkg => makeAvailableTour(pkg, city)), [tourPackages, city])
  const tours = availableTours.length ? availableTours : tourPackages.length === 0 ? city.fallbackTours.map(makeFallbackTour) : []
  const visibleTours = tours
  const currentVehicle = VEHICLES.find(vehicle => vehicle.name === form.vehicleType)
  const todayDate = new Date()
  const today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`

  const updateCity = value => {
    setSelectedCity(value || BASE_CITIES[0].name)
    setForm(previous => ({ ...previous, city: value }))
    setSelectedTour(previous => value && previous?.city?.toLowerCase() === value.toLowerCase() ? previous : null)
    setErrors(previous => ({ ...previous, city: '', tour: '' }))
    if (status === 'error') setStatus('form')
  }

  const update = (key, value) => {
    setForm(previous => ({ ...previous, [key]: value }))
    setErrors(previous => ({ ...previous, [key]: '', ...(key === 'passengers' ? { vehicleType: '' } : {}) }))
    if (status === 'error') setStatus('form')
  }

  const focusBooking = fieldRef => {
    setStatus('form')
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => fieldRef?.current?.focus(), 400)
    })
  }

  const chooseTour = (tour, focusContact = false) => {
    updateCity(tour.city)
    const selected = { id: tour.id, name: tour.name, city: tour.city, duration: tour.duration }
    setSelectedTour(selected)
    setForm(previous => ({ ...previous, selectedTourId: String(tour.id || ''), selectedTourName: tour.name, selectedTourDuration: tour.duration }))
    setActiveTour(null)
    focusBooking(focusContact ? contactFieldRef : cityFieldRef)
  }

  const chooseVehicle = vehicle => {
    update('vehicleType', vehicle.name)
    setActiveVehicle(null)
    focusBooking(vehicleFieldRef)
  }

  const chooseAnotherCity = () => {
    const other = cities.find(item => item.name !== selectedCity && (tourPackages.some(pkg => getCityName(pkg).toLowerCase() === item.name.toLowerCase()) || (tourPackages.length === 0 && item.fallbackTours.length))) || cities.find(item => item.name !== selectedCity)
    if (other) updateCity(other.name)
    requestAnimationFrame(() => document.getElementById('halfDayCityTourFilter')?.focus())
  }

  const validate = () => {
    const next = {}
    if (!form.city || !cities.some(item => item.name === form.city)) next.city = 'Please select a city.'
    if (!form.tourDate) next.tourDate = 'Please select a tour date.'
    else if (form.tourDate < today) next.tourDate = 'Tour date cannot be in the past.'
    if (!form.passengers) next.passengers = 'Please select number of passengers.'
    if (!form.vehicleType) next.vehicleType = 'Please select a vehicle type.'
    else if (currentVehicle && Number(form.passengers) > currentVehicle.passengers) next.vehicleType = `The selected ${currentVehicle.name} supports up to ${currentVehicle.passengers} passengers. Please choose a larger vehicle.`
    if (!tours.length) next.tour = 'No half day city tours are currently available for this city. Please choose another city or contact us.'
    if (!(form.name.trim() || user?.name?.trim())) next.name = 'Please enter your name.'
    if (!(form.email.trim() || user?.email?.trim()) && !(form.phone.trim() || user?.phone?.trim())) next.contact = 'Please provide an email address or phone number so our team can contact you.'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (form.phone.trim() && !/^[+\d][\d\s()-]{6,19}$/.test(form.phone.trim())) next.phone = 'Please enter a valid phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (submitting) return
    if (!user) { requireAuthentication(); return }
    if (!validate()) return
    setSubmitting(true)
    setStatus('submitting')
    try {
      const vehicle = VEHICLES.find(item => item.name === form.vehicleType)
      if (!vehicle || Number(form.passengers) > vehicle.passengers) {
        setErrors(previous => ({ ...previous, vehicleType: `The selected vehicle supports up to ${vehicle?.passengers || 0} passengers. Please choose a larger vehicle.` }))
        setStatus('form')
        return
      }
      const selected = selectedTour?.city?.toLowerCase() === form.city.toLowerCase() ? selectedTour : null
      const details = [
        'Service: Half Day City Tour', `City: ${form.city}`,
        `Tour name: ${selected?.name || 'Please recommend a half day tour'}`,
        selected?.id && `Tour ID: ${selected.id}`,
        `Tour duration: ${selected?.duration || 'Half day (confirm with travel expert)'}`,
        `Tour date: ${form.tourDate}`, `Passengers: ${form.passengers}`,
        `Vehicle type: ${form.vehicleType}`,
        `Preferred time of day: ${form.preferredTime || 'Flexible; to be discussed'}`,
        'Time of day is a preference only. Exact schedule and availability will be confirmed by our travel expert.',
        'Request type: Quote enquiry; not a confirmed booking.',
      ].filter(Boolean).join('\n')
      await api.post('/local-travel/enquiries', {
        serviceType: 'half-day-city-tour',
        formData: { ...form, selectedTourId: selected?.id ? String(selected.id) : '', selectedTourName: selected?.name || 'Please recommend a half day tour', selectedTourDuration: selected?.duration || 'Half day (confirm with travel expert)' },
        sourceUrl: window.location.pathname,
      })
      clearDraft()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const closeTour = useCallback(() => setActiveTour(null), [])
  const closeVehicle = useCallback(() => setActiveVehicle(null), [])

  return <div className="min-w-0 overflow-x-hidden bg-white text-navy-900">
    <SEOHead title="Half Day City Tours in India | MAQLAIM TOURS" description="Explore popular cities with MAQLAIM TOURS half day city tours. Discover major attractions in less time with comfortable vehicles, flexible timings and professional drivers." />

    <section className="relative isolate min-h-[215px] overflow-hidden bg-navy-950 text-white sm:min-h-[235px] lg:min-h-[250px]" aria-labelledby="half-day-city-tour-title">
      <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2200&q=88" alt="Travelers exploring Indian heritage architecture at golden hour" loading="eager" className="absolute inset-0 h-full w-full object-cover object-[50%_52%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-navy-950/15" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[215px] max-w-8xl items-center px-4 py-4 sm:min-h-[235px] sm:px-6 lg:min-h-[250px] lg:px-8">
        <div className="max-w-3xl"><Breadcrumb light items={[{ label: 'Local Travel', href: '/local-travel/airport-transfer' }, { label: 'Half Day City Tour' }]} /><h1 id="half-day-city-tour-title" className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"><span className="text-white">Half Day </span><span className="text-gold-500">City Tour</span></h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/95 sm:text-base">Discover the best of the city in a short and convenient half day tour. Perfect for travelers with limited time, our half day city tours cover major attractions with comfortable transportation and expert local drivers.</p></div>
        <div className="pointer-events-none absolute bottom-5 right-5 hidden rotate-[-6deg] text-right font-display text-2xl italic leading-tight text-white drop-shadow-lg lg:block xl:right-10 xl:text-3xl" aria-hidden="true"><span>See More<br />in Less Time</span><span className="mt-2 flex items-center justify-end gap-2"><span className="block w-12 border-b border-dashed border-white/90" /><Plane size={23} /></span></div>
      </div>
    </section>

    <section aria-label="Half day city tour features" className="border-b border-gray-100 bg-[#fcfaf6]"><div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto px-3 py-2.5 [scrollbar-width:thin] min-[1280px]:justify-between min-[1280px]:px-8">{FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-[128px] shrink-0 flex-col items-center justify-center gap-1 border-r border-orange-100 px-3 text-center last:border-0 min-[1280px]:min-w-0 min-[1280px]:flex-1"><Icon size={20} strokeWidth={2.2} className="text-orange-600" aria-hidden="true" /><span className="whitespace-nowrap text-xs font-medium text-navy-800">{label}</span></div>)}</div></section>

    <div className="mx-auto grid max-w-8xl grid-cols-1 items-start gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,2.55fr)_minmax(310px,0.95fr)] lg:gap-5 lg:px-8 lg:py-5">
      <main className="min-w-0 space-y-4">
        <section aria-labelledby="half-day-tour-list-title">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="half-day-tour-list-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Popular Half Day City Tours</h2><p className="mt-1 text-sm text-navy-700">Explore the most popular half day city tour packages designed for a quick and memorable experience.</p></div><div className="flex items-center gap-2 sm:pb-1"><label htmlFor="halfDayCityTourFilter" className="whitespace-nowrap text-sm font-semibold text-navy-900">Select City</label><select id="halfDayCityTourFilter" className={`${fieldClass} mt-0 min-w-40`} value={selectedCity} onChange={event => updateCity(event.target.value)}>{cities.map(item => <option key={item.slug} value={item.name}>{item.name}</option>)}</select></div></div>
          {!packagesLoaded ? <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading half day city tours">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-xl border border-gray-100 bg-gray-50" />)}</div> : visibleTours.length === 0 ? <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-7 text-center"><h3 className="font-display text-lg font-bold text-navy-900">No Half Day City Tours Available</h3><p className="mt-1 text-sm text-navy-700">We currently don't have a half day city tour available for this city. Please choose another city or contact our travel experts.</p><div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row"><button type="button" onClick={chooseAnotherCity} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">Choose Another City <ArrowRight size={15} /></button><Link to="/contact" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 text-sm font-bold text-white hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600">Contact Us <ArrowRight size={15} /></Link></div></div> : <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{visibleTours.map((tour, index) => <article key={tour.id || `${tour.city}-${tour.name}-${index}`} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"><div className="h-32 overflow-hidden sm:h-32">{tour.image ? <img src={tour.image} alt={tour.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-100 to-orange-50 text-sm text-navy-700">{tour.city} sightseeing</div>}</div><div className="flex flex-1 flex-col p-3"><h3 className="font-display text-lg font-bold leading-tight text-navy-900">{tour.name}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><Clock3 size={15} className="shrink-0 text-orange-600" />{tour.duration}</p>{!tour.isPublishedPackage && <p className="mt-1 text-[10px] font-medium text-navy-500">Suggested itinerary · availability on request</p>}<p className="mt-1.5 flex min-h-[48px] items-start gap-1.5 text-xs leading-snug text-navy-700"><MapPin size={15} className="mt-0.5 shrink-0 text-orange-600" /><span>{tour.attractions.length ? `${tour.attractions.join(', ')} and more` : 'Attractions to be confirmed'}</span></p><button type="button" onClick={event => { tourTriggerRef.current = event.currentTarget; setActiveTour(tour) }} className="mt-auto flex min-h-8 w-full items-center justify-center gap-2 rounded-lg border border-orange-500 px-3 py-1.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">View Details <ArrowRight size={15} /></button></div></article>)}</div>}
        </section>

        <section aria-labelledby="half-day-vehicles-title"><h2 id="half-day-vehicles-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Vehicle Options</h2><p className="mt-1 text-sm text-navy-700">Choose from a wide range of well-maintained vehicles for your half day city tour.</p><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{VEHICLES.map(vehicle => <article key={vehicle.name} className="group min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md"><img src={vehicle.image} alt={`${vehicle.name} vehicle`} loading="lazy" decoding="async" className="h-20 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-24" /><h3 className="mt-1 truncate font-display text-base font-bold text-navy-900">{vehicle.name}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Users size={13} aria-hidden="true" />1–{vehicle.passengers} Passengers</p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Luggage size={13} aria-hidden="true" />{vehicle.luggage} Bags</p><button type="button" onClick={event => { vehicleTriggerRef.current = event.currentTarget; setActiveVehicle(vehicle) }} className="mt-2 flex min-h-8 w-full items-center justify-center gap-1 rounded-full border border-orange-400 px-2 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">View Details <ArrowRight size={13} aria-hidden="true" /></button></article>)}</div></section>

        <section className="rounded-xl bg-gradient-to-r from-gray-50 to-sky-50/50 px-4 py-4 sm:px-5" aria-labelledby="half-day-process-title"><h2 id="half-day-process-title" className="font-display text-xl font-bold text-navy-900 sm:text-2xl">Simple Booking Process</h2><p className="mt-0.5 text-sm text-navy-700">Book your half day city tour in just a few easy steps.</p><ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{STEPS.map(({ title, text, icon: Icon }, index) => <li key={title} className="relative flex items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">{index + 1}</span><Icon size={21} className="shrink-0 text-navy-800" aria-hidden="true" /><div className="min-w-0"><h3 className="text-xs font-semibold text-navy-900">{title}</h3><p className="text-[11px] leading-snug text-navy-600">{text}</p></div>{index < STEPS.length - 1 && <ArrowRight size={17} className="absolute -right-1 top-1/2 hidden -translate-y-1/2 text-sky-800 xl:block" aria-hidden="true" />}</li>)}</ol></section>
      </main>

      <aside className="min-w-0 space-y-3 lg:sticky lg:top-24 lg:self-start">
        <section ref={bookingRef} id="half-day-city-tour-booking" tabIndex={-1} className="scroll-mt-24 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" aria-labelledby="half-day-booking-title"><div className="flex items-center gap-2 bg-sky-50 px-3 py-2.5"><CarFront size={25} className="text-sky-600" aria-hidden="true" /><div className="min-w-0"><h2 id="half-day-booking-title" className="font-display text-base font-bold leading-tight text-navy-900 sm:text-lg">Book Your Half Day City Tour</h2><p className="text-[11px] text-navy-700">Send your half day city tour request and let our travel experts help you plan your trip.</p></div></div>
          {status === 'success' ? <div className="p-5 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={27} /></span><h3 className="mt-3 font-display text-lg font-bold text-navy-900">Half Day City Tour Request Submitted</h3><p className="mt-2 text-sm leading-relaxed text-navy-700">Thank you. We have received your half day city tour request. Our travel expert will contact you shortly.</p><div className="mt-4 flex flex-col gap-2"><Link to="/local-travel/full-day-city-tour" className="rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50">Explore Local Travel</Link><Link to="/" className="rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-600">Back to Home</Link></div></div> : <form className="space-y-2.5 p-3" onSubmit={handleSubmit} noValidate>
            {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><strong className="block">Unable to Submit Request</strong><span>Something went wrong while sending your half day city tour request. Please try again.</span><button type="button" onClick={() => setStatus('form')} className="mt-1 block font-semibold underline">Try Again</button></div>}
            {Object.keys(errors).length > 0 && <p className="sr-only" role="alert">Please correct the highlighted fields.</p>}
            <div className="space-y-2.5">
              <Field id="halfDayBookingCity" label="Select City" error={errors.city}><select ref={cityFieldRef} id="halfDayBookingCity" required aria-required="true" aria-invalid={Boolean(errors.city)} className={fieldClass} value={form.city} onChange={event => updateCity(event.target.value)}><option value="">Choose City</option>{cities.map(item => <option key={item.slug} value={item.name}>{item.name}</option>)}</select></Field>
              <Field id="halfDayTourDate" label="Tour Date" error={errors.tourDate}><input id="halfDayTourDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.tourDate)} min={today} className={fieldClass} value={form.tourDate} onChange={event => update('tourDate', event.target.value)} /></Field>
              <Field id="halfDayPreferredTime" label="Preferred Time (optional)"><select id="halfDayPreferredTime" className={fieldClass} value={form.preferredTime} onChange={event => update('preferredTime', event.target.value)}><option value="">Flexible / No preference</option><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Evening">Evening</option></select><p className="mt-1 text-[10px] text-navy-500">A preference only; actual timing is confirmed by our travel expert.</p></Field>
              <Field id="halfDayPassengers" label="Number of Passengers" error={errors.passengers}><select id="halfDayPassengers" required aria-required="true" aria-invalid={Boolean(errors.passengers)} className={fieldClass} value={form.passengers} onChange={event => update('passengers', event.target.value)}>{Array.from({ length: 12 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>)}</select></Field>
              <Field id="halfDayVehicleType" label="Vehicle Type" error={errors.vehicleType}><select ref={vehicleFieldRef} id="halfDayVehicleType" required aria-required="true" aria-invalid={Boolean(errors.vehicleType)} className={fieldClass} value={form.vehicleType} onChange={event => update('vehicleType', event.target.value)}><option value="">Select Vehicle</option>{VEHICLES.map(vehicle => <option key={vehicle.name} value={vehicle.name}>{vehicle.name} (up to {vehicle.passengers})</option>)}</select></Field>
              {currentVehicle && Number(form.passengers) > currentVehicle.passengers && <p className="rounded bg-amber-50 p-2 text-xs text-amber-800" role="status">The selected {currentVehicle.name} supports up to {currentVehicle.passengers} passengers. Please choose a larger vehicle.</p>}
              {selectedTour && selectedTour.city.toLowerCase() === form.city.toLowerCase() && <p className="rounded bg-sky-50 p-2 text-xs text-sky-900"><span className="font-semibold">Selected tour:</span> {selectedTour.name} · {selectedTour.duration}</p>}
              {errors.tour && <p className="text-xs text-red-600" role="alert">{errors.tour}</p>}
            </div>
            <details className="rounded-lg border border-gray-100 px-3 py-2 text-xs" open={!user}><summary className="cursor-pointer font-medium text-sky-800">Contact details {!user && '(required)'}</summary><div className="mt-2 space-y-2"><Field id="halfDayName" label="Full Name" error={errors.name}><input ref={contactFieldRef} id="halfDayName" autoComplete="name" aria-invalid={Boolean(errors.name)} className={fieldClass} value={form.name} onChange={event => update('name', event.target.value)} /></Field><Field id="halfDayEmail" label="Email" error={errors.email}><input id="halfDayEmail" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={fieldClass} value={form.email} onChange={event => update('email', event.target.value)} /></Field><Field id="halfDayPhone" label="Phone" error={errors.phone}><input id="halfDayPhone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} className={fieldClass} value={form.phone} onChange={event => update('phone', event.target.value)} /></Field>{errors.contact && <p className="text-xs text-red-600" role="alert">{errors.contact}</p>}<p className="text-[11px] text-navy-500">Your signed-in account details are filled in when available. Otherwise, enter a name and one contact method.</p></div></details>
            <button type="submit" disabled={submitting} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{submitting ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Submitting...</> : <>Get Quote <ArrowRight size={17} aria-hidden="true" /></>}</button>
            <p className="text-center text-[10px] text-navy-500">No estimated fare is generated. Tour and vehicle availability are confirmed by our team.</p>
          </form>}
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="half-day-why-title"><h2 id="half-day-why-title" className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 font-display text-base font-bold leading-tight text-navy-900 sm:text-lg"><Star size={20} className="fill-gold-400 text-gold-500" aria-hidden="true" />Why Choose Our Half Day City Tour?</h2><ul className="space-y-1.5 px-3 py-3">{REASONS.map(reason => <li key={reason} className="flex items-start gap-2 text-xs leading-snug text-navy-800"><CheckCircle2 size={15} className="mt-0.5 shrink-0 fill-green-600 text-white" aria-hidden="true" />{reason}</li>)}</ul></section>
        <section className="rounded-xl border border-gold-100 bg-amber-50/70 p-4" aria-labelledby="half-day-help-title"><div className="flex items-start gap-3"><Headphones size={26} className="shrink-0 text-orange-500" aria-hidden="true" /><div><h2 id="half-day-help-title" className="font-display text-lg font-bold text-navy-900">Need Help?</h2><p className="mt-1 text-sm leading-snug text-navy-700">Our travel experts are available 24/7 to help you plan your perfect half day city tour.</p><Link to="/contact" className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 text-sm font-bold text-white hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2">Contact Us <ArrowRight size={15} aria-hidden="true" /></Link></div></div></section>
      </aside>
    </div>

    {activeTour && <TourDetailsModal tour={activeTour} triggerRef={tourTriggerRef} onClose={closeTour} onSelect={chooseTour} onEnquire={tour => chooseTour(tour, true)} />}
    {activeVehicle && <VehicleDetailsModal vehicle={activeVehicle} triggerRef={vehicleTriggerRef} passengers={form.passengers} onClose={closeVehicle} onSelect={chooseVehicle} />}
    {authPromptOpen && <LocalTravelAuthPrompt onClose={() => setAuthPromptOpen(false)} onContinue={continueToAuth} />}
  </div>
}
