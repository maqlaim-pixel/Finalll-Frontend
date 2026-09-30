import { Users, Globe, Award, Heart, Shield, Headphones, MapPin, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const STATS = [
  { icon: Globe, num: '100+', label: 'Destinations' },
  { icon: Users, num: '50,000+', label: 'Happy Travelers' },
  { icon: Award, num: '15+', label: 'Years Experience' },
  { icon: Star, num: '4.8', label: 'Average Rating' },
]

const TEAM = [
  { name: 'Anjali Sharma', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300', bio: '15+ years in travel industry. Passionate about creating unforgettable experiences.' },
  { name: 'Rahul Mehta', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', bio: 'Expert in logistics and destination management across India.' },
  { name: 'Priya Singh', role: 'Creative Director', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300', bio: 'Brings travel stories to life through design and content.' },
]

export default function AboutPage() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-navy-900 to-sky-900 text-white py-20">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About MAQLAIM TOURS</h1>
          <p className="text-navy-200 max-w-2xl mx-auto">Crafting unforgettable journeys across India and the world since 2009</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="text-center p-6 bg-white rounded-xl border">
                  <Icon size={32} className="text-sky-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-navy-900">{s.num}</p>
                  <p className="text-sm text-navy-500 mt-1">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-navy-900 mb-4">Our Story</h2>
            <p className="text-navy-600 leading-relaxed">MAQLAIM TOURS was born from a simple belief: everyone deserves a perfectly planned journey. What started as a small team of travel enthusiasts in Mumbai has grown into one of India's most trusted travel platforms, serving over 50,000 happy travelers across 100+ destinations.</p>
            <p className="text-navy-600 leading-relaxed mt-4">We combine local expertise with modern technology to curate experiences that go beyond typical tourism — from hidden gems in Rajasthan to luxury resorts in the Maldives.</p>
          </div>

          <h2 className="text-3xl font-display font-bold text-navy-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map(m => (
              <div key={m.name} className="bg-white rounded-xl border p-6 text-center">
                <img src={m.image} alt={m.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
                <h3 className="font-bold text-navy-900">{m.name}</h3>
                <p className="text-sm text-sky-600 mb-2">{m.role}</p>
                <p className="text-sm text-navy-500">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-sky-600 text-white text-center">
        <div className="container-wide">
          <h2 className="text-3xl font-display font-bold mb-4">Start Your Journey</h2>
          <p className="text-sky-100 mb-8 max-w-xl mx-auto">Let us help you plan the perfect trip. Get in touch with our travel experts today.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/packages" className="btn-gold">Browse Packages</Link>
            <Link to="/contact" className="px-6 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
