import { useState } from 'react'
import { Settings, Save, Globe, Phone, Mail, MapPin, Image } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    brand_name: 'MAQLAIM TOURS',
    tagline: 'Explore the World with Confidence',
    phone: '+91 93137 10465',
    whatsapp: '+91 93137 10465',
    email: 'sales@maqlaimtours.com',
    address: '42, Marine Drive, Mumbai, Maharashtra 400001',
    business_hours: 'Mon-Sat: 9:00 AM - 8:00 PM IST',
    facebook: 'https://facebook.com/travelvista',
    instagram: 'https://instagram.com/travelvista',
    youtube: 'https://youtube.com/travelvista',
    twitter: 'https://twitter.com/travelvista',
    seo_title: 'MAQLAIM TOURS - Premium Travel Packages & Destinations',
    seo_description: 'Discover handcrafted travel experiences across India and beyond.',
  })

  const handleChange = (key, value) => setSettings(prev => ({ ...prev, [key]: value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Site Settings</h1>
        <button className="btn-primary text-sm flex items-center gap-2"><Save size={16} /> Save Settings</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Settings */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-navy-900 flex items-center gap-2"><Settings size={18} /> Brand Settings</h2>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Brand Name</label>
            <input value={settings.brand_name} onChange={e => handleChange('brand_name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Tagline</label>
            <input value={settings.tagline} onChange={e => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-navy-900 flex items-center gap-2"><Phone size={18} /> Contact Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Phone</label>
              <input value={settings.phone} onChange={e => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">WhatsApp</label>
              <input value={settings.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
            <input value={settings.email} onChange={e => handleChange('email', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Address</label>
            <textarea value={settings.address} onChange={e => handleChange('address', e.target.value)} rows={2}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-navy-900 flex items-center gap-2"><Globe size={18} /> Social Links</h2>
          {['facebook', 'instagram', 'youtube', 'twitter'].map(s => (
            <div key={s}>
              <label className="block text-sm font-medium text-navy-700 mb-1 capitalize">{s}</label>
              <input value={settings[s]} onChange={e => handleChange(s, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
            </div>
          ))}
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-navy-900 flex items-center gap-2"><Image size={18} /> SEO Defaults</h2>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Default SEO Title</label>
            <input value={settings.seo_title} onChange={e => handleChange('seo_title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Default Meta Description</label>
            <textarea value={settings.seo_description} onChange={e => handleChange('seo_description', e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
