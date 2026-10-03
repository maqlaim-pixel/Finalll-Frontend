import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Camera, CarFront, Check, CheckCircle2, ClipboardCheck,
  Clock3, Headphones, IndianRupee, Luggage, MapPin, Plane, ShieldCheck,
  Star, UserCheck, Users, X, LoaderCircle,
} from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import Breadcrumb from '../components/common/Breadcrumb'
import api from '../services/api'
import useLocalTravelFlow from '../hooks/useLocalTravelFlow'
import LocalTravelAuthPrompt from '../components/common/LocalTravelAuthPrompt'
import { CITY_LIST } from '../data/cityData'
import { LOCAL_TRANSFER_VEHICLES as VEHICLES } from '../data/localTransferVehicles'

const HERO_CITY = 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1800&q=86'
const HERO_CAB = 'https://images.unsplash.com/photo-1651349142324-a4fcb8c93426?auto=format&fit=crop&w=1050&q=84'
const SERVICES = [
  { title: 'City Rides', type: 'City Ride', description: 'Convenient rides for your daily travel within the city.', image: 'https://images.unsplash.com/photo-1637366099044-9e33e7f67705?auto=format&fit=crop&w=800&h=450&q=82', alt: 'Taxi driving along a Mumbai city street', icon: MapPin, button: 'Book City Ride' },
  { title: 'Sightseeing Tours', type: 'Sightseeing Tour', description: 'Explore local attractions with a comfortable cab.', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&h=450&q=82', alt: 'Mumbai Gateway of India and the waterfront', icon: Camera, button: 'Book Sightseeing' },
  { title: 'Airport Transfer', description: 'Pickup & drop from airport to any location in the city.', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&h=450&q=82', alt: 'Airport terminal at dusk', icon: Plane, button: 'Book Airport Transfer', href: '/local-travel/airport-transfer' },
  { title: 'Hourly Rental', type: 'Hourly Rental', description: 'Flexible hourly packages for business or leisure.', image: 'https://images.unsplash.com/photo-1570218042305-ac476b00c52c?auto=format&fit=crop&w=800&h=450&q=82', alt: 'White SUV ready for comfortable local travel', icon: Clock3, button: 'Book Hourly Cab' },
]
const FEATURES = [
  { icon: CarFront, label: 'City Rides' }, { icon: Camera, label: 'Sightseeing Tours' },
  { icon: Clock3, label: 'Hourly Rental' }, { icon: CarFront, label: 'Outstation Within City' },
  { icon: IndianRupee, label: 'Affordable Pricing' }, { icon: UserCheck, label: 'Verified Drivers' },
  { icon: Headphones, label: '24/7 Support' }, { icon: ClipboardCheck, label: 'Easy Booking' },
]
const PACKAGES = ['2 Hours / 20 km', '4 Hours / 40 km', '6 Hours / 60 km', '8 Hours / 80 km', '12 Hours / 120 km']
const INDIAN_CITIES = [...new Set(CITY_LIST.filter(city => !city.slug.includes('/')).map(city => city.name))].sort((a, b) => a.localeCompare(b))
const WHY_CHOOSE = [
  'Reliable and professional drivers', 'Clean and well-maintained vehicles',
  'A tailored quote shared before you confirm', 'Flexible packages (hourly / full day)',
  '24/7 customer support', 'Quick and easy booking request',
  'Options for city rides, sightseeing and business travel',
]
const STEPS = [
  { title: 'Select Service', text: 'Choose your ride type', icon: Camera },
  { title: 'Provide Details', text: 'Pickup, drop, date & time', icon: MapPin },
  { title: 'Get Quote', text: 'Choose vehicle & confirm', icon: CarFront },
  { title: 'Enjoy Your Ride', text: 'Safe, comfortable travel', icon: CheckCircle2 },
]
const fieldClass = 'mt-1.5 min-h-10 w-full min-w-0 rounded-md border border-navy-200 bg-white px-2.5 py-2 text-sm text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:px-3'
const EMPTY_FORM = {
  serviceType: '', pickupLocation: '', dropLocation: '', pickupDate: '', pickupTime: '',
  passengers: '', vehicleType: '', rentalPackage: '', destination: '', preferredDuration: '',
  specialRequest: '', name: '', email: '', phone: '',
}
const todayValue = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function Field({ id, label, error, children }) {
  return <div className="min-w-0"><label htmlFor={id} className="block text-xs font-medium text-navy-700">{label}</label>{children}{error && <p className="mt-1 text-xs leading-snug text-red-600" role="alert">{error}</p>}</div>
}

function VehicleDetailsModal({ vehicle, passengers, onClose, onSelect, triggerRef }) {
  const closeButtonRef = useRef(null)
  useEffect(() => {
    const previousFocus = triggerRef.current || document.activeElement
    closeButtonRef.current?.focus()
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const controls = Array.from(document.querySelectorAll('[role="dialog"] button:not(:disabled), [role="dialog"] a[href]'))
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown); previousFocus?.focus?.() }
  }, [onClose, triggerRef])

  const overCapacity = Number(passengers || 0) > vehicle.passengers
  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-navy-950/65 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="local-taxi-vehicle-title" className="relative my-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
      <button ref={closeButtonRef} type="button" aria-label="Close vehicle details" onClick={onClose} className="absolute right-3 top-3 rounded p-2 text-navy-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={19} /></button>
      <img src={vehicle.image} alt={`${vehicle.name} vehicle`} className="h-40 w-full object-contain" />
      <h2 id="local-taxi-vehicle-title" className="font-display text-2xl font-bold text-navy-900">{vehicle.name}</h2>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-navy-700"><span className="flex items-center gap-1"><Users size={16} />1–{vehicle.passengers} passengers</span><span className="flex items-center gap-1"><Luggage size={16} />{vehicle.luggage} bags</span></div>
      <h3 className="mt-4 font-semibold text-navy-900">Vehicle Features</h3>
      <ul className="mt-2 space-y-2">{vehicle.features.map(feature => <li key={feature} className="flex gap-2 text-sm text-navy-700"><CheckCircle2 size={16} className="shrink-0 text-green-600" />{feature}</li>)}</ul>
      <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-navy-600">Vehicle availability and the final quote are confirmed by our travel expert.</p>
      {overCapacity && <p className="mt-3 text-sm text-red-700" role="alert">The selected vehicle supports up to {vehicle.passengers} passengers. Please choose a larger vehicle.</p>}
      <button type="button" disabled={overCapacity} onClick={() => onSelect(vehicle)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-3 font-bold text-white transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 disabled:cursor-not-allowed disabled:opacity-50">Select Vehicle <ArrowRight size={17} /></button>
    </section>
  </div>
}

export default function LocalTaxiCabPage() {
  const { form, setForm, user, authPromptOpen, setAuthPromptOpen, requireAuthentication, continueToAuth, clearDraft } = useLocalTravelFlow(EMPTY_FORM)
  const bookingRef = useRef(null)
  const serviceRef = useRef(null)
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

  const selectedVehicle = VEHICLES.find(vehicle => vehicle.name === form.vehicleType)
  const clearError = key => setErrors(previous => ({ ...previous, [key]: '', ...(key === 'passengers' ? { vehicleType: '' } : {}) }))
  const update = (key, value) => {
    setForm(previous => ({ ...previous, [key]: value }))
    clearError(key)
    if (status === 'error') setStatus('form')
  }
  const focusBooking = serviceType => {
    setForm(previous => ({ ...previous, serviceType }))
    setErrors(previous => ({ ...previous, serviceType: '' }))
    setStatus('form')
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => serviceRef.current?.focus(), 450)
    })
  }
  const selectVehicle = vehicle => {
    if (Number(form.passengers) > vehicle.passengers) return
    setForm(previous => ({ ...previous, vehicleType: vehicle.name }))
    setErrors(previous => ({ ...previous, vehicleType: '' }))
    setActiveVehicle(null)
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => vehicleRef.current?.focus(), 450)
    })
  }

  const validate = () => {
    const next = {}
    if (!form.serviceType) next.serviceType = 'Please select a service type.'
    if (!form.pickupLocation.trim()) next.pickupLocation = 'Please enter pickup location.'
    if (form.serviceType !== 'Hourly Rental' && !form.dropLocation.trim()) next.dropLocation = 'Please enter drop location.'
    if (!form.pickupDate) next.pickupDate = 'Please select pickup date.'
    else if (form.pickupDate < todayValue()) next.pickupDate = 'Pickup date cannot be in the past.'
    if (!form.pickupTime) next.pickupTime = 'Please select pickup time.'
    if (!form.passengers || Number(form.passengers) < 1 || Number(form.passengers) > 12) next.passengers = 'Please select number of passengers.'
    if (!form.vehicleType) next.vehicleType = 'Please select vehicle type.'
    else if (selectedVehicle && Number(form.passengers) > selectedVehicle.passengers) next.vehicleType = `The selected vehicle supports up to ${selectedVehicle.passengers} passengers. Please choose a larger vehicle.`
    if (form.serviceType === 'Hourly Rental' && !form.rentalPackage) next.rentalPackage = 'Please select a rental package.'
    if (form.serviceType === 'Sightseeing Tour' && !form.destination) next.destination = 'Please select a city / destination.'
    if (!form.name.trim() && !user?.name?.trim()) next.name = 'Please enter your name.'
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
      const details = [
        'Service: Local Taxi / Cab', `Service type: ${form.serviceType}`,
        `Pickup location: ${form.pickupLocation.trim()}`,
        form.dropLocation.trim() && `Drop location: ${form.dropLocation.trim()}`,
        `Pickup date: ${form.pickupDate}`, `Pickup time: ${form.pickupTime}`,
        `Passengers: ${form.passengers}`, `Vehicle type: ${form.vehicleType}`,
        form.rentalPackage && `Rental package: ${form.rentalPackage}`,
        form.destination && `City / destination: ${form.destination}`,
        form.preferredDuration && `Preferred duration: ${form.preferredDuration}`,
        form.specialRequest.trim() && `Special request: ${form.specialRequest.trim()}`,
        'Request type: Quote enquiry; not a confirmed booking.',
      ].filter(Boolean).join('\n')
      await api.post('/local-travel/enquiries', {
        serviceType: 'local-taxi-cab', formData: form, sourceUrl: window.location.pathname,
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
    <SEOHead title="Local Taxi & Cab Services in India | TravelVista" description="Book reliable local taxi and cab services with TravelVista for city rides, sightseeing and hourly rentals with comfortable vehicles and professional drivers." />

    <section className="relative isolate min-h-[220px] overflow-hidden bg-navy-950 text-white sm:min-h-[250px] lg:min-h-[270px]" aria-labelledby="local-taxi-title">
      <img src={HERO_CITY} alt="Mumbai waterfront and urban skyline" loading="eager" className="absolute inset-0 h-full w-full object-cover object-[50%_52%]" />
      <img src={HERO_CAB} alt="Modern car for comfortable city travel" loading="eager" className="absolute inset-y-0 right-[10%] hidden h-full w-[43%] object-cover object-center md:block lg:right-[12%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-navy-950/15" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[220px] max-w-8xl items-center px-4 py-5 sm:min-h-[250px] sm:px-6 lg:min-h-[270px] lg:px-8">
        <div className="max-w-2xl">
          <Breadcrumb light items={[{ label: 'Local Travel', href: '/local-travel/airport-transfer' }, { label: 'Local Taxi / Cab' }]} />
          <h1 id="local-taxi-title" className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"><span className="text-white">Local </span><span className="text-gold-500">Taxi / Cab</span></h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/95 sm:text-base">Explore the city at your own pace with our reliable and affordable local taxi services. Comfortable rides, professional drivers and flexible booking options for sightseeing, business trips or daily travel.</p>
        </div>
        <div className="pointer-events-none absolute bottom-5 right-5 hidden rotate-[-6deg] text-right font-display text-2xl italic leading-tight text-white drop-shadow-lg lg:block xl:right-10 xl:text-3xl" aria-hidden="true"><span>Explore<br />More<br />Local Destinations</span><span className="mt-1 flex items-center justify-end gap-2"><span className="block w-12 border-b border-dashed border-white/90" /><Plane size={23} /></span></div>
      </div>
    </section>

    <section aria-label="Local taxi features" className="border-b border-gray-100 bg-[#fcfaf6]"><div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto overscroll-x-contain px-3 py-2.5 [scrollbar-width:thin] min-[1280px]:justify-between min-[1280px]:px-8">{FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-[128px] shrink-0 flex-col items-center justify-center gap-1 border-r border-orange-100 px-3 text-center last:border-0 min-[1280px]:min-w-0 min-[1280px]:flex-1"><Icon size={20} strokeWidth={2.2} className="text-orange-600" aria-hidden="true" /><span className="whitespace-nowrap text-xs font-medium text-navy-800">{label}</span></div>)}</div></section>

    <div className="mx-auto grid max-w-8xl grid-cols-1 items-start gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,2.55fr)_minmax(310px,0.95fr)] lg:gap-5 lg:px-8 lg:py-5">
      <main className="min-w-0 space-y-4">
        <section aria-labelledby="local-taxi-services-title">
          <h2 id="local-taxi-services-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Local Taxi / Cab Services</h2>
          <p className="mt-1 text-sm text-navy-700">Safe, comfortable and convenient taxi services for all your local travel needs.</p>
          <div className="mt-3 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 2xl:grid-cols-4">{SERVICES.map(({ title, type, description, image, alt, icon: Icon, button, href }) => <article key={title} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none">
            <div className="relative h-32 overflow-hidden sm:h-28 xl:h-32"><img src={image} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" /><span className="absolute -bottom-5 left-3 flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-white text-orange-600 shadow-sm"><Icon size={22} aria-hidden="true" /></span></div>
            <div className="flex flex-1 flex-col px-3 pb-3 pt-6"><h3 className="font-display text-lg font-bold leading-tight text-navy-900">{title}</h3><p className="mt-1 min-h-[40px] text-sm leading-snug text-navy-700">{description}</p>{href ? <Link to={href} className="mt-2 flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-orange-500 px-2 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm">{button} <ArrowRight size={15} aria-hidden="true" /></Link> : <button type="button" onClick={() => focusBooking(type)} className="mt-2 flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-orange-500 px-2 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400 sm:text-sm">{button} <ArrowRight size={15} aria-hidden="true" /></button>}</div>
          </article>)}</div>
        </section>

        <section aria-labelledby="local-taxi-vehicles-title"><h2 id="local-taxi-vehicles-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Vehicle Options</h2><p className="mt-1 text-sm text-navy-700">Choose from a range of comfortable and well-maintained vehicles for your local travel.</p><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{VEHICLES.map(vehicle => <article key={vehicle.name} className="group min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md motion-reduce:transform-none"><img src={vehicle.image} alt={`${vehicle.name} vehicle`} loading="lazy" decoding="async" className="h-24 w-full object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" /><h3 className="mt-1 truncate font-display text-base font-bold text-navy-900">{vehicle.name}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Users size={13} aria-hidden="true" />1–{vehicle.passengers} Passengers</p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Luggage size={13} aria-hidden="true" />{vehicle.luggage} Bags</p><button type="button" onClick={event => { vehicleTriggerRef.current = event.currentTarget; setActiveVehicle(vehicle) }} className="mt-2 flex min-h-8 w-full items-center justify-center gap-1 rounded-full border border-orange-400 px-2 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">View Details <ArrowRight size={13} aria-hidden="true" /></button></article>)}</div></section>

        <section className="rounded-xl bg-gradient-to-r from-gray-50 to-sky-50/50 px-4 py-4 sm:px-5" aria-labelledby="local-taxi-process-title"><h2 id="local-taxi-process-title" className="font-display text-xl font-bold text-navy-900 sm:text-2xl">Simple Booking Process</h2><p className="mt-0.5 text-sm text-navy-700">Book your local taxi / cab in just a few easy steps.</p><ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{STEPS.map(({ title, text, icon: Icon }, index) => <li key={title} className="relative flex items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">{index + 1}</span><Icon size={21} className="shrink-0 text-navy-800" aria-hidden="true" /><div className="min-w-0"><h3 className="text-xs font-semibold text-navy-900">{title}</h3><p className="text-[11px] leading-snug text-navy-600">{text}</p></div>{index < STEPS.length - 1 && <ArrowRight size={17} className="absolute -right-1 top-1/2 hidden -translate-y-1/2 text-sky-800 xl:block" aria-hidden="true" />}</li>)}</ol></section>
      </main>

      <aside className="min-w-0 space-y-3 lg:sticky lg:top-24 lg:self-start">
        <section ref={bookingRef} id="local-taxi-booking" tabIndex={-1} className="scroll-mt-24 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" aria-labelledby="local-taxi-booking-title">
          <div className="flex items-center gap-2 bg-sky-50 px-3 py-2.5"><CarFront size={25} className="shrink-0 text-sky-600" aria-hidden="true" /><div className="min-w-0"><h2 id="local-taxi-booking-title" className="font-display text-base font-bold leading-tight text-navy-900 sm:text-lg">Book Your Local Taxi / Cab</h2><p className="text-[11px] text-navy-700">Request a quote from our travel team.</p></div></div>
          {status === 'success' ? <div className="p-5 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={27} /></span><h3 className="mt-3 font-display text-lg font-bold text-navy-900">Local Taxi Request Submitted</h3><p className="mt-2 text-sm leading-relaxed text-navy-700">Thank you. We have received your local taxi/cab details. Our travel expert will contact you shortly with the best available local taxi/cab quote.</p><div className="mt-4 flex flex-col gap-2"><Link to="/local-travel/airport-transfer" className="rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50">Explore Local Travel</Link><Link to="/" className="rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-600">Back to Home</Link></div></div> : <form className="space-y-2.5 p-3" onSubmit={handleSubmit} noValidate>
            {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><strong className="block">Unable to Submit Request</strong><span>Something went wrong while sending your local taxi request. Please try again.</span><button type="button" onClick={() => setStatus('form')} className="mt-1 block font-semibold underline">Try Again</button></div>}
            {Object.keys(errors).length > 0 && <p className="sr-only" role="alert">Please correct the highlighted fields.</p>}
            <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
              <Field id="localTaxiServiceType" label="Service Type" error={errors.serviceType}><select ref={serviceRef} id="localTaxiServiceType" required aria-required="true" aria-invalid={Boolean(errors.serviceType)} className={fieldClass} value={form.serviceType} onChange={event => update('serviceType', event.target.value)}><option value="">Select Service</option><option>City Ride</option><option>Sightseeing Tour</option><option>Hourly Rental</option></select></Field>
              <Field id="localTaxiPickupLocation" label="Pickup Location" error={errors.pickupLocation}><input ref={pickupRef} id="localTaxiPickupLocation" required aria-required="true" aria-invalid={Boolean(errors.pickupLocation)} autoComplete="street-address" className={fieldClass} value={form.pickupLocation} onChange={event => update('pickupLocation', event.target.value)} placeholder="Enter pickup location" /></Field>
              {form.serviceType !== 'Hourly Rental' && <Field id="localTaxiDropLocation" label="Drop Location" error={errors.dropLocation}><input id="localTaxiDropLocation" required aria-required="true" aria-invalid={Boolean(errors.dropLocation)} className={fieldClass} value={form.dropLocation} onChange={event => update('dropLocation', event.target.value)} placeholder="Enter drop location" /></Field>}
              <Field id="localTaxiPickupDate" label="Pickup Date" error={errors.pickupDate}><input id="localTaxiPickupDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.pickupDate)} min={todayValue()} className={fieldClass} value={form.pickupDate} onChange={event => update('pickupDate', event.target.value)} /></Field>
              <Field id="localTaxiPickupTime" label="Pickup Time" error={errors.pickupTime}><input id="localTaxiPickupTime" type="time" required aria-required="true" aria-invalid={Boolean(errors.pickupTime)} className={fieldClass} value={form.pickupTime} onChange={event => update('pickupTime', event.target.value)} /></Field>
              <Field id="localTaxiPassengers" label="Number of Passengers" error={errors.passengers}><select id="localTaxiPassengers" required aria-required="true" aria-invalid={Boolean(errors.passengers)} className={fieldClass} value={form.passengers} onChange={event => update('passengers', event.target.value)}><option value="">Select Passengers</option>{Array.from({ length: 12 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>)}</select></Field>
              <Field id="localTaxiVehicleType" label="Vehicle Type" error={errors.vehicleType}><select ref={vehicleRef} id="localTaxiVehicleType" required aria-required="true" aria-invalid={Boolean(errors.vehicleType)} className={fieldClass} value={form.vehicleType} onChange={event => update('vehicleType', event.target.value)}><option value="">Select Vehicle</option>{VEHICLES.map(vehicle => <option key={vehicle.name} value={vehicle.name}>{vehicle.name} (up to {vehicle.passengers})</option>)}</select></Field>
              {selectedVehicle && Number(form.passengers) > selectedVehicle.passengers && <p className="col-span-full rounded bg-amber-50 p-2 text-xs text-amber-800" role="status">The selected vehicle supports up to {selectedVehicle.passengers} passengers. Please choose a larger vehicle.</p>}
              {form.serviceType === 'Hourly Rental' && <Field id="localTaxiRentalPackage" label="Rental Package" error={errors.rentalPackage}><select id="localTaxiRentalPackage" required aria-required="true" aria-invalid={Boolean(errors.rentalPackage)} className={fieldClass} value={form.rentalPackage} onChange={event => update('rentalPackage', event.target.value)}><option value="">Select Package</option>{PACKAGES.map(option => <option key={option}>{option}</option>)}</select></Field>}
              {form.serviceType === 'Sightseeing Tour' && <><Field id="localTaxiDestination" label="City / Destination" error={errors.destination}><select id="localTaxiDestination" required aria-required="true" aria-invalid={Boolean(errors.destination)} className={fieldClass} value={form.destination} onChange={event => update('destination', event.target.value)}><option value="">Select City / Destination</option>{INDIAN_CITIES.map(city => <option key={city}>{city}</option>)}</select></Field><Field id="localTaxiDuration" label="Preferred Duration"><select id="localTaxiDuration" className={fieldClass} value={form.preferredDuration} onChange={event => update('preferredDuration', event.target.value)}><option value="">Select Duration (optional)</option><option>Half day</option><option>Full day</option><option>Custom duration</option></select></Field></>}
            </div>
            <Field id="localTaxiSpecialRequest" label="Special Request (optional)"><textarea id="localTaxiSpecialRequest" rows={2} className={fieldClass} value={form.specialRequest} onChange={event => update('specialRequest', event.target.value)} placeholder="Anything else our travel expert should know?" /></Field>
            <details className="rounded-lg border border-gray-100 px-3 py-2 text-xs" open={!user}><summary className="cursor-pointer font-medium text-sky-800">Contact details {!user && '(required)'}</summary><div className="mt-2 space-y-2"><Field id="localTaxiName" label="Full Name" error={errors.name}><input id="localTaxiName" autoComplete="name" aria-invalid={Boolean(errors.name)} className={fieldClass} value={form.name} onChange={event => update('name', event.target.value)} /></Field><Field id="localTaxiEmail" label="Email" error={errors.email}><input id="localTaxiEmail" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={fieldClass} value={form.email} onChange={event => update('email', event.target.value)} /></Field><Field id="localTaxiPhone" label="Phone" error={errors.phone}><input id="localTaxiPhone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} className={fieldClass} value={form.phone} onChange={event => update('phone', event.target.value)} /></Field>{errors.contact && <p className="text-xs text-red-600" role="alert">{errors.contact}</p>}<p className="text-[11px] text-navy-500">Your signed-in account details are filled in when available. Otherwise, enter a name and one contact method.</p></div></details>
            <button type="submit" disabled={submitting} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{submitting ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Submitting...</> : <>Get Quote <ArrowRight size={17} aria-hidden="true" /></>}</button>
            <p className="text-center text-[10px] text-navy-500">No prices are estimated here. Vehicle options, availability and quote are confirmed by our travel team.</p>
          </form>}
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="local-taxi-why-title"><h2 id="local-taxi-why-title" className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 font-display text-base font-bold leading-tight text-navy-900 sm:text-lg"><Star size={20} className="fill-gold-400 text-gold-500" aria-hidden="true" />Why Choose Our Local Taxi Service?</h2><ul className="space-y-1.5 px-3 py-3">{WHY_CHOOSE.map(reason => <li key={reason} className="flex items-start gap-2 text-xs leading-snug text-navy-800"><CheckCircle2 size={15} className="mt-0.5 shrink-0 fill-green-600 text-white" aria-hidden="true" />{reason}</li>)}</ul></section>
        <section className="rounded-xl border border-gold-100 bg-amber-50/70 p-4" aria-labelledby="local-taxi-help-title"><div className="flex items-start gap-3"><Headphones size={26} className="shrink-0 text-orange-500" aria-hidden="true" /><div><h2 id="local-taxi-help-title" className="font-display text-lg font-bold text-navy-900">Need Help?</h2><p className="mt-1 text-sm leading-snug text-navy-700">Our travel experts are available 24/7 to assist you with your local taxi booking.</p><Link to="/contact" className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 text-sm font-bold text-white hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2">Contact Us <ArrowRight size={15} aria-hidden="true" /></Link></div></div></section>
      </aside>
    </div>

    {activeVehicle && <VehicleDetailsModal vehicle={activeVehicle} passengers={form.passengers} triggerRef={vehicleTriggerRef} onClose={() => setActiveVehicle(null)} onSelect={selectVehicle} />}
    {authPromptOpen && <LocalTravelAuthPrompt onClose={() => setAuthPromptOpen(false)} onContinue={continueToAuth} />}
  </div>
}
