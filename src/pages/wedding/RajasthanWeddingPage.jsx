import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Camera, CarFront, Castle, Check, CheckCircle2,
  ConciergeBell, Diamond, Heart, MapPin, Plane, ShieldCheck, Sparkles, Star,
  Users, Utensils, LoaderCircle,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const WEDDING_ROUTE = '/destination-weddings/india/rajasthan'
const WEDDING_LIST_ROUTE = '/destination-weddings/india'
const weddingDestinationRoute = city => ['udaipur', 'jaipur', 'jodhpur'].includes(city.toLowerCase())
  ? `/destination-weddings/india/${city.toLowerCase()}`
  : WEDDING_ROUTE


const FEATURES = [
  { icon: Castle, label: 'Royal Venues' },
  { icon: Camera, label: 'Pre-Wedding Shoots' },
  { icon: Users, label: 'Customizable Packages' },
  { icon: Utensils, label: 'Traditional Rajasthani Cuisine' },
  { icon: Sparkles, label: 'Cultural Performances' },
  { icon: CarFront, label: 'Guest Travel & Stay' },
  { icon: ShieldCheck, label: 'Complete Wedding Support' },
]

const DESTINATIONS = [
  {
    name: 'Udaipur', subtitle: 'City of Lakes & Royal Palaces', path: weddingDestinationRoute('Udaipur'),
    image: 'https://images.unsplash.com/photo-1695956353120-54ce5e91632b?auto=format&fit=crop&w=720&h=360&q=85',
    alt: 'Royal lakeside palace and mountains in Udaipur',
    features: ['Luxury Palaces & Lake View', 'Perfect for Grand Weddings', 'Most Popular Choice'],
  },
  {
    name: 'Jaipur', subtitle: 'The Royal Pink City', path: weddingDestinationRoute('Jaipur'),
    image: 'https://images.unsplash.com/photo-1706961121783-4ae6c933983a?auto=format&fit=crop&w=720&h=360&q=85',
    alt: 'Amber fort and royal pink sandstone architecture in Jaipur',
    features: ['Magnificent Forts & Palaces', 'Royal Heritage Venues', 'Vibrant Cultural Experience'],
  },
  {
    name: 'Jodhpur', subtitle: 'The Blue City', path: weddingDestinationRoute('Jodhpur'),
    image: 'https://images.unsplash.com/photo-1580389672842-9755d100d18e?auto=format&fit=crop&w=720&h=360&q=85',
    alt: 'Mehrangarh Fort above the blue city of Jodhpur',
    features: ['Majestic Fort Venues', 'Royal & Intimate Weddings', 'Stunning City Views'],
  },
  {
    name: 'Jaisalmer', subtitle: 'The Golden City', path: weddingDestinationRoute('Jaisalmer'),
    image: 'https://plus.unsplash.com/premium_photo-1661963285656-f91dff9f6566?auto=format&fit=crop&w=720&h=360&q=85',
    alt: 'Golden sandstone Jaisalmer fort rising above the desert',
    features: ['Desert Wedding Experience', 'Forts & Sand Dunes', 'Unique & Luxury Celebrations'],
  },
  {
    name: 'Pushkar', subtitle: 'Spiritual & Scenic', path: weddingDestinationRoute('Pushkar'),
    image: 'https://plus.unsplash.com/premium_photo-1726863214898-0b11a43f4bbe?auto=format&fit=crop&w=720&h=360&q=85',
    alt: 'Heritage architecture beside a tranquil Rajasthan lake',
    features: ['Lakeside Wedding Venues', 'Traditional & Royal Setup', 'Peaceful & Sacred Ambience'],
  },
]

