import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  Building,
  Camera,
  Car,
  ChevronRight,
  Landmark,
  MapPin,
  PawPrint,
  Plane,
  Quote,
  TrainFront,
  TreePine,
  Trees,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'

const IMAGES = {
  tiger: 'https://images.unsplash.com/photo-1639141155354-3706f000e3b8?w=1500&h=800&fit=crop',
  fort: 'https://images.unsplash.com/photo-1788847099411-3b5f854845ff?w=1100&h=760&fit=crop',
  leopard: 'https://images.unsplash.com/photo-1496841733162-a88a250a275c?w=700&h=560&fit=crop',
  bear: 'https://images.unsplash.com/photo-1779111370141-4cc5d671be58?w=700&h=560&fit=crop',
  chital: 'https://images.unsplash.com/photo-1761627067698-c7538633d4b6?w=700&h=560&fit=crop',
  sambar: 'https://images.unsplash.com/photo-1607378112100-4c6a10ec4d50?w=700&h=560&fit=crop',
  crocodile: 'https://images.unsplash.com/photo-1770810544544-7e83bc7a0079?w=700&h=560&fit=crop',
  bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=700&h=560&fit=crop',
  safari: 'https://images.unsplash.com/photo-1730830812275-05d20a099679?w=1100&h=760&fit=crop',
  lake: 'https://images.unsplash.com/photo-1788847099375-b67141fb00d0?w=800&h=620&fit=crop',
  fortDetail: 'https://images.unsplash.com/photo-1788847099411-3b5f854845ff?w=700&h=520&fit=crop',
  padam: 'https://images.unsplash.com/photo-1757005853152-59a85aee0184?w=700&h=520&fit=crop',
  rajBagh: 'https://images.unsplash.com/photo-1788847099375-b67141fb00d0?w=700&h=520&fit=crop',
  cta: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1900&h=760&fit=crop',
}

const HERO_FEATURES = [
  { icon: PawPrint, label: 'Royal Bengal Tigers' },
  { icon: Trees, label: 'Rich Flora & Fauna' },
  { icon: Camera, label: 'Wildlife Photography' },
  { icon: Landmark, label: 'Historic Ranthambore Fort' },
  { icon: Car, label: 'Jungle Safari Experience' },
]

const WILDLIFE = [
  { name: 'Royal Bengal Tiger', image: IMAGES.tiger, alt: 'Royal Bengal tiger in a green forest habitat' },
  { name: 'Leopard', image: IMAGES.leopard, alt: 'Leopard resting in a natural wildlife habitat' },
  { name: 'Sloth Bear', image: IMAGES.bear, alt: 'Sloth bear among green foliage' },
  { name: 'Chital (Spotted Deer)', image: IMAGES.chital, alt: 'Spotted chital deer in a grassy field' },
  { name: 'Sambar', image: IMAGES.sambar, alt: 'Sambar deer in a green forest clearing' },
  { name: 'Mugger Crocodile', image: IMAGES.crocodile, alt: 'Crocodiles resting in shallow water' },
  { name: 'Bird Watching', image: IMAGES.bird, alt: 'Colorful bird resting among leaves' },
]

const NEARBY_ATTRACTIONS = [
  { name: 'Ranthambore Fort', image: IMAGES.fortDetail, alt: 'Historic stone fort walls and steps' },
  { name: 'Padam Talao', image: IMAGES.padam, alt: 'A deer standing at the edge of a calm lake' },
  { name: 'Raj Bagh', image: IMAGES.rajBagh, alt: 'Historic stone ruins overlooking a forest lake' },
]

function SectionHeading({ id, title, className = '' }) {
  return (
    <h2 id={id} className={`flex items-center gap-3 font-display text-2xl font-bold text-emerald-950 sm:text-3xl ${className}`}>
      <span className="h-0.5 w-8 shrink-0 bg-orange-600" aria-hidden="true" />
      <span>{title}</span>
    </h2>
  )
}

function RanthamboreHero() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="ranthambore-page-title">
      <img
        src={IMAGES.tiger}
        alt="Royal Bengal tiger walking through a forest in Ranthambore"
        className="absolute inset-0 h-full w-full object-cover object-[60%_44%]"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#10140d]/95 via-[#172014]/78 to-[#1b2113]/20" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" aria-hidden="true" />

      <div className="container-wide relative flex min-h-[500px] items-center py-10 sm:min-h-[470px] lg:min-h-[450px]">
        <div className="max-w-3xl">
          <Breadcrumb light items={[
            { label: 'India', href: '/india' },
            { label: 'Wildlife Destinations', href: '/india/wildlife-destinations' },
            { label: 'Ranthambore National Park' },
          ]} />
          <h1 id="ranthambore-page-title" className="font-display text-5xl font-bold leading-[0.98] text-white drop-shadow sm:text-6xl lg:text-7xl">
            <span className="block">Ranthambore</span>
            <span className="block text-gold-400">National Park</span>
          </h1>
          <p className="mt-5 font-display text-xl font-bold text-white sm:text-2xl">
            Where Royal Bengal Tigers Roam Free
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base sm:leading-7">
            Ranthambore National Park, located in Sawai Madhopur, Rajasthan, is one of India’s renowned
            wildlife destinations. Known for its Bengal tigers, historic landscapes and rich natural
            surroundings, it offers a memorable combination of wildlife, history and nature.
          </p>
        </div>
      </div>
    </section>
  )
}

