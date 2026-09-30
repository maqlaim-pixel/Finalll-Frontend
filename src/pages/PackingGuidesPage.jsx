import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  Bath,
  BriefcaseBusiness,
  Camera,
  Check,
  CheckCheck,
  CheckSquare,
  Compass,
  FileText,
  Globe2,
  HeartPulse,
  Luggage,
  Mountain,
  Plug,
  ShieldCheck,
  Shirt,
  Sun,
  TentTree,
  TreePalm,
  Umbrella,
  Users,
  WalletCards,
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import SEOHead from '../components/common/SEOHead'

const image = (photo, width = 960, height = 640) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&h=${height}&q=80`

const GUIDE_IMAGE = {
  himalayan: image('photo-1501785888041-af3ef285b470'),
  beach: image('photo-1507525428034-b723cf961d3e'),
  heritage: image('photo-1564507592333-c60657eea523'),
  wildlife: image('photo-1516426122078-c23e76319801'),
  city: image('photo-1519608487953-e999c86e7455'),
  family: image('photo-1478131143081-80f7f84ca84d'),
  adventure: image('photo-1464822759023-fed622ff2c3b'),
  international: image('photo-1527652737703-789f199966d5'),
}

export const PACKING_GUIDES = [
  {
    slug: 'himalayan-destinations',
    title: 'Himalayan Destinations',
    description: 'Packing guide for Ladakh, Himachal, Uttarakhand & Kashmir.',
    image: GUIDE_IMAGE.himalayan,
    alt: 'Backpack and boots ready for a hike among Himalayan mountains',
    categories: ['destination', 'hill-stations', 'adventure'],
    introduction: 'Prepare for changing temperatures, high-altitude conditions and active days in Ladakh, Himachal, Uttarakhand or Kashmir. Check the local forecast and travel advisories for your route before you go.',
    sections: [
      { title: 'Clothing & layers', icon: Shirt, items: ['Moisture-wicking base layers and comfortable everyday clothes', 'Warm mid-layer such as a fleece or wool sweater', 'Insulated, wind-resistant outer jacket', 'Thermal innerwear and warm sleepwear for colder nights'] },
      { title: 'Footwear & day gear', icon: Backpack, items: ['Broken-in trekking shoes with reliable grip', 'Warm socks and a spare pair for wet conditions', 'Daypack, refillable water bottle and rain cover', 'Sunglasses, sun hat and high-SPF sunscreen'] },
      { title: 'Health, documents & electronics', icon: HeartPulse, items: ['Personal medication and a compact first-aid kit', 'ID, permits where required, tickets and accommodation details', 'Phone, charging cables, power bank and suitable adapters', 'Keep digital and paper copies of important documents'] },
      { title: 'Weather preparation', icon: Mountain, items: ['Check current local weather and road conditions before departure', 'Allow time to acclimatize and seek qualified medical advice if needed', 'Carry layers in your daypack even when mornings feel mild', 'Follow local guidance about altitude and outdoor safety'] },
    ],
    avoid: 'Avoid relying on a single heavy layer, brand-new hiking shoes, or a tightly packed bag with no room for changing weather essentials.',
    seasonAdvice: 'Conditions can change quickly in mountain regions. Use the local forecast for your exact route and season, and pack layers that can be added or removed easily.',
    tips: ['Keep frequently used layers and sunscreen at the top of your daypack.', 'Pack heavier items close to your back for a more balanced load.', 'Check permit requirements and official destination advisories before setting out.'],
  },
  {
    slug: 'beach-destinations',
    title: 'Beach Destinations',
    description: 'Essentials for Goa, Andaman, Lakshadweep and other beaches.',
    image: GUIDE_IMAGE.beach,
    alt: 'Tropical beach with clear water and a broad stretch of sand',
    categories: ['destination', 'beach'],
    introduction: 'Keep your beach packing light, sun-smart and suited to the activities you have planned. Check local guidance and weather conditions, especially for island travel and water-based activities.',
    sections: [
      { title: 'Clothing & sun protection', icon: Sun, items: ['Lightweight, breathable clothes and swimwear', 'Sun hat or cap and UV-protective sunglasses', 'Reef-conscious sunscreen where appropriate and after-sun care', 'A light cover-up for shade and modest dress requirements'] },
      { title: 'Footwear & beach gear', icon: TreePalm, items: ['Comfortable sandals and water shoes if your activities require them', 'Quick-dry towel and a reusable water bottle', 'Waterproof pouch for small valuables', 'Lightweight day bag for beach essentials'] },
      { title: 'Documents & health', icon: FileText, items: ['Photo ID, tickets and accommodation confirmations', 'Personal medication and basic first-aid essentials', 'Insect repellent for evenings where useful', 'Copies of island permits or transport information when required'] },
      { title: 'Electronics & extras', icon: Camera, items: ['Phone, charging cable and power bank', 'Water-resistant case for electronics if needed', 'Small dry bag for boat or water excursions', 'Reusable bag for wet swimwear'] },
    ],
    avoid: 'Avoid leaving valuables unattended on the beach or packing items that are restricted at your island destination.',
    seasonAdvice: 'For hot or humid months, prioritize breathable fabrics and sun protection. Check monsoon weather, ferry operations and local advisories before island journeys.',
    tips: ['Keep sunscreen and drinking water easy to reach.', 'Use a separate pouch for wet swimwear and sandy items.', 'Follow local beach, marine-life and water-safety instructions.'],
  },
  {
    slug: 'cultural-heritage-tours',
    title: 'Cultural & Heritage Tours',
    description: 'What to pack for temple visits, historical sites and cultural explorations.',
    image: GUIDE_IMAGE.heritage,
    alt: 'Historic Indian palace architecture in warm afternoon light',
    categories: ['destination'],
    introduction: 'A thoughtful heritage-trip packing list balances comfort for walking with respect for local customs. Check the dress expectations, photography rules and opening guidance for each place you plan to visit.',
    sections: [
      { title: 'Clothing & respectful visits', icon: Shirt, items: ['Breathable, comfortable clothes appropriate to the season', 'A light scarf or cover-up for sites with dress requirements', 'Clothing that is easy to layer in air-conditioned spaces', 'A compact umbrella or sun hat depending on the forecast'] },
      { title: 'Footwear & day bag', icon: BriefcaseBusiness, items: ['Supportive shoes for long walks on historic grounds', 'Easy-to-remove footwear where site rules require it', 'Small day bag for water, essentials and personal items', 'Reusable water bottle and tissues'] },
      { title: 'Documents & health', icon: FileText, items: ['Valid ID, tickets and reservation confirmations', 'Personal medication and basic first-aid supplies', 'A note of important contacts and accommodation details', 'Copies of any required permits or entry passes'] },
      { title: 'Photography & useful extras', icon: Camera, items: ['Phone or camera with charged batteries', 'Power bank and charging cable', 'Small notebook or guidebook for site information', 'Cash or payment options appropriate to local requirements'] },
    ],
    avoid: 'Avoid clothing or accessories that conflict with site rules, and do not assume photography is allowed in every area.',
    seasonAdvice: 'In warm weather, bring sun protection and water; in cooler months, pack a light layer for mornings and evenings. Confirm current access and site rules through official sources.',
    tips: ['Choose shoes suited to uneven stone paths and stairs.', 'Carry only the essentials where bags are restricted.', 'Ask permission before photographing people or sensitive spaces.'],
  },
  {
    slug: 'wildlife-safari',
    title: 'Wildlife Safaris',
    description: 'Essential gear for national parks and jungle safaris.',
    image: GUIDE_IMAGE.wildlife,
    alt: 'Wildlife safari vehicle in an open nature reserve',
    categories: ['destination', 'wildlife'],
    introduction: 'Pack for early starts, changing conditions and long periods outdoors. Park rules differ, so check the official guidance for your reserve, safari operator and travel dates.',
    sections: [
      { title: 'Clothing & sun protection', icon: Shirt, items: ['Comfortable neutral-coloured layers suited to local conditions', 'A light warm layer for cool mornings', 'Sun hat or cap and high-SPF sunscreen', 'Rain layer during wet seasons'] },
      { title: 'Footwear & field essentials', icon: Backpack, items: ['Closed, comfortable shoes for boarding and short walks', 'Small day bag and refillable water bottle', 'Binoculars for distant wildlife viewing', 'Insect repellent where appropriate'] },
      { title: 'Health & documents', icon: HeartPulse, items: ['Personal medication and basic first aid', 'ID, permits, safari confirmations and emergency contacts', 'Any required park entry documents', 'Motion-sickness aids only if appropriate for you'] },
      { title: 'Photography & responsible travel', icon: Camera, items: ['Camera or phone with spare battery or power bank', 'Lens cloth and protective pouch', 'Small flashlight only where operator rules allow', 'Follow all guide instructions and wildlife-distance rules'] },
    ],
    avoid: 'Avoid loud clothing, flash photography, feeding wildlife, single-use litter and any item prohibited by park rules.',
    seasonAdvice: 'Safaris may begin in cool conditions and warm quickly. Layer clothing and check seasonal park access, permitted gear and weather guidance with official sources.',
    tips: ['Keep binoculars and water accessible without disturbing other passengers.', 'Use quiet, respectful behavior around wildlife.', 'Confirm luggage size and equipment rules with your safari operator.'],
  },
  {
    slug: 'city-breaks',
    title: 'City Breaks',
    description: 'Smart packing for urban destinations and short trips.',
    image: GUIDE_IMAGE.city,
    alt: 'Traveler rolling a suitcase through a historic city street',
    categories: ['destination'],
    introduction: 'For a short city break, choose versatile clothing, comfortable walking gear and a compact day bag. Build your list around the weather, local customs and activities on your itinerary.',
    sections: [
      { title: 'Clothing & footwear', icon: Shirt, items: ['Versatile outfits that can be layered and re-worn', 'Comfortable walking shoes already broken in', 'A light jacket or umbrella based on the forecast', 'Clothes appropriate for planned dining or cultural visits'] },
      { title: 'Documents & organization', icon: FileText, items: ['Photo ID, travel tickets and accommodation confirmations', 'Payment cards and a small amount of local currency where useful', 'Compact wallet, document pouch and emergency contact details', 'Copies of essential reservations stored securely'] },
      { title: 'Health & daily essentials', icon: HeartPulse, items: ['Personal medication and basic toiletries', 'Sunscreen, hand sanitizer and tissues', 'Reusable water bottle', 'Small backpack or crossbody day bag'] },
      { title: 'Electronics', icon: Camera, items: ['Phone, charger and power bank', 'Headphones and charging cables', 'Travel adapter if required for your destination', 'Offline map or saved directions for key stops'] },
    ],
    avoid: 'Avoid overpacking bulky items you can easily source at your destination and keep valuables secure in busy areas.',
    seasonAdvice: 'Check the forecast close to departure and account for time spent outdoors, air-conditioned transport and evening temperatures.',
    tips: ['Leave a little space for purchases or souvenirs.', 'Use a small pouch for transit passes and daily essentials.', 'Save key addresses offline before exploring.'],
  },
  {
    slug: 'family-travel',
    title: 'Family Travel',
    description: 'Packing checklist for traveling with kids and family.',
    image: GUIDE_IMAGE.family,
    alt: 'Family enjoying a scenic outdoor trip together',
    categories: ['destination', 'family'],
    introduction: 'A family packing plan works best when essentials are easy to reach and each traveler has a small role. Adapt the list to children’s ages, health needs, weather and transport arrangements.',
    sections: [
      { title: 'Clothing & personal items', icon: Shirt, items: ['Comfortable outfits plus one spare change for travel days', 'Weather-appropriate layers for each family member', 'Sleepwear and familiar comfort items for children', 'Comfortable footwear suited to planned activities'] },
      { title: 'Health & child essentials', icon: HeartPulse, items: ['Regular medication and a child-appropriate first-aid kit', 'Personal care items and any needed prescriptions', 'Snacks and refillable water bottles', 'Wipes, tissues and spare bags for unexpected messes'] },
      { title: 'Documents & organization', icon: FileText, items: ['IDs and any child travel documents required for your route', 'Tickets, accommodation details and emergency contacts', 'Copies of important documents stored securely', 'A small child-sized bag for familiar, safe essentials'] },
      { title: 'Journey entertainment', icon: Camera, items: ['Books, activity items or downloaded entertainment', 'Chargers, headphones and a power bank', 'Comfortable travel blanket or neck pillow if useful', 'Simple meeting-point plan for crowded places'] },
    ],
    avoid: 'Avoid packing medication outside its original or clearly labeled packaging when documentation may be needed; check current transport and destination rules.',
    seasonAdvice: 'Pack spare layers and weather protection in an easy-to-reach bag. Check the forecast, child-safety needs and any rules for car seats or strollers on your route.',
    tips: ['Give each family member a clearly labeled bag or packing cube.', 'Keep a change of clothes and essential medication in carry-on luggage.', 'Confirm baggage and child-equipment policies directly with transport providers.'],
  },
  {
    slug: 'adventure-trips',
    title: 'Adventure Trips',
    description: 'What to pack for trekking, camping and adventure activities.',
    image: GUIDE_IMAGE.adventure,
    alt: 'Hiker carrying a backpack on a mountain trail',
    categories: ['destination', 'adventure', 'hill-stations'],
    introduction: 'Adventure packing depends on the route, activity, duration and conditions. Follow the activity provider’s equipment list and local safety guidance, and avoid carrying gear you have not tested.',
    sections: [
      { title: 'Clothing & weather layers', icon: Shirt, items: ['Moisture-managing base layers suited to the activity', 'Warm or insulating layer where conditions require it', 'Windproof or waterproof outer layer based on forecast', 'Spare socks and quick-dry clothing'] },
      { title: 'Footwear & carrying gear', icon: Backpack, items: ['Activity-appropriate, broken-in shoes or boots', 'Comfortable backpack fitted to your trip duration', 'Rain cover or waterproof packing bags', 'Trekking poles or other gear only if your route requires them'] },
      { title: 'Health & navigation', icon: Compass, items: ['Personal medication and appropriate first-aid supplies', 'Sun protection, insect repellent and refillable water', 'Offline route information and emergency contacts', 'Headlamp with spare batteries for overnight activities'] },
      { title: 'Camping & power', icon: TentTree, items: ['Use only the shelter and sleep system required for your conditions', 'Phone, charging cable and power bank', 'Water treatment supplies only where appropriate and advised', 'Reusable food containers and a plan to pack out all waste'] },
    ],
    avoid: 'Avoid untested equipment, cotton layers for cold/wet conditions, and going beyond your experience or official route guidance.',
    seasonAdvice: 'Conditions can shift quickly outdoors. Check local weather, route status and operator guidance, and adjust gear to the actual activity and season.',
    tips: ['Test and adjust your pack before departure.', 'Keep a light, waterproof layer easy to access.', 'Tell a trusted person about your route and expected return when appropriate.'],
  },
  {
    slug: 'international-travel',
    title: 'International Travel',
    description: 'Packing essentials for overseas trips.',
    image: GUIDE_IMAGE.international,
    alt: 'Passport, globe and travel documents prepared for an overseas trip',
    categories: ['destination', 'international'],
    introduction: 'International packing starts with the current entry requirements, climate and transport rules for your destination. Keep travel documents accessible and confirm airline baggage policies before departure.',
    sections: [
      { title: 'Documents & money', icon: FileText, items: ['Passport with validity that meets destination requirements', 'Visa or entry documents where required', 'Flight details, accommodation information and insurance documents', 'Payment cards and a backup payment plan'] },
      { title: 'Clothing & footwear', icon: Shirt, items: ['Versatile clothing suited to the destination’s weather', 'Comfortable footwear for planned activities', 'A light layer for temperature changes during transit', 'Clothing that respects local customs and site requirements'] },
      { title: 'Health & personal care', icon: HeartPulse, items: ['Personal medication in suitable packaging', 'Check health advice and prescription requirements before travel', 'Basic toiletries and items for the first day', 'Travel insurance details and emergency contacts'] },
      { title: 'Electronics & accessories', icon: Plug, items: ['Phone, charger and country-compatible power adapter', 'Power bank compliant with current airline rules', 'Secure digital copies of important documents', 'Luggage tags and a compact organizer'] },
    ],
    avoid: 'Avoid packing restricted goods, carrying medication without checking destination requirements, or placing all essential documents in checked luggage.',
    seasonAdvice: 'The season at your destination may differ from home. Check local forecasts, entry rules and airline baggage restrictions close to departure.',
    tips: ['Keep passport and required entry documents in your personal item.', 'Save offline copies of essential confirmations and addresses.', 'Check customs and carry-on restrictions with official sources and your airline.'],
  },
]

const CATEGORY_NAV = [
  { id: 'destination', label: 'Destination-wise Guides', icon: Luggage },
  { id: 'seasonal', label: 'Seasonal Packing', icon: Sun },
  { id: 'family', label: 'Family Travel', icon: Users },
  { id: 'adventure', label: 'Adventure Travel', icon: TentTree },
  { id: 'wildlife', label: 'Wildlife Safari', icon: Camera },
  { id: 'beach', label: 'Beach Vacations', icon: TreePalm },
  { id: 'hill-stations', label: 'Hill Stations', icon: Mountain },
  { id: 'international', label: 'International Travel', icon: Globe2 },
]

const ESSENTIAL_CHECKLIST = [
  { icon: ShieldCheck, color: 'text-emerald-700', text: 'Valid ID proof (Passport / Aadhaar)' },
  { icon: WalletCards, color: 'text-blue-600', text: 'Travel tickets & hotel vouchers' },
  { icon: Shirt, color: 'text-amber-600', text: 'Clothing as per destination and season' },
  { icon: Compass, color: 'text-amber-900', text: 'Comfortable footwear' },
  { icon: Bath, color: 'text-pink-600', text: 'Toiletries and personal care items' },
  { icon: HeartPulse, color: 'text-red-600', text: 'Medicines and first aid kit' },
  { icon: Camera, color: 'text-violet-700', text: 'Electronics and chargers' },
  { icon: Plug, color: 'text-teal-600', text: 'Travel accessories (adapter, power bank, etc.)' },
]

const SEASONAL_TIPS = {
  summer: {
    label: 'Summer',
    icon: Sun,
    image: image('photo-1507525428034-b723cf961d3e', 600, 600),
    alt: 'Sunny tropical beach with turquoise water for a summer trip',
    items: ['Lightweight cotton clothes', 'Sunscreen and sunglasses', 'Hat or cap', 'Stay hydrated (water bottle)', 'Comfortable footwear', 'Lightweight backpack'],
  },
  monsoon: {
    label: 'Monsoon',
    icon: Umbrella,
    image: image('photo-1519692933481-e162a57d6721', 600, 600),
    alt: 'Rain falling over a lush green landscape during monsoon',
    items: ['Quick-dry clothing', 'Raincoat / waterproof jacket', 'Compact umbrella', 'Waterproof footwear', 'Waterproof backpack cover', 'Plastic/waterproof document pouch', 'Mosquito repellent'],
  },
  winter: {
    label: 'Winter',
    icon: Mountain,
    image: image('photo-1519681393784-d120267933ba', 600, 600),
    alt: 'Snow-covered mountain landscape for winter travel',
    items: ['Thermal innerwear', 'Warm jacket', 'Sweater / fleece', 'Gloves', 'Woollen cap', 'Warm socks', 'Suitable winter footwear'],
  },
}

const SEASON_ICONS = {
  summer: 'text-amber-600',
  monsoon: 'text-sky-600',
  winter: 'text-indigo-600',
}

function SectionHeading({ id, title, className = '' }) {
  return (
    <div className={className}>
      <h2 id={id} className="font-display text-2xl font-bold leading-tight text-emerald-950 sm:text-3xl">{title}</h2>
      <span className="mt-2 block h-0.5 w-10 bg-orange-500" aria-hidden="true" />
    </div>
  )
}

function PackingHero() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="packing-guides-title">
      <img
        src={image('photo-1501785888041-af3ef285b470', 2000, 900)}
        alt="Traveler looking over a mountain lake surrounded by forest at sunrise"
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[58%_52%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07150f]/92 via-[#0b1d14]/70 to-[#0d2017]/10" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[245px] w-full max-w-[1600px] items-center px-4 py-7 sm:min-h-[270px] sm:px-6 md:min-h-[285px] lg:px-10">
        <div className="max-w-4xl">
          <Breadcrumb light items={[
            { label: 'Travel Guide', href: '/guides/travel-tips' },
            { label: 'Packing Guides' },
          ]} />
          <h1 id="packing-guides-title" className="font-display text-5xl font-bold leading-[1.02] drop-shadow sm:text-6xl md:text-7xl">
            <span className="text-white">Packing </span><span className="text-gold-400">Guides</span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/95 sm:text-base md:text-lg">
            Smart packing makes travel easier, safer and more enjoyable. Explore our destination-wise packing guides with essential checklists, tips and expert advice.
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-5 right-8 hidden text-right text-white drop-shadow-lg lg:block xl:right-14" aria-hidden="true">
          <p className="rotate-[-7deg] font-display text-2xl font-bold italic xl:text-3xl">Pack Smart<br />Travel Better</p>
          <svg className="ml-auto mt-1 h-12 w-44 text-white" viewBox="0 0 176 48" fill="none">
            <path d="M4 38C49 5 119 8 158 26" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M151 16l17 9-14 11 3-9-6-11z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  )
}

function PackingCategoryNav({ activeCategory, onSelect }) {
  return (
    <nav className="border-b border-orange-100 bg-[#fcfaf6]" aria-label="Packing guide categories">
      <div className="mx-auto w-full max-w-[1600px] overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:thin] sm:px-6 lg:px-8">
        <ul className="flex min-w-max items-stretch lg:min-w-0 lg:justify-between">
          {CATEGORY_NAV.map(({ id, label, icon: Icon }) => {
            const active = activeCategory === id
            return (
              <li key={id} className="flex shrink-0 border-r border-orange-200 last:border-r-0 lg:flex-1">
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  aria-pressed={active}
                  className={`group relative flex min-h-[76px] min-w-[128px] flex-1 flex-col items-center justify-center gap-1.5 px-3 py-2 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 lg:min-w-0 ${active ? 'bg-amber-100/85 text-amber-950 after:absolute after:-bottom-px after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rotate-45 after:bg-orange-500' : 'text-navy-800 hover:bg-amber-50'}`}
                >
                  <Icon size={25} className={active ? 'text-amber-900' : 'text-amber-950'} strokeWidth={2} aria-hidden="true" />
                  <span className="whitespace-nowrap text-xs font-semibold text-navy-900 sm:text-sm">{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

function PackingGuideCard({ guide }) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/travel-guide/packing-guides/${guide.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500" aria-label={`View ${guide.title} packing guide`}>
        <img src={guide.image} alt={guide.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-display text-lg font-bold leading-snug text-navy-950 sm:text-xl">{guide.title}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-snug text-navy-700">{guide.description}</p>
        <Link to={`/travel-guide/packing-guides/${guide.slug}`} className="mt-3 inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-orange-800 transition-colors hover:text-orange-950 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          View Guide <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

function EssentialChecklist() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="essential-checklist-heading">
      <div className="flex items-center gap-3 bg-emerald-50/70 px-4 py-3.5 sm:px-5">
        <CheckSquare size={25} className="shrink-0 text-amber-800" aria-hidden="true" />
        <h2 id="essential-checklist-heading" className="font-display text-xl font-bold text-emerald-950 sm:text-2xl">Essential Packing Checklist</h2>
      </div>
      <ul className="divide-y divide-slate-100 px-3 sm:px-4">
        {ESSENTIAL_CHECKLIST.map(({ icon: Icon, color, text }) => (
          <li key={text} className="flex items-start gap-3 py-2.5"><Icon size={18} className={`mt-0.5 shrink-0 ${color}`} aria-hidden="true" /><span className="text-sm leading-snug text-navy-800">{text}</span></li>
        ))}
      </ul>
    </section>
  )
}

function SeasonalPackingTips({ activeSeason, onSeasonChange }) {
  const active = SEASONAL_TIPS[activeSeason]
  return (
    <section id="seasonal-packing" className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="seasonal-packing-heading">
      <div className="flex items-center gap-3 bg-emerald-50/70 px-4 py-3.5 sm:px-5"><Sun size={26} className="shrink-0 text-amber-500" aria-hidden="true" /><h2 id="seasonal-packing-heading" className="font-display text-xl font-bold text-emerald-950 sm:text-2xl">Seasonal Packing Tips</h2></div>
      <div className="px-3 pt-3 sm:px-4">
        <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Seasonal packing tips">
          {Object.entries(SEASONAL_TIPS).map(([season, data]) => {
            const SeasonIcon = data.icon
            const selected = activeSeason === season
            return (
              <button key={season} id={`season-tab-${season}`} type="button" role="tab" aria-selected={selected} aria-controls="season-panel" tabIndex={selected ? 0 : -1} onClick={() => onSeasonChange(season)} onKeyDown={event => {
                const seasons = Object.keys(SEASONAL_TIPS)
                const current = seasons.indexOf(season)
                let next = current
                if (event.key === 'ArrowRight') next = (current + 1) % seasons.length
                else if (event.key === 'ArrowLeft') next = (current - 1 + seasons.length) % seasons.length
                else if (event.key === 'Home') next = 0
                else if (event.key === 'End') next = seasons.length - 1
                else return
                event.preventDefault()
                onSeasonChange(seasons[next])
                document.getElementById(`season-tab-${seasons[next]}`)?.focus()
              }} className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm ${selected ? 'bg-orange-500 text-white shadow-sm' : 'bg-emerald-50 text-navy-800 hover:bg-emerald-100'}`}>
                <SeasonIcon size={15} className={selected ? 'text-white' : SEASON_ICONS[season]} aria-hidden="true" />{data.label}
              </button>
            )
          })}
        </div>
      </div>
      <div id="season-panel" role="tabpanel" aria-labelledby={`season-tab-${activeSeason}`} tabIndex={0} className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-[minmax(110px,0.8fr)_minmax(0,1.2fr)] sm:p-4">
        <img src={active.image} alt={active.alt} loading="lazy" decoding="async" className="aspect-[4/3] max-h-48 w-full rounded-lg object-cover sm:aspect-square sm:max-h-none" />
        <ul className="space-y-2 self-center">{active.items.map(item => <li key={item} className="flex items-start gap-2 text-xs leading-snug text-navy-800 sm:text-sm"><Check size={16} className="mt-0.5 shrink-0 rounded-full bg-emerald-700 p-0.5 text-white" aria-hidden="true" /><span>{item}</span></li>)}</ul>
      </div>
    </section>
  )
}

