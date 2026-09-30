import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, CalendarDays, CarFront, Check, CheckCircle2,
  ChevronRight, Clock3, Headphones, Luggage, MapPin, Plane, Search,
  ShieldCheck, Star, UserRound, Users, X, LoaderCircle,
} from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import Breadcrumb from '../components/common/Breadcrumb'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { AIRPORT_TRANSFER_AIRPORTS } from '../data/airportTransferAirports'
import { LOCAL_TRANSFER_VEHICLES as VEHICLES } from '../data/localTransferVehicles'

const TRANSFER_TYPES = ['Airport Pickup', 'Airport Drop', 'Meet & Greet']
const SERVICES = [
  { title: 'Airport Pickup', type: 'Airport Pickup', desc: 'Hassle-free pickup from airport to your hotel, home or any destination.', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=900&q=82', alt: 'Passengers arriving at a modern airport terminal', icon: Plane, color: 'text-orange-500', tag: 'Arrivals' },
  { title: 'Airport Drop', type: 'Airport Drop', desc: 'Timely drop to airport from your hotel, home or any location.', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=82', alt: 'Airplane at an airport ahead of departure', icon: Plane, color: 'text-sky-600', tag: 'Departures' },
  { title: 'Meet & Greet Service', type: 'Meet & Greet', desc: 'Personal assistance at the airport with luggage support for a smooth travel experience.', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=82', alt: 'Premium vehicle ready for an airport meet and greet', icon: BadgeCheck, color: 'text-green-600', tag: 'Personal assistance' },
]
const FEATURES = [
  { icon: Plane, label: 'Airport Pickup' }, { icon: CarFront, label: 'Airport Drop' },
  { icon: Clock3, label: 'On-Time Service' }, { icon: ShieldCheck, label: 'Safe & Secure' },
  { icon: UserRound, label: 'Professional Drivers' }, { icon: BadgeCheck, label: 'Transparent Pricing' },
  { icon: Headphones, label: '24/7 Support' }, { icon: MapPin, label: 'All Major Airports' },
]
const REASONS = [
  'Punctual and reliable service', 'Professional and verified drivers',
  'Well-maintained and clean vehicles', 'Flight tracking for timely pickup',
  'Transparent and competitive pricing', '24/7 customer support',
  'Available at all major airports in India', 'Options for individuals, families and corporate travelers',
]
const STEPS = [
  { title: 'Select Transfer Type', text: 'Choose pickup or drop', icon: Search },
  { title: 'Provide Details', text: 'Date, time, flight & location', icon: CalendarDays },
  { title: 'Get Quote', text: 'Choose vehicle & confirm', icon: CarFront },
  { title: 'Enjoy Your Ride', text: 'Safe, on-time transfer', icon: CheckCircle2 },
]
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const emptyForm = { transferType: '', airport: '', pickupDate: '', pickupTime: '', passengers: '', vehicleType: '', flightNumber: '', pickupLocation: '', dropLocation: '', specialRequest: '', name: '', email: '', phone: '' }
const fieldClass = 'mt-1.5 w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100'

function Field({ id, label, error, children }) {
  return <div className="min-w-0"><label htmlFor={id} className="block text-xs font-medium text-navy-700">{label}</label>{children}{error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}</div>
}

export default function AirportTransferPage() {
  const { user } = useAuth()
  const bookingRef = useRef(null)
  const firstFieldRef = useRef(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('form')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [airportSearch, setAirportSearch] = useState('')
  const [airportOpen, setAirportOpen] = useState(false)

  useEffect(() => {
    if (user) setForm(prev => ({ ...prev, name: prev.name || user.name || '', email: prev.email || user.email || '', phone: prev.phone || user.phone || '' }))
  }, [user])

  const visibleAirports = useMemo(() => AIRPORT_TRANSFER_AIRPORTS.filter(airport => `${airport.city} ${airport.name} ${airport.code}`.toLowerCase().includes(airportSearch.toLowerCase())), [airportSearch])
  const currentVehicle = VEHICLES.find(vehicle => vehicle.name === form.vehicleType)

  const update = (key, value) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'transferType' && value !== prev.transferType) {
        next.flightNumber = ''
        next.pickupLocation = ''
        next.dropLocation = ''
      }
      if (key === 'passengers') {
        const vehicle = VEHICLES.find(option => option.name === prev.vehicleType)
        if (vehicle && Number(value) > vehicle.passengers) next.vehicleType = ''
      }
      return next
    })
    setErrors(prev => ({ ...prev, [key]: '', ...(key === 'passengers' ? { vehicleType: '' } : {}) }))
    if (status === 'error') setStatus('form')
  }

  const focusBooking = (changes = {}) => {
    setForm(prev => ({ ...prev, ...changes }))
    setErrors(prev => ({ ...prev, ...Object.fromEntries(Object.keys(changes).map(key => [key, ''])) }))
    setStatus('form')
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => firstFieldRef.current?.focus(), 450)
    })
  }

  const chooseVehicle = vehicle => {
    setForm(prev => ({ ...prev, vehicleType: vehicle.name }))
    setErrors(prev => ({ ...prev, vehicleType: '' }))
    setSelectedVehicle(null)
    focusBooking({ vehicleType: vehicle.name })
  }

  const validate = () => {
    const next = {}
    if (!form.transferType) next.transferType = 'Please select transfer type.'
    if (!form.airport) next.airport = 'Please select an airport.'
    if (!form.pickupDate) next.pickupDate = 'Please select pickup date.'
    else if (form.pickupDate < today) next.pickupDate = 'Pickup date cannot be in the past.'
    if (!form.pickupTime) next.pickupTime = 'Please select pickup time.'
    if (!form.passengers) next.passengers = 'Please select number of passengers.'
    if (!form.vehicleType) next.vehicleType = 'Please select vehicle type.'
    else if (currentVehicle && Number(form.passengers) > currentVehicle.passengers) next.vehicleType = `This vehicle supports up to ${currentVehicle.passengers} passengers. Please choose a larger vehicle.`
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.'
    if (!form.phone.trim()) next.phone = 'Please enter your phone number.'
    else if (!/^[+\d][\d\s()-]{6,19}$/.test(form.phone.trim())) next.phone = 'Please enter a valid phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (submitting || !validate()) return
    setSubmitting(true)
    setStatus('submitting')
    try {
      const airport = AIRPORT_TRANSFER_AIRPORTS.find(item => item.code === form.airport)
      const details = [
        'Service: Airport Transfer', `Transfer type: ${form.transferType}`,
        `Airport: ${airport.city} — ${airport.name} (${airport.code})`,
        `Pickup time: ${form.pickupTime}`, `Vehicle type: ${form.vehicleType}`,
        form.flightNumber && `Flight number: ${form.flightNumber}`,
        form.pickupLocation && `Pickup location: ${form.pickupLocation}`,
        form.dropLocation && `Drop location: ${form.dropLocation}`,
        form.specialRequest && `Special request: ${form.specialRequest}`,
      ].filter(Boolean).join('\n')
      await api.post('/leads/public/submit', {
        name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
        destination: `${airport.city} — ${airport.name} (${airport.code})`,
        travelDate: form.pickupDate, travelers: Number(form.passengers),
        leadType: 'airport-transfer', sourceUrl: window.location.pathname,
        message: details,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead title="Airport Transfer Services in India | TravelVista" description="Book reliable airport pickup and drop services with TravelVista. Choose comfortable vehicles, professional drivers and convenient airport transfers across major Indian airports." />

      <section className="relative isolate min-h-[295px] overflow-hidden bg-navy-950 text-white sm:min-h-[320px] lg:min-h-[335px]">
        <img src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=2200&q=88" alt="Airplane and airport terminal in warm evening light" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
        <img src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1300&q=85" alt="Premium black sedan" fetchPriority="high" className="absolute inset-y-0 right-0 hidden h-full w-[53%] object-cover object-center opacity-95 md:block" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/15" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[295px] max-w-8xl items-center px-5 py-8 sm:min-h-[320px] sm:px-8 lg:min-h-[335px] lg:px-10">
          <div className="max-w-2xl">
            <Breadcrumb light items={[{ label: 'Local Travel' }, { label: 'Airport Transfer' }]} />
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Airport <span className="text-gold-500">Transfer</span></h1>
            <p className="mt-1 text-sm font-medium tracking-wide text-white sm:text-base">Comfortable <span className="text-gold-400">•</span> Safe <span className="text-gold-400">•</span> Reliable <span className="text-gold-400">•</span> On-Time</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">Start and end your journey with a hassle-free airport transfer. Enjoy comfortable rides, professional drivers and timely pickups &amp; drop-offs at major airports across India.</p>
          </div>
          <div className="absolute bottom-5 right-6 hidden w-44 rotate-[-7deg] text-right font-display text-3xl italic leading-tight text-white drop-shadow-lg lg:block xl:right-12">
            <span>Your<br />Journey<br />Starts Here</span><span className="mt-2 flex items-center justify-end gap-2 text-gold-400"><span className="block w-12 border-b border-dashed border-white/80" /><Plane size={23} /></span>
          </div>
        </div>
      </section>

      <section aria-label="Airport transfer service features" className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto px-3 py-3 [scrollbar-width:thin] sm:flex-wrap sm:justify-center lg:flex-nowrap lg:justify-between lg:px-8">
          {FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-[126px] shrink-0 flex-col items-center justify-center gap-1 border-r border-gray-100 px-3 text-center last:border-0 sm:min-w-[150px] lg:min-w-0 lg:flex-1"><Icon size={20} strokeWidth={2.2} className="text-sky-700" /><span className="whitespace-nowrap text-xs font-medium text-navy-800">{label}</span></div>)}
        </div>
      </section>

      <div className="mx-auto grid max-w-8xl grid-cols-1 gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(310px,1.08fr)] lg:gap-6 lg:px-8 lg:py-6">
        <main className="min-w-0">
          <section aria-labelledby="services-title">
            <h2 id="services-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Airport Transfer Services</h2>
            <p className="mt-1 text-sm text-navy-700">Reliable and comfortable airport transfer services for individuals, families and groups across India.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {SERVICES.map(({ title, type, desc, image, alt, icon: Icon, color, tag }) => <article key={type} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-36 overflow-hidden sm:h-32 lg:h-36"><img src={image} alt={alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute left-3 top-2 rounded bg-black/75 px-2 py-1 text-xs font-bold text-gold-400"><Plane size={13} className="mr-1 inline" />{tag}</span><span className={`absolute -bottom-5 left-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm ${color}`}><Icon size={23} /></span></div>
                <div className="px-4 pb-3 pt-7"><h3 className="font-display text-lg font-bold text-navy-900">{title}</h3><p className="mt-1 min-h-[54px] text-sm leading-snug text-navy-700">{desc}</p><button type="button" onClick={() => focusBooking({ transferType: type })} className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">{type === 'Airport Pickup' ? 'Book Pickup' : type === 'Airport Drop' ? 'Book Drop' : 'Book Meet & Greet'}<ArrowRight size={16} /></button></div>
              </article>)}
            </div>
          </section>

          <section className="mt-5" aria-labelledby="vehicles-title">
            <h2 id="vehicles-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Vehicle Options</h2>
            <p className="mt-1 text-sm text-navy-700">Choose from a wide range of well-maintained vehicles for a comfortable airport transfer.</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {VEHICLES.map(vehicle => <article key={vehicle.name} className="group min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md">
                <img src={vehicle.image} alt={`${vehicle.name} vehicle`} loading="lazy" className="h-24 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-28" />
                <h3 className="mt-1 truncate font-display text-base font-bold text-navy-900">{vehicle.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Users size={13} />1–{vehicle.passengers} Passengers</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Luggage size={13} />{vehicle.luggage} Bags</p>
                <button type="button" onClick={() => setSelectedVehicle(vehicle)} className="mt-2 flex min-h-9 w-full items-center justify-center gap-1 rounded-full border border-orange-400 px-2 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">View Details <ArrowRight size={13} /></button>
              </article>)}
            </div>
          </section>

          <section className="mt-5 rounded-xl bg-gradient-to-r from-gray-50 to-sky-50/50 px-4 py-4 sm:px-5" aria-labelledby="process-title">
            <h2 id="process-title" className="font-display text-xl font-bold text-navy-900 sm:text-2xl">Simple Airport Transfer Process</h2>
            <p className="mt-0.5 text-sm text-navy-700">Book your airport transfer in just a few easy steps.</p>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {STEPS.map(({ title, text, icon: Icon }, index) => <li key={title} className="relative flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">{index + 1}</span><Icon size={22} className="shrink-0 text-navy-800" /><div className="min-w-0"><h3 className="text-sm font-semibold text-navy-900">{title}</h3><p className="text-xs text-navy-600">{text}</p></div>{index < STEPS.length - 1 && <ArrowRight size={17} className="absolute -right-1 top-1/2 hidden -translate-y-1/2 text-sky-800 xl:block" />}
              </li>)}
            </ol>
          </section>
        </main>

        <aside className="min-w-0 space-y-3 lg:sticky lg:top-24 lg:self-start">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <h2 className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 font-display text-base font-bold text-navy-900 sm:text-lg"><Star size={21} className="fill-gold-400 text-gold-500" />Why Choose Our Airport Transfer?</h2>
            <ul className="space-y-1.5 px-3 py-3">{REASONS.map(reason => <li key={reason} className="flex items-start gap-2 text-sm leading-snug text-navy-800"><CheckCircle2 size={15} className="mt-0.5 shrink-0 fill-green-600 text-white" />{reason}</li>)}</ul>
          </section>

          <section ref={bookingRef} id="airport-transfer-booking" className="scroll-mt-24 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 bg-sky-50 px-3 py-2.5"><CarFront size={25} className="text-sky-600" /><div><h2 className="font-display text-lg font-bold text-navy-900">Book Your Airport Transfer?</h2><p className="text-[11px] text-navy-700">Get a tailored quote from our travel team.</p></div></div>
            {status === 'success' ? <div className="p-5 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={27} /></span><h3 className="mt-3 font-display text-xl font-bold text-navy-900">Airport Transfer Request Submitted</h3><p className="mt-2 text-sm leading-relaxed text-navy-700">Thank you. We have received your transfer details. Our travel expert will contact you shortly with the best available quote.</p><div className="mt-4 flex flex-col gap-2"><Link to="/local-travel/railway-station-transfer" className="rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50">View Other Local Travel Services</Link><Link to="/" className="rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-600">Back to Home</Link></div></div> : <form className="space-y-3 p-3" onSubmit={handleSubmit} noValidate>
              {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><strong className="block">Unable to Submit Request</strong><span>Something went wrong while sending your airport transfer request. Please try again.</span><button type="button" onClick={() => setStatus('form')} className="mt-1 block font-semibold underline">Try Again</button></div>}
              <div className="grid grid-cols-2 gap-3">
                <Field id="transferType" label="Transfer Type" error={errors.transferType}><select ref={firstFieldRef} id="transferType" required aria-required="true" aria-invalid={Boolean(errors.transferType)} className={fieldClass} value={form.transferType} onChange={e => update('transferType', e.target.value)}><option value="">Select Type</option>{TRANSFER_TYPES.map(type => <option key={type}>{type}</option>)}</select></Field>
                <Field id="airport" label="Airport" error={errors.airport}><div className="relative"><button type="button" id="airport" aria-label="Search and select an airport" aria-required="true" aria-invalid={Boolean(errors.airport)} aria-expanded={airportOpen} aria-haspopup="listbox" onClick={() => { setAirportOpen(open => !open); setAirportSearch('') }} onKeyDown={event => { if (event.key === 'Escape') setAirportOpen(false) }} className={`${fieldClass} flex items-center justify-between gap-1 text-left`}><span className="truncate">{form.airport ? `${AIRPORT_TRANSFER_AIRPORTS.find(item => item.code === form.airport)?.city} (${form.airport})` : 'Select Airport'}</span><ChevronRight size={15} className="rotate-90 shrink-0" /></button>{airportOpen && <div onKeyDown={event => { if (event.key === 'Escape') setAirportOpen(false) }} className="absolute z-30 mt-1 w-full rounded-lg border border-navy-200 bg-white p-2 shadow-xl"><label className="sr-only" htmlFor="airportSearch">Search airports</label><div className="flex items-center gap-2 rounded border px-2"><Search size={14} /><input autoFocus id="airportSearch" value={airportSearch} onChange={e => setAirportSearch(e.target.value)} placeholder="Search airports" className="w-full py-1.5 text-sm outline-none" /></div><ul role="listbox" aria-label="Airports" className="mt-1 max-h-44 overflow-y-auto">{visibleAirports.map(item => <li key={item.code}><button type="button" role="option" aria-selected={form.airport === item.code} onClick={() => { update('airport', item.code); setAirportOpen(false) }} className="w-full rounded px-2 py-2 text-left text-xs hover:bg-sky-50">{item.city} — {item.name} <span className="text-navy-400">({item.code})</span></button></li>)}{visibleAirports.length === 0 && <li className="px-2 py-2 text-xs text-navy-500">No airports found.</li>}</ul></div>}</div></Field>
                <Field id="pickupDate" label="Pickup Date" error={errors.pickupDate}><input id="pickupDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.pickupDate)} min={today} className={fieldClass} value={form.pickupDate} onChange={e => update('pickupDate', e.target.value)} /></Field>
                <Field id="pickupTime" label="Pickup Time" error={errors.pickupTime}><input id="pickupTime" type="time" required aria-required="true" aria-invalid={Boolean(errors.pickupTime)} className={fieldClass} value={form.pickupTime} onChange={e => update('pickupTime', e.target.value)} /></Field>
                <Field id="passengers" label="Number of Passengers" error={errors.passengers}><select id="passengers" required aria-required="true" aria-invalid={Boolean(errors.passengers)} className={fieldClass} value={form.passengers} onChange={e => update('passengers', e.target.value)}><option value="">Select Passengers</option>{Array.from({ length: 12 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>)}</select></Field>
                <Field id="vehicleType" label="Vehicle Type" error={errors.vehicleType}><select id="vehicleType" required aria-required="true" aria-invalid={Boolean(errors.vehicleType)} className={fieldClass} value={form.vehicleType} onChange={e => update('vehicleType', e.target.value)}><option value="">Select Vehicle</option>{VEHICLES.map(v => <option key={v.name} value={v.name} disabled={Boolean(form.passengers) && Number(form.passengers) > v.passengers}>{v.name} (up to {v.passengers})</option>)}</select></Field>
              </div>
              {form.transferType && <Field id="flightNumber" label="Flight Number (optional)"><input id="flightNumber" className={fieldClass} value={form.flightNumber} onChange={e => update('flightNumber', e.target.value)} placeholder="e.g. AI 101" /></Field>}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{form.transferType !== 'Airport Pickup' && <Field id="pickupLocation" label="Pickup Location (optional)"><input id="pickupLocation" className={fieldClass} value={form.pickupLocation} onChange={e => update('pickupLocation', e.target.value)} placeholder="Hotel, address" /></Field>}{form.transferType !== 'Airport Drop' && <Field id="dropLocation" label="Drop Location (optional)"><input id="dropLocation" className={fieldClass} value={form.dropLocation} onChange={e => update('dropLocation', e.target.value)} placeholder="Hotel, address" /></Field>}</div>
              <Field id="specialRequest" label="Special Request (optional)"><textarea id="specialRequest" rows={2} className={fieldClass} value={form.specialRequest} onChange={e => update('specialRequest', e.target.value)} placeholder="Anything else we should know?" /></Field><fieldset className="rounded-lg border border-gray-100 px-3 py-2"><legend className="px-1 text-xs font-semibold text-navy-700">Contact details</legend><div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><Field id="name" label="Full Name" error={errors.name}><input id="name" required aria-required="true" aria-invalid={Boolean(errors.name)} autoComplete="name" className={fieldClass} value={form.name} onChange={e => update('name', e.target.value)} /></Field><Field id="email" label="Email" error={errors.email}><input id="email" type="email" required aria-required="true" aria-invalid={Boolean(errors.email)} autoComplete="email" className={fieldClass} value={form.email} onChange={e => update('email', e.target.value)} /></Field><Field id="phone" label="Phone" error={errors.phone}><input id="phone" type="tel" required aria-required="true" aria-invalid={Boolean(errors.phone)} autoComplete="tel" className={fieldClass} value={form.phone} onChange={e => update('phone', e.target.value)} /></Field></div></fieldset>

              {currentVehicle && form.passengers && Number(form.passengers) > currentVehicle.passengers && <p className="rounded bg-amber-50 p-2 text-xs text-amber-800" role="status">This vehicle supports up to {currentVehicle.passengers} passengers. Please choose a larger vehicle.</p>}
              <button type="submit" disabled={submitting} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{submitting ? <><LoaderCircle size={18} className="animate-spin" />Submitting...</> : <>Get Quote <ArrowRight size={17} /></>}</button>
              <p className="text-center text-[11px] text-navy-500">No prices are estimated here. Our team will follow up with a tailored quote.</p>
            </form>}
          </section>

          <section className="rounded-xl border border-gold-100 bg-amber-50/70 p-4">
            <div className="flex items-start gap-3"><Headphones size={26} className="shrink-0 text-orange-500" /><div><h2 className="font-display text-lg font-bold text-navy-900">Need Help?</h2><p className="mt-1 text-sm leading-snug text-navy-700">Our travel experts are available 24/7 to assist you with your airport transfer booking.</p><Link to="/contact" className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 text-sm font-bold text-white hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2">Contact Us <ArrowRight size={15} /></Link></div></div>
          </section>
        </aside>
      </div>

      {selectedVehicle && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/60 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedVehicle(null) }}><section role="dialog" aria-modal="true" aria-labelledby="vehicle-modal-title" onKeyDown={event => { if (event.key === 'Escape') setSelectedVehicle(null) }} className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><button type="button" aria-label="Close vehicle details" autoFocus onClick={() => setSelectedVehicle(null)} className="absolute right-3 top-3 rounded p-2 text-navy-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={19} /></button><img src={selectedVehicle.image} alt={`${selectedVehicle.name} vehicle`} className="h-40 w-full object-contain" /><h2 id="vehicle-modal-title" className="font-display text-2xl font-bold text-navy-900">{selectedVehicle.name}</h2><div className="mt-3 flex gap-4 text-sm text-navy-700"><span className="flex items-center gap-1"><Users size={16} />Up to {selectedVehicle.passengers} passengers</span><span className="flex items-center gap-1"><Luggage size={16} />{selectedVehicle.luggage} bags</span></div><ul className="mt-3 space-y-2">{selectedVehicle.features.map(feature => <li key={feature} className="flex gap-2 text-sm text-navy-700"><CheckCircle2 size={16} className="shrink-0 text-green-600" />{feature}</li>)}</ul><p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-navy-600">Vehicle capacities are indicative and subject to confirmation when our travel expert responds to your quote request.</p>{Number(form.passengers) > selectedVehicle.passengers && <p className="mt-3 text-sm text-red-700" role="alert">This vehicle supports up to {selectedVehicle.passengers} passengers. Please choose a larger vehicle.</p>}<button type="button" disabled={Number(form.passengers) > selectedVehicle.passengers} onClick={() => chooseVehicle(selectedVehicle)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-3 font-bold text-white hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50">Select Vehicle / Book Now <ArrowRight size={17} /></button>
</section></div>}
    </div>
  )
}
