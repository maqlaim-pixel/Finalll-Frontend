import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Car,
  ChevronRight,
  Compass,
  Leaf,
  MapPin,
  Mountain,
  PawPrint,
  Plane,
  Quote,
  Trees,
  Waves,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'

const WIKIMEDIA = 'https://upload.wikimedia.org/wikipedia/commons'
const COMMONS = 'https://commons.wikimedia.org/wiki/File:'
const CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0/'

const IMAGES = {
  hero: `${WIKIMEDIA}/thumb/b/b9/Collarwali_Tigress_of_Pench.jpg/1920px-Collarwali_Tigress_of_Pench.jpg`,
  river: `${WIKIMEDIA}/thumb/f/f3/Pench_National_Park%2C_Madhya_Pradesh_-_by_Ishani_Mehta.jpg/1280px-Pench_National_Park%2C_Madhya_Pradesh_-_by_Ishani_Mehta.jpg`,
  tiger: `${WIKIMEDIA}/thumb/4/42/Tiger_of_Turia_Core_Zone_-_Pench_National_Park.jpg/960px-Tiger_of_Turia_Core_Zone_-_Pench_National_Park.jpg`,
  leopard: `${WIKIMEDIA}/thumb/2/21/Leopard_of_Turia_Core_Zone_-_Pench_National_Park.jpg/960px-Leopard_of_Turia_Core_Zone_-_Pench_National_Park.jpg`,
  bear: 'https://images.unsplash.com/photo-1779111370141-4cc5d671be58?w=700&h=560&fit=crop',
  dhole: `${WIKIMEDIA}/f/f9/Dhole%2C_Pench_Tiger_Reserve.jpg`,
  chital: `${WIKIMEDIA}/thumb/a/a3/Chital_of_of_Turia_Core_Zone_-_Pench_National_Park.jpg/960px-Chital_of_of_Turia_Core_Zone_-_Pench_National_Park.jpg`,
  sambar: `${WIKIMEDIA}/thumb/a/ac/Pench_sambar_by_Ananth_T.jpg/960px-Pench_sambar_by_Ananth_T.jpg`,
  gaur: `${WIKIMEDIA}/thumb/e/e7/Totladoh_Dam_And_reservoir.jpg/960px-Totladoh_Dam_And_reservoir.jpg`,
  bird: `${WIKIMEDIA}/thumb/0/0d/Changeable_hawk-eagle_at_Pench_national_park_%28April%2C_2024%29_07.jpg/960px-Changeable_hawk-eagle_at_Pench_national_park_%28April%2C_2024%29_07.jpg`,
  safari: `${WIKIMEDIA}/thumb/7/79/Pench_Safari.jpg/1280px-Pench_Safari.jpg`,
  landscape: `${WIKIMEDIA}/thumb/3/3c/Landscape_at_Pench.jpg/1280px-Landscape_at_Pench.jpg`,
  turiaGate: `${WIKIMEDIA}/b/b5/Tiriya_gate_seoni_pench_Tiger_reserve.png`,
  cta: `${WIKIMEDIA}/thumb/0/0f/Pench_Sunset.jpg/1920px-Pench_Sunset.jpg`,
}

const HERO_FEATURES = [
  { icon: PawPrint, label: 'Famous Tiger Reserve' },
  { icon: Trees, label: 'Rich Flora & Fauna' },
  { icon: Camera, label: 'Excellent Wildlife Photography' },
  { icon: Waves, label: 'Scenic Landscapes & Waterbodies' },
  { icon: Car, label: 'Safari Experiences' },
]

const HIGHLIGHTS = [
  { icon: PawPrint, label: 'Popular Tiger Sightings' },
  { icon: Leaf, label: 'Diverse Flora & Fauna' },
  { icon: Camera, label: 'Perfect for Wildlife Photography' },
  { icon: Waves, label: 'Beautiful Lakes and River Systems' },
  { icon: Car, label: 'Safari Experiences' },
]

