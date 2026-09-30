import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  AlertCircle,
  Landmark,
  Loader2,
  MapPin,
  RefreshCw,
  Sparkles,
  TentTree,
} from 'lucide-react'
import api from '../../services/api'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'
import { resolveImageUrl } from '../../utils/imageUtils'
import {
  countHeritageDestinations,
  getDestinationFeatureTags,
  getHeritagePackageCount,
  getIndiaHeritageDestinations,
  getSupportedHeritageFilters,
  matchesHeritageFilter,
} from '../../utils/heritageDestinations'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&h=700&fit=crop'
const CTA_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&h=600&fit=crop'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=520&fit=crop'

const BADGE_COLORS = ['bg-orange-600', 'bg-sky-700', 'bg-emerald-600', 'bg-purple-600', 'bg-rose-600', 'bg-teal-700']

function stateBadgeColor(value = '') {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) % 997
  return BADGE_COLORS[hash % BADGE_COLORS.length]
}

function parseMetadata(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'object') return [value]

  const text = String(value).trim()
  if (!text) return []
  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return []
    }
  }
  return text.split(/[,|]/).map(label => label.trim()).filter(Boolean)
}

function isUnescoDestination(destination) {
  const fields = [destination?.category, destination?.destinationCategory, destination?.theme,
    destination?.themes, destination?.tags, destination?.highlights,
    destination?.destinationHighlights, destination?.experiences, destination?.attractions]
  return fields.some(value => parseMetadata(value).some(item => {
    if (item && typeof item === 'object' && item.isActive === false) return false
    const text = typeof item === 'string'
      ? item
      : [item?.category, item?.type, item?.theme, item?.title, item?.label, item?.name]
        .filter(Boolean).join(' ')
    return /\bunesco\b/i.test(text)
  }))
}

