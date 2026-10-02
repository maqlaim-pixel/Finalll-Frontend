import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Building2, Users, Star, ArrowRight, CheckCircle, Phone, Mail, Send, ChevronLeft, ChevronRight, Globe, TreePalm, Mountain, Landmark, Compass, Briefcase, Target, TrendingUp } from 'lucide-react'
import api from '../../services/api'

const CATEGORIES = {
  destinations: {
    title: 'Top MICE Destinations',
    subtitle: 'Discover the best venues and locations for your next corporate event',
    description: 'India and beyond offer world-class MICE infrastructure with premium hotels, state-of-the-art conference centers, and exceptional hospitality. Choose from our curated list of top destinations that deliver seamless corporate event experiences.',
    heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=600&fit=crop',
    breadcrumb: 'Top MICE Destinations',
  },
  india: {
    title: 'India MICE Destinations',
    subtitle: 'World-class corporate event venues across India',
    description: 'India is home to some of the world\'s most versatile MICE destinations — from the tech hubs of Bangalore and Hyderabad to the royal venues of Jaipur and Udaipur. With modern infrastructure, competitive pricing, and rich cultural experiences, India is the preferred MICE destination for companies worldwide.',
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400&h=600&fit=crop',
    breadcrumb: 'India MICE Destinations',
  },
  international: {
    title: 'International MICE Destinations',
    subtitle: 'Premium global venues for conferences, incentives & exhibitions',
    description: 'Take your corporate events to the global stage. From the luxury resorts of Dubai and Bangkok to the convention capitals of Singapore and Kuala Lumpur, our international MICE destinations offer unparalleled infrastructure, connectivity, and world-class hospitality.',
    heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1400&h=600&fit=crop',
    breadcrumb: 'International MICE Destinations',
  },
  retreat: {
    title: 'Corporate Retreat Destinations',
    subtitle: 'Rejuvenate your team at inspiring retreat venues',
    description: 'Step away from the boardroom and into nature. Our corporate retreat destinations combine stunning natural settings with modern meeting facilities — perfect for strategic planning sessions, team building, and leadership retreats that truly inspire.',
    heroImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&h=600&fit=crop',
    breadcrumb: 'Corporate Retreat Destinations',
  },
  offsite: {
    title: 'Offsite Destinations',
    subtitle: 'Productive team offsites at handpicked locations',
    description: 'Transform your team offsites from ordinary to extraordinary. Our offsite destinations are carefully selected for their blend of meeting facilities, team activities, and inspiring environments that foster creativity, collaboration, and meaningful connections.',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop',
    breadcrumb: 'Offsite Destinations',
  },
  emerging: {
    title: 'Emerging MICE Destinations',
    subtitle: 'Discover upcoming MICE hotspots before they mainstream',
    description: 'Stay ahead of the curve with our emerging MICE destinations — upcoming locations that offer exceptional value, modern infrastructure, and unique experiences. Be among the first to explore these rising stars of corporate travel.',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&h=600&fit=crop',
    breadcrumb: 'Emerging MICE Destinations',
  },
}

