import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Clock, MapPin, ChevronLeft, ChevronRight, Phone, Mail, Send, Camera, ArrowRight, Building } from 'lucide-react'
import api from '../../services/api'

const HERO_SLIDES = [
  { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=600&fit=crop', title: 'MICE Travel Solutions', subtitle: 'Meetings, Incentives, Conferences & Exhibitions — professionally managed' },
  { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&h=600&fit=crop', title: 'Corporate Events', subtitle: 'World-class venues and seamless event management for your team' },
  { image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1400&h=600&fit=crop', title: 'Team Building Retreats', subtitle: 'Motivate your team with inspiring offsite experiences' },
  { image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&h=600&fit=crop', title: 'Conference & Seminars', subtitle: 'State-of-the-art facilities for impactful conferences' },
]

const MICE_SERVICES = [
  { name: 'Meetings', icon: '🤝', desc: 'Board meetings, team sync, strategy sessions' },
  { name: 'Incentive Tours', icon: '🏆', desc: 'Reward trips for top performers' },
  { name: 'Conferences', icon: '🎤', desc: 'Large-scale conferences & summits' },
  { name: 'Exhibitions', icon: '🏢', desc: 'Trade shows, expos & product launches' },
  { name: 'Corporate Events', icon: '🎉', desc: 'Annual days, galas & celebrations' },
  { name: 'Team Building', icon: '💪', desc: 'Offsite team bonding activities' },
]

export default function MICEPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [packages, setPackages] = useState([])
  const [search, setSearch] = useState('')
  const [galleryIndex, setGalleryIndex] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => { api.get('/packages').then(res => setPackages(res.data)).catch(() => {}) }, [])
  useEffect(() => { timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length), 5000); return () => clearInterval(timerRef.current) }, [])

  const goToSlide = (i) => { setCurrentSlide(i); clearInterval(timerRef.current); timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length), 5000) }

  const filtered = packages.filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.destination?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-navy-900">
        {HERO_SLIDES.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
              <div className="container-wide"><h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">{slide.title}</h1><p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow">{slide.subtitle}</p>
                <Link to="/contact" className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">Get a Quote <ArrowRight size={18} /></Link></div>
            </div>
          </div>
        ))}
        <button onClick={() => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm z-10"><ChevronLeft size={24} /></button>
        <button onClick={() => goToSlide((currentSlide + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm z-10"><ChevronRight size={24} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">{HERO_SLIDES.map((_, i) => (<button key={i} onClick={() => goToSlide(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/40'}`} />))}</div>
      </section>

      {/* MICE SERVICES */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">MICE Services</h2>
            <p className="text-navy-500 mt-3 max-w-xl mx-auto">End-to-end corporate travel solutions — from planning to execution</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {MICE_SERVICES.map(s => (
              <div key={s.name} className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-sky-100">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-lg text-navy-900">{s.name}</h3>
                <p className="text-sm text-navy-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div><span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">MICE Packages</span><h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Corporate Travel Packages</h2></div>
            <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none w-56" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <Link key={p.id || p.slug} to={`/packages/${p.slug || p.id}`} className="card overflow-hidden group">
                <div className="relative aspect-[16/10] overflow-hidden">{p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}<span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">corporate</span></div>
                <div className="p-5"><p className="text-xs text-navy-500 mb-1 flex items-center gap-1"><MapPin size={12} /> {p.destination || p.state} · <Clock size={12} /> {p.durationDays}D/{p.durationNights}N</p><h3 className="font-bold text-navy-900 mb-2 group-hover:text-sky-600 transition-colors">{p.title}</h3><div className="flex items-baseline gap-2"><span className="text-xl font-bold text-sky-600">₹{p.startingPrice?.toLocaleString()}</span><span className="text-xs text-navy-500">/person</span></div></div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && <div className="text-center py-16"><Building size={48} className="mx-auto text-navy-300 mb-4" /><h3 className="text-xl font-semibold text-navy-700">No MICE packages found</h3></div>}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-padding bg-gradient-to-br from-slate-800 to-indigo-900 text-white">
        <div className="container-wide">
          <div className="text-center mb-12"><span className="text-indigo-300 font-semibold text-sm uppercase tracking-wider">Why MAQLAIM TOURS</span><h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Why Choose Us for MICE?</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ icon: '📋', title: 'End-to-End Management', desc: 'We handle everything — venues, logistics, branding, AV, and on-ground execution' }, { icon: '🏨', title: 'Premium Venues', desc: 'Access to 500+ verified conference and event venues across India' }, { icon: '👥', title: 'Group Travel', desc: 'Seamless group transportation, accommodation, and coordination for 10 to 10,000+ attendees' }, { icon: '📊', title: 'Budget Optimization', desc: 'Maximize your event ROI with transparent pricing and smart cost management' }].map((item, i) => (
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
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2 mb-6">Plan Your Corporate Event</h2>
              <p className="text-navy-500 mb-8">Tell us about your corporate event and our MICE specialists will create a custom proposal with venue options, logistics, and pricing.</p>
              <div className="space-y-5">
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Phone size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Call Us</p><p className="font-semibold text-navy-900">+91 98765 43210</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><Mail size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Email Us</p><p className="font-semibold text-navy-900">mice@travelvista.com</p></div></div>
                <div className="flex items-center gap-4"><div className="bg-sky-100 p-3 rounded-xl"><MapPin size={20} className="text-sky-600" /></div><div><p className="text-sm text-navy-500">Visit Us</p><p className="font-semibold text-navy-900">Mumbai, Maharashtra, India</p></div></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Request a Quote</h3>
              <form onSubmit={e => { e.preventDefault(); alert('Thank you! Our MICE team will contact you with a custom proposal.') }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Company Name *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /><input type="text" placeholder="Contact Person *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4"><input type="email" placeholder="Email *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /><input type="tel" placeholder="Phone *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600"><option>Event Type</option><option>Meeting</option><option>Conference</option><option>Exhibition</option><option>Incentive Tour</option><option>Team Building</option><option>Corporate Event</option></select>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600"><option>Number of Attendees</option><option>10-25</option><option>25-50</option><option>50-100</option><option>100-500</option><option>500+</option></select>
                </div>
                <div className="grid grid-cols-2 gap-4"><input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /><input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /></div>
                <textarea placeholder="Event Requirements / Budget Range" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" />
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"><Send size={18} /> Request Quote</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
