import { Link, useParams } from 'react-router-dom'
import { Building2, Truck, Monitor, UtensilsCrossed, CalendarDays, BedDouble, Palette, MapPin, Phone, Mail, Send, ArrowRight, CheckCircle, Star, Clock, Shield, Users, Globe, Mic, Wifi, Coffee, Camera, Music, Sparkles, Layers, ChefHat, PartyPopper, Heart, Hotel, CreditCard } from 'lucide-react'

const CATEGORIES = {
  planning: {
    title: 'Event Planning',
    subtitle: 'Comprehensive event planning from concept to execution',
    description: 'Our expert event planners transform your vision into reality. From initial concept development and venue selection to day-of coordination and post-event analysis — we manage every detail so you can focus on your attendees and objectives.',
    heroImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&h=600&fit=crop',
    breadcrumb: 'Event Planning',
    icon: CalendarDays,
    features: [
      { icon: CalendarDays, title: 'Full Planning', desc: 'End-to-end event planning from concept to post-event analysis' },
      { icon: Users, title: 'Expert Team', desc: 'Dedicated planners with 10+ years of corporate event experience' },
      { icon: Clock, title: 'Timely Execution', desc: 'Meticulous timelines and milestone tracking for flawless delivery' },
      { icon: Star, title: 'Custom Design', desc: 'Tailored event concepts aligned with your brand and objectives' },
    ],
    highlights: [
      'Initial consultation and requirement analysis',
      'Venue scouting, shortlisting, and negotiation',
      'Vendor coordination — catering, AV, decor, transport',
      'Detailed event timeline and run-of-show management',
      'On-site event management and troubleshooting',
      'Post-event feedback collection and ROI analysis',
    ],
    stats: [
      { value: '2K+', label: 'Events Planned' },
      { value: '99%', label: 'On-Time Delivery' },
      { value: '4.9★', label: 'Client Rating' },
      { value: '50+', label: 'Event Specialists' },
    ],
  },
  logistics: {
    title: 'Logistics Management',
    subtitle: 'Seamless coordination of all event logistics',
    description: 'Complex events require precise logistics. Our logistics management team handles transportation, accommodation coordination, equipment setup, signage, crowd management, and every operational detail — ensuring your event runs like clockwork.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&h=600&fit=crop',
    breadcrumb: 'Logistics Management',
    icon: Truck,
    features: [
      { icon: Truck, title: 'Transport Coordination', desc: 'Airport transfers, shuttle services, and local transport management' },
      { icon: Building2, title: 'Venue Operations', desc: 'Setup, teardown, equipment handling, and venue compliance' },
      { icon: Users, title: 'Crowd Management', desc: 'Registration, flow management, and on-ground coordination' },
      { icon: Shield, title: 'Risk Management', desc: 'Contingency planning, safety protocols, and emergency response' },
    ],
    highlights: [
      'Pre-event logistics planning and site visits',
      'Transport fleet management — buses, sedans, luxury coaches',
      'Equipment and material transport coordination',
      'Signage, wayfinding, and branding installation',
      'Registration desk setup and attendee flow management',
      'Security coordination and emergency response planning',
    ],
    stats: [
      { value: '5K+', label: 'Events Managed' },
      { value: '200+', label: 'Fleet Vehicles' },
      { value: '98%', label: 'Zero-Delay Rate' },
      { value: '24/7', label: 'Ops Support' },
    ],
  },
  av: {
    title: 'Audio Visual Support',
    subtitle: 'Professional AV solutions for impactful events',
    description: 'From crystal-clear sound systems to stunning LED displays, our AV team delivers production-quality technical support for events of any scale. We provide end-to-end AV planning, setup, operation, and breakdown for conferences, exhibitions, and corporate events.',
    heroImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1400&h=600&fit=crop',
    breadcrumb: 'Audio Visual Support',
    icon: Monitor,
    features: [
      { icon: Monitor, title: 'LED Displays', desc: 'LED walls, projection mapping, and digital signage solutions' },
      { icon: Mic, title: 'Sound Systems', desc: 'Professional PA systems, wireless mics, and acoustic design' },
      { icon: Camera, title: 'Live Streaming', desc: 'Multi-camera setups, live streaming, and virtual event support' },
      { icon: Wifi, title: 'Tech Support', desc: 'On-site AV engineers and real-time technical troubleshooting' },
    ],
    highlights: [
      'Pre-event AV assessment and technical planning',
      'Sound system design and installation for any venue size',
      'LED walls, projection screens, and display solutions',
      'Lighting design — stage, ambient, and effect lighting',
      'Live streaming and hybrid event production',
      'On-site AV technicians for real-time support',
    ],
    stats: [
      { value: '1K+', label: 'Events Supported' },
      { value: '500+', label: 'AV Equipment' },
      { value: '99.9%', label: 'Uptime Rate' },
      { value: '<5 min', label: 'Issue Response' },
    ],
  },
  catering: {
    title: 'Catering Services',
    subtitle: 'Premium culinary experiences for your events',
    description: 'Exceptional food elevates every event. Our catering partners deliver diverse cuisines, dietary accommodations, and flawless service — from formal sit-down dinners and buffet spreads to coffee breaks and cocktail receptions.',
    heroImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1400&h=600&fit=crop',
    breadcrumb: 'Catering Services',
    icon: UtensilsCrossed,
    features: [
      { icon: ChefHat, title: 'Multi-Cuisine', desc: 'Indian, Continental, Asian, Mediterranean — curated menus for every palate' },
      { icon: Coffee, title: 'Beverage Service', desc: 'Coffee bars, cocktail stations, juice bars, and premium beverage packages' },
      { icon: Users, title: 'Dietary Options', desc: 'Vegan, Jain, Halal, gluten-free — accommodating all dietary requirements' },
      { icon: Star, title: 'Premium Service', desc: 'Trained waitstaff, elegant presentation, and Michelin-quality plating' },
    ],
    highlights: [
      'Custom menu design with chef consultations',
      'Live cooking stations and interactive food counters',
      'Dietary accommodation — vegan, Jain, Halal, gluten-free',
      'Coffee breaks, high teas, and snack stations',
      'Cocktail receptions and formal sit-down dinners',
      'Elegant table settings, centerpieces, and presentation',
    ],
    stats: [
      { value: '3K+', label: 'Events Catered' },
      { value: '50+', label: 'Cuisine Types' },
      { value: '99%', label: 'Satisfaction Rate' },
      { value: '100+', label: 'Chef Partners' },
    ],
  },
  accommodation: {
    title: 'Accommodation',
    subtitle: 'Premium hotel blocks and group accommodation',
    description: 'Secure the best hotels at the best rates for your event attendees. Our accommodation service handles room block reservations, rate negotiations, group check-ins, and special requests — ensuring every guest has a comfortable stay.',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=600&fit=crop',
    breadcrumb: 'Accommodation',
    icon: BedDouble,
    features: [
      { icon: Hotel, title: 'Hotel Network', desc: '10,000+ partner hotels from budget to luxury across India and abroad' },
      { icon: CreditCard, title: 'Group Rates', desc: 'Negotiated block rates 20-40% below public pricing' },
      { icon: CalendarDays, title: 'Flexible Booking', desc: 'Easy modifications, guaranteed late check-out, and VIP arrangements' },
      { icon: Users, title: 'Group Check-in', desc: 'Dedicated group registration desks and welcome amenities' },
    ],
    highlights: [
      'Hotel block reservations at negotiated corporate rates',
      'Rate comparison across multiple properties',
      'Group check-in and check-out coordination',
      'Welcome kits, amenities, and VIP room setups',
      'Room upgrade management and special requests',
      'Centralized billing and invoice consolidation',
    ],
    stats: [
      { value: '10K+', label: 'Partner Hotels' },
      { value: '20-40%', label: 'Group Savings' },
      { value: '98%', label: 'Occupancy Rate' },
      { value: '4.8★', label: 'Guest Rating' },
    ],
  },
  venues: {
    title: 'Venues Selection',
    subtitle: 'Perfect venues matched to your event requirements',
    description: 'Finding the right venue is critical to event success. Our venue selection service provides access to 5,000+ verified venues — from grand convention centers and luxury hotel ballrooms to intimate boardrooms and unique outdoor spaces. We match venues to your exact requirements.',
    heroImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&h=600&fit=crop',
    breadcrumb: 'Venues Selection',
    icon: Building2,
    features: [
      { icon: Building2, title: '5,000+ Venues', desc: 'Convention centers, hotels, resorts, farmhouses, and unique spaces' },
      { icon: MapPin, title: 'Location Match', desc: 'Venue recommendations based on attendee demographics and logistics' },
      { icon: Star, title: 'Verified Spaces', desc: 'All venues personally inspected and rated on quality parameters' },
      { icon: CreditCard, title: 'Best Rates', desc: 'Direct negotiations with venues for corporate pricing advantages' },
    ],
    highlights: [
      'Detailed venue brief and requirements analysis',
      'Shortlisted venue options with comparison reports',
      'Site visits and virtual venue walkthroughs',
      'Contract negotiation and terms finalization',
      'Layout planning and capacity optimization',
      'Backup venue identification for risk mitigation',
    ],
    stats: [
      { value: '5K+', label: 'Verified Venues' },
      { value: '200+', label: 'Cities' },
      { value: '95%', label: 'First-Choice Match' },
      { value: '30%', label: 'Cost Savings' },
    ],
  },
  decor: {
    title: 'Theme & Decor',
    subtitle: 'Stunning event decor that brings your vision to life',
    description: 'Transform any venue into a branded experience. Our theme and decor team creates immersive environments — from corporate branding and stage design to floral arrangements and lighting — that leave lasting impressions on every attendee.',
    heroImage: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1400&h=600&fit=crop',
    breadcrumb: 'Theme & Decor',
    icon: Palette,
    features: [
      { icon: Palette, title: 'Custom Themes', desc: 'Unique event themes designed around your brand and objectives' },
      { icon: Sparkles, title: 'Stage Design', desc: 'Premium stage setups, backdrops, and branded environments' },
      { icon: Heart, title: 'Floral Design', desc: 'Fresh flower arrangements, centerpieces, and entry installations' },
      { icon: PartyPopper, title: 'Full Styling', desc: 'End-to-end decor — props, furniture, linens, and ambient styling' },
    ],
    highlights: [
      'Custom theme development and mood boards',
      'Stage design with branded backdrops and LED elements',
      'Floral arrangements and table centerpieces',
      'Ambient lighting — chandeliers, fairy lights, spotlights',
      'Furniture rental — elegant seating, lounge areas, podiums',
      'Photo booth setups with props and instant prints',
    ],
    stats: [
      { value: '1.5K+', label: 'Events Decorated' },
      { value: '200+', label: 'Theme Templates' },
      { value: '100%', label: 'Brand Aligned' },
      { value: '4.9★', label: 'Client Rating' },
    ],
  },
}

