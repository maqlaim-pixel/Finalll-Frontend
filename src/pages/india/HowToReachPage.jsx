import { useEffect } from 'react'
import {
  BedDouble,
  CalendarDays,
  Car,
  Clock3,
  FileText,
  Fuel,
  HelpCircle,
  Image as ImageIcon,
  Landmark,
  Lightbulb,
  MapPin,
  Mountain,
  PawPrint,
  Plane,
  Sun,
  TrainFront,
} from 'lucide-react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'

export const GIR_DESTINATION = {
  slug: 'gir-national-park',
  name: 'Gir National Park',
  state: 'Gujarat',
  route: '/india/national-parks/gir-national-park',
  heroImage: 'https://res.cloudinary.com/goqz2x1l/image/upload/v1788949125/Queen_Family.jpg',
  heroAlt: 'Asiatic lion resting in the Gir forest, Gujarat',
  summary: 'Find the best ways to reach Gir National Park by air, train, road and nearby cities. Plan your journey with easy travel options and useful tips.',
  introduction: 'Gir National Park is well-connected by air, train and road. Diu Airport is one of the nearest airport options, Junagadh is a major nearby railway station, and the park is accessible by road from cities such as Ahmedabad, Rajkot and nearby destinations.',
  sections: {
    overview: 'about-gir-title',
    'best-time': 'best-time-title',
    attractions: 'gir-attractions-title',
    gallery: 'gir-gallery-title',
  },
  transport: [
    {
      id: 'air',
      label: 'By Air',
      icon: Plane,
      theme: 'blue',
      image: 'https://images.unsplash.com/photo-1738597965554-b30b7b31d38e?auto=format&fit=crop&w=900&h=500&q=80',
      imageAlt: 'Passenger airplane on an airport runway at sunset',
      detailTitle: 'Nearest Airport: Diu Airport (DIU)',
      distance: 'Approx. 100 km',
      description: 'Diu Airport is one of the nearest practical airport options for reaching Gir National Park. From the airport, travelers can continue by road or taxi toward the park.',
      calloutTitle: 'Travel Time',
      callout: 'Around 2–2.5 hours by road',
      note: 'Approximate only; route, traffic and road conditions may change travel times.',
    },
    {
      id: 'train',
      label: 'By Train',
      icon: TrainFront,
      theme: 'green',
      image: 'https://images.unsplash.com/photo-1559110863-6cc7362d7700?auto=format&fit=crop&w=900&h=500&q=80',
      imageAlt: 'Indian passenger train travelling beside a green forest',
      detailTitle: 'Nearest Major Railway Station: Junagadh',
      distance: 'Approx. 65 km',
      description: 'Junagadh Railway Station offers rail connectivity for travelers heading toward Gir and connects with several destinations. Continue onward to the park by road.',
      calloutTitle: 'Travel Time',
      callout: 'Around 1.5–2 hours by road',
      note: 'Approximate only; route, traffic and road conditions may change travel times.',
    },
    {
      id: 'road',
      label: 'By Road',
      icon: Car,
      theme: 'orange',
      image: 'https://images.unsplash.com/photo-1612019080373-0057f89c887d?auto=format&fit=crop&w=900&h=500&q=80',
      imageAlt: 'Car travelling along a scenic road through green hills',
      description: 'Gir National Park can be reached by road from major cities in Gujarat and nearby regions. Travelers can use a private vehicle, taxi or other locally available transport options.',
      calloutTitle: 'Road Journey',
      callout: 'Plan according to your route and current road conditions.',
      note: 'Allow extra time for stops and conditions on the day.',
    },
  ],
  cities: [
    { name: 'Junagadh', distance: '65 km', time: '1.5–2 hours' },
    { name: 'Diu', distance: '100 km', time: '2–2.5 hours' },
    { name: 'Rajkot', distance: '160 km', time: '3–3.5 hours' },
    { name: 'Ahmedabad', distance: '350 km', time: '6–7 hours' },
    { name: 'Somnath', distance: '70 km', time: '2 hours' },
    { name: 'Veraval', distance: '65 km', time: '1.5–2 hours' },
    { name: 'Porbandar', distance: '190 km', time: '4–4.5 hours' },
    { name: 'Mumbai', distance: '800 km', time: '14–15 hours' },
  ],
  tips: [
    { icon: Car, theme: 'orange', title: 'Book Transport in Advance', text: 'Especially during peak travel periods.' },
    { icon: MapPin, theme: 'blue', title: 'Use Reliable Operators', text: 'Choose reputable taxi or transport services for a comfortable journey.' },
    { icon: Fuel, theme: 'red', title: 'Check Fuel Availability', text: 'Plan fuel stops before entering remote forest areas.' },
    { icon: Sun, theme: 'green', title: 'Start Early', text: 'Travel early to allow extra time and reach your destination comfortably.' },
  ],
  map: {
    nodes: [
      { name: 'Ahmedabad', x: 325, y: 45, labelX: 337, labelY: 49 },
      { name: 'Rajkot', x: 235, y: 104, labelX: 247, labelY: 108 },
      { name: 'Junagadh', x: 165, y: 163, labelX: 177, labelY: 167 },
      { name: 'Gir National Park', x: 225, y: 190, labelX: 247, labelY: 194, destination: true },
      { name: 'Somnath', x: 145, y: 224, labelX: 157, labelY: 228 },
      { name: 'Diu', x: 98, y: 254, labelX: 110, labelY: 258 },
    ],
    routes: [
      ['Ahmedabad', 'Rajkot'],
      ['Rajkot', 'Junagadh'],
      ['Junagadh', 'Gir National Park'],
      ['Rajkot', 'Gir National Park'],
      ['Gir National Park', 'Somnath'],
      ['Somnath', 'Diu'],
    ],
  },
}

