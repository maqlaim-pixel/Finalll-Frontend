import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Car,
  ChevronRight,
  Compass,
  Landmark,
  Leaf,
  MapPin,
  Mountain,
  PawPrint,
  Plane,
  Quote,
  TrainFront,
  TreePine,
  Trees,
  Waves,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'

const WIKIMEDIA = 'https://upload.wikimedia.org/wikipedia/commons'
const COMMONS = 'https://commons.wikimedia.org/wiki/File:'
const CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0/'

const IMAGES = {
  hero: `${WIKIMEDIA}/thumb/4/49/Bengal_Tiger_at_Jim_Corbett_National_Park.jpg/1920px-Bengal_Tiger_at_Jim_Corbett_National_Park.jpg`,
  corbettView: `${WIKIMEDIA}/thumb/0/0f/Corbett_View.jpg/1280px-Corbett_View.jpg`,
  dhikala: `${WIKIMEDIA}/thumb/d/d4/20091116_JCNP_DhikalaZone_023.jpg/1280px-20091116_JCNP_DhikalaZone_023.jpg`,
  tiger: `${WIKIMEDIA}/thumb/4/49/Bengal_Tiger_at_Jim_Corbett_National_Park.jpg/960px-Bengal_Tiger_at_Jim_Corbett_National_Park.jpg`,
  leopard: `${WIKIMEDIA}/thumb/e/e3/Leopard_in_Jim_Corbett_National_Park.jpg/960px-Leopard_in_Jim_Corbett_National_Park.jpg`,
  elephant: `${WIKIMEDIA}/thumb/6/6a/Asian_Elephants%2C_Jim_Corbett_National_Park.jpg/960px-Asian_Elephants%2C_Jim_Corbett_National_Park.jpg`,
  chital: `${WIKIMEDIA}/thumb/5/57/089_Chital_in_Jim_Corbett_National_Park_Photo_by_Giles_Laurent.jpg/960px-089_Chital_in_Jim_Corbett_National_Park_Photo_by_Giles_Laurent.jpg`,
  sambar: `${WIKIMEDIA}/thumb/1/1c/Grace_of_corbett_national_park_-1.jpg/960px-Grace_of_corbett_national_park_-1.jpg`,
  bear: `${WIKIMEDIA}/thumb/f/fc/Wildlife_of_Jim_Corbett_National_Park.jpg/960px-Wildlife_of_Jim_Corbett_National_Park.jpg`,
  gharial: `${WIKIMEDIA}/2/2c/Crocodile_in_Corbett_National_Park%2C_India.jpg`,
  bird: `${WIKIMEDIA}/thumb/5/54/Small_Blue_Kingfisher.jpg/960px-Small_Blue_Kingfisher.jpg`,
  safari: `${WIKIMEDIA}/thumb/a/a3/The_Corbett_safari.jpg/1280px-The_Corbett_safari.jpg`,
  river: `${WIKIMEDIA}/thumb/9/9e/Kosi_River_by_the_Sides_of_Jim_Corbett.jpg/1280px-Kosi_River_by_the_Sides_of_Jim_Corbett.jpg`,
  waterfall: `${WIKIMEDIA}/thumb/9/95/Corbett_Waterfalls.jpg/960px-Corbett_Waterfalls.jpg`,
  cta: `${WIKIMEDIA}/thumb/9/9e/Kosi_River_by_the_Sides_of_Jim_Corbett.jpg/1920px-Kosi_River_by_the_Sides_of_Jim_Corbett.jpg`,
}

const HERO_FEATURES = [
  { icon: PawPrint, label: 'India’s Oldest National Park' },
  { icon: Trees, label: 'Rich Flora & Fauna' },
  { icon: Camera, label: 'Excellent Wildlife Photography' },
  { icon: Mountain, label: 'Scenic Landscapes & River Belts' },
  { icon: Compass, label: 'Safari Experiences' },
]

const HIGHLIGHTS = [
  { icon: PawPrint, label: 'Famous for Bengal Tigers' },
  { icon: Leaf, label: 'Rich Biodiversity & Birdlife' },
  { icon: Waves, label: 'Stunning Landscapes & River Views' },
  { icon: Trees, label: 'Perfect for Nature & Photography Lovers' },
  { icon: Car, label: 'Jeep Safari Experiences' },
]

