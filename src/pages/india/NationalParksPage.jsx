import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Camera,
  Leaf,
  MapPin,
  PawPrint,
  Search,
  Trees,
} from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'

const COMMONS = 'https://commons.wikimedia.org/wiki/File:'
const CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0/'

// Reuse the destination photography already used by the park detail pages.
const HERO_IMAGE = 'https://images.unsplash.com/photo-1701368533954-f0dc06ebfbed?w=2000&h=900&fit=crop'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&h=700&fit=crop'

const NATIONAL_PARKS = [
  {
    id: 'gir',
    name: 'Gir National Park',
    state: 'Gujarat',
    image: 'https://res.cloudinary.com/goqz2x1l/image/upload/v1788949125/Queen_Family.jpg',
    imageAlt: 'Asiatic lion in a natural habitat',
    description: 'Home to the majestic Asiatic lion and rich wildlife, Gir offers a memorable nature experience.',
    wildlife: ['Asiatic Lion', 'Leopard', 'Crocodile', 'Birdlife'],
    experiences: ['Wildlife Safari', 'Photography', 'Bird Watching', 'Forest Experience'],
    keywords: ['lion', 'saurashtra', 'dry deciduous forest'],
    href: '/india/national-parks/gir-national-park',
  },
  {
    id: 'ranthambore',
    name: 'Ranthambore National Park',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1639141155354-3706f000e3b8?w=1000&h=700&fit=crop',
    imageAlt: 'Royal Bengal tiger in a forest habitat',
    description: 'Famous for its tigers, historic fort and scenic landscapes, Ranthambore blends wildlife, nature and heritage.',
    wildlife: ['Tiger', 'Leopard', 'Chital', 'Sambar', 'Sloth Bear', 'Crocodile', 'Birdlife'],
    experiences: ['Wildlife Safari', 'Jeep Safari', 'Bird Watching', 'Nature', 'Photography'],
    keywords: ['royal bengal tiger', 'fort', 'sawai madhopur', 'heritage'],
    href: '/india/national-parks/ranthambore-national-park',
  },
  {
    id: 'bandhavgarh',
    name: 'Bandhavgarh National Park',
    state: 'Madhya Pradesh',
    image: 'https://images.unsplash.com/photo-1701368533954-f0dc06ebfbed?w=1000&h=700&fit=crop',
    imageAlt: 'Tiger in a forest landscape',
    description: 'Known for Royal Bengal Tiger habitat and rich biodiversity, Bandhavgarh is a celebrated wildlife destination.',
    wildlife: ['Tiger', 'Leopard', 'Chital', 'Sambar', 'Sloth Bear', 'Birdlife'],
    experiences: ['Wildlife Safari', 'Jeep Safari', 'Bird Watching', 'Nature', 'Photography'],
    keywords: ['royal bengal tiger', 'central india', 'forest'],
    href: '/india/national-parks/bandhavgarh-national-park',
  },
  {
    id: 'pench',
    name: 'Pench National Park',
    state: 'Madhya Pradesh',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Tiger_of_Turia_Core_Zone_-_Pench_National_Park.jpg/960px-Tiger_of_Turia_Core_Zone_-_Pench_National_Park.jpg',
    imageAlt: 'Tiger in the Turia Core Zone of Pench National Park',
    description: 'Known for beautiful forest landscapes and diverse wildlife, Pench is closely associated with The Jungle Book.',
    wildlife: ['Tiger', 'Leopard', 'Chital', 'Sambar', 'Sloth Bear', 'Birdlife'],
    experiences: ['Wildlife Safari', 'Jeep Safari', 'Bird Watching', 'Nature', 'Photography'],
    keywords: ['jungle book', 'central india', 'forest'],
    credit: { author: 'Shaswat Nimesh', file: 'Tiger of Turia Core Zone - Pench National Park.jpg' },
    href: '/india/national-parks/pench-national-park',
  },
  {
    id: 'jim-corbett',
    name: 'Jim Corbett National Park',
    state: 'Uttarakhand',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Bengal_Tiger_at_Jim_Corbett_National_Park.jpg/960px-Bengal_Tiger_at_Jim_Corbett_National_Park.jpg',
    imageAlt: 'Bengal tiger in Jim Corbett National Park',
    description: 'India’s first national park, known for forest landscapes, riverine habitats and diverse wildlife.',
    wildlife: ['Tiger', 'Leopard', 'Elephant', 'Chital', 'Sambar', 'Sloth Bear', 'Birdlife'],
    experiences: ['Wildlife Safari', 'Jeep Safari', 'Bird Watching', 'Nature', 'Photography', 'River Experience'],
    keywords: ['corbett tiger reserve', 'ramnagar', 'river', 'forest'],
    credit: { author: 'Rito1987', file: 'Bengal Tiger at Jim Corbett National Park.jpg' },
    href: '/india/national-parks/jim-corbett-national-park',
  },
  {
    id: 'kaziranga',
    name: 'Kaziranga National Park',
    state: 'Assam',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/One_horned_rhino_feeding_in_a_grassland_in_Kaziranga_National_Park%2C_Assam.jpg/1280px-One_horned_rhino_feeding_in_a_grassland_in_Kaziranga_National_Park%2C_Assam.jpg',
    imageAlt: 'One-horned rhinoceros feeding in a Kaziranga grassland',
    description: 'Famous for the one-horned rhinoceros, Kaziranga is a UNESCO World Heritage Site with rich biodiversity.',
    wildlife: ['One-Horned Rhinoceros', 'Elephant', 'Tiger', 'Leopard', 'Crocodile', 'Birdlife'],
    experiences: ['Wildlife Safari', 'Jeep Safari', 'Bird Watching', 'Nature', 'Photography'],
    keywords: ['rhino', 'rhinoceros', 'brahmaputra', 'unesco', 'grassland'],
    credit: { author: 'Joli', file: 'One horned rhino feeding in a grassland in Kaziranga National Park, Assam.jpg' },
    href: '/india/national-parks/kaziranga-national-park',
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans National Park',
    state: 'West Bengal',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Sundarbans_Tigress_West_Bengal_10.jpg/1280px-Sundarbans_Tigress_West_Bengal_10.jpg',
    imageAlt: 'Royal Bengal tigress in the Sundarbans mangrove habitat',
    description: 'Known for its vast mangrove ecosystem and Royal Bengal Tiger habitat, Sundarbans has a distinctive riverine landscape.',
    wildlife: ['Tiger', 'Spotted Deer', 'Crocodile', 'Fishing Cat', 'Birdlife'],
    experiences: ['Boat Safari', 'Bird Watching', 'Nature', 'Photography', 'Mangrove Experience'],
    keywords: ['mangrove', 'tidal waterways', 'creeks', 'islands', 'riverine'],
    credit: { author: 'Dr. Raju Kasambe', file: 'Sundarbans Tigress West Bengal 10.jpg' },
    href: '/india/national-parks/sundarbans-national-park',
  },
]