function FeatureHighlights() {
  return (
    <section className="border-b border-orange-100 bg-[#fcfaf6] py-5 sm:py-6" aria-label="Ranthambore feature highlights">
      <div className="container-wide">
        <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
          {HERO_FEATURES.map(({ icon: Icon, label }, index) => (
            <li key={label} className={`flex min-h-[74px] items-center justify-center gap-3 px-3 text-center ${index > 0 ? 'lg:border-l lg:border-orange-200' : ''}`}>
              <Icon className="shrink-0 text-amber-900" size={28} strokeWidth={1.8} aria-hidden="true" />
              <span className="max-w-[150px] text-xs font-medium leading-snug text-navy-900 sm:text-sm">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function RanthamboreQuote() {
  return (
    <aside className="relative isolate flex min-h-[270px] flex-col justify-between overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-[#fbf8ee] via-[#f5f3e8] to-[#e9eddd] p-6 shadow-sm md:col-span-2 lg:col-span-1 sm:p-7" aria-label="A thought about Ranthambore">
      <Quote size={30} className="relative text-emerald-950" fill="currentColor" aria-hidden="true" />
      <blockquote className="relative mt-3 font-display text-2xl font-semibold italic leading-snug text-emerald-950">
        “A land where wildlife, history and nature come together in perfect harmony.”
      </blockquote>
      <div className="relative mt-4 flex items-center justify-between text-amber-900/80" aria-hidden="true">
        <PawPrint size={25} fill="currentColor" />
        <TreePine size={34} />
      </div>
      <svg className="absolute inset-x-0 bottom-0 -z-10 h-20 w-full text-[#d7dec7]/75" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 55 Q55 18 112 54 T230 48 T400 36 V90 H0Z" fill="currentColor" />
        <path d="M0 70 Q85 38 160 67 T300 57 T400 65 V90 H0Z" fill="currentColor" opacity="0.72" />
      </svg>
    </aside>
  )
}

function AboutRanthambore() {
  return (
    <section className="bg-gradient-to-b from-white to-[#fbfaf7] py-10 sm:py-12 lg:py-14" aria-labelledby="about-ranthambore-title">
      <div className="container-wide grid min-w-0 items-center gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(235px,0.72fr)] lg:gap-7">
        <img
          src={IMAGES.fort}
          alt="Historic fort structure among the forested hills of Ranthambore"
          loading="lazy"
          decoding="async"
          className="h-full min-h-[250px] max-h-[350px] w-full rounded-2xl object-cover shadow-md"
        />
        <div>
          <SectionHeading id="about-ranthambore-title" title="About Ranthambore National Park" />
          <div className="mt-4 space-y-4 text-sm leading-7 text-navy-700 sm:text-[15px]">
            <p>
              Ranthambore National Park is located near Sawai Madhopur in Rajasthan and is known for its
              dramatic combination of wildlife, forests, lakes and historic ruins.
            </p>
            <p>
              The landscape supports diverse wildlife, including tigers, leopards, deer, sloth bears,
              crocodiles and numerous bird species.
            </p>
            <p>
              Historic Ranthambore Fort and the surrounding natural landscape give the region a distinctive
              blend of heritage and wilderness.
            </p>
          </div>
        </div>
        <RanthamboreQuote />
      </div>
    </section>
  )
}

function WildlifeGallery() {
  return (
    <section className="border-y border-emerald-100/80 bg-[#f6f8f4] py-9 sm:py-11" aria-labelledby="ranthambore-wildlife-title">
      <div className="container-wide">
        <SectionHeading id="ranthambore-wildlife-title" title="Wildlife at Ranthambore" className="mb-6" />
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7">
          {WILDLIFE.map(({ name, image, alt }) => (
            <article key={name} className="group min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="aspect-[4/3] overflow-hidden bg-emerald-50">
                <img
                  src={image}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="flex min-h-11 items-center justify-center px-2 py-2 text-center text-xs font-semibold leading-tight text-navy-900 sm:text-sm">
                {name}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SafariExperience() {
  const [zonesExpanded, setZonesExpanded] = useState(false)

  return (
    <section className="py-10 sm:py-12" aria-labelledby="safari-experience-title">
      <div className="container-wide grid min-w-0 items-center gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(230px,0.8fr)]">
        <div>
          <SectionHeading id="safari-experience-title" title="Safari Experience" />
          <p className="mt-4 text-sm leading-7 text-navy-700 sm:text-[15px]">
            Explore the wilderness of Ranthambore through its forest landscapes and safari experience.
            Discover open grasslands, woodland, lakes and wildlife habitats that make Ranthambore one
            of Rajasthan’s distinctive nature destinations.
          </p>
        </div>
        <img
          src={IMAGES.safari}
          alt="A safari jeep travelling along a forest trail"
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full rounded-2xl object-cover shadow-md"
        />
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-[#fff9eb] to-[#f7f0e2] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Car size={28} className="shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <h3 className="font-display text-xl font-bold text-emerald-950">Safari Zones</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">
                Ranthambore is divided into different safari zones, each offering varied landscapes and
                opportunities to experience the park environment.
              </p>
            </div>
          </div>
          <p id="safari-zones-details" hidden={!zonesExpanded} className="mt-4 border-t border-orange-200 pt-4 text-sm leading-relaxed text-navy-700">
            Zone landscapes can vary across the park, from woodland and open grassland to lakes and
            historic ruins. Zone access and conditions may change; check official park information
            before travelling.
          </p>
          <button
            type="button"
            aria-expanded={zonesExpanded}
            aria-controls="safari-zones-details"
            onClick={() => setZonesExpanded(expanded => !expanded)}
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-navy-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
          >
            {zonesExpanded ? 'Show Less' : 'Know More'}
            {zonesExpanded ? <ArrowDown size={15} className="rotate-180" aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  )
}

function BestTimeCard() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="ranthambore-best-time-title">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <TreePine size={21} aria-hidden="true" />
        </span>
        <h2 id="ranthambore-best-time-title" className="font-display text-xl font-bold text-emerald-950">Best Time to Visit</h2>
      </div>
      <p className="mt-5 font-display text-2xl font-bold text-emerald-900">October to June</p>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">
        Seasonal access and visitor conditions can vary, so travellers should verify current official park information before planning their visit.
      </p>
      <img
        src={IMAGES.lake}
        alt="Scenic lake and green landscape near Ranthambore"
        loading="lazy"
        decoding="async"
        className="mt-5 aspect-[16/10] w-full rounded-xl object-cover"
      />
    </section>
  )
}

function HowToReachCard() {
  const rows = [
    { icon: Plane, label: 'Nearest Airport', value: 'Jaipur' },
    { icon: TrainFront, label: 'Nearest Railway Station', value: 'Sawai Madhopur' },
    { icon: Car, label: 'By Road', value: 'Sawai Madhopur is connected by road with major cities in Rajasthan and nearby regions.' },
  ]

  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="how-to-reach-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <MapPin size={21} aria-hidden="true" />
        </span>
        <h2 id="how-to-reach-title" className="font-display text-xl font-bold text-emerald-950">How to Reach</h2>
      </div>
      <dl className="divide-y divide-emerald-100">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3 py-4 first:pt-2 last:pb-1">
            <Icon size={20} className="mt-0.5 shrink-0 text-emerald-800" aria-hidden="true" />
            <div className="min-w-0">
              <dt className="text-sm font-semibold text-navy-900">{label}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-navy-700">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}

function NearbyAttractions() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm md:col-span-2 lg:col-span-1 sm:p-6" aria-labelledby="nearby-attractions-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <Building size={21} aria-hidden="true" />
        </span>
        <h2 id="nearby-attractions-title" className="font-display text-xl font-bold text-emerald-950">Nearby Attractions</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {NEARBY_ATTRACTIONS.map(({ name, image, alt }) => (
          <article key={name} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden bg-emerald-50">
              <img
                src={image}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="px-2 py-2.5 text-center text-xs font-semibold text-navy-900 sm:text-sm">{name}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}

function VisitInformation() {
  return (
    <section className="bg-[#f7f9f5] py-10 sm:py-12" aria-label="Visitor information and nearby attractions">
      <div className="container-wide grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:items-stretch">
        <BestTimeCard />
        <HowToReachCard />
        <NearbyAttractions />
      </div>
    </section>
  )
}

function RanthamboreCallToAction() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="ranthambore-cta-title">
      <img
        src={IMAGES.cta}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#11160e]/85 via-[#142014]/65 to-[#18170e]/55" aria-hidden="true" />
      <div className="relative container-wide flex min-h-[330px] flex-col items-center justify-center py-12 text-center text-white sm:min-h-[365px]">
        <h2 id="ranthambore-cta-title" className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Discover the Wild Side of Rajasthan
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          Witness majestic wildlife, explore historic landscapes, and immerse yourself in the natural beauty of Ranthambore.
        </p>
        <Link
          to="/india/wildlife-destinations"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-sm font-bold text-navy-950 shadow-lg transition-colors hover:bg-gold-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-950 sm:w-auto"
        >
          Explore More Destinations <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

export default function RanthamboreNationalParkPage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead
        title="Ranthambore National Park, Rajasthan | TravelVista"
        description="Explore Ranthambore National Park in Rajasthan, its tigers, wildlife, historic fort, forest landscapes and visitor information."
        keywords="Ranthambore National Park, Rajasthan, Bengal tiger, Sawai Madhopur, wildlife"
      />
      <RanthamboreHero />
      <FeatureHighlights />
      <AboutRanthambore />
      <WildlifeGallery />
      <SafariExperience />
      <VisitInformation />
      <RanthamboreCallToAction />
    </div>
  )
}
