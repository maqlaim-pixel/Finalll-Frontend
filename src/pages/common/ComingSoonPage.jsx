import { Link, useLocation } from 'react-router-dom'
import { Backpack, Construction, Headset, Home, Luggage, Map, Mountain, Compass } from 'lucide-react'
import SEOHead from '../../components/common/SEOHead'
import { getKnownMenuRouteName } from '../../utils/menuRouteIndex'

const PAGE_NAMES = {
  '/packages/adventure/camping': 'Camping Packages',
  '/packages/adventure/wildlife': 'Wildlife Packages',
  '/packages/adventure/water': 'Water Adventure Packages',
  '/packages/adventure/mountain': 'Mountain Adventure Packages',
  '/packages/adventure/road-trip': 'Road Trip Packages',
  '/packages/adventure/winter': 'Winter Adventure Packages',
  '/packages/family/beach': 'Family Beach Holidays',
  '/packages/family/hill-station': 'Family Hill Station Holidays',
  '/packages/family/wildlife': 'Family Wildlife Holidays',
  '/packages/family/theme-park': 'Family Theme Park Holidays',
  '/packages/family/budget': 'Budget Family Holidays',
  '/holidays/family': 'Family Holidays',
  '/holidays/family/getaways': 'Family Getaways',
  '/holidays/family/beach': 'Family Beach Holidays',
  '/holidays/family/hill': 'Family Hill Holidays',
  '/holidays/family/theme-park': 'Family Theme Park Holidays',
  '/holidays/family/wildlife': 'Family Wildlife Holidays',
  '/holidays/family/road-trip': 'Family Road Trip Holidays',
  '/holidays/family/budget': 'Budget Family Holidays',
  '/holidays/adventure': 'Adventure Holidays',
  '/holidays/adventure/trekking': 'Trekking Holidays',
  '/holidays/adventure/camping': 'Camping Holidays',
  '/holidays/adventure/wildlife': 'Wildlife Adventures',
  '/holidays/adventure/water': 'Water Adventure Holidays',
  '/holidays/adventure/mountain': 'Mountain Adventure Holidays',
  '/holidays/adventure/desert': 'Desert Adventures',
  '/holidays/adventure/winter': 'Winter Adventures',
  '/holidays/beach': 'Beach Holidays',
  '/holidays/beach/getaways': 'Beach Getaways',
  '/holidays/beach/island': 'Island Holidays',
  '/holidays/beach/tropical': 'Tropical Beach Holidays',
  '/holidays/beach/luxury': 'Luxury Beach Holidays',
  '/holidays/beach/budget': 'Budget Beach Holidays',
  '/holidays/beach/water-sports': 'Water Sports Holidays',
  '/holidays/spiritual': 'Spiritual and Religious Holidays',
  '/holidays/spiritual/pilgrimage': 'Pilgrimage Tours',
  '/holidays/spiritual/temples': 'Temple Tours',
  '/holidays/spiritual/retreats': 'Spiritual Retreats',
  '/holidays/spiritual/meditation': 'Meditation Holidays',
  '/holidays/spiritual/yoga': 'Yoga Holidays',
  '/holidays/spiritual/festival': 'Festival Holidays',
  '/holidays/luxury': 'Luxury Holidays',
  '/holidays/budget': 'Budget Holidays',
  '/holidays/weekend': 'Weekend Holidays',
  '/holidays/group': 'Group Holidays',
  '/holidays/solo': 'Solo Holidays',
  '/holidays/festival': 'Festival Holidays',
  '/india/cities': 'Cities in India',
  '/india/places': 'Places to Visit in India',
  '/india/places/heritage': 'Heritage Sites in India',
  '/india/places/temples': 'Temples and Religious Places in India',
  '/india/places/beaches': 'Beaches in India',
  '/india/places/lakes': 'Lakes and Waterfalls in India',
  '/india/places/hill-stations': 'Hill Stations in India',
  '/india/places/museums': 'Museums in India',
  '/india/places/historical': 'Historical Places in India',
  '/india/destinations/attractions': 'Famous Attractions in India',
  '/international/places/landmarks': 'International Famous Landmarks',
  '/international/places/museums': 'International Museums and Galleries',
  '/international/places/theme-parks': 'International Theme Parks',
  '/international/places/beaches': 'International Beaches',
  '/international/places/national-parks': 'International National Parks',
  '/international/places/waterfalls': 'International Waterfalls',
  '/international/places/religious': 'International Religious Sites',
  '/international/places/shopping': 'International Shopping Places',
  '/international/things-to-do/adventure': 'International Adventure Activities',
  '/international/things-to-do/water-sports': 'International Water Sports',
  '/international/things-to-do/trekking': 'International Trekking and Hiking',
  '/international/things-to-do/wildlife': 'International Wildlife Safaris',
  '/international/things-to-do/cruises': 'Cruises and Sailing',
  '/international/things-to-do/desert': 'Desert Safaris',
  '/international/things-to-do/scuba': 'Scuba Diving',
  '/international/things-to-do/skydiving': 'Skydiving',
  '/international/things-to-do/camping': 'International Camping',
  '/international/things-to-do/culture': 'International Cultural Experiences',
  '/international/things-to-do/nightlife': 'International Nightlife',
  '/international/europe': 'Europe Destinations',
  '/international/europe/switzerland/zurich': 'Zurich',
  '/international/europe/france/paris': 'Paris',
  '/international/europe/uk/london': 'London',
  '/international/south-korea/seoul': 'Seoul',
  '/international/china/beijing': 'Beijing',
  '/international/nepal/kathmandu': 'Kathmandu',
  '/mice/meetings': 'MICE Meetings',
  '/mice/meetings/board': 'Board Meetings',
  '/mice/meetings/team': 'Team Meetings',
  '/mice/meetings/corporate': 'Corporate Meetings',
  '/mice/meetings/executive': 'Executive Meetings',
  '/mice/meetings/agm': 'Annual General Meetings',
  '/mice/meetings/launch': 'Product Launch Meetings',
  '/mice/meetings/strategy': 'Strategy Meetings',
  '/mice/incentives': 'MICE Incentives',
  '/mice/incentives/travel': 'Incentive Travel Programs',
  '/mice/incentives/rewards': 'Employee Rewards',
  '/mice/incentives/performance': 'Performance Rewards',
  '/mice/incentives/motivational': 'Motivational Trips',
  '/mice/incentives/corporate': 'Corporate Incentives',
  '/mice/incentives/recognition': 'Recognition Programs',
  '/mice/conferences': 'MICE Conferences',
  '/mice/conferences/industry': 'Industry Conferences',
  '/mice/conferences/business': 'Business Conferences',
  '/mice/conferences/academic': 'Academic Conferences',
  '/mice/conferences/medical': 'Medical Conferences',
  '/mice/conferences/tech': 'Technology Conferences',
  '/mice/conferences/international': 'International Conferences',
  '/mice/conferences/support': 'Conference Support Services',
  '/mice/exhibitions': 'Exhibitions and Events',
  '/mice/exhibitions/trade-shows': 'Trade Shows',
  '/mice/exhibitions/product': 'Product Exhibitions',
  '/mice/events/corporate': 'Corporate Events',
  '/mice/events/activations': 'Brand Activations',
  '/mice/events/gala': 'Gala Dinners',
  '/mice/events/awards': 'Award Ceremonies',
  '/destination-weddings/india/goa': 'Goa Weddings',
  '/destination-weddings/india/udaipur': 'Udaipur Weddings',
  '/destination-weddings/india/jaipur': 'Jaipur Weddings',
  '/destination-weddings/india/jodhpur': 'Jodhpur Weddings',
  '/destination-weddings/india/kerala': 'Kerala Weddings',
  '/destination-weddings/india/maharashtra': 'Maharashtra Weddings',
  '/destination-weddings/india/himachal': 'Himachal Weddings',
  '/destination-weddings/india/kashmir': 'Kashmir Weddings',
  '/destination-weddings/india/ayodhya': 'Ayodhya Weddings',
  '/destination-weddings/india/varanasi': 'Varanasi Weddings',
  '/destination-weddings/international/bali': 'Bali Weddings',
  '/destination-weddings/international/thailand': 'Thailand Weddings',
  '/destination-weddings/international/dubai': 'Dubai Weddings',
  '/destination-weddings/international/maldives': 'Maldives Weddings',
  '/destination-weddings/international/singapore': 'Singapore Weddings',
  '/destination-weddings/international/europe': 'Europe Weddings',
  '/destination-weddings/international/sri-lanka': 'Sri Lanka Weddings',
  '/destination-weddings/international/mauritius': 'Mauritius Weddings',
  '/destination-weddings/international/turkey': 'Turkey Weddings',
  '/destination-weddings/international/australia': 'Australia Weddings',
  '/destination-weddings/international/usa': 'USA Weddings',
  '/destination-weddings/venues': 'Wedding Venues',
  '/destination-weddings/venues/beach': 'Beachfront Wedding Venues',
  '/destination-weddings/venues/palace': 'Palace and Heritage Wedding Venues',
  '/destination-weddings/venues/resort': 'Luxury Resort Wedding Venues',
  '/destination-weddings/venues/garden': 'Garden and Outdoor Wedding Venues',
  '/destination-weddings/venues/island': 'Island Wedding Venues',
  '/destination-weddings/venues/fort': 'Royal Fort Wedding Venues',
  '/destination-weddings/venues/backwater': 'Backwater Wedding Venues',
  '/destination-weddings/venues/banquet': 'Banquet Hall Wedding Venues',
  '/destination-weddings/venues/vineyard': 'Vineyard Wedding Venues',
  '/destination-weddings/venues/mountain': 'Mountain Wedding Venues',
  '/destination-weddings/venues/yacht': 'Boat and Yacht Wedding Venues',
  '/destination-weddings/themes/royal': 'Royal Wedding Themes',
  '/destination-weddings/themes/beach': 'Beach Wedding Themes',
  '/destination-weddings/themes/traditional': 'Traditional Wedding Themes',
  '/destination-weddings/themes/modern': 'Modern Wedding Themes',
  '/destination-weddings/themes/bohemian': 'Bohemian Wedding Themes',
  '/destination-weddings/themes/vintage': 'Vintage Wedding Themes',
  '/destination-weddings/themes/minimalist': 'Minimalist Wedding Themes',
  '/destination-weddings/themes/luxury': 'Luxury Wedding Themes',
  '/destination-weddings/themes/cultural': 'Cultural Wedding Themes',
  '/destination-weddings/themes/fusion': 'Fusion Wedding Themes',
  '/destination-weddings/services': 'Wedding Services',
  '/destination-weddings/services/planning': 'Wedding Planning',
  '/destination-weddings/services/decor': 'Wedding Decor',
  '/destination-weddings/services/catering': 'Wedding Catering',
  '/destination-weddings/services/photography': 'Wedding Photography',
  '/destination-weddings/services/entertainment': 'Wedding Entertainment',
  '/destination-weddings/services/guest-management': 'Wedding Guest Management',
  '/destination-weddings/services/transportation': 'Wedding Transportation',
  '/destination-weddings/services/makeup': 'Wedding Makeup Services',
  '/destination-weddings/services/venue': 'Wedding Venue Services',
  '/destination-weddings/services/other': 'Other Wedding Services',
  '/weddings/rajasthan': 'Rajasthan Weddings',
  '/international/europe/packages': 'Europe Packages',
  '/international/bali/packages': 'Bali Packages',
  '/international/switzerland/packages': 'Switzerland Packages',
  '/local-travel/bus-tempo-traveller': 'Bus and Tempo Traveller',
  '/local-travel/custom-local-travel': 'Custom Local Travel',
  '/local-travel/custom': 'Custom Local Travel',
  '/travel-guide/itineraries': 'Travel Itineraries',
  '/guides/itineraries': 'Travel Itineraries',
  '/guides/packing': 'Packing Guides',
  '/guides/visa': 'Visa Information',
  '/guides': 'Travel Guides',
  '/international/places': 'International Places to Visit',
  '/international/things-to-do': 'International Things to Do',
  '/international/destinations/island': 'Island Destinations',
  '/international/destinations/family': 'Family Destinations',
  '/international/destinations/luxury': 'Luxury Destinations',
  '/international/destinations/honeymoon': 'Honeymoon Destinations',
  '/international/destinations/weekend': 'International Weekend Getaways',
  '/international/destinations/offbeat': 'International Offbeat Destinations',
  '/destination-weddings/themes/boho': 'Boho Wedding Themes',
  '/destination-weddings/themes/intimate': 'Intimate Wedding Themes',
  '/destination-weddings/themes/eco': 'Eco-friendly Wedding Themes',
  '/destination-weddings/themes/pre-wedding': 'Pre-wedding Shoots',
  '/destination-weddings/themes/mehendi': 'Mehendi Ideas',
  '/destination-weddings/themes/sangeet': 'Sangeet Ideas',
  '/destination-weddings/guides': 'Wedding Guides',
  '/destination-weddings/guides/planning': 'Wedding Planning Guide',
  '/destination-weddings/guides/best-time': 'Best Time to Wed',
  '/destination-weddings/guides/budget': 'Wedding Budget Planning',
  '/destination-weddings/guides/legal': 'Wedding Legal Requirements',
  '/destination-weddings/guides/guests': 'Wedding Guest Management',
  '/destination-weddings/guides/decor': 'Wedding Décor Guide',
  '/destination-weddings/guides/catering': 'Wedding Catering Tips',
  '/destination-weddings/guides/entertainment': 'Wedding Entertainment Ideas',
  '/destination-weddings/guides/honeymoon': 'Honeymoon Ideas',
  '/destination-weddings/guides/checklist': 'Wedding Checklist',
  '/destination-weddings/guides/real-weddings': 'Real Weddings',
  '/destination-weddings/guides/faqs': 'Wedding FAQs',
}

