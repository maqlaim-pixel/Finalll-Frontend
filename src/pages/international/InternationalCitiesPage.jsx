import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, MapPin, ChevronRight, Send, Compass, Globe } from 'lucide-react'

const ALL_CITIES = [
  { name: 'Dubai', country: 'United Arab Emirates', countrySlug: 'uae', slug: 'dubai', image: 'https://res.cloudinary.com/goqz2x1l/image/upload/v1792220243/Dubai-Style_Skyline_with_Turquoise_Waters.png', desc: 'City of Gold — futuristic skyline and desert adventures', tags: ['Luxury', 'Shopping', 'Adventure'], rating: 4.8 },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', countrySlug: 'uae', slug: 'abu-dhabi', image: 'https://res.cloudinary.com/goqz2x1l/image/upload/v1792220243/Abu_Dhabi.png', desc: 'Cultural capital with Sheikh Zayed Mosque and Louvre', tags: ['Culture', 'Luxury'], rating: 4.7 },
  { name: 'Bangkok', country: 'Thailand', countrySlug: 'thailand', slug: 'bangkok', image: 'https://res.cloudinary.com/goqz2x1l/image/upload/v1792220243/Bangkok.png', desc: 'Golden temples, floating markets and legendary street food', tags: ['Food', 'Culture', 'Nightlife'], rating: 4.7 },
  { name: 'Phuket', country: 'Thailand', countrySlug: 'thailand', slug: 'phuket', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&h=300&fit=crop', desc: 'Stunning beaches, island hopping and vibrant nightlife', tags: ['Beach', 'Party'], rating: 4.7 },
  { name: 'Chiang Mai', country: 'Thailand', countrySlug: 'thailand', slug: 'chiang-mai', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop', desc: 'Mountain city with temples, night bazaars and elephant parks', tags: ['Culture', 'Nature'], rating: 4.7 },
  { name: 'Singapore City', country: 'Singapore', countrySlug: 'singapore', slug: 'singapore-city', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop', desc: 'Gardens, hawker food and futuristic architecture', tags: ['City', 'Food', 'Family'], rating: 4.8 },
  { name: 'Kuala Lumpur', country: 'Malaysia', countrySlug: 'malaysia', slug: 'kuala-lumpur', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop', desc: 'Petronas Towers, Batu Caves and multi-cuisine food paradise', tags: ['City', 'Food', 'Shopping'], rating: 4.6 },
  { name: 'Langkawi', country: 'Malaysia', countrySlug: 'malaysia', slug: 'langkawi', image: 'https://images.unsplash.com/photo-1564542617114-c1e89df4649b?w=400&h=300&fit=crop', desc: 'Duty-free island with pristine beaches and Sky Bridge', tags: ['Beach', 'Nature'], rating: 4.6 },
  { name: 'Malé', country: 'Maldives', countrySlug: 'maldives', slug: 'male', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop', desc: 'Gateway to paradise — local markets, mosques and island life', tags: ['Beach', 'Island'], rating: 4.8 },
  { name: 'Bali (Denpasar)', country: 'Indonesia', countrySlug: 'indonesia', slug: 'bali', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop', desc: 'Island of Gods — temples, rice terraces and surf beaches', tags: ['Beach', 'Culture', 'Wellness'], rating: 4.8 },
  { name: 'Ho Chi Minh City', country: 'Vietnam', countrySlug: 'vietnam', slug: 'ho-chi-minh', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop', desc: 'Saigon — French colonial heritage and incredible street food', tags: ['Food', 'Culture', 'History'], rating: 4.7 },
  { name: 'Hanoi', country: 'Vietnam', countrySlug: 'vietnam', slug: 'hanoi', image: 'https://images.unsplash.com/photo-1557750255-c7607237c52e?w=400&h=300&fit=crop', desc: '1000-year old capital with Old Quarter and Hoan Kiem Lake', tags: ['Culture', 'Food', 'Heritage'], rating: 4.7 },
  { name: 'Tokyo', country: 'Japan', countrySlug: 'japan', slug: 'tokyo', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', desc: 'Where tradition meets future — temples, neon and sushi', tags: ['Culture', 'Food', 'Tech'], rating: 4.9 },
  { name: 'Kyoto', country: 'Japan', countrySlug: 'japan', slug: 'kyoto', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop', desc: 'Ancient capital with geishas, zen gardens and 2000 temples', tags: ['Culture', 'Heritage'], rating: 4.9 },
  { name: 'Seoul', country: 'South Korea', countrySlug: 'south-korea', slug: 'seoul', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=300&fit=crop', desc: 'K-culture hub — palaces, K-pop, Korean BBQ and shopping', tags: ['Culture', 'Food', 'Shopping'], rating: 4.7 },
  { name: 'Beijing', country: 'China', countrySlug: 'china', slug: 'beijing', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop', desc: 'Great Wall, Forbidden City and 3000 years of imperial history', tags: ['Heritage', 'Culture'], rating: 4.7 },
  { name: 'Colombo', country: 'Sri Lanka', countrySlug: 'sri-lanka', slug: 'colombo', image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop', desc: 'Pearl capital — colonial architecture, temples and beaches', tags: ['Heritage', 'Beach'], rating: 4.6 },
  { name: 'Kathmandu', country: 'Nepal', countrySlug: 'nepal', slug: 'kathmandu', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', desc: 'Gateway to Himalayas — temples, bazaars and spiritual energy', tags: ['Heritage', 'Spiritual', 'Adventure'], rating: 4.7 },
  { name: 'Zurich', country: 'Switzerland', countrySlug: 'switzerland', slug: 'zurich', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=300&fit=crop', desc: 'Financial hub with lake, Alps views and Swiss precision', tags: ['City', 'Mountain', 'Luxury'], rating: 4.8 },
  { name: 'Paris', country: 'France', countrySlug: 'europe', slug: 'paris', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop', desc: 'City of Lights — Eiffel Tower, Louvre and romantic charm', tags: ['Romance', 'Art', 'Food'], rating: 4.8 },
  { name: 'London', country: 'United Kingdom', countrySlug: 'europe', slug: 'london', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop', desc: 'Royal palaces, West End theatre and red double-decker buses', tags: ['Heritage', 'Culture', 'City'], rating: 4.7 },
  { name: 'Rome', country: 'Italy', countrySlug: 'europe', slug: 'rome', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop', desc: 'Eternal City — Colosseum, Vatican and Italian cuisine', tags: ['Heritage', 'Food', 'Art'], rating: 4.8 },
  { name: 'Barcelona', country: 'Spain', countrySlug: 'europe', slug: 'barcelona', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop', desc: 'Gaudí architecture, beaches and vibrant nightlife', tags: ['Beach', 'Culture', 'Nightlife'], rating: 4.7 },
  { name: 'Amsterdam', country: 'Netherlands', countrySlug: 'europe', slug: 'amsterdam', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop', desc: 'Canals, museums, tulips and cycling culture', tags: ['Culture', 'Art', 'Biking'], rating: 4.7 },
  { name: 'Sydney', country: 'Australia', countrySlug: 'australia', slug: 'sydney', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop', desc: 'Opera House, Harbour Bridge and Bondi Beach', tags: ['City', 'Beach', 'Landmark'], rating: 4.7 },
  { name: 'Melbourne', country: 'Australia', countrySlug: 'australia', slug: 'melbourne', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop', desc: 'Arts, coffee culture, street art and Great Ocean Road', tags: ['Food', 'Art', 'Culture'], rating: 4.7 },
  { name: 'Queenstown', country: 'New Zealand', countrySlug: 'new-zealand', slug: 'queenstown', image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=300&fit=crop', desc: 'Adventure capital with bungee, skiing and lake cruises', tags: ['Adventure', 'Mountain', 'Nature'], rating: 4.9 },
  { name: 'Auckland', country: 'New Zealand', countrySlug: 'new-zealand', slug: 'auckland', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=300&fit=crop', desc: 'City of Sails with Sky Tower, harbours and island escapes', tags: ['City', 'Beach'], rating: 4.7 },
  { name: 'New York City', country: 'United States of America', countrySlug: 'usa', slug: 'new-york', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=400&h=300&fit=crop', desc: 'Statue of Liberty, Broadway and Central Park', tags: ['City', 'Culture', 'Shopping'], rating: 4.7 },
  { name: 'Los Angeles', country: 'United States of America', countrySlug: 'usa', slug: 'los-angeles', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop', desc: 'Hollywood, beaches and celebrity sightings', tags: ['City', 'Beach', 'Entertainment'], rating: 4.6 },
]

const ALL_TAGS = [...new Set(ALL_CITIES.flatMap(c => c.tags))].sort()

export default function InternationalCitiesPage() {
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const filtered = ALL_CITIES.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
    const matchTags = selectedTags.length === 0 || selectedTags.some(t => c.tags.includes(t))
    return matchSearch && matchTags
  })

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative h-[350px] md:h-[450px] overflow-hidden bg-navy-900">
        <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&h=600&fit=crop" alt="International Cities" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="container-wide">
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight size={14} />
              <Link to="/international" className="hover:text-white">International</Link>
              <ChevronRight size={14} />
              <span className="text-white">All Cities</span>
            </div>
            <span className="text-4xl mb-3 block">🏙️</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 drop-shadow-lg">International Cities</h1>
            <p className="text-lg text-gray-200 max-w-2xl drop-shadow">Explore {ALL_CITIES.length} incredible cities across the globe — from ancient capitals to futuristic metropolises</p>
          </div>
        </div>
      </section>

      {/* ═══ CITIES GRID ═══ */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          {/* Search + Tags */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search cities or countries..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
              </div>
              <button onClick={() => { setSearch(''); setSelectedTags([]) }} className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-navy-600 hover:bg-gray-50 transition-colors">
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedTags.includes(tag) ? 'bg-sky-600 text-white' : 'bg-gray-100 text-navy-600 hover:bg-gray-200'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-navy-600 font-medium">
              <span className="text-navy-900 font-bold">{filtered.length}</span> Cit{filtered.length === 1 ? 'y' : 'ies'} Found
            </p>
          </div>

          {/* Cities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((city, i) => (
              <Link key={i} to={`/international/${city.countrySlug}/${city.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-white">{city.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-navy-900 group-hover:text-sky-600 transition-colors">{city.name}</h3>
                  <p className="text-xs text-navy-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {city.country}
                  </p>
                  <p className="text-xs text-navy-500 mt-2 line-clamp-2">{city.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {city.tags.map((tag, ti) => (
                      <span key={ti} className="bg-sky-50 text-sky-600 text-[10px] font-medium px-2 py-0.5 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Globe size={48} className="mx-auto text-navy-300 mb-4" />
              <h3 className="text-xl font-semibold text-navy-700">No cities found</h3>
              <p className="text-navy-500 mt-2">Try adjusting your search or filters</p>
              <button onClick={() => { setSearch(''); setSelectedTags([]) }} className="text-sky-600 hover:text-sky-700 text-sm font-medium mt-3">Clear All Filters</button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-gradient-to-r from-sky-600 to-indigo-700 py-16">
        <div className="container-wide text-center text-white">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Can't Find Your City?</h2>
          <p className="text-lg text-sky-100 max-w-2xl mx-auto mb-8">We cover {ALL_CITIES.length}+ cities worldwide. Contact us for custom itineraries to any destination.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="bg-white text-sky-700 hover:bg-sky-50 px-8 py-3.5 rounded-xl font-semibold transition-colors inline-flex items-center gap-2">
              <Send size={18} /> Enquire Now
            </Link>
            <Link to="/plan-trip" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-semibold transition-colors inline-flex items-center gap-2">
              <Compass size={18} /> Plan My Trip
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
