import { useParams } from 'react-router-dom'
import { MapPin, Star, Check, Wifi, Car, UtensilsCrossed, Dumbbell, Waves, Camera } from 'lucide-react'
import SEOHead from '../../components/common/SEOHead'

const HOTEL = {
  name: 'The Grand Palace Resort',
  location: 'Jaipur, Rajasthan',
  rating: 4.8,
  reviews: 342,
  price: 8500,
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
  description: 'A luxurious heritage resort nestled in the Pink City, offering royal Rajasthani hospitality with modern amenities. Experience the grandeur of Rajasthan with stunning architecture, lush gardens, and world-class dining.',
  amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Restaurant', 'Room Service', 'Parking', 'Gym', 'Garden', 'Conference Hall', 'Airport Transfer'],
  rooms: [
    { name: 'Deluxe Room', price: 8500, features: ['King Bed', 'Garden View', '32 sqm', 'AC'] },
    { name: 'Heritage Suite', price: 15000, features: ['Suite', 'Courtyard View', '50 sqm', 'Bathtub'] },
    { name: 'Royal Palace Suite', price: 35000, features: ['Premium Suite', 'Lake View', '80 sqm', 'Private Pool'] },
  ],
}

export default function HotelDetail() {
  return (
    <div className="bg-gray-50">
      {/* This detail view still renders a sample property for every slug, so it is
          kept out of Google's index until each hotel has real published content. */}
      <SEOHead
        title={`${HOTEL.name} | Maqlaim Tours`}
        description={HOTEL.description}
        image={HOTEL.image}
        noindex
      />
      <section className="relative h-[45vh] min-h-[350px]">
        <img src={HOTEL.image} alt={HOTEL.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 container-wide py-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{HOTEL.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1"><MapPin size={14} /> {HOTEL.location}</span>
            <span className="flex items-center gap-1"><Star size={14} className="text-gold-400 fill-gold-400" /> {HOTEL.rating} ({HOTEL.reviews} reviews)</span>
          </div>
        </div>
      </section>

      <div className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-display font-bold text-navy-900 mb-3">About</h2>
                <p className="text-navy-600 leading-relaxed">{HOTEL.description}</p>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-display font-bold text-navy-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {HOTEL.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 text-navy-700 text-sm"><Check size={14} className="text-sky-500" /> {a}</div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-display font-bold text-navy-900 mb-4">Room Types</h2>
                <div className="space-y-4">
                  {HOTEL.rooms.map(room => (
                    <div key={room.name} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-navy-900">{room.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {room.features.map(f => <span key={f} className="text-xs bg-navy-50 text-navy-600 px-2 py-1 rounded">{f}</span>)}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-bold text-sky-600">₹{room.price.toLocaleString()}</p>
                        <p className="text-xs text-navy-500">/night</p>
                        <button className="btn-primary text-xs mt-2 !px-4 !py-1.5">Book Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside>
              <div className="bg-white rounded-xl border p-6 sticky top-24 space-y-6">
                <div>
                  <p className="text-sm text-navy-500 mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-sky-600">₹{HOTEL.price.toLocaleString()}<span className="text-sm font-normal text-navy-500">/night</span></p>
                </div>
                <button className="w-full btn-primary">Check Availability</button>
                <button className="w-full btn-secondary">Enquire Now</button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
