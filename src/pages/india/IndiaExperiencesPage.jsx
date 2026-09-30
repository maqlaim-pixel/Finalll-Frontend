import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Clock3,
  Compass,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import api from '../../services/api'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'
import { resolveImageUrl } from '../../utils/imageUtils'
import { filterIndiaExperienceActivities, getPublishedActivities } from '../../utils/indiaExperiences'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=900&fit=crop'
const CTA_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&h=620&fit=crop'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=520&fit=crop'

const CATEGORY_PAGES = [
  { slug: 'adventure', label: 'Adventure' },
  { slug: 'water-sports', label: 'Water Sports' },
  { slug: 'trekking', label: 'Trekking & Hiking' },
  { slug: 'wildlife', label: 'Wildlife' },
  { slug: 'camping', label: 'Camping' },
  { slug: 'culture', label: 'Culture & Heritage' },
  { slug: 'food', label: 'Food & Cuisine' },
  { slug: 'spiritual', label: 'Spiritual' },
  { slug: 'luxury', label: 'Luxury' },
  { slug: 'family', label: 'Family Friendly' },
  { slug: 'pilgrimage', label: 'Pilgrimage' },
  { slug: 'shopping', label: 'Shopping' },
]

const CATEGORY_CONTENT = {
  adventure: {
    label: 'Adventure',
    title: 'Adventure Experiences in India',
    description: 'Find your next rush in the mountains, rivers, deserts and coastlines of India.',
  },
  wildlife: {
    label: 'Wildlife',
    title: 'Wildlife Experiences in India',
    description: 'Get closer to India’s remarkable wildlife with responsible, memorable adventures.',
  },
  culture: {
    label: 'Culture & Heritage',
    title: 'Culture & Heritage Experiences in India',
    description: 'Meet the traditions, crafts, stories and living heritage that make every journey unique.',
  },
  food: {
    label: 'Food & Cuisine',
    title: 'Food Experiences in India',
    description: 'Discover the regional flavours and local food experiences that make India unforgettable.',
  },
  spiritual: {
    label: 'Spiritual',
    title: 'Spiritual Experiences in India',
    description: 'Find moments of reflection and connection on India’s timeless spiritual journeys.',
  },
  luxury: {
    label: 'Luxury',
    title: 'Luxury Experiences in India',
    description: 'Explore exceptional experiences and distinctive ways to see India in comfort.',
  },
  family: {
    label: 'Family Friendly',
    title: 'Family Experiences in India',
    description: 'Make lasting memories together with experiences for every generation.',
  },
  'water-sports': {
    label: 'Water Sports',
    title: 'Water Sports in India',
    description: 'Dive into clear waters and find your next adventure on India’s rivers and coastline.',
  },
  trekking: {
    label: 'Trekking & Hiking',
    title: 'Trekking Experiences in India',
    description: 'Explore mountain trails and find your own way into India’s great outdoors.',
  },
  camping: {
    label: 'Camping',
    title: 'Camping Experiences in India',
    description: 'Spend a night outdoors and wake up somewhere worth the journey.',
  },
  pilgrimage: {
    label: 'Pilgrimage Tours',
    title: 'Pilgrimage Experiences in India',
    description: 'Explore meaningful journeys to India’s sacred places and spiritual landmarks.',
  },
  shopping: {
    label: 'Shopping',
    title: 'Shopping Experiences in India',
    description: 'Explore local markets, regional crafts and the makers behind them.',
  },
}

function getExperienceContent(categorySlug, isThingsToDo) {
  if (!categorySlug) {
    return isThingsToDo
      ? {
          label: 'Things to Do',
          title: 'Things to Do in India',
          description: 'Make your trip memorable with experiences and activities from across India.',
        }
      : {
          label: 'Experiences',
          title: 'Experiences Across India',
          description: 'Discover memorable activities, local experiences and adventures from across India.',
        }
  }

  const slug = categorySlug.toLowerCase()
  if (CATEGORY_CONTENT[slug]) return CATEGORY_CONTENT[slug]

  const label = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return {
    label,
    title: `${label} Experiences in India`,
    description: `Explore ${label.toLowerCase()} experiences and activities across India.`,
  }
}

