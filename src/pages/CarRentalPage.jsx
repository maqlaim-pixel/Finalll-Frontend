import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, CalendarDays, CarFront, Check, CheckCircle2,
  Clock3, Fuel, Headphones, IndianRupee, KeyRound, Luggage, MapPin,
  Plane, ShieldCheck, Star, Users, Wrench, X, LoaderCircle,
} from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import Breadcrumb from '../components/common/Breadcrumb'
import api from '../services/api'
import useLocalTravelFlow from '../hooks/useLocalTravelFlow'
import LocalTravelAuthPrompt from '../components/common/LocalTravelAuthPrompt'
import { CITY_LIST } from '../data/cityData'
import { LOCAL_TRANSFER_VEHICLES } from '../data/localTransferVehicles'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2200&q=88'
const INDIAN_STATES = new Set([
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Jammu and Kashmir', 'Ladakh',
  'Delhi', 'Andaman and Nicobar Islands',
])
// Existing editorial city records are used as enquiry choices only; they do not imply service coverage.
const PICKUP_CITIES = [...new Set(CITY_LIST
  .filter(city => !city.slug.includes('/') && INDIAN_STATES.has(city.state))
  .map(city => city.name))].sort((a, b) => a.localeCompare(b))
const SHARED_VEHICLES = LOCAL_TRANSFER_VEHICLES
const sharedVehicle = name => SHARED_VEHICLES.find(vehicle => vehicle.name === name)

// Rental display specifications supplied in the page reference; actual model, capacity and availability are confirmed with each quote.
const RENTAL_VEHICLES = [
  { name: 'Hatchback', passengers: '4–5 Passengers', luggage: '2 Bags', fuel: 'Petrol / Diesel', image: sharedVehicle('Hatchback')?.image, alt: 'Hatchback car for a rental enquiry' },
  { name: 'Sedan', passengers: '4–5 Passengers', luggage: '3 Bags', fuel: 'Petrol / Diesel', image: sharedVehicle('Sedan')?.image, alt: 'Sedan car for a rental enquiry' },
  { name: 'SUV', passengers: '6–7 Passengers', luggage: '4 Bags', fuel: 'Diesel', image: sharedVehicle('SUV')?.image, alt: 'SUV car for a rental enquiry' },
  { name: 'Innova / Crysta', passengers: '6–7 Passengers', luggage: '6 Bags', fuel: 'Diesel', image: sharedVehicle('SUV')?.image, alt: 'SUV suitable for an Innova or Crysta rental request' },
  { name: 'Tempo Traveller', passengers: '9–16 Passengers', luggage: '8+ Bags', fuel: 'Diesel', image: sharedVehicle('Tempo Traveller')?.image, alt: 'Tempo Traveller for a rental enquiry' },
]
const FEATURES = [
  { icon: CarFront, label: 'Wide Vehicle Range' },
  { icon: ShieldCheck, label: 'Well-Maintained Cars' },
  { icon: IndianRupee, label: 'Affordable Pricing' },
  { icon: Users, label: 'Driver Options on Request' },
  { icon: Clock3, label: 'Flexible Rental Plans' },
  { icon: Headphones, label: '24/7 Customer Support' },
  { icon: MapPin, label: 'Major Cities — Confirm on Request' },
]
const WHY_CHOOSE = [
  { icon: IndianRupee, title: 'Affordable Rates', text: 'Request a clear quote with no assumed prices' },
  { icon: Wrench, title: 'Well-Maintained Vehicles', text: 'Vehicle condition and details confirmed with your quote' },
  { icon: CalendarDays, title: 'Flexible Rental Plans', text: 'Ask about hourly, daily or longer-term options' },
  { icon: Users, title: 'Driver Preferences', text: 'Driver arrangements confirmed by our travel team; self-drive is not listed as a confirmed service' },
  { icon: Headphones, title: '24/7 Support', text: 'Assistance anytime during your journey' },
  { icon: MapPin, title: 'City Coverage on Request', text: 'Ask our team to confirm service in your pickup city' },
]
const RENTAL_PLANS = [
  'Daily Car Rental', 'Weekly Car Rental', 'Monthly Car Rental',
  'Self Drive Car Rental', 'Chauffeur Driven Car Rental', 'Outstation Car Rental',
  'Airport Transfer Car Rental', 'Corporate Car Rental',
]
const STEPS = [
  { title: 'Select Vehicle', text: 'Choose your preferred car', icon: CarFront },
  { title: 'Provide Details', text: 'Pickup, drop, date & time', icon: CalendarDays },
  { title: 'Get Quote', text: 'Choose vehicle & confirm', icon: BadgeCheck },
  { title: 'Enjoy Your Ride', text: 'Safe, comfortable journey', icon: CheckCircle2 },
]
const fieldClass = 'mt-1.5 min-h-10 w-full min-w-0 rounded-md border border-navy-200 bg-white px-2.5 py-2 text-xs text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:px-3 sm:text-sm'
const initialForm = { pickupCity: '', pickupDate: '', pickupTime: '', dropDate: '', dropTime: '', vehicleType: '', name: '', email: '', phone: '' }
const todayValue = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2)
  const minute = index % 2 ? '30' : '00'
  const period = hour < 12 ? 'AM' : 'PM'
  const displayHour = hour % 12 || 12
  return { value: `${String(hour).padStart(2, '0')}:${minute}`, label: `${displayHour}:${minute} ${period}` }
})

