import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const FOOTER_LINKS = {
  Explore: [
    { label: 'Destinations', href: '/destinations' },
    { label: 'Packages', href: '/packages' },
    { label: 'Hotels', href: '/hotels' },
    { label: 'Activities', href: '/activities' },
    { label: 'Offers', href: '/offers' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '/contact' },
    { label: 'Plan My Trip', href: '/plan-trip' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Cancellation Policy', href: '#' },
    { label: 'FAQs', href: '#' },
  ],
}

export default function PublicFooter() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* Newsletter */}
      <div className="border-b border-navy-700">
        <div className="container-wide py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-display font-bold">Get travel inspiration in your inbox.</h3>
              <p className="text-navy-300 mt-1">Subscribe for exclusive deals, travel guides, and destination tips.</p>
            </div>
            <form className="flex w-full md:w-auto gap-2" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-navy-800 border border-navy-600 text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
              <button type="submit" className="btn-gold !px-6"><Send size={18} /></button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/maqlaim-tours-logo.jpeg" alt="MAQLAIM TOURS — Explore The Purity of New Destinations" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-navy-300 text-sm leading-relaxed mb-4">Your trusted travel partner for curated destinations, premium packages, and unforgettable experiences across India and the world.</p>
            <div className="space-y-2 text-sm text-navy-400">
              <p className="flex items-center gap-2"><Phone size={14} /> +91 93137 10465</p>
              <p className="flex items-center gap-2"><Mail size={14} /> sales@maqlaimtours.com</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> Mumbai, India</p>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-navy-300 hover:text-gold-400 transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-navy-700">
        <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-navy-400">
          <p>&copy; {new Date().getFullYear()} MAQLAIM TOURS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold-400 transition-colors">Facebook</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Instagram</a>
            <a href="#" className="hover:text-gold-400 transition-colors">YouTube</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
