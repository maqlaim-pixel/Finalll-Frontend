import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Briefcase,
  Bus,
  Camera,
  CreditCard,
  FileText,
  Leaf,
  Lightbulb,
  MapPin,
  Plane,
  Pill,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import SEOHead from '../components/common/SEOHead'

const IMAGE = (photo, width = 900, height = 560) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&h=${height}&q=80`

const BACKPACKER_IMAGE = IMAGE('photo-1719952739528-e801d3904bfa')
const HERO_IMAGE = IMAGE('photo-1719952739528-e801d3904bfa', 2000, 900)
const IMAGE_FALLBACK = IMAGE('photo-1501785888041-af3ef285b470', 1000, 700)
const PASSPORT_IMAGE = IMAGE('photo-1655722724447-2d2a3071e7f8')
const PACKING_IMAGE = IMAGE('photo-1779364815233-84ec09c6d6d5')
const BEACH_ACCESSORIES_IMAGE = IMAGE('photo-1642565547461-6787ff751b9b')
const SIGNPOST_IMAGE = IMAGE('photo-1777659947782-5e4bf2af85de')
const SAFETY_IMAGE = IMAGE('photo-1646303297330-17073f7823c3')
const FAMILY_IMAGE = IMAGE('photo-1780569299004-8bed18fdb34c')
const TRAIN_IMAGE = IMAGE('photo-1645438176272-918a71ce821f')
const FIRST_TRIP_IMAGE = BACKPACKER_IMAGE
const SUSTAINABLE_IMAGE = TRAIN_IMAGE

const CATEGORIES = [
  { id: 'before-you-travel', label: 'Before You Travel', icon: Plane },
  { id: 'during-your-trip', label: 'During Your Trip', icon: Briefcase },
  { id: 'safety-tips', label: 'Safety Tips', icon: ShieldCheck },
  { id: 'budget-travel', label: 'Budget Travel', icon: CreditCard },
  { id: 'travel-planning', label: 'Travel Planning', icon: MapPin },
  { id: 'packing-tips', label: 'Packing Tips', icon: Camera },
  { id: 'family-travel', label: 'Family Travel', icon: Users },
  { id: 'sustainable-travel', label: 'Sustainable Travel', icon: Leaf },
  { id: 'expert-advice', label: 'Expert Advice', icon: Star },
]

export const ARTICLES = [
  {
    id: 'international-trip',
    category: 'Travel Planning',
    categoryId: 'travel-planning',
    categories: ['before-you-travel', 'travel-planning', 'expert-advice'],
    title: 'How to Plan an International Trip from India',
    shortTitle: 'How to Plan an International Trip from India',
    description: 'A practical guide to documents, budgeting, planning and preparing an itinerary for international travel.',
    image: PASSPORT_IMAGE,
    alt: 'Hand holding passports with boarding passes while preparing to travel',
    featured: true,
    readTime: '6 min read',
    content: [
      'A little preparation makes an international trip easier to enjoy. Start by checking passport validity, visa and entry requirements, and any health guidance with the destination’s official authorities. Requirements can change, so confirm them close to departure.',
      'Set a realistic trip budget that accounts for transportation, accommodation, meals, local transit, activities and a contingency. Compare options across dates and locations, and keep a record of any important cancellation or change terms.',
      'Build a flexible itinerary around the places and experiences that matter most to you. Allow time for airport transfers, rest and unexpected changes rather than filling every hour.',
      'Keep digital copies of key documents in a secure place and carry the essentials you may need during the journey. Share your broad itinerary and an emergency contact plan with someone you trust.',
    ],
  },
  {
    id: 'perfect-trip-packing',
    category: 'Packing Tips',
    categoryId: 'packing-tips',
    categories: ['before-you-travel', 'packing-tips'],
    title: 'What to Pack for a Perfect Trip',
    shortTitle: 'What to Pack for a Perfect Trip',
    description: 'Essential packing guidance for different destinations, seasons and travel styles.',
    image: PACKING_IMAGE,
    alt: 'Open suitcase packed with clothes and travel essentials',
    featured: true,
    readTime: '5 min read',
    content: [
      'Begin with the forecast, planned activities and any local dress considerations. A short checklist helps keep packing focused on what you are likely to use instead of “just in case” extras.',
      'Choose comfortable, versatile clothing that can be layered and worn in more than one outfit. Keep a light outer layer and comfortable walking shoes suited to your plans.',
      'Pack essential documents, chargers, medication and one change of clothes where they are easy to reach. Check your airline’s current baggage and carry-on rules before you leave.',
      'Leave a little room for items you may bring back, and use small pouches to keep cables, toiletries and daily essentials organized.',
    ],
  },
  {
    id: 'first-time-travelers',
    category: 'Travel Planning',
    categoryId: 'travel-planning',
    categories: ['before-you-travel', 'during-your-trip', 'travel-planning', 'expert-advice'],
    title: 'Top Travel Tips for First-Time Travelers',
    shortTitle: 'Top Travel Tips for First-Time Travelers',
    description: 'Useful ways to prepare and enjoy your first trip with greater confidence.',
    image: FIRST_TRIP_IMAGE,
    alt: 'Traveler with a backpack looking toward a mountain lake',
    featured: true,
    readTime: '5 min read',
    content: [
      'For a first trip, keep your plans clear and manageable. Confirm transport and accommodation details, save addresses and confirmation information, and learn how to reach your first stop before you arrive.',
      'Keep important items secure and maintain access to copies of travel documents. Save offline maps or essential contact details in case mobile data is unavailable.',
      'Give yourself room to adapt. A flexible schedule makes it easier to pause, ask for local guidance or change plans when conditions call for it.',
      'Stay curious and respectful: learn a few local phrases, observe local customs and check current guidance for the places you plan to visit.',
    ],
  },
  {
    id: 'save-money-traveling',
    category: 'Budget Travel',
    categoryId: 'budget-travel',
    categories: ['before-you-travel', 'budget-travel', 'expert-advice'],
    title: '10 Easy Ways to Save Money While Traveling',
    shortTitle: '10 Easy Ways to Save Money While Traveling',
    description: 'Simple planning habits that can help you make more of your travel budget.',
    image: BEACH_ACCESSORIES_IMAGE,
    alt: 'Sun hat, sunglasses and a straw bag ready for a beach trip',
    featured: false,
    readTime: '5 min read',
    content: [
      'Start with a daily spending range and track the bigger costs first. Comparing dates, routes and neighborhoods can reveal options that fit your budget without compromising what matters most.',
      'Look into local public transport and walkable areas. For meals, explore a mix of markets, cafés and restaurants that locals recommend, while keeping food safety and dietary needs in mind.',
      'Plan a few no-cost or low-cost activities, such as parks, public viewpoints or free museum days where offered. Check official sources for opening times and access details.',
      'Keep a small contingency for changes and avoid carrying more cash than you need. The best savings are the ones that keep the trip comfortable and safe.',
    ],
  },
  {
    id: 'best-time-destinations',
    category: 'Travel Planning',
    categoryId: 'travel-planning',
    categories: ['before-you-travel', 'travel-planning'],
    title: 'Best Time to Visit Popular Destinations',
    shortTitle: 'Best Time to Visit Popular Destinations',
    description: 'Consider weather, local events and seasonal conditions when choosing your travel dates.',
    image: SIGNPOST_IMAGE,
    alt: 'A signpost in a mountainous landscape',
    featured: false,
    readTime: '4 min read',
    content: [
      'The “best” time to visit depends on what you want to do. Compare typical seasonal weather with your own interests, whether that means outdoor activities, quieter streets or local festivals.',
      'Check official destination and attraction information for seasonal closures, access changes and public holidays. Conditions can vary within the same region.',
      'Travel dates outside the busiest periods may offer a different pace, but confirm transport schedules and available services before making firm plans.',
      'Pack for changing conditions and leave some flexibility in your itinerary, especially when weather may affect outdoor activities.',
    ],
  },
  {
    id: 'stay-safe-abroad',
    category: 'Safety Tips',
    categoryId: 'safety-tips',
    categories: ['before-you-travel', 'during-your-trip', 'safety-tips'],
    title: 'Stay Safe While Traveling Abroad',
    shortTitle: 'Stay Safe While Traveling Abroad',
    description: 'Practical reminders for staying aware, prepared and connected while away.',
    image: SAFETY_IMAGE,
    alt: 'Map, camera and passport arranged for travel planning',
    featured: false,
    readTime: '5 min read',
    content: [
      'Before departure, review current official travel guidance and save local emergency contacts. Share your itinerary with someone you trust and agree on how you will check in.',
      'Use reputable transport providers, stay aware of your surroundings and keep valuables secured. Follow local advice in busy areas and when conditions change.',
      'Keep copies of important documents separate from the originals. Consider travel insurance appropriate to your plans and review what it covers before the trip.',
      'If you feel uncertain, pause and seek help from official staff, your accommodation or a trusted local contact rather than rushing into a decision.',
    ],
  },
  {
    id: 'family-travel-kids',
    category: 'Family Travel',
    categoryId: 'family-travel',
    categories: ['before-you-travel', 'during-your-trip', 'family-travel'],
    title: 'Travel Tips for Families with Kids',
    shortTitle: 'Travel Tips for Families with Kids',
    description: 'Make family travel smoother with thoughtful pacing, familiar essentials and shared plans.',
    image: FAMILY_IMAGE,
    alt: 'Children holding hands at the edge of the sea',
    featured: false,
    readTime: '4 min read',
    content: [
      'Plan around the needs and energy levels of everyone traveling. A realistic pace, breaks and a few flexible blocks can make a full day more comfortable for children and adults alike.',
      'Keep familiar snacks, a change of clothes and any essential medicines easy to reach. Confirm the arrangements and policies that matter to your family with transport providers and accommodation.',
      'Agree on a simple meeting point and what children should do if the group becomes separated. Keep emergency contacts available in a way that suits their age.',
      'Invite children to help choose an activity or pack a small personal bag. Shared expectations can make the journey feel easier for everyone.',
    ],
  },
  {
    id: 'responsible-sustainable-travel',
    category: 'Sustainable Travel',
    categoryId: 'sustainable-travel',
    categories: ['during-your-trip', 'sustainable-travel', 'expert-advice'],
    title: 'How to Travel Responsibly and Sustainably',
    shortTitle: 'How to Travel Responsibly and Sustainably',
    description: 'Small, considered choices can help reduce waste and support the places you visit.',
    image: SUSTAINABLE_IMAGE,
    alt: 'Train travelling through a lush green forest',
    featured: false,
    readTime: '4 min read',
    content: [
      'Respect local customs, natural areas and community guidance. Stay on marked paths where required and observe wildlife from a considerate distance.',
      'When practical, bring a reusable bottle or bag and sort waste according to local instructions. Use resources thoughtfully and avoid single-use items when a suitable alternative is available.',
      'Look for locally owned businesses and locally made products, and ask before photographing people or culturally sensitive places.',
      'Responsible travel is about informed choices rather than perfection. Follow the destination’s current rules and adapt to what is practical and appropriate on the day.',
    ],
  },
  {
    id: 'travel-dos-donts',
    category: 'Expert Advice',
    categoryId: 'expert-advice',
    categories: ['before-you-travel', 'during-your-trip', 'safety-tips', 'expert-advice'],
    title: 'Do’s and Don’ts While Traveling',
    shortTitle: 'Do’s and Don’ts While Traveling',
    description: 'A useful checklist for considerate, flexible and well-prepared journeys.',
    image: IMAGE('photo-1436491865332-7a61a109cc05'),
    alt: 'Airplane wing above the clouds on a journey',
    featured: false,
    readTime: '4 min read',
    content: [
      'Do confirm key details and keep a copy of important information. Do leave a little room in the plan for rest and unexpected changes.',
      'Do learn about local etiquette, respect community rules and ask before taking photos where it may be sensitive.',
      'Avoid sharing sensitive travel documents or real-time location details publicly. Avoid relying on a single copy of important information or leaving valuables unattended.',
      'Above all, check current local guidance and use your judgment. A thoughtful traveler is prepared, respectful and willing to adapt.',
    ],
  },
  {
    id: 'travel-document-checklist',
    category: 'Travel Planning',
    categoryId: 'travel-planning',
    categories: ['before-you-travel', 'travel-planning', 'safety-tips'],
    title: 'A Simple Travel Document Checklist',
    shortTitle: 'A Simple Travel Document Checklist',
    description: 'Organize the essential confirmations and documents you may need for your journey.',
    image: SAFETY_IMAGE,
    alt: 'Map, camera, passport and other travel items arranged on a table',
    featured: false,
    readTime: '3 min read',
    content: [
      'Make a checklist based on your route and the current rules for your destination. This may include identification, entry permissions, transport details and accommodation information.',
      'Keep digital copies in a secure account and consider a separate backup for documents you may need to replace. Protect personal information when using shared devices or networks.',
      'Confirm names, dates and contact details on reservations before leaving. Save a way to contact the relevant provider if plans change.',
    ],
  },
  {
    id: 'healthy-journey',
    category: 'Safety Tips',
    categoryId: 'safety-tips',
    categories: ['before-you-travel', 'during-your-trip', 'safety-tips'],
    title: 'Stay Comfortable on a Long Journey',
    shortTitle: 'Stay Comfortable on a Long Journey',
    description: 'A few simple habits can make travel days feel more manageable.',
    image: FIRST_TRIP_IMAGE,
    alt: 'Traveler taking a refreshing break on a scenic journey',
    featured: false,
    readTime: '3 min read',
    content: [
      'Plan ahead for your personal needs, including any medication or accessibility arrangements. Keep essentials and contact details close at hand.',
      'Drink water when appropriate, take movement breaks when it is safe to do so and allow enough time for connections. Follow any health guidance relevant to your route.',
      'If you have specific medical needs, seek advice from a qualified health professional before travel and make a plan that works for you.',
    ],
  },
  {
    id: 'low-impact-day',
    category: 'Sustainable Travel',
    categoryId: 'sustainable-travel',
    categories: ['during-your-trip', 'sustainable-travel'],
    title: 'Plan a Lower-Impact Travel Day',
    shortTitle: 'Plan a Lower-Impact Travel Day',
    description: 'Simple ideas for enjoying a destination thoughtfully and at a gentler pace.',
    image: SUSTAINABLE_IMAGE,
    alt: 'A train travelling through a green forest landscape',
    featured: false,
    readTime: '3 min read',
    content: [
      'Choose activities that respect local guidance and give you time to appreciate the place. Public transit or walking may be practical options where they are safe and accessible.',
      'Bring reusable essentials if convenient, follow local recycling instructions and leave natural spaces as you found them.',
      'Support local businesses and be considerate of residents, wildlife and other visitors. Small choices can make a day more thoughtful.',
    ],
  },
]

const QUICK_TIPS = [
  { icon: FileText, color: 'text-blue-600', text: 'Keep digital and physical copies of important documents.' },
  { icon: ShieldCheck, color: 'text-emerald-800', text: 'Consider appropriate travel insurance for your journey.' },
  { icon: Briefcase, color: 'text-amber-700', text: 'Pack light and carry only the essentials you need.' },
  { icon: CreditCard, color: 'text-blue-600', text: 'Keep suitable payment methods and some local currency where appropriate.' },
  { icon: Pill, color: 'text-blue-600', text: 'Stay hydrated and carry essential personal items or medicines.' },
  { icon: Users, color: 'text-amber-900', text: 'Respect local culture, traditions and community guidance.' },
  { icon: Bus, color: 'text-emerald-800', text: 'Use reputable transport providers and trusted platforms.' },
  { icon: Leaf, color: 'text-emerald-800', text: 'Travel responsibly and reduce unnecessary single-use plastic.' },
]

function SectionHeading({ id, title, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      <h2 id={id} className="font-display text-2xl font-bold leading-tight text-emerald-950 sm:text-3xl">{title}</h2>
      <span className="mt-2 block h-0.5 w-10 bg-orange-500" aria-hidden="true" />
    </div>
  )
}

function TravelTipCard({ article, featured = false, onReadMore }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md ${featured ? 'h-full' : ''}`}>
      <div className="relative aspect-[2.25/1] overflow-hidden bg-slate-100">
        <img
          src={imageFailed ? IMAGE_FALLBACK : article.image}
          alt={article.alt}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute bottom-2 left-2 inline-flex max-w-[calc(100%-1rem)] truncate rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-800 shadow-sm sm:text-[11px]">
          {article.category}
        </span>
      </div>

      <div className={`flex flex-1 flex-col ${featured ? 'p-4 sm:p-5' : 'p-3 sm:p-3.5'}`}>
        <h3 className={`font-display font-bold leading-snug text-navy-950 ${featured ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
          {article.title}
        </h3>
        {featured && <p className="mt-2 text-sm leading-relaxed text-navy-600">{article.description}</p>}
        <button
          type="button"
          onClick={() => onReadMore(article)}
          className={`mt-auto inline-flex min-h-10 w-fit items-center gap-2 pt-2 text-sm font-semibold text-orange-800 transition-colors hover:text-orange-950 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${featured ? '' : 'text-[13px]'}`}
          aria-label={`Read more: ${article.title}`}
        >
          Read More <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

function QuickTravelTips() {
  return (
    <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="quick-tips-heading">
      <div className="flex items-center gap-3 bg-emerald-50/80 px-4 py-3.5 sm:px-5">
        <Lightbulb size={28} className="shrink-0 text-amber-500" aria-hidden="true" />
        <h2 id="quick-tips-heading" className="font-display text-xl font-bold text-emerald-950 sm:text-2xl">Quick Travel Tips</h2>
      </div>
      <ul className="divide-y divide-slate-100 px-3 sm:px-4">
        {QUICK_TIPS.map(({ icon: Icon, color, text }) => (
          <li key={text} className="flex items-start gap-3 py-3">
            <Icon size={21} className={`mt-0.5 shrink-0 ${color}`} aria-hidden="true" />
            <p className="text-sm leading-snug text-navy-800">{text}</p>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function ArticleReader({ article, onClose }) {
  const closeButtonRef = useRef(null)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [article.id, onClose])

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" aria-labelledby="travel-tip-reader-title" className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-64">
          <img src={imageFailed ? IMAGE_FALLBACK : article.image} alt={article.alt} onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" aria-hidden="true" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close article"
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-navy-900 shadow transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 sm:left-7 sm:right-7">
            <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-800">{article.category}</span>
            <h2 id="travel-tip-reader-title" className="mt-2 font-display text-2xl font-bold leading-tight text-white drop-shadow sm:text-3xl">{article.title}</h2>
          </div>
        </div>
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <p className="mb-5 text-sm font-medium text-emerald-800">{article.readTime}</p>
          <div className="space-y-4">
            {article.content.map((paragraph, index) => <p key={index} className="text-base leading-7 text-navy-700">{paragraph}</p>)}
          </div>
          <button type="button" onClick={onClose} className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">
            Back to Travel Tips <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  )
}

export default function TravelTipsPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const [showAllTips, setShowAllTips] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const mainContentRef = useRef(null)

  const filteredArticles = useMemo(
    () => ARTICLES.filter(article => !activeCategory || article.categories.includes(activeCategory)),
    [activeCategory],
  )
  const featuredArticles = filteredArticles.filter(article => article.featured)
  const moreArticles = filteredArticles.filter(article => !article.featured)
  const visibleMoreArticles = showAllTips || activeCategory ? moreArticles : moreArticles.slice(0, 6)
  const hasMoreToReveal = !activeCategory && !showAllTips && moreArticles.length > 6

  function selectCategory(categoryId) {
    setActiveCategory(current => current === categoryId ? '' : categoryId)
  }

  const closeArticle = useCallback(() => setSelectedArticle(null), [])

  return (
    <div className="bg-white">
      <SEOHead
        title="Travel Tips & Practical Travel Guides | TravelVista"
        description="Plan smarter, travel safer and make the most of every journey with practical packing, planning, safety, family and sustainable travel tips."
        keywords="travel tips, travel planning, packing tips, safety tips, budget travel, family travel, sustainable travel"
      />

      <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="travel-tips-title">
        <img
          src={HERO_IMAGE}
          alt="Hikers with backpacks exploring a scenic mountain trail"
          fetchpriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07150f]/95 via-[#0b1d14]/78 to-[#0d2017]/15" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[240px] w-full max-w-[1440px] items-center px-4 py-7 sm:min-h-[250px] sm:px-6 md:min-h-[260px] lg:px-8">
          <div className="max-w-4xl">
            <Breadcrumb light items={[
              { label: 'Travel Guide' },
              { label: 'Travel Tips' },
            ]} />
            <h1 id="travel-tips-title" className="font-display text-5xl font-bold leading-[1.02] drop-shadow sm:text-6xl">
              <span className="text-white">Travel </span><span className="text-gold-400">Tips</span>
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/95 sm:text-base md:text-lg">
              Plan smarter, travel safer and make the most of every journey with our expert travel tips, practical guides and useful insights.
            </p>
          </div>
        </div>
      </section>

      <nav className="border-b border-orange-100 bg-[#fcfaf6]" aria-label="Travel tip categories">
        <div className="container-wide">
          <ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-9">
            {CATEGORIES.map(({ id, label, icon: Icon }, index) => {
              const isActive = activeCategory === id
              return (
                <li key={id} className={`min-w-0 ${index > 0 ? 'lg:border-l lg:border-orange-200' : ''}`}>
                  <button
                    type="button"
                    onClick={() => selectCategory(id)}
                    aria-pressed={isActive}
                    className={`flex min-h-[78px] w-full flex-col items-center justify-center gap-1.5 px-1.5 py-3 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:min-h-[82px] sm:px-2 ${isActive ? 'bg-amber-100/75 text-orange-900' : 'text-amber-950 hover:bg-amber-50'}`}
                  >
                    <Icon size={24} strokeWidth={1.9} aria-hidden="true" />
                    <span className={`text-[10px] font-semibold leading-tight sm:text-xs ${isActive ? 'text-orange-900' : 'text-navy-900'}`}>{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <div ref={mainContentRef} id="travel-tips-content" className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 md:py-8">
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_310px] xl:gap-7">
          <section aria-labelledby="featured-travel-tips-heading" className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <SectionHeading id="featured-travel-tips-heading" title="Featured Travel Tips" className="mb-4" />
              {activeCategory && (
                <button type="button" onClick={() => setActiveCategory('')} className="mb-4 rounded px-2 py-1 text-sm font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                  Clear category
                </button>
              )}
            </div>
            {featuredArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featuredArticles.map(article => <TravelTipCard key={article.id} article={article} featured onReadMore={setSelectedArticle} />)}
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-5 py-7 text-sm leading-relaxed text-navy-700" role="status">
                No featured articles in this category yet. Browse matching articles in More Travel Tips below.
              </div>
            )}
          </section>

          <div>
            <QuickTravelTips />
          </div>
        </div>

        <section className="mt-7" aria-labelledby="more-travel-tips-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionHeading id="more-travel-tips-heading" title="More Travel Tips" className="mb-0" />
              {activeCategory && <p className="mt-2 text-xs font-medium text-emerald-800">Filtered by {CATEGORIES.find(category => category.id === activeCategory)?.label}</p>}
            </div>
            {moreArticles.length > 0 && !activeCategory && (
              <button
                type="button"
                onClick={() => setShowAllTips(value => !value)}
                aria-expanded={showAllTips || Boolean(activeCategory)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {showAllTips ? 'Show Fewer Tips' : 'View All Tips'} <ArrowRight size={15} aria-hidden="true" />
              </button>
            )}
          </div>

          {visibleMoreArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
              {visibleMoreArticles.map(article => <TravelTipCard key={article.id} article={article} onReadMore={setSelectedArticle} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-7 text-sm text-navy-700" role="status">
              No additional tips match this category yet. Choose another category or clear the filter to browse all tips.
            </div>
          )}

          {hasMoreToReveal && <p className="mt-3 text-xs text-navy-500">More practical guides are available with View All Tips.</p>}
        </section>
      </div>

      {selectedArticle && <ArticleReader article={selectedArticle} onClose={closeArticle} />}
    </div>
  )
}