const WILDLIFE = [
  {
    name: 'Bengal Tiger',
    image: IMAGES.tiger,
    alt: 'Bengal tigress in Jim Corbett National Park',
    credit: { author: 'Rito1987', file: 'Bengal_Tiger_at_Jim_Corbett_National_Park.jpg' },
  },
  {
    name: 'Leopard',
    image: IMAGES.leopard,
    alt: 'Leopard in Jim Corbett National Park',
    credit: { author: 'Amankr3081', file: 'Leopard_in_Jim_Corbett_National_Park.jpg' },
  },
  {
    name: 'Asian Elephant',
    image: IMAGES.elephant,
    alt: 'Asian elephants in Jim Corbett National Park',
    credit: { author: 'Jayakumar HG', file: 'Asian_Elephants,_Jim_Corbett_National_Park.jpg' },
  },
  {
    name: 'Chital (Spotted Deer)',
    image: IMAGES.chital,
    alt: 'Chital deer in Jim Corbett National Park',
    credit: { author: 'Giles Laurent', file: '089_Chital_in_Jim_Corbett_National_Park_Photo_by_Giles_Laurent.jpg', attribution: '© Giles Laurent, gileslaurent.com, License CC BY-SA' },
  },
  {
    name: 'Sambar',
    image: IMAGES.sambar,
    alt: 'Female sambar deer in Corbett National Park',
    credit: { author: 'Mohsinsayyedn', file: 'Grace_of_corbett_national_park_-1.jpg' },
  },
  {
    name: 'Sloth Bear',
    image: IMAGES.bear,
    alt: 'Sloth bears in the forest thickets of Jim Corbett National Park',
    credit: { author: 'Sruthijp96', file: 'Wildlife_of_Jim_Corbett_National_Park.jpg' },
  },
  {
    name: 'Gharial',
    image: IMAGES.gharial,
    alt: 'Crocodile in Corbett National Park',
    credit: { author: 'Dushyantparasher', file: 'Crocodile_in_Corbett_National_Park,_India.jpg' },
  },
  {
    name: 'Bird Watching',
    image: IMAGES.bird,
    alt: 'Small blue kingfisher in the Dhikala division of Jim Corbett National Park',
    credit: { author: 'Sankara Subramanian', file: 'Small_Blue_Kingfisher.jpg', license: 'CC BY 2.0', licenseHref: 'https://creativecommons.org/licenses/by/2.0/' },
  },
]

const NEARBY_ATTRACTIONS = [
  {
    name: 'Dhikala Zone',
    image: IMAGES.dhikala,
    alt: 'Forest landscape within the Dhikala Zone of Jim Corbett National Park',
    credit: { author: 'Ashok.delhi17', file: '20091116_JCNP_DhikalaZone_023.jpg' },
  },
  {
    name: 'Kosi River',
    image: IMAGES.river,
    alt: 'Kosi River flowing through the Corbett landscape near Ramnagar',
    credit: { author: 'Himanshu.engin', file: 'Kosi_River_by_the_Sides_of_Jim_Corbett.jpg' },
  },
  {
    name: 'Corbett Waterfall',
    image: IMAGES.waterfall,
    alt: 'Corbett Waterfall near Ramnagar, Uttarakhand',
    credit: { author: 'Akarsh Kandpal', file: 'Corbett_Waterfalls.jpg' },
  },
]

