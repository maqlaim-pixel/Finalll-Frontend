import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Compass,
  Camera,
  Car,
  ChevronRight,
  Landmark,
  Leaf,
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
  hero: 'https://images.unsplash.com/photo-1701368533954-f0dc06ebfbed?w=1900&h=920&fit=crop',
  bandhavgarhLandscape: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Hilly_terrain_of_Bandhavgarh_National_Park_Madhya_Pradesh_India.jpg',
  tiger: 'https://images.unsplash.com/photo-1639141155354-3706f000e3b8?w=1000&h=740&fit=crop',
  leopard: 'https://images.unsplash.com/photo-1496841733162-a88a250a275c?w=700&h=560&fit=crop',
  bear: 'https://images.unsplash.com/photo-1779111370141-4cc5d671be58?w=700&h=560&fit=crop',
  chital: 'https://images.unsplash.com/photo-1761627067698-c7538633d4b6?w=700&h=560&fit=crop',
  sambar: 'https://images.unsplash.com/photo-1607378112100-4c6a10ec4d50?w=700&h=560&fit=crop',
  dhole: 'https://images.unsplash.com/photo-1759346579076-a66600eec63f?w=700&h=560&fit=crop',
  gaur: 'https://images.unsplash.com/photo-1741568813293-0b9ef4371e03?w=700&h=560&fit=crop',
  bird: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Crested_Serpent-Eagle_%28Spilornis_cheela%29%2C_Bandhavgarh_National_Park.jpg/960px-Crested_Serpent-Eagle_%28Spilornis_cheela%29%2C_Bandhavgarh_National_Park.jpg',
  fort: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Fort_Bandhavgarh_National_Park_Madhya_Pradesh_India.jpg',
  sheshShaiya: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Shesh_Shaiya_01.jpg/960px-Shesh_Shaiya_01.jpg',
  heritage: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Ficus_temple.jpg',
  safari: 'https://images.unsplash.com/photo-1730830812275-05d20a099679?w=1100&h=760&fit=crop',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&h=700&fit=crop',
  cta: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Bandhavgarh_National_Park_Morning_Light.jpg',
}

const HERO_FEATURES = [
  { icon: PawPrint, label: 'Royal Bengal Tigers' },
  { icon: Trees, label: 'Rich Biodiversity' },
  { icon: Camera, label: 'Wildlife Photography' },
  { icon: Landmark, label: 'Ancient Bandhavgarh Fort' },
  { icon: Compass, label: 'Safari Experiences' },
]

const HIGHLIGHTS = [
  { icon: PawPrint, label: 'Famous for Royal Bengal Tigers' },
  { icon: Leaf, label: 'Rich Flora & Fauna' },
  { icon: Camera, label: 'Excellent Wildlife Photography' },
  { icon: Landmark, label: 'Ancient Fort & Historical Significance' },
  { icon: Car, label: 'Jeep Safari Experiences' },
]

