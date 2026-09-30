import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileText,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Info,
  LoaderCircle,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Stamp,
  UserRoundCheck,
  WalletCards,
} from 'lucide-react'
import api from '../services/api'
import Breadcrumb from '../components/common/Breadcrumb'
import SEOHead from '../components/common/SEOHead'
import { isDestinationListResponse } from '../utils/heritageDestinations'
import { resolveImageUrl } from '../utils/imageUtils'

const IMAGE = (photo, width = 1200, height = 760) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&h=${height}&q=82`
const HERO_IMAGE = IMAGE('photo-1655722724447-2d2a3071e7f8', 2200, 950)

export const COUNTRY_META = {
  uae: { flag: '🇦🇪', region: 'Middle East', displayName: 'UAE (Dubai)' },
  thailand: { flag: '🇹🇭', region: 'Asia', displayName: 'Thailand' },
  japan: { flag: '🇯🇵', region: 'Asia', displayName: 'Japan' },
  switzerland: { flag: '🇨🇭', region: 'Europe', displayName: 'Switzerland' },
  singapore: { flag: '🇸🇬', region: 'Asia', displayName: 'Singapore' },
  malaysia: { flag: '🇲🇾', region: 'Asia', displayName: 'Malaysia' },
  usa: { flag: '🇺🇸', region: 'North America', displayName: 'United States' },
}

export const VISA_TYPES = [
  { title: 'Tourist Visa', text: 'General information for leisure trips, sightseeing and visiting friends or family.', icon: Globe2, color: 'sky' },
  { title: 'Business Visa', text: 'General information for meetings, conferences and trade visits.', icon: BriefcaseBusiness, color: 'amber' },
  { title: 'Student Visa', text: 'General information for education, study programmes and courses abroad.', icon: GraduationCap, color: 'violet' },
  { title: 'Work Visa', text: 'General information for employment and professional assignments.', icon: Stamp, color: 'emerald' },
  { title: 'Transit Visa', text: 'General information for travellers passing through a country en route elsewhere.', icon: Plane, color: 'rose' },
  { title: 'Family Visa', text: 'General information for visiting or joining family members overseas.', icon: HeartHandshake, color: 'orange' },
]

const CHECKLIST_GROUPS = [
  { title: 'Passport & Identity', icon: UserRoundCheck, items: ['Passport and identity details', 'Recent passport-size photographs', 'Completed application form, where required'] },
  { title: 'Travel Documents', icon: Plane, items: ['Travel itinerary', 'Flight reservation or travel details, where required', 'Invitation letter, if applicable'] },
  { title: 'Financial Documents', icon: WalletCards, items: ['Bank statement or proof of funds, where required', 'Sponsor or financial-support documents, if applicable'] },
  { title: 'Accommodation', icon: MapPin, items: ['Accommodation details or booking information, where required'] },
  { title: 'Employment / Education', icon: GraduationCap, items: ['Employment proof or leave confirmation, if requested', 'Student documents or enrolment details, if applicable'] },
  { title: 'Supporting Documents', icon: FileText, items: ['Cover letter or supporting explanation, if requested', 'Travel insurance, if required for the destination or visa category', 'Any additional documents specified by the official authority'] },
]

const APPLICATION_STEPS = [
  { title: 'Choose Destination', text: 'Confirm your destination, travel purpose and intended dates.', icon: MapPin },
  { title: 'Check Visa Requirements', text: 'Use the relevant embassy, consulate or official immigration authority for your nationality and trip.', icon: Search },
  { title: 'Prepare Documents', text: 'Gather only the documents required for your destination and visa category.', icon: FileCheck2 },
  { title: 'Complete Application', text: 'Follow the official application instructions or the process of an authorized visa centre.', icon: FileText },
  { title: 'Pay Applicable Fees', text: 'Check the current fee and accepted payment method with the official source.', icon: WalletCards },
  { title: 'Biometrics / Interview', text: 'Attend an appointment only if the official process requires one.', icon: UserRoundCheck },
  { title: 'Track Application', text: 'Use the official or authorized tracking channel provided after submission.', icon: Clock3 },
  { title: 'Receive Decision', text: 'The government authority makes the decision; approval is never guaranteed.', icon: BadgeCheck },
]

const SIDEBAR_PROCESS = [
  ['Check Visa Requirements', 'Confirm the applicable visa type and current instructions.'],
  ['Prepare Documents', 'Gather documents according to the destination authority.'],
  ['Submit Application', 'Use the official process or an authorized visa centre.'],
  ['Pay Visa Fees', 'Follow current official fee and payment guidance.'],
  ['Track & Receive Decision', 'Check status through the official or authorized system.'],
]

const FAQS = [
  { question: 'What is a tourist visa?', answer: 'A tourist visa is a travel permission category used by some destinations for leisure visits. Its name, scope and eligibility depend on the destination and your circumstances; check the relevant official authority.' },
  { question: 'How do I know if I need a visa?', answer: 'Requirements depend on your nationality, destination, travel purpose and other circumstances. Check the destination’s official embassy, consulate or immigration authority before making travel plans.' },
  { question: 'What documents are generally required?', answer: 'Common examples can include a passport, application form, photographs and supporting travel or financial documents. The exact list varies; use the current checklist from the official authority.' },
  { question: 'How long does visa processing take?', answer: 'There is no universal processing time. It can vary by destination, visa type, applicant circumstances, season, appointment availability and additional checks. Verify the current estimate with the official authority.' },
  { question: 'How much does a visa cost?', answer: 'Fees vary by destination, visa type, applicant category and service channel. Check the current fee schedule with the official embassy, consulate or immigration authority.' },
  { question: 'Can TravelVista guarantee my visa approval?', answer: 'No. TravelVista does not guarantee visa approval. Visa decisions are made by the relevant government, embassy, consulate or immigration authority.' },
  { question: 'Is travel insurance mandatory?', answer: 'Insurance requirements depend on the destination and visa category. Check the applicable official requirements; insurance can also be useful for unexpected travel or medical costs.' },
  { question: 'Where should I verify the latest visa rules?', answer: 'Use the destination country’s official immigration authority, embassy or consulate for your nationality. This page is informational and is not a substitute for official guidance.' },
]

function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function visaSlug(destination) {
  const country = normalize(destination?.country)
  if (country === 'uae' || country === 'united arab emirates') return 'uae'
  return String(destination?.slug || destination?.country || destination?.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function getMeta(destination) {
  const slug = visaSlug(destination)
  const bySlug = COUNTRY_META[slug]
  const byName = COUNTRY_META[normalize(destination?.name).replaceAll(' ', '-')]
  const byCountry = COUNTRY_META[normalize(destination?.country).replaceAll(' ', '-')]
  return bySlug || byName || byCountry || {
    flag: '🌐',
    region: 'Other',
    displayName: destination?.name || destination?.country || 'Destination',
  }
}

function displayDestination(destination) {
  return getMeta(destination).displayName
}

function packageMatchesDestination(pkg, destination) {
  const identity = [destination?.name, destination?.slug, destination?.country]
    .map(normalize)
    .filter(Boolean)
  return [pkg?.destination, pkg?.country]
    .map(normalize)
    .some(value => identity.includes(value))
}

function packagesForDestination(packages, destination) {
  return packages.filter(pkg => packageMatchesDestination(pkg, destination))
}

function formatPackagePrice(price, currency = 'INR') {
  const value = Number(price)
  if (!Number.isFinite(value) || value <= 0) return null
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}

function EmptyState({ children, backLink = true }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center sm:px-8">
      <Info size={34} className="mx-auto text-sky-700" aria-hidden="true" />
      <h2 className="mt-3 font-display text-2xl font-bold text-navy-950">Visa Information Coming Soon</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-navy-700">{children || 'We’re preparing detailed visa information for this destination. Please check the official embassy or immigration website for the latest requirements.'}</p>
      {backLink && <Link to="/travel-guide/visa-information" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-orange-500 px-5 font-semibold text-orange-800 transition-colors hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Back to Visa Information <ArrowRight size={16} aria-hidden="true" /></Link>}
    </div>
  )
}

function VisaPolicyNotice({ compact = false }) {
  return <div className={`flex gap-2 rounded-lg border border-sky-100 bg-sky-50 text-xs leading-relaxed text-sky-950 ${compact ? 'px-3 py-2' : 'p-4 text-sm'}`} role="note"><Info size={compact ? 18 : 21} className="mt-0.5 shrink-0 text-sky-700" aria-hidden="true" /><p>Visa policies may change. We recommend checking the latest requirements with the respective embassy, consulate or official immigration authority before applying.</p></div>
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-2xl font-bold leading-tight text-navy-950 sm:text-3xl">
        {Icon && <Icon size={24} className="mr-2 inline-block -translate-y-0.5 text-orange-600" aria-hidden="true" />}
        {title}
      </h2>
      <span className="mt-2 block h-1 w-12 rounded-full bg-orange-500" aria-hidden="true" />
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-navy-600 sm:text-base">{subtitle}</p>}
    </div>
  )
}

function VisaDestinationCard({ destination, packages }) {
  const [imageFailed, setImageFailed] = useState(false)
  const meta = getMeta(destination)
  const image = resolveImageUrl(destination.image || destination.coverImage)
  const guideSlug = visaSlug(destination)
  const visaPackages = packagesForDestination(packages, destination)
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/travel-guide/visa-information/${encodeURIComponent(guideSlug)}`} aria-label={`View visa information for ${meta.displayName}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
        {image && !imageFailed ? <img src={image} alt={`${meta.displayName} destination`} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-100 to-slate-200 text-sky-800" aria-hidden="true"><Globe2 size={36} /></div>}
      </Link>
      <div className="relative flex flex-1 flex-col px-3 pb-3 pt-6 sm:px-3.5">
        <span role="img" className="absolute -top-4 left-3 inline-flex h-9 min-w-9 items-center justify-center rounded-lg border-2 border-white bg-white px-1 text-2xl shadow" aria-label={`${meta.displayName} flag`}>{meta.flag}</span>
        <h3 className="font-display text-base font-bold leading-tight text-navy-950">{meta.displayName}</h3>
        <p className="mt-1 min-h-9 text-xs leading-relaxed text-navy-700">Visa information · verify current requirements</p>
        <Link to={`/travel-guide/visa-information/${encodeURIComponent(guideSlug)}`} className="mt-2 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-orange-500 px-2 text-xs font-semibold text-orange-800 transition-colors hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">View Visa Info <ArrowRight size={14} aria-hidden="true" /></Link>
        {visaPackages.length > 0 && <Link to={`/packages?destination=${encodeURIComponent(destination.name || destination.country)}`} className="mt-1.5 text-center text-[11px] font-semibold text-sky-800 underline decoration-sky-300 underline-offset-2 hover:text-sky-950">Explore Packages <ChevronRight size={12} className="inline" aria-hidden="true" /></Link>}
      </div>
    </article>
  )
}

function DestinationListing({ destinations, packages, loading, error, search, setSearch, region, setRegion }) {
  const filtered = destinations.filter(destination => {
    const meta = getMeta(destination)
    const query = normalize(search)
    const searchable = normalize(`${displayDestination(destination)} ${destination.country} ${destination.name} ${meta.region}`)
    return (!query || searchable.includes(query))
      && (region === 'all' || meta.region.toLowerCase() === region.toLowerCase())
  })
  const regions = [...new Set(destinations.map(destination => getMeta(destination).region))].sort()
  return (
    <section id="visa-by-destination" className="scroll-mt-36">
      <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0"><h2 className="font-display text-2xl font-bold leading-tight text-navy-950 sm:text-3xl"><Globe2 size={24} className="mr-2 inline-block -translate-y-0.5 text-orange-600" aria-hidden="true" />Popular Destinations</h2><span className="mt-2 block h-1 w-12 rounded-full bg-orange-500" aria-hidden="true" /><p className="mt-2 text-sm leading-relaxed text-navy-600 sm:text-base">Explore visa information for the most visited countries by Indian travelers.</p></div>
      </div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="relative block text-sm font-semibold text-navy-800 sm:flex-1">Search country
          <Search size={17} className="absolute left-3 top-[39px] text-slate-500" aria-hidden="true" />
          <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search country…" className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </label>
        <label className="block text-sm font-semibold text-navy-800 sm:w-44">Region
          <select value={region} onChange={event => setRegion(event.target.value)} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-sky-500"><option value="all">All regions</option>{regions.map(item => <option key={item} value={item}>{item}</option>)}</select>
        </label>
      </div>
      {loading ? <div className="flex min-h-36 items-center justify-center gap-2 text-sm text-navy-600" role="status"><LoaderCircle size={20} className="animate-spin text-sky-700" aria-hidden="true" />Loading published international destinations…</div>
        : error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
          : filtered.length ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">{filtered.map(destination => <VisaDestinationCard key={destination.id || destination.slug} destination={destination} packages={packages} />)}</div>
            : <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center"><Search size={28} className="mx-auto text-slate-500" aria-hidden="true" /><h3 className="mt-3 font-display text-xl font-bold text-navy-900">No Visa Information Found</h3><p className="mt-2 text-sm text-navy-600">Try another country name or region.</p><button type="button" onClick={() => { setSearch(''); setRegion('all') }} className="mt-4 min-h-10 rounded-full bg-orange-500 px-5 font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Clear filters</button></div>}
    </section>
  )
}

function VisaTypesSection() {
  const tones = {
    sky: 'bg-sky-50 text-sky-800 border-sky-100', amber: 'bg-amber-50 text-amber-900 border-amber-100',
    violet: 'bg-violet-50 text-violet-900 border-violet-100', emerald: 'bg-emerald-50 text-emerald-900 border-emerald-100',
    rose: 'bg-rose-50 text-rose-900 border-rose-100', orange: 'bg-orange-50 text-orange-900 border-orange-100',
  }
  return <section id="visa-types" className="scroll-mt-36"><SectionTitle icon={Stamp} title="Types of Visas" subtitle="Different visa categories may be available depending on the destination and purpose of travel. These are general descriptions, not country-specific eligibility guidance." /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">{VISA_TYPES.map(item => { const Icon = item.icon; return <article key={item.title} className={`rounded-xl border p-4 ${tones[item.color]}`}><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80"><Icon size={21} aria-hidden="true" /></span><h3 className="mt-3 font-display text-lg font-bold text-navy-950">{item.title}</h3><p className="mt-1 text-sm leading-relaxed text-navy-700">{item.text}</p></article>})}</div></section>
}

function DocumentChecklist() {
  const [checked, setChecked] = useState({})
  return <section id="document-checklist" className="scroll-mt-36"><SectionTitle icon={FileCheck2} title="Document Checklist" subtitle="Use this as a preparation aid only. Required documents vary by destination, nationality and visa type." /><div className="grid gap-3 sm:grid-cols-2">{CHECKLIST_GROUPS.map(group => { const Icon = group.icon; return <article key={group.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900"><Icon size={20} className="text-sky-700" aria-hidden="true" />{group.title}</h3><ul className="mt-3 space-y-2">{group.items.map(item => { const key = `${group.title}-${item}`; return <li key={item}><label className="flex cursor-pointer items-start gap-2 text-sm leading-relaxed text-navy-700"><input type="checkbox" checked={Boolean(checked[key])} onChange={event => setChecked(current => ({ ...current, [key]: event.target.checked }))} className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-500" /><span>{item}</span></label></li>})}</ul></article>})}</div><p className="mt-3 rounded-lg bg-sky-50 p-3 text-sm font-medium text-sky-950">Required documents vary by destination and visa type. Always follow the official checklist for your application.</p></section>
}

function ApplicationProcessSection() {
  return <section id="application-process" className="scroll-mt-36"><SectionTitle icon={Stamp} title="Application Process" subtitle="A general overview. The relevant authority may use a different process or require additional steps." /><ol className="relative grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{APPLICATION_STEPS.map((step, index) => { const Icon = step.icon; return <li key={step.title} className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-700 font-bold text-white">{index + 1}</span><Icon size={21} className="text-orange-600" aria-hidden="true" /></div><h3 className="mt-3 font-semibold text-navy-900">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-navy-600">{step.text}</p></li>})}</ol></section>
}

function ProcessingFeesSection() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section id="processing-time" className="scroll-mt-36 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle icon={Clock3} title="Processing Time" subtitle="There is no universal processing time." /><p className="text-sm leading-relaxed text-navy-700">Visa processing can vary with destination, visa type, applicant circumstances, season, appointment availability, embassy or consulate workload and additional verification.</p><p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-semibold leading-relaxed text-amber-950">Check the official authority for the latest processing time. Do not make non-refundable plans based on a general estimate.</p></section>
      <section id="visa-fees" className="scroll-mt-36 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle icon={WalletCards} title="Visa Fees & Costs" subtitle="No country-specific fee information is stored in TravelVista." /><ul className="grid gap-2 text-sm text-navy-700 sm:grid-cols-2">{['Visa / application fee', 'Service centre fee', 'Biometrics fee', 'Courier fee', 'Travel insurance', 'Document or translation costs'].map(item => <li key={item} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{item}</li>)}</ul><p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-semibold leading-relaxed text-amber-950">Fees vary by destination, visa type and applicant category. Please verify current fees with the official authority.</p></section>
    </div>
  )
}

function TravelInsuranceSection() {
  const items = ['Medical emergencies', 'Trip cancellation or interruption', 'Baggage issues', 'Travel delays', 'Emergency assistance']
  return <section id="travel-insurance" className="scroll-mt-36 rounded-xl border border-sky-100 bg-sky-50/60 p-5 sm:p-6"><SectionTitle icon={ShieldCheck} title="Travel Insurance" subtitle="Travel insurance may help protect against covered unexpected events during a trip." /><ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{items.map(item => <li key={item} className="flex items-center gap-2 rounded-lg bg-white p-3 text-sm font-medium text-navy-800"><Check size={17} className="text-emerald-700" aria-hidden="true" />{item}</li>)}</ul><p className="mt-4 text-sm leading-relaxed text-navy-700">Coverage, exclusions and eligibility depend on the policy. Insurance requirements also depend on destination and visa type; do not assume it is mandatory everywhere. Check the applicable official requirements and policy wording.</p></section>
}

function VisaFAQs() {
  return <section id="visa-faqs" className="scroll-mt-36"><SectionTitle icon={CircleHelp} title="Visa Information FAQs" /><div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-4">{FAQS.map(item => <details key={item.question} className="group py-3"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-semibold text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 [&::-webkit-details-marker]:hidden">{item.question}<ChevronDown size={18} className="shrink-0 text-sky-700 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-2 pr-8 text-sm leading-relaxed text-navy-600">{item.answer}</p></details>)}</div></section>
}

function VisaSidebar() {
  return <aside className="min-w-0 space-y-4" aria-label="Visa planning information">
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="sidebar-process-heading"><div className="bg-gradient-to-r from-sky-50 to-slate-50 p-4"><h2 id="sidebar-process-heading" className="font-display text-xl font-bold text-navy-950">Visa Application Process</h2><p className="mt-1 text-xs text-navy-600">General steps · check official guidance</p></div><ol className="space-y-4 p-4">{SIDEBAR_PROCESS.map((step, index) => <li key={step[0]} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">{index + 1}</span><span><strong className="block text-sm text-navy-900">{step[0]}</strong><span className="mt-0.5 block text-xs leading-relaxed text-navy-600">{step[1]}</span></span></li>)}</ol><a href="#application-process" className="mx-4 mb-4 inline-flex min-h-10 items-center gap-2 font-semibold text-sky-800 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500">See general steps <ArrowRight size={15} aria-hidden="true" /></a></section>
    <section className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm"><h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-950"><FileCheck2 size={20} className="text-sky-700" aria-hidden="true" />Required Documents (Common)</h2><p className="mt-1 text-xs leading-relaxed text-navy-600">Common examples – actual requirements vary by destination.</p><ul className="mt-3 space-y-2.5">{['Valid passport', 'Completed visa application form', 'Recent passport-size photographs', 'Confirmed or provisional travel details, where required', 'Accommodation details, where required', 'Travel itinerary or cover letter, where required', 'Proof of funds, where required', 'Additional documents based on destination and visa type'].map(item => <li key={item} className="flex gap-2 text-sm leading-relaxed text-navy-700"><Check size={16} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{item}</li>)}</ul><a href="#document-checklist" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-sky-800 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500">Open checklist <ArrowRight size={15} aria-hidden="true" /></a></section>
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h2 className="flex items-center gap-2 font-display text-lg font-bold text-amber-950"><AlertTriangle size={20} className="text-orange-600" aria-hidden="true" />Pro Travel Tip</h2><p className="mt-2 text-sm leading-relaxed text-amber-950">Start checking visa requirements well before your planned travel date. Document requirements and processing times vary by destination, nationality, season and visa category.</p></section>
  </aside>
}

function DetailPackages({ destination, packages }) {
  const matching = packagesForDestination(packages, destination)
  if (!matching.length) return null
  return <section className="mt-6"><h2 className="font-display text-xl font-bold text-navy-950">Explore TravelVista Packages</h2><p className="mt-1 text-sm text-navy-600">Published packages are separate from visa guidance and do not include any visa approval guarantee.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{matching.map(pkg => { const price = formatPackagePrice(pkg.startingPrice, pkg.currency || 'INR'); return <article key={pkg.id || pkg.slug} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold text-navy-900">{pkg.title}</h3><p className="mt-1 text-sm text-navy-600">{pkg.durationDays || '—'} days · {pkg.durationNights ?? '—'} nights</p>{price && <p className="mt-2 font-bold text-sky-800">{price} <span className="text-xs font-normal text-navy-500">package starting price</span></p>}<Link to={pkg.slug ? `/packages/${encodeURIComponent(pkg.slug)}` : `/packages?destination=${encodeURIComponent(destination.name)}`} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-sky-700 px-4 text-sm font-semibold text-sky-800 hover:bg-sky-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500">View Package <ArrowRight size={15} aria-hidden="true" /></Link></article>})}</div></section>
}

function VisaDestinationDetailPage({ destination, packages }) {
  const meta = getMeta(destination)
  const image = resolveImageUrl(destination.image || destination.coverImage) || HERO_IMAGE
  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead title={`${meta.displayName} Visa Information | TravelVista`} description={`General visa information guide for ${meta.displayName}. Verify current requirements with the official embassy, consulate or immigration authority.`} />
      <section className="relative isolate overflow-hidden bg-navy-950 text-white"><img src={image} alt={`${meta.displayName} travel destination`} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-navy-950/25" aria-hidden="true" /><div className="container-wide relative py-8 sm:py-12"><Breadcrumb light items={[{ label: 'Travel Guide', href: '/guides/travel-tips' }, { label: 'Visa Information', href: '/travel-guide/visa-information' }, { label: meta.displayName }]} /><div className="flex items-center gap-3">        <span role="img" className="rounded-full bg-white/95 px-3 py-2 text-3xl" aria-label={`${meta.displayName} flag`}>{meta.flag}</span><div><p className="text-sm font-semibold text-white/80">{meta.region}</p><h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">{meta.displayName} <span className="text-amber-400">Visa Information</span></h1></div></div><p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">General information only. TravelVista is not an embassy, consulate or immigration authority and does not guarantee visa approval.</p></div></section>
      <main className="container-wide grid min-w-0 gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-9"><div className="min-w-0"><div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950" role="note"><AlertTriangle size={19} className="mr-2 inline -translate-y-0.5" aria-hidden="true" />Visa policies may change. Please verify the latest requirement with the official embassy, consulate or immigration authority before applying.</div><div className="mt-5"><EmptyState backLink={false}>We’re preparing detailed visa information for this destination. Please check the official embassy or immigration website for the latest requirements.</EmptyState></div><section id="official-sources" className="mt-5 rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-display text-xl font-bold text-navy-950">Check Official Requirements</h2><p className="mt-2 text-sm leading-relaxed text-navy-700">For current information, locate the destination country’s official immigration authority or the embassy/consulate responsible for your nationality. Confirm visa eligibility, document rules, fees, processing guidance and entry conditions directly with that source.</p><p className="mt-3 text-xs leading-relaxed text-navy-500">No government service or visa application is provided on this page. No government link is shown here because verified official-source URLs are not stored in TravelVista’s current data.</p></section><DetailPackages destination={destination} packages={packages} /><Link to="/travel-guide/visa-information" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-orange-500 px-5 font-semibold text-orange-800 hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"><ArrowRight size={16} className="rotate-180" aria-hidden="true" />Back to Visa Information</Link></div><aside className="min-w-0 space-y-4"><section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-display text-lg font-bold text-navy-900">General Checklist</h2><p className="mt-1 text-xs text-navy-600">Not a destination-specific requirement list.</p><ul className="mt-3 space-y-2">{['Check passport validity', 'Confirm the correct visa category', 'Use the official document checklist', 'Verify fees and processing time'].map(item => <li key={item} className="flex gap-2 text-sm text-navy-700"><Check size={16} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{item}</li>)}</ul></section><section className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h2 className="font-display text-lg font-bold text-amber-950">Important</h2><p className="mt-2 text-sm leading-relaxed text-amber-950">Visa decisions are made only by the relevant government authority. TravelVista cannot guarantee approval or replace official advice.</p></section></aside></main>
    </div>
  )
}

export default function VisaInformationPage() {
  const { countrySlug } = useParams()
  const [destinations, setDestinations] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [activeNav, setActiveNav] = useState('overview')

  useEffect(() => {
    let active = true
    Promise.allSettled([api.get('/destinations?status=published'), api.get('/packages?status=published')])
      .then(([destinationResult, packageResult]) => {
        if (!active) return
        if (destinationResult.status !== 'fulfilled' || !isDestinationListResponse(destinationResult.value.data)) {
          setDestinations([])
          setError('Unable to load published international destinations right now. Please try again later.')
          return
        }
        setDestinations(destinationResult.value.data.filter(destination => normalize(destination.country) !== 'india' || String(destination.type || '').toLowerCase() === 'international'))
        setPackages(packageResult.status === 'fulfilled' && Array.isArray(packageResult.value.data) ? packageResult.value.data : [])
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const internationalDestinations = useMemo(() => destinations.filter(destination => {
    const isIndia = normalize(destination.country) === 'india'
    return !isIndia && (String(destination.type || '').toLowerCase() === 'international' || Boolean(destination.country))
  }), [destinations])

  const selectedDestination = countrySlug ? internationalDestinations.find(destination => {
    const names = [visaSlug(destination), destination.slug, destination.name, destination.country]
    return names.some(name => normalize(name).replaceAll(' ', '-') === normalize(countrySlug).replaceAll(' ', '-'))
  }) : null

  if (countrySlug) {
    if (loading) return <div className="container-wide flex min-h-64 items-center justify-center gap-3 py-16 text-navy-600" role="status"><LoaderCircle size={23} className="animate-spin text-sky-700" aria-hidden="true" />Loading destination guide…</div>
    if (!selectedDestination) return <div className="container-wide py-12"><SEOHead title="Visa Information Coming Soon | TravelVista" description="Visa destination guide not found in published TravelVista destinations. Please verify requirements through official sources." /><EmptyState>The destination is not in the current published international TravelVista list. Please check the official embassy or immigration website for the latest requirements.</EmptyState></div>
    return <VisaDestinationDetailPage destination={selectedDestination} packages={packages} />
  }

  const pageNavigation = [
    { id: 'overview', label: 'Overview', icon: Info, target: 'overview' },
    { id: 'destinations-nav', label: 'Visa by Destination', icon: Globe2, target: 'visa-by-destination' },
    { id: 'documents-nav', label: 'Document Checklist', icon: FileCheck2, target: 'document-checklist' },
    { id: 'process-nav', label: 'Application Process', icon: Stamp, target: 'application-process' },
    { id: 'processing-nav', label: 'Processing Time', icon: Clock3, target: 'processing-time' },
    { id: 'fees-nav', label: 'Fees & Costs', icon: WalletCards, target: 'visa-fees' },
    { id: 'insurance-nav', label: 'Travel Insurance', icon: ShieldCheck, target: 'travel-insurance' },
    { id: 'faqs-nav', label: 'FAQs', icon: CircleHelp, target: 'visa-faqs' },
  ]
  const navigateToSection = item => {
    setActiveNav(item.id)
    if (item.id === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-white text-navy-900">
      <SEOHead title="Visa Information & International Travel Guide | TravelVista" description="Explore general visa information, document checklists, application steps, processing guidance and international travel tips with TravelVista." keywords="visa information, travel visa guide, visa documents, visa application steps, international travel guide" />
      <section id="overview" className="relative isolate min-h-[245px] overflow-hidden bg-navy-950 text-white sm:min-h-[230px] lg:min-h-[198px]"><img src={HERO_IMAGE} alt="Passport and travel documents prepared for an international journey" className="absolute inset-0 h-full w-full object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/65 to-navy-950/15" aria-hidden="true" /><div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-black/10" aria-hidden="true" /><div className="relative mx-auto grid min-h-[245px] w-full max-w-[1500px] items-center gap-5 px-4 py-5 sm:min-h-[230px] sm:px-6 sm:py-5 lg:min-h-[198px] lg:grid-cols-[minmax(0,1fr)_250px] lg:px-8"><div className="max-w-3xl"><Breadcrumb light items={[{ label: 'Travel Guide', href: '/guides/travel-tips' }, { label: 'Visa Information' }]} /><h1 className="font-display text-4xl font-bold leading-[1.04] drop-shadow sm:text-5xl md:text-6xl"><span className="text-white">Visa </span><span className="text-amber-400">Information</span></h1><p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/95 sm:text-base">Your complete guide to visa requirements, application process, documentation and travel tips for international travel.</p></div><div className="relative hidden min-h-36 items-center justify-center lg:flex" aria-hidden="true"><svg className="absolute inset-0 h-full w-full" viewBox="0 0 250 150" fill="none"><path d="M8 125C68 120 75 90 121 86C164 82 176 46 234 38" stroke="white" strokeWidth="2" strokeDasharray="5 7" opacity=".8" /></svg><div className="relative z-10 -rotate-6 text-right font-serif text-2xl font-semibold italic leading-tight text-white drop-shadow-lg">Explore<br /><span className="text-amber-300">the World</span><br />Hassle Free</div><Plane className="absolute bottom-4 right-1 h-8 w-8 rotate-12 text-white" /></div></div></section>
      <nav className="border-b border-orange-100 bg-[#fffaf4] shadow-sm" aria-label="Visa Information page sections"><div className="mx-auto flex w-full max-w-[1500px] gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:thin] sm:px-6 lg:px-8">{pageNavigation.map(item => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => navigateToSection(item)} aria-current={activeNav === item.id ? 'location' : undefined} className={`flex min-h-[60px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-4 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 sm:min-w-36 sm:text-sm ${activeNav === item.id ? 'bg-orange-100 text-navy-950' : 'text-navy-800 hover:bg-orange-50'}`}><Icon size={21} className="text-orange-800" aria-hidden="true" />{item.label}</button>})}</div></nav>
      <main className="mx-auto grid w-full max-w-[1500px] min-w-0 gap-5 px-4 py-4 sm:gap-6 sm:px-6 sm:py-5 lg:grid-cols-[minmax(0,3fr)_minmax(290px,1fr)] lg:gap-6 lg:px-8"><div className="min-w-0 space-y-4 sm:space-y-5">
        <section id="understand-requirements" className="scroll-mt-36"><SectionTitle icon={Info} title="Understand Visa Requirements" subtitle="Find accurate and up-to-date visa information for popular international destinations. Learn about visa types, required documents, application process, fees and useful travel tips to make your journey smooth and stress-free." /></section>
        <VisaPolicyNotice />
        <DestinationListing destinations={internationalDestinations} packages={packages} loading={loading} error={error} search={search} setSearch={setSearch} region={region} setRegion={setRegion} />
        <VisaTypesSection />
        <DocumentChecklist />
        <ApplicationProcessSection />
        <ProcessingFeesSection />
        <TravelInsuranceSection />
        <VisaFAQs />
      </div><VisaSidebar /></main>
    </div>
  )
}