function Field({ id, label, error, children }) {
  return <div className="min-w-0"><label htmlFor={id} className="block text-xs font-medium text-navy-700">{label}</label>{children}{error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}</div>
}

function VehicleDetailsModal({ vehicle, onClose, onSelect, triggerRef }) {
  const closeRef = useRef(null)
  useEffect(() => {
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
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (triggerRef.current?.isConnected) triggerRef.current.focus()
    }
  }, [onClose, triggerRef])

  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-navy-950/65 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="car-rental-vehicle-title" aria-describedby="car-rental-vehicle-description" className="relative my-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
      <button ref={closeRef} type="button" aria-label="Close vehicle details" onClick={onClose} className="absolute right-3 top-3 rounded p-2 text-navy-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={19} /></button>
      <img src={vehicle.image} alt={vehicle.alt} className="h-44 w-full rounded-lg object-cover" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-orange-600">Vehicle details on request</p>
      <h2 id="car-rental-vehicle-title" className="mt-1 font-display text-2xl font-bold text-navy-900">{vehicle.name}</h2>
      <p id="car-rental-vehicle-description" className="sr-only">Rental vehicle display specifications and quote availability notice.</p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-navy-700">
        <span className="flex items-center gap-2"><Users size={16} className="text-sky-700" />{vehicle.passengers}</span>
        <span className="flex items-center gap-2"><Luggage size={16} className="text-sky-700" />{vehicle.luggage}</span>
        <span className="col-span-2 flex items-center gap-2"><Fuel size={16} className="text-sky-700" />{vehicle.fuel}</span>
      </div>
      <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-3 text-sm text-navy-700">
        <div><h3 className="font-semibold text-navy-900">Rental Options</h3><p className="mt-0.5">Rental duration and driver preferences can be discussed with our travel expert.</p></div>
        <div><h3 className="font-semibold text-navy-900">Suitable For</h3><p className="mt-0.5">Vehicle suitability and availability are confirmed for your requested journey.</p></div>
        <div><h3 className="font-semibold text-navy-900">Vehicle Features</h3><p className="mt-0.5">AC, transmission and model-specific features are confirmed with the assigned vehicle; they are not assumed here.</p></div>
      </div>
      <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs leading-relaxed text-navy-700">Passenger, luggage and fuel details are reference display specifications only. Exact model, capacity, fuel, rental option and availability are confirmed with your quote. No price is calculated here.</p>
      <button type="button" onClick={() => onSelect(vehicle)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-3 font-bold text-white transition hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-600">Select Vehicle <ArrowRight size={17} /></button>
    </section>
  </div>
}

