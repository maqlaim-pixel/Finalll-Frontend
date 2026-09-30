import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Church,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crown,
  Grid2X2,
  Heart,
  Landmark,
  Loader2,
  MapPin,
  Moon,
  Mountain,
  PawPrint,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Trees,
  Waves,
} from 'lucide-react'
import api from '../../services/api'
import Breadcrumb from '../../components/common/Breadcrumb'
import DestinationCard from '../../components/common/DestinationCard'
import SEOHead from '../../components/common/SEOHead'
import {
  getAllIndiaDestinations,
  getDestinationFeatureTags,
  getIndiaDestinationPaginationPages,
  isDestinationListResponse,
  getIndiaDestinationStates,
  getSupportedIndiaDestinationCategories,
  matchesIndiaDestinationFilters,
} from '../../utils/heritageDestinations'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=900&fit=crop'
const CTA_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&h=620&fit=crop'
const PAGE_SIZE = 10

const CATEGORY_LINKS = [
  { label: 'All Destinations', href: '/india/destinations', icon: Grid2X2 },
  { label: 'Popular Destinations', href: '/india/popular-destinations', icon: Star },
  { label: 'Heritage Destinations', href: '/india/heritage-destinations', icon: Landmark },
  { label: 'Religious Destinations', href: '/india/religious-destinations', icon: Church },
  { label: 'Hill Stations', href: '/india/hill-stations', icon: Mountain },
  { label: 'Beaches', href: '/india/beaches', icon: Waves },
  { label: 'Wildlife Destinations', href: '/india/wildlife-destinations', icon: PawPrint },
  { label: 'Weekend Getaways', href: '/india/weekend-getaways', icon: Moon },
  { label: 'Offbeat Destinations', href: '/india/offbeat-destinations', icon: Trees },
  { label: 'Famous Destinations', href: '/india/famous-destinations', icon: Crown },
]

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function pluralizeDestinations(count) {
  return `${count} destination${count === 1 ? '' : 's'}`
}

