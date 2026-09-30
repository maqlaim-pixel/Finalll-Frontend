import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Compass,
  Heart,
  Loader2,
  MapPin,
  Mountain,
  RefreshCw,
  Sparkles,
  TentTree,
  Trees,
} from 'lucide-react'
import api from '../../services/api'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'
import { resolveImageUrl } from '../../utils/imageUtils'
import {
  getIndiaOffbeatDestinations,
  getOffbeatDestinationRegion,
  getOffbeatFeatureTags,
  getSupportedOffbeatFilters,
  matchesOffbeatFilter,
} from '../../utils/heritageDestinations'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=700&fit=crop'
const CTA_IMAGE = 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1800&h=600&fit=crop'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=520&fit=crop'
const BADGE_COLORS = ['bg-emerald-700', 'bg-sky-700', 'bg-orange-600', 'bg-purple-600', 'bg-rose-600', 'bg-teal-700']

function stateBadgeColor(value = '') {
  let hash = 0
  for (let index = 0; index < value.length; index++) hash = (hash * 31 + value.charCodeAt(index)) % 997
  return BADGE_COLORS[hash % BADGE_COLORS.length]
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export default function OffbeatDestinationsPage() {
  const [destinations, setDestinations] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDestinations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/destinations?status=published')
      setDestinations(getIndiaOffbeatDestinations(response.data))
      setActiveFilter('all')
    } catch {
      setDestinations([])
      setError('Unable to load offbeat destinations.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDestinations()
  }, [loadDestinations])

  const filters = useMemo(() => getSupportedOffbeatFilters(destinations), [destinations])
  const visibleDestinations = useMemo(
    () => destinations.filter(destination => matchesOffbeatFilter(destination, activeFilter)),
    [destinations, activeFilter],
  )

  return (
    <div className="bg-white">
      <SEOHead
        title="Offbeat Destinations in India | TravelVista"
        description="Escape the crowds and uncover India’s hidden gems, remote landscapes, distinctive cultures, and extraordinary escapes."
      />

      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Remote mountain landscape in India" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/65 to-navy-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-black/10" />
        </div>
        <div className="relative container-wide flex min-h-[300px] items-end py-8 sm:min-h-[340px] md:min-h-[390px] md:py-10">
          <div className="max-w-3xl">
            <Breadcrumb light items={[{ label: 'India', href: '/india' }, { label: 'Offbeat Destinations' }]} />
            <h1 className="font-display text-4xl font-bold leading-[1.04] text-white drop-shadow sm:text-5xl md:text-6xl">
              <span className="block">Offbeat Destinations</span>
              <span className="block">in India</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              Escape the crowds and discover India’s hidden gems. Experience untouched beauty,
              unique cultures, and extraordinary landscapes.
            </p>
          </div>
        </div>
      </section>

      {!loading && !error && destinations.length > 0 && (
        <nav className="border-b border-gray-100 bg-white shadow-sm" aria-label="Offbeat destination filters">
          <div className="container-wide flex gap-2 overflow-x-auto py-3 [scrollbar-width:thin]">
            {filters.map(filter => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={activeFilter === filter.id}
                className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${activeFilter === filter.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-100 text-navy-700 hover:bg-orange-50 hover:text-orange-700'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      <section className="container-wide py-8 md:py-10">
        {loading && (
          <div className="flex min-h-64 items-center justify-center" role="status" aria-live="polite">
            <Loader2 className="animate-spin text-emerald-700" size={30} aria-hidden="true" />
            <span className="ml-3 text-sm text-navy-500">Loading offbeat destinations...</span>
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center" role="alert">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={40} aria-hidden="true" />
            <p className="font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={loadDestinations}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-700 px-5 py-2.5 font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              <RefreshCw size={16} aria-hidden="true" /> Retry
            </button>
          </div>
        )}

        {!loading && !error && destinations.length === 0 && (
          <div className="mx-auto my-4 max-w-4xl overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/80 to-sky-100/80 px-6 py-12 text-center shadow-lg shadow-emerald-950/5 sm:px-12 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-100">
              <Compass size={34} strokeWidth={1.7} aria-hidden="true" />
            </div>
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              <Sparkles size={15} aria-hidden="true" /> Hidden Gems
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold leading-tight text-navy-900 sm:text-4xl md:text-5xl">
              Offbeat Destinations <span className="text-emerald-800">Coming Soon</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy-600 sm:text-lg">
              We’re uncovering extraordinary hidden gems across India for travellers looking beyond the usual routes.
              From remote mountain villages and untouched landscapes to unique cultures and peaceful escapes,
              our Offbeat Destinations collection will be available soon.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/packages?destination=India"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              >
                Explore India Packages <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/india/popular-destinations"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white/80 px-6 py-3 font-semibold text-navy-700 transition-colors hover:border-emerald-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              >
                Explore Popular Destinations <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && destinations.length > 0 && visibleDestinations.length > 0 && (
          <>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Beyond the ordinary</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                  {filters.find(filter => filter.id === activeFilter)?.label || 'All Offbeat Destinations'}
                </h2>
              </div>
              <p className="text-sm text-navy-500">
                {visibleDestinations.length} offbeat destination{visibleDestinations.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {visibleDestinations.map(destination => {
                const name = cleanText(destination.name)
                const region = getOffbeatDestinationRegion(destination)
                const image = resolveImageUrl(destination.image) || FALLBACK_IMAGE
                const tags = getOffbeatFeatureTags(destination, 3)
                const description = cleanText(destination.shortDescription) || cleanText(destination.description)
                const destinationKey = cleanText(destination.slug) || destination.id
                const detailHref = destinationKey ? `/destinations/${destinationKey}` : ''

                if (!name || !detailHref) return null

                return (
                  <article key={destination.id || destination.slug} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <Link to={detailHref} className="relative block h-44 overflow-hidden" aria-label={`Explore ${name}`}>
                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        onError={event => { if (event.currentTarget.src !== FALLBACK_IMAGE) event.currentTarget.src = FALLBACK_IMAGE }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {region && (
                        <span className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full ${stateBadgeColor(region)} px-3 py-1.5 text-xs font-semibold text-white shadow-md`}>
                          <MapPin size={12} aria-hidden="true" /> {region}
                        </span>
                      )}
                    </Link>

                    <div className="flex min-h-[250px] flex-1 flex-col p-4">
                      <h3 className="flex items-start gap-2 text-lg font-bold leading-snug text-navy-900">
                        <MapPin size={17} className="mt-1 shrink-0 text-orange-600" aria-hidden="true" />
                        <span>{name}</span>
                      </h3>
                      {cleanText(destination.tagline) && <p className="mt-1 pl-6 text-sm text-navy-500">{cleanText(destination.tagline)}</p>}

                      {tags.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-navy-600" aria-label="Offbeat destination highlights">
                          {tags.map((tag, index) => (
                            <li key={`${tag}-${index}`} className="inline-flex items-center gap-1.5">
                              <Mountain size={13} className="shrink-0 text-emerald-700" aria-hidden="true" />
                              <span>{tag}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-600">{description}</p>}

                      <Link
                        to={detailHref}
                        className="mt-auto flex min-h-10 items-center justify-center gap-2 rounded-lg border border-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                      >
                        Explore {name} <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}

        {!loading && !error && destinations.length > 0 && visibleDestinations.length === 0 && (
          <div className="py-14 text-center">
            <MapPin className="mx-auto mb-3 text-navy-300" size={36} aria-hidden="true" />
            <p className="text-navy-600">No offbeat destinations match this region yet.</p>
          </div>
        )}
      </section>

      {!loading && !error && destinations.length > 0 && (
        <section className="relative overflow-hidden border-t border-emerald-100 bg-emerald-50">
          <div className="absolute inset-0">
            <img src={CTA_IMAGE} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/95 via-sky-50/90 to-white/90" />
          </div>
          <div className="relative container-wide py-10 md:py-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr_auto]">
              <div className="text-center lg:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Find your own path</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Discover the Road Less Traveled</h2>
                <p className="mt-2 text-sm text-navy-600">
                  Explore offbeat destinations in India with customized itineraries and expert travel guidance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <div className="flex flex-col items-center gap-1">
                  <MapPin className="text-orange-600" size={25} aria-hidden="true" />
                  <strong className="text-xl text-navy-900">{destinations.length}</strong>
                  <span className="text-xs text-navy-600">Offbeat Destinations</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <TentTree className="text-emerald-700" size={25} aria-hidden="true" />
                  <strong className="text-sm text-navy-900">Customized</strong>
                  <span className="text-xs text-navy-600">Tour Packages</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Compass className="text-sky-700" size={25} aria-hidden="true" />
                  <strong className="text-sm text-navy-900">Expert</strong>
                  <span className="text-xs text-navy-600">Travel Guidance</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Heart className="text-rose-500" size={25} aria-hidden="true" />
                  <strong className="text-sm text-navy-900">Memorable</strong>
                  <span className="text-xs text-navy-600">Unique Experiences</span>
                </div>
              </div>

              <Link
                to="/packages?destination=India"
                className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              >
                View All India Packages <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
