import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Building2, Hotel, Car, Headphones, MapPin, Phone, Mail, Send, ArrowRight, CheckCircle, Star, Clock, Shield, Users, Globe, Briefcase, Plane, CreditCard, Calendar, FileText, TrendingUp, Wallet, Zap, Heart, Ticket, Stamp, Umbrella } from 'lucide-react'

const CATEGORIES = {
  management: {
    title: 'Business Travel Management',
    subtitle: 'Streamlined corporate travel solutions for modern businesses',
    description: 'End-to-end business travel management that saves time, reduces costs, and keeps your travelers safe. From policy compliance to real-time tracking, we handle every aspect of your corporate travel program so your team can focus on what matters — business.',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=600&fit=crop',
    breadcrumb: 'Business Travel Management',
    icon: Briefcase,
    features: [
      { icon: CreditCard, title: 'Expense Management', desc: 'Automated expense tracking, reporting, and reconciliation for all business trips' },
      { icon: Shield, title: 'Policy Compliance', desc: 'Enforce travel policies automatically — preferred vendors, budget limits, approval workflows' },
      { icon: Globe, title: 'Global Coverage', desc: 'Seamless booking across 190+ countries with 24/7 multilingual support' },
      { icon: TrendingUp, title: 'Travel Analytics', desc: 'Real-time dashboards with spending insights, savings reports, and ROI metrics' },
    ],
    highlights: [
      'Centralized booking platform for flights, hotels, and ground transport',
      'Automated approval workflows and policy enforcement',
      'Real-time trip alerts and traveler safety tracking',
      'Integration with corporate expense systems (SAP, Concur, Zoho)',
      'Dedicated travel desk for VIP executives',
      'Carbon footprint tracking and sustainability reports',
    ],
    stats: [
      { value: '500+', label: 'Corporate Clients' },
      { value: '98%', label: 'Booking Accuracy' },
      { value: '30%', label: 'Average Savings' },
      { value: '24/7', label: 'Support Available' },
    ],
  },
  hotels: {
    title: 'Hotel Bookings',
    subtitle: 'Preferred rates at 50,000+ hotels worldwide',
    description: 'Access exclusive corporate rates at premium hotels across the globe. Our hotel booking service ensures your travelers get the best accommodation at the best price — with flexible cancellation, loyalty points, and dedicated account management.',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=600&fit=crop',
    breadcrumb: 'Hotel Bookings',
    icon: Hotel,
    features: [
      { icon: Hotel, title: '50,000+ Hotels', desc: 'Global network from budget to luxury — Taj, Marriott, Hilton, Oberoi, and more' },
      { icon: CreditCard, title: 'Corporate Rates', desc: 'Negotiated rates 15-40% below public pricing with flexible payment terms' },
      { icon: Calendar, title: 'Flexible Booking', desc: 'Easy modifications, free cancellations up to 24 hours, and extended check-out options' },
      { icon: Star, title: 'Loyalty Programs', desc: 'Earn and manage hotel loyalty points across all major chains' },
    ],
    highlights: [
      'Single platform to book hotels across 190+ countries',
      'Rate comparison across multiple OTAs and direct hotel rates',
      'Real-time availability and instant confirmation',
      'Group hotel bookings with block rate management',
      'Invoice consolidation and centralized billing',
      'Post-stay feedback and rating system',
    ],
    stats: [
      { value: '50K+', label: 'Hotels Worldwide' },
      { value: '15-40%', label: 'Corporate Savings' },
      { value: '95%', label: 'Guest Satisfaction' },
      { value: 'Instant', label: 'Confirmation' },
    ],
  },
  transfers: {
    title: 'Airport Transfers',
    subtitle: 'Seamless airport pickup and drop services',
    description: 'Reliable, comfortable, and on-time airport transfers for your business travelers. From sedan to luxury coach, our fleet covers 200+ airports worldwide with professional chauffeurs, real-time tracking, and guaranteed on-time service.',
    heroImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&h=600&fit=crop',
    breadcrumb: 'Airport Transfers',
    icon: Plane,
    features: [
      { icon: Car, title: 'Premium Fleet', desc: 'Sedans, SUVs, luxury cars, and minibuses for groups of any size' },
      { icon: Clock, title: 'On-Time Guarantee', desc: 'Flight tracking, meet & greet, and guaranteed on-time pickup every time' },
      { icon: MapPin, title: '200+ Airports', desc: 'Coverage across major airports in India and international destinations' },
      { icon: Shield, title: 'Safety First', desc: 'GPS-tracked vehicles, verified chauffeurs, and 24/7 monitoring' },
    ],
    highlights: [
      'Flight tracking with automatic pickup time adjustment',
      'Meet & greet service with name board at arrivals',
      'Flight delay — no extra charges, we wait for you',
      'Multi-stop transfers and city tour options',
      'Corporate invoicing with GST compliance',
      'Real-time trip tracking for travel managers',
    ],
    stats: [
      { value: '200+', label: 'Airports Covered' },
      { value: '10K+', label: 'Monthly Transfers' },
      { value: '99.5%', label: 'On-Time Rate' },
      { value: '4.8★', label: 'Average Rating' },
    ],
  },
  support: {
    title: '24/7 Travel Support',
    subtitle: 'Round-the-clock assistance for your travelers',
    description: 'Travel doesn\'t follow office hours — neither does our support. Our 24/7 travel support team handles everything from last-minute bookings and itinerary changes to emergency assistance and crisis management, ensuring your travelers are always taken care of.',
    heroImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&h=600&fit=crop',
    breadcrumb: '24/7 Travel Support',
    icon: Headphones,
    features: [
      { icon: Headphones, title: '24/7/365 Support', desc: 'Live agents available every hour, every day — phone, email, chat, and WhatsApp' },
      { icon: Zap, title: 'Rapid Response', desc: 'Average response time under 2 minutes for urgent travel issues' },
      { icon: Shield, title: 'Emergency Help', desc: 'Medical emergencies, flight cancellations, lost documents — we handle it all' },
      { icon: Users, title: 'Dedicated Manager', desc: 'Assigned travel manager who knows your company policies and preferences' },
    ],
    highlights: [
      'Multi-channel support: phone, email, live chat, WhatsApp',
      'Real-time itinerary changes and rebooking',
      'Emergency medical and legal assistance coordination',
      'Flight cancellation and delay management',
      'Visa and documentation support',
      'Travel insurance claims assistance',
    ],
    stats: [
      { value: '24/7/365', label: 'Support Hours' },
      { value: '<2 min', label: 'Response Time' },
      { value: '99%', label: 'Issue Resolution' },
      { value: '12+', label: 'Languages' },
    ],
  },
  flights: {
    title: 'Flight Bookings',
    subtitle: 'Best fares on domestic & international flights',
    description: 'Access exclusive corporate airfares with flexible booking options. Our flight booking service covers 900+ airlines across 190+ countries — with fare comparison, schedule optimization, and dedicated support for business travelers who need reliability and value.',
    heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1400&h=600&fit=crop',
    breadcrumb: 'Flight Bookings',
    icon: Plane,
    features: [
      { icon: Plane, title: '900+ Airlines', desc: 'Access to all major carriers — IndiGo, Air India, Emirates, Singapore Airlines, and more' },
      { icon: CreditCard, title: 'Corporate Fares', desc: 'Exclusive business fares with flexible date changes and cancellation policies' },
      { icon: Calendar, title: 'Smart Scheduling', desc: 'AI-powered fare alerts and optimal booking time recommendations' },
      { icon: Clock, title: 'Real-Time Updates', desc: 'Live flight status, gate changes, delay alerts, and rebooking assistance' },
    ],
    highlights: [
      'Fare comparison across 900+ airlines in real-time',
      'Corporate negotiated fares 20-35% below public pricing',
      'Flexible rebooking and cancellation with no hidden fees',
      'Multi-city and complex itinerary management',
      'Preferred seat selection and meal preferences',
      'Loyalty program management across airline alliances',
    ],
    stats: [
      { value: '900+', label: 'Airlines' },
      { value: '20-35%', label: 'Corporate Savings' },
      { value: '190+', label: 'Countries' },
      { value: '<5 min', label: 'Booking Time' },
    ],
  },
  visa: {
    title: 'Visa Assistance',
    subtitle: 'Hassle-free visa processing for 190+ countries',
    description: 'Navigate complex visa requirements with confidence. Our visa assistance service provides end-to-end support — from document preparation and application submission to embassy coordination and status tracking — for business travelers worldwide.',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&h=600&fit=crop',
    breadcrumb: 'Visa Assistance',
    icon: Stamp,
    features: [
      { icon: Stamp, title: '190+ Countries', desc: 'Visa support for every major business travel destination worldwide' },
      { icon: FileText, title: 'Document Prep', desc: 'Expert guidance on documentation, forms, and embassy requirements' },
      { icon: Clock, title: 'Fast Processing', desc: 'Express visa processing with embassy coordination for urgent travel' },
      { icon: Shield, title: 'High Approval Rate', desc: '95%+ visa approval rate with thorough pre-submission review' },
    ],
    highlights: [
      'Online visa application portal with real-time status tracking',
      'Document checklist and preparation guidance for each country',
      'Embassy appointment scheduling and coordination',
      'Express processing for urgent business travel needs',
      'Group visa processing for corporate teams',
      'Visa policy updates and travel advisory alerts',
    ],
    stats: [
      { value: '190+', label: 'Countries' },
      { value: '95%+', label: 'Approval Rate' },
      { value: '3-5 days', label: 'Processing Time' },
      { value: '10K+', label: 'Visas Processed' },
    ],
  },
  insurance: {
    title: 'Travel Insurance',
    subtitle: 'Comprehensive coverage for worry-free business travel',
    description: 'Protect your travelers and your business with comprehensive travel insurance. From medical emergencies and trip cancellations to baggage loss and flight delays — our insurance partners offer coverage that keeps your team safe and your company protected.',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&h=600&fit=crop',
    breadcrumb: 'Travel Insurance',
    icon: Umbrella,
    features: [
      { icon: Shield, title: 'Full Coverage', desc: 'Medical, trip cancellation, baggage, delay, and liability coverage' },
      { icon: Wallet, title: 'Group Policies', desc: 'Customizable corporate travel insurance for teams of any size' },
      { icon: Zap, title: 'Instant Claims', desc: 'Digital claims processing with 48-hour settlement for most claims' },
      { icon: Globe, title: 'Global Coverage', desc: 'Worldwide protection valid in 190+ countries with 24/7 assistance' },
    ],
    highlights: [
      'Comprehensive medical coverage up to $500,000',
      'Trip cancellation and interruption protection',
      'Baggage loss and delay compensation',
      'Flight delay coverage with hotel and meal allowances',
      '24/7 emergency medical assistance hotline',
      'Corporate group policies with volume discounts',
    ],
    stats: [
      { value: '$500K', label: 'Max Coverage' },
      { value: '48 hrs', label: 'Claims Settlement' },
      { value: '190+', label: 'Countries' },
      { value: '4.9★', label: 'Customer Rating' },
    ],
  },
}

