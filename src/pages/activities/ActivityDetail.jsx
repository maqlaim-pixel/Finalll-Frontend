import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Calendar, Check, Clock, Loader2, MapPin, Star } from 'lucide-react'
import api from '../../services/api'
import Breadcrumb from '../../components/common/Breadcrumb'
import SEOHead from '../../components/common/SEOHead'
import { resolveImageUrl } from '../../utils/imageUtils'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=700&fit=crop'

function parseHighlights(value) {
  if (Array.isArray(value)) return value.filter(item => typeof item === 'string' && item.trim())
  if (typeof value !== 'string' || !value.trim()) return []

  const trimmed = value.trim()
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.map(item => typeof item === 'string' ? item : item?.title).filter(Boolean)
      }
    } catch {
      // Keep plain-text highlights usable if the value is not valid JSON.
    }
  }
  return trimmed.split(/[\n,]+/).map(item => item.trim()).filter(Boolean)
}

export default function ActivityDetail() {
  const { slug } = useParams()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setActivity(null)

    api.get('/activities?status=published')
      .then(response => {
        if (!Array.isArray(response.data)) throw new TypeError('Unexpected activities response')
        const found = response.data.find(item => (
          item?.slug === slug || String(item?.id) === slug
        ))
        if (!cancelled) {
          if (found) setActivity(found)
          else setError('This activity is not available.')
        }
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load this activity. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="container-wide flex min-h-[55vh] items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="animate-spin text-sky-700" size={30} aria-hidden="true" />
        <span className="ml-3 text-navy-600">Loading activity...</span>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="container-wide flex min-h-[55vh] flex-col items-center justify-center px-4 text-center" role="alert">
        <AlertCircle className="mb-4 text-navy-300" size={42} aria-hidden="true" />
        <h1 className="font-display text-2xl font-bold text-navy-900">{error || 'Activity not found'}</h1>
        <p className="mt-2 max-w-lg text-navy-500">Browse our published India experiences to find another activity.</p>
        <Link to="/india/experiences" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-sky-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-sky-800">
          <ArrowLeft size={16} aria-hidden="true" /> Browse experiences
        </Link>
      </div>
    )
  }

  const image = resolveImageUrl(activity.image) || FALLBACK_IMAGE
  const highlights = parseHighlights(activity.highlights)
  const rating = Number(activity.rating)
  const reviewCount = Number(activity.reviewCount)

  return (
    <div className="bg-gray-50">
      <SEOHead title={`${activity.name} | TravelVista`} description={activity.description || `${activity.name} in ${activity.location || 'India'}.`} image={image} />
      <section className="relative h-[45vh] min-h-[340px] overflow-hidden">
        <img
          src={image}
          alt={activity.name}
          onError={event => { if (event.currentTarget.dataset.fallback !== 'true') { event.currentTarget.dataset.fallback = 'true'; event.currentTarget.src = FALLBACK_IMAGE } }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container-wide py-8 sm:py-10">
          <Breadcrumb light items={[{ label: 'India', href: '/india' }, { label: 'Experiences', href: '/india/experiences' }, { label: activity.name }]} />
          <h1 className="font-display text-3xl font-bold text-white drop-shadow sm:text-4xl">{activity.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
            {activity.location && <span className="flex items-center gap-1.5"><MapPin size={15} aria-hidden="true" />{activity.location}</span>}
            {activity.duration && <span className="flex items-center gap-1.5"><Clock size={15} aria-hidden="true" />{activity.duration}</span>}
            {rating > 0 && <span className="flex items-center gap-1.5"><Star size={15} className="fill-amber-400 text-amber-400" aria-hidden="true" />{rating}{reviewCount > 0 ? ` (${reviewCount} reviews)` : ''}</span>}
          </div>
        </div>
      </section>

      <div className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-xl border bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{activity.category || 'India Experience'}</p>
                <h2 className="mt-2 font-display text-xl font-bold text-navy-900">About this experience</h2>
                <p className="mt-3 leading-relaxed text-navy-600">{activity.description || 'Contact our team for more information about this experience.'}</p>
              </section>

              {highlights.length > 0 && (
                <section className="rounded-xl border bg-white p-6">
                  <h2 className="font-display text-xl font-bold text-navy-900">Highlights</h2>
                  <ul className="mt-4 space-y-3">
                    {highlights.map((highlight, index) => (
                      <li key={`${highlight}-${index}`} className="flex items-start gap-2 text-navy-700">
                        <Check size={17} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />{highlight}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside>
              <div className="space-y-5 rounded-xl border bg-white p-6 lg:sticky lg:top-24">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy-900">Plan this experience</h2>
                  <p className="mt-1 text-sm leading-relaxed text-navy-600">Talk with our travel team to plan the details of your trip.</p>
                </div>
                <Link to="/plan-trip" className="flex min-h-12 w-full items-center justify-center rounded-lg bg-sky-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-sky-800">
                  Plan this experience
                </Link>
                <Link to="/contact" className="flex min-h-11 w-full items-center justify-center rounded-lg border border-sky-700 px-4 py-2.5 font-semibold text-sky-800 transition-colors hover:bg-sky-50">
                  Enquire now
                </Link>
                <dl className="space-y-3 border-t pt-4 text-sm">
                  {activity.duration && <div className="flex justify-between gap-4 text-navy-600"><dt>Duration</dt><dd className="text-right font-medium text-navy-900">{activity.duration}</dd></div>}
                  {activity.difficulty && <div className="flex justify-between gap-4 text-navy-600"><dt>Difficulty</dt><dd className="text-right font-medium text-navy-900">{activity.difficulty}</dd></div>}
                  {activity.bestTime && <div className="flex justify-between gap-4 text-navy-600"><dt className="inline-flex items-center gap-1.5"><Calendar size={14} aria-hidden="true" />Best time</dt><dd className="text-right font-medium text-navy-900">{activity.bestTime}</dd></div>}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