function ActivityCard({ activity }) {
  const image = resolveImageUrl(activity.image) || FALLBACK_IMAGE
  const detailPath = `/activities/${activity.slug || activity.id}`

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={detailPath} className="relative block aspect-[16/10] overflow-hidden" aria-label={`Explore ${activity.name}`}>
        <img
          src={image}
          alt={activity.name || 'India experience'}
          loading="lazy"
          onError={event => {
            if (event.currentTarget.dataset.fallback !== 'true') {
              event.currentTarget.dataset.fallback = 'true'
              event.currentTarget.src = FALLBACK_IMAGE
            }
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-navy-800 shadow-sm">
          {activity.category || 'India Experience'}
        </span>
        {activity.rating > 0 && (
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-xs font-bold text-navy-900 shadow-sm">
            <Star size={13} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            {activity.rating}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h2 className="font-display text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-sky-700 sm:text-xl">
          <Link to={detailPath}>{activity.name}</Link>
        </h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-navy-500 sm:text-sm">
          {activity.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="shrink-0 text-sky-700" />{activity.location}</span>}
          {activity.duration && <span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="shrink-0 text-sky-700" />{activity.duration}</span>}
        </div>
        {activity.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-navy-600">{activity.description}</p>}

        <div className="mt-auto flex justify-end border-t border-slate-100 pt-4">
          <Link
            to={detailPath}
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg bg-sky-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
          >
            Explore <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function IndiaExperiencesPage() {
  const { categorySlug } = useParams()
  const location = useLocation()
  const isThingsToDo = location.pathname.startsWith('/india/things-to-do')
  const rootPath = isThingsToDo ? '/india/things-to-do' : '/india/experiences'
  const content = getExperienceContent(categorySlug, isThingsToDo)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const loadActivities = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/activities?status=published')
      if (!Array.isArray(response.data)) throw new TypeError('Unexpected activities response')
      setActivities(getPublishedActivities(response.data))
    } catch {
      setActivities([])
      setError('Unable to load experiences. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  const categoryActivities = useMemo(
    () => filterIndiaExperienceActivities(activities, categorySlug || 'all'),
    [activities, categorySlug],
  )
  const visibleActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return categoryActivities
    return categoryActivities.filter(activity => [
      activity.name,
      activity.category,
      activity.location,
      activity.description,
      activity.difficulty,
    ].some(value => typeof value === 'string' && value.toLowerCase().includes(query)))
  }, [categoryActivities, searchQuery])

  const availableCategories = useMemo(() => CATEGORY_PAGES.filter(category => (
    filterIndiaExperienceActivities(activities, category.slug).length > 0
  )), [activities])
  const selectedSlug = categorySlug || 'all'
  const activeCategoryName = content.label

  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead
        title={`${content.title} | TravelVista`}
        description={content.description}
      />

      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Snow-covered Himalayan peaks in India" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/65 to-navy-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-black/10" />
        </div>
        <div className="relative container-wide flex min-h-[330px] items-end py-8 sm:min-h-[360px] md:min-h-[410px] md:py-11">
          <div className="max-w-3xl">
            <Breadcrumb light items={[
              { label: 'India', href: '/india' },
              { label: isThingsToDo ? 'Things to Do' : 'Experiences', href: rootPath },
              ...(categorySlug ? [{ label: activeCategoryName }] : []),
            ]} />
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300 sm:text-sm">
              <Sparkles size={15} aria-hidden="true" /> Discover India, your way
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.04] text-white drop-shadow sm:text-5xl md:text-6xl">
              {content.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              {content.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/85 sm:text-sm">
              <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-amber-300" /> Handpicked places across India</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-amber-300" /> Experiences curated for you</span>
            </div>
          </div>
        </div>
      </section>

      {!loading && !error && activities.length > 0 && (
        <nav className="border-b border-slate-100 bg-white shadow-sm" aria-label="Experience categories">
          <div className="container-wide flex gap-2 overflow-x-auto py-3 [scrollbar-width:thin]">
            <Link
              to={isThingsToDo ? rootPath : '/india/experiences'}
              aria-current={selectedSlug === 'all' ? 'page' : undefined}
              className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${selectedSlug === 'all'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-slate-100 text-navy-700 hover:bg-sky-50 hover:text-sky-800'}`}
            >
              {isThingsToDo ? 'All Activities' : 'All Experiences'}
            </Link>
            {availableCategories.map(category => {
              const count = filterIndiaExperienceActivities(activities, category.slug).length
              const active = selectedSlug === category.slug
              return (
                <Link
                  key={category.slug}
                  to={`${rootPath}/${category.slug}`}
                  aria-current={active ? 'page' : undefined}
                  className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${active
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'bg-slate-100 text-navy-700 hover:bg-sky-50 hover:text-sky-800'}`}
                >
                  {category.label}<span className="ml-1.5 opacity-75">{count}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}

      <section className="container-wide py-8 md:py-10">
        {!loading && !error && categoryActivities.length > 0 && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">{isThingsToDo ? 'Make it a trip to remember' : 'Find your next experience'}</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">{activeCategoryName} in India</h2>
              <p className="mt-1 text-sm text-navy-500" aria-live="polite">
                {visibleActivities.length} experience{visibleActivities.length === 1 ? '' : 's'} to explore
              </p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">Search experiences</span>
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Search experiences..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-navy-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>
          </div>
        )}

        {loading && (
          <div className="flex min-h-64 items-center justify-center" role="status" aria-live="polite">
            <Loader2 className="animate-spin text-sky-700" size={30} aria-hidden="true" />
            <span className="ml-3 text-sm text-navy-500">Loading experiences...</span>
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center" role="alert">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={40} aria-hidden="true" />
            <h2 className="text-xl font-semibold text-navy-900">Unable to load experiences.</h2>
            <p className="mt-2 text-navy-500">Please check your connection and try again.</p>
            <button type="button" onClick={loadActivities} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-sky-700 px-5 py-2.5 font-semibold text-sky-800 transition-colors hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2">
              <RefreshCw size={16} aria-hidden="true" /> Retry
            </button>
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/70 px-6 py-12 text-center sm:px-10 sm:py-14">
            <Compass className="mx-auto text-sky-700" size={42} aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-navy-900">India experiences are coming soon</h2>
            <p className="mx-auto mt-2 max-w-xl leading-relaxed text-navy-600">We’re preparing a collection of experiences for your next journey. Check back soon or let our travel team help plan a trip.</p>
            <Link to="/plan-trip" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-sky-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-sky-800">
              Plan a Trip <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}

        {!loading && !error && activities.length > 0 && visibleActivities.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-14 text-center" role="status">
            <Search className="mx-auto mb-3 text-sky-700" size={36} aria-hidden="true" />
            <h2 className="text-xl font-semibold text-navy-900">No experiences found</h2>
            <p className="mt-2 text-navy-500">{categoryActivities.length === 0 ? 'There are no published experiences in this category yet.' : 'Try a different search term.'}</p>
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="mt-4 font-semibold text-sky-700 hover:underline">Clear search</button>}
          </div>
        )}

        {!loading && !error && visibleActivities.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleActivities.map((activity, index) => (
              <ActivityCard key={activity.id || activity.slug || `${activity.name}-${index}`} activity={activity} />
            ))}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden border-t border-sky-100 bg-sky-50">
        <div className="absolute inset-0">
          <img src={CTA_IMAGE} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-sky-50/95 to-white/85" />
        </div>
        <div className="relative container-wide py-10 md:py-12">
          <div className="grid items-center gap-7 lg:grid-cols-[1fr_auto]">
            <div className="text-center lg:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">Your next story starts here</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Make your India trip unforgettable</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-navy-600 lg:mx-0">
                Tell us what you love and our travel experts can help shape an itinerary around the experiences you want.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-navy-600 sm:text-sm">
                <ShieldCheck size={16} className="text-emerald-700" aria-hidden="true" /> Personalised trip planning from local travel experts
              </p>
            </div>
            <Link
              to="/plan-trip"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
            >
              Plan Your Trip <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