function PackingGuideDetail({ guide }) {
  const checklist = guide.sections.flatMap(section => section.items.map(item => ({ category: section.title, item })))
  return (
    <div className="min-w-0 bg-white">
      <SEOHead title={`${guide.title} Packing Guide | TravelVista`} description={guide.description} keywords={`${guide.title}, packing guide, travel checklist, TravelVista`} />
      <section className="relative isolate overflow-hidden bg-emerald-950" aria-labelledby="packing-guide-detail-title">
        <img src={guide.image} alt={guide.alt} fetchpriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07150f]/92 via-[#0b1d14]/70 to-[#0d2017]/15" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[230px] w-full max-w-[1600px] items-center px-4 py-8 sm:min-h-[270px] sm:px-6 lg:px-10">
          <div className="max-w-4xl">
            <Breadcrumb light items={[{ label: 'Travel Guide', href: '/guides/travel-tips' }, { label: 'Packing Guides', href: '/travel-guide/packing-guides' }, { label: guide.title }]} />
            <h1 id="packing-guide-detail-title" className="font-display text-4xl font-bold leading-tight text-white drop-shadow sm:text-5xl md:text-6xl">{guide.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/95 sm:text-base">{guide.description}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <Link to="/travel-guide/packing-guides" className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-emerald-900 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"><ArrowLeft size={17} aria-hidden="true" /> All Packing Guides</Link>
        <p className="max-w-4xl text-base leading-7 text-navy-700">{guide.introduction}</p>
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            {guide.sections.map(({ title, icon: Icon, items }) => (
              <section key={title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby={`packing-section-${guide.slug}-${title.toLowerCase().replaceAll(' ', '-')}`}>
                <h2 id={`packing-section-${guide.slug}-${title.toLowerCase().replaceAll(' ', '-')}`} className="flex items-center gap-2.5 font-display text-xl font-bold text-emerald-950"><Icon size={22} className="shrink-0 text-emerald-800" aria-hidden="true" />{title}</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">{items.map(item => <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-navy-700"><Check size={16} className="mt-1 shrink-0 text-emerald-700" aria-hidden="true" /><span>{item}</span></li>)}</ul>
              </section>
            ))}
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="guide-checklist-heading">
              <div className="flex items-center gap-2.5 bg-emerald-50 px-4 py-3"><CheckCheck size={22} className="text-emerald-800" aria-hidden="true" /><h2 id="guide-checklist-heading" className="font-display text-lg font-bold text-emerald-950">Packing Checklist</h2></div>
              <ul className="max-h-[430px] divide-y divide-slate-100 overflow-y-auto px-4">{checklist.map(({ category, item }) => <li key={item} className="py-2"><span className="block text-[10px] font-semibold uppercase tracking-wide text-emerald-800">{category}</span><span className="mt-0.5 flex items-start gap-2 text-xs leading-snug text-navy-700"><Check size={14} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />{item}</span></li>)}</ul>
            </section>
            <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-4" aria-labelledby="season-advice-heading"><h2 id="season-advice-heading" className="flex items-center gap-2 font-display text-lg font-bold text-emerald-950"><Sun size={20} className="text-amber-600" aria-hidden="true" />Season-specific advice</h2><p className="mt-2 text-sm leading-relaxed text-navy-700">{guide.seasonAdvice}</p></section>
          </aside>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="items-to-avoid-heading"><h2 id="items-to-avoid-heading" className="font-display text-xl font-bold text-emerald-950">Items to Avoid</h2><p className="mt-2 text-sm leading-relaxed text-navy-700">{guide.avoid}</p></section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="expert-packing-tips-heading"><h2 id="expert-packing-tips-heading" className="font-display text-xl font-bold text-emerald-950">Expert Travel Tips</h2><ul className="mt-2 space-y-2">{guide.tips.map(tip => <li key={tip} className="flex items-start gap-2 text-sm leading-relaxed text-navy-700"><Check size={16} className="mt-1 shrink-0 text-emerald-700" aria-hidden="true" /><span>{tip}</span></li>)}</ul></section>
        </div>
        <section className="mt-8" aria-labelledby="related-guides-heading">
          <SectionHeading id="related-guides-heading" title="Related Packing Guides" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{PACKING_GUIDES.filter(item => item.slug !== guide.slug && item.categories.some(category => guide.categories.includes(category))).slice(0, 4).map(item => <Link key={item.slug} to={`/travel-guide/packing-guides/${item.slug}`} className="flex min-h-16 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-navy-800 transition-colors hover:border-orange-300 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500"><span>{item.title}</span><ArrowRight size={16} className="shrink-0" aria-hidden="true" /></Link>)}</div>
        </section>
      </div>
    </div>
  )
}

