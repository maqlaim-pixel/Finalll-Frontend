import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, CalendarDays, CarFront, Check, CheckCircle2,
  Clock3, Compass, Headphones, Luggage, MapPin, Plane, Search,
  ShieldCheck, Star, UserRound, Users, X, LoaderCircle,
} from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import Breadcrumb from '../components/common/Breadcrumb'
import api from '../services/api'
import useLocalTravelFlow from '../hooks/useLocalTravelFlow'
import LocalTravelAuthPrompt from '../components/common/LocalTravelAuthPrompt'
import { LOCAL_TRANSFER_VEHICLES as VEHICLES } from '../data/localTransferVehicles'
import { resolveImageUrl } from '../utils/imageUtils'

const CITIES = [
  { name: 'Ahmedabad', slug: 'ahmedabad', attractions: ['Sabarmati Ashram', 'Adalaj Stepwell', 'Kankaria Lake', 'Heritage Walk'], image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=900&h=520&q=82', alt: 'Historic Ahmedabad architecture in warm afternoon light' },
  { name: 'Jaipur', slug: 'jaipur', attractions: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar'], image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&h=520&q=82', alt: 'Jaipur pink sandstone palace and heritage architecture' },
  { name: 'Mumbai', slug: 'mumbai', attractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Colaba'], image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&h=520&q=82', alt: 'Gateway of India beside the Mumbai waterfront' },
  { name: 'Delhi', slug: 'delhi', attractions: ['India Gate', 'Qutub Minar', 'Red Fort', 'Lotus Temple'], image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&h=520&q=82', alt: 'Historic Indian heritage architecture in Delhi' },
]
const FEATURES = [
  { icon: Compass, label: 'Top Attractions' }, { icon: MapPin, label: 'Custom Itinerary' },
  { icon: Users, label: 'Family Friendly' }, { icon: CarFront, label: 'Comfortable Vehicles' },
  { icon: UserRound, label: 'Experienced Drivers' }, { icon: ShieldCheck, label: 'Safe & Secure' },
  { icon: Clock3, label: 'Flexible Timings' }, { icon: BadgeCheck, label: 'Affordable Pricing' },
]
const REASONS = [
  'Well-planned and curated itineraries', 'Professional and experienced drivers',
  'Comfortable and clean vehicles', 'Visit top attractions in one day',
  'Flexible itinerary as per your interest', 'Affordable and transparent pricing',
  'Safe and secure travel experience', 'Ideal for families, groups and corporate travelers',
]
const STEPS = [
  { title: 'Select City', text: 'Choose your destination', icon: Search },
  { title: 'Select Date', text: 'Choose your travel date', icon: CalendarDays },
  { title: 'Get Quote', text: 'Choose vehicle & confirm', icon: CarFront },
  { title: 'Enjoy Your Tour', text: 'Explore the city with comfort', icon: CheckCircle2 },
]
const fieldClass = 'mt-1.5 min-h-10 w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
const initialForm = { city: 'Ahmedabad', tourDate: '', passengers: '1', vehicleType: '', name: '', email: '', phone: '' }

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

function matchesCityTour(pkg, city) {
  const text = `${pkg.title || ''} ${pkg.shortDescription || ''} ${pkg.description || ''} ${pkg.tags || ''}`.toLowerCase()
  const cityFields = `${pkg.destination || ''} ${pkg.state || ''} ${pkg.title || ''} ${pkg.tags || ''}`.toLowerCase()
  const hasCity = cityFields.includes(city.name.toLowerCase())
  const hasTourSignal = /city tour|full[\s-]?day|sightseeing/.test(text)
  const itinerary = parseList(pkg.itinerary)
  const hasSameDayItinerary = itinerary.length > 0 && Number(pkg.durationDays) <= 1 && !/package|tourism|holiday/i.test(text)
  const days = Number(pkg.durationDays)
  return hasCity && (hasTourSignal || hasSameDayItinerary) && (!days || days <= 1)
}

function makePackageTour(pkg, city) {
  const id = pkg.id ?? pkg.slug ?? null
  const highlights = parseList(pkg.highlights)
  const duration = Number(pkg.durationDays) === 1 ? '1 Day' : Number(pkg.durationDays) > 1 ? `${pkg.durationDays} Days` : 'Duration confirmed on request'
  return {
    id,
    name: pkg.title || `${city.name} City Tour`,
    city: city.name,
    duration,
    overview: pkg.shortDescription || pkg.description || `${pkg.title || city.name} sightseeing tour. Contact our travel experts for itinerary details.`,
    attractions: highlights.length ? highlights : city.attractions,
    image: resolveImageUrl(pkg.coverImage || pkg.image) || city.image,
    alt: `${pkg.title || city.name} tour in ${city.name}`,
    inclusions: parseList(pkg.inclusions),
    exclusions: parseList(pkg.exclusions),
    package: pkg,
    isFallback: false,
  }
}

function makeGuideTour(city) {
  return {
    id: null,
    name: `${city.name} City Tour`,
    city: city.name,
    duration: '8 Hours',
    overview: `Explore ${city.name}'s popular landmarks in a flexible full-day sightseeing itinerary. This suggested city itinerary is presented for enquiry; schedule and availability are confirmed by our travel team.`,
    attractions: city.attractions,
    image: city.image,
    alt: city.alt,
    inclusions: [],
    exclusions: [],
    package: null,
    isFallback: true,
  }
}

function TourDetailsModal({ tour, onClose, onSelect }) {
  const closeRef = useRef(null)
  useEffect(() => {
    const previousFocus = document.activeElement
    closeRef.current?.focus()
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = Array.from(document.querySelectorAll('[role="dialog"] button:not(:disabled), [role="dialog"] a[href], [role="dialog"] input:not(:disabled), [role="dialog"] select:not(:disabled), [role="dialog"] textarea:not(:disabled)'))
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown); previousFocus?.focus?.() }
  }, [onClose])
  const inclusions = tour.inclusions.length ? tour.inclusions : ['No inclusions are specified for this itinerary; confirm details with our travel team.']
  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-navy-950/65 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="tour-modal-title" className="relative my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <button ref={closeRef} type="button" aria-label="Close tour details" onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 text-navy-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={19} /></button>
      <img src={tour.image} alt={tour.alt} className="h-48 w-full object-cover sm:h-60" />
      <div className="space-y-4 p-5 sm:p-6">
        <div><p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{tour.isFallback ? 'Suggested city itinerary' : 'Available MAQLAIM TOURS package'}</p><h2 id="tour-modal-title" className="mt-1 font-display text-2xl font-bold text-navy-900">{tour.name}</h2><p className="mt-1 flex items-center gap-2 text-sm text-navy-600"><MapPin size={15} />{tour.city}<span aria-hidden="true">·</span><Clock3 size={15} />{tour.duration}</p></div>
        <div><h3 className="font-semibold text-navy-900">Tour Overview</h3><p className="mt-1 text-sm leading-relaxed text-navy-700">{tour.overview}</p></div>
        <div><h3 className="font-semibold text-navy-900">Attractions Covered</h3><ul className="mt-1 grid gap-1 text-sm text-navy-700 sm:grid-cols-2">{tour.attractions.map(item => <li key={item} className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-orange-500" />{item}</li>)}</ul></div>
        <div className="grid gap-4 sm:grid-cols-2"><div><h3 className="font-semibold text-navy-900">Pickup Information</h3><p className="mt-1 text-sm text-navy-700">Pickup point and time will be coordinated with you after your request.</p></div><div><h3 className="font-semibold text-navy-900">Vehicle Options</h3><p className="mt-1 text-sm text-navy-700">{VEHICLES.map(vehicle => vehicle.name).join(', ')} — final availability is confirmed by our travel team.</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2"><div><h3 className="font-semibold text-navy-900">What’s Included</h3><ul className="mt-1 space-y-1 text-sm text-navy-700">{inclusions.map(item => <li key={item} className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-green-600" />{item}</li>)}</ul></div><div><h3 className="font-semibold text-navy-900">Important Information</h3><p className="mt-1 text-sm text-navy-700">Itinerary, timings, entry tickets and vehicle availability are confirmed with your quote. No price or unlisted inclusion is assumed.</p>{tour.exclusions.length > 0 && <p className="mt-1 text-sm text-navy-600">Not included: {tour.exclusions.join(', ')}</p>}</div></div>
        <div className="flex flex-col gap-2 pt-1 sm:flex-row"><button type="button" onClick={() => onSelect(tour)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2.5 font-bold text-white transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600">Select This Tour <ArrowRight size={17} /></button><button type="button" onClick={() => onSelect(tour)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-orange-500 px-4 py-2.5 font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">Enquire Now <ArrowRight size={17} /></button></div>
      </div>
    </section>
  </div>
}

export default function FullDayCityTourPage() {
  const { form, setForm, user, authPromptOpen, setAuthPromptOpen, requireAuthentication, continueToAuth, clearDraft } = useLocalTravelFlow(initialForm)
  const bookingRef = useRef(null)
  const cityFieldRef = useRef(null)
  const vehicleTriggerRef = useRef(null)
  const [packages, setPackages] = useState([])
  const [packagesLoaded, setPackagesLoaded] = useState(false)
  const [selectedCity, setSelectedCity] = useState(form.city || 'Ahmedabad')
  const [cityFilterTouched, setCityFilterTouched] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)
  const [activeTour, setActiveTour] = useState(null)
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

  const city = CITIES.find(item => item.name === selectedCity) || CITIES[0]
  const toursByCity = useMemo(() => {
    if (!packagesLoaded) return []
    return CITIES.map(cityOption => {
      const publishedCityTours = packages.filter(pkg => matchesCityTour(pkg, cityOption)).map(pkg => makePackageTour(pkg, cityOption))
      return publishedCityTours.length ? publishedCityTours : [makeGuideTour(cityOption)]
    })
  }, [packages, packagesLoaded])
  const selectedCityTours = toursByCity.find(toursForCity => toursForCity[0]?.city === city.name) || []
  const visibleTours = cityFilterTouched ? selectedCityTours : toursByCity.flat()
  const currentVehicle = VEHICLES.find(vehicle => vehicle.name === form.vehicleType)
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const closeTourModal = useCallback(() => setActiveTour(null), [])
  const closeVehicleModal = () => {
    setActiveTour(null)
    requestAnimationFrame(() => vehicleTriggerRef.current?.focus())
  }

  const updateCity = value => {
    setSelectedCity(value)
    setCityFilterTouched(true)
    setForm(previous => ({ ...previous, city: value }))
    setSelectedTour(previous => previous?.city === value ? previous : null)
    setErrors(previous => ({ ...previous, city: '' }))
    if (status === 'error') setStatus('form')
  }

  const update = (key, value) => {
    setForm(previous => ({ ...previous, [key]: value }))
    setErrors(previous => ({ ...previous, [key]: '', ...(key === 'passengers' ? { vehicleType: '' } : {}) }))
    if (status === 'error') setStatus('form')
  }

  const chooseTour = tour => {
    updateCity(tour.city)
    const selected = { id: tour.id, name: tour.name, city: tour.city, duration: tour.duration }
    setSelectedTour(selected)
    setForm(previous => ({ ...previous, selectedTourId: String(tour.id || ''), selectedTourName: tour.name, selectedTourDuration: tour.duration }))
    setActiveTour(null)
    setStatus('form')
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => cityFieldRef.current?.focus(), 400)
    })
  }

  const chooseVehicle = vehicle => {
    update('vehicleType', vehicle.name)
    setActiveTour(null)
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => document.getElementById('cityTourVehicleType')?.focus(), 400)
    })
  }

  const validate = () => {
    const next = {}
    if (!form.city) next.city = 'Please select a city.'
    if (!form.tourDate) next.tourDate = 'Please select a tour date.'
    else if (form.tourDate < today) next.tourDate = 'Tour date cannot be in the past.'
    if (!form.passengers) next.passengers = 'Please select number of passengers.'
    if (!form.vehicleType) next.vehicleType = 'Please select a vehicle type.'
    else if (currentVehicle && Number(form.passengers) > currentVehicle.passengers) next.vehicleType = `The selected vehicle supports up to ${currentVehicle.passengers} passengers. Please choose a larger vehicle.`
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
      const selectedCityTour = selectedTour?.city === form.city ? selectedTour : null
      const details = [
        'Service: Full Day City Tour',
        `City: ${form.city}`,
        `Tour name: ${selectedCityTour?.name || `${form.city} City Tour`}`,
        selectedCityTour?.id && `Tour ID: ${selectedCityTour.id}`,
        `Tour duration: ${selectedCityTour?.duration || 'Full day (itinerary to confirm)'}`,
        `Tour date: ${form.tourDate}`,
        `Passengers: ${form.passengers}`,
        `Vehicle type: ${form.vehicleType}`,
        'Request type: Quote enquiry; not a confirmed booking.',
      ].filter(Boolean).join('\n')
      await api.post('/local-travel/enquiries', {
        serviceType: 'full-day-city-tour',
        formData: { ...form, selectedTourId: selectedCityTour?.id ? String(selectedCityTour.id) : '', selectedTourName: selectedCityTour?.name || `${form.city} City Tour`, selectedTourDuration: selectedCityTour?.duration || 'Full day (itinerary to confirm)' },
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

  return <div className="min-w-0 overflow-x-hidden bg-white text-navy-900">
    <SEOHead title="Full Day City Tours in India | MAQLAIM TOURS" description="Explore popular Indian cities with MAQLAIM TOURS full day city tours. Enjoy comfortable transportation, curated sightseeing itineraries and flexible vehicle options." />

    <section className="relative isolate min-h-[215px] overflow-hidden bg-navy-950 text-white sm:min-h-[235px] lg:min-h-[250px]" aria-labelledby="city-tour-title">
      <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2200&q=88" alt="Indian heritage palace in warm golden-hour light with travelers exploring" fetchpriority="high" className="absolute inset-0 h-full w-full object-cover object-[50%_52%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-navy-950/15" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[215px] max-w-8xl items-center px-4 py-4 sm:min-h-[235px] sm:px-6 lg:min-h-[250px] lg:px-8">
        <div className="max-w-3xl">
          <Breadcrumb light items={[{ label: 'Local Travel', href: '/local-travel/airport-transfer' }, { label: 'Full Day City Tour' }]} />
          <h1 id="city-tour-title" className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"><span className="text-white">Full Day </span><span className="text-gold-500">City Tour</span></h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/95 sm:text-base">Explore the city's top attractions in one day with our curated full day city tours. Comfortable transportation, expert drivers and flexible itineraries for a memorable sightseeing experience.</p>
        </div>
        <div className="pointer-events-none absolute bottom-5 right-5 hidden rotate-[-6deg] text-right font-display text-2xl italic leading-tight text-white drop-shadow-lg lg:block xl:right-10 xl:text-3xl" aria-hidden="true"><span>Discover<br />Explore<br />Experience<br />the City</span><span className="mt-1 flex items-center justify-end gap-2 text-white"><span className="block w-12 border-b border-dashed border-white/90" /><Plane size={23} /></span></div>
      </div>
    </section>

    <section aria-label="City tour features" className="border-b border-gray-100 bg-[#fcfaf6]"><div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto px-3 py-2.5 [scrollbar-width:thin] min-[1280px]:justify-between min-[1280px]:px-8">{FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-[128px] shrink-0 flex-col items-center justify-center gap-1 border-r border-orange-100 px-3 text-center last:border-0 min-[1280px]:min-w-0 min-[1280px]:flex-1"><Icon size={20} strokeWidth={2.2} className="text-orange-600" aria-hidden="true" /><span className="whitespace-nowrap text-xs font-medium text-navy-800">{label}</span></div>)}</div></section>

    <div className="mx-auto grid max-w-8xl grid-cols-1 items-start gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,2.55fr)_minmax(310px,0.95fr)] lg:gap-5 lg:px-8 lg:py-5">
      <main className="min-w-0 space-y-4">
        <section aria-labelledby="city-tour-list-title">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="city-tour-list-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Popular Full Day City Tours</h2><p className="mt-1 text-sm text-navy-700">Explore the best of the city with our most popular full day tour packages.</p></div><div className="flex items-center gap-2 sm:pb-1"><label htmlFor="cityTourFilter" className="whitespace-nowrap text-sm font-semibold text-navy-900">Select City</label><select id="cityTourFilter" className={`${fieldClass} mt-0 min-w-40`} value={selectedCity} onChange={event => updateCity(event.target.value)}>{CITIES.map(item => <option key={item.slug} value={item.name}>{item.name}</option>)}</select></div></div>
          {!packagesLoaded ? <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading city tours">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-xl border border-gray-100 bg-gray-50" />)}</div> : visibleTours.length === 0 ? <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-navy-700">No full day city tours are currently available for this city.</div> : <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{visibleTours.map(tour => <article key={tour.id || `${tour.city}-guide`} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"><div className="h-32 overflow-hidden sm:h-32"><img src={tour.image} alt={tour.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" /></div><div className="flex flex-1 flex-col p-3"><h3 className="font-display text-lg font-bold leading-tight text-navy-900">{tour.name}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><Clock3 size={15} className="shrink-0 text-orange-600" />{tour.duration}</p>{tour.isFallback && <p className="mt-1 text-[10px] font-medium text-navy-500">Suggested itinerary · availability on request</p>}<p className="mt-1.5 flex min-h-[48px] items-start gap-1.5 text-xs leading-snug text-navy-700"><MapPin size={15} className="mt-0.5 shrink-0 text-orange-600" /><span>{tour.attractions.join(', ')} and more</span></p>{tour.isFallback && <span className="sr-only">Suggested itinerary, availability confirmed on request</span>}<button type="button" onClick={() => setActiveTour(tour)} className="mt-2 flex min-h-8 w-full items-center justify-center gap-2 rounded-lg border border-orange-500 px-3 py-1.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">View Details <ArrowRight size={15} /></button></div></article>)}</div>}
        </section>

        <section aria-labelledby="city-tour-vehicles-title"><h2 id="city-tour-vehicles-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Vehicle Options</h2><p className="mt-1 text-sm text-navy-700">Choose from a wide range of well-maintained vehicles for your city tour.</p><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 min-[390px]:grid-cols-2 xl:grid-cols-5">{VEHICLES.map(vehicle => <article key={vehicle.name} className="group min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md"><img src={vehicle.image} alt={`${vehicle.name} vehicle`} loading="lazy" decoding="async" className="h-20 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-24" /><h3 className="mt-1 truncate font-display text-base font-bold text-navy-900">{vehicle.name}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Users size={13} aria-hidden="true" />1–{vehicle.passengers} Passengers</p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Luggage size={13} aria-hidden="true" />{vehicle.luggage} Bags</p><button type="button" onClick={event => { vehicleTriggerRef.current = event.currentTarget; setActiveTour({ vehicle }) }} className="mt-2 flex min-h-8 w-full items-center justify-center gap-1 rounded-full border border-orange-400 px-2 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">View Details <ArrowRight size={13} aria-hidden="true" /></button></article>)}</div></section>

        <section className="rounded-xl bg-gradient-to-r from-gray-50 to-sky-50/50 px-4 py-4 sm:px-5" aria-labelledby="city-tour-process-title"><h2 id="city-tour-process-title" className="font-display text-xl font-bold text-navy-900 sm:text-2xl">Simple Booking Process</h2><p className="mt-0.5 text-sm text-navy-700">Book your full day city tour in just a few easy steps.</p><ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{STEPS.map(({ title, text, icon: Icon }, index) => <li key={title} className="relative flex items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">{index + 1}</span><Icon size={21} className="shrink-0 text-navy-800" aria-hidden="true" /><div className="min-w-0"><h3 className="text-xs font-semibold text-navy-900">{title}</h3><p className="text-[11px] leading-snug text-navy-600">{text}</p></div>{index < STEPS.length - 1 && <ArrowRight size={17} className="absolute -right-1 top-1/2 hidden -translate-y-1/2 text-sky-800 xl:block" aria-hidden="true" />}</li>)}</ol></section>
      </main>

      <aside className="min-w-0 space-y-3 lg:sticky lg:top-24 lg:self-start">
        <section ref={bookingRef} id="full-day-city-tour-booking" tabIndex={-1} className="scroll-mt-24 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" aria-labelledby="city-tour-booking-title"><div className="flex items-center gap-2 bg-sky-50 px-3 py-2.5"><CarFront size={25} className="text-sky-600" aria-hidden="true" /><div className="min-w-0"><h2 id="city-tour-booking-title" className="font-display text-base font-bold leading-tight text-navy-900 sm:text-lg">Book Your Full Day City Tour</h2><p className="text-[11px] text-navy-700">Send your city tour request and let our travel experts help you plan your perfect day.</p></div></div>
          {status === 'success' ? <div className="p-5 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={27} /></span><h3 className="mt-3 font-display text-lg font-bold text-navy-900">City Tour Request Submitted</h3><p className="mt-2 text-sm leading-relaxed text-navy-700">Thank you. We have received your Full Day City Tour request. Our travel expert will contact you shortly.</p><div className="mt-4 flex flex-col gap-2"><Link to="/local-travel/airport-transfer" className="rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50">Explore Local Travel</Link><Link to="/" className="rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-600">Back to Home</Link></div></div> : <form className="space-y-2.5 p-3" onSubmit={handleSubmit} noValidate>
            {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><strong className="block">Unable to Submit Request</strong><span>Something went wrong while sending your city tour request. Please try again.</span><button type="button" onClick={() => setStatus('form')} className="mt-1 block font-semibold underline">Try Again</button></div>}
            {Object.keys(errors).length > 0 && <p className="sr-only" role="alert">Please correct the highlighted fields.</p>}
            <div className="space-y-2.5">
              <Field id="cityTourBookingCity" label="Select City" error={errors.city}><select ref={cityFieldRef} id="cityTourBookingCity" required aria-required="true" aria-invalid={Boolean(errors.city)} className={fieldClass} value={form.city} onChange={event => updateCity(event.target.value)}><option value="">Choose City</option>{CITIES.map(item => <option key={item.slug} value={item.name}>{item.name}</option>)}</select></Field>
              <Field id="cityTourDate" label="Tour Date" error={errors.tourDate}><input id="cityTourDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.tourDate)} min={today} className={fieldClass} value={form.tourDate} onChange={event => update('tourDate', event.target.value)} /></Field>
              <Field id="cityTourPassengers" label="Number of Passengers" error={errors.passengers}><select id="cityTourPassengers" required aria-required="true" aria-invalid={Boolean(errors.passengers)} className={fieldClass} value={form.passengers} onChange={event => update('passengers', event.target.value)}>{Array.from({ length: 12 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>)}</select></Field>
              <Field id="cityTourVehicleType" label="Vehicle Type" error={errors.vehicleType}><select id="cityTourVehicleType" required aria-required="true" aria-invalid={Boolean(errors.vehicleType)} className={fieldClass} value={form.vehicleType} onChange={event => update('vehicleType', event.target.value)}><option value="">Select Vehicle</option>{VEHICLES.map(vehicle => <option key={vehicle.name} value={vehicle.name} disabled={Number(form.passengers) > vehicle.passengers}>{vehicle.name} (up to {vehicle.passengers})</option>)}</select></Field>
              {currentVehicle && Number(form.passengers) > currentVehicle.passengers && <p className="rounded bg-amber-50 p-2 text-xs text-amber-800" role="status">The selected vehicle supports up to {currentVehicle.passengers} passengers. Please choose a larger vehicle.</p>}
              {selectedTour && selectedTour.city === form.city && <p className="rounded bg-sky-50 p-2 text-xs text-sky-900"><span className="font-semibold">Selected tour:</span> {selectedTour.name}</p>}
            </div>
            <details className="rounded-lg border border-gray-100 px-3 py-2 text-xs" open={!user}><summary className="cursor-pointer font-medium text-sky-800">Contact details {!user && '(required)'}</summary><div className="mt-2 space-y-2"><Field id="cityTourName" label="Full Name" error={errors.name}><input id="cityTourName" autoComplete="name" aria-invalid={Boolean(errors.name)} className={fieldClass} value={form.name} onChange={event => update('name', event.target.value)} /></Field><Field id="cityTourEmail" label="Email" error={errors.email}><input id="cityTourEmail" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={fieldClass} value={form.email} onChange={event => update('email', event.target.value)} /></Field><Field id="cityTourPhone" label="Phone" error={errors.phone}><input id="cityTourPhone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} className={fieldClass} value={form.phone} onChange={event => update('phone', event.target.value)} /></Field>{errors.contact && <p className="text-xs text-red-600" role="alert">{errors.contact}</p>}<p className="text-[11px] text-navy-500">Your signed-in account details are filled in when available. If you are not signed in, add a name and at least one way for us to contact you.</p></div></details>
            <button type="submit" disabled={submitting} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{submitting ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Submitting...</> : <>Get Quote <ArrowRight size={17} aria-hidden="true" /></>}</button>
            <p className="text-center text-[10px] text-navy-500">No estimated fare is generated. Availability and quote are confirmed by our team.</p>
          </form>}
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="city-tour-why-title"><h2 id="city-tour-why-title" className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 font-display text-base font-bold leading-tight text-navy-900 sm:text-lg"><Star size={20} className="fill-gold-400 text-gold-500" aria-hidden="true" />Why Choose Our City Tour?</h2><ul className="space-y-1.5 px-3 py-3">{REASONS.map(reason => <li key={reason} className="flex items-start gap-2 text-xs leading-snug text-navy-800"><CheckCircle2 size={15} className="mt-0.5 shrink-0 fill-green-600 text-white" aria-hidden="true" />{reason}</li>)}</ul></section>
        <section className="rounded-xl border border-gold-100 bg-amber-50/70 p-4" aria-labelledby="city-tour-help-title"><div className="flex items-start gap-3"><Headphones size={26} className="shrink-0 text-orange-500" aria-hidden="true" /><div><h2 id="city-tour-help-title" className="font-display text-lg font-bold text-navy-900">Need Help Planning?</h2><p className="mt-1 text-sm leading-snug text-navy-700">Our travel experts are available 24/7 to help you plan your perfect city tour.</p><Link to="/contact" className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 text-sm font-bold text-white hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2">Contact Us <ArrowRight size={15} aria-hidden="true" /></Link></div></div></section>
      </aside>
    </div>

    {activeTour?.vehicle && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/60 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeVehicleModal() }}><section role="dialog" aria-modal="true" aria-labelledby="city-tour-vehicle-modal-title" onKeyDown={event => { if (event.key === 'Escape') closeVehicleModal(); if (event.key === 'Tab') { const focusable = Array.from(event.currentTarget.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')); const first = focusable[0]; const last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() } } }} className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><button type="button" aria-label="Close vehicle details" autoFocus onClick={closeVehicleModal} className="absolute right-3 top-3 rounded p-2 text-navy-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={19} /></button><img src={activeTour.vehicle.image} alt={`${activeTour.vehicle.name} vehicle`} className="h-40 w-full object-contain" /><h2 id="city-tour-vehicle-modal-title" className="font-display text-2xl font-bold text-navy-900">{activeTour.vehicle.name}</h2><div className="mt-3 flex flex-wrap gap-4 text-sm text-navy-700"><span className="flex items-center gap-1"><Users size={16} />1–{activeTour.vehicle.passengers} passengers</span><span className="flex items-center gap-1"><Luggage size={16} />{activeTour.vehicle.luggage} bags</span></div><ul className="mt-3 space-y-2">{activeTour.vehicle.features.map(feature => <li key={feature} className="flex gap-2 text-sm text-navy-700"><CheckCircle2 size={16} className="shrink-0 text-green-600" />{feature}</li>)}</ul><p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-navy-600">Vehicle capacities are indicative. Availability and final fare are confirmed by our travel expert.</p>{Number(form.passengers) > activeTour.vehicle.passengers && <p className="mt-3 text-sm text-red-700" role="alert">This vehicle supports up to {activeTour.vehicle.passengers} passengers. Please choose a larger vehicle.</p>}<button type="button" disabled={Number(form.passengers) > activeTour.vehicle.passengers} onClick={() => chooseVehicle(activeTour.vehicle)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-3 font-bold text-white hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50">Select Vehicle <ArrowRight size={17} /></button></section></div>}
    {activeTour && !activeTour.vehicle && <TourDetailsModal tour={activeTour} onClose={closeTourModal} onSelect={chooseTour} />}
    {authPromptOpen && <LocalTravelAuthPrompt onClose={() => setAuthPromptOpen(false)} onContinue={continueToAuth} />}
  </div>
}