function PhotoCredit({ author, file, license = 'CC BY-SA 4.0', licenseHref = CC_BY_SA, attribution, className = '' }) {
  return (
    <p className={`text-[10px] leading-snug text-slate-500 ${className}`}>
      Photo: <a href={`${COMMONS}${file}`} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600">{attribution || `${author} / Wikimedia Commons`}</a>
      {' · '}
      <a href={licenseHref} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600">{license}</a>
      {' · cropped'}
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

function JimCorbettHero() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="jim-corbett-page-title">
      <img
        src={IMAGES.hero}
        alt="Bengal tigress on a forest path in Jim Corbett National Park"
        className="absolute inset-0 h-full w-full object-cover object-[64%_center]"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#10140d]/95 via-[#172014]/78 to-[#1b2113]/20" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" aria-hidden="true" />

      <div className="container-wide relative flex min-h-[520px] items-center py-10 sm:min-h-[490px] lg:min-h-[470px]">
        <div className="max-w-3xl">
          <Breadcrumb light items={[
            { label: 'India', href: '/india' },
            { label: 'National Parks' },
            { label: 'Jim Corbett National Park' },
          ]} />
          <h1 id="jim-corbett-page-title" className="font-display text-5xl font-bold leading-[0.98] text-white drop-shadow sm:text-6xl lg:text-7xl">
            <span className="block">Jim Corbett</span>
            <span className="block text-gold-400">National Park</span>
          </h1>
          <p className="mt-5 font-display text-xl font-bold text-white sm:text-2xl">
            India’s First National Park
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base sm:leading-7">
            Jim Corbett National Park, located in Uttarakhand, is one of India’s best-known wildlife destinations.
            Its forest landscapes, river systems and diverse wildlife offer visitors a memorable nature experience.
            It is historically significant as India’s first national park and forms an important part of the Corbett landscape.
          </p>
        </div>
      </div>
      <PhotoCredit
        author="Rito1987"
        file="Bengal_Tiger_at_Jim_Corbett_National_Park.jpg"
        className="absolute bottom-2 right-4 rounded bg-black/45 px-2 py-1 text-right text-white/90 sm:right-8"
      />
    </section>
  )
}

