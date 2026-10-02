import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Star, Clock, MapPin, Heart, SlidersHorizontal, Grid3X3, List, ChevronDown, ChevronUp, X } from 'lucide-react'
import api from '../../services/api'
import ComingSoon from '../../components/common/ComingSoon'
import { isDestinationWeddingPackage } from '../../utils/weddingPackages'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
]

const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: '0-10000', label: 'Under ₹10,000' },
  { value: '10000-20000', label: '₹10,000 - ₹20,000' },
  { value: '20000-50000', label: '₹20,000 - ₹50,000' },
  { value: '50000+', label: '₹50,000+' },
]

const BADGE_STYLES = {
  Domestic: 'bg-sky-500',
  International: 'bg-purple-500',
  Adventure: 'bg-orange-500',
  Honeymoon: 'bg-rose-500',
  Family: 'bg-pink-500',
  Popular: 'bg-emerald-500',
  'Best Seller': 'bg-amber-500',
  Trending: 'bg-blue-500',
  Luxury: 'bg-purple-500',
  Spiritual: 'bg-rose-500',
  Budget: 'bg-teal-500',
  Beach: 'bg-cyan-500',
}

function getBadge(pkg) {
  if (pkg.badge) return pkg.badge
  if (pkg.category === 'international') return 'International'
  if (pkg.category === 'domestic') return 'Domestic'
  if (pkg.featured) return 'Popular'
  const tags = (pkg.tags || '').toLowerCase()
  if (tags.includes('adventure')) return 'Adventure'
  if (tags.includes('honeymoon')) return 'Honeymoon'
  if (tags.includes('family')) return 'Family'
  if (tags.includes('luxury')) return 'Luxury'
  if (tags.includes('spiritual')) return 'Spiritual'
  if (tags.includes('beach')) return 'Beach'
  return 'Domestic'
}

function getInclusions(pkg) {
  const inc = []
  if (pkg.inclusions) {
    const list = Array.isArray(pkg.inclusions) ? pkg.inclusions : pkg.inclusions.split(',').map(s => s.trim())
    const lower = list.map(s => s.toLowerCase())
    if (lower.some(s => s.includes('meal') || s.includes('food') || s.includes('breakfast') || s.includes('lunch') || s.includes('dinner'))) inc.push({ icon: '🍽️', label: 'Meals' })
    if (lower.some(s => s.includes('transport') || s.includes('transfer') || s.includes('flight') || s.includes('train') || s.includes('bus'))) inc.push({ icon: '🚌', label: 'Transport' })
    if (lower.some(s => s.includes('hotel') || s.includes('stay') || s.includes('accommodation') || s.includes('resort'))) inc.push({ icon: '🏨', label: 'Hotel' })
    if (lower.some(s => s.includes('sightseeing') || s.includes('tour') || s.includes('visit'))) inc.push({ icon: '🗺️', label: 'Sightseeing' })
  }
  return inc
}