const DESTINATIONS = [GIR_DESTINATION]

const DESTINATION_TABS = [
  { id: 'how-to-reach', label: 'How to Reach', icon: Car },
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'best-time', label: 'Best Time to Visit', icon: CalendarDays },
  { id: 'attractions', label: 'Attractions', icon: Mountain },
  { id: 'safari', label: 'Safari Info', icon: Car },
  { id: 'accommodation', label: 'Accommodation', icon: BedDouble },
  { id: 'travel-tips', label: 'Travel Tips', icon: Lightbulb },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
]

const COLOR_CLASSES = {
  blue: {
    badge: 'bg-sky-600 text-white',
    callout: 'border-sky-100 bg-sky-50 text-sky-950',
    icon: 'text-sky-700',
    tip: 'bg-sky-50 text-sky-700',
  },
  green: {
    badge: 'bg-emerald-700 text-white',
    callout: 'border-emerald-100 bg-emerald-50 text-emerald-950',
    icon: 'text-emerald-800',
    tip: 'bg-emerald-50 text-emerald-800',
  },
  orange: {
    badge: 'bg-orange-600 text-white',
    callout: 'border-orange-100 bg-orange-50 text-orange-950',
    icon: 'text-orange-700',
    tip: 'bg-orange-50 text-orange-700',
  },
  red: {
    badge: 'bg-red-600 text-white',
    callout: 'border-red-100 bg-red-50 text-red-950',
    icon: 'text-red-600',
    tip: 'bg-red-50 text-red-600',
  },
}

function SectionHeading({ id, title, className = '' }) {
  return (
    <div className={className}>
      <h2 id={id} className="font-display text-2xl font-bold leading-tight text-navy-950 sm:text-3xl">{title}</h2>
      <span className="mt-2 block h-1 w-11 rounded-full bg-orange-500" aria-hidden="true" />
    </div>
  )
}