export default function CarRentalPage() {
  const { form, setForm, user, authPromptOpen, setAuthPromptOpen, requireAuthentication, continueToAuth, clearDraft } = useLocalTravelFlow(initialForm)
  const bookingRef = useRef(null)
  const pickupCityRef = useRef(null)
  const vehicleTypeRef = useRef(null)
  const contactDetailsRef = useRef(null)
  const vehicleTriggerRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('form')
  const [submitting, setSubmitting] = useState(false)
  const [activeVehicle, setActiveVehicle] = useState(null)
  const [citiesAvailable] = useState(PICKUP_CITIES.length > 0)

  useEffect(() => {
    if (user) setForm(previous => ({ ...previous, name: previous.name || user.name || '', email: previous.email || user.email || '', phone: previous.phone || user.phone || '' }))
  }, [user])

  const closeVehicle = useCallback(() => setActiveVehicle(null), [])
  const pickupTimeChoices = useMemo(() => TIME_OPTIONS, [])
  const isSameDay = Boolean(form.pickupDate && form.dropDate && form.pickupDate === form.dropDate)
  const currentVehicle = RENTAL_VEHICLES.find(vehicle => vehicle.name === form.vehicleType)
  const durationText = useMemo(() => {
    if (!form.pickupDate || !form.pickupTime || !form.dropDate || !form.dropTime || form.dropDate < form.pickupDate) return ''
    const [startHour, startMinute] = form.pickupTime.split(':').map(Number)
    const [endHour, endMinute] = form.dropTime.split(':').map(Number)
    const start = new Date(`${form.pickupDate}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`)
    const end = new Date(`${form.dropDate}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`)
    const minutes = Math.floor((end.getTime() - start.getTime()) / 60000)
    if (minutes <= 0) return ''
    const days = Math.floor(minutes / 1440)
    const hours = Math.floor((minutes % 1440) / 60)
    const remainder = minutes % 60
    return [days && `${days} ${days === 1 ? 'day' : 'days'}`, hours && `${hours} ${hours === 1 ? 'hour' : 'hours'}`, remainder && `${remainder} min`].filter(Boolean).join(', ')
  }, [form.dropDate, form.dropTime, form.pickupDate, form.pickupTime])

  const update = (key, value) => {
    setForm(previous => ({ ...previous, [key]: value }))
    setErrors(previous => ({
      ...previous,
      [key]: '',
      ...(key === 'pickupDate' ? { dropDate: '', dropTime: '' } : {}),
      ...(key === 'pickupTime' || key === 'dropDate' ? { dropTime: '' } : {}),
    }))
    if (status === 'error') setStatus('form')
  }

  const focusBooking = (focusRef = null) => {
    setStatus('form')
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => (focusRef?.current || pickupCityRef.current)?.focus(), 450)
    })
  }

  const chooseVehicle = vehicle => {
    setForm(previous => ({ ...previous, vehicleType: vehicle.name }))
    setErrors(previous => ({ ...previous, vehicleType: '' }))
    setActiveVehicle(null)
    focusBooking(vehicleTypeRef)
  }

  const validate = () => {
    const next = {}
    if (!form.pickupCity || !PICKUP_CITIES.includes(form.pickupCity)) next.pickupCity = citiesAvailable ? 'Please select a pickup city.' : 'Pickup city options are currently unavailable. Please contact our travel experts.'
    if (!form.pickupDate) next.pickupDate = 'Please select a pickup date.'
    else if (form.pickupDate < todayValue()) next.pickupDate = 'Pickup date cannot be in the past.'
    if (!form.pickupTime) next.pickupTime = 'Please select a pickup time.'
    if (!form.dropDate) next.dropDate = 'Please select a drop date.'
    else if (form.dropDate < todayValue()) next.dropDate = 'Drop date cannot be in the past.'
    else if (form.pickupDate && form.dropDate < form.pickupDate) next.dropDate = 'Drop date cannot be before pickup date.'
    if (!form.dropTime) next.dropTime = 'Please select a drop time.'
    else if (form.pickupDate && form.dropDate === form.pickupDate && form.pickupTime && form.dropTime <= form.pickupTime) next.dropTime = 'Drop time must be later than pickup time.'
    if (!form.vehicleType || !RENTAL_VEHICLES.some(vehicle => vehicle.name === form.vehicleType)) next.vehicleType = 'Please select a vehicle.'
    if (!(form.name.trim() || user?.name?.trim())) next.name = 'Please enter your name.'
    if (!(form.email.trim() || user?.email?.trim()) && !(form.phone.trim() || user?.phone?.trim())) next.contact = 'Please provide an email address or phone number so our team can contact you.'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (form.phone.trim() && !/^[+\d][\d\s()-]{6,19}$/.test(form.phone.trim())) next.phone = 'Please enter a valid phone number.'
    setErrors(next)
    if (next.name || next.contact || next.email || next.phone) contactDetailsRef.current?.setAttribute('open', '')
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
      const details = [
        'Service: CAR_RENTAL',
        `Pickup city: ${form.pickupCity}`,
        `Pickup date: ${form.pickupDate}`,
        `Pickup time: ${form.pickupTime}`,
        `Drop date: ${form.dropDate}`,
        `Drop time: ${form.dropTime}`,
        `Vehicle type requested: ${form.vehicleType}`,
        durationText && `Requested rental duration: ${durationText} (informational only; no fare calculated)`,
        'Request type: Quote enquiry; not a confirmed booking.',
        'City coverage, vehicle model, capacity, rental plan, driver arrangement and availability require confirmation by a travel expert.',
      ].filter(Boolean).join('\n')
      await api.post('/local-travel/enquiries', {
        serviceType: 'car-rental', formData: form, sourceUrl: window.location.pathname,
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
    <SEOHead title="Car Rental Service in India | TravelVista" description="Rent comfortable and well-maintained cars with TravelVista. Choose from hatchbacks, sedans, SUVs, Innova/Crysta and Tempo Travellers for flexible travel across India." />

    <section className="relative isolate min-h-[210px] overflow-hidden bg-navy-950 text-white sm:min-h-[245px] lg:min-h-[270px]" aria-labelledby="car-rental-title">
      <img src={HERO_IMAGE} alt="Scenic open road for a long-distance car rental journey" loading="eager" className="absolute inset-0 h-full w-full object-cover object-[50%_58%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-navy-950/10" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[210px] max-w-8xl items-center px-4 py-5 sm:min-h-[245px] sm:px-6 lg:min-h-[270px] lg:px-8">
        <div className="max-w-3xl">
          <Breadcrumb light items={[{ label: 'Local Travel', href: '/local-travel/airport-transfer' }, { label: 'Car Rental' }]} />
          <h1 id="car-rental-title" className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"><span className="text-white">Car </span><span className="text-gold-500">Rental</span></h1>
          <p className="mt-1 text-sm font-semibold tracking-wide text-white sm:text-base">Drive Your Journey, Your Way</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/95 sm:text-base">Get the best car rental services for your travel needs. Choose from a wide range of well-maintained vehicles at affordable prices and enjoy a comfortable, flexible and hassle-free travel experience.</p>
        </div>
        <div className="pointer-events-none absolute bottom-5 right-5 hidden rotate-[-6deg] text-right font-display text-2xl italic leading-tight text-white drop-shadow-lg lg:block xl:right-10 xl:text-3xl" aria-hidden="true"><span>Freedom<br />to Explore<br />at Your Own Pace</span><span className="mt-1 flex items-center justify-end gap-2"><span className="block w-12 border-b border-dashed border-white/90" /><Plane size={23} /></span></div>
      </div>
    </section>

    <section aria-label="Car rental features" className="border-b border-gray-100 bg-[#fcfaf6]"><div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto overscroll-x-contain px-3 py-2.5 [scrollbar-width:thin] min-[1280px]:justify-between min-[1280px]:px-8">{FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-[132px] shrink-0 flex-col items-center justify-center gap-1 border-r border-orange-100 px-3 text-center last:border-0 min-[1280px]:min-w-0 min-[1280px]:flex-1"><Icon size={20} strokeWidth={2.2} className="text-orange-600" aria-hidden="true" /><span className="whitespace-nowrap text-xs font-medium text-navy-800">{label}</span></div>)}</div></section>

    <div className="mx-auto grid max-w-8xl grid-cols-1 items-start gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,2.55fr)_minmax(310px,0.95fr)] lg:gap-5 lg:px-8 lg:py-5">
      <main className="min-w-0 space-y-3">
        <section aria-labelledby="car-rental-services-title">
          <h2 id="car-rental-services-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Car Rental Services</h2>
          <p className="mt-1 text-sm text-navy-700">Choose from a wide range of vehicles to make your journey comfortable and memorable.</p>
          <p className="mt-1 text-[11px] text-navy-500">Vehicle specifications below are reference display values. Exact models, capacities and availability are confirmed with your quote.</p>
          {RENTAL_VEHICLES.length === 0 ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5 text-center"><h3 className="font-display text-xl font-bold text-navy-900">Car Rental Currently Unavailable</h3><p className="mt-2 text-sm text-navy-700">We currently don't have a suitable rental vehicle available for your selection. Please try another date or contact our travel experts.</p><button type="button" onClick={() => focusBooking()} className="mt-4 rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-700">Change Details</button><Link to="/contact" className="ml-2 inline-flex rounded-lg bg-gold-700 px-4 py-2 text-sm font-bold text-white">Contact Us</Link></div> : <div className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-3 min-[1440px]:grid-cols-5">{RENTAL_VEHICLES.map(vehicle => <article key={vehicle.name} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"><div className="h-36 overflow-hidden bg-gray-50 sm:h-28 lg:h-32"><img src={vehicle.image} alt={vehicle.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" /></div><div className="flex flex-1 flex-col p-3"><h3 className="font-display text-base font-bold leading-tight text-navy-900">{vehicle.name}</h3><p className="mt-2 flex items-center gap-1.5 text-xs text-navy-700"><Users size={14} className="shrink-0 text-sky-800" aria-hidden="true" />{vehicle.passengers}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><Luggage size={14} className="shrink-0 text-sky-800" aria-hidden="true" />{vehicle.luggage}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-700"><Fuel size={14} className="shrink-0 text-sky-800" aria-hidden="true" />{vehicle.fuel}</p><button type="button" onClick={event => { vehicleTriggerRef.current = event.currentTarget; setActiveVehicle(vehicle) }} className="mt-3 flex min-h-8 w-full items-center justify-center gap-2 rounded-lg border border-orange-500 px-2 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm">View Details <ArrowRight size={14} aria-hidden="true" /></button></div></article>)}</div>}
        </section>

        <section aria-labelledby="car-rental-why-title"><h2 id="car-rental-why-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Why Choose Our Car Rental Service?</h2><p className="mt-1 text-sm text-navy-700">We provide reliable and affordable car rental services for individuals, families and corporate travelers.</p><div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">{WHY_CHOOSE.map(({ icon: Icon, title, text }) => <article key={title} className="flex min-w-0 flex-col items-center rounded-xl border border-gray-100 bg-white px-3 py-3 text-center shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600"><Icon size={22} aria-hidden="true" /></span><h3 className="mt-2 font-display text-sm font-bold leading-tight text-navy-900">{title}</h3><p className="mt-1 text-xs leading-snug text-navy-700">{text}</p></article>)}</div></section>

        <section className="rounded-xl bg-gradient-to-r from-gray-50 to-sky-50/50 px-4 py-4 sm:px-5" aria-labelledby="car-rental-process-title"><h2 id="car-rental-process-title" className="font-display text-xl font-bold text-navy-900 sm:text-2xl">Simple Booking Process</h2><p className="mt-0.5 text-sm text-navy-700">Book your car rental in just a few easy steps.</p><ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{STEPS.map(({ title, text, icon: Icon }, index) => <li key={title} className="relative flex items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">{index + 1}</span><Icon size={21} className="shrink-0 text-navy-800" aria-hidden="true" /><div className="min-w-0"><h3 className="text-xs font-semibold text-navy-900">{title}</h3><p className="text-[11px] leading-snug text-navy-600">{text}</p></div>{index < STEPS.length - 1 && <ArrowRight size={17} className="absolute -right-1 top-1/2 hidden -translate-y-1/2 text-sky-800 xl:block" aria-hidden="true" />}</li>)}</ol></section>
      </main>

      <aside className="min-w-0 space-y-3 lg:sticky lg:top-24 lg:self-start">
        <section ref={bookingRef} id="car-rental-booking" tabIndex={-1} className="scroll-mt-24 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" aria-labelledby="car-rental-booking-title">
          <div className="flex items-center gap-2 bg-sky-50 px-3 py-2.5"><CarFront size={25} className="shrink-0 text-sky-600" aria-hidden="true" /><div className="min-w-0"><h2 id="car-rental-booking-title" className="font-display text-base font-bold leading-tight text-navy-900 sm:text-lg">Book Your Car Rental</h2><p className="text-[11px] text-navy-700">Request a quote for your car rental journey.</p></div></div>
          {status === 'success' ? <div className="p-5 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={27} /></span><h3 className="mt-3 font-display text-lg font-bold text-navy-900">Car Rental Request Submitted</h3><p className="mt-2 text-sm leading-relaxed text-navy-700">Thank you. We have received your car rental request. Our travel expert will contact you shortly with available vehicle options and quote.</p><div className="mt-4 flex flex-col gap-2"><Link to="/local-travel/airport-transfer" className="rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50">Explore Local Travel</Link><Link to="/" className="rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-600">Back to Home</Link></div></div> : <form className="space-y-2.5 p-3" onSubmit={handleSubmit} noValidate>
            {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><strong className="block">Unable to Submit Request</strong><span>Something went wrong while sending your car rental request. Please try again.</span><button type="button" onClick={() => setStatus('form')} className="mt-1 block font-semibold underline">Try Again</button></div>}
            {Object.keys(errors).length > 0 && <p className="sr-only" role="alert">Please correct the highlighted fields.</p>}
            {!citiesAvailable && <p className="rounded bg-amber-50 p-2 text-xs text-amber-800" role="status">Pickup city options are currently unavailable. Contact our travel experts for help.</p>}
            <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
              <Field id="rentalPickupCity" label="Pickup City" error={errors.pickupCity}><select ref={pickupCityRef} id="rentalPickupCity" required aria-required="true" aria-invalid={Boolean(errors.pickupCity)} className={fieldClass} value={form.pickupCity} onChange={event => update('pickupCity', event.target.value)}><option value="">Select Pickup City</option>{PICKUP_CITIES.map(city => <option key={city} value={city}>{city}</option>)}</select></Field>
              <Field id="rentalPickupDate" label="Pickup Date" error={errors.pickupDate}><input id="rentalPickupDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.pickupDate)} min={todayValue()} className={fieldClass} value={form.pickupDate} onChange={event => update('pickupDate', event.target.value)} /></Field>
              <Field id="rentalPickupTime" label="Pickup Time" error={errors.pickupTime}><select id="rentalPickupTime" required aria-required="true" aria-invalid={Boolean(errors.pickupTime)} className={fieldClass} value={form.pickupTime} onChange={event => update('pickupTime', event.target.value)}><option value="">Select Time</option>{pickupTimeChoices.map(time => <option key={time.value} value={time.value}>{time.label}</option>)}</select></Field>
              <Field id="rentalDropDate" label="Drop Date" error={errors.dropDate}><input id="rentalDropDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.dropDate)} min={form.pickupDate || todayValue()} className={fieldClass} value={form.dropDate} onChange={event => update('dropDate', event.target.value)} /></Field>
              <Field id="rentalDropTime" label="Drop Time" error={errors.dropTime}><select id="rentalDropTime" required aria-required="true" aria-invalid={Boolean(errors.dropTime)} className={fieldClass} value={form.dropTime} onChange={event => update('dropTime', event.target.value)}><option value="">Select Time</option>{TIME_OPTIONS.map(time => <option key={time.value} value={time.value} disabled={isSameDay && Boolean(form.pickupTime) && time.value <= form.pickupTime}>{time.label}</option>)}</select></Field>
              <Field id="rentalVehicleType" label="Vehicle Type" error={errors.vehicleType}><select ref={vehicleTypeRef} id="rentalVehicleType" required aria-required="true" aria-invalid={Boolean(errors.vehicleType)} className={fieldClass} value={form.vehicleType} onChange={event => update('vehicleType', event.target.value)}><option value="">Select Vehicle</option>{RENTAL_VEHICLES.map(vehicle => <option key={vehicle.name} value={vehicle.name}>{vehicle.name}</option>)}</select></Field>
            </div>
            {durationText && <p className="rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-900" role="status">Requested rental duration: {durationText}. This is informational only; no fare is calculated.</p>}
            <details ref={contactDetailsRef} className="rounded-lg border border-gray-100 px-3 py-2 text-xs" open={!user}><summary className="cursor-pointer font-medium text-sky-800">Contact details {!user && '(required)'}</summary><div className="mt-2 space-y-2"><Field id="rentalName" label="Full Name" error={errors.name}><input id="rentalName" autoComplete="name" aria-invalid={Boolean(errors.name)} className={fieldClass} value={form.name} onChange={event => update('name', event.target.value)} /></Field><Field id="rentalEmail" label="Email" error={errors.email}><input id="rentalEmail" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={fieldClass} value={form.email} onChange={event => update('email', event.target.value)} /></Field><Field id="rentalPhone" label="Phone" error={errors.phone}><input id="rentalPhone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} className={fieldClass} value={form.phone} onChange={event => update('phone', event.target.value)} /></Field>{errors.contact && <p className="text-xs text-red-600" role="alert">{errors.contact}</p>}<p className="text-[11px] text-navy-500">Your signed-in details are used when available. Otherwise, enter your name and at least one contact method.</p></div></details>
            <button type="submit" disabled={submitting} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{submitting ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Submitting...</> : <>Get Quote <ArrowRight size={17} aria-hidden="true" /></>}</button>
            <p className="text-center text-[10px] text-navy-500">No price or live availability is calculated here. Our team will confirm options in its quote.</p>
          </form>}
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="car-rental-plans-title"><h2 id="car-rental-plans-title" className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 font-display text-base font-bold leading-tight text-navy-900 sm:text-lg"><Star size={20} className="fill-gold-400 text-gold-500" aria-hidden="true" />Popular Rental Plans</h2><p className="px-3 pt-2 text-[11px] text-navy-600">Enquiry categories only; services and availability require confirmation.</p><ul className="space-y-1.5 px-3 py-3">{RENTAL_PLANS.map(plan => <li key={plan} className="flex items-start gap-2 text-xs leading-snug text-navy-800"><CheckCircle2 size={15} className="mt-0.5 shrink-0 fill-green-600 text-white" aria-hidden="true" />{plan}</li>)}</ul></section>
        <section className="rounded-xl border border-gold-100 bg-amber-50/70 p-4" aria-labelledby="car-rental-help-title"><div className="flex items-start gap-3"><Headphones size={26} className="shrink-0 text-orange-500" aria-hidden="true" /><div><h2 id="car-rental-help-title" className="font-display text-lg font-bold text-navy-900">Need Help?</h2><p className="mt-1 text-sm leading-snug text-navy-700">Our travel experts are available 24/7 to assist you with your car rental booking.</p><Link to="/contact" className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2">Contact Us <ArrowRight size={15} aria-hidden="true" /></Link></div></div></section>
      </aside>
    </div>

    {activeVehicle && <VehicleDetailsModal vehicle={activeVehicle} triggerRef={vehicleTriggerRef} onClose={closeVehicle} onSelect={chooseVehicle} />}
    {authPromptOpen && <LocalTravelAuthPrompt onClose={() => setAuthPromptOpen(false)} onContinue={continueToAuth} />}
  </div>
}
