import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Compass,
  Leaf,
  MapPin,
  PawPrint,
  Quote,
  Trees,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'

const HERO_IMAGE = 'https://res.cloudinary.com/goqz2x1l/image/upload/v1788949125/Queen_Family.jpg'
const LION_IMAGE = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1000&h=760&fit=crop'
const FOREST_IMAGE = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&h=700&fit=crop'
const DEER_IMAGE = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900&h=680&fit=crop'
const BIRD_IMAGE = 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=900&h=680&fit=crop'
const WATER_IMAGE = 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=900&h=680&fit=crop'
const CTA_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1900&h=760&fit=crop'

const HERO_FEATURES = [
  { icon: PawPrint, label: 'Asiatic Lion' },
  { icon: Trees, label: 'Rich Biodiversity & Forests' },
  { icon: Camera, label: 'Wildlife Photography' },
  { icon: Compass, label: 'Nature & Adventure' },
]

const HIGHLIGHTS = [
  { icon: PawPrint, label: 'Asiatic Lion Habitat' },
  { icon: Leaf, label: 'Rich Flora & Fauna' },
  { icon: Camera, label: 'Wildlife Photography' },
  { icon: Compass, label: 'Safari Experiences' },
  { icon: Trees, label: 'Peaceful Natural Surroundings' },
]

const ATTRACTIONS = [
  {
    title: 'Asiatic Lions',
    description: 'Discover Gir’s most iconic wildlife and learn about the conservation of the Asiatic lion.',
    image: HERO_IMAGE,
    alt: 'Asiatic lions in Gir National Park, Gujarat',
  },
  {
    title: 'Wildlife Safari',
    description: 'Experience the forest landscape and observe Gir’s diverse wildlife in its natural surroundings.',
    image: DEER_IMAGE,
    alt: 'Deer among the trees in a wildlife habitat',
  },
  {
    title: 'Bird Watching',
    description: 'Explore Gir’s rich birdlife and enjoy rewarding bird-watching opportunities.',
    image: BIRD_IMAGE,
    alt: 'Bird perched among green foliage',
  },
  {
    title: 'Rivers & Lakes',
    description: 'Discover the rivers, reservoirs and natural water bodies that enrich the Gir landscape.',
    image: WATER_IMAGE,
    alt: 'Waterfall flowing through a green natural landscape',
  },
  {
    title: 'Forest Trails',
    description: 'Experience scenic forest surroundings and the natural beauty of the Gir region.',
    image: FOREST_IMAGE,
    alt: 'Sunlight filtering through a quiet forest trail',
  },
]

const GALLERY = [
  { image: HERO_IMAGE, alt: 'Asiatic lion in Gir National Park' },
  { image: FOREST_IMAGE, alt: 'Forest landscape in Gir, Gujarat' },
  { image: DEER_IMAGE, alt: 'Deer in a forest wildlife habitat' },
  { image: BIRD_IMAGE, alt: 'Bird resting in a natural habitat' },
]

const QUICK_INFO = [
  { icon: MapPin, label: 'Location', value: 'Gujarat, India' },
  { icon: PawPrint, label: 'Known For', value: 'Asiatic Lions & Wildlife' },
  { icon: Compass, label: 'Experience', value: 'Wildlife, Nature & Safari' },
  { icon: Camera, label: 'Ideal For', value: 'Nature Lovers, Wildlife Enthusiasts & Photographers' },
  { icon: CalendarDays, label: 'Best Time', value: 'October to March' },
]

function SectionHeading({ eyebrow, title, centered = false, id }) {
  return (
    <div className={centered ? 'mb-7 text-center' : 'mb-7'}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">{eyebrow}</p>
      )}
      <h2 id={id} className="mt-1 flex items-center gap-3 font-display text-2xl font-bold text-emerald-950 sm:text-3xl">
        {!centered && <span className="h-0.5 w-8 shrink-0 bg-emerald-700" aria-hidden="true" />}
        <span>{title}</span>
      </h2>
    </div>
  )
}

