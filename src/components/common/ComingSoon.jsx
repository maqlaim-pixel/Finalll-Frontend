import { Link } from 'react-router-dom'
import { Clock, Phone, Mail, ArrowRight } from 'lucide-react'

/**
 * Reusable "Coming Soon" empty-state component.
 * Shown when a category has no packages yet.
 *
 * Props:
 *  - categoryName: string — e.g. "Goa" / "Honeymoon Getaways" / "UAE"
 *  - description:   string — optional custom description
 *  - icon:          string — emoji (default 🚧)
 */
export default function ComingSoon({
  categoryName = 'this destination',
  description,
  icon = '🚧',
}) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
      {/* Icon */}
      <div className="text-6xl mb-4">{icon}</div>

      {/* Heading */}
      <h3 className="text-2xl font-bold text-navy-900 mb-2">
        {categoryName} Packages — Coming Soon!
      </h3>

      {/* Description */}
      <p className="text-navy-500 max-w-md mx-auto mb-1">
        {description ||
          `We\u2019re curating amazing ${categoryName} travel packages for you.`}
      </p>
      <p className="text-navy-400 text-sm mb-8">
        Check back soon or contact us for a custom {categoryName} itinerary.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg"
        >
          <Phone size={18} /> Contact Us for Custom Trip
        </Link>

        <Link
          to="/plan-trip"
          className="inline-flex items-center gap-2 border-2 border-sky-600 text-sky-600 hover:bg-sky-50 px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Plan My Trip <ArrowRight size={16} />
        </Link>
      </div>

      {/* Contact info */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-navy-500">
        <span className="flex items-center gap-2">
          <Phone size={14} className="text-sky-500" /> +91 93137 10465
        </span>
        <span className="flex items-center gap-2">
          <Mail size={14} className="text-sky-500" /> info@maqlaimtours.com
        </span>
        <span className="flex items-center gap-2">
          <Clock size={14} className="text-sky-500" /> 24x7 Support
        </span>
      </div>
    </div>
  )
}
