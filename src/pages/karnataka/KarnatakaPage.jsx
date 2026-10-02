import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Clock, MapPin, ChevronLeft, ChevronRight, Phone, Mail, Send, Camera, ArrowRight, Heart, Shield, Award } from 'lucide-react'
import { Landmark, Palmtree, Mountain, Crown, TreePalm, Fish } from 'lucide-react'
import WhyTravelSection from '../../components/common/WhyTravelSection'
import StatePackagesSection from '../../components/common/StatePackagesSection'
import api from '../../services/api'

const HERO_SLIDES = [
  { image: 'https://images.unsplash.com/photo-1582515009775-4a44eda7ef48?w=1400&h=600&fit=crop', title: 'Incredible Karnataka', subtitle: 'Temples \u2022 Beaches \u2022 Hills \u2022 Heritage' },
  { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop', title: 'Hampi — UNESCO Heritage', subtitle: 'Ancient Vijayanagara ruins and boulder landscapes' },
  { image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&h=600&fit=crop', title: 'Coastal Karnataka', subtitle: 'Gokarna, Mangalore and pristine beaches' },
  { image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1400&h=600&fit=crop', title: 'Coorg — Scotland of India', subtitle: 'Misty coffee plantations and waterfalls' },
]

const WHY_KARNATAKA = [
  { Icon: Landmark, title: 'Heritage Sites', desc: 'Hampi, Badami, Belur & Halebidu' },
  { Icon: Palmtree, title: 'Stunning Beaches', desc: 'Gokarna, Murudeshwar, Mangalore' },
  { Icon: Mountain, title: 'Hill Stations', desc: 'Coorg, Chikmagalur, Nandi Hills' },
  { Icon: Crown, title: 'Mysore Palace', desc: 'Royal heritage and Dasara festival' },
  { Icon: TreePalm, title: 'Western Ghats', desc: 'Biodiversity hotspot & coffee plantations' },
  { Icon: Fish, title: 'Wildlife Safari', desc: 'Bandipur, Nagarhole & Kabini' },
]

const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1582515009775-4a44eda7ef48?w=400&h=300&fit=crop', alt: 'Hampi Ruins', location: 'Hampi' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', alt: 'Coorg Coffee Plantation', location: 'Coorg' },
  { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', alt: 'Gokarna Beach', location: 'Gokarna' },
  { url: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=400&h=300&fit=crop', alt: 'Mysore Palace', location: 'Mysore' },
  { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop', alt: 'Nandi Hills Sunrise', location: 'Nandi Hills' },
  { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop', alt: 'Badami Caves', location: 'Badami' },
  { url: 'https://images.unsplash.com/photo-1590050752117-29885e590d8e?w=400&h=300&fit=crop', alt: 'Jog Falls', location: 'Shimoga' },
  { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop', alt: 'Bandipur Safari', location: 'Bandipur' },
]

export default function KarnatakaPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [destinations, setDestinations] = useState([])
  const [packages, setPackages] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [galleryIndex, setGalleryIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    Promise.all([api.get('/destinations'), api.get('/packages')]).then(([d, p]) => {
      setDestinations(d.data.filter(x => x.state?.toLowerCase() === 'karnataka'))
      setPackages(p.data.filter(x => x.state?.toLowerCase() === 'karnataka' || x.destination?.toLowerCase().includes('karnataka')))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => { timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length), 5000); return () => clearInterval(timerRef.current) }, [])
  const goToSlide = (i) => { setCurrentSlide(i); clearInterval(timerRef.current); timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length), 5000) }

  const filtered = packages.filter(p => { const q = search.toLowerCase(); return !q || p.title?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q) })
    .sort((a, b) => sortBy === 'price-low' ? (a.startingPrice || 0) - (b.startingPrice || 0) : sortBy === 'price-high' ? (b.startingPrice || 0) - (a.startingPrice || 0) : new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

  return (
    <div>
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-navy-900">
        {HERO_SLIDES.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
              <div className="container-wide">
                <p className="text-gold-400 text-sm font-medium mb-2">{"\u26EA"} Temples {"\u2022"} Beaches {"\u2022"} Hills {"\u2022"} Heritage</p>
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">{slide.title}</h1>
                <p className="text-lg md:text-2xl text-gray-200 max-w-2xl drop-shadow">{slide.subtitle}</p>
                <p className="text-gray-300 mt-3 max-w-xl text-sm md:text-base">From the ancient ruins of Hampi to the misty coffee hills of Coorg, the royal heritage of Mysore to the pristine beaches of Gokarna — Karnataka is a land of diverse wonders.</p>
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex items-center gap-2 text-sm"><MapPin size={16} className="text-gold-400" /> <strong>{destinations.length || '12+'}</strong> Destinations</div>
                  <div className="flex items-center gap-2 text-sm"><Award size={16} className="text-gold-400" /> UNESCO Heritage</div>
                  <div className="flex items-center gap-2 text-sm"><Heart size={16} className="text-gold-400" /> Coffee & Hills</div>
                  <div className="flex items-center gap-2 text-sm"><Shield size={16} className="text-gold-400" /> Coastal Beauty</div>
                </div>
                <Link to="#packages" className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">Explore Packages <ArrowRight size={18} /></Link>
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"><ChevronLeft size={24} /></button>
        <button onClick={() => goToSlide((currentSlide + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-colors z-10"><ChevronRight size={24} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">{HERO_SLIDES.map((_, i) => <button key={i} onClick={() => goToSlide(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/40'}`} />)}</div>
      </section>

      <WhyTravelSection title="Why Travel Karnataka?" subtitle="Discover Karnataka" items={WHY_KARNATAKA} />

      {destinations.length > 0 && <section className="section-padding bg-gray-50"><div className="container-wide"><div className="text-center mb-10"><span className="text-gold-600 font-semibold text-sm uppercase tracking-wider">Explore Karnataka</span><h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Popular Destinations in Karnataka</h2></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">{destinations.slice(0, 5).map(d => <Link key={d.id || d.slug} to={`/destinations/${d.slug || d.id}`} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"><div className="aspect-[4/3] overflow-hidden">{(d.image || d.coverImage) ? <img src={d.image || d.coverImage} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full bg-gradient-to-br from-amber-400 to-navy-600 flex items-center justify-center text-white text-3xl">{"\u26EA"}</div>}</div><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-4 text-white"><h3 className="font-bold text-lg">{d.name}</h3><p className="text-sm text-gray-200">{d.tagline || 'Karnataka'}</p><p className="text-xs text-gold-400 mt-1 font-medium">Explore More {"\u2192"}</p></div></Link>)}</div></div></section>}

      {/* ═══ ALL KARNATAKA PACKAGES ═══ */}
      <StatePackagesSection stateName="Karnataka" />
      

      <section className="section-padding bg-gray-50"><div className="container-wide"><div className="text-center mb-10"><span className="text-gold-600 font-semibold text-sm uppercase tracking-wider">Photo Gallery</span><h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Karnataka in Pictures</h2></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{GALLERY_IMAGES.map((img, i) => <button key={i} onClick={() => setGalleryIndex(i)} className="group relative rounded-xl overflow-hidden aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-sky-500"><img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /><div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"><Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity"><p className="text-white text-sm font-medium">{img.alt}</p><p className="text-gray-300 text-xs">{img.location}</p></div></button>)}</div></div></section>

      {galleryIndex !== null && <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setGalleryIndex(null)}><button onClick={() => setGalleryIndex(null)} className="absolute top-4 right-4 text-white text-3xl z-10">&times;</button><button onClick={e => { e.stopPropagation(); setGalleryIndex((galleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length) }} className="absolute left-4 text-white text-4xl z-10"><ChevronLeft size={40} /></button><div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}><img src={GALLERY_IMAGES[galleryIndex].url} alt="" className="w-full max-h-[80vh] object-contain rounded-lg" /><div className="text-center mt-4"><p className="text-white text-lg font-semibold">{GALLERY_IMAGES[galleryIndex].alt}</p><p className="text-gray-400 text-sm">{GALLERY_IMAGES[galleryIndex].location}</p></div></div><button onClick={e => { e.stopPropagation(); setGalleryIndex((galleryIndex + 1) % GALLERY_IMAGES.length) }} className="absolute right-4 text-white text-4xl z-10"><ChevronRight size={40} /></button></div>}

      <section className="bg-gradient-to-r from-navy-900 to-amber-900 py-8"><div className="container-wide"><div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white"><div><div className="text-3xl font-bold">{destinations.length || '12+'}+</div><div className="text-sm text-gray-300 mt-1">Destinations</div></div><div><div className="text-3xl font-bold">{packages.length || '25+'}+</div><div className="text-sm text-gray-300 mt-1">Packages</div></div><div><div className="text-3xl font-bold">12,000+</div><div className="text-sm text-gray-300 mt-1">Happy Travelers</div></div><div><div className="text-3xl font-bold">4.8 {"\u2605"}</div><div className="text-sm text-gray-300 mt-1">Average Rating</div></div></div></div></section>

      <section className="section-padding bg-white" id="contact"><div className="container-wide"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"><div><span className="text-gold-600 font-semibold text-sm uppercase tracking-wider">Get in Touch</span><h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2 mb-6">Plan Your Karnataka Trip</h2><p className="text-navy-500 mb-8">Ready to explore heritage, hills and beaches? Contact our experts for the best Karnataka deals.</p><div className="space-y-5"><div className="flex items-center gap-4"><div className="bg-gold-100 p-3 rounded-xl"><Phone size={20} className="text-gold-600" /></div><div><p className="text-sm text-navy-500">Call Us</p><p className="font-semibold text-navy-900">+91 93137 10465</p></div></div><div className="flex items-center gap-4"><div className="bg-gold-100 p-3 rounded-xl"><Mail size={20} className="text-gold-600" /></div><div><p className="text-sm text-navy-500">Email Us</p><p className="font-semibold text-navy-900">sales@maqlaimtours.com</p></div></div></div></div><div className="bg-gray-50 rounded-2xl shadow-lg p-8"><h3 className="text-xl font-bold text-navy-900 mb-6">Send Us an Enquiry</h3><form onSubmit={e => { e.preventDefault(); alert('Thank you! Our team will contact you shortly.') }} className="space-y-4"><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Full Name *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /><input type="email" placeholder="Email *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /></div><div className="grid grid-cols-2 gap-4"><input type="tel" placeholder="Phone *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /><input type="text" defaultValue="Karnataka" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" /></div><textarea placeholder="Your Message" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" /><button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"><Send size={18} /> Submit Enquiry</button></form></div></div></div></section>
    </div>
  )
}
