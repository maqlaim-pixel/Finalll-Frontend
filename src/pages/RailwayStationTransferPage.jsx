import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, CalendarDays, CarFront, Check, CheckCircle2,
  ChevronDown, Clock3, Headphones, Luggage, MapPin, Plane, Search, ShieldCheck,
  Star, TrainFront, UserRound, Users, X, LoaderCircle, IndianRupee,
} from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import Breadcrumb from '../components/common/Breadcrumb'
import api from '../services/api'
import useLocalTravelFlow from '../hooks/useLocalTravelFlow'
import LocalTravelAuthPrompt from '../components/common/LocalTravelAuthPrompt'
import { RAILWAY_TRANSFER_STATIONS } from '../data/railwayTransferStations'
import { CITY_LIST, getCityData } from '../data/cityData'
import { LOCAL_TRANSFER_VEHICLES as VEHICLES } from '../data/localTransferVehicles'

const TRANSFER_TYPES = ['Station Pickup', 'Station Drop', 'Meet & Assist']
const SERVICES = [
  { title: 'Station Pickup', type: 'Station Pickup', desc: 'Timely pickup from railway station to your hotel, home or any destination.', image: 'https://images.unsplash.com/photo-1559110863-6cc7362d7700?auto=format&fit=crop&w=900&h=520&q=82', alt: 'Travelers arriving on a railway station platform beside a train', icon: TrainFront, color: 'text-orange-600', tag: 'Arrivals' },
  { title: 'Station Drop', type: 'Station Drop', desc: 'Convenient drop to railway station from your hotel, home or any location.', image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=82', alt: 'Car ready to drop passengers at the railway station', icon: CarFront, color: 'text-sky-600', tag: 'Departures' },
  { title: 'Meet & Assist Service', type: 'Meet & Assist', desc: 'Personal assistance at the railway station with luggage support for a hassle-free experience.', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=82', alt: 'Professional travel assistant ready to welcome arriving guests', icon: BadgeCheck, color: 'text-amber-600', tag: 'Personal assistance' },
]
const FEATURES = [
  { icon: TrainFront, label: 'Station Pickup' }, { icon: CarFront, label: 'Station Drop' },
  { icon: Clock3, label: 'On-Time Service' }, { icon: ShieldCheck, label: 'Safe & Secure' },
  { icon: UserRound, label: 'Professional Drivers' }, { icon: IndianRupee, label: 'Transparent Pricing' },
  { icon: Headphones, label: '24/7 Support' }, { icon: MapPin, label: 'All Major Railway Stations' },
]
const REASONS = [
  'Punctual and reliable service', 'Professional and verified drivers',
  'Well-maintained and clean vehicles', 'Transparent and competitive pricing',
  '24/7 customer support', 'Pickup & drop at all major railway stations in India',
  'Options for individuals, families and corporate travelers',
]
const STEPS = [
  { title: 'Select Transfer Type', text: 'Choose pickup or drop', icon: Search },
  { title: 'Provide Details', text: 'Date, time, station & location', icon: CalendarDays },
  { title: 'Get Quote', text: 'Choose vehicle & confirm', icon: CarFront },
  { title: 'Enjoy Your Ride', text: 'Safe, on-time transfer', icon: CheckCircle2 },
]
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const emptyForm = { transferType: '', station: '', pickupDate: '', pickupTime: '', passengers: '1', vehicleType: '', trainNumber: '', trainName: '', coachNumber: '', pickupLocation: '', dropLocation: '', specialRequest: '', name: '', email: '', phone: '' }
const fieldClass = 'mt-1.5 min-h-10 w-full rounded-md border border-navy-200 bg-white px-2 py-2 text-xs text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:text-sm'

function Field({ id, label, error, children }) {
  return <div className="min-w-0"><label htmlFor={id} className="block text-xs font-medium text-navy-700">{label}</label>{children}{error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}</div>
}

export default function RailwayStationTransferPage() {
  const { form, setForm, user, authPromptOpen, setAuthPromptOpen, requireAuthentication, continueToAuth, clearDraft } = useLocalTravelFlow(emptyForm)
  const bookingRef = useRef(null)
  const firstFieldRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('form')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [stationSearch, setStationSearch] = useState('')
  const [stationOpen, setStationOpen] = useState(false)

  useEffect(() => {
    if (user) setForm(prev => ({ ...prev, name: prev.name || user.name || '', email: prev.email || user.email || '', phone: prev.phone || user.phone || '' }))
  }, [user])

  const visibleStations = useMemo(() => RAILWAY_TRANSFER_STATIONS.filter(station => {
    const city = CITY_LIST.find(item => item.name === station.city)
    const cityData = city ? getCityData(city.slug) : null
    return `${station.city} ${station.name} ${station.code} ${cityData?.howToReach?.train || ''}`.toLowerCase().includes(stationSearch.toLowerCase())
  }), [stationSearch])
  const currentVehicle = VEHICLES.find(vehicle => vehicle.name === form.vehicleType)

  const update = (key, value) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'passengers') {
        const vehicle = VEHICLES.find(option => option.name === prev.vehicleType)
        if (vehicle && Number(value) > vehicle.passengers) next.vehicleType = ''
      }
      return next
    })
    setErrors(prev => ({ ...prev, [key]: '', ...(key === 'passengers' ? { vehicleType: '' } : {}), ...(['name', 'email', 'phone'].includes(key) ? { [key]: '' } : {}) }))
    if (status === 'error') setStatus('form')
  }

  const focusBooking = (changes = {}) => {
    setForm(prev => ({ ...prev, ...changes }))
    setErrors(prev => ({ ...prev, ...Object.fromEntries(Object.keys(changes).map(key => [key, ''])), ...(changes.vehicleType ? { passengers: '' } : {}) }))
    setStatus('form')
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => firstFieldRef.current?.focus(), 450)
    })
  }

  const chooseVehicle = vehicle => {
    if (Number(form.passengers) > vehicle.passengers) {
      setErrors(prev => ({ ...prev, vehicleType: 'The selected vehicle does not support this passenger count. Please choose a larger vehicle.' }))
      return
    }
    setSelectedVehicle(null)
    focusBooking({ vehicleType: vehicle.name })
  }

  const validate = () => {
    const next = {}
    const station = RAILWAY_TRANSFER_STATIONS.find(item => item.code === form.station)
    if (!form.transferType) next.transferType = 'Please select transfer type.'
    if (!station) next.station = 'Please select railway station.'
    if (!form.pickupDate) next.pickupDate = 'Please select pickup date.'
    else if (form.pickupDate < today) next.pickupDate = 'Pickup date cannot be in the past.'
    if (!form.pickupTime) next.pickupTime = 'Please select pickup time.'
    if (!form.passengers || Number(form.passengers) < 1 || Number(form.passengers) > 12) next.passengers = 'Please select number of passengers.'
    if (!form.vehicleType) next.vehicleType = 'Please select vehicle type.'
    else if (currentVehicle && Number(form.passengers) > currentVehicle.passengers) next.vehicleType = 'The selected vehicle does not support this passenger count. Please choose a larger vehicle.'
    if (!user && !form.name.trim()) next.name = 'Please enter your name.'
    if (!user && !form.email.trim()) next.email = 'Please enter your email.'
    else if (!user && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.'
    if (!user && !form.phone.trim()) next.phone = 'Please enter your phone number.'
    else if (!user && !/^[+\d][\d\s()-]{6,19}$/.test(form.phone.trim())) next.phone = 'Please enter a valid phone number.'
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
      const station = RAILWAY_TRANSFER_STATIONS.find(item => item.code === form.station)
      const vehicle = VEHICLES.find(item => item.name === form.vehicleType)
      if (!station || !vehicle) throw new Error('The station or vehicle selection is no longer available')
      if (Number(form.passengers) > vehicle.passengers) {
        setErrors(prev => ({ ...prev, vehicleType: 'The selected vehicle does not support this passenger count. Please choose a larger vehicle.' }))
        setStatus('form')
        return
      }
      const details = [
        'Service: Railway Station Transfer', `Transfer type: ${form.transferType}`,
        `Railway station: ${station.city} — ${station.name} (${station.code})`,
        `Pickup date: ${form.pickupDate}`, `Pickup time: ${form.pickupTime}`,
        `Passengers: ${form.passengers}`, `Vehicle type: ${form.vehicleType}`,
        user && `Contact: ${form.name || user.name || ''} · ${form.email || user.email || ''} · ${form.phone || user.phone || ''}`,
        form.trainNumber && `Train number: ${form.trainNumber}`,
        form.trainName && `Train name: ${form.trainName}`,
        form.coachNumber && `Coach number: ${form.coachNumber}`,
        form.pickupLocation && `Pickup location: ${form.pickupLocation}`,
        form.dropLocation && `Drop location: ${form.dropLocation}`,
        form.specialRequest && `Special request: ${form.specialRequest}`,
      ].filter(Boolean).join('\n')
      await api.post('/local-travel/enquiries', {
        serviceType: 'railway-station-transfer', formData: form, sourceUrl: window.location.pathname,
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
    <SEOHead title="Railway Station Transfer Services in India | TravelVista" description="Book reliable railway station pickup and drop services with TravelVista. Choose comfortable vehicles, professional drivers and convenient railway transfers across major railway stations in India." />
    <section className="relative isolate min-h-[215px] overflow-hidden bg-navy-950 text-white sm:min-h-[235px] lg:min-h-[245px]" aria-labelledby="railway-transfer-title">
      <img src="https://images.unsplash.com/photo-1645438176272-918a71ce821f?auto=format&fit=crop&w=2200&q=88" alt="Passengers with luggage at an Indian railway platform beside a train in the evening" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[50%_55%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/15" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[215px] max-w-8xl items-center px-4 py-4 sm:min-h-[235px] sm:px-6 lg:min-h-[245px] lg:px-8">
        <div className="max-w-3xl">
          <Breadcrumb light items={[{ label: 'Local Travel' }, { label: 'Railway Station Transfer' }]} />
          <h1 id="railway-transfer-title" className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"><span className="text-white">Railway Station </span><span className="text-gold-500">Transfer</span></h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-white sm:text-base">Comfortable <span className="text-gold-400">•</span> Safe <span className="text-gold-400">•</span> On-Time</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/95 sm:text-base">Enjoy hassle-free pickup and drop from all major railway stations. Book a reliable railway station transfer with professional drivers, clean vehicles and timely service for a smooth and comfortable journey.</p>
        </div>
        <div className="pointer-events-none absolute bottom-5 right-5 hidden rotate-[-6deg] text-right font-display text-2xl italic leading-tight text-white drop-shadow-lg lg:block xl:right-10 xl:text-3xl" aria-hidden="true"><span>Travel<br />Beyond<br />Destinations</span><span className="mt-2 flex items-center justify-end gap-2 text-gold-400"><span className="block w-12 border-b border-dashed border-white/80" /><Plane size={23} /></span></div>
      </div>
    </section>

    <section aria-label="Railway station transfer features" className="border-b border-gray-100 bg-[#fcfaf6]">
      <div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto px-3 py-2.5 [scrollbar-width:thin] min-[1280px]:justify-between min-[1280px]:px-8">
        {FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-[130px] shrink-0 flex-col items-center justify-center gap-1 border-r border-orange-100 px-3 text-center last:border-0 min-[1280px]:min-w-0 min-[1280px]:flex-1"><Icon size={20} strokeWidth={2.2} className="text-orange-600" aria-hidden="true" /><span className="whitespace-nowrap text-xs font-medium text-navy-800">{label}</span></div>)}
      </div>
    </section>

    <div className="mx-auto grid max-w-8xl grid-cols-1 items-start gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,2.55fr)_minmax(340px,0.95fr)] lg:gap-5 lg:px-8 lg:py-5">
      <main className="min-w-0 space-y-4">
        <section aria-labelledby="railway-services-title">
          <h2 id="railway-services-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Railway Station Transfer Services</h2>
          <p className="mt-1 text-sm text-navy-700">Reliable and comfortable railway station transfer services for individuals, families and groups across India.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map(({ title, type, desc, image, alt, icon: Icon, color, tag }) => <article key={type} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-32 overflow-hidden lg:h-28 xl:h-28"><img src={image} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute left-3 top-2 rounded bg-black/75 px-2 py-1 text-xs font-bold text-gold-400"><TrainFront size={13} className="mr-1 inline" />{tag}</span><span className={`absolute -bottom-5 left-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm ${color}`}><Icon size={23} aria-hidden="true" /></span></div>
              <div className="px-3.5 pb-3 pt-7"><h3 className="font-display text-lg font-bold text-navy-900">{title}</h3><p className="mt-1 min-h-[54px] text-sm leading-snug text-navy-700">{desc}</p>      <button type="button" onClick={() => focusBooking({ transferType: type, trainNumber: '', trainName: '', coachNumber: '', pickupLocation: '', dropLocation: '', specialRequest: '' })} className="mt-2 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-orange-500 px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">{type === 'Station Pickup' ? 'Book Pickup' : type === 'Station Drop' ? 'Book Drop' : 'Book Meet & Assist'}<ArrowRight size={16} aria-hidden="true" /></button></div>
            </article>)}
          </div>
        </section>

        <section aria-labelledby="railway-vehicles-title">
          <h2 id="railway-vehicles-title" className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Our Vehicle Options</h2>
          <p className="mt-1 text-sm text-navy-700">Choose from a wide range of well-maintained vehicles for a comfortable railway station transfer.</p>
          <div className="mt-3 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:grid-cols-3 min-[1440px]:grid-cols-5">
            {VEHICLES.map(vehicle => <article key={vehicle.name} className="group min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-gold-300 hover:shadow-md">
              <img src={vehicle.image} alt={`${vehicle.name} vehicle`} loading="lazy" decoding="async" className="h-24 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-28" />
              <h3 className="mt-1 truncate font-display text-base font-bold text-navy-900">{vehicle.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Users size={13} aria-hidden="true" />1–{vehicle.passengers} Passengers</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-600"><Luggage size={13} aria-hidden="true" />{vehicle.luggage} Bags</p>
              <button type="button" onClick={() => setSelectedVehicle(vehicle)} className="mt-2 flex min-h-9 w-full items-center justify-center gap-1 rounded-full border border-orange-400 px-2 py-1 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400">View Details <ArrowRight size={13} aria-hidden="true" /></button>
            </article>)}
          </div>
        </section>

        <section className="rounded-xl bg-gradient-to-r from-gray-50 to-sky-50/50 px-4 py-4 sm:px-5" aria-labelledby="railway-process-title">
          <h2 id="railway-process-title" className="font-display text-xl font-bold text-navy-900 sm:text-2xl">Simple Railway Station Transfer Process</h2>
          <p className="mt-0.5 text-sm text-navy-700">Book your railway station transfer in just a few easy steps.</p>
          <ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STEPS.map(({ title, text, icon: Icon }, index) => <li key={title} className="relative flex items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">{index + 1}</span><Icon size={21} className="shrink-0 text-navy-800" aria-hidden="true" /><div className="min-w-0"><h3 className="text-xs font-semibold text-navy-900">{title}</h3><p className="text-[11px] leading-snug text-navy-600">{text}</p></div>{index < STEPS.length - 1 && <ArrowRight size={17} className="absolute -right-1 top-1/2 hidden -translate-y-1/2 text-sky-800 xl:block" aria-hidden="true" />}</li>)}
          </ol>
        </section>
      </main>

      <aside className="min-w-0 space-y-3 lg:sticky lg:top-24 lg:self-start">
        <section ref={bookingRef} id="railway-transfer-booking" tabIndex={-1} className="scroll-mt-24 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" aria-labelledby="booking-title">
          <div className="flex items-center gap-2 bg-sky-50 px-3 py-2.5"><TrainFront size={25} className="text-sky-600" aria-hidden="true" /><div className="min-w-0"><h2 id="booking-title" className="font-display text-base font-bold leading-tight text-navy-900 sm:text-lg">Book Your Railway Station Transfer</h2><p className="text-[11px] text-navy-700">Get instant confirmation and enjoy a smooth ride.</p></div></div>
          {status === 'success' ? <div className="p-5 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={27} /></span><h3 className="mt-3 font-display text-lg font-bold text-navy-900">Railway Station Transfer Request Submitted</h3><p className="mt-2 text-sm leading-relaxed text-navy-700">Thank you. We have received your transfer details. Our travel expert will contact you with the best available railway station transfer quote.</p></div> : <form className="space-y-2.5 p-3" onSubmit={handleSubmit} noValidate>
            {status === 'error' && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"><strong className="block">Unable to Submit Request</strong><span>Something went wrong while sending your railway station transfer request. Please try again.</span><button type="button" onClick={() => setStatus('form')} className="mt-1 block font-semibold underline">Try Again</button></div>}
            {Object.keys(errors).length > 0 && <p className="sr-only" role="alert">Please correct the highlighted required fields.</p>}
            <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
              <Field id="railwayTransferType" label="Transfer Type" error={errors.transferType}><select ref={firstFieldRef} id="railwayTransferType" required aria-required="true" aria-invalid={Boolean(errors.transferType)} className={fieldClass} value={form.transferType} onChange={event => update('transferType', event.target.value)}><option value="">Select Type</option>{TRANSFER_TYPES.map(type => <option key={type}>{type}</option>)}</select></Field>
              <Field id="railwayStation" label="Select Railway Station" error={errors.station}><div className="relative"><button type="button" id="railwayStation" aria-label="Search and select a railway station" aria-expanded={stationOpen} aria-haspopup="listbox" aria-required="true" aria-invalid={Boolean(errors.station)} onClick={() => { setStationOpen(open => !open); setStationSearch('') }} onKeyDown={event => { if (event.key === 'Escape') setStationOpen(false) }} className={`${fieldClass} flex items-center justify-between gap-1 text-left`}><span className="truncate">{form.station ? `${RAILWAY_TRANSFER_STATIONS.find(item => item.code === form.station)?.name} (${form.station})` : 'Select Station'}</span><ChevronDown size={14} className="shrink-0" aria-hidden="true" /></button>{stationOpen && <div className="absolute z-30 mt-1 w-full rounded-lg border border-navy-200 bg-white p-2 shadow-xl"><label className="sr-only" htmlFor="railwayStationSearch">Search railway stations</label><div className="flex items-center gap-2 rounded border px-2"><Search size={14} aria-hidden="true" /><input autoFocus id="railwayStationSearch" value={stationSearch} onChange={event => setStationSearch(event.target.value)} placeholder="Search stations" className="w-full py-1.5 text-sm outline-none" /></div><ul role="listbox" aria-label="Railway stations" className="mt-1 max-h-44 overflow-y-auto">{visibleStations.map(item => <li key={item.code}><button type="button" role="option" aria-selected={form.station === item.code} onClick={() => { update('station', item.code); setStationOpen(false) }} className="w-full rounded px-2 py-2 text-left text-xs hover:bg-sky-50">{item.city} — {item.name} <span className="text-navy-400">({item.code})</span></button></li>)}{visibleStations.length === 0 && <li className="px-2 py-2 text-xs text-navy-500">No railway stations found.</li>}</ul></div>}</div></Field>
              <Field id="railwayPickupDate" label="Pickup Date" error={errors.pickupDate}><input id="railwayPickupDate" type="date" required aria-required="true" aria-invalid={Boolean(errors.pickupDate)} min={today} className={fieldClass} value={form.pickupDate} onChange={event => update('pickupDate', event.target.value)} /></Field>
              <Field id="railwayPickupTime" label="Pickup Time" error={errors.pickupTime}><input id="railwayPickupTime" type="time" required aria-required="true" aria-invalid={Boolean(errors.pickupTime)} className={fieldClass} value={form.pickupTime} onChange={event => update('pickupTime', event.target.value)} /></Field>
              <Field id="railwayPassengers" label="Number of Passengers" error={errors.passengers}><select id="railwayPassengers" required aria-required="true" aria-invalid={Boolean(errors.passengers)} className={fieldClass} value={form.passengers} onChange={event => update('passengers', event.target.value)}>{Array.from({ length: 12 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>)}</select></Field>
              <Field id="railwayVehicleType" label="Vehicle Type" error={errors.vehicleType}><select id="railwayVehicleType" required aria-required="true" aria-invalid={Boolean(errors.vehicleType)} className={fieldClass} value={form.vehicleType} onChange={event => update('vehicleType', event.target.value)}><option value="">Select Vehicle</option>{VEHICLES.map(vehicle => <option key={vehicle.name} value={vehicle.name} disabled={Number(form.passengers) > vehicle.passengers}>{vehicle.name}</option>)}</select></Field>
            </div>
            {form.transferType && <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
              {form.transferType === 'Station Pickup' && <><Field id="railwayTrainNumber" label="Train Number (optional)"><input id="railwayTrainNumber" className={fieldClass} value={form.trainNumber} onChange={event => update('trainNumber', event.target.value)} placeholder="Train no." /></Field><Field id="railwayTrainName" label="Train Name (optional)"><input id="railwayTrainName" className={fieldClass} value={form.trainName} onChange={event => update('trainName', event.target.value)} placeholder="Train name" /></Field><Field id="railwayPickupDropLocation" label="Drop Location"><input id="railwayPickupDropLocation" className={fieldClass} value={form.dropLocation} onChange={event => update('dropLocation', event.target.value)} placeholder="Hotel, address" /></Field></>}
              {form.transferType === 'Station Drop' && <><Field id="railwayPickupLocation" label="Pickup Location"><input id="railwayPickupLocation" className={fieldClass} value={form.pickupLocation} onChange={event => update('pickupLocation', event.target.value)} placeholder="Hotel, address" /></Field><Field id="railwayDropTrainNumber" label="Train Number (optional)"><input id="railwayDropTrainNumber" className={fieldClass} value={form.trainNumber} onChange={event => update('trainNumber', event.target.value)} placeholder="Train no." /></Field></>}
              {form.transferType === 'Meet & Assist' && <><Field id="railwayAssistTrainNumber" label="Train Number (optional)"><input id="railwayAssistTrainNumber" className={fieldClass} value={form.trainNumber} onChange={event => update('trainNumber', event.target.value)} placeholder="Train no." /></Field><Field id="railwayAssistTrainName" label="Train Name (optional)"><input id="railwayAssistTrainName" className={fieldClass} value={form.trainName} onChange={event => update('trainName', event.target.value)} placeholder="Train name" /></Field><Field id="railwayCoachNumber" label="Coach Number (optional)"><input id="railwayCoachNumber" className={fieldClass} value={form.coachNumber} onChange={event => update('coachNumber', event.target.value)} placeholder="Coach" /></Field><Field id="railwayAssistDestination" label="Destination (optional)"><input id="railwayAssistDestination" className={fieldClass} value={form.dropLocation} onChange={event => update('dropLocation', event.target.value)} placeholder="Destination" /></Field><Field id="railwayAssistSpecialRequest" label="Special Request (optional)"><input id="railwayAssistSpecialRequest" className={fieldClass} value={form.specialRequest} onChange={event => update('specialRequest', event.target.value)} placeholder="Luggage or assistance details" /></Field></>}
            </div>}
            <details className="text-xs" open={!user || Boolean(errors.name || errors.email || errors.phone)}><summary className="cursor-pointer font-medium text-sky-800">Contact details {user ? '' : '(required)'}</summary><div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"><Field id="railwayName" label="Full Name" error={errors.name}><input id="railwayName" aria-invalid={Boolean(errors.name)} autoComplete="name" className={fieldClass} value={form.name} onChange={event => update('name', event.target.value)} /></Field><Field id="railwayEmail" label="Email" error={errors.email}><input id="railwayEmail" type="email" aria-invalid={Boolean(errors.email)} autoComplete="email" className={fieldClass} value={form.email} onChange={event => update('email', event.target.value)} /></Field><Field id="railwayPhone" label="Phone" error={errors.phone}><input id="railwayPhone" type="tel" aria-invalid={Boolean(errors.phone)} autoComplete="tel" className={fieldClass} value={form.phone} onChange={event => update('phone', event.target.value)} /></Field></div><p className="mt-2 text-[11px] text-navy-500">Your account details are filled in when available. If you are not signed in, add contact details so our team can respond.</p></details>
            <button type="submit" disabled={submitting} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 font-bold text-white shadow-sm transition hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{submitting ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Submitting...</> : <>Get Quote <ArrowRight size={17} aria-hidden="true" /></>}</button>
            <p className="text-center text-[10px] text-navy-500">Our team will confirm availability and provide a quote. No estimated fare is generated here.</p>
          </form>}
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="railway-why-title"><h2 id="railway-why-title" className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 font-display text-base font-bold leading-tight text-navy-900 sm:text-lg"><Star size={20} className="fill-gold-400 text-gold-500" aria-hidden="true" />Why Choose Our Railway Station Transfer?</h2><ul className="space-y-1.5 px-3 py-3">{REASONS.map(reason => <li key={reason} className="flex items-start gap-2 text-xs leading-snug text-navy-800"><CheckCircle2 size={15} className="mt-0.5 shrink-0 fill-green-600 text-white" aria-hidden="true" />{reason}</li>)}</ul></section>
        <section className="rounded-xl border border-gold-100 bg-amber-50/70 p-4" aria-labelledby="railway-help-title"><div className="flex items-start gap-3"><Headphones size={26} className="shrink-0 text-orange-500" aria-hidden="true" /><div><h2 id="railway-help-title" className="font-display text-lg font-bold text-navy-900">Need Help?</h2><p className="mt-1 text-sm leading-snug text-navy-700">Our travel experts are available 24/7 to assist you with your railway station transfer booking.</p><Link to="/contact" className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-gold-800 px-4 py-2 text-sm font-bold text-white hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2">Contact Us <ArrowRight size={15} aria-hidden="true" /></Link></div></div></section>
      </aside>
    </div>

    {selectedVehicle && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/60 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedVehicle(null) }}><section role="dialog" aria-modal="true" aria-labelledby="railway-vehicle-modal-title" onKeyDown={event => { if (event.key === 'Escape') setSelectedVehicle(null) }} className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><button type="button" aria-label="Close vehicle details" autoFocus onClick={() => setSelectedVehicle(null)} className="absolute right-3 top-3 rounded p-2 text-navy-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"><X size={19} /></button><img src={selectedVehicle.image} alt={`${selectedVehicle.name} vehicle`} className="h-40 w-full object-contain" /><h2 id="railway-vehicle-modal-title" className="font-display text-2xl font-bold text-navy-900">{selectedVehicle.name}</h2><div className="mt-3 flex gap-4 text-sm text-navy-700"><span className="flex items-center gap-1"><Users size={16} />Up to {selectedVehicle.passengers} passengers</span><span className="flex items-center gap-1"><Luggage size={16} />{selectedVehicle.luggage} bags</span></div><ul className="mt-3 space-y-2">{selectedVehicle.features.map(feature => <li key={feature} className="flex gap-2 text-sm text-navy-700"><CheckCircle2 size={16} className="shrink-0 text-green-600" />{feature}</li>)}</ul><p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-navy-600">Vehicle capacities are indicative and subject to confirmation when our travel expert responds to your quote request.</p>{Number(form.passengers) > selectedVehicle.passengers && <p className="mt-3 text-sm text-red-700" role="alert">This vehicle supports up to {selectedVehicle.passengers} passengers. Please choose a larger vehicle.</p>}<button type="button" disabled={Number(form.passengers) > selectedVehicle.passengers} onClick={() => chooseVehicle(selectedVehicle)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-3 font-bold text-white hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50">Select Vehicle <ArrowRight size={17} /></button></section></div>}
    {authPromptOpen && <LocalTravelAuthPrompt onClose={() => setAuthPromptOpen(false)} onContinue={continueToAuth} />}
  </div>
}