export default function MICESupportPage() {
  const { serviceSlug } = useParams()
  const category = CATEGORIES[serviceSlug] || CATEGORIES.planning
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
              <h1 className="text-4xl md:text-5xl font-display font-bold drop-shadow-lg">{category.title}</h1>
            </div>
            <p className="text-lg text-gray-200 max-w-2xl drop-shadow">{category.subtitle}</p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Get a Quote <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT + FEATURES */}
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

      {/* ALL SERVICES GRID */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Our Support Services</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Complete MICE Support</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Object.entries(CATEGORIES).map(([slug, cat]) => {
              const SIcon = cat.icon
              const isActive = serviceSlug === slug
              return (
                <Link key={slug} to={`/mice/support/${slug}`}
                  className={`p-5 rounded-2xl text-center transition-all duration-300 border ${
                    isActive
                      ? 'bg-sky-600 text-white border-sky-600 shadow-lg'
                      : 'bg-white border-gray-100 hover:border-sky-300 hover:shadow-md'
                  }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                    isActive ? 'bg-white/20' : 'bg-sky-100'
                  }`}>
                    <SIcon size={22} className={isActive ? 'text-white' : 'text-sky-600'} />
                  </div>
                  <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-navy-900'}`}>{cat.title}</h3>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-slate-800 to-indigo-900 text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Need {category.title} for Your Event?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">Our MICE support team is ready to deliver exceptional {category.title.toLowerCase()} for your next corporate event.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-colors">
              <Send size={18} /> Request Quote
            </Link>
            <a href="tel:+919313710465" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-colors">
              <Phone size={18} /> +91 93137 10465
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
