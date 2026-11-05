import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Star, Clock, MapPin, ChevronDown, SlidersHorizontal, Grid3X3, List } from 'lucide-react'
import api from '../../services/api'
import PackageCard from '../../components/common/PackageCard'
import ComingSoon from '../../components/common/ComingSoon'

// ═══════════════════════════════════════════════════════════════
// COUNTRY CONFIG — All 12 international package destinations
// ═══════════════════════════════════════════════════════════════
const COUNTRIES = {
  dubai: {
    name: 'Dubai',
    fullName: 'United Arab Emirates',
    emoji: '🇦🇪',
    heroImage: 'https://res.cloudinary.com/goqz2x1l/image/upload/v1793861733/Dubai_Skyline_at_Twilight.png',
    tagline: 'City of Gold & Modern Wonders',
    matchKeywords: ['dubai', 'uae', 'united arab', 'abu dhabi', 'sharjah'],
  },
  thailand: {
    name: 'Thailand',
    fullName: 'Thailand',
    emoji: '🇹🇭',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&h=500&fit=crop',
    tagline: 'Land of Smiles',
    matchKeywords: ['thailand', 'bangkok', 'phuket', 'chiang mai', 'pattaya', 'krabi'],
  },
  bali: {
    name: 'Bali',
    fullName: 'Indonesia (Bali)',
    emoji: '🇮🇩',
    heroImage: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1400&h=500&fit=crop',
    tagline: 'Island of Gods',
    matchKeywords: ['bali', 'indonesia', 'ubud', 'seminyak'],
  },
  singapore: {
    name: 'Singapore',
    fullName: 'Singapore',
    emoji: '🇸🇬',
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1400&h=500&fit=crop',
    tagline: 'Garden City of the Future',
    matchKeywords: ['singapore'],
  },
  maldives: {
    name: 'Maldives',
    fullName: 'Maldives',
    emoji: '🇲🇻',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1400&h=500&fit=crop',
    tagline: 'Tropical Paradise',
    matchKeywords: ['maldives', 'malé', 'male'],
  },
  malaysia: {
    name: 'Malaysia',
    fullName: 'Malaysia',
    emoji: '🇲🇾',
    heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1400&h=500&fit=crop',
    tagline: 'Truly Asia',
    matchKeywords: ['malaysia', 'kuala lumpur', 'langkawi', 'penang'],
  },
  vietnam: {
    name: 'Vietnam',
    fullName: 'Vietnam',
    emoji: '🇻🇳',
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1400&h=500&fit=crop',
    tagline: 'Timeless Charm',
    matchKeywords: ['vietnam', 'hanoi', 'ho chi minh', 'da nang', 'ha long'],
  },
  europe: {
    name: 'Europe',
    fullName: 'Europe',
    emoji: '🇪🇺',
    heroImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&h=500&fit=crop',
    tagline: 'Classic Elegance',
    matchKeywords: ['europe', 'paris', 'rome', 'barcelona', 'amsterdam', 'london', 'prague', 'france', 'italy', 'spain', 'germany'],
  },
  usa: {
    name: 'USA',
    fullName: 'United States of America',
    emoji: '🇺🇸',
    heroImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=1400&h=500&fit=crop',
    tagline: 'The Land of Dreams',
    matchKeywords: ['usa', 'united states', 'new york', 'los angeles', 'las vegas', 'san francisco', 'miami'],
  },
  australia: {
    name: 'Australia',
    fullName: 'Australia',
    emoji: '🇦🇺',
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1400&h=500&fit=crop',
    tagline: 'Land Down Under',
    matchKeywords: ['australia', 'sydney', 'melbourne', 'gold coast', 'cairns'],
  },
  japan: {
    name: 'Japan',
    fullName: 'Japan',
    emoji: '🇯🇵',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&h=500&fit=crop',
    tagline: 'Land of the Rising Sun',
    matchKeywords: ['japan', 'tokyo', 'kyoto', 'osaka'],
  },
  switzerland: {
    name: 'Switzerland',
    fullName: 'Switzerland',
    emoji: '🇨🇭',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=500&fit=crop',
    tagline: 'Heaven on Earth',
    matchKeywords: ['switzerland', 'swiss', 'zurich', 'lucerne', 'interlaken', 'geneva', 'zermatt'],
  },
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: '0-50000', label: 'Under ₹50,000' },
  { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
  { value: '100000-200000', label: '₹1,00,000 - ₹2,00,000' },
  { value: '200000+', label: '₹2,00,000+' },
]

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function InternationalPackagesPage() {
  const { countrySlug } = useParams()
  const country = COUNTRIES[countrySlug]

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceFilter, setPriceFilter] = useState('all')
  const [viewMode, setViewMode] = useState('card')
  const [selectedTypes, setSelectedTypes] = useState([])

  // Fetch packages for this country
  useEffect(() => {
    if (!country) return
    setLoading(true)
    api.get('/packages')
      .then(res => {
        const all = res.data || []
        const keywords = country.matchKeywords
        const filtered = all.filter(p => {
          const searchStr = [p.title, p.destination, p.state, p.country, p.tags]
            .filter(Boolean).join(' ').toLowerCase()
          return keywords.some(k => searchStr.includes(k))
        })
        setPackages(filtered)
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [country])

  // Badge helper
  const getBadge = (pkg) => {
    if (pkg.badge) return pkg.badge
    if (pkg.featured) return 'Popular'
    const tags = (pkg.tags || '').toLowerCase()
    if (tags.includes('luxury')) return 'Luxury'
    if (tags.includes('adventure')) return 'Adventure'
    if (tags.includes('honeymoon')) return 'Honeymoon'
    if (tags.includes('family')) return 'Family'
    if (tags.includes('budget')) return 'Budget'
    return 'International'
  }

  // Filter counts
  const typeCounts = useMemo(() => {
    const counts = {}
    packages.forEach(p => { const badge = getBadge(p); counts[badge] = (counts[badge] || 0) + 1 })
    return counts
  }, [packages])

  // Clear filters
  const clearAll = () => {
    setSearch('')
    setSortBy('newest')
    setPriceFilter('all')
    setSelectedTypes([])
  }

  // Filtered + sorted packages
  const filtered = useMemo(() => {
    let result = [...packages]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.destination?.toLowerCase().includes(q) ||
        p.tags?.toLowerCase().includes(q)
      )
    }

    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(getBadge(p)))
    }

    if (priceFilter !== 'all') {
      const parts = priceFilter.split('-')
      if (priceFilter.endsWith('+')) {
        const min = parseInt(priceFilter.replace('+', ''))
        result = result.filter(p => (p.startingPrice || 0) >= min)
      } else {
        const [min, max] = parts.map(Number)
        result = result.filter(p => { const price = p.startingPrice || 0; return price >= min && price <= max })
      }
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0)); break
      case 'price-high': result.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0)); break
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break
      case 'newest': default: result.sort((a, b) => (b.id || 0) - (a.id || 0)); break
    }

    return result
  }, [packages, search, selectedTypes, priceFilter, sortBy])

  // 404
  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Destination Not Found</h1>
          <p className="text-navy-500 mb-6">The country you're looking for doesn't exist.</p>
          <Link to="/packages" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">Browse All Packages</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative h-[320px] md:h-[400px] overflow-hidden">
        <img src={country.heroImage} alt={country.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <div className="container-wide">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>&gt;</span>
              <Link to="/packages" className="hover:text-white">Packages</Link>
              <span>&gt;</span>
              <span className="text-white font-medium">{country.name} Packages</span>
            </div>
            <p className="text-gold-400 text-sm font-medium mb-2">{country.emoji} {country.tagline}</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">All {country.name} Packages</h1>
            <p className="text-white/80">{packages.length > 0 ? `${packages.length} package${packages.length !== 1 ? 's' : ''} available` : `Curated ${country.name} travel packages`}</p>
          </div>
        </div>
      </section>

      {/* Search + Sort Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="container-wide py-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder={`Search ${country.name} packages...`} value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none" />
            </div>
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-navy-700 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-navy-700 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer">
                {PRICE_RANGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-wide py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar Filters */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-[88px]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-navy-700" />
                  <h3 className="font-bold text-navy-900 text-lg">Filters</h3>
                </div>
                <button onClick={clearAll} className="text-sky-600 hover:text-sky-700 text-sm font-medium">Clear All</button>
              </div>

              {/* Package Type */}
              {Object.keys(typeCounts).length > 0 && (
                <div className="mb-5">
                  <h4 className="font-semibold text-navy-800 text-sm mb-3">Package Type</h4>
                  <div className="space-y-2">
                    {Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() =>
                          setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
                        } className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                        <span className="text-sm text-navy-700 group-hover:text-navy-900 flex-1">{type}</span>
                        <span className="text-sm text-navy-400">{count}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => {}} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <SlidersHorizontal size={16} /> Apply Filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('card')} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'card' ? 'bg-sky-600 text-white' : 'bg-white border border-gray-200 text-navy-600 hover:bg-gray-50'}`}>
                  <Grid3X3 size={16} /> Card View
                </button>
                <button onClick={() => setViewMode('list')} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-sky-600 text-white' : 'bg-white border border-gray-200 text-navy-600 hover:bg-gray-50'}`}>
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
                <p className="text-navy-500">Loading {country.name} packages...</p>
              </div>
            )}

            {/* Card View */}
            {!loading && filtered.length > 0 && viewMode === 'card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
              </div>
            )}

            {/* List View */}
            {!loading && filtered.length > 0 && viewMode === 'list' && (
              <div className="space-y-4">
                {filtered.map(pkg => (
                  <Link key={pkg.id} to={`/packages/${pkg.slug || pkg.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col md:flex-row block">
                    <div className="relative w-full md:w-72 h-56 md:h-auto shrink-0 overflow-hidden">
                      <img src={pkg.coverImage || pkg.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-3 py-1 bg-sky-600 text-white text-xs font-semibold rounded-lg shadow-lg">{getBadge(pkg)}</span>
                    </div>
                    <div className="flex-1 p-5 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-navy-500 mb-2">
                        {pkg.destination && <span className="flex items-center gap-1"><MapPin size={12} className="text-sky-400" /> {pkg.destination}</span>}
                        {pkg.durationDays > 0 && <><span>•</span><span className="flex items-center gap-1"><Clock size={12} /> {pkg.durationDays}D/{pkg.durationNights}N</span></>}
                      </div>
                      <h3 className="font-bold text-navy-900 text-lg mb-1 group-hover:text-sky-600 transition-colors">{pkg.title}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold text-navy-800">{pkg.rating || '4.0'}</span>
                        <span className="text-xs text-navy-400">({pkg.reviewCount || 0} reviews)</span>
                      </div>
                      {pkg.description && <p className="text-sm text-navy-500 mb-3 line-clamp-2">{pkg.description}</p>}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                        <div>
                          <span className="text-xl font-bold text-sky-600">₹{Number(pkg.startingPrice || 0).toLocaleString('en-IN')}</span>
                          <span className="text-xs text-navy-400 ml-1">/person</span>
                        </div>
                        <span className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">View Details</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Empty — No packages at all */}
            {!loading && packages.length === 0 && (
              <ComingSoon categoryName={`${country.name} Packages`} icon={country.emoji} />
            )}

            {/* Empty — Filters returned nothing */}
            {!loading && packages.length > 0 && filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-navy-700 mb-2">No {country.name} packages match your filters</h3>
                <p className="text-navy-500 mb-4">Try adjusting your search or filter criteria</p>
                <button onClick={clearAll} className="text-sky-600 hover:text-sky-700 font-medium">Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sky-600 to-sky-700 py-12 mt-8">
        <div className="container-wide text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Can't Find the Right {country.name} Package?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Our travel experts will create a custom itinerary just for you.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="bg-white text-sky-700 hover:bg-sky-50 px-8 py-3 rounded-xl font-bold transition-colors">Contact Us</Link>
            <Link to="/plan-trip" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-bold transition-colors">Plan My Trip</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
