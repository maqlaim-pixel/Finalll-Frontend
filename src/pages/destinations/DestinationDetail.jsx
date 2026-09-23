import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Star, Clock, MapPin, ChevronLeft, ChevronRight, Phone, Mail, Send, ArrowRight, Heart, Shield, Award, Calendar, Thermometer, Plane, Train, Languages, Camera, Music, Mountain, Sparkles, Car, Globe, Navigation } from 'lucide-react'
import api from '../../services/api'
import { parseImageList, resolveImageUrl } from '../../utils/imageUtils'

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&h=600&fit=crop'

const ICON_MAP = {
  calendar: Calendar, clock: Clock, thermometer: Thermometer, plane: Plane, train: Train,
  languages: Languages, star: Star, car: Car, award: Award, mountain: Mountain,
  sparkles: Sparkles, music: Music, camera: Camera, globe: Globe, navigation: Navigation,
}

function getIcon(name) { return ICON_MAP[name] || Star }

export default function DestinationDetail() {
  const { slug } = useParams()
  const [dest, setDest] = useState(null)
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeTab, setActiveTab] = useState('about')
  const [brokenHeroSlides, setBrokenHeroSlides] = useState({})
  const [brokenFallbackImage, setBrokenFallbackImage] = useState(false)
  const timerRef = useRef(null)
  const sectionRefs = {
    about: useRef(null), attractions: useRef(null), experiences: useRef(null),
    packages: useRef(null), highlights: useRef(null), quickinfo: useRef(null),
  }

  useEffect(() => {
    setLoading(true)
    setBrokenHeroSlides({})
    setBrokenFallbackImage(false)
    api.get(`/destinations/slug/${slug}`)
      .then(res => {
        console.log('[Destination] Public API response destination:', res.data?.destination || res.data)
        console.log('[Destination] heroImages from API:', res.data?.destination?.heroImages)
        setDest(res.data.destination)
        setPackages(res.data.packages || [])
      })
      .catch(() => setDest(null))
      .finally(() => setLoading(false))
  }, [slug])

  // Hero carousel auto-advance
  useEffect(() => {
    if (!dest) return
    const images = parseImageList(dest.heroImages)
    if (images.length <= 1) return
    timerRef.current = setInterval(() => setActiveSlide(s => (s + 1) % images.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [dest])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-navy-500">Loading destination...</p>
      </div>
    </div>
  )

  if (!dest) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy-900 mb-4">Destination Not Found</h1>
        <Link to="/destinations" className="text-sky-600 hover:underline">Browse All Destinations →</Link>
      </div>
    </div>
  )

  const heroImages = parseImageList(dest.heroImages)
  console.log('[Destination] Final public hero image URL(s):', heroImages)
  const fallbackHeroImage = resolveImageUrl(dest.image) || DEFAULT_HERO_IMAGE
  const attractions = parseJson(dest.attractions).filter(a => a.isActive !== false)
  const experiences = parseJson(dest.experiences).filter(e => e.isActive !== false)
  const highlights = parseJson(dest.destinationHighlights).filter(h => h.isActive !== false)
  const quickInfo = parseJson(dest.quickInfo).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

  const goToSlide = (i) => {
    setActiveSlide(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActiveSlide(s => (s + 1) % heroImages.length), 5000)
  }

  const scrollTo = (key) => {
    setActiveTab(key)
    sectionRefs[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const tabs = []
  if (dest.showAttractions && attractions.length > 0) tabs.push({ key: 'attractions', label: 'Top Attractions' })
  if (dest.showExperiences && experiences.length > 0) tabs.push({ key: 'experiences', label: 'Food & Experiences' })
  if (dest.showPackages) tabs.push({ key: 'packages', label: 'Packages' })
  if (dest.showHighlights && highlights.length > 0) tabs.push({ key: 'highlights', label: 'Highlights' })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ═══ HERO CAROUSEL ═══ */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-navy-900">
        {heroImages.length > 0 ? heroImages.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* If a hero entry fails to load (e.g. legacy /api/images/… record that 404s), swap in the safe default instead of showing a broken image */}
            <img
              src={brokenHeroSlides[i] ? DEFAULT_HERO_IMAGE : img}
              alt={dest.heroTitle || dest.name}
              className="w-full h-full object-cover"
              onError={() => !brokenHeroSlides[i] && setBrokenHeroSlides(prev => ({ ...prev, [i]: true }))}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        )) : (
          <div className="absolute inset-0">
            <img
              src={brokenFallbackImage ? DEFAULT_HERO_IMAGE : fallbackHeroImage}
              alt={dest.name}
              className="w-full h-full object-cover"
              onError={() => setBrokenFallbackImage(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white z-10">
          <div className="container-wide max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
              <Link to="/" className="hover:text-white">Home</Link> <span>›</span>
              <Link to="/destinations" className="hover:text-white">India</Link> <span>›</span>
              <span className="text-white">{dest.name}</span>
            </div>
            <p className="text-amber-400 text-sm font-semibold mb-2 uppercase tracking-wider">📍 {dest.country || 'India'}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 drop-shadow-lg">
              {dest.heroTitle || dest.name}
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mb-4 drop-shadow">
              {dest.heroSubtitle || dest.tagline || dest.shortDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              {dest.bestTime && <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">📅 {dest.bestTime}</span>}
              {dest.avgTemp && <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">🌡 {dest.avgTemp}</span>}
              {dest.languages && <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">🗣 {dest.languages}</span>}
            </div>
            {dest.heroCtaText && (
              <Link to={dest.heroCtaUrl || '/packages'} className="mt-5 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                {dest.heroCtaText} <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
        {heroImages.length > 1 && (
          <>
            <button onClick={() => goToSlide((activeSlide - 1 + heroImages.length) % heroImages.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm z-10"><ChevronLeft size={24} /></button>
            <button onClick={() => goToSlide((activeSlide + 1) % heroImages.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm z-10"><ChevronRight size={24} /></button>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroImages.map((_, i) => <button key={i} onClick={() => goToSlide(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeSlide ? 'bg-white' : 'bg-white/40'}`} />)}
            </div>
          </>
        )}
      </section>

      {/* ═══ STICKY NAV TABS ═══ */}
      {tabs.length > 0 && (
        <div className="bg-white border-b border-gray-200 sticky top-20 z-30">
          <div className="container-wide max-w-6xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-3">
              {tabs.map(t => (
                <button key={t.key} onClick={() => scrollTo(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.key ? 'bg-sky-600 text-white' : 'text-navy-600 hover:bg-gray-100'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="container-wide max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Column */}
          <div className="flex-1 min-w-0">

            {/* ═══ ABOUT ═══ */}
            {(dest.aboutTitle || dest.aboutContent) && (
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900 mb-4">{dest.aboutTitle || `About ${dest.name}`}</h2>
                {dest.aboutImage && dest.aboutImagePosition === 'left' && (
                  <img src={dest.aboutImage} alt={dest.name} className="w-full rounded-2xl mb-4 object-cover h-64" />
                )}
                <p className="text-navy-600 leading-relaxed whitespace-pre-line">{dest.aboutContent || dest.description}</p>
                {dest.aboutImage && dest.aboutImagePosition === 'right' && (
                  <img src={dest.aboutImage} alt={dest.name} className="w-full rounded-2xl mt-4 object-cover h-64" />
                )}
              </section>
            )}

            {/* ═══ TOP ATTRACTIONS ═══ */}
            {dest.showAttractions && attractions.length > 0 && (
              <section ref={sectionRefs.attractions} className="mb-10 scroll-mt-40">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900 mb-6">Top Attractions in {dest.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {attractions.map((a, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100">
                      {a.image && <div className="aspect-[4/3] overflow-hidden"><img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>}
                      <div className="p-4">
                        <h3 className="font-bold text-navy-900 mb-1 group-hover:text-sky-600 transition-colors">{a.title}</h3>
                        {a.location && <p className="text-xs text-sky-500 mb-2 flex items-center gap-1"><MapPin size={12} /> {a.location}</p>}
                        {a.description && <p className="text-sm text-navy-500 line-clamp-2">{a.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ═══ FOOD & LOCAL EXPERIENCES ═══ */}
            {dest.showExperiences && experiences.length > 0 && (
              <section ref={sectionRefs.experiences} className="mb-10 scroll-mt-40">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900 mb-6">🍽️ Food & Local Experiences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {experiences.map((e, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                      <div className="flex items-start gap-4">
                        {e.image && <img src={e.image} alt={e.title} className="w-20 h-20 rounded-lg object-cover shrink-0" loading="lazy" />}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {e.category && <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">{e.category}</span>}
                            {e.price && <span className="text-xs text-navy-500">{e.price}</span>}
                          </div>
                          <h3 className="font-bold text-navy-900 group-hover:text-sky-600 transition-colors">{e.title}</h3>
                          {e.description && <p className="text-sm text-navy-500 mt-1 line-clamp-2">{e.description}</p>}
                          <div className="flex gap-3 mt-2 text-xs text-navy-400">
                            {e.duration && <span>⏱ {e.duration}</span>}
                            {e.location && <span>📍 {e.location}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ═══ HIGHLIGHTS ═══ */}
            {dest.showHighlights && highlights.length > 0 && (
              <section ref={sectionRefs.highlights} className="mb-10 scroll-mt-40">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900 mb-6">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlights.map((h, i) => {
                    const Icon = getIcon(h.icon)
                    return (
                      <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="bg-emerald-100 p-2 rounded-lg shrink-0"><Icon size={18} className="text-emerald-600" /></div>
                        <div>
                          <h4 className="font-semibold text-navy-900 text-sm">{h.title}</h4>
                          {h.description && <p className="text-xs text-navy-500 mt-0.5">{h.description}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ═══ PACKAGES ═══ */}
            {dest.showPackages && (
              <section ref={sectionRefs.packages} className="mb-10 scroll-mt-40">
                {packages.length > 0 ? (
                  <>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900 mb-6">Packages in {dest.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {packages.map((p, i) => (
                        <Link key={i} to={`/packages/${p.slug || p.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group block">
                          {p.cover_image && <div className="aspect-[16/9] overflow-hidden"><img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                          <div className="p-5">
                            <p className="text-xs text-navy-500 mb-1 flex items-center gap-1"><MapPin size={12} /> {p.destination || p.state} · <Clock size={12} /> {p.duration_days}D/{p.duration_nights}N</p>
                            <h3 className="font-bold text-navy-900 mb-2 group-hover:text-sky-600 transition-colors">{p.title}</h3>
                            <div className="flex items-center gap-1 mb-3"><Star size={14} className="text-amber-400 fill-amber-400" /><span className="text-sm font-semibold">{p.rating || '4.0'}</span><span className="text-xs text-navy-400">({p.review_count || 0} reviews)</span></div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <span className="text-lg font-bold text-sky-600">₹{Number(p.starting_price).toLocaleString()}<span className="text-xs text-navy-400 ml-1">/person</span></span>
                              <span className="text-sm font-semibold text-sky-600 border border-sky-200 px-4 py-2 rounded-lg group-hover:bg-sky-50 transition-colors">View Details</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : dest.packagesComingSoon ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                    <div className="text-5xl mb-4">🧳</div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">Packages Coming Soon</h3>
                    <p className="text-navy-500 max-w-md mx-auto mb-5">{dest.packagesComingSoonText || `Curated travel packages for ${dest.name} are coming soon.`}</p>
                    <Link to="/packages" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                      Explore More Packages <ArrowRight size={18} />
                    </Link>
                  </div>
                ) : null}
              </section>
            )}
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-5">
              {/* Packages in this destination */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-navy-900 text-lg mb-3">Packages in {dest.name}</h3>
                {packages.length > 0 ? (
                  <>
                    <p className="text-sm text-navy-500 mb-3">{packages.length} package{packages.length !== 1 ? 's' : ''} available</p>
                    <Link to={`/packages?destination=${encodeURIComponent(dest.name)}`} className="block w-full bg-sky-600 hover:bg-sky-700 text-white text-center py-3 rounded-xl font-semibold transition-colors">
                      View All Packages →
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-navy-500 mb-3">No packages yet for {dest.name}. Check back soon!</p>
                    <Link to="/packages" className="block w-full bg-sky-600 hover:bg-sky-700 text-white text-center py-3 rounded-xl font-semibold transition-colors">
                      View All Packages →
                    </Link>
                  </>
                )}
              </div>

              {/* Quick Info */}
              {dest.showQuickInfo && quickInfo.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-navy-900 text-lg mb-4">Quick Info</h3>
                  <div className="space-y-3">
                    {quickInfo.map((q, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-navy-500 flex items-center gap-2">
                          {q.icon && (() => { const I = getIcon(q.icon); return <I size={14} className="text-sky-500" /> })()}
                          {q.label}
                        </span>
                        <span className="text-navy-900 font-medium text-right">{q.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plan Trip CTA */}
              <Link to="/contact" className="block bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-2xl p-5 text-center transition-all shadow-md hover:shadow-lg">
                <p className="font-bold text-lg mb-1">🗺️ Plan Your {dest.name} Trip</p>
                <p className="text-sky-200 text-sm">Talk to our travel experts</p>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function parseJson(str) {
  if (!str) return []
  try { const arr = JSON.parse(str); return Array.isArray(arr) ? arr : [] } catch { return [] }
}