export default function PackagesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const destFilter = searchParams.get('destination') || ''
  const normalizedDestFilter = destFilter.trim().toLowerCase()
  const weddingOnly = searchParams.get('packageType')?.trim().toLowerCase() === 'wedding'

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceFilter, setPriceFilter] = useState('all')
  const [viewMode, setViewMode] = useState('card')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedDests, setSelectedDests] = useState([])
  const [showAllDests, setShowAllDests] = useState(false)
  const [priceSliderRange, setPriceSliderRange] = useState([0, 50000])
  const [applyFilters, setApplyFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/packages')
      .then(res => setPackages(res.data || []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [])

  // Compute filter counts from data
  const typeCounts = useMemo(() => {
    const counts = {}
    packages.forEach(p => {
      const badge = getBadge(p)
      counts[badge] = (counts[badge] || 0) + 1
    })
    return counts
  }, [packages])

  const destCounts = useMemo(() => {
    const counts = {}
    packages.forEach(p => {
      const dest = p.destination || p.state || ''
      if (dest) counts[dest] = (counts[dest] || 0) + 1
    })
    // Sort by count descending
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [packages])

  const displayedDests = showAllDests ? destCounts : destCounts.slice(0, 5)

  const priceBounds = useMemo(() => {
    if (packages.length === 0) return [0, 50000]
    const prices = packages.map(p => p.startingPrice || 0).filter(p => p > 0)
    return [0, Math.ceil(Math.max(...prices, 50000) / 10000) * 10000]
  }, [packages])

  // Toggle type filter
  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  // Toggle destination filter
  const toggleDest = (dest) => {
    setSelectedDests(prev =>
      prev.includes(dest) ? prev.filter(d => d !== dest) : [...prev, dest]
    )
  }

  // Clear all filters
  const clearAll = () => {
    setSearch('')
    setSortBy('newest')
    setPriceFilter('all')
    setSelectedTypes([])
    setSelectedDests([])
    setPriceSliderRange([0, 50000])
  }

  // Filtered + sorted packages
  const filtered = useMemo(() => {
    let result = [...packages]

    // Optional destination query filter (used by India landing pages).
    if (normalizedDestFilter) {
      result = result.filter(pkg => {
        const country = String(pkg.country || '').trim().toLowerCase()
        const category = String(pkg.category || '').trim().toLowerCase()
        const destination = String(pkg.destination || '').trim().toLowerCase()
        const state = String(pkg.state || '').trim().toLowerCase()

        if (normalizedDestFilter === 'india') {
          return country === 'india' || category === 'domestic'
        }
        if (normalizedDestFilter === 'international') {
          return category === 'international' || (country && country !== 'india')
        }

        if (weddingOnly) {
          const requestedDestination = destFilter.trim()
          const weddingDestinations = /^(jammu\s*(?:&|and)\s*kashmir|kashmir)$/i.test(requestedDestination)
            ? ['Jammu & Kashmir', 'Jammu and Kashmir', 'Kashmir']
            : /^(ayodhya|uttar\s*pradesh)$/i.test(requestedDestination)
              ? ['Ayodhya', 'Uttar Pradesh']
              : /^(varanasi|banaras|kashi|uttar\s*pradesh)$/i.test(requestedDestination)
                ? ['Varanasi', 'Banaras', 'Kashi', 'Uttar Pradesh']
                : destFilter
          return String(pkg.status || '').toLowerCase() === 'published' &&
            pkg.isActive !== false && isDestinationWeddingPackage(pkg, weddingDestinations)
        }
        return destination === normalizedDestFilter || state === normalizedDestFilter
      })
    }

    // Text search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.destination?.toLowerCase().includes(q) ||
        p.state?.toLowerCase().includes(q) ||
        p.tags?.toLowerCase().includes(q)
      )
    }

    // Type filter (from sidebar checkboxes)
    if (selectedTypes.length > 0) {
      result = result.filter(p => {
        const badge = getBadge(p)
        return selectedTypes.includes(badge)
      })
    }

    // Destination filter (from sidebar checkboxes)
    if (selectedDests.length > 0) {
      result = result.filter(p => {
        const dest = p.destination || p.state || ''
        return selectedDests.includes(dest)
      })
    }

    // Price range dropdown
    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(v => v === '' ? Infinity : parseInt(v.replace('+', '')))
      result = result.filter(p => {
        const price = p.startingPrice || 0
        if (priceFilter.endsWith('+')) return price >= min
        return price >= min && price <= max
      })
    }

    // Wedding lead listings should show every matched package unless the user explicitly uses the price dropdown.
    if (!weddingOnly) {
      result = result.filter(p => {
        const price = p.startingPrice || 0
        return price >= priceSliderRange[0] && price <= priceSliderRange[1]
      })
    }

    // Sort
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0)); break
      case 'price-high': result.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0)); break
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break
      case 'popular': result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)); break
      case 'newest': default: result.sort((a, b) => (b.id || 0) - (a.id || 0)); break
    }

    return result
  }, [packages, search, selectedTypes, selectedDests, priceFilter, priceSliderRange, sortBy, normalizedDestFilter, weddingOnly, destFilter])

  const formatPrice = (p) => p ? `₹${Number(p).toLocaleString('en-IN')}` : ''
  const fallbackImg = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb + Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-wide py-6">
          <div className="flex items-center gap-2 text-sm text-navy-500 mb-3">
            <Link to="/" className="hover:text-sky-600">Home</Link>
            <span>&gt;</span>
            <span className="text-navy-800 font-medium">India Packages</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-navy-900">All India Packages</h1>
              <p className="text-navy-500 mt-1">Explore the best travel packages across incredible India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Sort + Price Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-wide py-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages, destinations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-navy-700 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Price Filter */}
            <div className="relative">
              <select
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-navy-700 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
              >
                {PRICE_RANGES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-wide py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ═══ SIDEBAR FILTERS ═══ */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              {/* Filters Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-navy-700" />
                  <h3 className="font-bold text-navy-900 text-lg">Filters</h3>
                </div>
                <button onClick={clearAll} className="text-sky-600 hover:text-sky-700 text-sm font-medium">
                  Clear All
                </button>
              </div>

              {/* Package Type */}
              <div className="mb-5">
                <h4 className="font-semibold text-navy-800 text-sm mb-3">Package Type</h4>
                <div className="space-y-2">
                  {Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-sm text-navy-700 group-hover:text-navy-900 flex-1">{type}</span>
                      <span className="text-sm text-navy-400">{count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 mb-5" />

              {/* Destination */}
              <div className="mb-5">
                <h4 className="font-semibold text-navy-800 text-sm mb-3">Destination</h4>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search destination..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  {displayedDests.map(([dest, count]) => (
                    <label key={dest} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedDests.includes(dest)}
                        onChange={() => toggleDest(dest)}
                        className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-sm text-navy-700 group-hover:text-navy-900 flex-1">{dest}</span>
                      <span className="text-sm text-navy-400">{count}</span>
                    </label>
                  ))}
                </div>
                {destCounts.length > 5 && (
                  <button
                    onClick={() => setShowAllDests(!showAllDests)}
                    className="mt-2 text-sky-600 hover:text-sky-700 text-sm font-medium flex items-center gap-1"
                  >
                    {showAllDests ? 'Show Less' : `Show More`} <ChevronDown size={14} className={showAllDests ? 'rotate-180' : ''} />
                  </button>
                )}
              </div>

              <hr className="border-gray-100 mb-5" />

              {/* Price Range Slider */}
              <div className="mb-5">
                <h4 className="font-semibold text-navy-800 text-sm mb-3">Price Range</h4>
                <div className="px-1">
                  <input
                    type="range"
                    min={priceBounds[0]}
                    max={priceBounds[1]}
                    step={1000}
                    value={priceSliderRange[1]}
                    onChange={e => setPriceSliderRange([priceBounds[0], parseInt(e.target.value)])}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-xs text-navy-500 mt-1">
                    <span>{formatPrice(priceSliderRange[0])}</span>
                    <span>{formatPrice(priceSliderRange[1])}{priceSliderRange[1] >= priceBounds[1] ? '+' : ''}</span>
                  </div>
                  <p className="text-xs text-navy-400 mt-1">
                    Selected Range: {formatPrice(priceSliderRange[0])} - {formatPrice(priceSliderRange[1])}{priceSliderRange[1] >= priceBounds[1] ? '+' : ''}
                  </p>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <SlidersHorizontal size={16} />
                Apply Filters
              </button>
            </div>
          </aside>

          {/* ═══ RESULTS ═══ */}
          <div className="flex-1 min-w-0">
            {/* View Toggle + Count */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('card')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'card'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white border border-gray-200 text-navy-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 size={16} /> Card View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white border border-gray-200 text-navy-600 hover:bg-gray-50'
                  }`}
                >
                  <List size={16} /> List View
                </button>
              </div>
              <p className="text-sm text-navy-600 font-medium">
                <span className="text-navy-900 font-bold">{filtered.length}</span> Package{filtered.length !== 1 ? 's' : ''} Found
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-navy-500">Loading packages...</p>
              </div>
            )}

            {/* Card View */}
            {!loading && viewMode === 'card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(pkg => (
                  <PackageCardView key={pkg.id || pkg.slug} pkg={pkg} fallbackImg={fallbackImg} formatPrice={formatPrice} />
                ))}
              </div>
            )}

            {/* List View */}
            {!loading && viewMode === 'list' && (
              <div className="space-y-4">
                {filtered.map(pkg => (
                  <PackageListView key={pkg.id || pkg.slug} pkg={pkg} fallbackImg={fallbackImg} formatPrice={formatPrice} />
                ))}
              </div>
            )}

            {/* Empty wedding-category results use the site's existing Coming Soon experience. */}
            {!loading && weddingOnly && filtered.length === 0 && (
              <ComingSoon
                categoryName={`${destFilter || 'Destination'} Wedding`}
                description="Our destination wedding packages are being curated. Contact us for a personalized wedding plan."
                icon="💍"
              />
            )}

            {/* Empty — No packages in DB at all */}
            {!loading && !weddingOnly && packages.length === 0 && (
              <ComingSoon
                categoryName="India"
                description="We're curating amazing travel packages across India. Check back soon!"
                icon="🌍"
              />
            )}

            {/* Empty — Filters returned nothing */}
            {!loading && !weddingOnly && packages.length > 0 && filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-navy-700 mb-2">No packages found</h3>
                <p className="text-navy-500 mb-4">Try adjusting your filters or search terms</p>
                <button onClick={clearAll} className="text-sky-600 hover:text-sky-700 font-medium">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══ CARD VIEW ═══ */
function PackageCardView({ pkg, fallbackImg, formatPrice }) {
  const [wishlisted, setWishlisted] = useState(false)
  const badge = getBadge(pkg)
  const inclusions = getInclusions(pkg)
  const cities = [pkg.destination, pkg.state].filter(Boolean).join(', ')
  const duration = pkg.durationDays > 0 ? `${pkg.durationDays}D/${pkg.durationNights}N` : ''

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await api.post('/customer/wishlist', { packageId: pkg.id })
      setWishlisted(true)
    } catch {
      setWishlisted(true)
    }
  }

  return (
    <Link to={`/packages/${pkg.slug || pkg.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 block">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={pkg.coverImage || pkg.image || fallbackImg}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 ${BADGE_STYLES[badge] || 'bg-sky-600'} text-white text-xs font-semibold rounded-lg shadow-lg`}>
          {badge}
        </span>

        {/* Heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
            wishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart size={16} className={wishlisted ? 'fill-white' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location + Duration */}
        <div className="flex items-center gap-2 text-xs text-navy-500 mb-2">
          {cities && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-sky-400" /> {cities}
            </span>
          )}
          {duration && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {duration}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-navy-900 text-base mb-2 line-clamp-1 group-hover:text-sky-600 transition-colors">
          {pkg.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-navy-800">{pkg.rating || '4.0'}</span>
          <span className="text-xs text-navy-400">({pkg.reviewCount || 0} reviews)</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-sky-600">{formatPrice(pkg.startingPrice)}</span>
            <span className="text-xs text-navy-400 ml-1">/person</span>
          </div>
          <span className="text-sky-600 hover:text-sky-700 text-sm font-semibold border border-sky-200 px-4 py-2 rounded-lg group-hover:bg-sky-50 transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ═══ LIST VIEW ═══ */
function PackageListView({ pkg, fallbackImg, formatPrice }) {
  const [wishlisted, setWishlisted] = useState(false)
  const badge = getBadge(pkg)
  const inclusions = getInclusions(pkg)
  const cities = [pkg.destination, pkg.state].filter(Boolean).join(', ')
  const duration = pkg.durationDays > 0 ? `${pkg.durationDays}D/${pkg.durationNights}N` : ''

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await api.post('/customer/wishlist', { packageId: pkg.id })
      setWishlisted(true)
    } catch {
      setWishlisted(true)
    }
  }

  return (
    <Link to={`/packages/${pkg.slug || pkg.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col md:flex-row block">
      {/* Image */}
      <div className="relative w-full md:w-72 h-56 md:h-auto shrink-0 overflow-hidden">
        <img
          src={pkg.coverImage || pkg.image || fallbackImg}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 ${BADGE_STYLES[badge] || 'bg-sky-600'} text-white text-xs font-semibold rounded-lg shadow-lg`}>
          {badge}
        </span>

        {/* Heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
            wishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart size={16} className={wishlisted ? 'fill-white' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Location + Duration */}
        <div className="flex items-center gap-2 text-xs text-navy-500 mb-2">
          {cities && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-sky-400" /> {cities}
            </span>
          )}
          {duration && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {duration}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-navy-900 text-lg mb-1 group-hover:text-sky-600 transition-colors">
          {pkg.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-navy-800">{pkg.rating || '4.0'}</span>
          <span className="text-xs text-navy-400">({pkg.reviewCount || 0} reviews)</span>
        </div>

        {/* Description */}
        {pkg.description && (
          <p className="text-sm text-navy-500 mb-3 line-clamp-2">{pkg.description}</p>
        )}

        {/* Inclusions */}
        {inclusions.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 mt-auto">
            {inclusions.map((inc, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-navy-600 bg-gray-50 px-2.5 py-1 rounded-md">
                {inc.icon} {inc.label}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-sky-600">{formatPrice(pkg.startingPrice)}</span>
            <span className="text-xs text-navy-400 ml-1">/person</span>
          </div>
          <span className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}