export default function HeritageDestinationsPage() {
  const [destinations, setDestinations] = useState([])
  const [packages, setPackages] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPageData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [destinationResponse, packageResponse] = await Promise.all([
        api.get('/destinations?status=published'),
        api.get('/packages').catch(() => null),
      ])
      setDestinations(getIndiaHeritageDestinations(destinationResponse.data))
      setPackages(Array.isArray(packageResponse?.data) ? packageResponse.data : null)
      setActiveFilter('all')
    } catch {
      setError('Unable to load heritage destinations. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPageData()
  }, [loadPageData])

  const filters = useMemo(() => getSupportedHeritageFilters(destinations), [destinations])
  const visibleDestinations = useMemo(
    () => destinations.filter(destination => matchesHeritageFilter(destination, activeFilter)),
    [destinations, activeFilter],
  )
  const heritagePackageCount = useMemo(() => getHeritagePackageCount(packages), [packages])
  const unescoCount = useMemo(
    () => destinations.filter(isUnescoDestination).length,
    [destinations],
  )

  return (
    <div className="bg-white">
      <SEOHead
        title="Heritage Destinations in India | TravelVista"
        description="Step into a world of royal grandeur, ancient architecture and timeless stories. Explore India's iconic heritage destinations."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Historic palace architecture in India" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-black/10" />
        </div>
        <div className="relative container-wide flex min-h-[300px] items-end py-8 sm:min-h-[340px] md:min-h-[390px] md:py-10">
          <div className="max-w-3xl">
            <Breadcrumb light items={[{ label: 'India', href: '/india' }, { label: 'Heritage Destinations' }]} />
            <h1 className="font-display text-4xl font-bold leading-[1.04] text-white drop-shadow sm:text-5xl md:text-6xl">
              <span className="block">Heritage Destinations</span>
              <span className="block">in India</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              Step into a world of royal grandeur, ancient architecture and timeless stories.
              Explore India’s most iconic heritage destinations.
            </p>
          </div>
        </div>
      </section>

      {/* Metadata-backed filters */}
      {!loading && !error && destinations.length > 0 && (
        <nav className="relative border-b border-gray-100 bg-white shadow-sm" aria-label="Heritage destination filters">
          <div className="container-wide flex gap-2 overflow-x-auto py-3 [scrollbar-width:thin]">
            {filters.map(filter => {
              const count = filter.id === 'all' ? destinations.length : countHeritageDestinations(destinations, filter.id)
              return (
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
                  {filter.id !== 'all' && <span className="ml-1.5 opacity-75">{count}</span>}
                </button>
              )
            })}
          </div>
        </nav>
      )}

      {/* Cards */}
      <section className="container-wide py-8 md:py-10">
        {!loading && !error && destinations.length > 0 && (
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Discover India's past</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                {activeFilter === 'all' ? 'India’s heritage, up close' : filters.find(filter => filter.id === activeFilter)?.label}
              </h2>
            </div>
            <p className="text-sm text-navy-500">
              {visibleDestinations.length} destination{visibleDestinations.length === 1 ? '' : 's'}
            </p>
          </div>
        )}

        {loading && (
          <div className="flex min-h-64 items-center justify-center" role="status" aria-live="polite">
            <Loader2 className="animate-spin text-orange-600" size={30} />
            <span className="ml-3 text-sm text-navy-500">Loading heritage destinations...</span>
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center" role="alert">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={40} />
            <p className="font-medium text-red-700">{error}</p>
            <button type="button" onClick={loadPageData} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-orange-600 px-5 py-2.5 font-semibold text-orange-700 hover:bg-orange-50">
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && destinations.length === 0 && (
          <div className="py-16 text-center">
            <Landmark className="mx-auto mb-4 text-navy-300" size={44} />
            <h2 className="text-xl font-semibold text-navy-800">No heritage destinations are currently available for India.</h2>
          </div>
        )}

        {!loading && !error && destinations.length > 0 && visibleDestinations.length === 0 && (
          <div className="py-14 text-center">
            <MapPin className="mx-auto mb-3 text-navy-300" size={36} />
            <p className="text-navy-600">No destinations match this heritage filter yet.</p>
          </div>
        )}

        {!loading && !error && visibleDestinations.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {visibleDestinations.map(destination => {
              const name = destination.name || ''
              const state = destination.state || destination.region || ''
              const image = resolveImageUrl(destination.image) || FALLBACK_IMAGE
              const tags = getDestinationFeatureTags(destination, 3)
              const description = destination.shortDescription || destination.description || ''

              return (
                <article key={destination.id || destination.slug} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <Link to={`/destinations/${destination.slug || destination.id}`} className="relative block h-40 overflow-hidden sm:h-44" aria-label={`Explore ${name}`}>
                    <img
                      src={image}
                      alt={name}
                      loading="lazy"
                      onError={event => { if (event.currentTarget.src !== FALLBACK_IMAGE) event.currentTarget.src = FALLBACK_IMAGE }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {state && (
                      <span className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full ${stateBadgeColor(state)} px-3 py-1.5 text-xs font-semibold text-white shadow-md`}>
                        <MapPin size={12} /> {state}
                      </span>
                    )}
                  </Link>

                  <div className="flex min-h-[220px] flex-col p-4 sm:p-4">
                    {destination.tagline && <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Heritage</p>}
                    <h3 className="mt-1 flex items-start gap-2 text-lg font-bold leading-snug text-navy-900">
                      <MapPin size={17} className="mt-1 shrink-0 text-orange-600" />
                      <span>{name}</span>
                    </h3>
                    {destination.tagline && <p className="mt-0.5 pl-6 text-sm text-navy-500">{destination.tagline}</p>}

                    {tags.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-navy-600">
                        {tags.map((tag, index) => (
                          <li key={`${tag}-${index}`} className="inline-flex items-center gap-1.5">
                            <Landmark size={13} className="shrink-0 text-orange-600" />
                            <span>{tag}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy-600">{description}</p>}

                    <Link
                      to={`/destinations/${destination.slug || destination.id}`}
                      className="mt-auto flex min-h-10 items-center justify-center gap-2 rounded-lg border border-orange-500 px-3 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      Explore {name}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden border-t border-orange-100 bg-orange-50">
        <div className="absolute inset-0">
          <img src={CTA_IMAGE} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/95 via-orange-50/90 to-white/90" />
        </div>
        <div className="relative container-wide py-10 md:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr_auto]">
            <div className="text-center lg:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">Stories carved in stone</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Discover India’s Glorious Heritage</h2>
              <p className="mt-2 text-sm text-navy-600">Plan your perfect heritage journey with our expert travel guides and curated packages.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <div className="flex flex-col items-center gap-1">
                <MapPin className="text-orange-600" size={25} />
                <strong className="text-xl text-navy-900">{destinations.length}</strong>
                <span className="text-xs text-navy-600">Heritage Destinations</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Landmark className="text-red-600" size={25} />
                <strong className="text-xl text-navy-900">{unescoCount || 'Explore'}</strong>
                <span className="text-xs text-navy-600">UNESCO World Heritage Sites</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <TentTree className="text-purple-600" size={25} />
                <strong className="text-xl text-navy-900">{heritagePackageCount == null ? 'Explore' : heritagePackageCount}</strong>
                <span className="text-xs text-navy-600">Curated Tour Packages</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Sparkles className="text-emerald-600" size={25} />
                <strong className="text-xl text-navy-900">Expert</strong>
                <span className="text-xs text-navy-600">Travel Guidance</span>
              </div>
            </div>

            <Link
              to="/packages?destination=India"
              className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              View All India Packages <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