export default function CorporateTravelPage() {
  const { serviceSlug } = useParams()
  const category = CATEGORIES[serviceSlug] || CATEGORIES.management
  const Icon = category.icon

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-navy-900">
        <div className="absolute inset-0">
          <img src={category.heroImage} alt={category.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white z-10">
          <div className="container-wide">
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/mice" className="hover:text-white transition-colors">MICE</Link>
              <span>/</span>
              <span className="text-white font-medium">{category.breadcrumb}</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-sky-600 rounded-xl flex items-center justify-center">
                <Icon size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold drop-shadow-lg">{category.title}</h1>
              </div>
            </div>
            <p className="text-lg text-gray-200 max-w-2xl drop-shadow">{category.subtitle}</p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">About</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2 mb-6">{category.title}</h2>
              <p className="text-navy-500 text-lg leading-relaxed mb-8">{category.description}</p>
              <ul className="space-y-3">
                {category.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-sky-600 mt-0.5 flex-shrink-0" />
                    <span className="text-navy-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {category.features.map((f, i) => {
                const FIcon = f.icon
                return (
                  <div key={i} className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-6 border border-sky-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                      <FIcon size={22} className="text-sky-600" />
                    </div>
                    <h3 className="font-bold text-navy-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-navy-500">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-indigo-600">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {category.stats.map((s, i) => (
              <div key={i} className="text-center text-white">
                <p className="text-4xl md:text-5xl font-display font-bold mb-2">{s.value}</p>
                <p className="text-sky-100 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Simple 3-Step Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Share Your Requirements', desc: 'Tell us your travel needs — dates, destinations, budget, and any special requirements.' },
              { step: '02', title: 'Get Custom Proposals', desc: 'Our travel specialists curate options with the best rates, routes, and accommodations.' },
              { step: '03', title: 'Travel & Track', desc: 'Book instantly, travel with confidence, and track everything in real-time from your dashboard.' },
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="text-6xl font-display font-bold text-sky-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{item.title}</h3>
                <p className="text-navy-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-slate-800 to-indigo-900 text-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Transform Your {category.title}?</h2>
              <p className="text-gray-300 text-lg mb-8">Join 500+ companies that trust MAQLAIM TOURS for their corporate travel needs. Get a free consultation and custom proposal.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-sky-400" />
                  <span className="text-gray-200">No setup fees — pay only when you travel</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-sky-400" />
                  <span className="text-gray-200">Free 30-day trial for new corporate accounts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-sky-400" />
                  <span className="text-gray-200">Dedicated account manager from day one</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Request a Free Consultation</h3>
              <form onSubmit={e => { e.preventDefault(); alert('Thank you! Our team will contact you within 24 hours.') }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Company Name *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <input type="text" placeholder="Your Name *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="email" placeholder="Work Email *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <input type="tel" placeholder="Phone *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                </div>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600">
                  <option>Monthly Travel Volume</option>
                  <option>1-10 trips/month</option>
                  <option>10-50 trips/month</option>
                  <option>50-200 trips/month</option>
                  <option>200+ trips/month</option>
                </select>
                <textarea placeholder="Tell us about your travel needs..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" />
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Send size={18} /> Get Free Consultation
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section-padding bg-gray-50" id="contact">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-display font-bold text-navy-900 mb-4">Need Immediate Assistance?</h2>
          <p className="text-navy-500 mb-8">Our travel experts are available 24/7 to help with any questions</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm">
              <Phone size={20} className="text-sky-600" />
              <div className="text-left"><p className="text-xs text-navy-500">Call Us</p><p className="font-semibold text-navy-900">+91 98765 43210</p></div>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm">
              <Mail size={20} className="text-sky-600" />
              <div className="text-left"><p className="text-xs text-navy-500">Email Us</p><p className="font-semibold text-navy-900">corporate@travelvista.com</p></div>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm">
              <Headphones size={20} className="text-sky-600" />
              <div className="text-left"><p className="text-xs text-navy-500">24/7 Support</p><p className="font-semibold text-navy-900">+91 98765 43211</p></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
