import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, CarFront, Check, CheckCircle2,
  Clock3, Headphones, Luggage, MapPin, Plane, Repeat2, Route, ShieldCheck,
  Star, Users, X, LoaderCircle,
} from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import Breadcrumb from '../components/common/Breadcrumb'
import api from '../services/api'
import useLocalTravelFlow from '../hooks/useLocalTravelFlow'
import LocalTravelAuthPrompt from '../components/common/LocalTravelAuthPrompt'
import { CITY_LIST } from '../data/cityData'
import { LOCAL_TRANSFER_VEHICLES as VEHICLES } from '../data/localTransferVehicles'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2200&q=88'

// Presentation-only examples from the design reference; distance and duration are not used for quotes.
const FALLBACK_ROUTES = [
  { city: 'Mumbai', duration: '6–7 Hours', distance: '350+ km', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=720&h=420&q=80', alt: 'Mumbai Gateway of India beside the waterfront' },
  { city: 'Pune', duration: '3–4 Hours', distance: '150+ km', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=720&h=420&q=80', alt: 'Pune hill fort surrounded by green countryside' },
  { city: 'Surat', duration: '4–5 Hours', distance: '280+ km', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=720&h=420&q=80', alt: 'Surat riverfront and city skyline' },
  { city: 'Nashik', duration: '5–6 Hours', distance: '180+ km', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=720&h=420&q=80', alt: 'Nashik temple architecture' },
  { city: 'Udaipur', duration: '8–9 Hours', distance: '420+ km', image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=720&h=420&q=80', alt: 'Udaipur lakeside palace and waterfront' },
  { city: 'Ahmedabad', duration: '3–4 Hours', distance: '220+ km', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=720&h=420&q=80', alt: 'Ahmedabad heritage architecture' },
]
const INDIAN_STATES = new Set([
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Jammu and Kashmir', 'Ladakh',
  'Delhi', 'Andaman and Nicobar Islands',
])
const CITIES = [...new Set([
  ...CITY_LIST.filter(city => !city.slug.includes('/') && INDIAN_STATES.has(city.state)).map(city => city.name),
  ...FALLBACK_ROUTES.map(route => route.city),
])].sort((a, b) => a.localeCompare(b))
const FEATURES = [
  { icon: MapPin, label: 'One Way Trip' }, { icon: Repeat2, label: 'Round Trip' },
  { icon: BadgeCheck, label: 'Transparent Pricing' }, { icon: ShieldCheck, label: 'Safe & Secure' },
  { icon: Users, label: 'Experienced Drivers' }, { icon: CarFront, label: 'Well-Maintained Vehicles' },
  { icon: Headphones, label: '24/7 Support' }, { icon: Route, label: 'All Major Destinations' },
]
const REASONS = [
  'Comfortable and safe long-distance travel', 'Professional and verified drivers',
  'Well-maintained and clean vehicles', 'One way and round trip options',
  'Transparent and competitive pricing', '24/7 customer support',
  'Stops at your preferred locations', 'Ideal for family trips, business travel and holidays',
]
const STEPS = [
  { title: 'Select Trip Type', text: 'One way or round trip', icon: Repeat2 },
  { title: 'Provide Details', text: 'Pickup, drop, date & passengers', icon: MapPin },
  { title: 'Get Quote', text: 'Choose vehicle & confirm', icon: CarFront },
  { title: 'Enjoy Your Ride', text: 'Safe, comfortable journey', icon: CheckCircle2 },
]
const fieldClass = 'mt-1.5 min-h-10 w-full min-w-0 rounded-md border border-navy-200 bg-white px-2.5 py-2 text-xs text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:px-3 sm:text-sm'
const initialForm = { pickupCity: '', dropCity: '', journeyType: 'One Way', travelDate: '', returnDate: '', passengers: '1', vehicleType: '', name: '', email: '', phone: '' }
const todayValue = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const dayAfter = dateString => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day + 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function Field({ id, label, error, children }) {
  return <div className="min-w-0"><label htmlFor={id} className="block text-xs font-medium text-navy-700">{label}</label>{children}{error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}</div>
}

function VehicleDetailsModal({ vehicle, passengers, onClose, onSelect, triggerRef }) {
  const closeRef = useRef(null)
  useEffect(() => {
    const previousFocus = triggerRef.current || document.activeElement
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
  }, [onClose, triggerRef])
  const tooSmall = Number(passengers) > vehicle.passengers
  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-navy-950/65 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="outstation-vehicle-title" className="relative my-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
      <button ref={closeRef} type="button" aria-label="Close vehicle details" onClick={onClose} className="absolute right-3 top-3 rounded p-2 text-navy-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={19} /></button>
      <img src={vehicle.image} alt={`${vehicle.name} vehicle`} className="h-40 w-full object-contain" />
      <h2 id="outstation-vehicle-title" className="font-display text-2xl font-bold text-navy-900">{vehicle.name}</h2>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-navy-700"><span className="flex items-center gap-1"><Users size={16} />1–{vehicle.passengers} passengers</span><span className="flex items-center gap-1"><Luggage size={16} />{vehicle.luggage} bags</span></div>
      <h3 className="mt-4 font-semibold text-navy-900">Vehicle Features</h3>
      <ul className="mt-2 space-y-2">{vehicle.features.map(feature => <li key={feature} className="flex gap-2 text-sm text-navy-700"><CheckCircle2 size={16} className="shrink-0 text-green-600" />{feature}</li>)}</ul>
      <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-navy-600">Suitable for long-distance travel, subject to vehicle availability. Fare is confirmed by our travel expert.</p>
      {tooSmall && <p className="mt-3 text-sm text-red-700" role="alert">The selected {vehicle.name} supports up to {vehicle.passengers} passengers. Please choose a larger vehicle.</p>}
      <button type="button" disabled={tooSmall} onClick={() => onSelect(vehicle)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-3 font-bold text-white transition hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-600 disabled:cursor-not-allowed disabled:opacity-50">Select Vehicle <ArrowRight size={17} /></button>
    </section>
  </div>
}

export default function OutstationCabPage() {
  const { form, setForm, user, authPromptOpen, setAuthPromptOpen, requireAuthentication, continueToAuth, clearDraft } = useLocalTravelFlow(initialForm)
  const bookingRef = useRef(null)
  const pickupRef = useRef(null)
  const vehicleRef = useRef(null)
  const vehicleTriggerRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('form')
  const [submitting, setSubmitting] = useState(false)
  const [activeVehicle, setActiveVehicle] = useState(null)

  useEffect(() => {
    if (user) setForm(previous => ({ ...previous, name: previous.name || user.name || '', email: previous.email || user.email || '', phone: previous.phone || user.phone || '' }))
  }, [user])

  const currentVehicle = VEHICLES.find(vehicle => vehicle.name === form.vehicleType)
  const citySet = useMemo(() => new Set(CITIES), [])
  const sameCities = Boolean(form.pickupCity && form.dropCity && form.pickupCity === form.dropCity)
  const dropCityError = errors.dropCity || (sameCities ? 'Pickup city and drop city cannot be the same.' : '')

  const update = (key, value) => {
    setForm(previous => {
      const next = { ...previous, [key]: value }
      if (key === 'journeyType' && value === 'One Way') next.returnDate = ''
      return next
    })
    setErrors(previous => ({ ...previous, [key]: '', ...(key === 'passengers' ? { vehicleType: '' } : {}), ...(key === 'pickupCity' || key === 'dropCity' ? { pickupCity: '', dropCity: '' } : {}), ...(key === 'journeyType' ? { returnDate: '' } : {}) }))
    if (status === 'error') setStatus('form')
  }

  const focusBooking = (changes, focusRef = null) => {
    setForm(previous => ({ ...previous, ...changes }))
    setErrors(previous => ({ ...previous, ...Object.fromEntries(Object.keys(changes).map(key => [key, ''])), ...(changes.dropCity ? { pickupCity: '', dropCity: '' } : {}) }))
    setStatus('form')
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => (focusRef?.current || (changes.pickupCity ? pickupRef.current : document.getElementById('outstationDropCity')))?.focus(), 450)
    })
  }

  const chooseVehicle = vehicle => {
    if (Number(form.passengers) > vehicle.passengers) return
    setActiveVehicle(null)
    focusBooking({ vehicleType: vehicle.name }, vehicleRef)
  }

  const chooseRoute = route => focusBooking({ dropCity: route.city })

  const validate = () => {
    const next = {}
    if (!form.pickupCity || !citySet.has(form.pickupCity)) next.pickupCity = 'Please select a pickup city.'
    if (!form.dropCity || !citySet.has(form.dropCity)) next.dropCity = 'Please select a drop city.'
    if (form.pickupCity && form.dropCity && form.pickupCity === form.dropCity) next.dropCity = 'Pickup city and drop city cannot be the same.'
    if (!form.journeyType) next.journeyType = 'Please select a journey type.'
    if (!form.travelDate) next.travelDate = 'Please select a travel date.'
    else if (form.travelDate < todayValue()) next.travelDate = 'Travel date cannot be in the past.'
    if (form.journeyType === 'Round Trip') {
      if (!form.returnDate) next.returnDate = 'Please select a return date.'
      else if (form.returnDate <= form.travelDate) next.returnDate = 'Return date must be after the travel date.'
    }
    if (!form.passengers || Number(form.passengers) < 1 || Number(form.passengers) > 12) next.passengers = 'Please select number of passengers.'
    if (!form.vehicleType) next.vehicleType = 'Please select a vehicle.'
    else if (currentVehicle && Number(form.passengers) > currentVehicle.passengers) next.vehicleType = `The selected ${currentVehicle.name} supports up to ${currentVehicle.passengers} passengers. Please choose a larger vehicle.`
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
        setErrors(previous => ({ ...previous, vehicleType: `The selected ${vehicle?.name || 'vehicle'} supports up to ${vehicle?.passengers || 0} passengers. Please choose a larger vehicle.` }))
        setStatus('form')
        return
      }
      const details = [
        'Service: OUTSTATION_CAB',
        `Pickup city: ${form.pickupCity}`,
        `Drop city: ${form.dropCity}`,
        `Journey type: ${form.journeyType}`,
        `Travel date: ${form.travelDate}`,
        form.journeyType === 'Round Trip' && `Return date: ${form.returnDate}`,
        `Passengers: ${form.passengers}`,
        `Vehicle type: ${form.vehicleType}`,
        'Request type: Quote enquiry; not a confirmed booking.',
      ].filter(Boolean).join('\n')
      await api.post('/local-travel/enquiries', {
        serviceType: 'outstation-cab', formData: form, sourceUrl: window.location.pathname,
      })
      clearDraft()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const closeVehicle = () => setActiveVehicle(null)

  return <div className="min-w-0 overflow-x-hidden bg-white text-navy-900">
    <SEOHead title="Outstation Cab Service in India | TravelVista" description="Book reliable outstation cab services with TravelVista for one-way and round trips. Choose comfortable vehicles, professional drivers and convenient long-distance travel options." />

    <section className="relative isolate min-h-[220px] overflow-hidden bg-navy-950 text-white sm:min-h-[250px] lg:min-h-[270px]" aria-labelledby="outstation-title">
      <img src={HERO_IMAGE} alt="Scenic Indian mountain highway for a long-distance road trip" loading="eager" className="absolute inset-0 h-full w-full object-cover object-[50%_56%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-navy-950/10" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[220px] max-w-8xl items-center px-4 py-5 sm:min-h-[250px] sm:px-6 lg:min-h-[270px] lg:px-8">
        <div className="max-w-3xl">
          <Breadcrumb light items={[{ label: 'Local Travel', href: '/local-travel/airport-transfer' }, { label: 'Outstation Cab' }]} />
          <h1 id="outstation-title" className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"><span className="text-white">Outstation </span><span className="text-gold-500">Cab</span></h1>
          <p className="mt-1 text-sm font-semibold tracking-wide text-white sm:text-base">Comfortable <span className="text-gold-400">•</span> Safe <span className="text-gold-400">•</span> Affordable <span className="text-gold-400">•</span> Long Distance</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/95 sm:text-base">Plan your outstation trips with our reliable and comfortable cab services. Enjoy a hassle-free journey with professional drivers, well-maintained vehicles and transparent pricing.</p>
        </div>
        <div className="pointer-events-none absolute bottom-5 right-5 hidden rotate-[-6deg] text-right font-display text-2xl italic leading-tight text-white drop-shadow-lg lg:block xl:right-10 xl:text-3xl" aria-hidden="true"><span>Travel<br />More<br />Explore More</span><span className="mt-1 flex items-center justify-end gap-2"><span className="block w-12 border-b border-dashed border-white/90" /><Plane size={23} /></span></div>
      </div>
    </section>

    <section aria-label="Outstation cab features" className="border-b border-gray-100 bg-[#fcfaf6]"><div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto overscroll-x-contain px-3 py-2.5 [scrollbar-width:thin] min-[1280px]:justify-between min-[1280px]:px-8">{FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-[128px] shrink-0 flex-col items-center justify-center gap-1 border-r border-orange-100 px-3 text-center last:border-0 min-[1280px]:min-w-0 min-[1280px]:flex-1"><Icon size={20} strokeWidth={2.2} className="text-orange-600" aria-hidden="true" /><span className="whitespace-nowrap text-xs font-medium text-navy-800">{label}</span></div>)}</div></section>

    <div className="mx-auto grid max-w-8xl grid-cols-1 items-start gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,2.55fr)_minmax(310px,0.95fr)] lg:gap-5 lg:px-8 lg:py-5">
      <main className="min-w-0 space-y-4">
        <section aria-labelledby="outstation-routes-title">
          <h2 id="outstation-routes-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Popular Outstation Routes</h2>
          <p className="mt-1 text-sm text-navy-700">Choose from our most popular outstation cab routes across India.</p>
          <p className="mt-1 text-[11px] text-navy-500">Route times and distances are presentation-only reference examples—not service availability or live/calculated route data.</p>
          <div className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-3 min-[1440px]:grid-cols-6">{FALLBACK_ROUTES.map(route => <article key={route.city} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"><div className="h-32 overflow-hidden sm:h-28"><img src={route.image} alt={route.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" /></div><div className="flex flex-1 flex-col p-3"><h3 className="font-display text-base font-bold text-navy-900">{route.city}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><Clock3 size={14} className="shrink-0 text-sky-700" />{route.duration}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><Route size={14} className="shrink-0 text-sky-700" />{route.distance}</p><button type="button" onClick={() => chooseRoute(route)} className="mt-2 flex min-h-8 w-full items-center justify-center gap-2 rounded-lg border border-orange-500 px-2 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm">Book Now <ArrowRight size={14} /></button></div></article>)}</div>
        </section>

        <section aria-labelledby="outstation-vehicles-title"><h2 id="outstation-vehicles-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Vehicle Options</h2><p className="mt-1 text-sm text-navy-700">Choose from a wide range of well-maintained vehicles for your outstation trip.</p><div className="mt-3 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">{VEHICLES.map(vehicle => <article key={vehicle.name} className="group min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md motion-reduce:transform-none"><img src={vehicle.image} alt={`${vehicle.name} vehicle`} loading="lazy" decoding="async" className="h-24 w-full object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" /><h3 className="mt-1 truncate font-display text-base font-bold text-navy-900">{vehicle.name}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Users size={13} aria-hidden="true" />1–{vehicle.passengers} Passengers</p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Luggage size={13} aria-hidden="true" />{vehicle.luggage} Bags</p><button type="button" onClick={event => { vehicleTriggerRef.current = event.currentTarget; setActiveVehicle(vehicle) }} className="mt-2 flex min-h-8 w-full items-center justify-center gap-1 rounded-full border border-orange-400 px-2 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">View Details <ArrowRight size={13} aria-hidden="true" /></button></article>)}</div></section>

        <section className="rounded-xl bg-gradient-to-r from-gray-50 to-sky-50/50 px-4 py-4 sm:px-5" aria-labelledby="outstation-process-title"><h2 id="outstation-process-title" className="font-display text-xl font-bold text-navy-900 sm:text-2xl">Simple Booking Process</h2><p className="mt-0.5 text-sm text-navy-700">Book your outstation cab in just a few easy steps.</p><ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{STEPS.map(({ title, text, icon: Icon }, index) => <li key={title} className="relative flex items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">{index + 1}</span><Icon size={21} className="shrink-0 text-navy-800" aria-hidden="true" /><div className="min-w-0"><h3 className="text-xs font-semibold text-navy-900">{title}</h3><p className="text-[11px] leading-snug text-navy-600">{text}</p></div>{index < STEPS.length - 1 && <ArrowRight size={17} className="absolute -right-1 top-1/2 hidden -translate-y-1/2 text-sky-800 xl:block" aria-hidden="true" />}</li>)}</ol></section>
      </main>

      <aside className="min-w-0 space-y-3 lg:sticky lg:top-24 lg:self-start">
        <section ref={bookingRef} id="outstation-cab-booking" tabIndex={-1} className="scroll-mt-24 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" aria-labelledby="outstation-booking-title">
          <div className="flex items-center gap-2 bg-sky-50 px-3 py-2.5"><CarFront size={25} className="shrink-0 text-sky-600" aria-hidden="true" /><div className="min-w-0"><h2 id="outstation-booking-title" className="font-display text-base font-bold leading-tight text-navy-900 sm:text-lg">Book Your Outstation Cab</h2><p className="text-[11px] text-navy-700">Request an outstation cab quote for your journey.</p></div></div>
          {status === 'success' ? <div className="p-5 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={27} /></span><h3 className="mt-3 font-display text-lg font-bold text-navy-900">Outstation Cab Request Submitted</h3><p className="mt-2 text-sm leading-relaxed text-navy-700">Thank you. We have received your outstation cab request. Our travel expert will contact you shortly with the available options and quote.</p><div className="mt-4 flex flex-col gap-2"><Link to="/local-travel/airport-transfer" className="rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50">Explore Local Travel</Link><Link to="/" className="rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-600">Back to Home</Link></div></div> : <form className="space-y-2.5 p-3" onSubmit={handleSubmit} noValidate>
            {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><strong className="block">Unable to Submit Request</strong><span>Something went wrong while sending your outstation cab request. Please try again.</span><button type="button" onClick={() => setStatus('form')} className="mt-1 block font-semibold underline">Try Again</button></div>}
            {Object.keys(errors).length > 0 && <p className="sr-only" role="alert">Please correct the highlighted fields.</p>}
            <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
              <Field id="outstationPickupCity" label="Pickup City" error={errors.pickupCity}><select ref={pickupRef} id="outstationPickupCity" required aria-required="true" aria-invalid={Boolean(errors.pickupCity)} className={fieldClass} value={form.pickupCity} onChange={event => update('pickupCity', event.target.value)}><option value="">Select Pickup City</option>{CITIES.map(city => <option key={city} value={city}>{city}</option>)}</select></Field>
              <Field id="outstationDropCity" label="Drop City" error={dropCityError}><select id="outstationDropCity" required aria-required="true" aria-invalid={Boolean(dropCityError)} className={fieldClass} value={form.dropCity} onChange={event => update('dropCity', event.target.value)}><option value="">Select Drop City</option>{CITIES.map(city => <option key={city} value={city}>{city}</option>)}</select></Field>
              <Field id="outstationJourneyType" label="Journey Type" error={errors.journeyType}><select id="outstationJourneyType" required aria-required="true" aria-invalid={Boolean(errors.journeyType)} className={fieldClass} value={form.journeyType} onChange={event => update('journeyType', event.target.value)}><option value="One Way">One Way</option><option value="Round Trip">Round Trip</option></select></Field>
              <Field id="outstationTravelDate" label="Travel Date" error={errors.travelDate}><input id="outstationTravelDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.travelDate)} min={todayValue()} className={fieldClass} value={form.travelDate} onChange={event => { update('travelDate', event.target.value); setErrors(previous => ({ ...previous, returnDate: '' })) }} /></Field>
              {form.journeyType === 'Round Trip' && <Field id="outstationReturnDate" label="Return Date" error={errors.returnDate}><input id="outstationReturnDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.returnDate)} min={form.travelDate ? dayAfter(form.travelDate) : todayValue()} className={fieldClass} value={form.returnDate} onChange={event => update('returnDate', event.target.value)} /></Field>}
              <Field id="outstationPassengers" label="Number of Passengers" error={errors.passengers}><select id="outstationPassengers" required aria-required="true" aria-invalid={Boolean(errors.passengers)} className={fieldClass} value={form.passengers} onChange={event => update('passengers', event.target.value)}>{Array.from({ length: 12 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>)}</select></Field>
              <Field id="outstationVehicle" label="Vehicle Type" error={errors.vehicleType}><select ref={vehicleRef} id="outstationVehicle" required aria-required="true" aria-invalid={Boolean(errors.vehicleType)} className={fieldClass} value={form.vehicleType} onChange={event => update('vehicleType', event.target.value)}><option value="">Select Vehicle</option>{VEHICLES.map(vehicle => <option key={vehicle.name} value={vehicle.name}>{vehicle.name} (up to {vehicle.passengers})</option>)}</select></Field>
              {currentVehicle && Number(form.passengers) > currentVehicle.passengers && <p className="col-span-full rounded bg-amber-50 p-2 text-xs text-amber-800" role="status">The selected {currentVehicle.name} supports up to {currentVehicle.passengers} passengers. Please choose a larger vehicle.</p>}
            </div>
            <details className="rounded-lg border border-gray-100 px-3 py-2 text-xs" open={!user}><summary className="cursor-pointer font-medium text-sky-800">Contact details {!user && '(required)'}</summary><div className="mt-2 space-y-2"><Field id="outstationName" label="Full Name" error={errors.name}><input id="outstationName" autoComplete="name" aria-invalid={Boolean(errors.name)} className={fieldClass} value={form.name} onChange={event => update('name', event.target.value)} /></Field><Field id="outstationEmail" label="Email" error={errors.email}><input id="outstationEmail" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={fieldClass} value={form.email} onChange={event => update('email', event.target.value)} /></Field><Field id="outstationPhone" label="Phone" error={errors.phone}><input id="outstationPhone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} className={fieldClass} value={form.phone} onChange={event => update('phone', event.target.value)} /></Field>{errors.contact && <p className="text-xs text-red-600" role="alert">{errors.contact}</p>}<p className="text-[11px] text-navy-500">Your signed-in account details are filled in when available. Otherwise, enter a name and one contact method.</p></div></details>
            <button type="submit" disabled={submitting} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{submitting ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Submitting...</> : <>Get Quote <ArrowRight size={17} aria-hidden="true" /></>}</button>
            <p className="text-center text-[10px] text-navy-500">No distance-based price is calculated here. Route and vehicle availability are confirmed by our team.</p>
          </form>}
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="outstation-why-title"><h2 id="outstation-why-title" className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 font-display text-base font-bold leading-tight text-navy-900 sm:text-lg"><Star size={20} className="fill-gold-400 text-gold-500" aria-hidden="true" />Why Choose Our Outstation Cab?</h2><ul className="space-y-1.5 px-3 py-3">{REASONS.map(reason => <li key={reason} className="flex items-start gap-2 text-xs leading-snug text-navy-800"><CheckCircle2 size={15} className="mt-0.5 shrink-0 fill-green-600 text-white" aria-hidden="true" />{reason}</li>)}</ul></section>
        <section className="rounded-xl border border-gold-100 bg-amber-50/70 p-4" aria-labelledby="outstation-help-title"><div className="flex items-start gap-3"><Headphones size={26} className="shrink-0 text-orange-500" aria-hidden="true" /><div><h2 id="outstation-help-title" className="font-display text-lg font-bold text-navy-900">Need Help?</h2><p className="mt-1 text-sm leading-snug text-navy-700">Our travel experts are available 24/7 to assist you with your outstation cab booking.</p><Link to="/contact" className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 text-sm font-bold text-white hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2">Contact Us <ArrowRight size={15} aria-hidden="true" /></Link></div></div></section>
      </aside>
    </div>

    {activeVehicle && <VehicleDetailsModal vehicle={activeVehicle} passengers={form.passengers} triggerRef={vehicleTriggerRef} onClose={closeVehicle} onSelect={chooseVehicle} />}
    {authPromptOpen && <LocalTravelAuthPrompt onClose={() => setAuthPromptOpen(false)} onContinue={continueToAuth} />}
  </div>
}
