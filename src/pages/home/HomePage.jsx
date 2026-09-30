import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronLeft, ChevronRight,
  Compass, CreditCard, Headphones, Hotel, Map, MapPin, Plane, Search, ShieldCheck,
  Sparkles, Star, Ticket, Users, Wallet, Waves,
} from 'lucide-react'
import api from '../../services/api'
import ComingSoon from '../../components/common/ComingSoon'

const FEATURED_DESTINATIONS = [
  { name: 'Gujarat', slug: 'gujarat', route: '/gujarat', tags: 'Culture · Heritage · Wildlife', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=520&fit=crop', alt: 'Coastal heritage and landscape in Gujarat' },
  { name: 'Rajasthan', slug: 'rajasthan', route: '/rajasthan', tags: 'Forts · Palaces · Desert', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=520&fit=crop', alt: 'Historic palace and fort in Rajasthan' },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', route: '/himachal-pradesh', tags: 'Mountains · Adventure · Nature', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=520&fit=crop', alt: 'Snow-capped Himalayan mountains in Himachal Pradesh' },
  { name: 'Karnataka', slug: 'karnataka', route: '/karnataka', tags: 'Temples · Hills · Beaches', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=520&fit=crop', alt: 'Historic stone temple in Karnataka' },
  { name: 'Kerala', slug: 'kerala', route: '/kerala', tags: 'Backwaters · Beaches · Ayurveda', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=520&fit=crop', alt: 'Traditional houseboat on the Kerala backwaters' },
]

const SERVICE_TABS = [
  { id: 'packages', label: 'Packages', icon: Ticket, action: 'Search Packages' },
  { id: 'hotels', label: 'Hotels', icon: Hotel, action: 'Search Hotels' },
  { id: 'activities', label: 'Activities', icon: Compass, action: 'Find Activities' },
  { id: 'flights', label: 'Flights', icon: Plane, action: 'Ask About Flights' },
]

const TRUST_FEATURES = [
  { icon: Sparkles, title: 'Curated Tour Packages', detail: 'Handpicked experiences' },
  { icon: Wallet, title: 'Best Price Guarantee', detail: 'Value for your money' },
  { icon: Headphones, title: '24/7 Customer Support', detail: 'Always here to help' },
  { icon: ShieldCheck, title: 'Safe & Secure Travel', detail: 'Your safety, our priority' },
  { icon: Users, title: 'Expert Travel Guides', detail: 'Local insights & experiences' },
  { icon: Check, title: 'Easy Booking Process', detail: 'Plan your trip in minutes' },
]

const WHY_TRAVEL = [
  { icon: Map, title: 'Personalized Itineraries', detail: 'Trips tailored to your interests', color: 'text-blue-600' },
  { icon: Users, title: 'Trusted Travel Experts', detail: 'Local knowledge & expert guidance', color: 'text-sky-600' },
  { icon: CreditCard, title: 'Value for Money', detail: 'Best deals without compromising quality', color: 'text-emerald-600' },
  { icon: CalendarDays, title: 'Hassle-Free Planning', detail: 'End-to-end support from booking to travel', color: 'text-cyan-600' },
  { icon: Star, title: 'Memorable Experiences', detail: 'Create stories that last a lifetime', color: 'text-orange-500' },
]

const OFFER_INSPIRATION = [
  { title: 'Himachal Escapes', detail: 'Mountain air, scenic trails and slow mornings', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&h=640&fit=crop', alt: 'Mountain trekking trail in Himachal Pradesh' },
  { title: 'Goa Beach Holidays', detail: 'Make room for sunshine, sand and sea', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&h=640&fit=crop', alt: 'Palm-lined beach in Goa' },
  { title: 'Rajasthan Heritage Tours', detail: 'Discover royal forts and desert sunsets', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000&h=640&fit=crop', alt: 'Rajasthan palace glowing in the evening sun' },
]

const HERO_IMAGE = 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=2200&h=1200&fit=crop'
const HERO_TRAVELER_IMAGE = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1100&h=1300&fit=crop'
const CTA_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2200&h=900&fit=crop'

const ReviewMap = globalThis.Map

const unwrapList = (response) => {
  const data = response?.data
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.packages)) return data.packages
  if (Array.isArray(data?.destinations)) return data.destinations
  return []
}

const isPublished = (record) => !record?.status || String(record.status).toLowerCase() === 'published'
const normalized = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')

function SectionHeading({ eyebrow, children, action, to }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-7">
      <div>
        <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-600">{eyebrow}</p>
        <h2 className="font-display text-3xl font-bold leading-tight text-[#003B73] sm:text-4xl">{children}</h2>
      </div>
      {action && to && (
        <Link to={to} className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-[#003B73] transition-colors hover:text-orange-600 sm:self-auto">
          {action}<ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const reviewTrack = useRef(null)
  const [packages, setPackages] = useState([])
  const [destinations, setDestinations] = useState([])
  const [reviews, setReviews] = useState([])
  const [packagesLoading, setPackagesLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('packages')
  const [destination, setDestination] = useState('')
  const [travelDate, setTravelDate] = useState('')
  const [travelers, setTravelers] = useState('1')
  const [reviewPage, setReviewPage] = useState(0)
  const [reviewsPerPage, setReviewsPerPage] = useState(3)

  useEffect(() => {
    let mounted = true
    Promise.allSettled([
      api.get('/packages', { params: { status: 'published' } }),
      api.get('/destinations', { params: { status: 'published' } }),
    ]).then(([packageResult, destinationResult]) => {
      if (!mounted) return
      const publishedPackages = packageResult.status === 'fulfilled'
        ? unwrapList(packageResult.value).filter((item) => item && isPublished(item) && item.status !== 'draft' && item.isActive !== false)
        : []
      const publishedDestinations = destinationResult.status === 'fulfilled'
        ? unwrapList(destinationResult.value).filter((item) => item && isPublished(item) && item.isActive !== false)
        : []
      setPackages(publishedPackages.slice(0, 5))
      setDestinations(publishedDestinations)
      setPackagesLoading(false)

      if (publishedPackages.length) {
        Promise.allSettled(publishedPackages.slice(0, 8).filter((pkg) => pkg.id).map((pkg) =>
          api.get(`/packages/${pkg.id}/reviews`).then((response) => ({
            packageName: pkg.title,
            reviews: Array.isArray(response.data?.reviews) ? response.data.reviews : Array.isArray(response.data) ? response.data : [],
          })),
        )).then((results) => {
          if (!mounted) return
          const allReviews = results.flatMap((result) => result.status === 'fulfilled'
            ? result.value.reviews.map((review) => ({ ...review, packageName: result.value.packageName }))
            : [],
          ).filter((review) => review.comment && review.userName)
          const uniqueReviews = [...new ReviewMap(allReviews.map((review, index) => [review.id || `${review.userName}-${review.createdAt || index}`, review])).values()]
          setReviews(uniqueReviews)
        })
      }
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const updateVisibleReviews = () => setReviewsPerPage(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    updateVisibleReviews()
    window.addEventListener('resize', updateVisibleReviews)
    return () => window.removeEventListener('resize', updateVisibleReviews)
  }, [])

  const destinationOptions = useMemo(() => {
    const apiNames = destinations.map((item) => item.name).filter(Boolean)
    return [...new Set([...FEATURED_DESTINATIONS.map((item) => item.name), ...apiNames])].sort((a, b) => a.localeCompare(b))
  }, [destinations])
  const reviewPages = Math.max(1, Math.ceil(reviews.length / reviewsPerPage))

  const destinationImage = (featured) => {
    const apiDestination = destinations.find((item) => normalized(item.name) === featured.slug || normalized(item.slug) === featured.slug)
    return apiDestination?.coverImage || apiDestination?.image || apiDestination?.bannerImage || featured.image
  }

  const submitSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (travelDate) params.set('date', travelDate)
    if (travelers) params.set('travelers', travelers)
    const query = params.toString()
    if (activeTab === 'flights') {
      navigate('/contact')
      return
    }
    const route = activeTab === 'hotels' ? '/hotels' : activeTab === 'activities' ? '/activities' : '/packages'
    navigate(query ? `${route}?${query}` : route)
  }

  const moveReviews = (direction) => {
    const track = reviewTrack.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' })
  }

  const updateReviewPage = () => {
    const track = reviewTrack.current
    if (track) setReviewPage(Math.min(reviewPages - 1, Math.round(track.scrollLeft / track.clientWidth)))
  }

  const goToReviewPage = (page) => {
    const track = reviewTrack.current
    if (track) track.scrollTo({ left: page * track.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate min-h-[580px] overflow-hidden bg-[#082f50] text-white sm:min-h-[620px] lg:min-h-[610px]">
        <img src={HERO_IMAGE} alt="A turquoise alpine lake framed by the Himalayan mountains" className="absolute inset-0 h-full w-full object-cover object-center" fetchpriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061f38]/90 via-[#092e4b]/65 to-[#062c48]/20" />
        <div className="absolute inset-y-0 right-0 hidden w-[43%] lg:block">
          <img src={HERO_TRAVELER_IMAGE} alt="A traveler exploring a mountain trail" className="h-full w-full object-cover object-center opacity-90" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 32%)' }} />
        </div>
        <div className="relative mx-auto flex min-h-[580px] max-w-7xl flex-col justify-center px-4 pb-10 pt-14 sm:min-h-[620px] sm:px-6 lg:min-h-[610px] lg:px-8 lg:pb-14">
          <div className="max-w-3xl lg:max-w-[68%]">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-300 sm:text-sm">Explore · Travel · Discover</p>
            <h1 className="font-display text-[clamp(2.8rem,6.4vw,5.2rem)] font-bold leading-[0.98] tracking-tight text-white">
              Your Next Journey<br /><span className="text-[#FF8A00]">Starts Here</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:mt-5 sm:text-lg">
              Discover breathtaking destinations, curated tour packages and unforgettable travel experiences with Maqlaim Tours.
            </p>
          </div>

          <form onSubmit={submitSearch} className="relative mt-8 w-full max-w-5xl overflow-hidden rounded-2xl bg-white text-[#003B73] shadow-[0_20px_60px_rgba(0,23,50,0.3)] sm:mt-10 lg:mt-12">
            <div className="flex overflow-x-auto border-b border-slate-100 px-2 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Choose a travel service">
              {SERVICE_TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)}
                  className={`relative inline-flex min-w-max items-center gap-2 px-4 py-3.5 text-xs font-bold transition-colors sm:px-6 sm:text-sm ${activeTab === id ? 'text-[#003B73]' : 'text-slate-500 hover:text-[#003B73]'}`}>
                  <Icon size={17} aria-hidden="true" />{label}
                  {activeTab === id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#FF8500]" />}
                </button>
              ))}
            </div>
            <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-[1.25fr_1fr_0.8fr_auto] lg:items-end lg:gap-3 lg:p-5">
              <label className="block min-w-0">
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#003B73]"><MapPin size={14} className="text-orange-600" />Where do you want to go?</span>
                <select value={destination} onChange={(event) => setDestination(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
                  <option value="">Select Destination</option>
                  {destinationOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <label className="block min-w-0">
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#003B73]"><CalendarDays size={14} className="text-orange-600" />Travel Date</span>
                <input type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
              </label>
              <label className="block min-w-0">
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#003B73]"><Users size={14} className="text-orange-600" />Travelers</span>
                <select value={travelers} onChange={(event) => setTravelers(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => <option key={count} value={count}>{count} {count === 1 ? 'Traveler' : 'Travelers'}</option>)}
                </select>
              </label>
              <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FF8500] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2">
                <Search size={16} aria-hidden="true" />{SERVICE_TABS.find((tab) => tab.id === activeTab)?.action}
              </button>
            </div>
            {activeTab === 'flights' && <p className="px-5 pb-4 text-xs text-slate-500">Flight arrangements are not bookable online yet. We’ll help you plan them personally.</p>}
          </form>
          <div className="pointer-events-none absolute right-5 top-[16%] hidden rotate-[-8deg] text-right font-display text-xl italic leading-tight text-white drop-shadow-md xl:block">
            Travel<br />Explore<br />Create<br />Memories <Plane size={24} className="ml-auto mt-2 rotate-[-30deg]" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section aria-label="Why book with us" className="border-b border-orange-100 bg-[#FFF9F1]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-5 sm:px-6 md:grid-cols-3 lg:grid-cols-6 lg:gap-3 lg:px-8 lg:py-6">
          {TRUST_FEATURES.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="flex items-center gap-2.5 lg:justify-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><Icon size={21} aria-hidden="true" /></span>
              <div className="min-w-0"><h2 className="text-xs font-bold leading-tight text-[#003B73] sm:text-sm">{title}</h2><p className="mt-1 text-[10px] leading-snug text-slate-600 sm:text-xs">{detail}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#FFF9F1] py-9 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Explore India" action="View All Destinations" to="/destinations">
            Popular <span className="text-[#FF8500]">Destinations</span>
          </SectionHeading>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {FEATURED_DESTINATIONS.map((item) => (
              <Link key={item.slug} to={item.route} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[1.72/1] overflow-hidden">
                  <img src={destinationImage(item)} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex min-h-[67px] items-center justify-between gap-2 px-3 py-2.5">
                  <div className="min-w-0"><h3 className="truncate font-display text-sm font-bold text-[#003B73] sm:text-base">{item.name}</h3><p className="mt-0.5 truncate text-[10px] text-slate-600 sm:text-[11px]">{item.tags}</p></div>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-orange-400 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white"><ArrowUpRight size={15} aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-9 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Featured" action="View All Packages" to="/packages">
            Trending <span className="text-[#FF8500]">Tour Packages</span>
          </SectionHeading>
          {packagesLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 xl:gap-4" aria-label="Loading tour packages">
              {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-xl bg-slate-100" />)}
            </div>
          ) : packages.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 xl:gap-4">
              {packages.map((pkg) => (
                <Link key={pkg.id || pkg.slug} to={pkg.slug || pkg.id ? `/packages/${pkg.slug || pkg.id}` : '/packages'} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[1.45/1] overflow-hidden bg-slate-100">
                    { (pkg.coverImage || pkg.image) && <img src={pkg.coverImage || pkg.image} alt={pkg.title || `${pkg.destination || 'Travel'} tour`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                    {pkg.category && <span className="absolute left-2 top-2 rounded-full bg-[#0066E6] px-2.5 py-1 text-[10px] font-bold text-white">{pkg.category}</span>}
                  </div>
                  <div className="p-3 sm:p-3.5">
                    <p className="mb-1 truncate text-[11px] font-medium text-slate-500">{pkg.destination || pkg.state || 'India'}{pkg.durationDays ? ` · ${pkg.durationDays} Days / ${pkg.durationNights ?? Math.max(0, pkg.durationDays - 1)} Nights` : ''}</p>
                    <h3 className="line-clamp-2 min-h-10 font-display text-sm font-bold leading-snug text-[#003B73] transition group-hover:text-orange-600 sm:text-base">{pkg.title}</h3>
                    {Number(pkg.rating) > 0 && <div className="mt-2 flex items-center gap-1 text-xs text-slate-600"><Star size={13} className="fill-amber-400 text-amber-400" aria-hidden="true" /><span>{pkg.rating}</span>{Number(pkg.reviewCount) > 0 && <span className="text-slate-400">({pkg.reviewCount})</span>}</div>}
                    <div className="mt-3 flex items-baseline gap-1 border-t border-slate-100 pt-2.5">
                      <span className="text-lg font-extrabold text-[#003B73]">{Number.isFinite(Number(pkg.startingPrice)) ? `₹${Number(pkg.startingPrice).toLocaleString('en-IN')}` : 'Enquire'}</span><span className="text-[10px] text-slate-500">{Number.isFinite(Number(pkg.startingPrice)) ? '/ person' : 'for price'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <ComingSoon categoryName="Tour packages" description="Our team is preparing memorable journeys. Contact us to start planning a custom itinerary." />
          )}
          <div className="mt-5 text-center xl:hidden"><Link to="/packages" className="inline-flex items-center gap-2 rounded-lg border border-orange-400 px-5 py-2.5 text-sm font-semibold text-[#003B73] hover:bg-orange-50">Browse all packages<ArrowRight size={15} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#003B73] py-10 text-white sm:py-14">
        <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?w=2200&h=1000&fit=crop" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#003B73]/95 via-[#003B73]/85 to-[#003B73]/70" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.6fr] lg:items-center lg:px-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300">The Maqlaim difference</p>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">Why Travel with<br /><span className="text-[#FF8A00]">Maqlaim Tours?</span></h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">We make your travel dreams simple, safe and unforgettable with our dedicated services and expert guidance.</p>
            <Link to="/about" className="mt-5 inline-flex items-center gap-2 rounded-lg border border-orange-300 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500">Know More About Us<ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {WHY_TRAVEL.map(({ icon: Icon, title, detail, color }) => (
              <article key={title} className="rounded-xl bg-white/95 px-3 py-4 text-center text-[#003B73] shadow-lg backdrop-blur-sm sm:px-3.5">
                <Icon size={29} className={`mx-auto mb-2 ${color}`} aria-hidden="true" />
                <h3 className="text-xs font-extrabold leading-snug sm:text-sm">{title}</h3>
                <p className="mt-2 text-[10px] leading-snug text-slate-600 sm:text-xs">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF9F1] py-9 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Special offers" action="View All Offers" to="/offers">
            Exclusive <span className="text-[#FF8500]">Travel Deals</span>
          </SectionHeading>
          <p className="-mt-4 mb-5 text-sm text-slate-600 sm:mb-6">Explore inspiring escapes and ask us about current availability and pricing.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {OFFER_INSPIRATION.map((offer) => (
              <article key={offer.title} className="group relative isolate min-h-[210px] overflow-hidden rounded-xl bg-[#003B73] shadow-md sm:min-h-[245px]">
                <img src={offer.image} alt={offer.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#062542]/85 via-[#062542]/35 to-transparent" />
                <div className="relative flex min-h-[210px] max-w-[80%] flex-col items-start justify-end p-4 text-white sm:min-h-[245px] sm:p-5">
                  <span className="mb-2 rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">Ask us for current offers</span>
                  <h3 className="font-display text-xl font-bold leading-tight sm:text-2xl">{offer.title}</h3>
                  <p className="mt-1.5 text-xs text-white/85">{offer.detail}</p>
                  <Link to="/plan-trip" className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#FF8500] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-orange-600">Plan this trip<ArrowRight size={14} aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Promotional pricing is not displayed here; ask our team to confirm any current discounts.</p>
        </div>
      </section>

      <section id="travel-stories" className="bg-white py-9 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Travel stories" action="Read Package Reviews" to="/packages">
            From Our <span className="text-[#FF8500]">Happy Travelers</span>
          </SectionHeading>
          {reviews.length ? (
            <>
              <div className="relative">
                <div ref={reviewTrack} onScroll={updateReviewPage} className="home-review-track flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Traveler reviews">
                  {reviews.map((review, index) => (
                    <article key={review.id || `${review.userName}-${index}`} className="home-review-card snap-start rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                      <div className="mb-3 flex items-center gap-1" aria-label={`${review.rating || 5} out of 5 stars`}>
                        {Array.from({ length: Math.min(5, Math.max(1, Number(review.rating) || 5)) }, (_, starIndex) => <Star key={starIndex} size={14} className="fill-orange-400 text-orange-400" aria-hidden="true" />)}
                      </div>
                      <p className="line-clamp-4 min-h-[5.5rem] text-sm leading-relaxed text-slate-700">“{review.comment}”</p>
                      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3">
                        {review.userProfileImage ? <img src={review.userProfileImage} alt="" loading="lazy" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-[#0066E6]">{String(review.userName).split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase()}</span>}
                        <div className="min-w-0"><h3 className="truncate text-sm font-bold text-[#003B73]">{review.userName}</h3><p className="truncate text-xs text-slate-500">{review.packageName}</p></div>
                      </div>
                    </article>
                  ))}
                </div>
                {reviews.length > reviewsPerPage && <div className="pointer-events-none absolute inset-y-0 -left-3 -right-3 hidden items-center justify-between sm:flex"><button type="button" aria-label="Previous traveler reviews" onClick={() => moveReviews(-1)} className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#003B73] shadow-md transition hover:bg-orange-50"><ChevronLeft size={20} /></button><button type="button" aria-label="Next traveler reviews" onClick={() => moveReviews(1)} className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#003B73] shadow-md transition hover:bg-orange-50"><ChevronRight size={20} /></button></div>}
              </div>
              {reviewPages > 1 && <div className="mt-3 flex justify-center gap-2" role="group" aria-label="Choose traveler review page">{Array.from({ length: reviewPages }, (_, index) => <button key={index} type="button" onClick={() => goToReviewPage(index)} aria-label={`Show review page ${index + 1}`} aria-current={reviewPage === index ? 'page' : undefined} className={`h-2.5 rounded-full transition-all ${reviewPage === index ? 'w-5 bg-orange-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`} />)}</div>}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-[#F7F9FC] px-5 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600"><Waves size={22} aria-hidden="true" /></div>
              <h3 className="font-display text-xl font-bold text-[#003B73]">Your travel story could be next</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">Traveler reviews will appear here as guests share feedback on their trips.</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#062542] py-12 text-white sm:py-16 lg:py-20">
        <img src={CTA_IMAGE} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#051d33]/90 via-[#051d33]/65 to-[#051d33]/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300">The world is waiting</p>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Ready for Your Next<br className="hidden sm:block" /> <span className="text-[#FF8A00]">Adventure?</span></h2>
            <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base">Let us help you plan a perfect trip filled with amazing experiences.</p>
            <Link to="/plan-trip" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#FF8500] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-orange-600">Plan Your Trip Now<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-[-8deg] font-display text-xl italic leading-tight text-white drop-shadow-lg lg:block">Explore<br />Dream<br />Discover<Plane size={24} className="ml-auto mt-2 rotate-[-30deg]" aria-hidden="true" /></div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