function GirHero() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="gir-page-title">
      <img
        src={HERO_IMAGE}
        alt="Asiatic lions in Gir National Park, Gujarat"
        className="absolute inset-0 h-full w-full object-cover object-[62%_42%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07150d]/95 via-[#0a1c12]/80 to-[#0b1c12]/25" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07150d]/75 via-transparent to-black/10" aria-hidden="true" />

      <div className="container-wide relative flex min-h-[610px] items-center py-10 sm:min-h-[570px] sm:py-12 lg:min-h-[530px]">
        <div className="max-w-3xl">
          <Breadcrumb light items={[{ label: 'India', href: '/india' }, { label: 'Gir National Park' }]} />
          <h1 id="gir-page-title" className="font-display text-5xl font-bold leading-[0.98] text-white drop-shadow sm:text-6xl lg:text-7xl">
            <span className="block">Gir National Park</span>
            <span className="mt-2 block text-gold-400">Gujarat</span>
          </h1>
          <p className="mt-5 font-display text-xl font-bold text-white sm:text-2xl">
            Home to the Majestic Asiatic Lion
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base sm:leading-7">
            Explore the wilderness of Gir National Park, the last natural habitat of the Asiatic lion.
            Experience thrilling safaris, diverse wildlife, and the raw beauty of nature in Gujarat.
          </p>

          <ul className="mt-7 grid max-w-3xl grid-cols-2 gap-x-5 gap-y-4 sm:gap-x-7 md:grid-cols-4" aria-label="Gir National Park experiences">
            {HERO_FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex min-w-0 items-center gap-2.5 border-white/15 sm:border-r sm:pr-3 last:border-r-0">
                <Icon className="shrink-0 text-gold-400" size={25} strokeWidth={1.8} aria-hidden="true" />
                <span className="text-xs font-medium leading-snug text-white sm:text-sm">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function NatureQuoteCard() {
  return (
    <aside className="relative isolate flex min-h-[290px] flex-col justify-between overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#f6f8ec] via-[#eef3e4] to-[#e3edd9] p-6 shadow-sm md:col-span-2 lg:col-span-1 sm:p-7" aria-label="A thought about nature">
      <div className="absolute -right-8 -top-9 h-36 w-36 rounded-full bg-white/40 blur-2xl" aria-hidden="true" />
      <Quote size={30} className="relative text-emerald-900" fill="currentColor" aria-hidden="true" />
      <blockquote className="relative mt-3 font-display text-2xl font-semibold italic leading-snug text-emerald-950">
        “Where the wild roams free and nature tells its most beautiful story.”
      </blockquote>
      <div className="relative mt-4 flex items-center justify-between text-emerald-800/80" aria-hidden="true">
        <PawPrint size={25} fill="currentColor" />
        <Leaf size={36} />
      </div>
      <svg className="absolute inset-x-0 bottom-0 -z-10 h-20 w-full text-emerald-200/65" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 55 Q55 18 112 54 T230 48 T400 36 V90 H0Z" fill="currentColor" />
        <path d="M0 70 Q85 38 160 67 T300 57 T400 65 V90 H0Z" fill="currentColor" opacity="0.72" />
      </svg>
    </aside>
  )
}

function AboutGir() {
  return (
    <section className="bg-gradient-to-b from-white to-[#f8faf6] py-10 sm:py-12 lg:py-14" aria-labelledby="about-gir-title">
      <div className="container-wide grid min-w-0 items-center gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(245px,0.72fr)] lg:gap-7">
        <img
          src={LION_IMAGE}
          alt="Asiatic lion walking through dry forest vegetation"
          loading="lazy"
          decoding="async"
          className="h-full min-h-[260px] max-h-[360px] w-full rounded-2xl object-cover shadow-md"
        />

        <div>
          <SectionHeading id="about-gir-title" title="About Gir National Park" />
          <div className="space-y-4 text-sm leading-7 text-navy-700 sm:text-[15px]">
            <p>
              Gir National Park, located in Gujarat, is globally renowned as the natural home of the Asiatic lion.
              Its dry deciduous forests, grasslands and rugged landscapes support a rich variety of wildlife.
            </p>
            <p>
              The protected Gir landscape offers visitors an opportunity to experience Gujarat’s remarkable
              biodiversity, wildlife and natural scenery.
            </p>
            <p>
              A visit to Gir is more than a wildlife experience — it is a journey into one of India’s most
              distinctive natural landscapes.
            </p>
          </div>
        </div>

        <NatureQuoteCard />
      </div>
    </section>
  )
}

function Highlights() {
  return (
    <section className="border-y border-emerald-100/80 bg-[#f3f7f0] py-9 sm:py-11" aria-labelledby="gir-highlights-title">
      <div className="container-wide">
        <SectionHeading id="gir-highlights-title" title="Key Highlights" />
        <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0" aria-label="Gir National Park highlights">
          {HIGHLIGHTS.map(({ icon: Icon, label }, index) => (
            <li key={label} className={`flex min-h-[94px] flex-col items-center justify-center gap-2 px-3 text-center ${index > 0 ? 'lg:border-l lg:border-emerald-200' : ''}`}>
              <Icon size={30} strokeWidth={1.9} className="text-emerald-800" aria-hidden="true" />
              <span className="max-w-[175px] text-sm font-medium leading-snug text-emerald-950">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Attractions() {
  return (
    <section className="py-10 sm:py-12 lg:py-14" aria-labelledby="gir-attractions-title">
      <div className="container-wide">
        <SectionHeading id="gir-attractions-title" title="Top Attractions" />
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {ATTRACTIONS.map(({ title, description, image, alt }) => (
            <article key={title} className="group min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-emerald-50">
                <img
                  src={image}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-bold text-emerald-950">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function BestTimeCard() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="best-time-title">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <CalendarDays size={21} aria-hidden="true" />
        </span>
        <h2 id="best-time-title" className="font-display text-xl font-bold text-emerald-950">Best Time to Visit</h2>
      </div>
      <p className="mt-5 font-display text-2xl font-bold text-emerald-900">October to March</p>
      <p className="mt-1 text-sm leading-relaxed text-navy-600">
        Pleasant weather and a popular period for exploring the Gir region.
      </p>
      <img
        src={FOREST_IMAGE}
        alt="Green forest landscape in Gujarat"
        loading="lazy"
        decoding="async"
        className="mt-5 aspect-[16/10] w-full rounded-xl object-cover"
      />
    </section>
  )
}

function QuickInfoCard() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="quick-info-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <MapPin size={21} aria-hidden="true" />
        </span>
        <h2 id="quick-info-title" className="font-display text-xl font-bold text-emerald-950">Quick Info</h2>
      </div>
      <dl className="divide-y divide-emerald-100">
        {QUICK_INFO.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3 py-3 first:pt-1 last:pb-1">
            <Icon size={18} className="mt-0.5 shrink-0 text-emerald-800" aria-hidden="true" />
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">{label}</dt>
              <dd className="mt-0.5 text-sm leading-snug text-navy-800">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
      <Link
        to="/india/national-parks/gir-national-park/how-to-reach"
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
      >
        How to Reach Gir National Park <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </section>
  )
}

function GirGallery() {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm md:col-span-2 lg:col-span-1 sm:p-6" aria-labelledby="gir-gallery-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <Camera size={21} aria-hidden="true" />
        </span>
        <h2 id="gir-gallery-title" className="font-display text-xl font-bold text-emerald-950">Gallery</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {GALLERY.map(({ image, alt }) => (
          <figure key={alt} className="group aspect-[4/3] overflow-hidden rounded-xl bg-emerald-50">
            <img
              src={image}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </figure>
        ))}
      </div>
    </section>
  )
}

function VisitInfo() {
  return (
    <section className="bg-[#f7f9f5] py-10 sm:py-12 lg:py-14" aria-label="Visitor information and gallery">
      <div className="container-wide grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.25fr)] lg:items-stretch">
        <BestTimeCard />
        <QuickInfoCard />
        <GirGallery />
      </div>
    </section>
  )
}

function GirCallToAction() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="gir-cta-title">
      <img
        src={CTA_IMAGE}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06150d]/80 via-[#0b1e12]/60 to-[#07160e]/65" aria-hidden="true" />
      <div className="relative container-wide flex min-h-[340px] flex-col items-center justify-center py-12 text-center text-white sm:min-h-[370px]">
        <p className="font-display text-lg font-semibold text-gold-300 sm:text-xl">Plan Your Visit to</p>
        <h2 id="gir-cta-title" className="mt-1 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Gir National Park
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          Experience the wilderness, discover remarkable wildlife, and explore the natural beauty of Gujarat.
        </p>
        <Link
          to="/india/destinations"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-sm font-bold text-navy-950 shadow-lg transition-colors hover:bg-gold-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-950 sm:w-auto"
        >
          Explore More Destinations <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

export default function GirNationalParkPage() {
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

  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead
        title="Gir National Park, Gujarat | TravelVista"
        description="Explore Gir National Park in Gujarat, the natural home of the Asiatic lion. Discover its forests, diverse wildlife, highlights and the best time to visit."
        keywords="Gir National Park, Gujarat, Asiatic lion, Gir wildlife, Gir forest"
      />
      <GirHero />
      <AboutGir />
      <Highlights />
      <Attractions />
      <VisitInfo />
      <GirCallToAction />
    </div>
  )
}
