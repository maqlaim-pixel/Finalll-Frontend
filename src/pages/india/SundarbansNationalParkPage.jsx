import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Car,
  ChevronRight,
  Landmark,
  Leaf,
  MapPin,
  PawPrint,
  Plane,
  Quote,
  Ship,
  TrainFront,
  Trees,
  Waves,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'

const WIKIMEDIA = 'https://upload.wikimedia.org/wikipedia/commons'
const COMMONS = 'https://commons.wikimedia.org/wiki/File:'
const CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0/'
const CC_BY_2 = 'https://creativecommons.org/licenses/by/2.0/'
const CC_BY_4 = 'https://creativecommons.org/licenses/by/4.0/'

const IMAGES = {
  tiger: `${WIKIMEDIA}/thumb/d/d7/Sundarbans_Tigress_West_Bengal_10.jpg/1280px-Sundarbans_Tigress_West_Bengal_10.jpg`,
  mangroveCreek: `${WIKIMEDIA}/thumb/2/28/Creeks_of_Sundarbans.jpg/1280px-Creeks_of_Sundarbans.jpg`,
  boatSafari: `${WIKIMEDIA}/thumb/a/a7/Early_Morning_Sunderbans_Safari_%2837610967564%29.jpg/1280px-Early_Morning_Sunderbans_Safari_%2837610967564%29.jpg`,
  spottedDeer: `${WIKIMEDIA}/thumb/0/00/Spotted_Deer_at_Sundarbans_14.jpg/960px-Spotted_Deer_at_Sundarbans_14.jpg`,
  crocodile: `${WIKIMEDIA}/thumb/5/53/Saltwater_crocodile_in_Sundarbans_National_Park_September_2024_by_Tisha_Mukherjee_02.jpg/960px-Saltwater_crocodile_in_Sundarbans_National_Park_September_2024_by_Tisha_Mukherjee_02.jpg`,
  wildBoar: `${WIKIMEDIA}/thumb/c/c3/Wild_boar_%2823700303546%29.jpg/960px-Wild_boar_%2823700303546%29.jpg`,
  fishingCat: `${WIKIMEDIA}/9/98/Fishing_Cat_in_Sundarban%2C_West_Bengal%2C_India.jpg`,
  mangroveBird: `${WIKIMEDIA}/thumb/1/12/BLACK_CAPPED_KINGFISHER.jpg/960px-BLACK_CAPPED_KINGFISHER.jpg`,
  waterMonitor: `${WIKIMEDIA}/thumb/f/f6/Water_monitor_lizard_of_sunerbans.jpg/960px-Water_monitor_lizard_of_sunerbans.jpg`,
  mudskipper: `${WIKIMEDIA}/thumb/f/f3/Mudskipper_in_Sundarans.jpg/960px-Mudskipper_in_Sundarans.jpg`,
  sunset: `${WIKIMEDIA}/thumb/4/40/Sunset_of_Sundarban.jpg/1280px-Sunset_of_Sundarban.jpg`,
  sajnekhali: `${WIKIMEDIA}/thumb/8/80/Sajnekhali_wildlife_sanctuary_and_others_part_of_Sundarbans_04.jpg/960px-Sajnekhali_wildlife_sanctuary_and_others_part_of_Sundarbans_04.jpg`,
  sudhanyakhali: `${WIKIMEDIA}/thumb/f/f1/Forest_near_Sudhanyakhali_Camp_Sundarbans_National_Park_in_India.jpg/960px-Forest_near_Sudhanyakhali_Camp_Sundarbans_National_Park_in_India.jpg`,
  dobanki: `${WIKIMEDIA}/thumb/5/5c/Dobanki_Camp_Entry_Gate_Jetty%2C_Sundarban_Tiger_Reserve%2C_West_Bengal%2C_India_03.jpg/960px-Dobanki_Camp_Entry_Gate_Jetty%2C_Sundarban_Tiger_Reserve%2C_West_Bengal%2C_India_03.jpg`,
  cta: `${WIKIMEDIA}/thumb/9/90/Sunset_%26_the_River_at_Satjelia_in_Sunderbans_%2838294965772%29.jpg/1920px-Sunset_%26_the_River_at_Satjelia_in_Sunderbans_%2838294965772%29.jpg`,
}

