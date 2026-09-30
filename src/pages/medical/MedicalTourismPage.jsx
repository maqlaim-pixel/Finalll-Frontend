import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ChevronRight, ChevronLeft, Search, Heart, Shield, Clock, Star, CheckCircle, Plane, FileText, Building2, Stethoscope, Pill, Users, ArrowRight, MessageCircle } from 'lucide-react'
import api from '../../services/api'

const MEDICAL_SERVICES = [
  { icon: <Plane size={28} />, label: 'Airport Pickup\n& Drop' },
  { icon: <FileText size={28} />, label: 'Visa Assistance' },
  { icon: <Building2 size={28} />, label: 'Hotel & Stay' },
  { icon: <Stethoscope size={28} />, label: 'Treatment\nCoordination' },
  { icon: <Pill size={28} />, label: 'Medication\n& Follow-up' },
  { icon: <Users size={28} />, label: 'Local\nAssistance' },
]

const TOP_TREATMENTS = [
  { name: 'Cardiac Care', desc: 'Bypass Surgery, Angioplasty, Valve Replacement', icon: '❤️' },
  { name: 'Orthopedics', desc: 'Joint Replacement, Spine Surgery, Arthroscopy', icon: '🦴' },
  { name: 'Cancer Care', desc: 'Chemotherapy, Radiation Therapy, Immunotherapy', icon: '🎗️' },
  { name: 'Neurosurgery', desc: 'Brain Tumor, Spine Surgery, Neuro Endoscopy', icon: '🧠' },
  { name: 'Cosmetic Surgery', desc: 'Rhinoplasty, Liposuction, Hair Transplant', icon: '✨' },
  { name: 'Fertility Treatment', desc: 'IVF, ICSI, IUI, Surrogacy', icon: '👶' },
]

