import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react'
import api from '../../services/api'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }))
  const submit = async event => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      await api.post('/contact-enquiries', form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' })
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to send your message right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
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
                {success && <div role="status" className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"><CheckCircle2 size={20} className="mt-0.5 shrink-0" /><p>Thank you for contacting Maqlaim Tours. Our team will get back to you shortly.</p></div>}
                {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
                <form className="space-y-5" onSubmit={submit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
                      <input type="text" required maxLength={150} autoComplete="name" value={form.name} onChange={event => update('name', event.target.value)} placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
                      <input type="email" required maxLength={150} autoComplete="email" value={form.email} onChange={event => update('email', event.target.value)} placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Phone</label>
                      <input type="tel" required maxLength={30} autoComplete="tel" value={form.phone} onChange={event => update('phone', event.target.value)} placeholder="+91 93137 10465" className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">Subject</label>
                      <select value={form.subject} onChange={event => update('subject', event.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none">
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
                    <textarea rows={5} required maxLength={10000} value={form.message} onChange={event => update('message', event.target.value)} placeholder="Tell us about your travel plans..." className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
                    {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Send Message</>}
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
