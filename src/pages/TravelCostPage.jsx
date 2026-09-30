import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowDownUp,
  ArrowRight,
  Backpack,
  Banknote,
  BedDouble,
  Bus,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Coins,
  CreditCard,
  Globe2,
  Hotel,
  Landmark,
  LoaderCircle,
  MapPin,
  Plane,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
  Wallet,
} from 'lucide-react'
import api from '../services/api'
import Breadcrumb from '../components/common/Breadcrumb'
import SEOHead from '../components/common/SEOHead'
import { resolveImageUrl } from '../utils/imageUtils'
import { isDestinationListResponse } from '../utils/heritageDestinations'

const IMAGE = (photo, width = 1000, height = 650) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&h=${height}&q=82`
const HERO_IMAGE = IMAGE('photo-1719952739528-e801d3904bfa', 2200, 900)

const FILTERS = [
  { id: 'india', label: 'India' },
  { id: 'international', label: 'International' },
  { id: 'honeymoon', label: 'Honeymoon', terms: ['honeymoon', 'couple', 'romantic'] },
  { id: 'family', label: 'Family Travel', terms: ['family', 'kid', 'children'] },
  { id: 'backpacking', label: 'Backpacking', terms: ['backpack', 'hostel', 'budget'] },
  { id: 'luxury', label: 'Luxury Travel', terms: ['luxury', 'premium', 'five star', '5 star'] },
]

const TRAVEL_TYPES = [
  { id: 'backpacking', name: 'Backpacking', min: 1500, max: 3000, image: IMAGE('photo-1500530855697-b586d89ba3ee'), alt: 'Backpacker looking across a mountain landscape', icon: Backpack },
  { id: 'family', name: 'Family Travel', min: 3000, max: 6000, image: IMAGE('photo-1476703993599-0035a21b17a9'), alt: 'Family enjoying an outdoor trip', icon: Users },
  { id: 'honeymoon', name: 'Honeymoon', min: 4000, max: 8000, image: IMAGE('photo-1516589178581-6cd7833ae3b2'), alt: 'Couple watching a sunset together', icon: Sparkles },
  { id: 'luxury', name: 'Luxury Travel', min: 10000, max: null, image: IMAGE('photo-1571896349842-33c89424de2d'), alt: 'Premium resort beside tropical water', icon: Hotel },
]

const TRAVEL_TYPE_MULTIPLIERS = {
  budget: 0.75,
  standard: 1,
  comfort: 1.4,
  luxury: 2,
}

const TRAVEL_TYPE_OPTIONS = [
  { id: 'budget', label: 'Budget' },
  { id: 'standard', label: 'Standard' },
  { id: 'comfort', label: 'Comfort' },
  { id: 'luxury', label: 'Luxury' },
]

export const DAILY_BREAKDOWN = [
  { expense: 'Accommodation', icon: BedDouble, values: ['₹800 – ₹1,500', '₹1,500 – ₹3,000', '₹3,000 – ₹6,000', '₹6,000+'] },
  { expense: 'Food & Dining', icon: Utensils, values: ['₹300 – ₹600', '₹600 – ₹1,000', '₹1,000 – ₹2,000', '₹2,000+'] },
  { expense: 'Local Transport', icon: Bus, values: ['₹200 – ₹500', '₹500 – ₹1,000', '₹1,000 – ₹2,000', '₹2,000+'] },
  { expense: 'Sightseeing & Activities', icon: Landmark, values: ['₹300 – ₹800', '₹800 – ₹1,500', '₹1,500 – ₹3,000', '₹3,000+'] },
]

const DAILY_TOTALS = ['₹1,600 – ₹3,400', '₹3,400 – ₹6,500', '₹6,500 – ₹13,000', '₹13,000+']

export const MONEY_TIPS = [
  'Travel during off-season for lower prices.',
  'Book flights and hotels in advance.',
  'Use local transport instead of private cabs.',
  'Choose homestays or budget hotels.',
  'Look for combo packages and discounts.',
  'Eat at local restaurants.',
  'Plan your itinerary to avoid last-minute expenses.',
]

const BUDGET_ITEMS = [
  { label: 'Accommodation', detail: 'Choose a stay that fits your comfort level and dates.', icon: BedDouble },
  { label: 'Food', detail: 'Set a daily meal budget and allow room for local specialties.', icon: Utensils },
  { label: 'Transportation', detail: 'Include arrival, local travel and intercity transfers.', icon: Bus },
  { label: 'Activities', detail: 'Check entry fees, tours and seasonal availability.', icon: Landmark },
  { label: 'Shopping', detail: 'Set a separate limit for souvenirs and local purchases.', icon: Wallet },
  { label: 'Emergency fund', detail: 'Keep a contingency for unexpected changes or expenses.', icon: ShieldCheck },
]

const FAQS = [
  { question: 'How is the estimated travel cost calculated?', answer: 'When published package data exists for a destination, the calculator derives a daily per-person baseline from each package starting price divided by its duration. It scales that indicative baseline by traveler count, trip days and the selected travel-style multiplier. It is not a quote.' },
  { question: 'Does the estimate include flights?', answer: 'No. The estimate is based on published package starting prices when available and does not guarantee that flights or every trip expense are included. Check the actual package inclusions before booking.' },
  { question: 'Are hotel costs included?', answer: 'Package-derived estimates use the available published starting price and do not break out or guarantee accommodation costs. Refer to the selected package for its actual inclusions.' },
  { question: 'Do travel costs change by season?', answer: 'Yes. Demand, availability, local events and weather can affect costs. Confirm current prices and conditions for your travel dates.' },
  { question: 'How can I reduce my travel budget?', answer: 'Consider off-season dates, book ahead, use local transportation, compare stays and plan activities before departure.' },
  { question: 'Are package prices the same as calculator estimates?', answer: 'No. Calculator amounts are estimates only. Package prices are actual published MAQLAIM TOURS package data and remain separate; check the package page for the current price and booking details.' },
]

const CURRENCY_TIPS = [
  'The currency used in India is the Indian Rupee (INR / ₹).',
  'Carry more than one payment option and keep a small amount of cash for local expenses.',
  'Use trusted payment methods and protect your PINs and account details.',
  'For international travel, check foreign transaction and card fees with your provider.',
]

function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function destinationName(destination) {
  return String(destination?.name || '').trim()
}

function matchesDestinationPackage(pkg, destination) {
  // Match a package's destination directly. A package tagged only with a state
  // should match a state-level destination record, not every city/region in it.
  const names = [destinationName(destination), destination?.slug]
    .map(normalize)
    .filter(Boolean)
  return [pkg?.destination, pkg?.state]
    .map(normalize)
    .some(value => names.includes(value))
}

function packagesForDestination(packages, destination) {
  return packages.filter(pkg => matchesDestinationPackage(pkg, destination))
}

function getPackageDailyRange(packages, destination) {
  const rates = packagesForDestination(packages, destination)
    .map(pkg => {
      const price = Number(pkg.startingPrice)
      const days = Number(pkg.durationDays)
      if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(days) || days <= 0) return null
      return { daily: price / days, currency: pkg.currency || 'INR' }
    })
    .filter(Boolean)
  if (!rates.length) return null
  const currency = rates[0].currency
  const matchingRates = rates.filter(rate => rate.currency === currency).map(rate => rate.daily)
  return {
    min: Math.min(...matchingRates),
    max: Math.max(...matchingRates),
    currency,
    packageCount: rates.length,
  }
}

function getPackageCategoryText(packages, destination) {
  return packagesForDestination(packages, destination)
    .map(pkg => [pkg.category, pkg.tags, pkg.title, pkg.shortDescription, pkg.description].filter(Boolean).join(' '))
    .join(' ')
    .toLowerCase()
}

function matchesFilter(destination, packages, filter) {
  const type = String(destination.type || '').toLowerCase()
  const country = String(destination.country || '').toLowerCase()
  const isIndia = country === 'india' || type === 'domestic'
  if (filter.id === 'india') return isIndia
  if (filter.id === 'international') return !isIndia && (type === 'international' || Boolean(country))
  const content = getPackageCategoryText(packages, destination)
  return Boolean(packagesForDestination(packages, destination).length) && filter.terms.some(term => content.includes(term))
}

function formatMoney(value, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

function destinationRoute(destination) {
  const slug = destination.slug || destination.id
  return `/destinations/${encodeURIComponent(slug)}`
}

function sectionScroll(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function EmptyState({ title = 'Coming Soon', children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
      <MapPin size={30} className="mx-auto text-sky-700" aria-hidden="true" />
      <h3 className="mt-3 font-display text-xl font-bold text-navy-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-navy-600">{children || 'Travel cost information for this destination is being prepared.'}</p>
    </div>
  )
}

function SectionHeading({ icon: Icon, children, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-2xl font-bold leading-tight text-navy-950 sm:text-3xl">
        {Icon && <Icon size={24} className="mr-2 inline-block -translate-y-0.5 text-orange-600" aria-hidden="true" />}
        {children}
      </h2>
      <span className="mt-2 block h-1 w-11 rounded-full bg-orange-500" aria-hidden="true" />
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-navy-600">{subtitle}</p>}
    </div>
  )
}

function TravelCostCard({ destination, packages }) {
  const [imageFailed, setImageFailed] = useState(false)
  const image = resolveImageUrl(destination.image)
  const name = destinationName(destination)
  const costs = getPackageDailyRange(packages, destination)
  const linkedPackages = packagesForDestination(packages, destination)
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={destinationRoute(destination)} aria-label={`View ${name} travel cost details`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
        {image && !imageFailed ? <img src={image} alt={name} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100 text-sky-700" aria-hidden="true"><MapPin size={34} /></div>}
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3 pt-8 font-display text-lg font-bold text-white">{name}</span>
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {costs ? (
          <>
            <p className="font-semibold text-navy-900">{formatMoney(costs.min, costs.currency)}{costs.max > costs.min ? ` – ${formatMoney(costs.max, costs.currency)}` : ''}</p>
            <p className="mt-0.5 text-xs text-navy-500">per person / day · based on published packages</p>
          </>
        ) : (
          <div className="min-h-[42px]"><p className="font-semibold text-navy-800">Travel Cost Coming Soon</p><p className="mt-0.5 text-xs text-navy-500">No published package rate to estimate from.</p></div>
        )}
        <Link to={`/travel-guide/travel-cost/${encodeURIComponent(destination.slug || destination.id)}`} className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-orange-500 px-3 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          View Details <ArrowRight size={15} aria-hidden="true" />
        </Link>
        {linkedPackages.length > 0 && <Link to={`/packages?destination=${encodeURIComponent(name)}`} className="mt-2 text-center text-xs font-semibold text-sky-800 underline decoration-sky-300 underline-offset-2 hover:text-sky-950">View Available Packages</Link>}
      </div>
    </article>
  )
}

function DestinationCardGrid({ destinations, packages, loading, error, emptyTitle, emptyText }) {
  if (loading) return <LoadingState label="Loading destinations and published package rates…" />
  if (error) return <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</div>
  if (!destinations.length) return <EmptyState title={emptyTitle}>{emptyText}</EmptyState>
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{destinations.map(destination => <TravelCostCard key={destination.id || destination.slug} destination={destination} packages={packages} />)}</div>
}

function LoadingState({ label = 'Loading travel cost information…' }) {
  return <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-navy-600" role="status" aria-live="polite"><LoaderCircle size={23} className="animate-spin text-sky-700" aria-hidden="true" />{label}</div>
}

function TravelCostCalculator({ destinations, packages, selectedDestination, onDestinationChange, selectedType, onTypeChange }) {
  const [travelers, setTravelers] = useState(2)
  const [days, setDays] = useState(4)
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')
  const destinationsWithPublishedRates = destinations.filter(destination => getPackageDailyRange(packages, destination))
  const selected = destinations.find(destination => String(destination.id) === String(selectedDestination))
  const availableRates = selected ? getPackageDailyRange(packages, selected) : null

  const calculate = event => {
    event.preventDefault()
    if (!selected || !availableRates) {
      setResult(null)
      setMessage('A published package rate is not available for this destination yet, so we cannot calculate a responsible estimate.')
      return
    }
    const multiplier = TRAVEL_TYPE_MULTIPLIERS[selectedType] || TRAVEL_TYPE_MULTIPLIERS.standard
    const min = availableRates.min * Number(travelers) * Number(days) * multiplier
    const max = availableRates.max * Number(travelers) * Number(days) * multiplier
    setResult({ min, max, currency: availableRates.currency, travelers: Number(travelers), days: Number(days), name: destinationName(selected), type: selectedType })
    setMessage('')
  }

  return (
    <section id="travel-cost-calculator" className="scroll-mt-28 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm" aria-labelledby="calculator-title">
      <div className="flex items-center gap-3 bg-gradient-to-r from-sky-50 to-emerald-50 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-700 text-white"><Banknote size={22} aria-hidden="true" /></span>
        <div><h2 id="calculator-title" className="font-display text-xl font-bold text-navy-950">Travel Cost Calculator</h2><p className="text-xs text-navy-600">Get an estimated cost for your trip</p></div>
      </div>
      <form onSubmit={calculate} className="space-y-3 p-4">
        <label className="block text-xs font-semibold text-navy-800">Select Destination
          <select value={selectedDestination} onChange={event => { onDestinationChange(event.target.value); setResult(null); setMessage('') }} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-500" required>
            {destinations.map(destination => <option key={destination.id || destination.slug} value={destination.id}>{destination.name}{getPackageDailyRange(packages, destination) ? '' : ' — cost data coming soon'}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold text-navy-800">Number of Travelers
            <select value={travelers} onChange={event => setTravelers(Number(event.target.value))} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
              {Array.from({ length: 10 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'Traveler' : 'Travelers'}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold text-navy-800">Trip Duration
            <select value={days} onChange={event => setDays(Number(event.target.value))} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
              {[...Array.from({ length: 10 }, (_, index) => index + 1), 14].map(duration => <option key={duration} value={duration}>{duration === 14 ? 'More than 10 Days' : `${duration} ${duration === 1 ? 'Day' : 'Days'}`}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-xs font-semibold text-navy-800">Travel Type
          <select value={selectedType} onChange={event => { onTypeChange(event.target.value); setResult(null) }} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-navy-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
            {TRAVEL_TYPE_OPTIONS.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
          </select>
        </label>
        <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Calculate Estimated Cost <ArrowRight size={16} aria-hidden="true" /></button>
        {message && <p className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900" role="status">{message}</p>}
        {result && <div className="rounded-xl bg-gradient-to-r from-sky-50 to-orange-50 p-4" aria-live="polite"><p className="text-sm font-semibold text-navy-900">Estimated Cost · {result.name}</p><p className="mt-1 text-2xl font-bold text-sky-700">{formatMoney(result.min, result.currency)} – {formatMoney(result.max, result.currency)}</p><p className="mt-1 text-xs text-navy-600">for {result.travelers} {result.travelers === 1 ? 'traveler' : 'travelers'}, {result.days} days · {result.type} style</p><p className="mt-3 text-[11px] leading-relaxed text-navy-600">Estimated costs are indicative and may vary based on season, availability, transport, accommodation and selected activities.</p></div>}
        {!result && !message && !availableRates && destinations.length > 0 && <p className="text-xs text-navy-500">Cost data for the selected destination is being prepared. Choose a destination with a published package to calculate an estimate.</p>}
      </form>
      {destinationsWithPublishedRates.length === 0 && <p className="border-t border-slate-100 px-4 py-3 text-xs text-navy-600">Calculator estimates appear when published package rates are available.</p>}
    </section>
  )
}

function MoneySavingTips() {
  return <section id="money-saving-tips" className="scroll-mt-28 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm"><h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy-950"><Sparkles size={20} className="text-amber-500" aria-hidden="true" />Money Saving Tips</h2><ul className="space-y-2.5">{MONEY_TIPS.map(tip => <li key={tip} className="flex gap-2 text-sm leading-relaxed text-navy-700"><Check size={16} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{tip}</li>)}</ul></section>
}

function CostBreakdown() {
  const levels = ['Budget', 'Standard', 'Comfort', 'Luxury']
  return <section id="cost-breakdown" className="scroll-mt-28"><SectionHeading icon={ArrowDownUp} subtitle="A typical general-guidance daily cost per person in India, not a quote for a specific destination.">Average Travel Cost Breakdown</SectionHeading><div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm"><table className="w-full min-w-[650px] border-collapse text-left text-xs sm:text-sm"><thead><tr className="bg-sky-50"><th scope="col" className="px-3 py-3 font-bold text-navy-900">Expense Type</th>{levels.map((level, index) => <th key={level} scope="col" className={`px-3 py-3 font-bold text-white ${['bg-emerald-600', 'bg-sky-600', 'bg-orange-500', 'bg-violet-500'][index]}`}>{level}</th>)}</tr></thead><tbody>{DAILY_BREAKDOWN.map(row => { const Icon = row.icon; return <tr key={row.expense} className="border-t border-slate-200 odd:bg-white even:bg-slate-50"><th scope="row" className="whitespace-nowrap px-3 py-3 font-medium text-navy-800"><Icon size={15} className="mr-2 inline text-sky-700" aria-hidden="true" />{row.expense}</th>{row.values.map((value, index) => <td key={index} className="whitespace-nowrap px-3 py-3 text-navy-700">{value}</td>)}</tr>})}<tr className="border-t-2 border-sky-200 bg-sky-50 font-bold"><th scope="row" className="px-3 py-3 text-navy-900">Total (Per Day)</th>{DAILY_TOTALS.map((value, index) => <td key={index} className="whitespace-nowrap px-3 py-3 text-navy-900">{value}</td>)}</tr></tbody></table></div><p className="mt-2 text-xs text-navy-500">General reference ranges only. Actual destination, package and booking costs vary.</p></section>
}

function TravelTypeSection({ onSelectType }) {
  return <section id="cost-by-travel-type" className="scroll-mt-28"><SectionHeading icon={Users} subtitle="Illustrative general daily budget guidance by travel style. Actual costs vary by destination and dates.">Cost by Travel Type</SectionHeading><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{TRAVEL_TYPES.map(type => { const Icon = type.icon; return <button key={type.id} type="button" onClick={() => onSelectType(type.id)} className="group flex min-h-[92px] min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500"><div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100"><img src={type.image} alt={type.alt} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" /><Icon size={18} className="absolute bottom-1 right-1 rounded bg-white/90 p-0.5 text-sky-800" aria-hidden="true" /></div><span className="min-w-0 flex-1"><span className="block font-semibold text-navy-900">{type.name}</span><span className="mt-1 block text-sm font-bold text-sky-800">{type.max ? `₹${type.min.toLocaleString('en-IN')} – ₹${type.max.toLocaleString('en-IN')}` : `₹${type.min.toLocaleString('en-IN')}+`}</span><span className="block text-xs text-navy-500">per day · general guidance</span></span><ChevronRight size={17} className="shrink-0 text-orange-600" aria-hidden="true" /></button>})}</div></section>
}

function BudgetPlanning() {
  return <section id="budget-planning" className="scroll-mt-28"><SectionHeading icon={Wallet} subtitle="Build a flexible budget and check actual prices for your dates before you book.">Budget Planning</SectionHeading><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{BUDGET_ITEMS.map(item => { const Icon = item.icon; return <article key={item.label} className="rounded-xl border border-slate-200 bg-white p-4"><Icon size={20} className="text-sky-700" aria-hidden="true" /><h3 className="mt-2 font-semibold text-navy-900">{item.label}</h3><p className="mt-1 text-sm leading-relaxed text-navy-600">{item.detail}</p></article>})}</div><p className="mt-3 text-xs text-navy-500">A common planning approach is to budget for the essentials first, reserve an emergency buffer, then allocate the remainder to activities and shopping.</p></section>
}

function CurrencyPayments() {
  return <section id="currency-payments" className="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><SectionHeading icon={CreditCard} subtitle="Simple payment preparation can help avoid surprises while travelling.">Currency & Payments</SectionHeading><p className="font-semibold text-navy-900">India: Indian Rupee (INR / ₹)</p><ul className="mt-3 grid gap-2 sm:grid-cols-2">{CURRENCY_TIPS.map(tip => <li key={tip} className="flex gap-2 text-sm leading-relaxed text-navy-700"><Check size={16} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{tip}</li>)}</ul></section>
}

function TravelCostFaqs() {
  return <section id="travel-cost-faqs" className="scroll-mt-28"><SectionHeading icon={CircleHelp}>Travel Cost FAQs</SectionHeading><div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-4">{FAQS.map(item => <details key={item.question} className="group py-3"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-semibold text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 [&::-webkit-details-marker]:hidden">{item.question}<ChevronDown size={18} className="shrink-0 text-sky-700 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-2 pr-8 text-sm leading-relaxed text-navy-600">{item.answer}</p></details>)}</div></section>
}

function TravelCostSidebar({ destinations, packages, selectedDestination, onDestinationChange, selectedType, onTypeChange }) {
  return <aside className="min-w-0 space-y-4" aria-label="Travel cost tools"><TravelCostCalculator destinations={destinations} packages={packages} selectedDestination={selectedDestination} onDestinationChange={onDestinationChange} selectedType={selectedType} onTypeChange={onTypeChange} /><MoneySavingTips /></aside>
}

function TravelCostDetail({ destination, packages }) {
  const relatedPackages = packagesForDestination(packages, destination)
  const dailyRange = getPackageDailyRange(packages, destination)
  const costTypes = ['budget', 'standard', 'comfort', 'luxury']
  return <main className="container-wide grid min-w-0 gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:py-9"><div className="min-w-0 space-y-7"><section className="rounded-xl border border-slate-200 p-5 shadow-sm sm:p-7"><h2 className="font-display text-2xl font-bold text-navy-950">Travel cost overview</h2><p className="mt-3 leading-relaxed text-navy-700">{destination.shortDescription || destination.description || `Explore a trip to ${destinationName(destination)} and compare published MAQLAIM TOURS package options.`}</p>{dailyRange ? <p className="mt-5 rounded-lg bg-sky-50 p-4 text-sky-950"><strong>Package-derived daily estimate:</strong> {formatMoney(dailyRange.min, dailyRange.currency)}{dailyRange.max > dailyRange.min ? ` – ${formatMoney(dailyRange.max, dailyRange.currency)}` : ''} per person / day, calculated from published package starting prices and durations. This is indicative, not a guaranteed daily spend.</p> : <div className="mt-5"><EmptyState>Travel cost information for this destination is being prepared. No published package rates are currently available for an estimate.</EmptyState></div>}</section><section><SectionHeading icon={Wallet} subtitle="Broad daily cost guidance for planning only, not destination-specific actual pricing.">Budget, Standard, Comfort & Luxury</SectionHeading><div className="grid gap-3 sm:grid-cols-2">{costTypes.map((type, index) => <article key={type} className="rounded-xl border border-slate-200 bg-white p-4"><p className="font-semibold capitalize text-navy-900">{type}</p><p className="mt-1 font-bold text-sky-800">{DAILY_TOTALS[index]}</p><p className="mt-1 text-xs text-navy-500">India-level reference per person / day</p></article>)}</div></section>{relatedPackages.length > 0 && <section><SectionHeading icon={Hotel} subtitle="Published MAQLAIM TOURS package prices are actual package data; they are separate from calculator estimates.">Available MAQLAIM TOURS Packages</SectionHeading><div className="grid gap-3 sm:grid-cols-2">{relatedPackages.map(pkg => <article key={pkg.id || pkg.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold text-navy-900">{pkg.title}</h3><p className="mt-1 text-sm text-navy-600">{pkg.durationDays || '—'} days · {pkg.durationNights ?? '—'} nights</p><p className="mt-2 text-xl font-bold text-sky-700">{formatMoney(Number(pkg.startingPrice) || 0, pkg.currency || 'INR')} <span className="text-xs font-normal text-navy-500">/ person · package price</span></p><Link to={pkg.slug ? `/packages/${encodeURIComponent(pkg.slug)}` : `/packages?destination=${encodeURIComponent(destinationName(destination))}`} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-sky-700 px-4 text-sm font-semibold text-sky-800 hover:bg-sky-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500">View Package <ArrowRight size={15} aria-hidden="true" /></Link></article>)}</div></section>}<MoneySavingTips /></div><aside className="min-w-0"><Link to="/travel-guide/travel-cost" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-sky-800 hover:underline"><ArrowRight size={15} className="rotate-180" aria-hidden="true" />All Travel Costs</Link><div className="mt-4 rounded-xl border border-slate-200 bg-white p-4"><h2 className="font-display text-lg font-bold text-navy-900">Plan a trip to {destinationName(destination)}</h2><p className="mt-2 text-sm text-navy-600">Browse published packages, or ask the team for current destination pricing.</p><Link to={`/packages?destination=${encodeURIComponent(destinationName(destination))}`} className="mt-3 inline-flex min-h-10 items-center gap-2 font-semibold text-sky-800 hover:underline">See matching packages <ArrowRight size={15} /></Link></div></aside></main>
}

export default function TravelCostPage() {
  const { destinationSlug } = useParams()
  const [destinations, setDestinations] = useState([])
  const [packages, setPackages] = useState([])
  const [destinationLoading, setDestinationLoading] = useState(true)
  const [packageLoading, setPackageLoading] = useState(true)
  const [destinationError, setDestinationError] = useState('')
  const [activeFilter, setActiveFilter] = useState('india')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [selectedType, setSelectedType] = useState('standard')
  const [activeNav, setActiveNav] = useState('overview')

  const loadDestinations = useCallback(async () => {
    setDestinationLoading(true)
    setDestinationError('')
    try {
      const response = await api.get('/destinations?status=published')
      if (!isDestinationListResponse(response.data)) throw new TypeError('Unexpected destination response')
      setDestinations(response.data)
    } catch {
      setDestinations([])
      setDestinationError('Unable to load published destinations. Please try again.')
    } finally {
      setDestinationLoading(false)
    }
  }, [])

  useEffect(() => { loadDestinations() }, [loadDestinations])

  useEffect(() => {
    let mounted = true
    api.get('/packages?status=published')
      .then(response => { if (mounted) setPackages(Array.isArray(response.data) ? response.data : []) })
      .catch(() => { if (mounted) setPackages([]) })
      .finally(() => { if (mounted) setPackageLoading(false) })
    return () => { mounted = false }
  }, [])

  const destinationForDetail = destinationSlug
    ? destinations.find(destination => normalize(destination.slug) === normalize(destinationSlug) || normalize(destination.id) === normalize(destinationSlug))
    : null
  const filteredDestinations = useMemo(() => destinations.filter(destination => matchesFilter(destination, packages, FILTERS.find(filter => filter.id === activeFilter) || FILTERS[0])), [destinations, packages, activeFilter])
  const calculators = useMemo(() => destinations.filter(destination => getPackageDailyRange(packages, destination)), [destinations, packages])

  useEffect(() => {
    if (!selectedDestination && calculators.length) setSelectedDestination(String(calculators[0].id))
    else if (selectedDestination && !destinations.some(destination => String(destination.id) === selectedDestination) && destinations.length) setSelectedDestination(String(destinations[0].id))
  }, [calculators, selectedDestination, destinations])

  if (destinationSlug) {
    if (destinationLoading || packageLoading) return <div className="container-wide min-h-64 py-16"><LoadingState /></div>
    if (!destinationForDetail) return <div className="container-wide py-16"><EmptyState title="Destination Cost Guide Coming Soon">Travel cost information for this destination is being prepared, or the destination isn’t in the published MAQLAIM TOURS list.</EmptyState><Link to="/travel-guide/travel-cost" className="mt-4 inline-flex min-h-10 items-center gap-2 font-semibold text-sky-800">Back to Travel Cost <ArrowRight size={15} /></Link></div>
    return <div className="min-w-0 overflow-x-hidden bg-white"><SEOHead title={`${destinationName(destinationForDetail)} Travel Cost Guide | MAQLAIM TOURS`} description={`Explore available MAQLAIM TOURS package-based cost estimates and travel package options for ${destinationName(destinationForDetail)}.`} /><section className="relative isolate overflow-hidden bg-navy-950 text-white"><img src={resolveImageUrl(destinationForDetail.image) || HERO_IMAGE} alt={destinationName(destinationForDetail)} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-navy-950/25" aria-hidden="true" /><div className="container-wide relative py-8 sm:py-12"><Breadcrumb light items={[{ label: 'Travel Guide', href: '/guides/travel-tips' }, { label: 'Travel Cost', href: '/travel-guide/travel-cost' }, { label: destinationName(destinationForDetail) }]} /><h1 className="font-display text-4xl font-bold sm:text-5xl">{destinationName(destinationForDetail)} <span className="text-amber-400">Travel Cost</span></h1><p className="mt-3 max-w-2xl text-white/90">Published package data and practical trip-budget guidance for {destinationName(destinationForDetail)}.</p></div></section><TravelCostDetail destination={destinationForDetail} packages={packages} /></div>
  }

  const pageNavigation = [
    { id: 'overview', label: 'Overview', icon: Coins, target: 'overview' },
    { id: 'domestic', label: 'Domestic Travel Cost', icon: MapPin, target: 'destination-costs', filter: 'india' },
    { id: 'international', label: 'International Travel Cost', icon: Globe2, target: 'destination-costs', filter: 'international' },
    { id: 'budget-planning-nav', label: 'Budget Planning', icon: Wallet, target: 'budget-planning' },
    { id: 'travel-type-nav', label: 'Cost by Travel Type', icon: Users, target: 'cost-by-travel-type' },
    { id: 'money-saving-nav', label: 'Money Saving Tips', icon: Sparkles, target: 'money-saving-tips' },
    { id: 'currency-nav', label: 'Currency & Payments', icon: CreditCard, target: 'currency-payments' },
    { id: 'faqs-nav', label: 'FAQs', icon: CircleHelp, target: 'travel-cost-faqs' },
  ]

  const navigateToSection = item => {
    if (item.filter) setActiveFilter(item.filter)
    setActiveNav(item.id)
    window.setTimeout(() => sectionScroll(item.target), 0)
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-navy-900">
      <SEOHead title="Travel Cost & Trip Budget Guide | MAQLAIM TOURS" description="Explore estimated travel costs, destination-wise budgets, accommodation, food, transport and activity expenses with MAQLAIM TOURS's travel cost guide." keywords="travel cost, trip budget, India travel cost, destination travel budget, travel expenses" />
      <section id="overview" className="relative isolate min-h-[290px] overflow-hidden bg-navy-950 text-white sm:min-h-[330px] lg:min-h-[355px]">
        <img src={HERO_IMAGE} alt="Traveler overlooking a mountain valley and lake at sunrise" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/15" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-black/10" aria-hidden="true" />
        <div className="container-wide relative grid min-h-[290px] items-center gap-5 py-7 sm:min-h-[330px] sm:py-9 lg:min-h-[355px] lg:grid-cols-[minmax(0,1fr)_245px]">
          <div className="max-w-3xl"><Breadcrumb light items={[{ label: 'Travel Guide', href: '/guides/travel-tips' }, { label: 'Travel Cost' }]} /><h1 className="font-display text-4xl font-bold leading-[1.04] drop-shadow sm:text-5xl md:text-6xl"><span className="text-white">Travel </span><span className="text-amber-400">Cost</span></h1><p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/95 sm:text-base md:text-lg">Plan your budget better with detailed travel cost information for destinations across India and around the world. Get insights on accommodation, food, transport and activity costs to make your trip affordable and hassle-free.</p></div>
          <div className="relative hidden min-h-44 items-center justify-center lg:flex" aria-hidden="true"><svg className="absolute inset-0 h-full w-full" viewBox="0 0 245 180" fill="none"><path d="M12 150C70 145 74 110 119 106C160 102 170 55 226 48" stroke="white" strokeWidth="2" strokeDasharray="5 7" opacity=".8" /></svg><div className="relative z-10 -rotate-6 text-right font-serif text-3xl font-semibold italic leading-tight text-white drop-shadow-lg">Plan<br />Smart<br /><span className="text-amber-300">Travel Better</span></div><Plane className="absolute bottom-6 right-1 h-8 w-8 rotate-12 text-white" /></div>
        </div>
      </section>

      <nav className="border-b border-orange-100 bg-[#fffaf4] shadow-sm" aria-label="Travel Cost page sections"><div className="container-wide flex gap-2 overflow-x-auto py-2 [scrollbar-width:thin]">{pageNavigation.map(item => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => navigateToSection(item)} aria-current={activeNav === item.id ? 'location' : undefined} className={`flex min-h-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-4 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 sm:min-w-36 sm:text-sm ${activeNav === item.id ? 'bg-orange-100 text-navy-950' : 'text-navy-800 hover:bg-orange-50'}`}><Icon size={21} className="text-orange-800" aria-hidden="true" />{item.label}</button>})}</div></nav>

      <main className="container-wide grid min-w-0 gap-5 py-5 sm:gap-7 sm:py-7 lg:grid-cols-[minmax(0,3fr)_minmax(290px,1fr)] lg:gap-6">
        <div className="min-w-0 space-y-7 sm:space-y-9">
          <section id="destination-costs" className="scroll-mt-36"><SectionHeading icon={MapPin} subtitle="Get an estimated breakdown of travel costs for popular destinations in India and abroad.">Explore Travel Costs by Destination</SectionHeading><div className="mb-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" role="group" aria-label="Filter destination travel cost guides">{FILTERS.map(filter => <button key={filter.id} type="button" onClick={() => { setActiveFilter(filter.id); setActiveNav(filter.id === 'india' ? 'domestic' : filter.id === 'international' ? 'international' : activeNav) }} aria-pressed={activeFilter === filter.id} className={`min-h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${activeFilter === filter.id ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 text-navy-800 hover:bg-orange-50 hover:text-orange-800'}`}>{filter.label}</button>)}</div><DestinationCardGrid destinations={filteredDestinations} packages={packages} loading={destinationLoading || packageLoading} error={destinationError} emptyTitle={activeFilter === 'international' ? 'International Travel Cost Coming Soon' : `${(FILTERS.find(filter => filter.id === activeFilter) || FILTERS[0]).label} Travel Cost Coming Soon`} emptyText={activeFilter === 'international' ? 'International travel cost guides are being prepared. We’ll show verified MAQLAIM TOURS destination and package data when available.' : 'Travel cost information for this category is being prepared. Please check back soon.'} />{activeFilter === 'international' && filteredDestinations.length > 0 && !filteredDestinations.some(destination => getPackageDailyRange(packages, destination)) && <p className="mt-3 text-sm text-navy-600">International destinations are available, but published package cost data is not currently available for these destinations.</p>}</section>
          <CostBreakdown />
          <TravelTypeSection onSelectType={type => { setSelectedType(type === 'backpacking' ? 'budget' : type === 'luxury' ? 'luxury' : 'standard'); sectionScroll('travel-cost-calculator') }} />
          <BudgetPlanning />
          <CurrencyPayments />
          <TravelCostFaqs />
        </div>
        <TravelCostSidebar destinations={destinations} packages={packages} selectedDestination={selectedDestination} onDestinationChange={setSelectedDestination} selectedType={selectedType} onTypeChange={setSelectedType} />
      </main>
    </div>
  )
}
