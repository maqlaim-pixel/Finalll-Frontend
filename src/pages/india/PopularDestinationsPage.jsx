import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, Loader2, AlertCircle, RefreshCw, Landmark, Briefcase, Heart } from 'lucide-react'
import api from '../../services/api'
import SEOHead from '../../components/common/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import { getPublishedIndiaDestinations } from '../../utils/heritageDestinations'

// Hero / decorative imagery already used across the TravelVista India pages
const HERO_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&h=700&fit=crop'
const CTA_BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=700&fit=crop'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600'

const BADGE_COLORS = [
  'bg-purple-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-600',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-amber-600',
]

// Badge uses real category/type data only — never invented categories.
function badgeLabel(d) {
  const raw = (d.category || d.type || '').trim()
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : ''
}

function badgeColorClass(label) {
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = (hash * 31 + label.charCodeAt(i)) % 997
  return BADGE_COLORS[hash % BADGE_COLORS.length]
}

// Feature tags from the destination's real "highlights" data.
// Accepts a JSON array (of strings or {title|name} objects) or plain comma/pipe separated text.
function parseTagList(value) {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map(t => (typeof t === 'string' ? t : t?.title || t?.name)).filter(Boolean)
  }
  const str = String(value).trim()
  if (str.startsWith('[')) {
    try {
      const arr = JSON.parse(str)
      if (Array.isArray(arr)) {
        return arr.map(t => (typeof t === 'string' ? t : t?.title || t?.name)).filter(Boolean)
      }
    } catch {
      // not valid JSON — fall through to plain-text parsing
    }
  }
  return str.split(/[,|]/).map(s => s.trim()).filter(Boolean)
}

function countJsonItems(value) {
  if (!value) return 0
  if (Array.isArray(value)) return value.length
  const str = String(value).trim()
  if (!str.startsWith('[')) return 0
  try {
    const arr = JSON.parse(str)
    return Array.isArray(arr) ? arr.length : 0
  } catch {
    return 0
  }
}

export default function PopularDestinationsPage() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDestinations = useCallback(() => {
    setLoading(true)
    setError('')
    api.get('/destinations?status=published')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : []
        setDestinations(getPublishedIndiaDestinations(list))
      })
      .catch(() => setError('We could not load the destinations right now. Please check your connection and try again.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadDestinations()
  }, [loadDestinations])

  // Real counts derived from the loaded India destinations
  const attractionCount = destinations.reduce((sum, d) => sum + countJsonItems(d.attractions), 0)

  return (
    <div className="bg-white">
      <SEOHead
        title="Popular Destinations in India | TravelVista"
        description="From royal heritage and serene backwaters to pristine beaches and spiritual journeys, explore the most loved destinations across India."
      />

      {/* ═══ HERO ═══ */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Taj Mahal at sunrise — India" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/80 to-navy-900/30" />
        </div>

        <div className="relative container-wide py-16 md:py-24">
          <Breadcrumb light items={[{ label: 'India', href: '/india' }, { label: 'Popular Destinations' }]} />

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-tight">
            <span className="block">Popular Destinations</span>
            <span className="block">in India</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
            From royal heritage and serene backwaters to pristine beaches and spiritual journeys,
            explore the most loved destinations across India.
          </p>
        </div>
      </section>

      {/* ═══ DESTINATION GRID ═══ */}
      <section className="container-wide py-12 md:py-16">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-sky-600" size={32} />
            <span className="ml-3 text-navy-500">Loading destinations...</span>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto text-red-400 mb-4" size={40} />
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={loadDestinations}
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-sky-500 text-sky-600 font-semibold hover:bg-sky-600 hover:text-white transition-colors"
            >
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && destinations.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="mx-auto text-navy-300 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-navy-700">No destinations are currently available for India.</h2>
            <p className="text-navy-500 mt-2">Please check back soon — new destinations are added regularly.</p>
          </div>
        )}

        {!loading && !error && destinations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {destinations.map(d => {
              const name = d.name || 'Destination'
              const badge = badgeLabel(d)
              const tags = parseTagList(d.highlights)

              return (
                <Link
                  key={d.id || d.slug}
                  to={`/destinations/${d.slug || d.id}`}
                  className="group flex flex-col bg-white rounded-2xl border border-navy-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image + category badge */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={d.image || FALLBACK_IMAGE}
                      alt={name}
                      loading="lazy"
                      onError={e => { if (e.currentTarget.src !== FALLBACK_IMAGE) e.currentTarget.src = FALLBACK_IMAGE }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {badge && (
                      <span className={`absolute top-4 left-4 ${badgeColorClass(badge)} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md`}>
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h2 className="flex items-center gap-1.5 text-lg font-bold text-navy-900">
                      <MapPin size={16} className="text-sky-600 shrink-0" />
                      {name}
                    </h2>

                    {d.tagline && (
                      <p className="mt-1 text-sm text-navy-500">{d.tagline}</p>
                    )}

                    {tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-[13px] text-navy-500">
                        {tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="flex items-center gap-2">
                            {i > 0 && <span aria-hidden="true" className="text-navy-200">|</span>}
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-5">
                      <span className="flex items-center justify-center gap-2 w-full rounded-xl border border-sky-500 px-4 py-2.5 text-sm font-semibold text-sky-600 transition-colors duration-200 group-hover:bg-sky-600 group-hover:text-white">
                        Explore {name}
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={CTA_BACKGROUND_IMAGE} alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/90" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/85 to-sky-50/90" />
        </div>

        <div className="relative container-wide py-14 md:py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900">Explore Incredible India</h2>
            <p className="mt-2 text-navy-500">
              Discover diverse landscapes, rich culture and unforgettable experiences.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4 md:divide-x md:divide-navy-100 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-1 text-center">
              <MapPin size={30} className="text-gold-500" />
              <p className="text-2xl font-bold text-navy-900">{destinations.length}</p>
              <p className="text-sm text-navy-500">Destinations</p>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <Landmark size={30} className="text-sky-600" />
              {attractionCount > 0 && (
                <p className="text-2xl font-bold text-navy-900">{attractionCount}</p>
              )}
              <p className="text-sm text-navy-500">Attractions</p>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <Briefcase size={30} className="text-emerald-600" />
              <p className="text-2xl font-bold text-navy-900">Customized</p>
              <p className="text-sm text-navy-500">Packages</p>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <Heart size={30} className="text-rose-500" />
              <p className="text-2xl font-bold text-navy-900">Memorable</p>
              <p className="text-sm text-navy-500">Experiences</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              View All India Packages
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