const DESTINATION_DATA = {
  destinations: [
    { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop', venues: '200+', rating: 4.9, desc: 'World-class convention centers, luxury hotels, and iconic settings for premium corporate events.', tags: ['Exhibition', 'Conference', 'Incentive'] },
    { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', venues: '150+', rating: 4.8, desc: 'Asia\'s MICE capital with Marina Bay Sands, Sentosa, and seamless logistics.', tags: ['Conference', 'Exhibition', 'Summit'] },
    { name: 'Bangkok, Thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', venues: '180+', rating: 4.7, desc: 'Affordable luxury with world-class venues, vibrant nightlife, and Thai hospitality.', tags: ['Incentive', 'Team Building', 'Conference'] },
    { name: 'Jaipur, India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop', venues: '120+', rating: 4.8, desc: 'Royal heritage venues with modern conference facilities and cultural experiences.', tags: ['Incentive', 'Retreat', 'Conference'] },
    { name: 'Goa, India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop', venues: '80+', rating: 4.6, desc: 'Beach resorts and wellness centers perfect for team offsites and incentive tours.', tags: ['Retreat', 'Team Building', 'Incentive'] },
    { name: 'Mumbai, India', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', venues: '250+', rating: 4.7, desc: 'India\'s financial hub with premium hotels, convention centers, and connectivity.', tags: ['Conference', 'Exhibition', 'Corporate'] },
  ],
  india: [
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', venues: '250+', rating: 4.7, desc: 'India\'s business capital with JIO Convention Center, Taj Lands End, and seamless connectivity.', tags: ['Conference', 'Exhibition', 'Corporate'] },
    { name: 'Delhi NCR', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop', venues: '300+', rating: 4.7, desc: 'India Gate, Pragati Maidan, and hundreds of premium venues for large-scale events.', tags: ['Exhibition', 'Summit', 'Conference'] },
    { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop', venues: '200+', rating: 4.8, desc: 'India\'s Silicon Valley with tech-savvy venues and perfect weather year-round.', tags: ['Conference', 'Tech Summit', 'Corporate'] },
    { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1572435555646-7ad8c766a4f4?w=600&h=400&fit=crop', venues: '150+', rating: 4.7, desc: 'HITEC City, HITEX Convention Center, and growing MICE infrastructure.', tags: ['Conference', 'Exhibition', 'Incentive'] },
    { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop', venues: '120+', rating: 4.8, desc: 'Royal palaces as venues — Rambagh Palace, Samode Haveli, and cultural immersion.', tags: ['Incentive', 'Retreat', 'Royal'] },
    { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop', venues: '80+', rating: 4.6, desc: 'Beach resorts — The Leela, Taj Exotica, W Goa — for relaxed corporate retreats.', tags: ['Retreat', 'Team Building', 'Incentive'] },
  ],
  international: [
    { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop', venues: '200+', rating: 4.9, desc: 'Dubai World Trade Centre, Atlantis The Palm, and year-round sunshine.', tags: ['Exhibition', 'Conference', 'Incentive'] },
    { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', venues: '150+', rating: 4.8, desc: 'Marina Bay Sands Expo, Sentosa, and Changi Airport connectivity.', tags: ['Conference', 'Exhibition', 'Summit'] },
    { name: 'Bangkok, Thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', venues: '180+', rating: 4.7, desc: 'BITEC, Impact Arena, and affordable luxury with world-class dining.', tags: ['Incentive', 'Team Building', 'Conference'] },
    { name: 'Kuala Lumpur, Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop', venues: '130+', rating: 4.6, desc: 'KLCC Convention Centre, Petronas Towers setting, and value-for-money venues.', tags: ['Conference', 'Exhibition', 'Corporate'] },
    { name: 'Sri Lanka', image: 'https://images.unsplash.com/photo-1586523928520-f40a1cec6dfe?w=600&h=400&fit=crop', venues: '70+', rating: 4.5, desc: 'Colombo\'s Shangri-La, Cinnamon hotels, and emerging MICE hub.', tags: ['Retreat', 'Incentive', 'Conference'] },
    { name: 'Vietnam', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop', venues: '90+', rating: 4.6, desc: 'Da Nang, Ho Chi Minh City — growing MICE infrastructure with stunning scenery.', tags: ['Incentive', 'Retreat', 'Team Building'] },
  ],
  retreat: [
    { name: 'Lonavala, Maharashtra', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', venues: '40+', rating: 4.7, desc: 'Misty hill stations with luxury resorts — Della Resorts, Hilton Shillim — for focused strategy retreats.', tags: ['Strategy', 'Leadership', 'Team Bonding'] },
    { name: 'Rishikesh, Uttarakhand', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&h=400&fit=crop', venues: '25+', rating: 4.8, desc: 'Riverside resorts and adventure activities for transformative team experiences.', tags: ['Adventure', 'Wellness', 'Team Building'] },
    { name: 'Coorg, Karnataka', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', venues: '30+', rating: 4.6, desc: 'Coffee plantation retreats — Tamara, Evolve Back — for immersive team experiences.', tags: ['Nature', 'Luxury', 'Wellness'] },
    { name: 'Udaipur, Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop', venues: '50+', rating: 4.9, desc: 'Lake Palace, Oberoi Udaivilas — royal retreat venues for premium corporate groups.', tags: ['Luxury', 'Incentive', 'Royal'] },
    { name: 'Munnar, Kerala', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', venues: '20+', rating: 4.7, desc: 'Tea estate resorts with plantation meetings and team treks.', tags: ['Nature', 'Wellness', 'Adventure'] },
    { name: 'Alibaug, Maharashtra', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop', venues: '35+', rating: 4.5, desc: 'Beach resorts near Mumbai — perfect for quick weekend corporate retreats.', tags: ['Beach', 'Weekend', 'Team Building'] },
  ],
  offsite: [
    { name: 'Manali, Himachal Pradesh', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', venues: '30+', rating: 4.7, desc: 'Mountain resorts with adventure activities — skiing, paragliding, trekking for team building.', tags: ['Adventure', 'Mountain', 'Team Building'] },
    { name: 'Jim Corbett, Uttarakhand', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop', venues: '25+', rating: 4.8, desc: 'Wildlife resorts with safari experiences and outdoor meeting spaces.', tags: ['Wildlife', 'Nature', 'Adventure'] },
    { name: 'Pondicherry', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop', venues: '20+', rating: 4.6, desc: 'French Quarter charm with Auroville wellness centers and beachside venues.', tags: ['Beach', 'Wellness', 'Creative'] },
    { name: 'Kasol, Himachal Pradesh', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', venues: '15+', rating: 4.5, desc: 'Offbeat mountain escapes for intimate team offsites and brainstorming sessions.', tags: ['Offbeat', 'Nature', 'Creative'] },
    { name: 'Wayanad, Kerala', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', venues: '18+', rating: 4.6, desc: 'Jungle resorts with plantation meetings and adventure sports.', tags: ['Jungle', 'Adventure', 'Nature'] },
    { name: 'Shimla, Himachal Pradesh', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', venues: '35+', rating: 4.7, desc: 'Heritage hotels and mountain views for productive offsite sessions.', tags: ['Heritage', 'Mountain', 'Strategy'] },
  ],
  emerging: [
    { name: 'Ahmedabad, Gujarat', image: 'https://images.unsplash.com/photo-1590050752117-29885e590d8e?w=600&h=400&fit=crop', venues: '60+', rating: 4.5, desc: 'GIFT City, Mahatma Mandir Convention Centre — India\'s emerging MICE hub.', tags: ['Conference', 'Exhibition', 'Value'] },
    { name: 'Indore, Madhya Pradesh', image: 'https://images.unsplash.com/photo-1572435555646-7ad8c766a4f4?w=600&h=400&fit=crop', venues: '35+', rating: 4.4, desc: 'Cleanest city with growing convention infrastructure and central India connectivity.', tags: ['Conference', 'Corporate', 'Value'] },
    { name: 'Da Nang, Vietnam', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop', venues: '45+', rating: 4.6, desc: 'Sun World, beachfront resorts — Southeast Asia\'s rising MICE star.', tags: ['Beach', 'Incentive', 'Conference'] },
    { name: 'Colombo, Sri Lanka', image: 'https://images.unsplash.com/photo-1586523928520-f40a1cec6dfe?w=600&h=400&fit=crop', venues: '50+', rating: 4.5, desc: 'Shangri-La, Cinnamon — growing infrastructure with island hospitality.', tags: ['Conference', 'Incentive', 'Island'] },
    { name: 'Tbilisi, Georgia', image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&h=400&fit=crop', venues: '30+', rating: 4.5, desc: 'Emerging European MICE destination with affordability and unique venues.', tags: ['Offbeat', 'Conference', 'Value'] },
    { name: 'Dhaka, Bangladesh', image: 'https://images.unsplash.com/photo-1572435555646-7ad8c766a4f4?w=600&h=400&fit=crop', venues: '40+', rating: 4.3, desc: 'South Asia\'s growing business hub with new convention centers.', tags: ['Conference', 'Corporate', 'Emerging'] },
  ],
}

const FEATURES = {
  destinations: [
    { icon: Building2, title: 'Premium Venues', desc: '500+ verified conference and event venues' },
    { icon: Globe, title: 'Global Connectivity', desc: 'Major airports with international connectivity' },
    { icon: Users, title: 'Group Capacity', desc: 'Venues for 10 to 10,000+ attendees' },
    { icon: Target, title: 'End-to-End', desc: 'Complete MICE management from planning to execution' },
  ],
  india: [
    { icon: Landmark, title: 'Heritage Venues', desc: 'Palaces, havelis, and forts as event spaces' },
    { icon: Building2, title: 'Modern Infrastructure', desc: 'World-class convention centers and tech parks' },
    { icon: TreePalm, title: 'Diverse Settings', desc: 'Mountains, beaches, deserts, and cities' },
    { icon: TrendingUp, title: 'Best Value', desc: 'Premium experiences at competitive pricing' },
  ],
  international: [
    { icon: Globe, title: 'Global Standards', desc: 'World-renowned convention facilities' },
    { icon: Briefcase, title: 'Business Hubs', desc: 'Connectivity to global business centers' },
    { icon: Star, title: 'Luxury Hotels', desc: '5-star properties with MICE expertise' },
    { icon: Compass, title: 'Cultural Experiences', desc: 'Unique local experiences for incentive tours' },
  ],
  retreat: [
    { icon: Mountain, title: 'Natural Settings', desc: 'Mountains, forests, and riverside locations' },
    { icon: Star, title: 'Luxury Resorts', desc: 'Premium properties with meeting facilities' },
    { icon: Users, title: 'Team Activities', desc: 'Adventure sports, wellness, and bonding activities' },
    { icon: Target, title: 'Focused Sessions', desc: 'Distraction-free environments for strategy' },
  ],
  offsite: [
    { icon: Compass, title: 'Offbeat Locations', desc: 'Unique settings away from city distractions' },
    { icon: Users, title: 'Team Bonding', desc: 'Activities designed for team collaboration' },
    { icon: Mountain, title: 'Adventure Options', desc: 'Trekking, camping, rafting, and more' },
    { icon: Briefcase, title: 'Meeting Spaces', desc: 'Functional spaces for productive sessions' },
  ],
  emerging: [
    { icon: TrendingUp, title: 'Growth Potential', desc: 'Rapidly developing MICE infrastructure' },
    { icon: Building2, title: 'New Venues', desc: 'Recently built convention centers and hotels' },
    { icon: Star, title: 'Great Value', desc: 'Premium experiences at emerging market prices' },
    { icon: Globe, title: 'Strategic Locations', desc: 'Growing connectivity and business hubs' },
  ],
}

export default function MICEDestinationPage() {
  const { destSlug } = useParams()
  const [currentSlide, setCurrentSlide] = useState(0)
  const timerRef = useRef(null)

  const category = CATEGORIES[destSlug] || CATEGORIES.destinations
  const destinations = DESTINATION_DATA[destSlug] || DESTINATION_DATA.destinations
  const features = FEATURES[destSlug] || FEATURES.destinations

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % destinations.length), 4000)
    return () => clearInterval(timerRef.current)
  }, [destinations.length])

  const goToSlide = (i) => {
    setCurrentSlide(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrentSlide(s => (s + 1) % destinations.length), 4000)
  }

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
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/mice" className="hover:text-white transition-colors">MICE</Link>
              <span>/</span>
              <Link to="/mice/destinations" className="hover:text-white transition-colors">Destinations</Link>
              <span>/</span>
              <span className="text-white font-medium">{category.breadcrumb}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 drop-shadow-lg">{category.title}</h1>
            <p className="text-lg text-gray-200 max-w-2xl drop-shadow">{category.subtitle}</p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Get a Quote <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">About</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2 mb-6">{category.title}</h2>
            <p className="text-navy-500 text-lg leading-relaxed">{category.description}</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-sky-600" />
                  </div>
                  <h3 className="font-bold text-navy-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-navy-500">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DESTINATIONS CAROUSEL */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Destinations</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2">Featured {category.title}</h2>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}>
              {destinations.map((dest, i) => (
                <div key={i} className="w-full md:w-1/3 flex-shrink-0 px-3">
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {dest.tags.slice(0, 2).map((tag, j) => (
                          <span key={j} className="bg-white/90 backdrop-blur-sm text-navy-700 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-navy-900">{dest.rating}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-navy-900 group-hover:text-sky-600 transition-colors">{dest.name}</h3>
                        <span className="text-xs text-sky-600 font-medium">{dest.venues} venues</span>
                      </div>
                      <p className="text-sm text-navy-500 mb-3 line-clamp-2">{dest.desc}</p>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-navy-400" />
                        <span className="text-xs text-navy-400">{dest.tags.join(' · ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <button onClick={() => goToSlide((currentSlide - 1 + destinations.length) % destinations.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10">
              <ChevronLeft size={20} className="text-navy-600" />
            </button>
            <button onClick={() => goToSlide((currentSlide + 1) % destinations.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10">
              <ChevronRight size={20} className="text-navy-600" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {destinations.map((_, i) => (
              <button key={i} onClick={() => goToSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? 'bg-sky-600' : 'bg-gray-300 hover:bg-gray-400'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-padding bg-gradient-to-br from-slate-800 to-indigo-900 text-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-indigo-300 font-semibold text-sm uppercase tracking-wider">Why MAQLAIM TOURS</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Why Choose Us for MICE?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📋', title: 'End-to-End Management', desc: 'We handle everything — venues, logistics, branding, AV, and on-ground execution' },
              { icon: '🏨', title: 'Premium Venues', desc: 'Access to 500+ verified conference and event venues across India' },
              { icon: '👥', title: 'Group Travel', desc: 'Seamless group transportation, accommodation, and coordination for 10 to 10,000+' },
              { icon: '📊', title: 'Budget Optimization', desc: 'Maximize your event ROI with transparent pricing and smart cost management' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section-padding bg-gray-50" id="contact">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-sky-600 font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-navy-900 mt-2 mb-6">Plan Your Corporate Event</h2>
              <p className="text-navy-500 mb-8">Tell us about your corporate event and our MICE specialists will create a custom proposal with venue options, logistics, and pricing.</p>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="bg-sky-100 p-3 rounded-xl"><Phone size={20} className="text-sky-600" /></div>
                  <div><p className="text-sm text-navy-500">Call Us</p><p className="font-semibold text-navy-900">+91 93137 10465</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-sky-100 p-3 rounded-xl"><Mail size={20} className="text-sky-600" /></div>
                  <div><p className="text-sm text-navy-500">Email Us</p><p className="font-semibold text-navy-900">mice@travelvista.com</p></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Request a Quote</h3>
              <form onSubmit={e => { e.preventDefault(); alert('Thank you! Our MICE team will contact you.') }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Company Name *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <input type="text" placeholder="Contact Person *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="email" placeholder="Email *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                  <input type="tel" placeholder="Phone *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600">
                    <option>Event Type</option>
                    <option>Meeting</option>
                    <option>Conference</option>
                    <option>Exhibition</option>
                    <option>Incentive Tour</option>
                    <option>Team Building</option>
                  </select>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none text-navy-600">
                    <option>Number of Attendees</option>
                    <option>10-25</option>
                    <option>25-50</option>
                    <option>50-100</option>
                    <option>100-500</option>
                    <option>500+</option>
                  </select>
                </div>
                <textarea placeholder="Event Requirements / Budget Range" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" />
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Send size={18} /> Request Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