const WILDLIFE = [
  { name: 'Royal Bengal Tiger', image: IMAGES.tiger, alt: 'Royal Bengal tiger in a forest habitat' },
  { name: 'Leopard', image: IMAGES.leopard, alt: 'Leopard in a natural wildlife habitat' },
  { name: 'Sloth Bear', image: IMAGES.bear, alt: 'Sloth bear among green foliage' },
  { name: 'Spotted Deer (Chital)', image: IMAGES.chital, alt: 'Spotted chital deer in a grassy habitat' },
  { name: 'Sambar', image: IMAGES.sambar, alt: 'Sambar deer among forest greenery' },
  { name: 'Indian Wild Dog (Dhole)', image: IMAGES.dhole, alt: 'Two dholes resting in the grass' },
  { name: 'Indian Gaur', image: IMAGES.gaur, alt: 'Indian gaur in a forest landscape' },
  {
    name: 'Rich Birdlife',
    image: IMAGES.bird,
    alt: 'Crested serpent-eagle in Bandhavgarh National Park',
    credit: {
      author: 'Thomas Fuhrmann',
      source: 'https://commons.wikimedia.org/wiki/File:Crested_Serpent-Eagle_(Spilornis_cheela),_Bandhavgarh_National_Park.jpg',
      license: 'CC BY-SA 4.0',
      licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
  },
]

const NEARBY_ATTRACTIONS = [
  {
    name: 'Bandhavgarh Fort',
    image: IMAGES.fort,
    alt: 'Bandhavgarh Fort in Madhya Pradesh',
    credit: {
      author: 'LRBurdak',
      source: 'https://commons.wikimedia.org/wiki/File:Fort_Bandhavgarh_National_Park_Madhya_Pradesh_India.jpg',
      license: 'CC BY-SA 3.0',
      licenseHref: 'https://creativecommons.org/licenses/by-sa/3.0/',
    },
  },
  {
    name: 'Shesh Shaiya',
    image: IMAGES.sheshShaiya,
    alt: 'Ancient reclining Vishnu statue at Shesh Shaiya in Bandhavgarh',
    credit: {
      author: 'BluesyPete',
      source: 'https://commons.wikimedia.org/wiki/File:Shesh_Shaiya_01.jpg',
      license: 'CC BY-SA 3.0',
      licenseHref: 'https://creativecommons.org/licenses/by-sa/3.0/',
    },
  },
  {
    name: 'Ancient Caves & Historic Sites',
    image: IMAGES.heritage,
    alt: 'Historic temple ruins within Bandhavgarh Fort',
    credit: {
      author: 'Kalyan Varma',
      source: 'https://commons.wikimedia.org/wiki/File:Ficus_temple.jpg',
      license: 'CC BY-SA 3.0',
      licenseHref: 'https://creativecommons.org/licenses/by-sa/3.0/',
    },
  },
]

function PhotoCredit({ author, source, license, licenseHref, className = '' }) {
  return (
    <p className={`text-[10px] leading-snug text-slate-500 ${className}`}>
      Photo: <a href={source} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600">{author} / Wikimedia Commons</a>
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

function BandhavgarhHero() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="bandhavgarh-page-title">
      <img
        src={IMAGES.hero}
        alt="Royal Bengal tigers in a forest landscape at Bandhavgarh National Park"
        className="absolute inset-0 h-full w-full object-cover object-[58%_48%]"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#10140d]/95 via-[#172014]/78 to-[#1b2113]/20" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" aria-hidden="true" />

      <div className="container-wide relative flex min-h-[520px] items-center py-10 sm:min-h-[490px] lg:min-h-[470px]">
        <div className="max-w-3xl">
          <Breadcrumb light items={[
            { label: 'India', href: '/india' },
            { label: 'National Parks' },
            { label: 'Bandhavgarh National Park' },
          ]} />
          <h1 id="bandhavgarh-page-title" className="font-display text-5xl font-bold leading-[0.98] text-white drop-shadow sm:text-6xl lg:text-7xl">
            <span className="block">Bandhavgarh</span>
            <span className="block text-gold-400">National Park</span>
          </h1>
          <p className="mt-5 font-display text-xl font-bold text-white sm:text-2xl">
            Land of the Royal Bengal Tiger
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base sm:leading-7">
            Bandhavgarh National Park, located in Madhya Pradesh, is one of India’s renowned wildlife destinations.
            Known for its tiger habitat, forest landscapes, historic sites and diverse wildlife, Bandhavgarh offers
            a memorable combination of nature, wildlife and heritage.
          </p>
        </div>
      </div>
    </section>
  )
}

function FeatureHighlights() {
  return (
    <section className="border-b border-orange-100 bg-[#fcfaf6] py-5 sm:py-6" aria-label="Bandhavgarh feature highlights">
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

function BandhavgarhQuote() {
  return (
    <aside className="relative isolate flex min-h-[270px] flex-col justify-between overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-[#fbf8ee] via-[#f5f3e8] to-[#e9eddd] p-6 shadow-sm md:col-span-2 lg:col-span-1 sm:p-7" aria-label="A thought about Bandhavgarh">
      <Quote size={30} className="relative text-emerald-950" fill="currentColor" aria-hidden="true" />
      <blockquote className="relative mt-3 font-display text-2xl font-semibold italic leading-snug text-emerald-950">
        “Where tigers rule the forests and history whispers through ancient stones.”
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

function AboutBandhavgarh() {
  return (
    <section className="bg-gradient-to-b from-white to-[#fbfaf7] py-10 sm:py-12 lg:py-14" aria-labelledby="about-bandhavgarh-title">
      <div className="container-wide grid min-w-0 items-center gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(235px,0.72fr)] lg:gap-7">
        <figure className="min-w-0">
          <img
            src={IMAGES.bandhavgarhLandscape}
            alt="Forested hills and rugged terrain in Bandhavgarh National Park"
            loading="lazy"
            decoding="async"
            className="h-full min-h-[250px] max-h-[350px] w-full rounded-2xl object-cover shadow-md"
          />
          <PhotoCredit
            author="JP Bennett"
            source="https://commons.wikimedia.org/wiki/File:Hilly_terrain_of_Bandhavgarh_National_Park_Madhya_Pradesh_India.jpg"
            license="CC BY 2.0"
            licenseHref="https://creativecommons.org/licenses/by/2.0/"
            className="mt-1.5 px-1"
          />
        </figure>
        <div>
          <SectionHeading id="about-bandhavgarh-title" title="About Bandhavgarh National Park" />
          <div className="mt-4 space-y-4 text-sm leading-7 text-navy-700 sm:text-[15px]">
            <p>
              Bandhavgarh National Park is located in the Umaria region of Madhya Pradesh and is known for its
              forests, grasslands, wildlife and historic landscape.
            </p>
            <p>
              The park is especially associated with Royal Bengal Tigers and also supports a variety of other
              wildlife, including leopards, deer, sloth bears and numerous bird species.
            </p>
            <p>
              Bandhavgarh Fort and other historic remains add a distinctive heritage dimension to the surrounding
              natural landscape.
            </p>
          </div>
        </div>
        <BandhavgarhQuote />
      </div>
    </section>
  )
}

function KeyHighlights() {
  return (
    <section className="border-y border-emerald-100/80 bg-[#f6f8f4] py-9 sm:py-11" aria-labelledby="bandhavgarh-highlights-title">
      <div className="container-wide">
        <SectionHeading id="bandhavgarh-highlights-title" title="Key Highlights" className="mb-5" />
        <ul className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0" aria-label="Bandhavgarh National Park highlights">
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

function WildlifeGallery() {
  return (
    <section className="py-9 sm:py-11" aria-labelledby="bandhavgarh-wildlife-title">
      <div className="container-wide">
        <SectionHeading id="bandhavgarh-wildlife-title" title="Wildlife at Bandhavgarh" className="mb-6" />
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
              <div className="flex min-h-11 flex-col items-center justify-center px-2 py-2 text-center">
                <h3 className="text-xs font-semibold leading-tight text-navy-900 sm:text-sm">{name}</h3>
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
            Explore the wilderness of Bandhavgarh through its forest landscapes and safari experience. Discover
            dense forests, open grasslands and diverse wildlife habitats while learning about one of Madhya
            Pradesh’s remarkable protected landscapes.
          </p>
        </div>
        <img
          src={IMAGES.safari}
          alt="Safari vehicle travelling along a forest trail"
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
                Bandhavgarh contains multiple tourism zones offering different forest landscapes and wildlife experiences.
              </p>
            </div>
          </div>
          <p id="bandhavgarh-safari-zones-details" hidden={!zonesExpanded} className="mt-4 border-t border-orange-200 pt-4 text-sm leading-relaxed text-navy-700">
            Tala, Magadhi and Khitauli are commonly referenced tourism zones. Zone access and conditions can vary;
            check current official park information before travelling.
          </p>
          <button
            type="button"
            aria-expanded={zonesExpanded}
            aria-controls="bandhavgarh-safari-zones-details"
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
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="bandhavgarh-best-time-title">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <TreePine size={21} aria-hidden="true" />
        </span>
        <h2 id="bandhavgarh-best-time-title" className="font-display text-xl font-bold text-emerald-950">Best Time to Visit</h2>
      </div>
      <p className="mt-5 font-display text-2xl font-bold text-emerald-900">October to June</p>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">
        Cooler months are generally popular for exploring the region, while seasonal conditions and park access can vary.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-navy-600">
        Visitors should verify current official park schedules and seasonal access before planning a trip.
      </p>
      <img
        src={IMAGES.forest}
        alt="Sunlit forest landscape in Madhya Pradesh"
        loading="lazy"
        decoding="async"
        className="mt-5 aspect-[16/10] w-full rounded-xl object-cover"
      />
    </section>
  )
}

function HowToReachCard() {
  const rows = [
    { icon: Plane, label: 'Nearest Airport', value: 'Jabalpur' },
    { icon: TrainFront, label: 'Nearest Railway Station', value: 'Umaria' },
    { icon: Car, label: 'By Road', value: 'Bandhavgarh is accessible by road from major nearby cities and towns in Madhya Pradesh.' },
  ]

  return (
    <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="bandhavgarh-how-to-reach-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <MapPin size={21} aria-hidden="true" />
        </span>
        <h2 id="bandhavgarh-how-to-reach-title" className="font-display text-xl font-bold text-emerald-950">How to Reach</h2>
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
          <Landmark size={21} aria-hidden="true" />
        </span>
        <h2 id="nearby-attractions-title" className="font-display text-xl font-bold text-emerald-950">Nearby Attractions</h2>
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
            <div className="px-2 pb-2.5">
              <h3 className="pt-2.5 text-center text-xs font-semibold text-navy-900 sm:text-sm">{name}</h3>
              <PhotoCredit {...credit} className="mt-1 text-center" />
            </div>
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

function BandhavgarhCallToAction() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="bandhavgarh-cta-title">
      <img
        src={IMAGES.cta}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#11160e]/85 via-[#142014]/65 to-[#18170e]/55" aria-hidden="true" />
      <div className="relative container-wide flex min-h-[330px] flex-col items-start justify-center py-12 pb-16 text-white sm:min-h-[365px]">
        <h2 id="bandhavgarh-cta-title" className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Discover the Wild Beauty of Bandhavgarh
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          Witness remarkable wildlife, explore ancient history, and experience the natural beauty of one of Madhya Pradesh’s iconic national parks.
        </p>
        <Link
          to="/india/wildlife-destinations"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-sm font-bold text-navy-950 shadow-lg transition-colors hover:bg-gold-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-950 sm:w-auto"
        >
          Explore More Wildlife Destinations <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <PhotoCredit
        author="Prithwiraj Dhang"
        source="https://commons.wikimedia.org/wiki/File:Bandhavgarh_National_Park_Morning_Light.jpg"
        license="CC BY-SA 4.0"
        licenseHref="https://creativecommons.org/licenses/by-sa/4.0/"
        className="absolute bottom-2 right-4 text-right text-white/80 sm:right-8"
      />
    </section>
  )
}

export default function BandhavgarhNationalParkPage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-white">
      <SEOHead
        title="Bandhavgarh National Park, Madhya Pradesh | TravelVista"
        description="Explore Bandhavgarh National Park in Madhya Pradesh, its Bengal tigers, diverse wildlife, historic landscapes and visitor information."
        keywords="Bandhavgarh National Park, Madhya Pradesh, Bengal tiger, Umaria, wildlife, Bandhavgarh Fort"
      />
      <BandhavgarhHero />
      <FeatureHighlights />
      <AboutBandhavgarh />
      <KeyHighlights />
      <WildlifeGallery />
      <SafariExperience />
      <VisitInformation />
      <BandhavgarhCallToAction />
    </div>
  )
}