export default function PackingGuidesPage() {
  const { slug } = useParams()
  const guide = slug ? PACKING_GUIDES.find(item => item.slug === slug) : null
  const [activeCategory, setActiveCategory] = useState('destination')
  const [activeSeason, setActiveSeason] = useState('summer')
  const listRef = useRef(null)
  const seasonalRef = useRef(null)
  const shownGuides = useMemo(
    () => activeCategory === 'seasonal' ? PACKING_GUIDES : PACKING_GUIDES.filter(item => item.categories.includes(activeCategory)),
    [activeCategory],
  )

  useEffect(() => {
    if (slug && guide) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug, guide])

  if (slug) {
    if (!guide) return <Navigate to="/travel-guide/packing-guides" replace />
    return <PackingGuideDetail guide={guide} />
  }

  function handleCategorySelect(category) {
    setActiveCategory(category)
    const target = category === 'seasonal' ? seasonalRef.current : listRef.current
    requestAnimationFrame(() => target?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div className="min-w-0 bg-white">
      <SEOHead title="Packing Guides for Every Trip | TravelVista" description="Explore destination-wise packing guides, seasonal checklists and practical travel packing advice for beaches, mountains, safaris, family holidays and international trips." keywords="packing guides, travel packing checklist, beach packing, Himalayan packing, safari packing, seasonal packing tips" />
      <PackingHero />
      <PackingCategoryNav activeCategory={activeCategory} onSelect={handleCategorySelect} />
      <div className="mx-auto grid w-full max-w-[1600px] items-start gap-6 px-4 py-5 sm:px-6 sm:py-7 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.38fr)] lg:gap-7 lg:px-8">
        <section ref={listRef} aria-labelledby="popular-packing-guides-heading" className="min-w-0 scroll-mt-28">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <SectionHeading id="popular-packing-guides-heading" title="Popular Packing Guides" className="mb-0" />
            {activeCategory !== 'destination' && activeCategory !== 'seasonal' && <p className="pb-1 text-xs font-medium text-emerald-800">{CATEGORY_NAV.find(item => item.id === activeCategory)?.label}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">{shownGuides.map(item => <PackingGuideCard key={item.slug} guide={item} />)}</div>
          {activeCategory === 'seasonal' && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-relaxed text-navy-700">Seasonal packing tips are shown in the panel beside this guide list. Choose Summer, Monsoon or Winter to see the relevant checklist.</div>}
        </section>
        <aside className="min-w-0" aria-label="Essential and seasonal packing checklists">
          <EssentialChecklist />
          <div ref={seasonalRef} className="scroll-mt-28"><SeasonalPackingTips activeSeason={activeSeason} onSeasonChange={setActiveSeason} /></div>
        </aside>
      </div>
    </div>
  )
}
