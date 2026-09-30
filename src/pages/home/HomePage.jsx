import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Star, ArrowRight, Shield, Headphones, CreditCard, Sparkles } from 'lucide-react'
import api from '../../services/api'

const DESTINATIONS = [
  { name: 'Rajasthan', slug: 'rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', packages: 24 },
  { name: 'Kerala', slug: 'kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', packages: 18 },
  { name: 'Goa', slug: 'goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', packages: 15 },
  { name: 'Switzerland', slug: 'switzerland', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600', packages: 12 },
  { name: 'Thailand', slug: 'thailand', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600', packages: 20 },
  { name: 'Dubai', slug: 'dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', packages: 16 },
]

const PACKAGES = [
  { title: 'Rajasthan Heritage Tour', slug: 'rajasthan-heritage-tour', destination: 'Rajasthan', duration: '6 Days / 5 Nights', price: 14999, discount: 20, rating: 4.8, reviews: 342, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', badge: 'Best Seller' },
  { title: 'Kerala Backwater Cruise', slug: 'kerala-backwater-cruise', destination: 'Kerala', duration: '5 Days / 4 Nights', price: 12499, discount: 15, rating: 4.7, reviews: 289, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', badge: 'Trending' },
  { title: 'Swiss Alps Adventure', slug: 'swiss-alps-adventure', destination: 'Switzerland', duration: '7 Days / 6 Nights', price: 185000, discount: 10, rating: 4.9, reviews: 198, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600', badge: 'Premium' },
  { title: 'Goa Beach Holiday', slug: 'goa-beach-holiday', destination: 'Goa', duration: '4 Days / 3 Nights', price: 8999, discount: 25, rating: 4.5, reviews: 456, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', badge: 'Budget' },
  { title: 'Thailand Paradise', slug: 'thailand-paradise', destination: 'Thailand', duration: '6 Days / 5 Nights', price: 45000, discount: 18, rating: 4.6, reviews: 267, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600', badge: 'Popular' },
  { title: 'Ladakh Road Trip', slug: 'ladakh-road-trip', destination: 'Ladakh', duration: '8 Days / 7 Nights', price: 22999, discount: 12, rating: 4.9, reviews: 178, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', badge: 'Adventure' },
]

const FEATURES = [
  { icon: Shield, title: 'Verified Experts', desc: 'Handpicked travel experts with years of experience' },
  { icon: Sparkles, title: 'Curated Experiences', desc: 'Uniquely crafted itineraries for every traveler' },
  { icon: CreditCard, title: 'Transparent Pricing', desc: 'No hidden costs. What you see is what you pay' },
  { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock assistance during your journey' },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', location: 'Mumbai', quote: 'The Rajasthan Heritage Tour was absolutely magical! Every detail was perfectly curated.', rating: 5, avatar: 'PS' },
  { name: 'Rahul Mehta', location: 'Delhi', quote: 'Kerala backwaters on the houseboat was the highlight of our honeymoon. Flawless!', rating: 5, avatar: 'RM' },
  { name: 'Sarah Johnson', location: 'London', quote: 'Our Swiss Alps trip was a dream come true. The Glacier Express was breathtaking.', rating: 5, avatar: 'SJ' },
]

export default function HomePage() {
  const [apiPackages, setApiPackages] = useState([])

  useEffect(() => {
    api.get('/packages').then(res => setApiPackages(res.data.slice(0, 6))).catch(() => {})
  }, [])

  const displayPackages = apiPackages.length > 0 ? apiPackages : PACKAGES

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-sky-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative container-wide py-24 md:py-36">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm tracking-wider uppercase mb-4">Explore the World with Confidence</p>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
              Your Next Journey<br />
              <span className="text-gold-400">Starts Here</span>
            </h1>
            <p className="text-lg text-navy-200 mb-8 max-w-xl">Discover handcrafted travel experiences across India and beyond. From royal Rajasthan to tropical Thailand — we plan it all.</p>

            {/* Search Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3.5 text-navy-400" />
                  <input type="text" placeholder="Where to?" className="input-field !pl-10 !bg-white !border-0 text-navy-900" />
                </div>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3.5 text-navy-400" />
                  <input type="text" placeholder="When?" className="input-field !pl-10 !bg-white !border-0 text-navy-900" />
                </div>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-3.5 text-navy-400" />
                  <input type="text" placeholder="Travelers?" className="input-field !pl-10 !bg-white !border-0 text-navy-900" />
                </div>
                <button className="btn-primary !rounded-xl">
                  <Search size={18} className="mr-2" /> Search
                </button>
              </div>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['Weekend Getaway', 'Honeymoon', 'Family Trip', 'Adventure', 'Pilgrimage', 'Luxury'].map(chip => (
                <span key={chip} className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-navy-200 hover:bg-white/20 cursor-pointer transition-colors">{chip}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="bg-white border-b">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '500+', label: 'Packages' },
              { num: '100+', label: 'Destinations' },
              { num: '50K+', label: 'Happy Travelers' },
              { num: '4.8★', label: 'Average Rating' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-sky-600">{s.num}</p>
                <p className="text-sm text-navy-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Destinations ──────────────────────────────────── */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900">Popular Destinations</h2>
            <p className="text-navy-500 mt-2 max-w-2xl mx-auto">Explore handpicked destinations loved by thousands of travelers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {DESTINATIONS.map(d => (
              <Link key={d.slug} to={`/destinations/${d.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{d.name}</h3>
                  <p className="text-sm text-white/80">{d.packages} packages</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/india/destinations" className="btn-secondary">
              View All Destinations <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Packages ─────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900">Featured Packages</h2>
              <p className="text-navy-500 mt-2">Handpicked travel packages for unforgettable experiences</p>
            </div>
            <Link to="/packages" className="hidden md:inline-flex btn-secondary text-sm">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPackages.map(p => (
                <Link key={p.id || p.slug} to={`/packages/${p.slug || p.id}`} className="card overflow-hidden group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {(p.coverImage || p.image) && <img src={p.coverImage || p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    {p.category && <span className="absolute top-3 left-3 badge-blue">{p.category}</span>}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-navy-500 mb-1">{p.destination} · {p.durationDays || ''}D/{p.durationNights || ''}N</p>
                    <h3 className="font-bold text-navy-900 mb-2 group-hover:text-sky-600 transition-colors">{p.title}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Star size={14} className="text-gold-500 fill-gold-500" />
                      <span className="text-sm font-medium">{p.rating}</span>
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
          <div className="text-center mt-8 md:hidden">
            <Link to="/packages" className="btn-primary">View All Packages</Link>
          </div>
        </div>
      </section>

      {/* ── Why TravelVista ─────────────────────────────────────── */}
      <section className="section-padding bg-navy-900 text-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Why TravelVista?</h2>
            <p className="text-navy-300 mt-2">Your journey, our expertise</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="text-center">
                  <div className="w-16 h-16 bg-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-sky-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-navy-300">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900">What Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-navy-700 mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{t.name}</p>
                    <p className="text-xs text-navy-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-to-r from-sky-600 to-sky-800 text-white text-center">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Explore?</h2>
          <p className="text-sky-100 max-w-2xl mx-auto mb-8">Let us plan your perfect trip. From booking to travel, we've got you covered every step of the way.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages" className="btn-gold text-lg !px-8">Browse Packages</Link>
            <Link to="/plan-trip" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">Plan My Trip</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
