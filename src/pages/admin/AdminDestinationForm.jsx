import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Upload, Eye, FileText } from 'lucide-react'
import api from '../../services/api'
import ImageUpload from '../../components/admin/ImageUpload'
import { parseImageList } from '../../utils/imageUtils'

const TABS = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'About' },
  { key: 'attractions', label: 'Attractions' },
  { key: 'experiences', label: 'Food & Experiences' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'quickinfo', label: 'Quick Info' },
  { key: 'packages', label: 'Packages' },
  { key: 'seo', label: 'SEO' },
]

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
const labelClass = "block text-sm font-medium text-navy-700 mb-1"
const sectionClass = "bg-white rounded-xl border border-gray-200 p-6 space-y-4"

function parseJson(str) { if (!str) return []; try { const a = JSON.parse(str); return Array.isArray(a) ? a : [] } catch { return [] } }
function toJson(arr) { return JSON.stringify(arr) }

export default function AdminDestinationForm() {
  const navigate = useNavigate()
  const { id } = useParams()

//    return (
//   <div style={{ padding: '40px', fontSize: '30px' }}>
//     TEST — Destination Form Works
//   </div>
// )
  const isEdit = !!id
  const [activeTab, setActiveTab] = useState('basic')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)
  const textFileRef = useRef(null)

 

  const [form, setForm] = useState({
    name: '', slug: '', country: 'India', state: '', type: 'domestic',
    description: '', shortDescription: '', image: '', tagline: '',
    bestTime: '', avgTemp: '', languages: '', highlights: '',
    packageCount: 0, status: 'draft', featured: false, isFamous: false, sortOrder: 0,
    // Hero
    heroImages: '', heroTitle: '', heroSubtitle: '', heroCtaText: 'Explore Packages', heroCtaUrl: '',
    // About
    aboutTitle: '', aboutContent: '', aboutImage: '', aboutImagePosition: 'right',
    // Attractions, Experiences, Highlights, Quick Info (stored as JSON strings)
    attractions: '[]', experiences: '[]', destinationHighlights: '[]', quickInfo: '[]',
    // Section visibility
    showAttractions: true, showExperiences: true, showHighlights: true, showPackages: true, showQuickInfo: true,
    // Packages
    packagesComingSoon: false, packagesComingSoonText: '',
    // SEO
    seoTitle: '', seoDescription: '', ogTitle: '', ogDescription: '', ogImage: '', canonicalUrl: '', noIndex: false,
  })

  // Editable arrays (parsed from JSON)
  const [heroImagesList, setHeroImagesList] = useState([])
  const [attractionsList, setAttractionsList] = useState([])
  const [experiencesList, setExperiencesList] = useState([])
  const [highlightsList, setHighlightsList] = useState([])
  const [quickInfoList, setQuickInfoList] = useState([])

  useEffect(() => {
    if (isEdit) {
      api.get(`/destinations/${id}`).then(res => {
        const d = res.data
        const f = { ...form }
        Object.keys(d).forEach(k => { if (d[k] !== null && d[k] !== undefined && f.hasOwnProperty(k)) f[k] = d[k] })
        setForm(f)
        // Parse hero images (comma-separated / single URL / JSON array) into ImageUpload format
        if (d.heroImages) {
          console.log('[DestinationForm] heroImages from API:', d.heroImages)
          const urls = parseImageList(d.heroImages)
          console.log('[DestinationForm] Parsed hero image URLs:', urls)
          setHeroImagesList(urls.map(url => ({ url, isUploaded: true })))
        }
        setAttractionsList(parseJson(d.attractions))
        setExperiencesList(parseJson(d.experiences))
        setHighlightsList(parseJson(d.destinationHighlights))
        setQuickInfoList(parseJson(d.quickInfo))
      })
    }
  }, [id, isEdit])

  // Sync arrays back to form JSON before save
  useEffect(() => {
    setForm(prev => ({ ...prev,
      heroImages: heroImagesList.map(img => img.url).join(', '),
      attractions: toJson(attractionsList),
      experiences: toJson(experiencesList),
      destinationHighlights: toJson(highlightsList),
      quickInfo: toJson(quickInfoList),
    }))
  }, [heroImagesList, attractionsList, experiencesList, highlightsList, quickInfoList])

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const autoSlug = (name) => { set('name', name); set('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) }

  const handleTextImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target.result
      if (window.confirm('Import this text into the About section? This will replace the current content.')) {
        set('aboutContent', content)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { ...form }
    console.log('[DestinationForm] Destination images before save:', heroImagesList)
    console.log('[DestinationForm] Save payload heroImages:', payload.heroImages)
    try {
      if (isEdit) await api.put(`/destinations/${id}`, payload)
      else await api.post('/destinations', payload)
      navigate('/admin/destinations')
    } catch (err) { setError(err.response?.data?.error || 'Failed to save') }
    finally { setSaving(false) }
  }

  const slugUrl = `/destinations/${form.slug || '...'}`

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/destinations" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold text-navy-900">{isEdit ? 'Edit' : 'Add'} Destination</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href={slugUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm text-navy-700 hover:bg-gray-50"><Eye size={16} /> Preview</a>
          <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Tab Bar */}
        <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-4 sticky top-0 z-20">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t.key ? 'border-sky-600 text-sky-600' : 'border-transparent text-navy-500 hover:text-navy-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6">
          {/* ═══ BASIC INFO ═══ */}
          {activeTab === 'basic' && (
            <div className={sectionClass + ' !bg-transparent !p-0 !border-0'}>
              <h2 className="font-bold text-navy-900 text-lg mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Name *</label><input className={inputClass} value={form.name} onChange={e => autoSlug(e.target.value)} required /></div>
                <div><label className={labelClass}>Slug *</label><input className={inputClass} value={form.slug} onChange={e => set('slug', e.target.value)} required /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className={labelClass}>Country</label><input className={inputClass} value={form.country} onChange={e => set('country', e.target.value)} /></div>
                <div><label className={labelClass}>State/Region</label><input className={inputClass} value={form.state} onChange={e => set('state', e.target.value)} /></div>
                <div><label className={labelClass}>Type</label><select className={inputClass} value={form.type} onChange={e => set('type', e.target.value)}><option value="domestic">Domestic</option><option value="international">International</option></select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Tagline</label><input className={inputClass} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="The White Desert of India" /></div>
                <div><label className={labelClass}>Best Time to Visit</label><input className={inputClass} value={form.bestTime} onChange={e => set('bestTime', e.target.value)} placeholder="October to March" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Average Temperature</label><input className={inputClass} value={form.avgTemp} onChange={e => set('avgTemp', e.target.value)} placeholder="25°C" /></div>
                <div><label className={labelClass}>Languages</label><input className={inputClass} value={form.languages} onChange={e => set('languages', e.target.value)} placeholder="Gujarati, Hindi, English" /></div>
              </div>
              <div><label className={labelClass}>Short Description</label><textarea className={inputClass + " resize-none"} rows={2} value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} /></div>
              <div><label className={labelClass}>Description</label><textarea className={inputClass + " resize-none"} rows={4} value={form.description} onChange={e => set('description', e.target.value)} /></div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div><label className={labelClass}>Status</label><select className={inputClass + " w-40"} value={form.status} onChange={e => set('status', e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></div>
                <label className="flex items-center gap-2 text-sm mt-5"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="rounded" /> Featured</label>
                <label className="flex items-center gap-2 text-sm mt-5"><input type="checkbox" checked={form.isFamous} onChange={e => set('isFamous', e.target.checked)} className="rounded" /> Famous destination</label>
              </div>
            </div>
          )}

          {/* ═══ HERO ═══ */}
          {activeTab === 'hero' && (
            <div className={sectionClass + ' !bg-transparent !p-0 !border-0'}>
              <h2 className="font-bold text-navy-900 text-lg mb-4">Hero Section</h2>
              <ImageUpload
                label="Hero Images (up to 3 — first image is primary, images display as carousel)"
                images={heroImagesList}
                onChange={setHeroImagesList}
                maxImages={3}
              />
              <div className="mt-3">
                <label className={labelClass}>Or paste image URLs (comma-separated)</label>
                <textarea className={inputClass + " resize-none"} rows={2} value={form.heroImages} onChange={e => set('heroImages', e.target.value)} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
                <p className="text-xs text-navy-400 mt-1">This field syncs with uploaded images above</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Hero Title</label><input className={inputClass} value={form.heroTitle} onChange={e => set('heroTitle', e.target.value)} placeholder="Rann of Kutch" /></div>
                <div><label className={labelClass}>Hero Subtitle</label><input className={inputClass} value={form.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} placeholder="Experience the endless white salt desert" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>CTA Button Text</label><input className={inputClass} value={form.heroCtaText} onChange={e => set('heroCtaText', e.target.value)} placeholder="Explore Packages" /></div>
                <div><label className={labelClass}>CTA Button URL</label><input className={inputClass} value={form.heroCtaUrl} onChange={e => set('heroCtaUrl', e.target.value)} placeholder="/packages" /></div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <label className={labelClass}>Import Text File for About Section</label>
                <div className="flex items-center gap-3">
                  <input ref={textFileRef} type="file" accept=".txt" className="hidden" onChange={handleTextImport} />
                  <button type="button" onClick={() => textFileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    <FileText size={16} /> Import .txt File
                  </button>
                  <span className="text-xs text-navy-400">Reads content from a text file into the About section</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══ ABOUT ═══ */}
          {activeTab === 'about' && (
            <div className={sectionClass + ' !bg-transparent !p-0 !border-0'}>
              <h2 className="font-bold text-navy-900 text-lg mb-4">About Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>About Title</label><input className={inputClass} value={form.aboutTitle} onChange={e => set('aboutTitle', e.target.value)} placeholder="About Rann of Kutch" /></div>
                <div><label className={labelClass}>Image Position</label><select className={inputClass} value={form.aboutImagePosition} onChange={e => set('aboutImagePosition', e.target.value)}><option value="right">Right</option><option value="left">Left</option></select></div>
              </div>
              <div><label className={labelClass}>About Content</label><textarea className={inputClass + " resize-none"} rows={8} value={form.aboutContent} onChange={e => set('aboutContent', e.target.value)} placeholder="Write rich content about this destination..." /></div>
              <ImageUpload
                label="About Image"
                images={form.aboutImage ? [{ url: form.aboutImage, isUploaded: true }] : []}
                onChange={(imgs) => set('aboutImage', imgs.length > 0 ? imgs[0].url : '')}
                maxImages={1}
              />
            </div>
          )}

          {/* ═══ ATTRACTIONS ═══ */}
          {activeTab === 'attractions' && (
            <div className={sectionClass + ' !bg-transparent !p-0 !border-0'}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy-900 text-lg">Top Attractions</h2>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.showAttractions} onChange={e => set('showAttractions', e.target.checked)} /> Show Section</label>
              </div>
              <p className="text-sm text-navy-500 mb-4">Add up to 6 featured attractions for this destination.</p>
              {attractionsList.map((a, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-navy-700 text-sm">Attraction {i + 1}</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={a.isActive !== false} onChange={e => { const copy = [...attractionsList]; copy[i] = { ...copy[i], isActive: e.target.checked }; setAttractionsList(copy) }} /> Active</label>
                      <button type="button" onClick={() => setAttractionsList(attractionsList.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className={inputClass} placeholder="Title" value={a.title || ''} onChange={e => { const copy = [...attractionsList]; copy[i] = { ...copy[i], title: e.target.value }; setAttractionsList(copy) }} />
                    <input className={inputClass} placeholder="Location" value={a.location || ''} onChange={e => { const copy = [...attractionsList]; copy[i] = { ...copy[i], location: e.target.value }; setAttractionsList(copy) }} />
                  </div>
                  <ImageUpload
                    label={`Attraction ${i + 1} Image`}
                    images={a.image ? [{ url: a.image, isUploaded: true }] : []}
                    onChange={(imgs) => { const copy = [...attractionsList]; copy[i] = { ...copy[i], image: imgs.length > 0 ? imgs[0].url : '' }; setAttractionsList(copy) }}
                    maxImages={1}
                    className="mt-2"
                  />
                  <textarea className={inputClass + " resize-none"} rows={2} placeholder="Description" value={a.description || ''} onChange={e => { const copy = [...attractionsList]; copy[i] = { ...copy[i], description: e.target.value }; setAttractionsList(copy) }} />
                </div>
              ))}
              {attractionsList.length < 6 && (
                <button type="button" onClick={() => setAttractionsList([...attractionsList, { title: '', image: '', description: '', location: '', displayOrder: attractionsList.length + 1, isActive: true }])} className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium"><Plus size={16} /> Add Attraction</button>
              )}
            </div>
          )}

          {/* ═══ FOOD & EXPERIENCES ═══ */}
          {activeTab === 'experiences' && (
            <div className={sectionClass + ' !bg-transparent !p-0 !border-0'}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy-900 text-lg">Food & Local Experiences</h2>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.showExperiences} onChange={e => set('showExperiences', e.target.checked)} /> Show Section</label>
              </div>
              {experiencesList.map((e, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-navy-700 text-sm">Experience {i + 1}</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={e.isActive !== false} onChange={ev => { const copy = [...experiencesList]; copy[i] = { ...copy[i], isActive: ev.target.checked }; setExperiencesList(copy) }} /> Active</label>
                      <button type="button" onClick={() => setExperiencesList(experiencesList.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input className={inputClass} placeholder="Title" value={e.title || ''} onChange={ev => { const copy = [...experiencesList]; copy[i] = { ...copy[i], title: ev.target.value }; setExperiencesList(copy) }} />
                    <input className={inputClass} placeholder="Category (Food, Cultural, etc.)" value={e.category || ''} onChange={ev => { const copy = [...experiencesList]; copy[i] = { ...copy[i], category: ev.target.value }; setExperiencesList(copy) }} />
                    <input className={inputClass} placeholder="Price" value={e.price || ''} onChange={ev => { const copy = [...experiencesList]; copy[i] = { ...copy[i], price: ev.target.value }; setExperiencesList(copy) }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className={inputClass} placeholder="Duration" value={e.duration || ''} onChange={ev => { const copy = [...experiencesList]; copy[i] = { ...copy[i], duration: ev.target.value }; setExperiencesList(copy) }} />
                    <input className={inputClass} placeholder="Location" value={e.location || ''} onChange={ev => { const copy = [...experiencesList]; copy[i] = { ...copy[i], location: ev.target.value }; setExperiencesList(copy) }} />
                  </div>
                  <ImageUpload
                    label={`Experience ${i + 1} Image`}
                    images={e.image ? [{ url: e.image, isUploaded: true }] : []}
                    onChange={(imgs) => { const copy = [...experiencesList]; copy[i] = { ...copy[i], image: imgs.length > 0 ? imgs[0].url : '' }; setExperiencesList(copy) }}
                    maxImages={1}
                    className="mt-2"
                  />
                  <textarea className={inputClass + " resize-none"} rows={2} placeholder="Description" value={e.description || ''} onChange={ev => { const copy = [...experiencesList]; copy[i] = { ...copy[i], description: ev.target.value }; setExperiencesList(copy) }} />
                </div>
              ))}
              <button type="button" onClick={() => setExperiencesList([...experiencesList, { title: '', image: '', description: '', category: '', price: '', duration: '', location: '', displayOrder: experiencesList.length + 1, isActive: true }])} className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium"><Plus size={16} /> Add Experience</button>
            </div>
          )}

          {/* ═══ HIGHLIGHTS ═══ */}
          {activeTab === 'highlights' && (
            <div className={sectionClass + ' !bg-transparent !p-0 !border-0'}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy-900 text-lg">Highlights</h2>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.showHighlights} onChange={e => set('showHighlights', e.target.checked)} /> Show Section</label>
              </div>
              {highlightsList.map((h, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-navy-700 text-sm">Highlight {i + 1}</span>
                    <button type="button" onClick={() => setHighlightsList(highlightsList.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className={inputClass} placeholder="Title" value={h.title || ''} onChange={e => { const copy = [...highlightsList]; copy[i] = { ...copy[i], title: e.target.value }; setHighlightsList(copy) }} />
                    <input className={inputClass} placeholder="Description" value={h.description || ''} onChange={e => { const copy = [...highlightsList]; copy[i] = { ...copy[i], description: e.target.value }; setHighlightsList(copy) }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Icon Name (calendar, star, mountain, sparkles, music, camera, award, car, plane, etc.)</label>
                      <input className={inputClass} placeholder="star" value={h.icon || ''} onChange={e => { const copy = [...highlightsList]; copy[i] = { ...copy[i], icon: e.target.value }; setHighlightsList(copy) }} />
                    </div>
                    <ImageUpload
                      label="Highlight Image (optional)"
                      images={h.image ? [{ url: h.image, isUploaded: true }] : []}
                      onChange={(imgs) => { const copy = [...highlightsList]; copy[i] = { ...copy[i], image: imgs.length > 0 ? imgs[0].url : '' }; setHighlightsList(copy) }}
                      maxImages={1}
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setHighlightsList([...highlightsList, { title: '', description: '', icon: 'star', displayOrder: highlightsList.length + 1, isActive: true }])} className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium"><Plus size={16} /> Add Highlight</button>
            </div>
          )}

          {/* ═══ QUICK INFO ═══ */}
          {activeTab === 'quickinfo' && (
            <div className={sectionClass + ' !bg-transparent !p-0 !border-0'}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy-900 text-lg">Quick Info</h2>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.showQuickInfo} onChange={e => set('showQuickInfo', e.target.checked)} /> Show Section</label>
              </div>
              <p className="text-sm text-navy-500 mb-4">Add key information fields that appear in the sidebar.</p>
              {quickInfoList.map((q, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <input className={inputClass + " w-40"} placeholder="Label" value={q.label || ''} onChange={e => { const copy = [...quickInfoList]; copy[i] = { ...copy[i], label: e.target.value }; setQuickInfoList(copy) }} />
                  <input className={inputClass + " flex-1"} placeholder="Value" value={q.value || ''} onChange={e => { const copy = [...quickInfoList]; copy[i] = { ...copy[i], value: e.target.value }; setQuickInfoList(copy) }} />
                  <input className={inputClass + " w-28"} placeholder="Icon" value={q.icon || ''} onChange={e => { const copy = [...quickInfoList]; copy[i] = { ...copy[i], icon: e.target.value }; setQuickInfoList(copy) }} />
                  <button type="button" onClick={() => setQuickInfoList(quickInfoList.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setQuickInfoList([...quickInfoList, { label: '', value: '', icon: '', displayOrder: quickInfoList.length + 1 }])} className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium"><Plus size={16} /> Add Quick Info Field</button>
            </div>
          )}

          {/* ═══ PACKAGES ═══ */}
          {activeTab === 'packages' && (
            <div className={sectionClass + ' !bg-transparent !p-0 !border-0'}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy-900 text-lg">Packages Section</h2>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.showPackages} onChange={e => set('showPackages', e.target.checked)} /> Show Section</label>
              </div>
              <label className="flex items-center gap-2 mb-3"><input type="checkbox" checked={form.packagesComingSoon} onChange={e => set('packagesComingSoon', e.target.checked)} className="rounded" /> <span className="text-sm font-medium text-navy-700">Show "Coming Soon" state (no packages available)</span></label>
              {form.packagesComingSoon && (
                <div><label className={labelClass}>Coming Soon Message</label><textarea className={inputClass + " resize-none"} rows={2} value={form.packagesComingSoonText || ''} onChange={e => set('packagesComingSoonText', e.target.value)} placeholder="Curated travel packages are coming soon." /></div>
              )}
              <p className="text-sm text-navy-500 mt-4">Packages are automatically matched by destination name from the Packages module. No manual linking needed.</p>
            </div>
          )}

          {/* ═══ SEO ═══ */}
          {activeTab === 'seo' && (
            <div className={sectionClass + ' !bg-transparent !p-0 !border-0'}>
              <h2 className="font-bold text-navy-900 text-lg mb-4">SEO Settings</h2>
              <div className="space-y-4">
                <div><label className={labelClass}>SEO Title</label><input className={inputClass} value={form.seoTitle || ''} onChange={e => set('seoTitle', e.target.value)} placeholder="Rann of Kutch | MAQLAIM TOURS" /></div>
                <div><label className={labelClass}>Meta Description</label><textarea className={inputClass + " resize-none"} rows={2} value={form.seoDescription || ''} onChange={e => set('seoDescription', e.target.value)} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>OG Title</label><input className={inputClass} value={form.ogTitle || ''} onChange={e => set('ogTitle', e.target.value)} /></div>
                  <div>
                    <ImageUpload
                      label="OG Image (for social media sharing)"
                      images={form.ogImage ? [{ url: form.ogImage, isUploaded: true }] : []}
                      onChange={(imgs) => set('ogImage', imgs.length > 0 ? imgs[0].url : '')}
                      maxImages={1}
                    />
                  </div>
                </div>
                <div><label className={labelClass}>OG Description</label><textarea className={inputClass + " resize-none"} rows={2} value={form.ogDescription || ''} onChange={e => set('ogDescription', e.target.value)} /></div>
                <div><label className={labelClass}>Canonical URL</label><input className={inputClass} value={form.canonicalUrl || ''} onChange={e => set('canonicalUrl', e.target.value)} /></div>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.noIndex || false} onChange={e => set('noIndex', e.target.checked)} className="rounded" /> <span className="text-sm text-navy-700">No-Index (hide from search engines)</span></label>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
