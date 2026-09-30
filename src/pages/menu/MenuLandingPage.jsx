import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ComingSoonPage, NotFoundPage } from '../common/ComingSoonPage'
import { getKnownMenuRouteName, isKnownMenuRoute } from '../../utils/menuRouteIndex'
import api from '../../services/api'
import SEOHead from '../../components/common/SEOHead'
import Breadcrumb from '../../components/common/Breadcrumb'
import DestinationCard from '../../components/common/DestinationCard'
import PackageCard from '../../components/common/PackageCard'
import { Loader2, ArrowRight, MapPin } from 'lucide-react'

export default function MenuLandingPage() {
  const location = useLocation()
  const menuSlug = location.pathname.split('/')[1] || 'india'
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setMenu(null)
    setError('')
    api.get(`/menus/${menuSlug}`)
      .then(res => setMenu(res.data))
      .catch(err => setError(err.response?.status === 404 ? 'Page not found' : 'Unable to load page'))
      .finally(() => setLoading(false))
  }, [menuSlug])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-sky-600" size={32} />
      <span className="ml-3 text-navy-500">Loading...</span>
    </div>
  )

  if (error || !menu) {
    return isKnownMenuRoute(location.pathname)
      ? <ComingSoonPage pageName={getKnownMenuRouteName(location.pathname)} />
      : <NotFoundPage />
  }


  const destinations = menu.destinations || []
  const topPackages = menu.topPackages || []
  const destinationsByType = menu.destinationsByType || {}

  return (
    <>
      <SEOHead
        title={menu.seoTitle || menu.pageTitle || menu.name}
        description={menu.seoDescription || menu.pageSubtitle || ''}
        keywords={menu.seoKeywords || ''}
      />

      {/* Hero Section */}
      <section className="relative h-[420px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={menu.pageHeroImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200'}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/40 to-transparent" />
        </div>
        <div className="relative wrap pb-10">
          <Breadcrumb items={[{ label: menu.name }]} />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
            {menu.pageTitle || menu.name}
          </h1>
          {menu.pageSubtitle && (
            <p className="text-lg text-white/80 max-w-2xl">{menu.pageSubtitle}</p>
          )}
        </div>
      </section>

      {/* Destinations Section */}
      {destinations.length > 0 && (
        <section className="wrap py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-navy-900">
                Explore {menu.name} Destinations
              </h2>
              <p className="text-navy-500 mt-1">{destinations.length} destinations to explore</p>
            </div>
          </div>

          {/* Domestic destinations */}
          {destinationsByType.domestic && destinationsByType.domestic.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-sky-600" /> Domestic Destinations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {destinationsByType.domestic.map(d => (
                  <DestinationCard key={d.id} destination={d} menuSlug={menu.slug} />
                ))}
              </div>
            </div>
          )}

          {/* International destinations */}
          {destinationsByType.international && destinationsByType.international.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-navy-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-sky-600" /> International Destinations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {destinationsByType.international.map(d => (
                  <DestinationCard key={d.id} destination={d} menuSlug={menu.slug} />
                ))}
              </div>
            </div>
          )}

          {/* All destinations if not split by type */}
          {destinationsByType.domestic === undefined && destinationsByType.international === undefined && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {destinations.map(d => (
                <DestinationCard key={d.id} destination={d} menuSlug={menu.slug} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Top Packages Section */}
      {topPackages.length > 0 && (
        <section className="wrap py-12 bg-gray-50 -mx-4 px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-navy-900">
                Popular {menu.name} Packages
              </h2>
              <p className="text-navy-500 mt-1">Handpicked packages for your next trip</p>
            </div>
            <Link to="/packages" className="flex items-center gap-1 text-sky-600 hover:underline text-sm font-medium">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* SEO Content Section */}
      {menu.pageContent && (
        <section className="wrap py-12">
          <div className="prose max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: menu.pageContent }} />
        </section>
      )}

      {/* CTA Section */}
      <section className="wrap py-12">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
            Ready to Explore {menu.name}?
          </h2>
          <p className="text-sky-100 mb-6 max-w-xl mx-auto">
            Talk to our travel experts and plan your perfect trip today.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/packages" className="bg-white text-sky-700 px-6 py-3 rounded-lg font-medium hover:bg-sky-50 transition-colors">
              Browse Packages
            </Link>
            <Link to="/contact" className="border border-white/40 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
