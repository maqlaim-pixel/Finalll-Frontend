import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Clock, MapPin, ChevronLeft, ChevronRight, Phone, Mail, Send, Camera, ArrowRight, Sun } from 'lucide-react'
import api from '../../services/api'

const HERO_SLIDES = [
  { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=600&fit=crop', title: 'Holiday Packages', subtitle: 'Create unforgettable memories with our handcrafted holiday experiences' },
  { image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1400&h=600&fit=crop', title: 'Family Holidays', subtitle: 'Fun-filled adventures the whole family will love' },
  { image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1400&h=600&fit=crop', title: 'Honeymoon Specials', subtitle: 'Romantic getaways to the most beautiful destinations on earth' },
  { image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&h=600&fit=crop', title: 'Beach Holidays', subtitle: 'Sun, sand, and surf at pristine tropical beaches' },
  { image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1400&h=600&fit=crop', title: 'Adventure Holidays', subtitle: 'Trekking, rafting, paragliding — push your limits' },
]

const HOLIDAY_TYPES = [
  { name: 'Family Holidays', icon: '👨‍👩‍👧‍👦', desc: 'Fun for the whole family', color: 'from-blue-500 to-cyan-500' },
  { name: 'Honeymoon', icon: '💑', desc: 'Romantic escapes', color: 'from-pink-500 to-rose-500' },
  { name: 'Beach Holidays', icon: '🏖️', desc: 'Sun, sand & surf', color: 'from-cyan-500 to-blue-500' },
  { name: 'Adventure', icon: '🏔️', desc: 'Thrilling experiences', color: 'from-green-500 to-emerald-500' },
  { name: 'Luxury', icon: '💎', desc: 'Premium experiences', color: 'from-amber-500 to-orange-500' },
  { name: 'Weekend Getaway', icon: '🚗', desc: 'Quick escapes', color: 'from-purple-500 to-indigo-500' },
  { name: 'Group Tours', icon: '👥', desc: 'Travel with friends', color: 'from-teal-500 to-cyan-500' },
  { name: 'Seasonal', icon: '🎄', desc: 'Festival specials', color: 'from-red-500 to-pink-500' },
]

const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', alt: 'Tropical Beach', location: 'Goa, India' },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop', alt: 'Family Fun', location: 'Manali, India' },
  { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=300&fit=crop', alt: 'Resort Pool', location: 'Kerala, India' },
  { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop', alt: 'Mountain Lake', location: 'Kashmir, India' },
  { url: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=300&fit=crop', alt: 'Safari', location: 'Ranthambore, India' },
  { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', alt: 'Cruise', location: 'High Seas' },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop', alt: 'Luxury Hotel', location: 'Udaipur, India' },
  { url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop', alt: 'Spa Retreat', location: 'Ayurveda, Kerala' },
]

export default function HolidayPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [packages, setPackages] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')
  const [galleryIndex, setGalleryIndex] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    api.get('/packages').then(res => setPackages(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [])

  const goToSlide = (i) => { setCurrentSlide(i); clearInterval(timerRef.current); timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length), 5000) }

  const filtered = packages.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q) || p.state?.toLowerCase().includes(q)
    const price = p.startingPrice || 0
    const matchPrice = priceRange === 'all' || (priceRange === 'budget' && price < 20000) || (priceRange === 'mid' && price >= 20000 && price < 50000) || (priceRange === 'premium' && price >= 50000)
    return matchSearch && matchPrice
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'price-low') return (a.startingPrice || 0) - (b.startingPrice || 0)
    if (sortBy === 'price-high') return (b.startingPrice || 0) - (a.startingPrice || 0)
    return 0
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
                <Link to="/packages" className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">Browse Holidays <ArrowRight size={18} /></Link>
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"><ChevronLeft size={24} /></button>
        <button onClick={() => goToSlide((currentSlide + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"><ChevronRight size={24} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (<button key={i} onClick={() => goToSlide(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/40'}`} />))}
        </div>
      </section>

      {/* HOLIDAY TYPES */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Holiday Types</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Choose Your Holiday Style</h2>
            <p className="text-navy-500 mt-3 max-w-xl mx-auto">From relaxing beach getaways to thrilling adventures — find the perfect holiday for every mood</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {HOLIDAY_TYPES.map(type => (
              <Link key={type.name} to={`/packages?search=${encodeURIComponent(type.name)}`} className={`group rounded-2xl p-6 bg-gradient-to-br ${type.color} text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center`}>
                <div className="text-4xl mb-3">{type.icon}</div>
                <h3 className="font-bold text-lg">{type.name}</h3>
                <p className="text-sm text-white/80 mt-1">{type.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Holiday Packages</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">All Holiday Packages</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" /><input type="text" placeholder="Search holidays..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none w-56" /></div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"><option value="newest">Newest First</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select>
              <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"><option value="all">All Prices</option><option value="budget">Under ₹20K</option><option value="mid">₹20K - ₹50K</option><option value="premium">₹50K+</option></select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <Link key={p.id || p.slug} to={`/packages/${p.slug || p.id}`} className="card overflow-hidden group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  {p.category && <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-medium px-3 py-1 rounded-full">{p.category}</span>}
                </div>
                <div className="p-5">
                  <p className="text-xs text-navy-500 mb-1 flex items-center gap-1"><MapPin size={12} /> {p.destination || p.state} · <Clock size={12} /> {p.durationDays}D/{p.durationNights}N</p>
                  <h3 className="font-bold text-navy-900 mb-2 group-hover:text-sky-600 transition-colors">{p.title}</h3>
                  <div className="flex items-center gap-1 mb-3"><Star size={14} className="text-gold-500 fill-gold-500" /><span className="text-sm font-medium">{p.rating || 0}</span><span className="text-xs text-navy-400">({p.reviewCount || 0} reviews)</span></div>
                  <div className="flex items-baseline gap-2"><span className="text-xl font-bold text-sky-600">₹{p.startingPrice?.toLocaleString()}</span><span className="text-xs text-navy-500">/person</span></div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && <div className="text-center py-16"><Sun size={48} className="mx-auto text-navy-300 mb-4" /><h3 className="text-xl font-semibold text-navy-700">No holiday packages found</h3><p className="text-navy-500 mt-2">Try adjusting your filters</p></div>}
        </div>
      </section>

      {/* GALLERY */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-10"><span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Photo Gallery</span><h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Holiday Moments</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY_IMAGES.map((img, i) => (
              <button key={i} onClick={() => setGalleryIndex(i)} className="group relative rounded-xl overflow-hidden aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-sky-500">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"><Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity"><p className="text-white text-sm font-medium">{img.alt}</p><p className="text-gray-300 text-xs">{img.location}</p></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {galleryIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setGalleryIndex(null)}>
          <button onClick={() => setGalleryIndex(null)} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10">&times;</button>
          <button onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length) }} className="absolute left-4 text-white"><ChevronLeft size={40} /></button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={GALLERY_IMAGES[galleryIndex].url} alt={GALLERY_IMAGES[galleryIndex].alt} className="w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="text-center mt-4"><p className="text-white text-lg font-semibold">{GALLERY_IMAGES[galleryIndex].alt}</p><p className="text-gray-400 text-sm">{GALLERY_IMAGES[galleryIndex].location}</p><p className="text-gray-500 text-xs mt-1">{galleryIndex + 1} / {GALLERY_IMAGES.length}</p></div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex + 1) % GALLERY_IMAGES.length) }} className="absolute right-4 text-white"><ChevronRight size={40} /></button>
        </div>
      )}

      {/* WHY CHOOSE US */}
      <section className="section-padding bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
        <div className="container-wide">
          <div className="text-center mb-12"><span className="text-teal-300 font-semibold text-sm uppercase tracking-wider">Why MAQLAIM TOURS</span><h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Why Choose Us for Holidays?</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Customized Itineraries', desc: 'Every holiday is tailored to your interests, budget, and travel style' },
              { icon: '💰', title: 'Best Value Deals', desc: 'Exclusive discounts and combo offers that save you more on every trip' },
              { icon: '🛡️', title: 'Safe Travels', desc: 'Verified stays, insured trips, and 24/7 on-ground support' },
              { icon: '⭐', title: 'Expert Planning', desc: 'Our travel curators have visited every destination we recommend' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors"><div className="text-4xl mb-4">{item.icon}</div><h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-gray-300 text-sm">{item.desc}</p></div>
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
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2 mb-6">Plan Your Holiday</h2>
              <p className="text-navy-500 mb-8">Tell us your dream holiday and our experts will craft the perfect itinerary with best prices and hassle-free experience.</p>
              <div className="space-y-5">
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Phone size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Call Us</p><p className="font-semibold text-navy-900">+91 93137 10465</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Mail size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Email Us</p><p className="font-semibold text-navy-900">sales@maqlaimtours.com</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><MapPin size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Visit Us</p><p className="font-semibold text-navy-900">Mumbai, Maharashtra, India</p></div></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Send Us an Enquiry</h3>
              <form onSubmit={e => { e.preventDefault(); alert('Thank you! Our holiday expert will contact you shortly.') }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Full Name *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /><input type="email" placeholder="Email Address *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4"><input type="tel" placeholder="Phone Number *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /><select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600"><option>Holiday Type</option><option>Family</option><option>Honeymoon</option><option>Beach</option><option>Adventure</option><option>Luxury</option><option>Weekend</option><option>Group</option></select></div>
                <div className="grid grid-cols-2 gap-4"><input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /><select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600"><option>Number of Travelers</option><option>1 Person</option><option>2 People</option><option>3-5 People</option><option>6-10 People</option><option>10+ People</option></select></div>
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
