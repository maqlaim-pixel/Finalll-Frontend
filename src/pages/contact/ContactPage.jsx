import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-navy-900 to-sky-900 text-white py-16">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Contact Us</h1>
          <p className="text-navy-200 max-w-xl mx-auto">We'd love to hear from you. Reach out for bookings, enquiries, or just to say hello!</p>
        </div>
      </section>

      <div className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-6">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4"><Phone size={22} className="text-sky-600" /></div>
                <h3 className="font-bold text-navy-900 mb-1">Phone</h3>
                <p className="text-navy-600 text-sm">+91 93137 10465</p>
                <p className="text-navy-600 text-sm">+91 93137 10465</p>
              </div>
              <div className="bg-white rounded-xl border p-6">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4"><Mail size={22} className="text-sky-600" /></div>
                <h3 className="font-bold text-navy-900 mb-1">Email</h3>
                <p className="text-navy-600 text-sm">sales@maqlaimtours.com</p>
                <p className="text-navy-600 text-sm">sales@maqlaimtours.com</p>
              </div>
              <div className="bg-white rounded-xl border p-6">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4"><MapPin size={22} className="text-sky-600" /></div>
                <h3 className="font-bold text-navy-900 mb-1">Office</h3>
                <p className="text-navy-600 text-sm">42, Marine Drive<br />Mumbai, Maharashtra 400001</p>
              </div>
              <div className="bg-white rounded-xl border p-6">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4"><Clock size={22} className="text-sky-600" /></div>
                <h3 className="font-bold text-navy-900 mb-1">Hours</h3>
                <p className="text-navy-600 text-sm">Mon – Sat: 9:00 AM – 8:00 PM<br />Sunday: 10:00 AM – 5:00 PM</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border p-8">
                <h2 className="text-2xl font-display font-bold text-navy-900 mb-6">Send Us a Message</h2>
                <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
                      <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Phone</label>
                      <input type="tel" placeholder="+91 93137 10465" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Subject</label>
                      <select className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none">
                        <option>General Enquiry</option>
                        <option>Package Booking</option>
                        <option>Custom Trip</option>
                        <option>Corporate Travel</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">Message</label>
                    <textarea rows={5} placeholder="Tell us about your travel plans..." className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" />
                  </div>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Send size={16} /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
