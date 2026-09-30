import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BriefcaseBusiness, Building2, CalendarDays, CarFront,
  Check, CheckCircle2, Clock3, Headphones, Luggage, MapPin, Plane,
  ShieldCheck, Star, Users, UserRoundCheck, X, LoaderCircle,
  BadgeCheck, Route, Handshake,
} from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import Breadcrumb from '../components/common/Breadcrumb'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=86'
const VEHICLES = [
  { name: 'Sedan (Executive)', passengers: 4, capacityLabel: '1–4 Passengers', luggage: '3 Bags', bestFor: 'Ideal for executives', features: ['Air conditioning', 'Comfortable executive seating', 'Professional chauffeur on request'], image: 'https://images.unsplash.com/photo-1619221496652-7ee3d7406203?auto=format&fit=crop&w=700&h=440&q=82', alt: 'Black executive sedan for corporate travel' },
  { name: 'SUV (Business)', passengers: 6, capacityLabel: '1–6 Passengers', luggage: '4 Bags', bestFor: 'Ideal for team travel', features: ['Air conditioning', 'Additional cabin space', 'Suitable for small business teams'], image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=700&h=440&q=82', alt: 'Business SUV for corporate transportation' },
  { name: 'Innova Crysta', passengers: 7, capacityLabel: '6–7 Passengers', luggage: '6 Bags', bestFor: 'Ideal for small groups', features: ['Air conditioning', 'Spacious group seating', 'Comfortable for client and team travel'], image: 'https://images.unsplash.com/photo-1570218042305-ac476b00c52c?auto=format&fit=crop&w=700&h=440&q=82', alt: 'Comfortable business SUV for small groups' },
  { name: 'Tempo Traveller', passengers: 16, capacityLabel: '9–16 Passengers', luggage: '8 Bags', bestFor: 'Ideal for corporate groups', features: ['Air conditioning', 'Group-friendly seating', 'Suitable for team transportation'], image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=700&h=440&q=82', alt: 'Tempo Traveller for a corporate group' },
  { name: 'Mini / Executive Bus', passengers: 45, capacityLabel: '20–45 Passengers', luggage: 'Spacious Seating', bestFor: 'Ideal for large teams', features: ['Air conditioning', 'Spacious group seating', 'Suitable for corporate events and large teams'], image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&h=440&q=82', alt: 'Executive bus for large corporate teams' },
]
const HERO_VEHICLE_IMAGE = 'https://images.unsplash.com/photo-1619221496652-7ee3d7406203?auto=format&fit=crop&w=1000&q=82'
const TRAVEL_TYPES = [
  'Executive Travel', 'Airport Transfer', 'Client Transfer', 'Corporate Event',
  'Employee Transportation', 'Outstation Business Travel', 'Custom Corporate Trip',
]
const SERVICES = [
  { title: 'Airport Transfers', type: 'Airport Transfer', description: 'Timely pickup and drop for your executives.', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=700&h=360&q=82', alt: 'Business travel at an airport terminal', icon: Plane },
  { title: 'Client Visits', type: 'Client Transfer', description: 'Impress your clients with premium travel.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&h=360&q=82', alt: 'Business professional preparing for a client meeting', icon: Handshake },
  { title: 'Corporate Events', type: 'Corporate Event', description: 'Transportation for conferences and events.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=700&h=360&q=82', alt: 'Attendees at a corporate event', icon: Building2 },
  { title: 'Employee Commute', type: 'Employee Transportation', description: 'Regular transportation for your team.', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&h=360&q=82', alt: 'Colleagues travelling together for work', icon: Users },
  { title: 'Outstation Business Travel', type: 'Outstation Business Travel', description: 'Comfortable long-distance travel for business trips.', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&h=360&q=82', alt: 'Open highway for a business road trip', icon: Route },
  { title: 'Custom Corporate Trips', type: 'Custom Corporate Trip', description: 'Tailored travel solutions as per your requirement.', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&h=360&q=82', alt: 'Business team planning a customized trip', icon: BriefcaseBusiness },
]
const FEATURES = [
  { icon: Users, label: 'Executive Travel' }, { icon: BriefcaseBusiness, label: 'Client Transfers' },
  { icon: Building2, label: 'Corporate Events' }, { icon: CalendarDays, label: 'Employee Transportation' },
  { icon: CarFront, label: 'Well-Maintained Fleet' }, { icon: ShieldCheck, label: 'Safe & Secure' },
  { icon: Headphones, label: '24/7 Support' }, { icon: BadgeCheck, label: 'Transparent Pricing' },
]
const WHY_BUSINESSES = [
  'Professional and verified drivers', 'Well-maintained and premium vehicles',
  'Punctual and reliable service', 'Flexible travel plans (one-time or regular)',
  'Transparent and competitive pricing', 'Safe and secure travel experience',
  'Ideal for corporate events, client visits and team travel', '24/7 support for travel enquiries',
]
const BENEFITS = [
  { title: 'Professional Chauffeurs', description: 'Trained and experienced drivers', icon: UserRoundCheck },
  { title: 'Punctual & Reliable', description: 'On-time pickup and drop', icon: Clock3 },
  { title: 'Clean & Comfortable Vehicles', description: 'Well-maintained fleet', icon: CarFront },
  { title: 'Flexible Packages', description: 'Daily, weekly or monthly on request', icon: CalendarDays },
  { title: '24/7 Customer Support', description: 'Assistance anytime during your journey', icon: Headphones },
  { title: 'Customized Solutions', description: 'Tailored as per your business needs', icon: BriefcaseBusiness },
]
const STEPS = [
  { title: 'Select Service', description: 'Choose your travel requirement', icon: MapPin },
  { title: 'Provide Details', description: 'Pickup, drop, date & passengers', icon: CalendarDays },
  { title: 'Get Quote', description: 'Review suitable vehicles & pricing', icon: CarFront },
  { title: 'Confirm Booking', description: 'Proceed after availability confirmation', icon: CheckCircle2 },
]
const fieldClass = 'mt-1.5 min-h-10 w-full min-w-0 rounded-md border border-navy-200 bg-white px-2.5 py-2 text-sm text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:px-3'
const EMPTY_FORM = { travelType: '', pickupLocation: '', dropLocation: '', travelDate: '', passengers: '1', selectedVehicle: '', name: '', email: '', phone: '' }
const todayValue = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
const recommendationFor = count => VEHICLES.find(vehicle => count <= vehicle.passengers) || VEHICLES[VEHICLES.length - 1]

function Field({ id, label, error, children }) {
  return <div className="min-w-0"><label htmlFor={id} className="block text-xs font-medium text-navy-700">{label}</label>{children}{error && <p className="mt-1 text-xs leading-snug text-red-600" role="alert">{error}</p>}</div>
}

function VehicleDetailsModal({ vehicle, onClose, onSelect, triggerRef }) {
  const closeRef = useRef(null)
  useEffect(() => {
    const previousFocus = triggerRef.current || document.activeElement
    closeRef.current?.focus()
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = Array.from(document.querySelectorAll('[role="dialog"] button:not(:disabled)'))
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
    <section role="dialog" aria-modal="true" aria-labelledby="corporate-vehicle-title" className="relative my-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
      <button ref={closeRef} type="button" aria-label="Close vehicle details" onClick={onClose} className="absolute right-3 top-3 rounded p-2 text-navy-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={19} /></button>
      <img src={vehicle.image} alt={vehicle.alt} className="h-44 w-full rounded-lg object-cover" />
      <h2 id="corporate-vehicle-title" className="mt-3 font-display text-2xl font-bold text-navy-900">{vehicle.name}</h2>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-navy-700"><span className="flex items-center gap-1.5"><Users size={16} />{vehicle.capacityLabel}</span><span className="flex items-center gap-1.5"><Luggage size={16} />{vehicle.luggage}</span></div>
      <p className="mt-2 text-sm font-medium text-sky-800">{vehicle.bestFor}</p>
      <h3 className="mt-4 font-semibold text-navy-900">Vehicle Features</h3>
      <ul className="mt-2 space-y-2">{vehicle.features.map(feature => <li key={feature} className="flex gap-2 text-sm text-navy-700"><CheckCircle2 size={16} className="shrink-0 text-green-600" />{feature}</li>)}</ul>
      <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-navy-600">Vehicle model and availability are confirmed with your quote. No vehicle is reserved until confirmed by our team.</p>
      <button type="button" onClick={() => onSelect(vehicle)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-3 font-bold text-white transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600">Select Vehicle <ArrowRight size={17} /></button>
    </section>
  </div>
}

export default function CorporateTransportationPage() {
  const { user } = useAuth()
  const bookingRef = useRef(null)
  const travelTypeRef = useRef(null)
  const triggerRef = useRef(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('form')
  const [submitting, setSubmitting] = useState(false)
  const [activeVehicle, setActiveVehicle] = useState(null)

  useEffect(() => {
    if (user) setForm(previous => ({ ...previous, name: previous.name || user.name || '', email: previous.email || user.email || '', phone: previous.phone || user.phone || '' }))
  }, [user])
  const selectedVehicle = VEHICLES.find(vehicle => vehicle.name === form.selectedVehicle)
  const recommendation = form.passengers ? recommendationFor(Number(form.passengers)) : null
  const visibleVehicleOptions = recommendation && Number(form.passengers) > 4
    ? [...new Map([recommendation, ...VEHICLES].map(vehicle => [vehicle.name, vehicle])).values()]
    : VEHICLES
  const update = (key, value) => {
    setForm(previous => ({ ...previous, [key]: value }))
    setErrors(previous => ({ ...previous, [key]: '', ...(key === 'pickupLocation' || key === 'dropLocation' ? { dropLocation: '', pickupLocation: '' } : {}) }))
    if (status === 'error') setStatus('form')
  }
  const focusBooking = changes => {
    setForm(previous => ({ ...previous, ...changes }))
    setErrors(previous => ({ ...previous, ...Object.fromEntries(Object.keys(changes).map(key => [key, ''])) }))
    setStatus('form')
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => travelTypeRef.current?.focus(), 450)
    })
  }
  const selectVehicle = vehicle => {
    setForm(previous => ({ ...previous, selectedVehicle: vehicle.name }))
    setErrors(previous => ({ ...previous, selectedVehicle: '' }))
    setActiveVehicle(null)
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => document.getElementById('corporate-selected-vehicle')?.focus(), 450)
    })
  }
  const validate = () => {
    const next = {}
    if (!form.travelType) next.travelType = 'Please select a travel type.'
    if (!form.pickupLocation.trim()) next.pickupLocation = 'Please select pickup location.'
    if (!form.dropLocation.trim()) next.dropLocation = 'Please select drop location.'
    if (form.pickupLocation.trim() && form.dropLocation.trim() && form.pickupLocation.trim().toLowerCase() === form.dropLocation.trim().toLowerCase()) next.dropLocation = 'Pickup and Drop Location cannot be identical.'
    if (!form.travelDate) next.travelDate = 'Please select travel date.'
    else if (form.travelDate < todayValue()) next.travelDate = 'Travel date cannot be in the past.'
    if (!form.passengers || Number(form.passengers) < 1 || Number(form.passengers) > 45) next.passengers = 'Please select number of passengers.'
    if (selectedVehicle && Number(form.passengers) > selectedVehicle.passengers) next.selectedVehicle = `The selected ${selectedVehicle.name} supports up to ${selectedVehicle.passengers} passengers. Please select a suitable vehicle.`
    if (!form.name.trim() && !user?.name?.trim()) next.name = 'Please enter your name.'
    if (!(form.email.trim() || user?.email?.trim()) && !(form.phone.trim() || user?.phone?.trim())) next.contact = 'Please provide an email address or phone number so our team can contact you.'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (form.phone.trim() && !/^[+\d][\d\s()-]{6,19}$/.test(form.phone.trim())) next.phone = 'Please enter a valid phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const handleSubmit = async event => {
    event.preventDefault()
    if (submitting || !validate()) return
    setSubmitting(true)
    setStatus('submitting')
    try {
      const details = [
        'Service: CORPORATE_TRANSPORTATION', `Travel type: ${form.travelType}`,
        `Pickup location: ${form.pickupLocation.trim()}`, `Drop location: ${form.dropLocation.trim()}`,
        `Passengers: ${form.passengers}`, form.selectedVehicle && `Selected vehicle: ${form.selectedVehicle}`,
        recommendation && `Passenger-based vehicle recommendation: ${recommendation.name}`,
        'Request type: Corporate transportation quote enquiry; not a confirmed booking.',
      ].filter(Boolean).join('\n')
      await api.post('/leads/public/submit', {
        name: form.name.trim() || user?.name || '', email: form.email.trim() || user?.email || '',
        phone: form.phone.trim() || user?.phone || '',
        destination: `${form.pickupLocation.trim()} to ${form.dropLocation.trim()}`,
        travelDate: form.travelDate, travelers: Number(form.passengers),
        leadType: 'corporate-transportation', sourceUrl: window.location.pathname, message: details,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }
  const closeModal = () => setActiveVehicle(null)

  return <div className="min-w-0 overflow-x-hidden bg-white text-navy-900">
    <SEOHead title="Corporate Transportation Services in India | TravelVista" description="TravelVista provides reliable corporate transportation for executives, client visits, employee commute, corporate events and business travel with professional drivers and premium vehicles across India." />
    <section className="relative isolate min-h-[220px] overflow-hidden bg-navy-950 text-white sm:min-h-[250px] lg:min-h-[270px]" aria-labelledby="corporate-title">
      <img src={HERO_IMAGE} alt="Modern business district with glass office buildings" loading="eager" className="absolute inset-0 h-full w-full object-cover object-center" />
      <img src={HERO_VEHICLE_IMAGE} alt="Black executive sedan for corporate transportation" loading="eager" className="absolute inset-y-0 right-[14%] hidden h-full w-[39%] object-cover object-center md:block" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-navy-950/15" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[220px] max-w-8xl items-center px-4 py-5 sm:min-h-[250px] sm:px-6 lg:min-h-[270px] lg:px-8"><div className="max-w-3xl"><Breadcrumb light items={[{ label: 'Local Travel', href: '/local-travel/airport-transfer' }, { label: 'Corporate Transportation' }]} /><h1 id="corporate-title" className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"><span className="text-white">Corporate </span><span className="text-gold-500">Transportation</span></h1><p className="mt-1 text-sm font-semibold tracking-wide text-white sm:text-base">Professional. <span className="text-gold-400">Reliable.</span> On Time.</p><p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/95 sm:text-base">Seamless corporate transportation solutions for your business travel needs. Ensure your team, clients and executives travel in comfort, safety and style with our well-maintained vehicles and professional chauffeurs.</p></div><div className="pointer-events-none absolute bottom-5 right-5 hidden rotate-[-6deg] text-right font-display text-2xl italic leading-tight text-white drop-shadow-lg lg:block xl:right-10 xl:text-3xl" aria-hidden="true"><span>Your<br />Business Travel<br />Partner</span><span className="mt-1 flex items-center justify-end gap-2"><span className="block w-12 border-b border-dashed border-white/90" /><Plane size={23} /></span></div></div>
    </section>
    <section aria-label="Corporate transportation features" className="border-b border-gray-100 bg-[#fcfaf6]"><div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto overscroll-x-contain px-3 py-2.5 [scrollbar-width:thin] min-[1280px]:justify-between min-[1280px]:px-8">{FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-[128px] shrink-0 flex-col items-center justify-center gap-1 border-r border-orange-100 px-3 text-center last:border-0 min-[1280px]:min-w-0 min-[1280px]:flex-1"><Icon size={20} strokeWidth={2.2} className="text-orange-600" aria-hidden="true" /><span className="whitespace-nowrap text-xs font-medium text-navy-800">{label}</span></div>)}</div></section>

    <div className="mx-auto grid max-w-8xl grid-cols-1 items-start gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,2.55fr)_minmax(310px,0.95fr)] lg:gap-5 lg:px-8 lg:py-5">
      <main className="min-w-0 space-y-3">
        <section aria-labelledby="corporate-fleet-heading"><h2 id="corporate-fleet-heading" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Corporate Fleet</h2><p className="mt-1 text-sm text-navy-700">Choose from a wide range of premium vehicles for your corporate travel.</p><div className="mt-3 grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 xl:grid-cols-3 min-[1400px]:grid-cols-5">{VEHICLES.map(vehicle => <article key={vehicle.name} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-lg motion-reduce:transform-none"><div className="h-32 overflow-hidden bg-gray-50 sm:h-28 2xl:h-28"><img src={vehicle.image} alt={vehicle.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" /></div><div className="flex flex-1 flex-col p-3"><h3 className="font-display text-base font-bold leading-tight text-navy-900">{vehicle.name}</h3><p className="mt-2 flex items-center gap-1.5 text-xs text-navy-700"><Users size={14} className="shrink-0 text-sky-700" aria-hidden="true" />{vehicle.capacityLabel}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><Luggage size={14} className="shrink-0 text-sky-700" aria-hidden="true" />{vehicle.luggage}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><UserRoundCheck size={14} className="shrink-0 text-sky-700" aria-hidden="true" />{vehicle.bestFor}</p><button type="button" onClick={event => { triggerRef.current = event.currentTarget; setActiveVehicle(vehicle) }} className="mt-2 flex min-h-8 w-full items-center justify-center gap-1 rounded-lg border border-orange-400 px-2 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">View Details <ArrowRight size={13} aria-hidden="true" /></button></div></article>)}</div></section>

        <section aria-labelledby="corporate-services-heading"><h2 id="corporate-services-heading" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Corporate Transportation Services</h2><p className="mt-1 text-sm text-navy-700">Reliable and flexible transportation solutions for all your business travel requirements.</p><div className="mt-3 grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 xl:grid-cols-3 min-[1400px]:grid-cols-6">{SERVICES.map(({ title, type, description, image, alt, icon: Icon }) => <button type="button" key={title} onClick={() => focusBooking({ travelType: type })} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 motion-reduce:transform-none"><span className="h-24 overflow-hidden sm:h-20"><img src={image} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" /></span><span className="flex flex-1 flex-col px-2.5 pb-3 pt-2 text-center"><span className="flex items-center justify-center gap-1 font-display text-sm font-bold leading-tight text-navy-900"><Icon size={15} className="shrink-0 text-orange-600" aria-hidden="true" />{title}</span><span className="mt-1 text-xs leading-snug text-navy-700">{description}</span><span className="sr-only">Select {title}</span></span></button>)}</div></section>

        <section aria-labelledby="corporate-benefits-heading"><h2 id="corporate-benefits-heading" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Why Choose Our Corporate Transportation?</h2><p className="mt-1 text-sm text-navy-700">We provide reliable and affordable corporate transportation services for individuals, teams and corporate travelers.</p><div className="mt-3 grid grid-cols-1 gap-2 min-[440px]:grid-cols-2 xl:grid-cols-3 min-[1400px]:grid-cols-6">{BENEFITS.map(({ title, description, icon: Icon }) => <article key={title} className="flex min-w-0 items-center gap-2.5 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600"><Icon size={20} aria-hidden="true" /></span><div className="min-w-0"><h3 className="text-xs font-bold text-navy-900">{title}</h3><p className="text-[11px] leading-snug text-navy-600">{description}</p></div></article>)}</div></section>

        <section className="rounded-xl bg-gradient-to-r from-gray-50 to-sky-50/50 px-4 py-4 sm:px-5" aria-labelledby="corporate-process-heading"><h2 id="corporate-process-heading" className="font-display text-xl font-bold text-navy-900 sm:text-2xl">Simple Booking Process</h2><p className="mt-0.5 text-sm text-navy-700">Book your corporate transportation in just a few easy steps.</p><ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{STEPS.map(({ title, description, icon: Icon }, index) => <li key={title} className="relative flex items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">{index + 1}</span><Icon size={21} className="shrink-0 text-navy-800" aria-hidden="true" /><div className="min-w-0"><h3 className="text-xs font-semibold text-navy-900">{title}</h3><p className="text-[11px] leading-snug text-navy-600">{description}</p></div>{index < STEPS.length - 1 && <ArrowRight size={17} className="absolute -right-1 top-1/2 hidden -translate-y-1/2 text-sky-800 xl:block" aria-hidden="true" />}</li>)}</ol></section>
      </main>

      <aside className="min-w-0 space-y-3 lg:sticky lg:top-24 lg:self-start">
        <section ref={bookingRef} id="corporate-booking" tabIndex={-1} className="scroll-mt-24 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" aria-labelledby="corporate-booking-heading"><div className="flex items-center gap-2 bg-sky-50 px-3 py-2.5"><CarFront size={25} className="shrink-0 text-sky-600" aria-hidden="true" /><div><h2 id="corporate-booking-heading" className="font-display text-base font-bold leading-tight text-navy-900 sm:text-lg">Book Corporate Transportation</h2><p className="text-[11px] text-navy-700">Get a quote for professional corporate travel solutions.</p></div></div>
          {status === 'success' ? <div className="p-5 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={27} /></span><h3 className="mt-3 font-display text-lg font-bold text-navy-900">Corporate Transportation Request Submitted</h3><p className="mt-2 text-sm leading-relaxed text-navy-700">Thank you. We have received your corporate transportation request. Our travel expert will contact you shortly with suitable vehicle options and quote details.</p><div className="mt-4 flex flex-col gap-2"><Link to="/local-travel/airport-transfer" className="rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50">Explore Local Travel</Link><Link to="/" className="rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-600">Back to Home</Link></div></div> : <form className="space-y-2.5 p-3" onSubmit={handleSubmit} noValidate>
            {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><strong className="block">Unable to Submit Request</strong><span>Something went wrong while sending your corporate transportation request. Please try again.</span><button type="button" onClick={() => setStatus('form')} className="mt-1 block font-semibold underline">Try Again</button></div>}
            <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2"><Field id="corporateTravelType" label="Travel Type" error={errors.travelType}><select ref={travelTypeRef} id="corporateTravelType" required aria-required="true" aria-invalid={Boolean(errors.travelType)} className={fieldClass} value={form.travelType} onChange={event => update('travelType', event.target.value)}><option value="">Select Travel Type</option>{TRAVEL_TYPES.map(type => <option key={type}>{type}</option>)}</select></Field><Field id="corporatePickup" label="Pickup Location" error={errors.pickupLocation}><input id="corporatePickup" required aria-required="true" aria-invalid={Boolean(errors.pickupLocation)} autoComplete="street-address" className={fieldClass} placeholder="Select Pickup Location" value={form.pickupLocation} onChange={event => update('pickupLocation', event.target.value)} /></Field><Field id="corporateDrop" label="Drop Location" error={errors.dropLocation}><input id="corporateDrop" required aria-required="true" aria-invalid={Boolean(errors.dropLocation)} className={fieldClass} placeholder="Select Drop Location" value={form.dropLocation} onChange={event => update('dropLocation', event.target.value)} /></Field><Field id="corporateTravelDate" label="Travel Date" error={errors.travelDate}><input id="corporateTravelDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.travelDate)} min={todayValue()} className={fieldClass} value={form.travelDate} onChange={event => update('travelDate', event.target.value)} /></Field><Field id="corporatePassengers" label="Number of Passengers" error={errors.passengers}><select id="corporatePassengers" required aria-required="true" aria-invalid={Boolean(errors.passengers)} className={fieldClass} value={form.passengers} onChange={event => update('passengers', event.target.value)}>{Array.from({ length: 45 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>)}</select></Field><Field id="corporate-selected-vehicle" label="Selected Vehicle (optional)" error={errors.selectedVehicle}><select id="corporate-selected-vehicle" aria-invalid={Boolean(errors.selectedVehicle)} className={fieldClass} value={form.selectedVehicle} onChange={event => update('selectedVehicle', event.target.value)}><option value="">No preference{recommendation ? ` (suggested: ${recommendation.name})` : ''}</option>{visibleVehicleOptions.map(vehicle => <option key={vehicle.name} value={vehicle.name}>{vehicle.name} (up to {vehicle.passengers})</option>)}</select></Field></div>
            {selectedVehicle && form.passengers && Number(form.passengers) > selectedVehicle.passengers && <p className="rounded bg-amber-50 p-2 text-xs text-amber-800" role="status">{selectedVehicle.name} supports up to {selectedVehicle.passengers} passengers. Select a larger option or clear the preference.</p>}
            {recommendation && <p className="text-[11px] text-sky-800" role="status">Suggested for {form.passengers} passengers: {recommendation.name}. This is a guide only; availability is confirmed by our team.</p>}
            <details className="rounded-lg border border-gray-100 px-3 py-2 text-xs" open={!user}><summary className="cursor-pointer font-medium text-sky-800">Contact details {!user && '(required)'}</summary><div className="mt-2 space-y-2"><Field id="corporateName" label="Full Name" error={errors.name}><input id="corporateName" autoComplete="name" aria-invalid={Boolean(errors.name)} className={fieldClass} value={form.name} onChange={event => update('name', event.target.value)} /></Field><Field id="corporateEmail" label="Email" error={errors.email}><input id="corporateEmail" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={fieldClass} value={form.email} onChange={event => update('email', event.target.value)} /></Field><Field id="corporatePhone" label="Phone" error={errors.phone}><input id="corporatePhone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} className={fieldClass} value={form.phone} onChange={event => update('phone', event.target.value)} /></Field>{errors.contact && <p className="text-xs text-red-600" role="alert">{errors.contact}</p>}</div></details>
            <button type="submit" disabled={submitting} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{submitting ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Submitting...</> : <>Get Quote <ArrowRight size={17} aria-hidden="true" /></>}</button><p className="text-center text-[10px] text-navy-500">This form sends a quote request; no prices or booking confirmation are generated here.</p>
          </form>}
        </section>
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="businesses-choose-title"><h2 id="businesses-choose-title" className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 font-display text-base font-bold leading-tight text-navy-900 sm:text-lg"><Star size={20} className="fill-gold-400 text-gold-500" aria-hidden="true" />Why Businesses Choose Us?</h2><ul className="space-y-1.5 px-3 py-3">{WHY_BUSINESSES.map(item => <li key={item} className="flex items-start gap-2 text-xs leading-snug text-navy-800"><CheckCircle2 size={15} className="mt-0.5 shrink-0 fill-green-600 text-white" aria-hidden="true" />{item}</li>)}</ul></section>
        <section className="rounded-xl border border-gold-100 bg-amber-50/70 p-4" aria-labelledby="corporate-help-title"><div className="flex items-start gap-3"><Headphones size={26} className="shrink-0 text-orange-500" aria-hidden="true" /><div><h2 id="corporate-help-title" className="font-display text-lg font-bold text-navy-900">Need a Corporate Travel Solution?</h2><p className="mt-1 text-sm leading-snug text-navy-700">Our travel experts are available to help you plan the perfect transportation solution for your business.</p><Link to="/contact" className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 text-sm font-bold text-white hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2">Contact Us <ArrowRight size={15} aria-hidden="true" /></Link></div></div></section>
      </aside>
    </div>
    {activeVehicle && <VehicleDetailsModal vehicle={activeVehicle} triggerRef={triggerRef} onClose={closeModal} onSelect={selectVehicle} />}
  </div>
}