function LoadingDestinations() {
  return (
    <div className="container-wide py-10" role="status" aria-live="polite">
      <div className="mb-6 flex items-center justify-center gap-3 text-sky-700">
        <Loader2 className="animate-spin" size={24} aria-hidden="true" />
        <span className="font-medium text-navy-600">Loading destinations...</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-slate-100 bg-white">
            <div className="aspect-[16/9] animate-pulse bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
              <div className="h-9 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = getIndiaDestinationPaginationPages(totalPages, currentPage)

  return (
    <nav className="mt-9 flex flex-wrap items-center justify-center gap-1.5" aria-label="Destination pages">
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-navy-700 transition-colors hover:border-sky-500 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      {pages.map((page, index) => page === 'ellipsis' ? (
        <span key={`ellipsis-${index}`} className="px-2 text-sm text-navy-400" aria-hidden="true">…</span>
      ) : (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          aria-current={currentPage === page ? 'page' : undefined}
          aria-label={`Page ${page}`}
          className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition-colors ${currentPage === page
            ? 'bg-sky-700 text-white shadow-sm'
            : 'border border-slate-200 bg-white text-navy-700 hover:border-sky-500 hover:text-sky-700'}`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-navy-700 transition-colors hover:border-sky-500 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  )
}

export default function AllIndiaDestinationsPage() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedState, setSelectedState] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [currentPage, setCurrentPage] = useState(1)

  const loadDestinations = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/destinations?status=published')
      if (!isDestinationListResponse(response.data)) {
        throw new TypeError('Unexpected destination response')
      }
      setDestinations(getAllIndiaDestinations(response.data))
      setSearchQuery('')
      setSelectedCategory('all')
      setSelectedState('all')
      setSortBy('default')
      setCurrentPage(1)
    } catch {
      setDestinations([])
      setError('Unable to load destinations.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDestinations()
  }, [loadDestinations])

  const states = useMemo(() => getIndiaDestinationStates(destinations), [destinations])
  const categories = useMemo(() => getSupportedIndiaDestinationCategories(destinations), [destinations])
  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim()
    const filtered = destinations.filter(destination => matchesIndiaDestinationFilters(destination, {
        query,
        categoryId: selectedCategory,
        state: selectedState,
      }))

    if (sortBy === 'name-asc') return filtered.sort((a, b) => cleanText(a.name).localeCompare(cleanText(b.name)))
    if (sortBy === 'name-desc') return filtered.sort((a, b) => cleanText(b.name).localeCompare(cleanText(a.name)))
    return filtered
  }, [destinations, searchQuery, selectedCategory, selectedState, sortBy])

  const totalPages = Math.ceil(filteredDestinations.length / PAGE_SIZE)
  const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages))
  const visibleDestinations = filteredDestinations.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const hasActiveFilters = Boolean(searchQuery.trim()) || selectedCategory !== 'all' || selectedState !== 'all'

  useEffect(() => {
    setCurrentPage(page => Math.min(Math.max(1, page), Math.max(1, totalPages)))
  }, [totalPages])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedState('all')
    setSortBy('default')
    setCurrentPage(1)
  }

  const changeFilter = setter => value => {
    setter(value)
    setCurrentPage(1)
  }

  const submitSearch = event => {
    event.preventDefault()
    setCurrentPage(1)
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead
        title="All Destinations in India | TravelVista"
        description="Explore every corner of India, from majestic mountains and serene beaches to royal heritage, vibrant cities and beyond."
      />

      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Snow-capped mountain range" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/70 to-navy-900/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-black/10" />
        </div>
        <div className="relative container-wide grid min-h-[360px] min-w-0 items-end gap-7 py-8 sm:min-h-[390px] md:py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)]">
          <div className="max-w-2xl">
            <Breadcrumb light items={[{ label: 'India', href: '/india' }, { label: 'All Destinations' }]} />
            <h1 className="font-display text-4xl font-bold leading-[1.04] text-white drop-shadow sm:text-5xl md:text-6xl">
              <span className="block">All Destinations</span>
              <span className="block">in India</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              Explore every corner of India – from majestic mountains to serene beaches,
              from royal heritage to vibrant cities and beyond.
            </p>
          </div>

          {!loading && !error && destinations.length > 0 && (
            <form onSubmit={submitSearch} className="grid min-w-0 gap-2 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-xl backdrop-blur-sm sm:grid-cols-2 xl:grid-cols-[minmax(180px,1.5fr)_minmax(140px,0.8fr)_minmax(140px,0.8fr)_auto]">
              <label className="relative block sm:col-span-2 xl:col-span-1">
                <span className="sr-only">Search destinations</span>
                <MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-700" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={event => changeFilter(setSearchQuery)(event.target.value)}
                  placeholder="Search destinations..."
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-navy-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Filter by category</span>
                <select
                  value={selectedCategory}
                  onChange={event => changeFilter(setSelectedCategory)(event.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => <option key={category.id} value={category.id}>{category.label} ({category.count})</option>)}
                </select>
                <ChevronRight size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-navy-500" aria-hidden="true" />
              </label>

              <label className="relative block">
                <span className="sr-only">Filter by state</span>
                <select
                  value={selectedState}
                  onChange={event => changeFilter(setSelectedState)(event.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-navy-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="all">All States</option>
                  {states.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <ChevronRight size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-navy-500" aria-hidden="true" />
              </label>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                <Search size={16} aria-hidden="true" /> Search
              </button>
            </form>
          )}
        </div>
      </section>

      {!loading && !error && destinations.length > 0 && (
        <nav className="border-b border-slate-100 bg-white shadow-sm" aria-label="Explore India destination categories">
          <div className="container-wide flex gap-2 overflow-x-auto py-3 [scrollbar-width:thin]">
            {CATEGORY_LINKS.map(({ label, href, icon: Icon }) => {
              const isCurrentPage = href === '/india/destinations'
              return (
                <Link
                  key={href}
                  to={href}
                  aria-current={isCurrentPage ? 'page' : undefined}
                  className={`flex min-w-[126px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-center text-[11px] font-semibold transition-colors sm:min-w-[138px] sm:text-xs ${isCurrentPage
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'bg-slate-50 text-navy-800 hover:bg-sky-50 hover:text-sky-800'}`}
                >
                  <Icon size={20} className={isCurrentPage ? 'text-white' : 'text-sky-700'} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}

      {loading && <LoadingDestinations />}

      {!loading && error && (
        <section className="container-wide py-16 text-center" role="alert">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={40} aria-hidden="true" />
          <h2 className="text-xl font-semibold text-navy-900">Unable to load destinations.</h2>
          <p className="mt-2 text-navy-500">Please check your connection and try again.</p>
          <button
            type="button"
            onClick={loadDestinations}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-sky-700 px-5 py-2.5 font-semibold text-sky-800 transition-colors hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
          >
            <RefreshCw size={16} aria-hidden="true" /> Retry
          </button>
        </section>
      )}

      {!loading && !error && destinations.length === 0 && (
        <section className="container-wide py-10 md:py-14" aria-labelledby="india-coming-soon-heading">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/80 px-6 py-12 text-center shadow-lg shadow-navy-950/5 sm:px-12 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm ring-1 ring-sky-100">
              <Compass size={34} strokeWidth={1.7} aria-hidden="true" />
            </div>
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
              <Sparkles size={15} aria-hidden="true" /> Explore India
            </p>
            <h2 id="india-coming-soon-heading" className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold leading-tight text-navy-900 sm:text-4xl md:text-5xl">
              All Destinations <span className="text-sky-700">Coming Soon</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy-600 sm:text-lg">
              We’re preparing an inspiring collection of destinations across incredible India.
              From majestic mountains and serene beaches to royal heritage, spiritual journeys,
              wildlife adventures and hidden gems, exciting destinations will be available soon.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/packages?destination=India"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-700 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
              >
                View India Packages <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/india"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white/80 px-6 py-3 font-semibold text-navy-700 transition-colors hover:border-sky-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
              >
                Back to India <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && destinations.length > 0 && (
        <>
          <section className="container-wide py-7 md:py-9">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-800">Explore India</p>
                <h2 className="mt-1 text-xl font-bold text-navy-900 sm:text-2xl" aria-live="polite">
                  {hasActiveFilters
                    ? `${filteredDestinations.length} of ${pluralizeDestinations(destinations.length)}`
                    : pluralizeDestinations(destinations.length)}
                </h2>
              </div>
              <label className="flex items-center gap-2 text-sm text-navy-600">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={event => changeFilter(setSortBy)(event.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-navy-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="default">Default order</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                </select>
              </label>
            </div>

            {filteredDestinations.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-14 text-center" role="status">
                <Compass className="mx-auto mb-3 text-sky-700" size={38} aria-hidden="true" />
                <h3 className="text-xl font-semibold text-navy-900">No destinations found</h3>
                <p className="mt-2 text-navy-500">Try changing your search or filters.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {visibleDestinations.map((destination, index) => (
                    <DestinationCard
                      key={destination.id || destination.slug || `${destination.name}-${index}`}
                      destination={destination}
                      detailHref={destination.slug || destination.id ? `/destinations/${destination.slug || destination.id}` : ''}
                      variant="india"
                      region={destination.state}
                      tags={getDestinationFeatureTags(destination, 3)}
                    />
                  ))}
                </div>
                <Pagination currentPage={safePage} totalPages={totalPages} onChange={setCurrentPage} />
              </>
            )}
          </section>

          <section className="relative overflow-hidden border-t border-sky-100 bg-sky-50">
            <div className="absolute inset-0">
              <img src={CTA_IMAGE} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-sky-50/90 to-white/90" />
            </div>
            <div className="relative container-wide py-10 md:py-12">
              <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[1.05fr_1.4fr_auto]">
                <div className="text-center lg:text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">Your next journey starts here</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Discover Incredible India</h2>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">
                    From snow-capped mountains to golden beaches, ancient temples to vibrant cities – explore India’s amazing destinations.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                  <div className="flex flex-col items-center gap-1">
                    <MapPin className="text-orange-600" size={26} aria-hidden="true" />
                    <strong className="text-xl text-navy-900">{destinations.length}</strong>
                    <span className="text-xs text-navy-600">Destinations</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Briefcase className="text-sky-700" size={26} aria-hidden="true" />
                    <strong className="text-sm text-navy-900">Customized</strong>
                    <span className="text-xs text-navy-600">Tour Packages</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Landmark className="text-emerald-700" size={26} aria-hidden="true" />
                    <strong className="text-sm text-navy-900">Expert</strong>
                    <span className="text-xs text-navy-600">Travel Guidance</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Heart className="text-rose-500" size={26} aria-hidden="true" />
                    <strong className="text-sm text-navy-900">Memorable</strong>
                    <span className="text-xs text-navy-600">Experiences</span>
                  </div>
                </div>

                <Link
                  to="/plan-trip"
                  className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
                >
                  Plan Your Trip Now <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