const DESTINATIONS = [
  { name: 'Delhi', desc: 'Advanced multi-specialty hospitals', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=250&fit=crop' },
  { name: 'Mumbai', desc: 'Leading in cardiac & oncology care', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=250&fit=crop' },
  { name: 'Chennai', desc: 'Best in orthopedics & joint replacement', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=250&fit=crop' },
  { name: 'Bangalore', desc: 'Top choice for neurology & spine care', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=250&fit=crop' },
  { name: 'Hyderabad', desc: 'Affordable treatments with quality care', image: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=400&h=250&fit=crop' },
  { name: 'Kolkata', desc: 'Excellent cancer care & transplant services', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=250&fit=crop' },
]

const TESTIMONIALS = [
  { text: "From appointment to post-treatment follow-up, MAQLAIM TOURS made my medical journey smooth and stress-free. Highly recommended!", name: 'Rajesh Sharma', country: 'USA', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { text: "The best decision I made was choosing MAQLAIM TOURS for my heart surgery in India. Saved 70% compared to UK costs with same quality care.", name: 'Sarah Johnson', country: 'UK', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { text: "Excellent coordination from visa to hospital stay. The team was professional and caring throughout my treatment journey.", name: 'Mohammed Al-Rashid', country: 'UAE', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
]

const STATS = [
  { value: '60% to 80%', label: 'Cost Savings', sub: 'Compared to USA, UK & EU' },
  { value: '650+', label: 'Accredited Hospitals', sub: 'Across India' },
  { value: '45,000+', label: 'International Patients Every Year', sub: 'Trust Indian Healthcare' },
  { value: '24/7', label: 'Patient Support', sub: 'Throughout Your Journey' },
  { value: 'Fast', label: 'Appointments', sub: 'Minimal Waiting Time' },
]

const TRUST_COUNTRIES = [
  { flag: '🇺🇸', name: 'USA' }, { flag: '🇬🇧', name: 'UK' }, { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇦🇺', name: 'Australia' }, { flag: '🇦🇪', name: 'UAE' }, { flag: '🇴🇲', name: 'Oman' },
  { flag: '🇧🇩', name: 'Bangladesh' }, { flag: '🇹🇿', name: 'Tanzania' }, { flag: '🇳🇬', name: 'Nigeria' },
  { flag: '🇳🇵', name: 'Nepal' },
]

export default function MedicalTourismPage() {
  const [destScroll, setDestScroll] = useState(0)
  const [testIdx, setTestIdx] = useState(0)

  const scrollDest = (dir) => {
    const el = document.getElementById('dest-carousel')
    if (el) { el.scrollBy({ left: dir * 300, behavior: 'smooth' }) }
  }

  useEffect(() => { const t = setInterval(() => setTestIdx(i => (i + 1) % TESTIMONIALS.length), 5000); return () => clearInterval(t) }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ HERO SECTION — Split Layout ═══ */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-cyan-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left — Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-navy-900 leading-tight mb-5">
                World-Class Treatment.<br />
                <span className="text-teal-600">Trusted Care in India.</span>
              </h1>
              <p className="text-navy-600 text-lg mb-8 max-w-lg leading-relaxed">
                Experience advanced medical treatments, modern hospitals and personalized care at a fraction of the cost.
              </p>
              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: '🏥', label: 'JCI Accredited\nHospitals' },
                  { icon: '👨‍⚕️', label: 'Expert & Experienced\nDoctors' },
                  { icon: '💰', label: 'Affordable\nTreatment' },
                  { icon: '🤝', label: 'End-to-End\nAssistance' },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center text-center p-3">
                    <span className="text-3xl mb-2">{b.icon}</span>
                    <span className="text-xs font-medium text-navy-700 whitespace-pre-line leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Enquiry Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-navy-900 mb-5">Enquire for Treatment</h2>
              <form onSubmit={e => { e.preventDefault(); alert('Thank you! Our medical coordinator will contact you within 24 hours.') }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-navy-700 mb-1 block">Treatment Type</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-navy-600 text-sm">
                    <option>Select Treatment</option>
                    <option>Cardiac Surgery</option><option>Orthopedic</option><option>Cancer Care</option>
                    <option>Neurosurgery</option><option>Cosmetic Surgery</option><option>Fertility Treatment</option>
                    <option>Dental Care</option><option>Eye Surgery</option><option>Ayurveda & Wellness</option><option>Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">Name</label>
                    <input type="text" placeholder="Enter Your Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">Country</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-navy-600 text-sm">
                      <option>Select Country</option>
                      <option>USA</option><option>UK</option><option>Canada</option><option>Australia</option>
                      <option>UAE</option><option>Saudi Arabia</option><option>Bangladesh</option><option>Nepal</option>
                      <option>Nigeria</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">Phone Number</label>
                    <input type="tel" placeholder="Enter Number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy-700 mb-1 block">Email</label>
                    <input type="email" placeholder="Enter Email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm">
                  <Plane size={16} /> Get Free Consultation
                </button>
              </form>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-navy-500">
                <span className="flex items-center gap-1"><Shield size={12} className="text-teal-600" /> 100% Privacy</span>
                <span className="flex items-center gap-1"><CheckCircle size={12} className="text-teal-600" /> No Hidden Cost</span>
                <span className="flex items-center gap-1"><Star size={12} className="text-teal-600" /> Best Price Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OUR MEDICAL SERVICES ═══ */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-navy-900 mb-6">Our Medical Services</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {MEDICAL_SERVICES.map(s => (
              <div key={s.label} className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-teal-50 transition-colors cursor-pointer group">
                <div className="text-teal-600 mb-2 group-hover:scale-110 transition-transform">{s.icon}</div>
                <span className="text-xs font-medium text-navy-700 whitespace-pre-line leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOP TREATMENTS + NEED HELP ═══ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Treatments */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-navy-900 mb-6">Top Treatments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TOP_TREATMENTS.map(t => (
                  <div key={t.name} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                    <span className="text-2xl mt-0.5">{t.icon}</span>
                    <div>
                      <h3 className="font-semibold text-navy-900">{t.name}</h3>
                      <p className="text-sm text-navy-500 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/packages" className="mt-4 inline-flex items-center gap-1 text-teal-600 font-medium text-sm hover:text-teal-700 transition-colors">
                View All Destinations <ArrowRight size={14} />
              </Link>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-navy-900 mb-2">Need Help?</h3>
              <p className="text-sm text-navy-500 mb-5">Our medical experts are here to assist you 24/7</p>
              <div className="flex items-center gap-3 mb-4 bg-teal-50 p-4 rounded-xl">
                <Phone size={20} className="text-teal-600" />
                <div>
                  <p className="font-bold text-navy-900">+91 12345 67890</p>
                  <p className="text-xs text-navy-500">Call us anytime</p>
                </div>
              </div>
              <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors w-full">
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TOP MEDICAL DESTINATIONS ═══ */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-navy-900 mb-6">Top Medical Tourism Destinations in India</h2>
          <div className="relative">
            <div id="dest-carousel" className="flex gap-4 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
              {DESTINATIONS.map(d => (
                <div key={d.name} className="min-w-[200px] md:min-w-[240px] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex-shrink-0">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-navy-900 group-hover:text-teal-600 transition-colors">{d.name}</h3>
                    <p className="text-xs text-navy-500 mt-1">{d.desc}</p>
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
      </section>

      {/* ═══ WHAT OUR PATIENTS SAY ═══ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-navy-900 mb-6">What Our Patients Say</h2>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-teal-600 text-4xl font-serif mb-3">"</div>
                <p className="text-navy-700 text-lg leading-relaxed mb-6">{TESTIMONIALS[testIdx].text}</p>
                <div className="flex items-center gap-3">
                  <img src={TESTIMONIALS[testIdx].avatar} alt={TESTIMONIALS[testIdx].name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-navy-900">– {TESTIMONIALS[testIdx].name}</p>
                    <p className="text-sm text-navy-500">{TESTIMONIALS[testIdx].country}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  {TESTIMONIALS.map((_, i) => (
                    <button key={i} onClick={() => setTestIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === testIdx ? 'bg-teal-600' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>
            {/* Right side — additional testimonial or CTA */}
            <div className="flex flex-col gap-4">
              <div className="bg-teal-600 text-white rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2">Ready to Start?</h3>
                <p className="text-teal-100 text-sm mb-4">Get a free treatment plan and cost estimate from our medical experts.</p>
                <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-teal-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-teal-50 transition-colors">
                  Get Free Consultation <ArrowRight size={16} />
                </Link>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-navy-900 mb-3">Our Certifications</h3>
                <div className="flex gap-4">
                  {[{ label: 'NABH', sub: 'Accredited' }, { label: 'JCI', sub: 'Accredited' }, { label: 'ISO', sub: 'Certified' }].map(c => (
                    <div key={c.label} className="flex flex-col items-center p-3 bg-teal-50 rounded-xl flex-1">
                      <Shield size={24} className="text-teal-600 mb-1" />
                      <span className="font-bold text-navy-900 text-sm">{c.label}</span>
                      <span className="text-[10px] text-navy-500">{c.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-10 bg-gradient-to-r from-teal-700 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-bold">{s.value}</p>
                <p className="text-sm font-medium text-teal-100 mt-1">{s.label}</p>
                <p className="text-xs text-teal-200">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUSTED BY PATIENTS WORLDWIDE ═══ */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-navy-900 text-lg mb-3">Trusted by Patients Worldwide</h3>
              <div className="flex flex-wrap items-center gap-3">
                {TRUST_COUNTRIES.map(c => (
                  <span key={c.name} className="flex items-center gap-1 text-sm text-navy-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <span className="text-lg">{c.flag}</span> {c.name}
                  </span>
                ))}
                <span className="text-sm text-navy-500 font-medium">and 120+ more countries</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {[{ label: 'NABH', sub: 'Accredited' }, { label: 'JCI', sub: 'Accredited' }, { label: 'ISO', sub: 'Certified' }].map(c => (
                <div key={c.label} className="flex flex-col items-center p-3 border-2 border-teal-200 rounded-xl">
                  <Shield size={28} className="text-teal-600 mb-1" />
                  <span className="font-bold text-navy-900 text-sm">{c.label}</span>
                  <span className="text-[10px] text-navy-500">{c.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
