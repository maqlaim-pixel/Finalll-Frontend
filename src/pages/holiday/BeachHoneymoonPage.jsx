import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Users, Search, Star, Clock, Phone, Mail, Send, ChevronLeft, ChevronRight, Camera, Heart, Shield, Award, Headphones, CheckCircle, Waves, Umbrella } from 'lucide-react'
import PackageCard from '../../components/common/PackageCard'
import ComingSoon from '../../components/common/ComingSoon'
import api from '../../services/api'

const WHY_FEATURES = [
  { icon: Waves, title: 'Pristine Beaches', desc: 'Handpicked beach destinations.', color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { icon: Umbrella, title: 'Beachfront Resorts', desc: 'Stay steps from the ocean.', color: 'text-orange-500', bg: 'bg-orange-50' },
  { icon: Heart, title: 'Romantic Sunsets', desc: 'Private beach dinners & sunset cruises.', color: 'text-pink-500', bg: 'bg-pink-50' },
  { icon: Shield, title: 'Safe & Secure', desc: 'Verified safe beaches & resorts.', color: 'text-green-500', bg: 'bg-green-50' },
  { icon: Award, title: 'Best Price', desc: 'Unbeatable beach honeymoon deals.', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Headphones, title: '24x7 Support', desc: "We're here for you anytime.", color: 'text-rose-500', bg: 'bg-rose-50' },
]

const DESTINATIONS = [
  { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&h=200&fit=crop', desc: 'Overwater villas & turquoise lagoons' },
  { name: 'Bali', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=300&h=200&fit=crop', desc: 'Rice terraces & beach clubs' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop', desc: 'Golden sands & Portuguese charm' },
  { name: 'Andaman', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop', desc: 'Crystal waters & coral reefs' },
  { name: 'Santorini', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop', desc: 'Blue domes & Aegean sunsets' },
  { name: 'Phuket', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=300&h=200&fit=crop', desc: 'Thai beaches & island hopping' },
  { name: 'Seychelles', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop', desc: 'Pristine islands & luxury resorts' },
]

const GALLERY = [
  { url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop', alt: 'Overwater Villa' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', alt: 'Beach Sunset' },
  { url: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&h=400&fit=crop', alt: 'Bali Beach' },
  { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop', alt: 'Santorini Coast' },
  { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop', alt: 'Snorkeling Adventure' },
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function BeachHoneymoonPage() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [galleryIndex, setGalleryIndex] = useState(null)
  const [searchDest, setSearchDest] = useState('')
  const [searchMonth, setSearchMonth] = useState('')
  const [searchTravelers, setSearchTravelers] = useState('2 Adults')
  const scrollRef = useRef(null)

  const [form, setForm] = useState({ name: '', mobile: '', email: '', destination: '', dates: '', nights: '', message: '' })

  useEffect(() => {
    setLoading(true)
    api.get('/packages')
      .then(res => {
        const all = res.data || []
        const beachHoneymoons = all.filter(p => {
          const s = [p.title, p.destination, p.state, p.country, p.tags, p.category].filter(Boolean).join(' ').toLowerCase()
          return s.includes('honeymoon') || s.includes('beach') || s.includes('romantic') ||
            ['maldives','bali','goa','andaman','santorini','phuket','seychelles','sri lanka','mauritius','fiji','thailand'].some(k => s.includes(k))
        })
        setPackages(beachHoneymoons)
      })
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [])

  const scrollPackages = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[500px] flex">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=800&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/80 via-cyan-900/50 to-transparent" />
        </div>

        <div className="relative z-10 container-wide py-12 flex flex-col lg:flex-row items-center gap-12 w-full">
          <div className="flex-1 text-white">
            <p className="text-cyan-300 font-semibold italic text-lg mb-2">Where Waves Whisper Love</p>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-2">
              Beach<br /><span className="text-cyan-300">Honeymoon</span>
            </h1>
            <p className="text-xl italic text-cyan-200 mb-4">Sun-Kissed Shores. Endless Romance.</p>
            <p className="text-white/80 max-w-lg mb-8">Walk hand in hand on pristine beaches. Crystal waters, sunset views, and luxury beach resorts for the perfect romantic escape.</p>
            <div className="flex flex-wrap gap-6">
              {WHY_FEATURES.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <f.icon size={18} className="text-cyan-300" />
                  <span className="text-sm font-medium">{f.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-2xl p-6 shrink-0">
            <h3 className="text-xl font-bold text-navy-900 mb-5">Plan Your Beach Honeymoon</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Where do you want to go?</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                  <MapPin size={18} className="text-gray-400" />
                  <select value={searchDest} onChange={e => setSearchDest(e.target.value)} className="w-full text-sm outline-none bg-transparent text-navy-700">
                    <option value="">Select Destination</option>
                    {DESTINATIONS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Travel Month</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                  <Calendar size={18} className="text-gray-400" />
                  <select value={searchMonth} onChange={e => setSearchMonth(e.target.value)} className="w-full text-sm outline-none bg-transparent text-navy-700">
                    <option value="">Select Month</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Travellers</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                  <Users size={18} className="text-gray-400" />
                  <select value={searchTravelers} onChange={e => setSearchTravelers(e.target.value)} className="w-full text-sm outline-none bg-transparent text-navy-700">
                    <option>2 Adults</option>
                    <option>2 Adults, 1 Child</option>
                    <option>2 Adults, 2 Children</option>
                  </select>
                </div>
              </div>
              <Link to="/packages" className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white text-center py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <Search size={18} /> Find Beach Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE ═══ */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-navy-900">Why Choose Our Beach Honeymoon Packages?</h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {WHY_FEATURES.map((f, i) => (
              <div key={i} className="text-center p-4 rounded-xl border border-gray-100 hover:shadow-lg transition group">
                <div className={`w-16 h-16 ${f.bg} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition`}>
                  <f.icon className={`w-8 h-8 ${f.color}`} />
                </div>
                <h4 className="font-semibold text-sm text-navy-900 mb-1">{f.title}</h4>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR PACKAGES ═══ */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900">Popular Beach Honeymoon Packages</h2>
              <div className="w-16 h-1 bg-cyan-500 mt-3" />
            </div>
            <Link to="/packages" className="text-cyan-600 font-medium flex items-center gap-1 hover:underline">View All Packages <ChevronRight size={16} /></Link>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-navy-500">Loading packages...</p>
            </div>
          )}

          {!loading && packages.length > 0 && (
            <div className="relative">
              <button onClick={() => scrollPackages('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition border border-gray-200">
                <ChevronLeft size={20} className="text-navy-700" />
              </button>
              <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {packages.map(pkg => (
                  <div key={pkg.id} className="min-w-[300px] max-w-[300px] snap-start">
                    <PackageCard pkg={pkg} />
                  </div>
                ))}
              </div>
              <button onClick={() => scrollPackages('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition border border-gray-200">
                <ChevronRight size={20} className="text-navy-700" />
              </button>
            </div>
          )}

          {!loading && packages.length === 0 && (
            <ComingSoon categoryName="Beach Honeymoon" icon="🏖️" />
          )}
        </div>
      </section>

      {/* ═══ TOP BEACH DESTINATIONS ═══ */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-navy-900">Top Romantic Beach Destinations</h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {DESTINATIONS.map((d, i) => (
              <Link key={i} to={`/packages?destination=${d.name}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <h3 className="font-bold text-sm">{d.name}</h3>
                  <p className="text-xs text-gray-300">{d.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PHOTO GALLERY ═══ */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-navy-900">Beach Romance Gallery</h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {GALLERY.map((img, i) => (
              <button key={i} onClick={() => setGalleryIndex(i)} className="group relative rounded-xl overflow-hidden h-40 cursor-pointer">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY LIGHTBOX ═══ */}
      {galleryIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setGalleryIndex(null)}>
          <button onClick={() => setGalleryIndex(null)} className="absolute top-4 right-4 text-white text-3xl z-10">&times;</button>
          <button onClick={e => { e.stopPropagation(); setGalleryIndex((galleryIndex - 1 + GALLERY.length) % GALLERY.length) }} className="absolute left-4 text-white text-4xl z-10"><ChevronLeft size={40} /></button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={GALLERY[galleryIndex].url} alt="" className="w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="text-center mt-4"><p className="text-white text-lg font-semibold">{GALLERY[galleryIndex].alt}</p></div>
          </div>
          <button onClick={e => { e.stopPropagation(); setGalleryIndex((galleryIndex + 1) % GALLERY.length) }} className="absolute right-4 text-white text-4xl z-10"><ChevronRight size={40} /></button>
        </div>
      )}

      {/* ═══ CONTACT FORM ═══ */}
      <section className="py-16 bg-gradient-to-r from-cyan-900 to-cyan-800 text-white">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">Plan Your Dream Beach Honeymoon</h2>
              <p className="text-cyan-200 mb-8">Our experts will find the perfect beach paradise for your romantic escape.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Phone size={18} className="text-cyan-300" /><span>+91 93137 10465</span></div>
                <div className="flex items-center gap-3"><Mail size={18} className="text-cyan-300" /><span>info@travelvista.com</span></div>
                <div className="flex items-center gap-3"><Headphones size={18} className="text-cyan-300" /><span>24x7 Customer Support</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-gray-800">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm" />
                <input type="tel" placeholder="Mobile Number" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm" />
                <select value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm text-navy-700">
                  <option value="">Select Destination</option>
                  {DESTINATIONS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="date" placeholder="Travel Dates" value={form.dates} onChange={e => setForm({ ...form, dates: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm" />
                <select value={form.nights} onChange={e => setForm({ ...form, nights: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm text-navy-700">
                  <option value="">Number of Nights</option>
                  <option>2 Nights</option>
                  <option>3 Nights</option>
                  <option>4 Nights</option>
                  <option>5 Nights</option>
                  <option>6 Nights</option>
                  <option>7+ Nights</option>
                </select>
              </div>
              <textarea placeholder="Your Message" rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm resize-none mb-4" />
              <button onClick={() => alert('Thank you! Our honeymoon expert will contact you shortly.')} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                <Send size={18} /> Get Free Quote
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">Our expert will get in touch with you shortly!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
