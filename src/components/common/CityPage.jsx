import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Clock, Calendar, Plane, Train, Bus, ChevronRight, Camera, ArrowRight, Phone, Mail, Send, Navigation, Building, Utensils, ShoppingBag, Landmark } from 'lucide-react'
import api from '../../services/api'
import { categorizePackages } from '../../utils/distanceUtils'

// Package card component (reused across sections)
function PackageCard({ pkg, city, index }) {
  const tags = ['BEST SELLER', 'POPULAR', 'FAMILY PICK', 'SHORT TRIP']
  const tierBadge = pkg.tier === 'nearby' ? { label: `${pkg.distance} km away`, color: 'bg-green-500' }
    : pkg.tier === 'medium' ? { label: `${pkg.distance} km away`, color: 'bg-amber-500' }
    : pkg.tier === 'long' ? { label: `${pkg.distance} km away`, color: 'bg-red-500' }
    : null

  return (
    <Link key={pkg.id || index} to={`/packages/${pkg.slug || pkg.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      <div className="relative aspect-[16/10] overflow-hidden">
        {pkg.coverImage ? <img src={pkg.coverImage} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-gradient-to-br from-sky-400 to-navy-600 flex items-center justify-center text-white text-2xl">{city.name[0]}</div>}
        <span className="absolute top-3 left-3 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-1 rounded">{tags[index % 4]}</span>
        {tierBadge && <span className={`absolute top-3 right-3 ${tierBadge.color} text-white text-[10px] font-bold px-2 py-1 rounded`}>{tierBadge.label}</span>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-navy-900 text-sm group-hover:text-sky-600 transition-colors">{pkg.title}</h3>
        <p className="text-xs text-navy-500 mt-1">{pkg.durationDays}N / {pkg.durationNights}D</p>
        <p className="text-xs text-navy-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {pkg.destination || city.name}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Hotel', 'Meals', 'Transfers', 'Sightseeing'].map(s => (
            <span key={s} className="text-[10px] text-navy-500 bg-gray-100 px-1.5 py-0.5 rounded">{s}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div>
            <span className="text-lg font-bold text-navy-900">{'\u20B9'}{pkg.startingPrice?.toLocaleString() || '0'}</span>
            <span className="text-[10px] text-navy-500 ml-1">/Person</span>
          </div>
          <span className="text-xs font-medium text-sky-600 group-hover:underline">View Details</span>
        </div>
      </div>
    </Link>
  )
}

// Reusable city page component matching the reference design
export default function CityPage({ city }) {
  const [allPackages, setAllPackages] = useState([])
  const [sections, setSections] = useState({ cityPackages: [], nearby: [], medium: [], longDistance: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/packages').then(res => {
      // Filter to state/country packages
      const statePkgs = res.data.filter(p =>
        p.state?.toLowerCase() === city.state.toLowerCase() ||
        (city.country && (p.country?.toLowerCase() === city.state.toLowerCase() || p.destination?.toLowerCase() === city.state.toLowerCase()))
      )
      // Categorize by distance from this city
      const categorized = categorizePackages(statePkgs, city.name.toLowerCase().replace(/ /g, '-'), city.name)
      setAllPackages(categorized.all)
      setSections(categorized)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [city.name, city.state])

  const hasAnyPackages = allPackages.length > 0

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-navy-900">
        <img src={city.heroImage} alt={city.name} className="absolute inset-0 w-full h-full object-cover object-center" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-wide">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight size={14} />
              {city.country ? (
                <><Link to="/international" className="hover:text-white">International</Link><ChevronRight size={14} /><Link to={`/international/${city.stateSlug}`} className="hover:text-white">{city.state}</Link></>
              ) : (
                <><Link to="/india" className="hover:text-white">India</Link><ChevronRight size={14} /><Link to={`/${city.stateSlug}`} className="hover:text-white">{city.state}</Link></>
              )}
              <ChevronRight size={14} />
              <span className="text-white">{city.name}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{city.name}</h1>
            <p className="text-gold-400 text-lg font-semibold italic mb-3">{city.tagline}</p>
            <p className="text-gray-200 max-w-3xl text-sm md:text-base">{city.description}</p>
            <div className="flex flex-wrap gap-4 mt-5">
              {city.badges.map((b, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white">
                  {b.icon}{b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAV */}
      <section className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container-wide">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {['Top Attractions', 'Things to Do', 'Tour Packages', 'Best Time to Visit', 'How to Reach', 'Travel Guide'].map(tab => (
              <a key={tab} href={`#${tab.toLowerCase().replace(/ /g, '-')}`} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-sky-50 hover:text-sky-600 transition-colors whitespace-nowrap">
                {tab}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TOP ATTRACTIONS */}
      <section className="section-padding" id="top-attractions">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900">Top Attractions in {city.name}</h2>
            </div>
            <span className="text-sky-600 text-sm font-medium cursor-pointer hover:underline flex items-center gap-1">View All Attractions <ArrowRight size={14} /></span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {city.attractions.map((a, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="rounded-xl overflow-hidden aspect-[4/3] mb-3">
                  <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-navy-900 text-sm group-hover:text-sky-600 transition-colors">{a.name}</h3>
                <p className="text-xs text-navy-500 mt-1 line-clamp-2">{a.desc}</p>
                <p className="text-xs text-navy-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {a.area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOUR PACKAGES — Dynamic Distance-Based Discovery */}
      <section className="section-padding bg-gray-50" id="tour-packages">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900">{city.name} Tour Packages</h2>
              <p className="text-navy-500 text-sm mt-1">
                {hasAnyPackages ? `${allPackages.length} package${allPackages.length !== 1 ? 's' : ''} available from ${city.state}` : 'Showing packages from across the state'}</p>
            </div>
            <Link to={`/packages?destination=${city.name}`} className="text-sky-600 text-sm font-medium hover:underline flex items-center gap-1">View All Packages <ArrowRight size={14} /></Link>
          </div>

          {loading ? (
            <div className="text-center py-12"><div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : !hasAnyPackages ? (
            <div className="text-center py-12 bg-white rounded-2xl border">
              <MapPin size={40} className="mx-auto text-navy-300 mb-3" />
              <p className="text-navy-600 font-medium">No packages available yet for {city.name}</p>
              <p className="text-navy-400 text-sm mt-1">Add packages from the admin panel with destination: {city.name}</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Section 1: Packages FROM this city */}
              {sections.cityPackages.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1.5 h-8 bg-sky-600 rounded-full" />
                    <h3 className="text-xl font-bold text-navy-900">Packages from {city.name}</h3>
                    <span className="text-xs bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full font-medium">{sections.cityPackages.length} packages</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {sections.cityPackages.map((p, i) => <PackageCard key={p.id || i} pkg={p} city={city} index={i} />)}
                  </div>
                </div>
              )}

              {/* Section 2: Nearby destinations (<200km) */}
              {sections.nearby.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1.5 h-8 bg-green-500 rounded-full" />
                    <h3 className="text-xl font-bold text-navy-900">Nearby {city.name}</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">{sections.nearby.length} packages</span>
                    <span className="text-xs text-navy-400">Within 200 km</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {sections.nearby.map((p, i) => <PackageCard key={p.id || i} pkg={p} city={city} index={i} />)}
                  </div>
                </div>
              )}

              {/* Section 3: Medium distance (200-500km) */}
              {sections.medium.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
                    <h3 className="text-xl font-bold text-navy-900">Explore {city.state}</h3>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">{sections.medium.length} packages</span>
                    <span className="text-xs text-navy-400">200-500 km away</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {sections.medium.map((p, i) => <PackageCard key={p.id || i} pkg={p} city={city} index={i} />)}
                  </div>
                </div>
              )}

              {/* Section 4: Long distance (>500km) */}
              {sections.longDistance.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1.5 h-8 bg-red-500 rounded-full" />
                    <h3 className="text-xl font-bold text-navy-900">Long-Distance {city.state}</h3>
                    <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">{sections.longDistance.length} packages</span>
                    <span className="text-xs text-navy-400">500+ km away</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {sections.longDistance.map((p, i) => <PackageCard key={p.id || i} pkg={p} city={city} index={i} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* WHY VISIT */}
      <section className="section-padding" id="things-to-do">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900 mb-8">Why Visit {city.name}?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-5">
              {city.whyVisit.map((w, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shrink-0 text-xl">{w.icon}</div>
                  <div>
                    <h3 className="font-bold text-navy-900">{w.title}</h3>
                    <p className="text-sm text-navy-500 mt-1">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={city.featuredImage} alt={city.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{city.featuredTitle}</h3>
                  <p className="text-sm text-gray-200 mt-1">{city.featuredDesc}</p>
                  <button className="mt-3 bg-gold-500 hover:bg-gold-600 text-navy-900 px-5 py-2 rounded-lg text-sm font-semibold transition-colors">{city.featuredCta}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST TIME + HOW TO REACH + AT A GLANCE */}
      <section className="section-padding bg-gray-50" id="best-time-to-visit">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Best Time */}
            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-bold text-navy-900 text-lg mb-4 flex items-center gap-2"><Calendar size={20} className="text-sky-600" /> Best Time to Visit</h3>
              {city.bestTime.map((b, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p className="font-semibold text-navy-800 text-sm">{b.season}</p>
                    {b.dates && <p className="text-xs text-gold-600 font-medium">{b.dates}</p>}
                    <p className="text-xs text-navy-500">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* How to Reach */}
            <div className="bg-white rounded-2xl p-6 border" id="how-to-reach">
              <h3 className="font-bold text-navy-900 text-lg mb-4 flex items-center gap-2"><Navigation size={20} className="text-sky-600" /> How to Reach {city.name}</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Plane size={18} className="text-sky-600 mt-0.5 shrink-0" />
                  <div><p className="font-semibold text-navy-800 text-sm">By Air</p><p className="text-xs text-navy-500">{city.howToReach.air}</p></div>
                </div>
                <div className="flex gap-3">
                  <Train size={18} className="text-sky-600 mt-0.5 shrink-0" />
                  <div><p className="font-semibold text-navy-800 text-sm">By Train</p><p className="text-xs text-navy-500">{city.howToReach.train}</p></div>
                </div>
                <div className="flex gap-3">
                  <Bus size={18} className="text-sky-600 mt-0.5 shrink-0" />
                  <div><p className="font-semibold text-navy-800 text-sm">By Road</p><p className="text-xs text-navy-500">{city.howToReach.road}</p></div>
                </div>
              </div>
            </div>

            {/* At a Glance */}
            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-bold text-navy-900 text-lg mb-4 flex items-center gap-2"><Building size={20} className="text-sky-600" /> {city.name} at a Glance</h3>
              <div className="space-y-3">
                {city.atGlance.map((g, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-navy-400">{g.icon}</span>
                    <span className="text-navy-500 w-24">{g.label}</span>
                    <span className="font-medium text-navy-800">{g.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLAN TRIP CTA */}
      <section className="relative overflow-hidden">
        <img src={city.ctaImage || city.heroImage} alt="" className="w-full h-48 md:h-64 object-cover" />
        <div className="absolute inset-0 bg-navy-900/80 flex items-center">
          <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-display font-bold">Plan Your {city.name} Trip with MAQLAIM TOURS</h2>
              <p className="text-gray-300 mt-1">Customizable packages {'\u2022'} Best prices {'\u2022'} 24x7 support</p>
            </div>
            <Link to="/contact" className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-3 rounded-xl font-bold transition-colors whitespace-nowrap">Enquire Now</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