const HERO_FEATURES = [
  { icon: PawPrint, label: 'Home of Royal Bengal Tiger' },
  { icon: Trees, label: 'World-Famous Mangrove Ecosystem' },
  { icon: Leaf, label: 'Unique Flora & Fauna' },
  { icon: Ship, label: 'Exciting Boat Safari Experience' },
  { icon: Landmark, label: 'UNESCO World Heritage Significance' },
]

const HIGHLIGHTS = [
  { icon: PawPrint, label: 'Royal Bengal Tiger Habitat' },
  { icon: Trees, label: 'Remarkable Mangrove Ecosystem' },
  { icon: Camera, label: 'Rich Birdlife & Biodiversity' },
  { icon: Ship, label: 'Scenic Boat Safaris through Creeks' },
  { icon: Waves, label: 'Unique Ecosystem of Islands & Rivers' },
]

const WILDLIFE = [
  {
    name: 'Royal Bengal Tiger',
    image: IMAGES.tiger,
    alt: 'Royal Bengal tigress in the mangroves of Sundarbans National Park',
    credit: { author: 'Dr. Raju Kasambe', file: 'Sundarbans Tigress West Bengal 10.jpg' },
  },
  {
    name: 'Spotted Deer',
    image: IMAGES.spottedDeer,
    alt: 'Spotted deer photographed in the Sundarbans',
    credit: { author: 'Fabian Roudra Baroi', file: 'Spotted Deer at Sundarbans 14.jpg' },
  },
  {
    name: 'Saltwater Crocodile',
    image: IMAGES.crocodile,
    alt: 'Saltwater crocodile in Sundarbans National Park, West Bengal',
    credit: { author: 'Tisha Mukherjee', file: 'Saltwater crocodile in Sundarbans National Park September 2024 by Tisha Mukherjee 02.jpg' },
  },
  {
    name: 'Wild Boar',
    image: IMAGES.wildBoar,
    alt: 'Wild boar photographed on Sajnekhali Island in Sundarbans National Park',
    credit: { author: 'juggadery', file: 'Wild boar (23700303546).jpg', license: 'CC BY 2.0', licenseHref: CC_BY_2 },
  },
  {
    name: 'Fishing Cat',
    image: IMAGES.fishingCat,
    alt: 'Fishing cat photographed in the Indian Sundarbans',
    credit: { author: 'Soumyajit Nandy', file: 'Fishing Cat in Sundarban, West Bengal, India.jpg' },
  },
  {
    name: 'Mangrove Birds',
    image: IMAGES.mangroveBird,
    alt: 'Black-capped kingfisher photographed in the Sundarbans',
    credit: { author: 'Tarunjyoti Tewari', file: 'BLACK CAPPED KINGFISHER.jpg' },
  },
  {
    name: 'Water Monitor Lizard',
    image: IMAGES.waterMonitor,
    alt: 'Water monitor lizard in the Sundarbans',
    credit: { author: 'Photosynthesis85', file: 'Water monitor lizard of sunerbans.jpg' },
  },
  {
    name: 'Mudskipper',
    image: IMAGES.mudskipper,
    alt: 'Mudskipper on a Sundarbans mudflat',
    credit: { author: 'Syedabbas321', file: 'Mudskipper in Sundarans.jpg' },
  },
]