function formatPageName(pathname) {
  const knownName = PAGE_NAMES[pathname] || getKnownMenuRouteName(pathname)
  if (knownName) return knownName
  return pathname.split('/').filter(Boolean).pop()?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'TravelVista'
}

function TravelIllustration() {
  return <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/50 bg-[linear-gradient(155deg,#9dddfb_0%,#e8f9ff_42%,#bcecf7_43%,#48b7d7_67%,#167da7_100%)] shadow-[0_30px_80px_-36px_rgba(7,31,56,0.6)]" role="img" aria-label="A sunny travel landscape with blue water, green mountains and travel gear">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_48%_34%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_37%,rgba(255,255,255,0.12)_72%)]" />
    <div className="absolute bottom-[24%] left-[-8%] h-[47%] w-[61%] rounded-[50%] bg-[#287c67] [clip-path:polygon(0_100%,0_66%,18%_42%,27%_58%,44%_15%,56%_48%,72%_23%,100%_100%)]" />
    <div className="absolute bottom-[24%] right-[-8%] h-[48%] w-[61%] rounded-[50%] bg-[#398d67] [clip-path:polygon(0_100%,0_51%,20%_24%,37%_45%,57%_12%,72%_52%,100%_16%,100%_100%)]" />
    <div className="absolute inset-x-0 bottom-0 h-[43%] bg-[linear-gradient(180deg,#49c2dd,#087fa9)]" />
    <div className="absolute inset-x-0 bottom-[31%] h-[5%] bg-white/40 blur-xl" />
    <div className="absolute bottom-0 left-0 h-[33%] w-full bg-[linear-gradient(0deg,#245b41,transparent)]" />
    <div className="absolute left-[5%] top-[11%] h-14 w-14 rounded-full bg-[#ffd675] shadow-[0_0_60px_20px_rgba(255,224,155,0.5)]" />
    <div className="absolute left-[5%] top-[40%] h-[46%] w-[29%] -rotate-6 rounded-[2.5rem_2.5rem_1.2rem_1.2rem] border-[10px] border-[#55321f] bg-[#152d42] shadow-2xl sm:left-[8%] sm:w-[26%]">
      <div className="absolute left-[15%] top-[-10%] h-[26%] w-[70%] rounded-t-full border-[7px] border-[#172a3a] bg-[#a76c3b]" />
      <div className="absolute left-[15%] top-[36%] h-[31%] w-[70%] rounded-xl border-4 border-[#b37840] bg-[#294154]" />
      <div className="absolute left-1/2 top-[24%] h-[62%] w-2 -translate-x-1/2 bg-[#b37840]" />
    </div>
    <div className="absolute bottom-[16%] left-[8%] h-[10%] w-[27%] rotate-[-8deg] rounded-[100%_100%_12%_12%] border-4 border-[#795334] bg-[#e4bd78] shadow-lg" />
    <div className="absolute bottom-[13%] left-[15%] h-[11%] w-[16%] rounded-md border-[5px] border-[#1c2731] bg-[#31424d] shadow-xl"><span className="absolute left-1/2 top-1/2 h-[62%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-[#d3a75f] bg-[#101820]" /></div>
    <div className="absolute right-[5%] top-[20%] flex flex-col items-start gap-1.5 sm:right-[8%]">
      {['EXPLORE', 'DISCOVER', 'TRAVEL'].map((label, index) => <div key={label} className={`min-w-32 -rotate-2 border-2 border-[#684322] px-4 py-2 text-center font-display text-sm font-bold text-[#2d1d12] shadow-md sm:min-w-40 sm:text-base ${index === 1 ? 'translate-x-3 bg-[#ffb43f]' : index === 2 ? '-translate-x-1 bg-[#62bdd0]' : 'bg-[#e8c38c]'}`}>{label}</div>)}
    </div>
    <div className="absolute bottom-[7%] right-[27%] text-[#f5d68e] opacity-90"><Map size={54} strokeWidth={1.5} /><Compass size={30} className="absolute left-[37%] top-[34%]" /></div>
    <div className="absolute right-[14%] top-[8%] hidden rounded-full border border-white/70 bg-white/20 p-3 text-white backdrop-blur-sm sm:block"><Mountain size={26} /></div>
  </div>
}

export function ComingSoonPage({ pageName: suppliedPageName }) {
  const location = useLocation()
  const pageName = suppliedPageName || formatPageName(location.pathname)
  const heading = `${pageName} - Coming Soon | TravelVista`
  const description = 'This travel experience is currently being prepared. We’re working to bring you complete information, packages and travel details soon.'

  return <>
    <SEOHead title={heading} description={`${pageName} is being prepared. Explore available TravelVista packages or contact our team.`} />
    <section className="relative isolate flex min-h-[calc(100vh-9rem)] items-center overflow-hidden bg-[#eaf7ff] px-4 py-12 sm:px-8 lg:py-16" aria-labelledby="coming-soon-heading">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.92),rgba(223,244,255,0.62)_55%,rgba(255,255,255,0.12))]" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <div className="mx-auto mb-5 inline-flex -rotate-2 items-center gap-2 rounded-lg border-[5px] border-[#854214] bg-gradient-to-b from-[#ffb42f] to-[#f1840c] px-5 py-2.5 text-sm font-extrabold tracking-[0.16em] text-[#192639] shadow-[0_8px_0_#6f3917,0_14px_28px_rgba(18,43,67,0.24)] sm:text-base lg:mx-0"><Construction size={20} aria-hidden="true" />COMING SOON</div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-sky-800">{pageName}</p>
          <h1 id="coming-soon-heading" className="font-display text-4xl font-bold leading-[1.05] text-navy-950 sm:text-5xl md:text-6xl"><span className="block">We’re Working</span><span className="mt-1 block text-orange-600">on This Page</span></h1>
          <div className="mx-auto my-5 h-1 w-20 rounded-full bg-orange-500 lg:mx-0" />
          <p className="mx-auto max-w-xl text-base leading-relaxed text-navy-800 sm:text-lg lg:mx-0">{description}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
            <Link to="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-sky-900/30 bg-white px-5 py-3 font-semibold text-navy-900 shadow-sm transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"><Home size={19} aria-hidden="true" />Back to Home</Link>
            <Link to="/packages" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow-md transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"><Luggage size={19} aria-hidden="true" />Explore Available Packages</Link>
            <Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-sky-900/30 bg-white px-5 py-3 font-semibold text-navy-900 shadow-sm transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"><Headset size={19} aria-hidden="true" />Contact Us</Link>
          </div>
        </div>
        <div className="order-1 lg:order-2"><TravelIllustration /></div>
      </div>
    </section>
  </>
}

export function NotFoundPage() {
  return <>
    <SEOHead title="Page Not Found | TravelVista" description="The page you’re looking for doesn’t exist. Explore TravelVista destinations and packages." />
    <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-slate-50 px-4 py-16" aria-labelledby="not-found-heading">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="font-display text-7xl font-bold text-orange-500">404</p>
        <h1 id="not-found-heading" className="mt-2 font-display text-3xl font-bold text-navy-950">Page Not Found</h1>
        <p className="mt-3 text-navy-700">The page you’re looking for doesn’t exist.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-navy-900 px-5 py-3 font-semibold text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"><Home size={18} aria-hidden="true" />Back to Home</Link>
          <Link to="/packages" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-orange-500 px-5 py-3 font-semibold text-orange-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"><Backpack size={18} aria-hidden="true" />Explore Packages</Link>
        </div>
      </div>
    </section>
  </>
}

export function ComingSoonRoute() {
  return <ComingSoonPage />
}