const WILDLIFE = [
  {
    name: 'Royal Bengal Tiger',
    image: IMAGES.tiger,
    alt: 'Royal Bengal tiger in the Turia Core Zone of Pench National Park',
    credit: { author: 'Shaswat Nimesh', file: 'Tiger_of_Turia_Core_Zone_-_Pench_National_Park.jpg' },
  },
  {
    name: 'Leopard',
    image: IMAGES.leopard,
    alt: 'Leopard in the Turia Core Zone of Pench National Park',
    credit: { author: 'Shaswat Nimesh', file: 'Leopard_of_Turia_Core_Zone_-_Pench_National_Park.jpg' },
  },
  { name: 'Sloth Bear', image: IMAGES.bear, alt: 'Sloth bear in a natural forest habitat' },
  {
    name: 'Indian Wild Dog (Dhole)',
    image: IMAGES.dhole,
    alt: 'Female dhole in Pench Tiger Reserve',
    credit: { author: '_thinrhino', file: 'Dhole,_Pench_Tiger_Reserve.jpg', license: 'CC BY 2.0', licenseHref: 'https://creativecommons.org/licenses/by/2.0/' },
  },
  {
    name: 'Chital (Spotted Deer)',
    image: IMAGES.chital,
    alt: 'Chital deer in the Turia Core Zone of Pench National Park',
    credit: { author: 'Shaswat Nimesh', file: 'Chital_of_of_Turia_Core_Zone_-_Pench_National_Park.jpg' },
  },
  {
    name: 'Sambar',
    image: IMAGES.sambar,
    alt: 'Sambar deer in Pench Tiger Reserve, Madhya Pradesh',
    credit: { author: 'Anantht84', file: 'Pench_sambar_by_Ananth_T.jpg' },
  },
  {
    name: 'Indian Gaur',
    image: IMAGES.gaur,
    alt: 'Indian gaur at Pench National Park',
    credit: { author: 'Shashikantshahare22', file: 'Totladoh_Dam_And_reservoir.jpg' },
  },
  {
    name: 'Rich Birdlife',
    image: IMAGES.bird,
    alt: 'Changeable hawk-eagle photographed at Pench National Park',
    credit: { author: 'Rohit Sharma', file: 'Changeable_hawk-eagle_at_Pench_national_park_(April,_2024)_07.jpg' },
  },
]

const NEARBY_ATTRACTIONS = [
  {
    name: 'Pench River',
    image: IMAGES.river,
    alt: 'River and forest landscape at the edge of Pench National Park',
    credit: { author: 'Ishani Mehta', file: 'Pench_National_Park,_Madhya_Pradesh_-_by_Ishani_Mehta.jpg' },
  },
  {
    name: 'Turia Gate / Area',
    image: IMAGES.turiaGate,
    alt: 'The Turia (Tiriya) Gate area in Pench, Seoni',
    credit: {
      author: 'Maywe46',
      file: 'Tiriya_gate_seoni_pench_Tiger_reserve.png',
      license: 'CC0 1.0',
      licenseHref: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
  },
  {
    name: 'Karmajhiri Area',
    image: IMAGES.landscape,
    alt: 'Woodland stream in the Pench landscape',
    credit: { author: 'Dr Dinesh Bisen IRS', file: 'Landscape_at_Pench.jpg' },
  },
]

function PhotoCredit({ author, file, license = 'CC BY-SA 4.0', licenseHref = CC_BY_SA, className = '' }) {
  return (
    <p className={`text-[10px] leading-snug text-slate-500 ${className}`}>
      Photo: <a href={`${COMMONS}${file}`} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600">{author} / Wikimedia Commons</a>
      {' · '}
      <a href={licenseHref} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600">{license}</a>
      {license === 'CC0 1.0' ? '' : ' · cropped'}
    </p>
  )
}

function SectionHeading({ id, title, className = '' }) {
  return (
    <h2 id={id} className={`flex items-center gap-3 font-display text-2xl font-bold text-emerald-950 sm:text-3xl ${className}`}>
      <span className="h-0.5 w-8 shrink-0 bg-orange-600" aria-hidden="true" />
      <span>{title}</span>
    </h2>
  )
}

function PenchHero() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="pench-page-title">
      <img
        src={IMAGES.hero}
        alt="Collarwali tigress walking through the forest at Pench Tiger Reserve"
        className="absolute inset-0 h-full w-full object-cover object-[65%_center]"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c160e]/98 via-[#111b12]/88 to-[#172014]/30" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" aria-hidden="true" />

      <div className="container-wide relative flex min-h-[520px] items-center py-10 sm:min-h-[500px] lg:min-h-[470px]">
        <div className="max-w-3xl">
          <Breadcrumb light items={[
            { label: 'India', href: '/india' },
            { label: 'National Parks' },
            { label: 'Pench National Park' },
          ]} />
          <h1 id="pench-page-title" className="font-display text-5xl font-bold leading-[0.98] text-white drop-shadow sm:text-6xl lg:text-7xl">
            <span className="block">Pench</span>
            <span className="block text-gold-400">National Park</span>
          </h1>
          <p className="mt-5 font-display text-xl font-bold text-white sm:text-2xl">
            Land of Jungle Book &amp; Majestic Wildlife
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base sm:leading-7">
            Pench National Park, located across the Seoni and Chhindwara regions of Madhya Pradesh, is known for its
            rich biodiversity, scenic forest landscapes and connection with the world associated with <em>The Jungle Book</em>.
          </p>
        </div>
      </div>
      <PhotoCredit
        author="Nconnet"
        file="Collarwali_Tigress_of_Pench.jpg"
        className="absolute bottom-2 right-4 rounded bg-black/35 px-2 py-1 text-right text-white/90 sm:right-8"
      />
    </section>
  )
}

