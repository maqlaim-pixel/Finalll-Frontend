import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ChevronRight, ChevronLeft, Search, Heart, Shield, Clock, Star, CheckCircle, Camera, ArrowRight, Users, Calendar, Send } from 'lucide-react'
import api from '../../services/api'

const WEDDING_SERVICES = [
  { icon: '🏛️', name: 'Venue Selection', desc: 'Stunning venues for your perfect celebration' },
  { icon: '📋', name: 'Wedding Planning', desc: 'End-to-end planning & seamless management' },
  { icon: '🎨', name: 'Décor & Themes', desc: 'Beautiful themes & décor that reflect your style' },
  { icon: '🍽️', name: 'Catering', desc: 'Exquisite cuisines & customized menus' },
  { icon: '🎵', name: 'Entertainment', desc: 'Live music, DJs & unique entertainment' },
  { icon: '📸', name: 'Photography', desc: 'Capture every moment beautifully' },
]

const DESTINATIONS = [
  { name: 'Udaipur, India', desc: 'The City of Lakes', price: '₹2,49,999', tag: 'Most Popular', tagColor: 'bg-rose-500', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=280&fit=crop' },
  { name: 'Goa, India', desc: 'Tropical Beach Weddings', price: '₹1,99,999', tag: 'Beach Weddings', tagColor: 'bg-pink-500', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=280&fit=crop' },
  { name: 'Jaipur, India', desc: 'Royal Heritage Weddings', price: '₹2,29,999', tag: 'Royal Weddings', tagColor: 'bg-amber-500', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=280&fit=crop' },
  { name: 'Maldives', desc: 'Dreamy Island Weddings', price: '₹3,99,999', tag: 'International', tagColor: 'bg-indigo-500', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=400&h=280&fit=crop' },
  { name: 'Santorini, Greece', desc: 'Magical Sunset Weddings', price: '₹4,99,999', tag: 'Exotic', tagColor: 'bg-teal-500', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=280&fit=crop' },
  { name: 'Kerala, India', desc: 'Backwater Paradise', price: '₹1,79,999', tag: 'Nature', tagColor: 'bg-green-500', image: 'https://images.unsplash.com/photo-1590050752117-29885e590d8e?w=400&h=280&fit=crop' },
]

const TESTIMONIALS = [
  { text: "MAQLAIM TOURS made our dream wedding a reality! Every detail was perfect and stress-free. Truly unforgettable.", name: 'Riya & Arjun', location: 'Udaipur Wedding', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { text: "The team handled everything from venue to décor to catering. We just enjoyed our special day without any worries.", name: 'Priya & Rahul', location: 'Goa Beach Wedding', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { text: "Our destination wedding in Bali was beyond our dreams. MAQLAIM TOURS's planning was impeccable.", name: 'Anita & Vikram', location: 'Bali Wedding', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
]

export default function WeddingPage() {
  const [destScroll, setDestScroll] = useState(0)
  const [testIdx, setTestIdx] = useState(0)
  const [destIdx, setDestIdx] = useState(0)

  const scrollDest = (dir) => {
    const el = document.getElementById('wedding-dest-carousel')
    if (el) el.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  useEffect(() => { const t = setInterval(() => setTestIdx(i => (i + 1) % TESTIMONIALS.length), 5000); return () => clearInterval(t) }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* ═══ HERO — Split Layout ═══ */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-pink-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left — Content */}
            <div>
              <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">Destination Weddings</span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-navy-900 leading-tight mt-3 mb-2">
                Your Dream Wedding,<br />
                <span className="text-rose-600">Our Perfect Planning.</span> <span className="text-3xl">💕</span>
              </h1>
              <p className="text-navy-600 text-lg mb-8 max-w-lg leading-relaxed">
                From exotic locations to flawless celebrations, we make your big day truly unforgettable.
              </p>
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: '🎯', title: 'Personalized Planning', desc: 'Tailored to your dreams' },
                  { icon: '🤝', title: 'End-to-End Support', desc: 'Hassle-free experience' },
                  { icon: '💰', title: 'Best Prices', desc: 'Exclusive wedding deals' },
                  { icon: '💎', title: 'Trusted Experts', desc: 'Years of wedding expertise' },
                ].map(b => (
                  <div key={b.title} className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{b.icon}</span>
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">{b.title}</p>
                      <p className="text-xs text-navy-500">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Enquiry Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-navy-900">Plan Your Dream Wedding</h2>
                <span className="text-3xl">💕</span>
              </div>
              <form onSubmit={e => { e.preventDefault(); alert('Thank you! Our wedding planner will contact you shortly.') }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">Wedding Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none text-navy-600 text-sm">
                      <option>Select Type</option>
                      <option>Destination Wedding</option><option>Beach Wedding</option><option>Royal Wedding</option>
                      <option>Intimate Wedding</option><option>Luxury Wedding</option><option>Budget Wedding</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">Destination</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none text-navy-600 text-sm">
                      <option>Select Destination</option>
                      <option>Udaipur</option><option>Jaipur</option><option>Goa</option><option>Kerala</option>
                      <option>Jaisalmer</option><option>Maldives</option><option>Bali</option><option>Santorini</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">Wedding Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                      <input type="date" className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">No. of Guests</label>
                    <div className="relative">
                      <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                      <input type="text" placeholder="Approx. Guests" className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">Your Name</label>
                    <div className="relative">
                      <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                      <input type="text" placeholder="Enter Your Name" className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                      <input type="tel" placeholder="Enter Number" className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-navy-700 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type="email" placeholder="Enter Email" className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm">
                  <Send size={16} /> Get Free Proposal
                </button>
              </form>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-navy-500">
                <span className="flex items-center gap-1"><Shield size={12} className="text-rose-600" /> 100% Privacy</span>
                <span className="flex items-center gap-1"><CheckCircle size={12} className="text-rose-600" /> No Hidden Cost</span>
                <span className="flex items-center gap-1"><Star size={12} className="text-rose-600" /> Best Price Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OUR WEDDING SERVICES ═══ */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-navy-900 mb-8 text-center">Our Wedding Services</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {WEDDING_SERVICES.map(s => (
              <div key={s.name} className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer group border border-gray-100">
                <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{s.icon}</span>
                <h3 className="font-semibold text-navy-900 text-sm mb-1">{s.name}</h3>
                <p className="text-xs text-navy-500 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE + DESTINATIONS + TESTIMONIALS ═══ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2/3 — Why Choose + Destinations */}
            <div className="lg:col-span-2 space-y-10">
              {/* Why Choose */}
              <div className="flex gap-8 items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-navy-900 mb-4">Why Choose MAQLAIM TOURS Weddings?</h2>
                  <ul className="space-y-3">
                    {[
                      'Handpicked luxury venues across the world',
                      'Dedicated wedding planner at every step',
                      'Exclusive deals & unmatched experiences',
                      '24/7 support for you & your guests',
                      'Customized packages to fit your needs',
                    ].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-navy-700">
                        <CheckCircle size={16} className="text-rose-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden md:block w-48 h-48 rounded-2xl overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop" alt="Wedding" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Popular Destinations */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-navy-900">Popular Wedding Destinations</h2>
                  <Link to="/packages" className="text-rose-600 font-medium text-sm hover:text-rose-700 flex items-center gap-1">View All Destinations <ArrowRight size={14} /></Link>
                </div>
                <div className="relative">
                  <div id="wedding-dest-carousel" className="flex gap-4 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
                    {DESTINATIONS.map((d, i) => (
                      <div key={d.name} className="min-w-[220px] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex-shrink-0">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className={`absolute top-3 left-3 ${d.tagColor} text-white text-[10px] font-medium px-2.5 py-1 rounded-full`}>{d.tag}</span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-navy-900 text-sm">{d.name}</h3>
                          <p className="text-xs text-navy-500 mt-0.5">{d.desc}</p>
                          <p className="text-sm font-bold text-rose-600 mt-2">From {d.price}</p>
                          <span className="text-xs text-rose-600 font-medium mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition-all">View Packages <ArrowRight size={12} /></span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => scrollDest(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10 border border-gray-200">
                    <ChevronLeft size={20} className="text-navy-600" />
                  </button>
                  <button onClick={() => scrollDest(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10 border border-gray-200">
                    <ChevronRight size={20} className="text-navy-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right 1/3 — Testimonials + Stats */}
            <div className="space-y-6">
              {/* Testimonial */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-rose-400 text-4xl font-serif mb-3">"</div>
                <p className="text-navy-700 leading-relaxed mb-6 text-sm">{TESTIMONIALS[testIdx].text}</p>
                <div className="flex items-center gap-3">
                  <img src={TESTIMONIALS[testIdx].avatar} alt={TESTIMONIALS[testIdx].name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">— {TESTIMONIALS[testIdx].name}</p>
                    <p className="text-xs text-navy-500">{TESTIMONIALS[testIdx].location}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {TESTIMONIALS.map((_, i) => (
                    <button key={i} onClick={() => setTestIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === testIdx ? 'bg-rose-600' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                <div className="grid grid-cols-2 gap-4 text-center">
                  {[
                    { value: '500+', label: 'Weddings Planned' },
                    { value: '50+', label: 'Destinations' },
                    { value: '200+', label: 'Wedding Experts' },
                    { value: '98%', label: 'Happy Couples' },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="text-2xl font-bold text-rose-600">{s.value}</p>
                      <p className="text-xs text-navy-600 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="py-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '💰', title: 'Best Price Guarantee', desc: 'We offer the best prices for your dream wedding' },
              { icon: '📞', title: '24/7 Assistance', desc: 'Our experts are with you at every step' },
              { icon: '🎁', title: 'Custom Packages', desc: 'Tailored packages to suit your style and budget' },
              { icon: '❤️', title: 'Trusted by Thousands', desc: 'Thousands of couples trust MAQLAIM TOURS for their big day' },
            ].map(t => (
              <div key={t.title} className="flex items-start gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{t.title}</p>
                  <p className="text-xs text-navy-500">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
