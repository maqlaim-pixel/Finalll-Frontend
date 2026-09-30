import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ChevronRight, ChevronLeft, Heart, Search, Star, ArrowRight, Users, Calendar, CheckCircle, Camera } from 'lucide-react'

const VENUES = [
  { name: 'Umaid Bhawan Palace', location: 'Jodhpur', desc: 'A majestic palace offering unmatched luxury and royal experiences.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=280&fit=crop' },
  { name: 'City Palace', location: 'Udaipur', desc: 'Celebrate your big day in the heart of Udaipur\'s royal heritage.', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=280&fit=crop' },
  { name: 'Samode Palace', location: 'Jaipur', desc: 'A blend of traditional charm and royal elegance.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop' },
  { name: 'Mehrangarh Fort', location: 'Jodhpur', desc: 'Exchange vows in a historic fort overlooking the Blue City.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=280&fit=crop' },
  { name: 'Oberoi Rajvilas', location: 'Jaipur', desc: 'Luxury resort with beautiful gardens, pools and regal hospitality.', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=280&fit=crop' },
  { name: 'Rambagh Palace', location: 'Jaipur', desc: 'The jewel of Jaipur — a former royal residence turned luxury hotel.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop' },
]

const PACKAGES = [
  { name: 'Royal Palace Wedding', duration: '3 Nights / 4 Days', price: '₹2,49,999/-' },
  { name: 'Heritage Haveli Wedding', duration: '2 Nights / 3 Days', price: '₹1,59,999/-' },
  { name: 'Luxury Resort Wedding', duration: '3 Nights / 4 Days', price: '₹2,19,999/-' },
  { name: 'Intimate Wedding Package', duration: '2 Nights / 3 Days', price: '₹1,09,999/-' },
]

const REAL_WEDDINGS = [
  { image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop', alt: 'Royal Wedding' },
  { image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&h=200&fit=crop', alt: 'Palace Wedding' },
  { image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=200&fit=crop', alt: 'Beach Wedding' },
  { image: 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=300&h=200&fit=crop', alt: 'Garden Wedding' },
  { image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&h=200&fit=crop', alt: 'Fort Wedding' },
]

export default function RajasthanWeddingPage() {
  const [venueIdx, setVenueIdx] = useState(0)

  const scrollVenues = (dir) => {
    const el = document.getElementById('venue-carousel')
    if (el) el.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ═══ HEADER ═══ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/maqlaim-tours-logo.jpeg" alt="MAQLAIM TOURS — Explore The Purity of New Destinations" className="h-10 w-[60px] object-contain" />
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-rose-600 transition-colors">Home</Link>
              {['India', 'International', 'Packages', 'Holidays', 'Experiences'].map(item => (
                <button key={item} className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 flex items-center gap-1">
                  {item} <span className="text-xs text-navy-400">▼</span>
                </button>
              ))}
              <Link to="/blog" className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-rose-600 transition-colors">Blog</Link>
              <Link to="/contact" className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-rose-600 transition-colors">Contact Us</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-navy-600 hover:text-rose-600 transition-colors"><Search size={20} /></button>
            <button className="p-2 text-navy-600 hover:text-rose-600 transition-colors"><Heart size={20} /></button>
            <Link to="/contact" className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">Enquire Now</Link>
          </div>
        </div>
      </div>

      {/* ═══ BREADCRUMBS ═══ */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-navy-500">
            <Link to="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/india" className="hover:text-rose-600 transition-colors">India</Link>
            <ChevronRight size={14} />
            <Link to="/packages?destination=Rajasthan" className="hover:text-rose-600 transition-colors">Rajasthan</Link>
            <ChevronRight size={14} />
            <span className="text-navy-900 font-medium">Rajasthan Wedding</span>
          </div>
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative h-[500px] md:h-[550px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1400&h=600&fit=crop" alt="Rajasthan Wedding" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-xl text-white">
              <p className="text-rose-300 font-cursive text-2xl italic mb-2" style={{ fontFamily: 'Georgia, serif' }}>Royal Beginnings in</p>
              <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Rajasthan</h1>
              <p className="text-xl text-gray-200 mb-3">Destination Weddings in the Land of Royals</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Make your dream wedding come true in the majestic palaces, heritage forts and luxury resorts of Rajasthan. Experience royal hospitality, rich traditions and magical celebrations.
              </p>
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: '🏰', label: '50+ Royal Venues' },
                  { icon: '📋', label: 'End to End Wedding Planning' },
                  { icon: '🎁', label: 'Customizable Packages' },
                  { icon: '💑', label: 'Trusted by 1000+ Happy Couples' },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2">
                    <span className="text-xl">{b.icon}</span>
                    <span className="text-sm font-medium text-gray-200">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE RAJASTHAN ═══ */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy-900 text-center mb-10" style={{ fontFamily: 'Georgia, serif' }}>Why Choose Rajasthan for Your Wedding?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { icon: '🏰', title: 'Royal Venues', desc: 'Palaces, Forts & Heritage Havelis' },
              { icon: '🌄', title: 'Scenic Beauty', desc: 'Stunning Landscapes & Backdrops' },
              { icon: '🙏', title: 'Rajasthani Hospitality', desc: 'Warmth, Tradition & World-Class Service' },
              { icon: '💃', title: 'Cultural Experiences', desc: 'Music, Dance, Cuisine & Local Traditions' },
              { icon: '☀️', title: 'Perfect Weather', desc: 'Pleasant Climate for Year-Round Weddings' },
              { icon: '✈️', title: 'Great Connectivity', desc: 'Well Connected by Air, Rail & Road' },
            ].map(item => (
              <div key={item.title} className="text-center p-5 rounded-2xl hover:bg-rose-50 transition-colors cursor-pointer border border-gray-100 group">
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{item.icon}</span>
                <h3 className="font-bold text-navy-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-navy-500 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOP WEDDING VENUES ═══ */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy-900" style={{ fontFamily: 'Georgia, serif' }}>Top Wedding Venues in Rajasthan</h2>
            <button className="text-rose-600 font-medium text-sm hover:text-rose-700 flex items-center gap-1">View All Venues <ArrowRight size={14} /></button>
          </div>
          <div className="relative">
            <div id="venue-carousel" className="flex gap-5 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
              {VENUES.map((v, i) => (
                <div key={v.name} className="min-w-[240px] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex-shrink-0">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"><Heart size={16} className="text-navy-600" /></button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-navy-900 text-sm group-hover:text-rose-600 transition-colors">{v.name}</h3>
                    <p className="text-xs text-navy-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {v.location}</p>
                    <p className="text-xs text-navy-500 mt-2 leading-relaxed">{v.desc}</p>
                    <button className="mt-3 w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">View Details</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => scrollVenues(-1)} className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-3 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10 border border-gray-200"><ChevronLeft size={20} className="text-navy-600" /></button>
            <button onClick={() => scrollVenues(1)} className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-3 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10 border border-gray-200"><ChevronRight size={20} className="text-navy-600" /></button>
          </div>
        </div>
      </section>

      {/* ═══ PACKAGES + WE PLAN YOU CELEBRATE ═══ */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Packages */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-navy-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Popular Rajasthan Wedding Packages</h2>
              <div className="space-y-4">
                {PACKAGES.map(p => (
                  <div key={p.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer border border-gray-100">
                    <div>
                      <h3 className="font-bold text-navy-900 text-sm">{p.name}</h3>
                      <p className="text-xs text-navy-500 mt-0.5">{p.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-rose-600 text-sm">{p.price}</p>
                      <p className="text-[10px] text-navy-500">Onwards</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                View All Wedding Packages <ArrowRight size={16} />
              </button>
            </div>

            {/* Center — Image */}
            <div className="hidden lg:block rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=400&fit=crop" alt="Wedding" className="w-full h-full object-cover" />
            </div>

            {/* Right — We Plan You Celebrate */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit">
              <h3 className="text-xl font-bold text-navy-900 mb-5" style={{ fontFamily: 'Georgia, serif' }}>We Plan, You Celebrate!</h3>
              <ul className="space-y-3 mb-6">
                {['Venue Selection', 'Wedding Planning', 'Decor & Themes', 'Catering & Menus', 'Entertainment', 'Guest Hospitality', 'Logistics & Transfers'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-navy-700">
                    <CheckCircle size={16} className="text-rose-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="block w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold text-center transition-colors">Enquire Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ REAL WEDDINGS IN RAJASTHAN ═══ */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy-900" style={{ fontFamily: 'Georgia, serif' }}>Real Weddings in Rajasthan</h2>
            <button className="text-rose-600 font-medium text-sm hover:text-rose-700 flex items-center gap-1">View All Weddings <ArrowRight size={14} /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {REAL_WEDDINGS.map((w, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/2] cursor-pointer group">
                <img src={w.image} alt={w.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="py-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: '💰', title: 'Best Price Guarantee', desc: 'Get the best rates always' },
              { icon: '🎨', title: '100% Customizable', desc: 'Tailor-made weddings as per your needs' },
              { icon: '📞', title: '24/7 Expert Support', desc: 'Our wedding experts are always here' },
              { icon: '🔒', title: 'Safe & Secure', desc: 'Secure payments & confidential process' },
              { icon: '❤️', title: 'Trusted by Thousands', desc: '1000+ couples trust MAQLAIM TOURS' },
            ].map(t => (
              <div key={t.title} className="flex items-start gap-2 text-center md:text-left">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p className="font-semibold text-navy-900 text-xs">{t.title}</p>
                  <p className="text-[10px] text-navy-500">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