function FeatureStrip() {
  return (
    <section className="border-b border-orange-100 bg-[#fcfaf6] py-5 sm:py-6" aria-label="Pench feature highlights">
      <div className="container-wide">
        <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
          {HERO_FEATURES.map(({ icon: Icon, label }, index) => (
            <li key={label} className={`flex min-h-[90px] flex-col items-center justify-center gap-2 px-3 text-center ${index > 0 ? 'lg:border-l lg:border-orange-200' : ''}`}>
              <Icon className="shrink-0 text-amber-900" size={29} strokeWidth={1.8} aria-hidden="true" />
              <span className="max-w-[175px] text-xs font-medium leading-snug text-navy-900 sm:text-sm">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function PenchQuote() {
  return (
    <aside className="relative isolate flex min-h-[270px] flex-col justify-between overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-[#fbf8ee] via-[#f5f3e8] to-[#e9eddd] p-6 shadow-sm md:col-span-2 lg:col-span-1 sm:p-7" aria-label="A thought about Pench National Park">
      <Quote size={30} className="relative text-emerald-950" fill="currentColor" aria-hidden="true" />
      <blockquote className="relative mt-3 font-display text-2xl font-semibold italic leading-snug text-emerald-950">
        “Walk into the real jungle, where nature still tells the story of the wild.”
      </blockquote>
      <div className="relative mt-4 flex items-center justify-between text-amber-900/80" aria-hidden="true">
        <PawPrint size={25} fill="currentColor" />
        <Trees size={35} />
      </div>
      <svg className="absolute inset-x-0 bottom-0 -z-10 h-20 w-full text-[#d7dec7]/75" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 55 Q55 18 112 54 T230 48 T400 36 V90 H0Z" fill="currentColor" />
        <path d="M0 70 Q85 38 160 67 T300 57 T400 65 V90 H0Z" fill="currentColor" opacity="0.72" />
      </svg>
    </aside>
  )
}

function AboutPench() {
  return (
    <section className="bg-gradient-to-b from-white to-[#fbfaf7] py-10 sm:py-12 lg:py-14" aria-labelledby="about-pench-title">
      <div className="container-wide grid min-w-0 items-center gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(235px,0.72fr)] lg:gap-7">
        <figure className="min-w-0">
          <img
            src={IMAGES.river}
            alt="River bordered by forest near Pench National Park"
            loading="lazy"
            decoding="async"
            className="h-full min-h-[250px] max-h-[350px] w-full rounded-2xl object-cover shadow-md"
          />
          <PhotoCredit
            author="Ishani Mehta"
            file="Pench_National_Park,_Madhya_Pradesh_-_by_Ishani_Mehta.jpg"
            className="mt-1.5 px-1"
          />
        </figure>
        <div>
          <SectionHeading id="about-pench-title" title="About Pench National Park" />
          <div className="mt-4 space-y-4 text-sm leading-7 text-navy-700 sm:text-[15px]">
            <p>
              Pench National Park is known for its forests, grasslands and water bodies. The protected landscape
              extends through the Pench region and forms an important wildlife habitat in central India.
            </p>
            <p>
              The region supports Royal Bengal Tigers along with leopards, wild dogs, sloth bears, deer and a rich
              variety of birdlife.
            </p>
            <p>
              Its forest scenery, river landscapes and wildlife make Pench a popular destination for nature lovers,
              photographers and wildlife enthusiasts.
            </p>
          </div>
        </div>
        <PenchQuote />
      </div>
    </section>
  )
}

function KeyHighlights() {
  return (
    <section className="border-y border-emerald-100/80 bg-[#f6f8f4] py-9 sm:py-11" aria-labelledby="pench-highlights-title">
      <div className="container-wide">
        <SectionHeading id="pench-highlights-title" title="Key Highlights" className="mb-5" />
        <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0" aria-label="Pench National Park highlights">
          {HIGHLIGHTS.map(({ icon: Icon, label }, index) => (
            <li key={label} className={`flex min-h-[94px] flex-col items-center justify-center gap-2 px-3 text-center ${index > 0 ? 'lg:border-l lg:border-emerald-200' : ''}`}>
              <Icon size={30} strokeWidth={1.9} className="text-emerald-800" aria-hidden="true" />
              <span className="max-w-[185px] text-sm font-medium leading-snug text-emerald-950">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function WildlifeGallery() {
  return (
    <section className="py-9 sm:py-11" aria-labelledby="pench-wildlife-title">
      <div className="container-wide">
        <SectionHeading id="pench-wildlife-title" title="Wildlife at Pench" className="mb-6" />
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">
          {WILDLIFE.map(({ name, image, alt, credit }) => (
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
              <div className="flex min-h-[76px] flex-col items-center justify-center px-2 py-2 text-center">
                <h3 className="flex min-h-9 items-center justify-center text-xs font-semibold leading-tight text-navy-900 sm:text-sm">{name}</h3>
                {credit && <PhotoCredit {...credit} className="mt-1 text-center" />}
              </div>
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
    <section className="border-y border-emerald-100 bg-[#fbfaf7] py-10 sm:py-12" aria-labelledby="safari-experience-title">
      <div className="container-wide grid min-w-0 items-center gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(230px,0.8fr)]">
        <div>
          <SectionHeading id="safari-experience-title" title="Safari Experience" />
          <p className="mt-4 text-sm leading-7 text-navy-700 sm:text-[15px]">
            Explore the wilderness of Pench through its forest landscapes and safari experience. Discover diverse
            habitats, peaceful natural surroundings and the wildlife that makes Pench one of central India’s
            notable protected landscapes.
          </p>
        </div>
        <figure className="min-w-0">
          <img
            src={IMAGES.safari}
            alt="Forest lake in Pench National Park where wildlife comes to drink"
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full rounded-2xl object-cover shadow-md"
          />
          <PhotoCredit author="ChanchalJhanwar" file="Pench_Safari.jpg" className="mt-1.5 px-1" />
        </figure>
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-[#fff9eb] to-[#f7f0e2] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Car size={28} className="shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <h3 className="font-display text-xl font-bold text-emerald-950">Safari Zones</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">
                Pench includes multiple tourism zones offering different forest landscapes and wildlife experiences.
              </p>
            </div>
          </div>
          <div id="pench-safari-zones-details" hidden={!zonesExpanded} className="mt-4 border-t border-orange-200 pt-4 text-sm leading-relaxed text-navy-700">
            <p>Commonly referenced zones include:</p>
            <ul className="mt-2 flex flex-wrap gap-2" aria-label="Commonly referenced Pench safari zones">
              {['Turia', 'Karmajhiri', 'Jamtara', 'Rukhad'].map(zone => (
                <li key={zone} className="rounded-full bg-white/80 px-3 py-1 font-medium text-emerald-900">{zone}</li>
              ))}
            </ul>
            <p className="mt-3">Zone access and seasonal conditions can vary; check current official park information before travelling.</p>
          </div>
          <button
            type="button"
            aria-expanded={zonesExpanded}
            aria-controls="pench-safari-zones-details"
            onClick={() => setZonesExpanded(expanded => !expanded)}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-navy-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
          >
            {zonesExpanded ? 'Show Less' : 'Know More'}
            <ChevronRight size={16} className={zonesExpanded ? 'rotate-90' : ''} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

function BestTimeCard() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="pench-best-time-title">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <CalendarDays size={21} aria-hidden="true" />
        </span>
        <h2 id="pench-best-time-title" className="font-display text-xl font-bold text-emerald-950">Best Time to Visit</h2>
      </div>
      <p className="mt-5 font-display text-2xl font-bold text-emerald-900">October to June</p>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">
        Seasonal conditions and park access can vary. Visitors should verify current official park schedules before planning their trip.
      </p>
      <figure className="mt-5">
        <img
          src={IMAGES.landscape}
          alt="Morning light over a woodland stream in Pench National Park"
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full rounded-xl object-cover"
        />
        <PhotoCredit author="Dr Dinesh Bisen IRS" file="Landscape_at_Pench.jpg" className="mt-1.5 px-1" />
      </figure>
    </section>
  )
}

function QuickInfoCard() {
  const rows = [
    { icon: MapPin, label: 'Location', value: 'Madhya Pradesh, India' },
    { icon: Compass, label: 'Region', value: 'Seoni & Chhindwara' },
    { icon: PawPrint, label: 'Known For', value: 'Tigers, Forests & Wildlife' },
    { icon: Plane, label: 'Nearest Major Airport', value: 'Nagpur' },
    { icon: Camera, label: 'Experience', value: 'Wildlife, Nature, Photography & Safari' },
  ]

  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="pench-quick-info-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <MapPin size={21} aria-hidden="true" />
        </span>
        <h2 id="pench-quick-info-title" className="font-display text-xl font-bold text-emerald-950">Quick Info</h2>
      </div>
      <dl className="divide-y divide-emerald-100">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3 py-3 first:pt-1 last:pb-1">
            <Icon size={19} className="mt-0.5 shrink-0 text-emerald-800" aria-hidden="true" />
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">{label}</dt>
              <dd className="mt-0.5 text-sm leading-snug text-navy-800">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}

function NearbyAttractions() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm md:col-span-2 lg:col-span-1 sm:p-6" aria-labelledby="pench-nearby-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <Mountain size={21} aria-hidden="true" />
        </span>
        <h2 id="pench-nearby-title" className="font-display text-xl font-bold text-emerald-950">Nearby Attractions</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {NEARBY_ATTRACTIONS.map(({ name, image, alt, credit }) => (
          <article key={name} className="group min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden bg-emerald-50">
              <img
                src={image}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="min-h-[72px] px-2 pb-2.5">
              <h3 className="flex min-h-9 items-center justify-center pt-1 text-center text-xs font-semibold leading-tight text-navy-900 sm:text-sm">{name}</h3>
              <PhotoCredit {...credit} className="text-center" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function VisitInformation() {
  return (
    <section className="bg-[#f7f9f5] py-10 sm:py-12" aria-label="Pench visitor information and nearby attractions">
      <div className="container-wide grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:items-stretch">
        <BestTimeCard />
        <QuickInfoCard />
        <NearbyAttractions />
      </div>
    </section>
  )
}

function PenchCallToAction() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="pench-cta-title">
      <img
        src={IMAGES.cta}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#11160e]/85 via-[#142014]/65 to-[#18170e]/55" aria-hidden="true" />
      <div className="relative container-wide flex min-h-[340px] flex-col items-start justify-center py-12 pb-16 text-white sm:min-h-[370px]">
        <h2 id="pench-cta-title" className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Experience the Untamed Beauty of<br className="hidden sm:block" /> Pench National Park
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          Jungles, wildlife and unforgettable natural experiences await you.
        </p>
        <Link
          to="/india/wildlife-destinations"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-sm font-bold text-navy-950 shadow-lg transition-colors hover:bg-gold-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-950 sm:w-auto"
        >
          Explore More Wildlife Destinations <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <PhotoCredit
        author="Graf orlok2004"
        file="Pench_Sunset.jpg"
        className="absolute bottom-2 right-4 rounded bg-black/35 px-2 py-1 text-right text-white/90 sm:right-8"
      />
    </section>
  )
}

export default function PenchNationalParkPage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead
        title="Pench National Park, Madhya Pradesh | TravelVista"
        description="Explore Pench National Park in Madhya Pradesh, its tigers, diverse wildlife, river landscapes, safari zones and visitor information."
        keywords="Pench National Park, Madhya Pradesh, Pench Tiger Reserve, tiger, wildlife, Seoni, Chhindwara"
      />
      <PenchHero />
      <FeatureStrip />
      <AboutPench />
      <KeyHighlights />
      <WildlifeGallery />
      <SafariExperience />
      <VisitInformation />
      <PenchCallToAction />
    </div>
  )
}