function FeatureStrip() {
  return (
    <section className="border-b border-orange-100 bg-[#fcfaf6] py-5 sm:py-6" aria-label="Jim Corbett feature highlights">
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

function JimCorbettQuote() {
  return (
    <aside className="relative isolate flex min-h-[270px] flex-col justify-between overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-[#fbf8ee] via-[#f5f3e8] to-[#e9eddd] p-6 shadow-sm md:col-span-2 lg:col-span-1 sm:p-7" aria-label="A thought about Jim Corbett National Park">
      <Quote size={30} className="relative text-emerald-950" fill="currentColor" aria-hidden="true" />
      <blockquote className="relative mt-3 font-display text-2xl font-semibold italic leading-snug text-emerald-950">
        “In the heart of the wild, Jim Corbett tells a timeless story of nature, adventure and conservation.”
      </blockquote>
      <div className="relative mt-4 flex items-center justify-between text-amber-900/80" aria-hidden="true">
        <PawPrint size={25} fill="currentColor" />
        <TreePine size={35} />
      </div>
      <svg className="absolute inset-x-0 bottom-0 -z-10 h-20 w-full text-[#d7dec7]/75" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 55 Q55 18 112 54 T230 48 T400 36 V90 H0Z" fill="currentColor" />
        <path d="M0 70 Q85 38 160 67 T300 57 T400 65 V90 H0Z" fill="currentColor" opacity="0.72" />
      </svg>
    </aside>
  )
}

function AboutJimCorbett() {
  return (
    <section className="bg-gradient-to-b from-white to-[#fbfaf7] py-10 sm:py-12 lg:py-14" aria-labelledby="about-jim-corbett-title">
      <div className="container-wide grid min-w-0 items-center gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(235px,0.72fr)] lg:gap-7">
        <figure className="min-w-0">
          <img
            src={IMAGES.corbettView}
            alt="Forest and river landscape inside Jim Corbett National Park"
            loading="lazy"
            decoding="async"
            className="h-full min-h-[250px] max-h-[350px] w-full rounded-2xl object-cover shadow-md"
          />
          <PhotoCredit author="netlancer2006" file="Corbett_View.jpg" license="CC BY 2.0" licenseHref="https://creativecommons.org/licenses/by/2.0/" className="mt-1.5 px-1" />
        </figure>
        <div>
          <SectionHeading id="about-jim-corbett-title" title="About Jim Corbett National Park" />
          <div className="mt-4 space-y-4 text-sm leading-7 text-navy-700 sm:text-[15px]">
            <p>
              Jim Corbett National Park is located in Uttarakhand and is recognised as India’s first national park.
              Established in 1936, the protected area was later named in memory of naturalist and conservationist Jim Corbett.
            </p>
            <p>
              The park forms part of the wider Corbett Tiger Reserve landscape, with forests, grasslands, river belts
              and diverse natural habitats.
            </p>
            <p>
              Its wildlife includes Bengal tigers, Asian elephants, leopards, deer, sloth bears and a rich variety of birdlife.
            </p>
          </div>
        </div>
        <JimCorbettQuote />
      </div>
    </section>
  )
}

function KeyHighlights() {
  return (
    <section className="border-y border-emerald-100/80 bg-[#f6f8f4] py-9 sm:py-11" aria-labelledby="jim-corbett-highlights-title">
      <div className="container-wide">
        <SectionHeading id="jim-corbett-highlights-title" title="Key Highlights" className="mb-5" />
        <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0" aria-label="Jim Corbett National Park highlights">
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
    <section className="py-9 sm:py-11" aria-labelledby="jim-corbett-wildlife-title">
      <div className="container-wide">
        <SectionHeading id="jim-corbett-wildlife-title" title="Wildlife at Jim Corbett" className="mb-6" />
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
                <PhotoCredit {...credit} className="mt-1 text-center" />
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
    <section className="border-y border-emerald-100 bg-[#fbfaf7] py-10 sm:py-12" aria-labelledby="jim-corbett-safari-title">
      <div className="container-wide grid min-w-0 items-center gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(230px,0.8fr)]">
        <div>
          <SectionHeading id="jim-corbett-safari-title" title="Safari Experience" />
          <p className="mt-4 text-sm leading-7 text-navy-700 sm:text-[15px]">
            Explore the wilderness of Jim Corbett through its forest landscapes and safari experience. The region
            contains multiple tourism zones with forests, grasslands, river belts and diverse wildlife habitats.
          </p>
        </div>
        <figure className="min-w-0">
          <img
            src={IMAGES.safari}
            alt="A jeep travelling along a forest trail during a morning safari in Jim Corbett National Park"
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full rounded-2xl object-cover shadow-md"
          />
          <PhotoCredit author="Dushyant Kaushik" file="The_Corbett_safari.jpg" className="mt-1.5 px-1" />
        </figure>
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-[#fff9eb] to-[#f7f0e2] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Car size={28} className="shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <h3 className="font-display text-xl font-bold text-emerald-950">Safari Zones</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">
                Corbett has multiple tourism zones, each with its own forest landscapes and wildlife habitats.
              </p>
            </div>
          </div>
          <div id="jim-corbett-safari-zones-details" hidden={!zonesExpanded} className="mt-4 border-t border-orange-200 pt-4 text-sm leading-relaxed text-navy-700">
            <p>Well-known zones include:</p>
            <ul className="mt-2 flex flex-wrap gap-2" aria-label="Jim Corbett tourism zones">
              {['Dhikala', 'Bijrani', 'Jhirna', 'Dhela', 'Durga Devi'].map(zone => (
                <li key={zone} className="rounded-full bg-white/80 px-3 py-1 font-medium text-emerald-900">{zone}</li>
              ))}
            </ul>
            <p className="mt-3">Zone access and seasonal opening schedules can vary. Check current official park information before planning a visit.</p>
          </div>
          <button
            type="button"
            aria-expanded={zonesExpanded}
            aria-controls="jim-corbett-safari-zones-details"
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
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="jim-corbett-best-time-title">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <CalendarDays size={21} aria-hidden="true" />
        </span>
        <h2 id="jim-corbett-best-time-title" className="font-display text-xl font-bold text-emerald-950">Best Time to Visit</h2>
      </div>
      <p className="mt-5 font-display text-2xl font-bold text-emerald-900">November to June</p>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">
        Visitor access and seasonal conditions vary across different areas of the park. Some zones may have different seasonal opening schedules.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-navy-600">
        Visitors should verify current official park information before planning their trip.
      </p>
      <figure className="mt-5">
        <img
          src={IMAGES.river}
          alt="Kosi River and forest landscape beside Jim Corbett National Park"
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full rounded-xl object-cover"
        />
        <PhotoCredit author="Himanshu.engin" file="Kosi_River_by_the_Sides_of_Jim_Corbett.jpg" className="mt-1.5 px-1" />
      </figure>
    </section>
  )
}

function QuickInfoCard() {
  const rows = [
    { icon: MapPin, label: 'Location', value: 'Uttarakhand, India' },
    { icon: PawPrint, label: 'Known For', value: 'Bengal Tigers, Elephants, Forests & River Landscapes' },
    { icon: Landmark, label: 'National Park Established', value: '1936' },
    { icon: Camera, label: 'Experience', value: 'Wildlife, Nature, Photography & Safari' },
  ]

  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="jim-corbett-quick-info-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <MapPin size={21} aria-hidden="true" />
        </span>
        <h2 id="jim-corbett-quick-info-title" className="font-display text-xl font-bold text-emerald-950">Quick Info</h2>
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
      <div className="mt-4 border-t border-emerald-100 pt-2" aria-label="How to reach Jim Corbett">
        <h3 className="font-display text-base font-bold text-emerald-950">How to Reach</h3>
        <dl className="mt-2 space-y-2 text-sm text-navy-700">
          <div><dt className="inline font-semibold text-navy-900">Nearest Airport: </dt><dd className="inline">Pantnagar</dd></div>
          <div className="flex gap-1.5">
            <TrainFront size={16} className="mt-0.5 shrink-0 text-emerald-800" aria-hidden="true" />
            <div><dt className="inline font-semibold text-navy-900">Nearest Railway Station: </dt><dd className="inline">Ramnagar</dd></div>
          </div>
          <div><dt className="font-semibold text-navy-900">By Road</dt><dd className="mt-0.5 leading-relaxed">Ramnagar is connected by road with major cities and towns in Uttarakhand and nearby regions.</dd></div>
        </dl>
      </div>
    </section>
  )
}

function NearbyAttractions() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm md:col-span-2 lg:col-span-1 sm:p-6" aria-labelledby="jim-corbett-nearby-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <Mountain size={21} aria-hidden="true" />
        </span>
        <h2 id="jim-corbett-nearby-title" className="font-display text-xl font-bold text-emerald-950">Nearby Attractions</h2>
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
    <section className="bg-[#f7f9f5] py-10 sm:py-12" aria-label="Jim Corbett visitor information and nearby attractions">
      <div className="container-wide grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:items-stretch">
        <BestTimeCard />
        <QuickInfoCard />
        <NearbyAttractions />
      </div>
    </section>
  )
}