function HowToReachHero({ destination }) {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="how-to-reach-page-title">
      <img
        src={destination.heroImage}
        alt={destination.heroAlt}
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[64%_48%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07150d]/95 via-[#0b1d14]/78 to-[#0d2017]/12" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[235px] w-full max-w-[1440px] items-center px-4 py-7 sm:min-h-[245px] sm:px-6 md:min-h-[250px] lg:px-8">
        <div className="max-w-4xl">
          <Breadcrumb light items={[
            { label: 'India', href: '/india' },
            { label: 'National Parks', href: '/india/national-parks' },
            { label: destination.name, href: destination.route },
            { label: 'How to Reach' },
          ]} />
          <h1 id="how-to-reach-page-title" className="font-display text-4xl font-bold leading-[1.02] drop-shadow sm:text-5xl md:text-6xl">
            <span className="text-white">How to </span><span className="text-gold-400">Reach</span>
          </h1>
          <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-white drop-shadow sm:text-3xl md:text-4xl">{destination.name}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/95 sm:text-base">
            {destination.summary}
          </p>
        </div>
      </div>
    </section>
  )
}

function DestinationInformationTabs({ destination, activeTab }) {
  return (
    <nav className="border-b border-orange-100 bg-[#fcfaf6]" aria-label={`${destination.name} information sections`}>
      <div className="mx-auto w-full max-w-[1600px] overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:thin] sm:px-6 lg:px-10">
        <ul className="flex min-w-max items-stretch xl:min-w-0 xl:justify-between">
          {DESTINATION_TABS.map(({ id, label, icon: Icon }) => {
            const isActive = id === activeTab
            const reachRoute = `${destination.route}/how-to-reach`
            const sectionId = destination.sections?.[id]
            const href = id === 'how-to-reach'
              ? reachRoute
              : id === 'travel-tips'
                ? `${reachRoute}#travel-tips-heading`
                : sectionId
                  ? `${destination.route}#${sectionId}`
                  : null
            const className = `group relative flex min-h-[70px] min-w-[108px] flex-col items-center justify-center gap-1.5 px-3 py-2 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:min-w-[120px] ${isActive ? 'bg-amber-100/85 text-amber-950 after:absolute after:-bottom-px after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rotate-45 after:bg-orange-500' : 'text-navy-800 hover:bg-amber-50'}`

            return (
              <li key={id} className="flex shrink-0 border-r border-orange-200 last:border-r-0">
                {href ? (
                  <Link to={href} aria-current={isActive ? 'page' : undefined} className={className}>
                    <Icon size={21} className={isActive ? 'text-amber-900' : 'text-amber-950'} aria-hidden="true" />
                    <span className="whitespace-nowrap text-xs font-semibold sm:text-sm">{label}</span>
                  </Link>
                ) : (
                  <span aria-disabled="true" className={`${className} cursor-not-allowed opacity-60`} title="This section is not available yet">
                    <Icon size={21} className="text-amber-950" aria-hidden="true" />
                    <span className="whitespace-nowrap text-xs font-semibold sm:text-sm">{label}</span>
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

function TransportCard({ option }) {
  const Icon = option.icon
  const colors = COLOR_CLASSES[option.theme]

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[2.4/1] overflow-hidden bg-slate-100">
        <img src={option.image} alt={option.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${colors.badge}`}>
            <Icon size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 pt-0.5">
            <h3 className="font-display text-xl font-bold leading-tight text-navy-950">{option.label}</h3>
            {option.detailTitle && <p className="mt-1 text-sm font-semibold leading-snug text-navy-900">{option.detailTitle}</p>}
            {option.distance && <p className={`mt-1 text-sm font-medium ${colors.icon}`}>{option.distance}</p>}
          </div>
        </div>
        <p className="mt-3 flex-1 text-sm leading-[1.55] text-navy-700">{option.description}</p>
        <div className={`mt-3 rounded-lg border px-3 py-2.5 ${colors.callout}`}>
          <div className="flex items-start gap-2.5">
            <Clock3 size={19} className={`mt-0.5 shrink-0 ${colors.icon}`} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">{option.calloutTitle}:</p>
              <p className="text-sm leading-snug">{option.callout}</p>
              {option.note && <p className="mt-1 text-xs leading-snug text-navy-600">{option.note}</p>}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function DistanceList({ cities }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="distance-cities-heading">
      <SectionHeading id="distance-cities-heading" title="Distance from Major Cities" className="mb-2" />
      <ul className="divide-y divide-slate-100" aria-label="Approximate road distances and travel times">
        {cities.map(city => (
          <li key={city.name} className="grid grid-cols-[20px_minmax(0,1fr)_58px_auto] items-center gap-2 py-2 text-xs sm:grid-cols-[20px_minmax(0,1fr)_62px_auto] sm:gap-2.5 sm:text-sm">
            <MapPin size={17} className="text-blue-600" fill="currentColor" aria-hidden="true" />
            <span className="truncate font-medium text-navy-900">{city.name}</span>
            <span className="whitespace-nowrap text-right text-navy-700">{city.distance}</span>
            <span className="col-start-2 col-span-2 justify-self-start rounded-full bg-sky-50 px-2 py-1 text-[10px] font-medium leading-none text-navy-700 sm:col-start-auto sm:col-span-1 sm:justify-self-end sm:px-2.5 sm:text-xs">Approx. {city.time}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] leading-relaxed text-navy-500">All distances and journey times are approximate; they depend on the route, starting point, traffic and road conditions. This is not live traffic information.</p>
    </section>
  )
}

function OrientationMap({ map, destination }) {
  const nodeByName = Object.fromEntries(map.nodes.map(node => [node.name, node]))

  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="location-map-heading">
      <SectionHeading id="location-map-heading" title="Location Map" className="mb-3" />
      <div className="overflow-hidden rounded-lg border border-sky-100 bg-sky-100">
        <svg viewBox="0 0 420 280" role="img" aria-labelledby={`${destination.slug}-route-map-title ${destination.slug}-route-map-description`} className="block aspect-[1.4/1] w-full">
          <title id={`${destination.slug}-route-map-title`}>Approximate travel orientation around {destination.name}</title>
          <desc id={`${destination.slug}-route-map-description`}>An illustrative map showing {map.nodes.map(node => node.name).join(', ')} with approximate connecting routes.</desc>
          <defs>
            <linearGradient id="gujarat-map-water" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#9de4ef" />
              <stop offset="1" stopColor="#6dcde1" />
            </linearGradient>
            <linearGradient id="gujarat-map-land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e2f0ba" />
              <stop offset="1" stopColor="#b8df9e" />
            </linearGradient>
            <pattern id="gujarat-map-texture" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="5" r="1" fill="#8abf7b" opacity="0.38" />
              <circle cx="19" cy="17" r="1.2" fill="#8abf7b" opacity="0.28" />
            </pattern>
          </defs>
          <rect width="420" height="280" fill="url(#gujarat-map-water)" />
          <path d="M140 -8H430V288H262l-14-20-23-13-24 3-24-12-18-18-28-9-18-16-12-19 8-18 16-13-12-17 5-20 16-14-9-18 13-15-10-17 15-14-8-18 14-19-8-16 10-18z" fill="url(#gujarat-map-land)" stroke="#88b882" strokeWidth="2" />
          <path d="M140 -8H430V288H262l-14-20-23-13-24 3-24-12-18-18-28-9-18-16-12-19 8-18 16-13-12-17 5-20 16-14-9-18 13-15-10-17 15-14-8-18 14-19-8-16 10-18z" fill="url(#gujarat-map-texture)" />
          <path d="M130 206c25 6 40 14 57 28m38-185c-16 18-8 30 10 47m-76 21c23 5 36 11 48 25" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="5 7" opacity="0.75" />
          <text x="16" y="42" fill="#126080" fontSize="10" fontWeight="700" letterSpacing="1.4" opacity="0.8">ARABIAN SEA</text>
          {map.routes.map((route, index) => {
            const points = route.map(name => {
              const node = nodeByName[name]
              return `${node.x},${node.y}`
            }).join(' ')
            return <polyline key={`${route.join('-')}-${index}`} points={points} fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          })}
          {map.routes.map((route, index) => {
            const points = route.map(name => {
              const node = nodeByName[name]
              return `${node.x},${node.y}`
            }).join(' ')
            return <polyline key={`route-${route.join('-')}-${index}`} points={points} fill="none" stroke="#1676b8" strokeWidth="2.5" strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round" />
          })}
          {map.nodes.map(node => (
            <g key={node.name}>
              {node.destination ? (
                <>
                  <circle cx={node.x} cy={node.y} r="17" fill="#087a44" stroke="#ffffff" strokeWidth="3" />
                  <g fill="#ffffff" transform={`translate(${node.x} ${node.y})`} aria-hidden="true">
                    <ellipse cx="0" cy="4" rx="5.2" ry="4.5" />
                    <circle cx="-6" cy="-3" r="2.6" />
                    <circle cx="-2" cy="-6" r="2.6" />
                    <circle cx="3" cy="-6" r="2.6" />
                    <circle cx="7" cy="-3" r="2.6" />
                  </g>
                </>
              ) : (
                <circle cx={node.x} cy={node.y} r="6" fill="#f04438" stroke="#ffffff" strokeWidth="2" />
              )}
              <text x={node.labelX} y={node.labelY} fill="#14283a" stroke="#ffffff" strokeWidth="3" paintOrder="stroke" fontSize={node.destination ? '11' : '10'} fontWeight="700">
                {node.name}
              </text>
            </g>
          ))}
        </svg>
        <div className="flex items-center justify-between gap-2 border-t border-white/70 bg-emerald-900 px-3 py-2 text-white">
          <span className="flex min-w-0 items-center gap-1.5 text-xs font-semibold"><PawPrint size={15} fill="currentColor" aria-hidden="true" /> <span className="truncate">{destination.name}</span></span>
          <span className="shrink-0 text-[10px] text-white/85">Gujarat · route illustration</span>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-navy-500">Approximate orientation only — not to scale and not for live navigation.</p>
    </section>
  )
}

function TravelTips({ tips }) {
  return (
    <section className="mt-6" aria-labelledby="travel-tips-heading">
      <SectionHeading id="travel-tips-heading" title="Travel Tips" className="mb-4" />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tips.map(({ icon: Icon, theme, title, text }) => {
          const colors = COLOR_CLASSES[theme]
          return (
            <li key={title} className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.tip}`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-sm font-bold leading-snug text-navy-950">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-navy-700">{text}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function HowToReachPage() {
  const { destinationSlug } = useParams()
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return undefined

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1))
      if (!target) return

      const stickyHeaderHeight = document.querySelector('header')?.parentElement?.getBoundingClientRect().height ?? 0
      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - stickyHeaderHeight - 16,
        behavior: 'smooth',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [hash])

  const destination = destinationSlug
    ? DESTINATIONS.find(item => item.slug === destinationSlug)
    : GIR_DESTINATION

  if (!destination) return <Navigate to="/india/national-parks" replace />

  return (
    <div className="min-w-0 bg-white">
      <SEOHead
        title={`How to Reach ${destination.name}, ${destination.state} | TravelVista`}
        description={`How to reach ${destination.name} by air, rail and road. See approximate distances from nearby cities and practical travel tips.`}
        keywords={`how to reach ${destination.name}, ${destination.state}, travel directions, transport`}
      />
      <HowToReachHero destination={destination} />
      <DestinationInformationTabs destination={destination} activeTab="how-to-reach" />

      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2.25fr)_minmax(290px,1fr)] xl:gap-6">
          <section aria-labelledby="main-how-to-reach-heading" className="min-w-0">
            <SectionHeading id="main-how-to-reach-heading" title={`How to Reach ${destination.name}`} className="mb-2" />
            <p className="text-sm leading-relaxed text-navy-700 sm:text-[15px]">{destination.introduction}</p>
            <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {destination.transport.map(option => <TransportCard key={option.id} option={option} />)}
            </div>
          </section>

          <aside className="min-w-0 xl:pt-0.5" aria-label={`${destination.name} travel distances and location map`}>
            <DistanceList cities={destination.cities} />
            <OrientationMap map={destination.map} destination={destination} />
          </aside>
        </div>

        <TravelTips tips={destination.tips} />
      </div>
    </div>
  )
}
