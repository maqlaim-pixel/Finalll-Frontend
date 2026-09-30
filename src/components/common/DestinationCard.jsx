import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Calendar } from 'lucide-react'
import { resolveImageUrl } from '../../utils/imageUtils'

export default function DestinationCard({ destination, menuSlug, detailHref, variant, region, tags = [] }) {
  const [imageFailed, setImageFailed] = useState(false)
  const fallbackImg = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600'
  const image = resolveImageUrl(destination.image) || fallbackImg
  const detailKey = destination.slug || destination.id
  const href = detailHref || (detailKey
    ? menuSlug ? `/${menuSlug}/${detailKey}` : `/destinations/${detailKey}`
    : '')

  if (variant === 'india') {
    const name = typeof destination.name === 'string' ? destination.name.trim() : ''
    const tagline = typeof destination.tagline === 'string' ? destination.tagline.trim() : ''
    const description = typeof destination.shortDescription === 'string' && destination.shortDescription.trim()
      ? destination.shortDescription.trim()
      : typeof destination.description === 'string' ? destination.description.trim() : ''
    const displayTags = [...new Set((Array.isArray(tags) ? tags : [])
      .filter(tag => typeof tag === 'string')
      .map(tag => tag.trim())
      .filter(Boolean))].slice(0, 3)

    if (!name || !href) return null

    return (
      <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <Link to={href} className="relative block aspect-[16/9] overflow-hidden bg-slate-100" aria-label={`View ${name} details`}>
          <img
            src={imageFailed ? fallbackImg : image}
            alt={name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {typeof region === 'string' && region.trim() && (
            <span className="absolute right-3 top-3 inline-flex max-w-[80%] items-center gap-1.5 truncate rounded-full bg-sky-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
              <MapPin size={12} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{region.trim()}</span>
            </span>
          )}
        </Link>

        <div className="flex min-h-[220px] flex-1 flex-col p-4">
          <h3 className="flex items-start gap-2 text-base font-bold leading-snug text-navy-900 sm:text-lg">
            <MapPin size={17} className="mt-0.5 shrink-0 text-orange-600" aria-hidden="true" />
            <span>{name}</span>
          </h3>
          {tagline && <p className="mt-1 pl-6 text-sm text-navy-500">{tagline}</p>}

          {displayTags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${name} categories and highlights`}>
              {displayTags.map((tag, index) => (
                <li key={`${tag}-${index}`} className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-800">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-600">{description}</p>}

          <Link
            to={href}
            className="mt-auto flex min-h-10 items-center justify-center gap-2 rounded-lg border border-sky-600 px-3 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
          >
            View Details <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </article>
    )
  }

  return (
    <Link to={href} className="group block bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-44 overflow-hidden">
        <img
          src={imageFailed ? fallbackImg : image}
          alt={destination.name}
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg">{destination.name}</h3>
          {destination.tagline && (
            <p className="text-white/80 text-xs">{destination.tagline}</p>
          )}
        </div>
      </div>
      <div className="p-3 flex items-center justify-between text-xs text-navy-500">
        {destination.bestTime && (
          <span className="flex items-center gap-1"><Calendar size={12} /> {destination.bestTime}</span>
        )}
        {destination.country && (
          <span className="flex items-center gap-1"><MapPin size={12} /> {destination.country}</span>
        )}
      </div>
    </Link>
  )
}