function JimCorbettCallToAction() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="jim-corbett-cta-title">
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
        <h2 id="jim-corbett-cta-title" className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Discover the Wild Beauty of<br className="hidden sm:block" /> Jim Corbett National Park
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          Witness remarkable wildlife, diverse landscapes and the natural beauty of India’s first national park.
        </p>
        <Link
          to="/india/wildlife-destinations"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-sm font-bold text-navy-950 shadow-lg transition-colors hover:bg-gold-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-950 sm:w-auto"
        >
          Explore More Wildlife Destinations <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <PhotoCredit
        author="Himanshu.engin"
        file="Kosi_River_by_the_Sides_of_Jim_Corbett.jpg"
        className="absolute bottom-2 right-4 rounded bg-black/40 px-2 py-1 text-right text-white/90 sm:right-8"
      />
    </section>
  )
}

export default function JimCorbettNationalParkPage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead
        title="Jim Corbett National Park, Uttarakhand | TravelVista"
        description="Explore Jim Corbett National Park in Uttarakhand, India’s first national park, with Bengal tigers, elephants, forests, river landscapes, safari zones and visitor information."
        keywords="Jim Corbett National Park, Uttarakhand, Bengal tiger, Corbett Tiger Reserve, Ramnagar, wildlife"
      />
      <JimCorbettHero />
      <FeatureStrip />
      <AboutJimCorbett />
      <KeyHighlights />
      <WildlifeGallery />
      <SafariExperience />
      <VisitInformation />
      <JimCorbettCallToAction />
    </div>
  )
}