const NEARBY_ATTRACTIONS = [
  {
    name: 'Sajnekhali',
    image: IMAGES.sajnekhali,
    alt: 'Sajnekhali wildlife sanctuary in the Sundarbans, West Bengal',
    credit: { author: 'Pinakpani', file: 'Sajnekhali wildlife sanctuary and others part of Sundarbans 04.jpg' },
  },
  {
    name: 'Sudhanyakhali',
    image: IMAGES.sudhanyakhali,
    alt: 'Mangrove forest near Sudhanyakhali Camp in Sundarbans National Park',
    credit: { author: 'Toni Wöhrl and Sang Cai', file: 'Forest near Sudhanyakhali Camp Sundarbans National Park in India.jpg' },
  },
  {
    name: 'Dobanki',
    image: IMAGES.dobanki,
    alt: 'Dobanki Camp entry and jetty in Sundarban Tiger Reserve',
    credit: { author: 'Kingshuk Mondal', file: 'Dobanki Camp Entry Gate Jetty, Sundarban Tiger Reserve, West Bengal, India 03.jpg', license: 'CC BY 4.0', licenseHref: CC_BY_4 },
  },
]

function PhotoCredit({ author, file, license = 'CC BY-SA 4.0', licenseHref = CC_BY_SA, className = '' }) {
  const fileUrl = `${COMMONS}${encodeURIComponent(file).replace(/%20/g, '_')}`

  return (
    <p className={`text-[10px] leading-snug text-slate-500 ${className}`}>
      Photo: <a href={fileUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600">{author} / Wikimedia Commons</a>
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

function SundarbansHero() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="sundarbans-page-title">
      <img
        src={IMAGES.boatSafari}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[67%_center]"
        fetchpriority="high"
      />
      <img
        src={IMAGES.tiger}
        alt="Royal Bengal tigress in the mangrove habitat of Sundarbans National Park"
        className="absolute inset-y-0 right-0 h-full w-[58%] object-cover object-[53%_center] sm:w-[53%] lg:w-[48%]"
        style={{ maskImage: 'linear-gradient(90deg, transparent 0%, black 22%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 22%)' }}
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07150d]/95 via-[#0a1c12]/85 to-[#0b1c12]/25" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07150d]/65 via-transparent to-black/15" aria-hidden="true" />

      <div className="container-wide relative flex min-h-[560px] items-center py-10 sm:min-h-[540px] lg:min-h-[500px]">
        <div className="max-w-2xl">
          <Breadcrumb light items={[
            { label: 'India', href: '/india' },
            { label: 'National Parks' },
            { label: 'Sundarbans National Park' },
          ]} />
          <h1 id="sundarbans-page-title" className="font-display text-4xl font-bold leading-[0.98] text-white drop-shadow sm:text-5xl lg:text-7xl">
            <span className="block">Sundarbans</span>
            <span className="block text-gold-400">National Park</span>
          </h1>
          <p className="mt-5 font-display text-xl font-bold text-white sm:text-2xl">
            World’s Largest Mangrove Forest
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base sm:leading-7">
            Sundarbans National Park, located in West Bengal, is part of the vast Sundarbans mangrove ecosystem and is renowned for its tidal waterways, mangrove forests, rich biodiversity, and Royal Bengal Tiger habitat. Its remarkable landscape of rivers, creeks, islands and mangroves creates one of India’s most distinctive wildlife experiences.
          </p>
        </div>
      </div>
      <div className="absolute bottom-2 right-4 rounded bg-black/45 px-2 py-1 text-right text-white/90 sm:right-8">
        <PhotoCredit
          author="Dr. Raju Kasambe"
          file="Sundarbans Tigress West Bengal 10.jpg"
          className="text-white/90"
        />
        <PhotoCredit
          author="Ankur P"
          file="Early Morning Sunderbans Safari (37610967564).jpg"
          license="CC BY 2.0"
          licenseHref={CC_BY_2}
          className="text-white/90"
        />
      </div>
    </section>
  )
}

function FeatureStrip() {
  return (
    <section className="border-b border-orange-100 bg-[#fcfaf6] py-5 sm:py-6" aria-label="Sundarbans feature highlights">
      <div className="container-wide">
        <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
          {HERO_FEATURES.map(({ icon: Icon, label }, index) => (
            <li key={label} className={`flex min-h-[90px] flex-col items-center justify-center gap-2 px-3 text-center ${index > 0 ? 'lg:border-l lg:border-orange-200' : ''}`}>
              <Icon className="shrink-0 text-amber-900" size={29} strokeWidth={1.8} aria-hidden="true" />
              <span className="max-w-[180px] text-xs font-medium leading-snug text-navy-900 sm:text-sm">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function SundarbansQuote() {
  return (
    <aside className="relative isolate flex min-h-[270px] flex-col justify-between overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-[#fbf8ee] via-[#f5f3e8] to-[#e9eddd] p-6 shadow-sm md:col-span-2 lg:col-span-1 sm:p-7" aria-label="A thought about Sundarbans National Park">
      <Quote size={30} className="relative text-emerald-950" fill="currentColor" aria-hidden="true" />
      <blockquote className="relative mt-3 font-display text-2xl font-semibold italic leading-snug text-emerald-950">
        “Where the rivers meet the sea and tigers rule the tides, Sundarbans tells a story of resilience, wildlife, and nature’s untouched beauty.”
      </blockquote>
      <div className="relative mt-4 flex items-center justify-between text-amber-900/80" aria-hidden="true">
        <PawPrint size={25} fill="currentColor" />
        <Leaf size={35} />
      </div>
      <svg className="absolute inset-x-0 bottom-0 -z-10 h-20 w-full text-[#d7dec7]/75" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 55 Q55 18 112 54 T230 48 T400 36 V90 H0Z" fill="currentColor" />
        <path d="M0 70 Q85 38 160 67 T300 57 T400 65 V90 H0Z" fill="currentColor" opacity="0.72" />
      </svg>
    </aside>
  )
}

function AboutSundarbans() {
  return (
    <section className="bg-gradient-to-b from-white to-[#fbfaf7] py-10 sm:py-12 lg:py-14" aria-labelledby="about-sundarbans-title">
      <div className="container-wide grid min-w-0 items-center gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(235px,0.72fr)] lg:gap-7">
        <figure className="min-w-0">
          <img
            src={IMAGES.mangroveCreek}
            alt="A quiet tidal creek winding between mangroves in the Sundarbans"
            loading="lazy"
            decoding="async"
            className="h-full min-h-[250px] max-h-[350px] w-full rounded-2xl object-cover shadow-md"
          />
          <PhotoCredit author="Ujwala Dahake" file="Creeks of Sundarbans.jpg" license="CC0 1.0" licenseHref="https://creativecommons.org/publicdomain/zero/1.0/" className="mt-1.5 px-1" />
        </figure>
        <div>
          <SectionHeading id="about-sundarbans-title" title="About Sundarbans National Park" />
          <div className="mt-4 space-y-3 text-sm leading-7 text-navy-700 sm:text-[15px]">
            <p>
              Sundarbans National Park forms part of the vast Sundarbans mangrove ecosystem in West Bengal. Its landscape is shaped by tidal waterways, mudflats, islands, creeks and dense mangrove vegetation.
            </p>
            <p>
              The protected ecosystem is internationally significant for its biodiversity and is particularly known as an important habitat of the Royal Bengal Tiger.
            </p>
            <p>
              The region also supports saltwater crocodiles, spotted deer, wild boar, fishing cats, reptiles and a wide variety of resident and migratory birds. Its waterways and mangroves create one of India’s most distinctive natural destinations.
            </p>
          </div>
        </div>
        <SundarbansQuote />
      </div>
    </section>
  )
}

function KeyHighlights() {
  return (
    <section className="border-y border-emerald-100/80 bg-[#f6f8f4] py-9 sm:py-11" aria-labelledby="sundarbans-highlights-title">
      <div className="container-wide">
        <SectionHeading id="sundarbans-highlights-title" title="Key Highlights" className="mb-5" />
        <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0" aria-label="Sundarbans National Park highlights">
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
    <section className="py-9 sm:py-11" aria-labelledby="sundarbans-wildlife-title">
      <div className="container-wide">
        <SectionHeading id="sundarbans-wildlife-title" title="Wildlife at Sundarbans" className="mb-6" />
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
  const [areasExpanded, setAreasExpanded] = useState(false)

  return (
    <section className="border-y border-emerald-100 bg-[#fbfaf7] py-10 sm:py-12" aria-labelledby="sundarbans-safari-title">
      <div className="container-wide grid min-w-0 items-center gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(230px,0.8fr)]">
        <div>
          <SectionHeading id="sundarbans-safari-title" title="Safari Experience" />
          <p className="mt-4 text-sm leading-7 text-navy-700 sm:text-[15px]">
            Explore the distinctive landscape of Sundarbans through boat-based wildlife experiences along tidal waterways, creeks and mangrove forests. These quiet journeys offer a way to experience the riverine landscape and look for birdlife and other wildlife in their natural habitats.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-navy-600">
            Wildlife sightings are not guaranteed; access and tourism operations can vary by season and current reserve guidance.
          </p>
        </div>
        <figure className="min-w-0">
          <img
            src={IMAGES.boatSafari}
            alt="A boat moving through the waterways of the Sundarbans during an early morning safari"
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full rounded-2xl object-cover shadow-md"
          />
          <PhotoCredit author="Ankur P" file="Early Morning Sunderbans Safari (37610967564).jpg" license="CC BY 2.0" licenseHref={CC_BY_2} className="mt-1.5 px-1" />
        </figure>
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-[#fff9eb] to-[#f7f0e2] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Ship size={28} className="shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <h3 className="font-display text-xl font-bold text-emerald-950">Safari Areas / Wildlife Zones</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">
                Sajnekhali, Sudhanyakhali and Dobanki are among the well-known visitor areas associated with the reserve’s waterways and mangrove habitats.
              </p>
            </div>
          </div>
          <div id="sundarbans-safari-areas-details" hidden={!areasExpanded} className="mt-4 border-t border-orange-200 pt-4 text-sm leading-relaxed text-navy-700">
            <p>These places offer different views of the protected landscape, from mangrove creeks and forest edges to visitor viewpoints. Boat routes and access depend on current reserve guidance and seasonal conditions.</p>
            <p className="mt-3 text-xs">This page provides general destination information only; it does not arrange boat trips or reservations.</p>
          </div>
          <button
            type="button"
            aria-expanded={areasExpanded}
            aria-controls="sundarbans-safari-areas-details"
            onClick={() => setAreasExpanded(expanded => !expanded)}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-navy-950 transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
          >
            {areasExpanded ? 'Show Less' : 'Know More'}
            <ChevronRight size={16} className={areasExpanded ? 'rotate-90' : ''} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

function BestTimeCard() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="sundarbans-best-time-title">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <CalendarDays size={21} aria-hidden="true" />
        </span>
        <h2 id="sundarbans-best-time-title" className="font-display text-xl font-bold text-emerald-950">Best Time to Visit</h2>
      </div>
      <p className="mt-5 font-display text-2xl font-bold text-emerald-900">November to February</p>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">
        This period is generally popular for its pleasant weather and wildlife exploration.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-navy-600">
        Seasonal conditions, access and tourism operations may vary. Verify current official information before planning a visit.
      </p>
      <figure className="mt-5">
        <img
          src={IMAGES.sunset}
          alt="Sunset light over the Sundarbans mangrove landscape"
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full rounded-xl object-cover"
        />
        <PhotoCredit author="S.M.M.Musabbir Uddin" file="Sunset of Sundarban.jpg" license="CC BY 4.0" licenseHref={CC_BY_4} className="mt-1.5 px-1" />
      </figure>
    </section>
  )
}

function HowToReachCard() {
  const rows = [
    { icon: Plane, label: 'Nearest Major Airport', value: 'Netaji Subhas Chandra Bose International Airport, Kolkata' },
    { icon: TrainFront, label: 'Nearest Major Railway Connection', value: 'Canning, with rail services from Kolkata' },
    { icon: Car, label: 'By Road & Water', value: 'Travel toward regional access points such as Godkhali or Dhamakhali; onward travel in the Sundarbans is by boat or ferry.' },
  ]

  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="sundarbans-how-to-reach-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <MapPin size={21} aria-hidden="true" />
        </span>
        <h2 id="sundarbans-how-to-reach-title" className="font-display text-xl font-bold text-emerald-950">How to Reach</h2>
      </div>
      <p className="mb-2 text-sm leading-relaxed text-navy-600">Kolkata is the main gateway to the Sundarbans region.</p>
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
      <p className="mt-3 text-xs leading-relaxed text-navy-600">Routes and transport services can change; check current local and official guidance.</p>
    </section>
  )
}

function NearbyAttractions() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm md:col-span-2 lg:col-span-1 sm:p-6" aria-labelledby="sundarbans-nearby-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <Landmark size={21} aria-hidden="true" />
        </span>
        <h2 id="sundarbans-nearby-title" className="font-display text-xl font-bold text-emerald-950">Nearby Attractions</h2>
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
      <p className="mt-3 text-xs leading-relaxed text-navy-600">Visitor access and routes to these areas depend on current reserve guidance.</p>
    </section>
  )
}

function VisitInformation() {
  return (
    <section className="bg-[#f7f9f5] py-10 sm:py-12" aria-label="Sundarbans visitor information and nearby attractions">
      <div className="container-wide grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:items-stretch">
        <BestTimeCard />
        <HowToReachCard />
        <NearbyAttractions />
      </div>
    </section>
  )
}

function SundarbansCallToAction() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="sundarbans-cta-title">
      <img
        src={IMAGES.cta}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07150d]/90 via-[#102016]/70 to-[#102016]/25" aria-hidden="true" />
      <div className="relative container-wide flex min-h-[340px] flex-col items-start justify-center py-12 pb-16 text-white sm:min-h-[370px]">
        <h2 id="sundarbans-cta-title" className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Experience the Mystical Beauty<br className="hidden sm:block" /> of Sundarbans National Park
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          Discover remarkable mangroves, waterways, wildlife and one of India’s most distinctive natural landscapes.
        </p>
        <Link
          to="/india/wildlife-destinations"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-sm font-bold text-navy-950 shadow-lg transition-colors hover:bg-gold-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-950 sm:w-auto"
        >
          Explore More Wildlife Destinations <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <PhotoCredit
        author="Ankur P"
        file="Sunset & the River at Satjelia in Sunderbans (38294965772).jpg"
        license="CC BY 2.0"
        licenseHref={CC_BY_2}
        className="absolute bottom-2 right-4 rounded bg-black/40 px-2 py-1 text-right text-white/90 sm:right-8"
      />
    </section>
  )
}

export default function SundarbansNationalParkPage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead
        title="Sundarbans National Park, West Bengal | TravelVista"
        description="Explore Sundarbans National Park in West Bengal, its tidal waterways, mangrove ecosystem, Royal Bengal Tigers, wildlife, boat-based safari experience and visitor information."
        keywords="Sundarbans National Park, West Bengal, mangrove forest, Royal Bengal Tiger, boat safari, Sundarbans wildlife"
      />
      <SundarbansHero />
      <FeatureStrip />
      <AboutSundarbans />
      <KeyHighlights />
      <WildlifeGallery />
      <SafariExperience />
      <VisitInformation />
      <SundarbansCallToAction />
    </div>
  )
}
