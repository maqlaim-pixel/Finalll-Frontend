import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import SEOHead from '../components/common/SEOHead'
import { LOCAL_TRAVEL_SERVICES } from '../data/megaMenuData'
import { LocalTravelServiceIcon } from '../components/mega/MegaMenu'

export default function LocalTravelServicePage() {
  const { service } = useParams()
  const selectedService = LOCAL_TRAVEL_SERVICES.find(item => item.href.endsWith(`/${service}`))

  if (!selectedService) {
    return (
      <section className="section-padding bg-white">
        <div className="container-wide">
          <h1 className="text-3xl font-display font-bold text-navy-900">Local travel service not found</h1>
          <Link to="/guides/travel-tips" className="mt-4 inline-flex items-center gap-2 text-sky-700 hover:text-sky-900">
            <ArrowLeft size={16} /> Return to Travel Tips
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-white">
      <SEOHead
        title={`${selectedService.label} | TravelVista Local Travel`}
        description={`Request ${selectedService.label.toLowerCase()} with TravelVista. Contact our team to plan reliable local transportation and travel services.`}
      />
      <section className="relative bg-gradient-to-br from-navy-900 to-sky-900 py-16 text-white">
        <div className="container-wide">
          <Link to="/guides/travel-tips" className="mb-6 inline-flex items-center gap-2 text-sm text-sky-100 transition-colors hover:text-white">
            <ArrowLeft size={16} /> Local Travel
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <LocalTravelServiceIcon name={selectedService.icon} size={28} />
            </div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">{selectedService.label}</h1>
          </div>
          <p className="mt-5 max-w-3xl text-sky-100">
            Book reliable local transportation and travel services with TravelVista. Contact our team to plan a service that suits your journey.
          </p>
          <Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-3 font-bold text-navy-900 transition-colors hover:bg-gold-600">
            Enquire Now <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <h2 className="mb-6 font-display text-2xl font-bold text-navy-900">Explore Local Travel Services</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LOCAL_TRAVEL_SERVICES.filter(item => item.href !== selectedService.href).map(item => (
              <Link key={item.href} to={item.href} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-navy-700 transition-colors hover:border-sky-300 hover:text-sky-700">
                <LocalTravelServiceIcon name={item.icon} className="shrink-0 text-sky-700" />
                <span className="flex-1 font-medium">{item.label}</span>
                <ArrowRight size={16} className="shrink-0 text-sky-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