const EXPERIENCES = [
  { title: 'Royal Palace Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=680&h=340&q=85', alt: 'Elegant palace wedding celebration with warm lights' },
  { title: 'Fort Wedding', image: 'https://plus.unsplash.com/premium_photo-1697730388194-0f8f7943dbad?auto=format&fit=crop&w=680&h=340&q=85', alt: 'Mehrangarh Fort rising above Jodhpur at twilight' },
  { title: 'Desert Wedding', image: 'https://images.unsplash.com/photo-1529391513378-1584fdfe933f?auto=format&fit=crop&w=680&h=340&q=85', alt: 'Desert camp tents in the warm evening light' },
  { title: 'Lakeside Wedding', image: 'https://images.unsplash.com/photo-1695956353120-54ce5e91632b?auto=format&fit=crop&w=680&h=340&q=85', alt: 'City Palace beside Lake Pichola in Udaipur' },
  { title: 'Intimate Wedding', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=680&h=340&q=85', alt: 'Intimate outdoor wedding dinner beneath warm lights' },
]

const WHY_RAJASTHAN = [
  'Majestic palaces, forts and heritage venues',
  'Royal and cultural wedding experience',
  'Customizable wedding packages',
  'Pre-wedding shoot locations',
  'Traditional Rajasthani cuisine',
  'Complete travel, stay and event support',
  'Memorable and unique celebrations',
]

const SERVICE_BENEFITS = [
  { icon: Diamond, title: 'Luxury Stay', detail: 'Premium hotels & palaces' },
  { icon: CarFront, title: 'Travel Arrangements', detail: 'For you and your guests' },
  { icon: ConciergeBell, title: 'Food & Catering', detail: 'Authentic Rajasthani cuisine' },
  { icon: Camera, title: 'Photography & Videography', detail: 'Capture your special moments' },
  { icon: Users, title: 'Event Planning', detail: 'End-to-end wedding support' },
]

const FIELD_CLASS = 'mt-1 w-full min-w-0 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-navy-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:text-sm'
const today = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function RajasthanWeddingPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ destination: '', guests: '', style: '', date: '', name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
  const [status, setStatus] = useState('form')
  const [contactOpen, setContactOpen] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => {
    setForm(previous => ({ ...previous, [field]: value }))
    if (status === 'error') setStatus('form')
    setError('')
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (status === 'submitting') return
    const missingField = [
      ['destination', 'Please select a wedding destination.'],
      ['guests', 'Please select an estimated guest count.'],
      ['style', 'Please select a wedding style.'],
      ['date', 'Please select your preferred date.'],
    ].find(([field]) => !form[field])
    if (missingField) {
      setError(missingField[1])
      return
    }
    if (form.date < today()) {
      setError('Preferred date cannot be in the past.')
      return
    }
    if (!form.name.trim()) {
      setContactOpen(true)
      setError('Please add your name and a way for our wedding team to contact you.')
      return
    }
    if (!(form.email.trim() || form.phone.trim())) {
      setContactOpen(true)
      setError('Please provide an email address or phone number so our team can contact you.')
      return
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (form.phone.trim() && !/^[+\d][\d\s()-]{6,19}$/.test(form.phone.trim())) {
      setError('Please enter a valid phone number.')
      return
    }

    setStatus('submitting')
    setError('')
    const guestCount = { 'Below 50': 25, '50–100': 75, '100–200': 150, '200–500': 350, '500+': 500 }[form.guests]
    try {
      await api.post('/leads/public/submit', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        destination: form.destination,
        travelDate: form.date,
        travelers: guestCount,
        leadType: 'destination-wedding',
        sourceUrl: window.location.pathname,
        message: `Rajasthan wedding quote request. Destination: ${form.destination}. Guest count: ${form.guests}. Wedding style: ${form.style}. Preferred date: ${form.date}.`,
      })
      setStatus('success')
    } catch (submitError) {
      setError(submitError.response?.data?.error || 'We could not send your quote request. Please try again.')
      setStatus('error')
    }
  }

  return <div className="min-w-0 overflow-x-hidden bg-white text-navy-900">
    <SEOHead title="Rajasthan Destination Weddings | MAQLAIM TOURS" description="Plan a royal Rajasthan destination wedding with palace venues, cultural experiences, guest travel and personalized wedding support from MAQLAIM TOURS." />

    <section className="relative isolate min-h-[290px] overflow-hidden bg-navy-950 text-white sm:min-h-[310px] lg:min-h-[276px]" aria-labelledby="rajasthan-wedding-title">
      <img src="https://images.unsplash.com/photo-1695956353120-54ce5e91632b?auto=format&fit=crop&w=1900&h=700&q=88" alt="Udaipur City Palace glowing beside Lake Pichola at golden hour" loading="eager" className="absolute inset-0 h-full w-full object-cover object-center" />
      <img src="https://images.unsplash.com/photo-1599462616558-2b75fd26a283?auto=format&fit=crop&w=900&h=700&q=85" alt="Bride and groom in traditional Indian wedding attire" loading="eager" className="absolute inset-y-0 right-0 hidden h-full w-[43%] object-cover object-center lg:block" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/15" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[290px] max-w-8xl items-center px-4 py-6 sm:min-h-[310px] sm:px-6 lg:min-h-[276px] lg:px-8">
        <div className="max-w-[590px]">
          <Breadcrumb light items={[{ label: 'Destination Weddings', href: WEDDING_LIST_ROUTE }, { label: 'Rajasthan Wedding' }]} />
          <h1 id="rajasthan-wedding-title" className="font-display text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-[3.5rem]">Rajasthan<br /><span className="text-orange-400">Wedding</span></h1>
          <p className="mt-2 text-base font-semibold sm:text-lg">A Royal Celebration of Love</p>
          <p className="mt-2 max-w-[480px] text-sm leading-snug text-white/95 sm:text-[15px]">Turn your special day into an unforgettable experience with Rajasthan’s royal charm, majestic palaces, vibrant traditions and breathtaking venues. Plan your dream wedding in the land of kings with Maqlaim Tours.</p>
        </div>
        <div className="pointer-events-none absolute right-7 top-1/2 hidden -translate-y-1/2 rotate-[-5deg] text-right font-display text-2xl italic leading-tight text-white drop-shadow-lg xl:block" aria-hidden="true">
          <span>Royal Weddings<br />Timeless<br />Memories</span>
          <span className="mt-2 flex items-center justify-end gap-2 text-orange-200"><span className="w-14 border-b border-dashed border-white/80" /><Heart size={20} /><Plane size={20} /></span>
        </div>
      </div>
    </section>

    <section aria-label="Rajasthan wedding services" className="border-b border-gray-100 bg-white">
      <div className="mx-auto grid max-w-8xl grid-cols-2 gap-y-3 px-3 py-3 sm:grid-cols-4 lg:flex lg:justify-between lg:gap-1 lg:px-8">
        {FEATURES.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-0 flex-col items-center justify-center gap-1 border-r border-slate-100 px-2 text-center last:border-0 sm:px-3 lg:min-w-0 lg:flex-1">
          <Icon size={22} strokeWidth={2.4} className="text-amber-700" aria-hidden="true" /><span className="text-[11px] font-medium leading-tight text-navy-800 sm:text-xs">{label}</span>
        </div>)}
      </div>
    </section>

    <div className="mx-auto grid max-w-8xl grid-cols-1 items-start gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(300px,1fr)] lg:gap-5 lg:px-8 lg:py-2">
      <main className="min-w-0 space-y-2">
        <section aria-labelledby="wedding-destinations-title">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <div>
              <h2 id="wedding-destinations-title" className="font-display text-xl font-bold leading-tight text-navy-900 sm:text-2xl">Popular Wedding Destinations in <span className="text-orange-600">Rajasthan</span></h2>
              <p className="mt-0.5 text-xs text-navy-700 sm:text-sm">From grand palaces to heritage forts, explore the most sought-after wedding destinations in Rajasthan.</p>
            </div>
            <Link to={WEDDING_LIST_ROUTE} className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 hover:text-orange-800 sm:text-sm">View All Wedding Destinations <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-2.5 grid grid-cols-1 gap-2.5 min-[460px]:grid-cols-2 xl:grid-cols-5">
            {DESTINATIONS.map(destination => <article key={destination.name} className="group min-w-0 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <Link to={destination.path} aria-label={`View ${destination.name} wedding details`} className="block h-[118px] overflow-hidden bg-slate-100 sm:h-[105px] xl:h-[106px]">
                <img src={destination.image} alt={destination.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </Link>
              <div className="flex h-[148px] flex-col px-2.5 pb-2 pt-1.5">
                <h3 className="font-display text-base font-bold leading-tight text-navy-900">{destination.name}</h3>
                <p className="text-[11px] leading-tight text-navy-700">{destination.subtitle}</p>
                <ul className="mt-1.5 flex-1 space-y-1">
                  {destination.features.map((feature, index) => <li key={feature} className="flex items-start gap-1.5 text-[10px] leading-tight text-navy-800 sm:text-[11px]">
                    {index === 0 ? <MapPin size={12} className="mt-px shrink-0 text-navy-800" /> : index === 1 ? <Users size={12} className="mt-px shrink-0 text-navy-800" /> : <Star size={12} className="mt-px shrink-0 fill-current text-navy-800" />}{feature}
                  </li>)}
                </ul>
                <Link to={destination.path} className="mt-1 flex min-h-7 items-center justify-center gap-1 rounded border border-orange-500 px-2 py-1 text-[11px] font-medium text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300">View Details <ArrowRight size={13} /></Link>
              </div>
            </article>)}
          </div>
        </section>

        <section aria-labelledby="wedding-experiences-title" className="pt-1">
          <h2 id="wedding-experiences-title" className="font-display text-xl font-bold leading-tight text-navy-900 sm:text-2xl">Types of Rajasthan Wedding <span className="text-orange-600">Experiences</span></h2>
          <p className="mt-0.5 text-xs text-navy-700 sm:text-sm">Choose the perfect wedding style to match your vision and create lifelong memories.</p>
          <div className="mt-2 grid grid-cols-2 gap-2.5 min-[540px]:grid-cols-3 xl:grid-cols-5">
            {EXPERIENCES.map(experience => <article key={experience.title} className="group min-w-0 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
              <div className="h-[100px] overflow-hidden bg-slate-100 sm:h-[112px]"><img src={experience.image} alt={experience.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
              <h3 className="px-2.5 py-1.5 font-display text-xs font-bold leading-tight text-navy-900 sm:text-sm">{experience.title}</h3>
            </article>)}
          </div>
        </section>
      </main>

      <aside className="min-w-0 space-y-2.5 lg:sticky lg:top-28 lg:self-start">
        <section className="overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm" aria-labelledby="wedding-quote-title">
          <div className="flex items-center gap-2 bg-sky-50 px-3 py-2">
            <Castle size={27} className="shrink-0 text-amber-700" aria-hidden="true" />
            <div><h2 id="wedding-quote-title" className="font-display text-base font-bold leading-tight text-navy-900 sm:text-lg">Plan Your Rajasthan Wedding</h2><p className="text-[11px] leading-tight text-navy-800">Get a customized wedding plan with the best venues, packages and services.</p></div>
          </div>
          {status === 'success' ? <div className="p-5 text-center" role="status"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700"><Check size={25} /></span><h3 className="mt-2 font-display text-lg font-bold text-navy-900">Quote request received</h3><p className="mt-1 text-sm text-navy-700">Thank you. Our wedding expert will contact you shortly.</p><button type="button" onClick={() => { setStatus('form'); setForm(previous => ({ ...previous, destination: '', guests: '', style: '', date: '' })) }} className="mt-3 text-sm font-semibold text-orange-700 underline">Send another request</button></div> : <form onSubmit={handleSubmit} className="space-y-2 p-2.5">
            {error && <div role="alert" className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">{error}</div>}
            {status === 'error' && <p className="sr-only" role="status">Submission failed. Correct the error and retry.</p>}
            <div className="grid grid-cols-1 gap-x-3 gap-y-2 min-[420px]:grid-cols-2">
              <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Wedding Destination<select className={FIELD_CLASS} value={form.destination} onChange={event => update('destination', event.target.value)} required aria-label="Wedding Destination"><option value="">Select Destination</option>{['Udaipur', 'Jaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Other'].map(option => <option key={option}>{option}</option>)}</select></label>
              <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Guest Count<select className={FIELD_CLASS} value={form.guests} onChange={event => update('guests', event.target.value)} required aria-label="Guest Count"><option value="">Select Guests</option>{['Below 50', '50–100', '100–200', '200–500', '500+'].map(option => <option key={option}>{option}</option>)}</select></label>
              <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Wedding Style<select className={FIELD_CLASS} value={form.style} onChange={event => update('style', event.target.value)} required aria-label="Wedding Style"><option value="">Select Style</option>{['Royal Palace Wedding', 'Fort Wedding', 'Desert Wedding', 'Lakeside Wedding', 'Intimate Wedding', 'Custom Wedding'].map(option => <option key={option}>{option}</option>)}</select></label>
              <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Preferred Date<input className={FIELD_CLASS} type="date" min={today()} value={form.date} onChange={event => update('date', event.target.value)} required /></label>
            </div>
            <details open={contactOpen} onToggle={event => setContactOpen(event.currentTarget.open)} className="rounded border border-slate-100 px-2.5 py-1.5 text-xs">
              <summary className="cursor-pointer font-medium text-navy-700">Contact details (required)</summary>
              <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-2 min-[420px]:grid-cols-2">
                <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs min-[420px]:col-span-2">Your Name<input className={FIELD_CLASS} type="text" autoComplete="name" value={form.name} onChange={event => update('name', event.target.value)} placeholder="Full name" /></label>
                <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Email<input className={FIELD_CLASS} type="email" autoComplete="email" value={form.email} onChange={event => update('email', event.target.value)} placeholder="Email address" /></label>
                <label className="min-w-0 text-[11px] font-medium text-navy-800 sm:text-xs">Phone<input className={FIELD_CLASS} type="tel" autoComplete="tel" value={form.phone} onChange={event => update('phone', event.target.value)} placeholder="Phone number" /></label>
              </div>
              <p className="mt-1 text-[10px] text-navy-500">Share an email or phone number so our wedding planner can reach you.</p>
            </details>
            <button type="submit" disabled={status === 'submitting'} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65">{status === 'submitting' ? <><LoaderCircle size={17} className="animate-spin" />Sending Request...</> : <>Get a Free Quote <ArrowRight size={16} /></>}</button>
          </form>}
        </section>

        <section className="overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm" aria-labelledby="why-rajasthan-title">
          <h2 id="why-rajasthan-title" className="flex items-center gap-2 bg-slate-50 px-3 py-2 font-display text-base font-bold leading-tight text-navy-900 sm:text-lg"><Star size={20} className="fill-amber-500 text-amber-500" />Why Choose Rajasthan for Your Wedding?</h2>
          <ul className="space-y-1 px-3 py-2.5">{WHY_RAJASTHAN.map(reason => <li key={reason} className="flex items-start gap-2 text-xs leading-snug text-navy-800 sm:text-sm"><CheckCircle2 size={15} className="mt-px shrink-0 fill-green-600 text-green-600 [&>path:last-child]:stroke-white" />{reason}</li>)}</ul>
        </section>
      </aside>
    </div>

    <section aria-label="Wedding planning services" className="mx-3 mb-4 rounded-lg bg-[#fff9ed] px-3 py-3 sm:mx-5 lg:mx-auto lg:mb-5 lg:max-w-8xl lg:px-5">
      <div className="grid grid-cols-1 divide-y divide-orange-100 min-[500px]:grid-cols-2 min-[500px]:divide-y-0 lg:grid-cols-5">
        {SERVICE_BENEFITS.map(({ icon: Icon, title, detail }) => <div key={title} className="flex min-w-0 items-center justify-center gap-3 px-2 py-2 min-[500px]:justify-start lg:border-r lg:border-orange-100 lg:last:border-0">
          <Icon size={34} strokeWidth={2.2} className="shrink-0 text-orange-500" aria-hidden="true" /><div className="min-w-0"><h2 className="font-display text-sm font-bold leading-tight text-navy-900">{title}</h2><p className="text-[11px] leading-tight text-navy-700">{detail}</p></div>
        </div>)}
      </div>
    </section>
  </div>
}