const FEATURES = [
  { icon: PawPrint, title: 'Diverse Wildlife', description: 'Home to rare and endemic species' },
  { icon: Trees, title: 'Stunning Landscapes', description: 'Forests, mountains, grasslands & wetlands' },
  { icon: Camera, title: 'Unforgettable Experiences', description: 'Safari, birdwatching & nature trails' },
  { icon: Leaf, title: 'Conservation & Sustainability', description: 'Supporting wildlife and local communities' },
]

function PhotoCredit({ credit }) {
  if (!credit) return null

  const fileUrl = `${COMMONS}${encodeURIComponent(credit.file).replace(/%20/g, '_')}`
  const license = credit.license || 'CC BY-SA 4.0'
  const licenseHref = credit.licenseHref || CC_BY_SA

  return (
    <p className="mt-3 text-[10px] leading-snug text-slate-500">
      Photo: <a href={fileUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-800">{credit.author} / Wikimedia Commons</a>
      {' · '}
      <a href={licenseHref} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-800">{license}</a>
      {' · cropped'}
    </p>
  )
}

function FeatureStrip() {
  return (
    <section className="border-b border-orange-100 bg-[#fcfaf6]" aria-label="National park highlights">
      <div className="container-wide">
        <ul className="grid grid-cols-1 divide-y divide-orange-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className={`flex min-h-[86px] items-center gap-4 px-4 py-4 sm:px-5 lg:justify-center ${index % 2 === 1 ? 'sm:border-l sm:border-orange-200' : ''} ${index > 1 ? 'lg:border-l lg:border-orange-200' : ''}`}>
              <Icon className="shrink-0 text-amber-900" size={32} strokeWidth={1.8} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-display text-sm font-bold leading-snug text-navy-900 sm:text-base">{title}</h2>
                <p className="mt-0.5 text-xs leading-snug text-navy-600 sm:text-sm">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function NationalParkCard({ park }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={imageFailed ? FALLBACK_IMAGE : park.image}
          alt={park.imageAlt}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h2 className="font-display text-xl font-bold leading-tight text-white drop-shadow sm:text-2xl">{park.name}</h2>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-white drop-shadow">
            <MapPin size={17} className="shrink-0" aria-hidden="true" />
            {park.state}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm leading-relaxed text-navy-800">{park.description}</p>
        {park.href ? (
          <Link
            to={park.href}
            className="mt-3 inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-full border border-orange-500 px-5 py-2 text-sm font-bold text-orange-800 transition-colors hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            View Details <ArrowRight size={17} aria-hidden="true" />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            title="A Kaziranga National Park information page is not available yet."
            className="mt-3 inline-flex min-h-10 w-fit cursor-not-allowed items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-500"
          >
            Details coming soon
          </button>
        )}
        {park.credit && <PhotoCredit credit={park.credit} />}
      </div>
    </article>
  )
}

export default function NationalParksPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [wildlifeFilter, setWildlifeFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState('')

  const states = useMemo(
    () => [...new Set(NATIONAL_PARKS.map(park => park.state))].sort((a, b) => a.localeCompare(b)),
    [],
  )
  const wildlifeOptions = useMemo(
    () => [...new Set(NATIONAL_PARKS.flatMap(park => park.wildlife))].sort((a, b) => a.localeCompare(b)),
    [],
  )
  const experienceOptions = useMemo(
    () => [...new Set(NATIONAL_PARKS.flatMap(park => park.experiences))].sort((a, b) => a.localeCompare(b)),
    [],
  )

  const filteredParks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return NATIONAL_PARKS.filter(park => {
      const searchableText = [
        park.name,
        park.state,
        park.description,
        ...park.wildlife,
        ...park.experiences,
        ...park.keywords,
      ].join(' ').toLowerCase()

      return (!query || searchableText.includes(query))
        && (!stateFilter || park.state === stateFilter)
        && (!wildlifeFilter || park.wildlife.includes(wildlifeFilter))
        && (!experienceFilter || park.experiences.includes(experienceFilter))
    })
  }, [searchTerm, stateFilter, wildlifeFilter, experienceFilter])

  const filtersActive = Boolean(searchTerm.trim() || stateFilter || wildlifeFilter || experienceFilter)

  function clearFilters() {
    setSearchTerm('')
    setStateFilter('')
    setWildlifeFilter('')
    setExperienceFilter('')
  }

  function submitSearch(event) {
    event.preventDefault()
    setSearchTerm(value => value.trim())
  }

  return (
    <div className="bg-white">
      <SEOHead
        title="All National Parks of India | TravelVista"
        description="Explore India’s national parks, wildlife, landscapes and nature experiences. Search and filter the directory to find a park that interests you."
        keywords="India national parks, wildlife, tiger, Asiatic lion, Kaziranga, Sundarbans, national park directory"
      />

      <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="national-parks-title">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          fetchpriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[66%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09140e]/95 via-[#0b1b12]/78 to-[#112318]/15" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" aria-hidden="true" />

        <div className="container-wide relative flex min-h-[280px] items-center py-8 sm:min-h-[300px] md:min-h-[320px]">
          <div className="max-w-4xl">
            <Breadcrumb light items={[
              { label: 'India', href: '/india' },
              { label: 'Wildlife Destinations', href: '/india/wildlife-destinations' },
              { label: 'National Parks' },
            ]} />
            <h1 id="national-parks-title" className="font-display text-4xl font-bold leading-[1.02] drop-shadow sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-white">All </span>
              <span className="text-gold-400">National Parks of India</span>
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              Explore India’s most breathtaking national parks, home to diverse wildlife, stunning landscapes and unforgettable nature experiences.
            </p>
          </div>
        </div>
      </section>

      <FeatureStrip />

      <section className="container-wide py-6 md:py-8" aria-label="Search and filter national parks">
        <form onSubmit={submitSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(250px,1.7fr)_repeat(3,minmax(145px,1fr))_minmax(110px,0.9fr)]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <label htmlFor="park-search" className="sr-only">Search National Parks</label>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-600" aria-hidden="true" />
            <input
              id="park-search"
              type="search"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search national parks (e.g. Jim Corbett, Gir, Kaziranga...)"
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-3 text-sm text-navy-900 placeholder:text-navy-500 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
            />
          </div>

          <div>
            <label htmlFor="park-state" className="sr-only">Filter by state</label>
            <select id="park-state" value={stateFilter} onChange={event => setStateFilter(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20">
              <option value="">Select State</option>
              {states.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="park-wildlife" className="sr-only">Filter by wildlife</label>
            <select id="park-wildlife" value={wildlifeFilter} onChange={event => setWildlifeFilter(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20">
              <option value="">Select Wildlife</option>
              {wildlifeOptions.map(animal => <option key={animal} value={animal}>{animal}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="park-experience" className="sr-only">Filter by experience</label>
            <select id="park-experience" value={experienceFilter} onChange={event => setExperienceFilter(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20">
              <option value="">Select Experience</option>
              {experienceOptions.map(experience => <option key={experience} value={experience}>{experience}</option>)}
            </select>
          </div>

          <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">
            <Search size={16} aria-hidden="true" /> Search
          </button>
        </form>

        <div className="mt-4 flex min-h-7 flex-wrap items-center justify-between gap-3" aria-live="polite">
          <p className="text-sm text-navy-600">
            Showing <span className="font-semibold text-navy-900">{filteredParks.length}</span> of {NATIONAL_PARKS.length} national parks
          </p>
          {filtersActive && (
            <button type="button" onClick={clearFilters} className="rounded px-2 py-1 text-sm font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700">
              Clear Filters
            </button>
          )}
        </div>

        {filteredParks.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 xl:gap-5">
            {filteredParks.map(park => <NationalParkCard key={park.id} park={park} />)}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-6 py-12 text-center" role="status">
            <Search size={34} className="mx-auto text-emerald-800" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold text-navy-900 sm:text-2xl">No national parks found matching your search.</h2>
            <button type="button" onClick={clearFilters} className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
