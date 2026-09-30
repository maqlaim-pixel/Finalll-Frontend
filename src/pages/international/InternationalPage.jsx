import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Clock, MapPin, ChevronLeft, ChevronRight, Phone, Mail, Send, Camera, ArrowRight, Globe } from 'lucide-react'
import api from '../../services/api'

const HERO_SLIDES = [
  { image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&h=600&fit=crop', title: 'Explore the World', subtitle: 'From dazzling Dubai to tropical Bali — discover amazing international destinations' },
  { image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&h=600&fit=crop', title: 'Thailand Paradise', subtitle: 'Golden temples, crystal waters, and vibrant street life await you' },
  { image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1400&h=600&fit=crop', title: 'European Dream', subtitle: 'Romantic Paris, historic Rome, and the stunning Swiss Alps' },
  { image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&h=600&fit=crop', title: 'Dubai Luxury', subtitle: 'Experience world-class shopping, architecture, and desert adventures' },
  { image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1400&h=600&fit=crop', title: 'Maldives Bliss', subtitle: 'Pristine beaches, overwater villas, and turquoise lagoons' },
]

const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', alt: 'Dubai Skyline', location: 'Dubai, UAE' },
  { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', alt: 'Thai Temple', location: 'Bangkok, Thailand' },
  { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop', alt: 'Eiffel Tower', location: 'Paris, France' },
  { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=300&fit=crop', alt: 'Maldives Beach', location: 'Malé, Maldives' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', alt: 'Swiss Alps', location: 'Switzerland' },
  { url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop', alt: 'Dubai Mall', location: 'Dubai, UAE' },
  { url: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', alt: 'Bali Rice Terraces', location: 'Bali, Indonesia' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', alt: 'Singapore Marina', location: 'Singapore' },
]

const COUNTRIES_DATA = [
  { name: 'Dubai', emoji: '🇦🇪', tagline: 'City of Gold' },
  { name: 'Thailand', emoji: '🇹🇭', tagline: 'Land of Smiles' },
  { name: 'Singapore', emoji: '🇸🇬', tagline: 'Garden City' },
  { name: 'Malaysia', emoji: '🇲🇾', tagline: 'Truly Asia' },
  { name: 'Bali', emoji: '🇮🇩', tagline: 'Island of Gods' },
  { name: 'Maldives', emoji: '🇲🇻', tagline: 'Tropical Paradise' },
  { name: 'Europe', emoji: '🇪🇺', tagline: 'Classic Elegance' },
  { name: 'Australia', emoji: '🇦🇺', tagline: 'Land Down Under' },
]

export default function InternationalPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [destinations, setDestinations] = useState([])
  const [packages, setPackages] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')
  const [galleryIndex, setGalleryIndex] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    api.get('/destinations').then(res => {
      setDestinations(res.data.filter(d => d.type === 'international' || d.country !== 'India'))
    }).catch(() => {})
    api.get('/packages').then(res => {
      setPackages(res.data.filter(p => p.category === 'international' || p.country !== 'India'))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [])

  const goToSlide = (i) => { setCurrentSlide(i); clearInterval(timerRef.current); timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length), 5000) }

  const filtered = packages.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q) || p.country?.toLowerCase().includes(q)
    const price = p.startingPrice || 0
    const matchPrice = priceRange === 'all' || (priceRange === 'budget' && price < 50000) || (priceRange === 'mid' && price >= 50000 && price < 100000) || (priceRange === 'premium' && price >= 100000)
    return matchSearch && matchPrice
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'price-low') return (a.startingPrice || 0) - (b.startingPrice || 0)
    if (sortBy === 'price-high') return (b.startingPrice || 0) - (a.startingPrice || 0)
    return 0
  })

  const countries = {}
  destinations.forEach(d => {
    const country = d.country || 'Other'
    if (!countries[country]) countries[country] = []
    countries[country].push(d)
  })

  return (
    <div>
      {/* HERO CAROUSEL */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-navy-900">
        {HERO_SLIDES.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
              <div className="container-wide">
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">{slide.title}</h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow">{slide.subtitle}</p>
                <Link to="/packages?destination=International" className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                  Explore Packages <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"><ChevronLeft size={24} /></button>
        <button onClick={() => goToSlide((currentSlide + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"><ChevronRight size={24} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => goToSlide(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* EXPLORE COUNTRIES */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">International Travel</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Explore Countries with Packages</h2>
            <p className="text-navy-500 mt-3 max-w-xl mx-auto">Discover amazing destinations across the globe — from luxury city breaks to tropical island escapes</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Object.entries(countries).length > 0 ? Object.entries(countries).map(([country, dests]) => (
              <Link key={country} to={`/packages?destination=${encodeURIComponent(country)}`} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  {dests[0]?.image ? <img src={dests[0].image} alt={country} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full bg-gradient-to-br from-sky-400 to-indigo-600" />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg">{country}</h3>
                  <p className="text-sm text-gray-200">{dests.length} destination{dests.length > 1 ? 's' : ''} · View Packages →</p>
                </div>
              </Link>
            )) : COUNTRIES_DATA.map(c => (
              <Link key={c.name} to={`/packages?destination=${encodeURIComponent(c.name)}`} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-sky-500 to-indigo-700 p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                <span className="text-4xl mb-3">{c.emoji}</span>
                <h3 className="font-bold text-lg text-white">{c.name}</h3>
                <p className="text-sm text-gray-200 mt-1">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNATIONAL PACKAGES */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">International Packages</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Popular International Packages</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                <input type="text" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none w-56" />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none">
                <option value="all">All Prices</option>
                <option value="budget">Under ₹50K</option>
                <option value="mid">₹50K - ₹1L</option>
                <option value="premium">₹1L+</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <Link key={p.id || p.slug} to={`/packages/${p.slug || p.id}`} className="card overflow-hidden group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  {p.category && <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">{p.category}</span>}
                </div>
                <div className="p-5">
                  <p className="text-xs text-navy-500 mb-1 flex items-center gap-1"><MapPin size={12} /> {p.destination || p.country} · <Clock size={12} /> {p.durationDays}D/{p.durationNights}N</p>
                  <h3 className="font-bold text-navy-900 mb-2 group-hover:text-sky-600 transition-colors">{p.title}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={14} className="text-gold-500 fill-gold-500" />
                    <span className="text-sm font-medium">{p.rating || 0}</span>
                    <span className="text-xs text-navy-400">({p.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-sky-600">₹{p.startingPrice?.toLocaleString()}</span>
                    <span className="text-xs text-navy-500">/person</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Globe size={48} className="mx-auto text-navy-300 mb-4" />
              <h3 className="text-xl font-semibold text-navy-700">No international packages found</h3>
              <p className="text-navy-500 mt-2">Try adjusting your filters or check back soon</p>
            </div>
          )}
        </div>
      </section>

      {/* IMAGE GALLERY */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Photo Gallery</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Stunning International Destinations</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY_IMAGES.map((img, i) => (
              <button key={i} onClick={() => setGalleryIndex(i)} className="group relative rounded-xl overflow-hidden aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-sky-500">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"><Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{img.alt}</p>
                  <p className="text-gray-300 text-xs">{img.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {galleryIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setGalleryIndex(null)}>
          <button onClick={() => setGalleryIndex(null)} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10">&times;</button>
          <button onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length) }} className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"><ChevronLeft size={40} /></button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={GALLERY_IMAGES[galleryIndex].url} alt={GALLERY_IMAGES[galleryIndex].alt} className="w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="text-center mt-4">
              <p className="text-white text-lg font-semibold">{GALLERY_IMAGES[galleryIndex].alt}</p>
              <p className="text-gray-400 text-sm">{GALLERY_IMAGES[galleryIndex].location}</p>
              <p className="text-gray-500 text-xs mt-1">{galleryIndex + 1} / {GALLERY_IMAGES.length}</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex + 1) % GALLERY_IMAGES.length) }} className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"><ChevronRight size={40} /></button>
        </div>
      )}

      {/* WHY CHOOSE US */}
      <section className="section-padding bg-gradient-to-br from-indigo-900 to-sky-900 text-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-sky-300 font-semibold text-sm uppercase tracking-wider">Why MAQLAIM TOURS</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Why Choose Us for International Travel?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '✈️', title: 'Visa Assistance', desc: 'Complete visa support for all countries — documentation, interview prep, and tracking' },
              { icon: '🏨', title: 'Premium Hotels', desc: 'Handpicked 4-star and 5-star accommodations at the best negotiated rates' },
              { icon: '🌍', title: '50+ Countries', desc: 'Curated packages covering Asia, Europe, Americas, Australia, and beyond' },
              { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock assistance during your international trip — we are always a call away' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section-padding bg-gray-50" id="contact">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2 mb-6">Plan Your International Trip</h2>
              <p className="text-navy-500 mb-8">Ready to explore the world? Our travel experts will craft a perfect international itinerary with visa support, flights, hotels, and experiences.</p>
              <div className="space-y-5">
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Phone size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Call Us</p><p className="font-semibold text-navy-900">+91 98765 43210</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Mail size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Email Us</p><p className="font-semibold text-navy-900">hello@travelvista.com</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><MapPin size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Visit Us</p><p className="font-semibold text-navy-900">Mumbai, Maharashtra, India</p></div></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Send Us an Enquiry</h3>
              <form onSubmit={e => { e.preventDefault(); alert('Thank you! Our international travel expert will contact you shortly.') }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <input type="email" placeholder="Email Address *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="tel" placeholder="Phone Number *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600">
                    <option>Select Country</option><option>Dubai</option><option>Thailand</option><option>Singapore</option><option>Malaysia</option><option>Bali</option><option>Maldives</option><option>Europe</option><option>Australia</option><option>Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600">
                    <option>Number of Travelers</option><option>1 Person</option><option>2 People</option><option>3-5 People</option><option>6-10 People</option><option>10+ People</option>
                  </select>
                </div>
                <textarea placeholder="Your Message / Special Requirements" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" />
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"><Send size={18} /> Submit Enquiry</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
