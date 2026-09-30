import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ComingSoonPage, NotFoundPage } from '../common/ComingSoonPage'
import { getKnownMenuRouteName, isKnownMenuRoute } from '../../utils/menuRouteIndex'
import { MapPin, Star, Check, X as XIcon, Clock, ChevronDown, ChevronUp, Loader2, Heart, Phone, Edit2, Trash2, Camera, X } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import EnquiryModal from '../../components/enquiry/EnquiryModal'

const WHATSAPP_NUMBER = '919876543210'
const MAX_REVIEW_IMAGES = 2

export default function PackageDetail() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('highlights')
  const [expandedDay, setExpandedDay] = useState(1)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewImages, setReviewImages] = useState([]) // File objects for upload
  const [reviewImagePreviews, setReviewImagePreviews] = useState([]) // preview URLs
  const [submittingReview, setSubmittingReview] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' })
  const [editImages, setEditImages] = useState([]) // existing image URLs during edit
  const [editNewImages, setEditNewImages] = useState([]) // new File objects during edit
  const [editNewPreviews, setEditNewPreviews] = useState([])
  const [hasReviewed, setHasReviewed] = useState(false)
  const [myReviewId, setMyReviewId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const reviewFileRef = useRef(null)
  const editFileRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    api.get(`/packages/slug/${slug}`)
      .then(res => {
        setPkg(res.data)
        setLoading(false)
        if (user) {
          api.get(`/customer/wishlist/check/${res.data.id}`).then(r => setWishlisted(r.data.wishlisted)).catch(() => {})
        }
        loadReviews(res.data.id)
      })
      .catch(() => {
        api.get('/packages')
          .then(res => {
            const found = res.data.find(p => p.slug === slug || String(p.id) === slug)
            if (found) {
              setPkg(found)
              if (user) api.get(`/customer/wishlist/check/${found.id}`).then(r => setWishlisted(r.data.wishlisted)).catch(() => {})
              loadReviews(found.id)
            } else setError('Package not found')
            setLoading(false)
          })
          .catch(() => { setError('Failed to load package'); setLoading(false) })
      })
  }, [slug, user])

  const loadReviews = async (packageId) => {
    if (!packageId) return
    try {
      const r = await api.get(`/packages/${packageId}/reviews`)
      if (r.data && r.data.reviews) {
        setReviews(r.data.reviews)
        setHasReviewed(r.data.hasReviewed || false)
        if (r.data.hasReviewed && r.data.myReviewId) setMyReviewId(r.data.myReviewId)
      } else {
        setReviews(Array.isArray(r.data) ? r.data : [])
      }
    } catch {}
  }

  const toggleWishlist = async () => {
    if (!user) { alert('Please login'); return }
    try {
      if (wishlisted) {
        await api.delete(`/customer/wishlist/${pkg.id}`)
        setWishlisted(false)
      } else {
        await api.post('/customer/wishlist', { packageId: pkg.id })
        setWishlisted(true)
      }
    } catch (err) {
      if (err.response?.status === 409) setWishlisted(true)
    }
  }

  // ── Image upload helper ──────────────────────────────────────
  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.url || res.data.path
  }

  const handleReviewImageSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_REVIEW_IMAGES - reviewImages.length
    const toAdd = files.slice(0, remaining)
    setReviewImages(prev => [...prev, ...toAdd])
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => setReviewImagePreviews(prev => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
    if (reviewFileRef.current) reviewFileRef.current.value = ''
  }

  const removeReviewImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index))
    setReviewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // ── Submit review with images ────────────────────────────────
  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) { alert('Please login to review'); return }
    if (!reviewForm.comment.trim()) return
    setSubmittingReview(true)
    try {
      // Upload images first
      const imageUrls = []
      for (const file of reviewImages) {
        const url = await uploadImage(file)
        if (url) imageUrls.push(url)
      }
      await api.post(`/packages/${pkg.id}/reviews`, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        images: imageUrls,
      })
      setReviewForm({ rating: 5, comment: '' })
      setReviewImages([])
      setReviewImagePreviews([])
      await loadReviews(pkg.id)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review')
    }
    setSubmittingReview(false)
  }

  // ── Edit review ──────────────────────────────────────────────
  const startEditReview = (rev) => {
    setEditingReviewId(rev.id)
    setEditForm({ rating: rev.rating || 5, comment: rev.comment || '' })
    setEditImages(rev.images || [])
    setEditNewImages([])
    setEditNewPreviews([])
  }

  const cancelEditReview = () => {
    setEditingReviewId(null)
    setEditForm({ rating: 5, comment: '' })
    setEditImages([])
    setEditNewImages([])
    setEditNewPreviews([])
  }

  const handleEditImageSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_REVIEW_IMAGES - editImages.length - editNewImages.length
    const toAdd = files.slice(0, remaining)
    setEditNewImages(prev => [...prev, ...toAdd])
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => setEditNewPreviews(prev => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
    if (editFileRef.current) editFileRef.current.value = ''
  }

  const removeEditImage = (index, isNew) => {
    if (isNew) {
      setEditNewImages(prev => prev.filter((_, i) => i !== index))
      setEditNewPreviews(prev => prev.filter((_, i) => i !== index))
    } else {
      setEditImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const saveEditReview = async (reviewId) => {
    if (!editForm.comment.trim()) return
    try {
      // Upload new images
      const newUrls = []
      for (const file of editNewImages) {
        const url = await uploadImage(file)
        if (url) newUrls.push(url)
      }
      const allImages = [...editImages, ...newUrls]
      await api.put(`/packages/${pkg.id}/reviews/${reviewId}`, {
        rating: editForm.rating,
        comment: editForm.comment,
        images: allImages,
      })
      setEditingReviewId(null)
      await loadReviews(pkg.id)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update review')
    }
  }

  const deleteReview = async (reviewId) => {
    if (!confirm('Delete this review?')) return
    try {
      await api.delete(`/packages/${pkg.id}/reviews/${reviewId}`)
      await loadReviews(pkg.id)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-navy-500">Loading package...</p>
        </div>
      </div>
    )
  }

  if (error === 'Package not found') {
    const packagePath = `/packages/${slug}`
    return isKnownMenuRoute(packagePath)
      ? <ComingSoonPage pageName={getKnownMenuRouteName(packagePath)} />
      : <NotFoundPage />
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Package Not Found</h2>
          <p className="text-navy-500 mb-4">{error || 'The package you are looking for does not exist.'}</p>
          <Link to="/packages" className="text-sky-600 font-medium hover:underline">← Back to Packages</Link>
        </div>
      </div>
    )
  }

  const highlights = pkg.highlights ? (typeof pkg.highlights === 'string' ? pkg.highlights.split('\n').filter(Boolean) : pkg.highlights) : []
  const inclusions = pkg.inclusions ? (typeof pkg.inclusions === 'string' ? pkg.inclusions.split('\n').filter(Boolean) : pkg.inclusions) : []
  const exclusions = pkg.exclusions ? (typeof pkg.exclusions === 'string' ? pkg.exclusions.split('\n').filter(Boolean) : pkg.exclusions) : []
  const itinerary = pkg.itinerary ? (typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary || '[]') : pkg.itinerary) : []
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : pkg.rating || 0

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[350px]">
        <img src={pkg.coverImage || 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200'} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 container-wide py-10">
          <p className="text-gold-400 text-sm font-medium mb-2">{pkg.destination || pkg.state}{pkg.country ? `, ${pkg.country}` : ''}</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1"><Clock size={14} /> {pkg.durationDays} Days / {pkg.durationNights} Nights</span>
            <span className="flex items-center gap-1"><Star size={14} className="text-gold-400 fill-gold-400" /> {avgRating} ({reviews.length || pkg.reviewCount || 0} reviews)</span>
          </div>
        </div>
      </section>

      <div className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {(pkg.description || pkg.shortDescription) && (
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="text-xl font-display font-bold text-navy-900 mb-3">Overview</h2>
                  <p className="text-navy-600 leading-relaxed">{pkg.description || pkg.shortDescription}</p>
                </div>
              )}

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="text-xl font-display font-bold text-navy-900 mb-3">Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-navy-700">
                        <Check size={16} className="text-green-500 shrink-0" /> {h.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs — Itinerary / Inclusions / Exclusions */}
              {(itinerary.length > 0 || inclusions.length > 0 || exclusions.length > 0) && (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="flex border-b">
                    {itinerary.length > 0 && (
                      <button onClick={() => setActiveTab('itinerary')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'itinerary' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50' : 'text-navy-500 hover:text-navy-700'}`}>Itinerary</button>
                    )}
                    {inclusions.length > 0 && (
                      <button onClick={() => setActiveTab('inclusions')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'inclusions' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50' : 'text-navy-500 hover:text-navy-700'}`}>Inclusions</button>
                    )}
                    {exclusions.length > 0 && (
                      <button onClick={() => setActiveTab('exclusions')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'exclusions' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50' : 'text-navy-500 hover:text-navy-700'}`}>Exclusions</button>
                    )}
                  </div>
                  <div className="p-6">
                    {activeTab === 'itinerary' && itinerary.length > 0 && (
                      <div className="space-y-4">
                        {itinerary.map((day, i) => (
                          <div key={i} className={`border rounded-lg p-4 transition-colors ${expandedDay === i ? 'border-sky-300 bg-sky-50/50' : ''}`}>
                            <button onClick={() => setExpandedDay(expandedDay === i ? -1 : i)} className="flex items-center justify-between w-full text-left">
                              <div className="flex items-center gap-3">
                                <span className="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{day.day || i + 1}</span>
                                <div>
                                  <p className="font-semibold text-navy-900">Day {day.day || i + 1}: {day.title}</p>
                                  {day.meals && <p className="text-xs text-navy-500">{day.meals}{day.accommodation ? ` · ${day.accommodation}` : ''}</p>}
                                </div>
                              </div>
                              {expandedDay === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {expandedDay === i && day.desc && (
                              <p className="mt-3 ml-13 text-navy-600 text-sm leading-relaxed">{day.desc}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab === 'inclusions' && (
                      <ul className="space-y-2">
                        {inclusions.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-navy-700"><Check size={16} className="text-green-500" /> {item.trim()}</li>
                        ))}
                      </ul>
                    )}
                    {activeTab === 'exclusions' && (
                      <ul className="space-y-2">
                        {exclusions.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-navy-700"><XIcon size={16} className="text-red-400" /> {item.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* REVIEWS SECTION */}
              {/* ═══════════════════════════════════════════════════════════ */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-xl font-display font-bold text-navy-900 mb-4">
                  Reviews ({reviews.length})
                </h2>

                {/* Rating summary */}
                {reviews.length > 0 && (
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-navy-900">{avgRating}</div>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={14} className={s <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                        ))}
                      </div>
                      <p className="text-xs text-navy-500 mt-1">{reviews.length} reviews</p>
                    </div>
                  </div>
                )}

                {/* Review list — visible to ALL users including not logged in */}
                <div className="space-y-5 mb-6">
                  {reviews.map((rev, i) => {
                    const isOwn = user && String(rev.userId) === String(user.id)
                    const isEditing = editingReviewId === rev.id
                    return (
                      <div key={rev.id || i} className="border-b border-gray-100 pb-5 last:border-0">
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sm font-bold text-sky-600 shrink-0 overflow-hidden">
                            {rev.userProfileImage ? (
                              <img src={rev.userProfileImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (rev.userName || 'U').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-navy-900 text-sm">{rev.userName || 'Anonymous'}</p>
                            {!isEditing && (
                              <div className="flex items-center gap-1 mt-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} size={12} className={s <= (rev.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                ))}
                                {rev.createdAt && <span className="text-xs text-navy-400 ml-1">{new Date(rev.createdAt).toLocaleDateString()}</span>}
                              </div>
                            )}
                          </div>
                          {/* Edit/Delete buttons for own review */}
                          {isOwn && !isEditing && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => startEditReview(rev)} className="p-1.5 text-navy-400 hover:text-sky-600 rounded" title="Edit review">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => deleteReview(rev.id)} className="p-1.5 text-navy-400 hover:text-red-600 rounded" title="Delete review">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Review comment */}
                        {isEditing ? (
                          <div className="mt-3 ml-13">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-navy-600">Rating:</span>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <button key={s} type="button" onClick={() => setEditForm({ ...editForm, rating: s })}>
                                    <Star size={16} className={s <= editForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 hover:text-amber-300'} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <textarea
                              value={editForm.comment}
                              onChange={e => setEditForm({ ...editForm, comment: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none mb-2"
                            />
                            {/* Existing images */}
                            {editImages.length > 0 && (
                              <div className="flex gap-2 mb-2 flex-wrap">
                                {editImages.map((url, idx) => (
                                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button onClick={() => removeEditImage(idx, false)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"><X size={12} /></button>
                                  </div>
                                ))}
                                {editNewPreviews.map((url, idx) => (
                                  <div key={`new-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button onClick={() => removeEditImage(idx, true)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"><X size={12} /></button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {(editImages.length + editNewImages.length) < MAX_REVIEW_IMAGES && (
                              <label className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 cursor-pointer mb-2">
                                <Camera size={14} /> Add photo
                                <input ref={editFileRef} type="file" accept="image/*" className="hidden" onChange={handleEditImageSelect} />
                              </label>
                            )}
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => saveEditReview(rev.id)} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium">Save Changes</button>
                              <button onClick={cancelEditReview} className="text-navy-500 hover:text-navy-700 px-4 py-1.5 rounded-lg text-sm font-medium">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {rev.comment && <p className="text-sm text-navy-600 mt-2 ml-13">{rev.comment}</p>}
                            {/* Display review images */}
                            {rev.images && rev.images.length > 0 && (
                              <div className="flex gap-2 mt-3 ml-13 flex-wrap">
                                {rev.images.map((imgUrl, idx) => (
                                  <a key={idx} href={imgUrl} target="_blank" rel="noopener noreferrer">
                                    <img src={imgUrl} alt="Review photo" className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border hover:opacity-90 transition-opacity" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Write a review or edit existing */}
                {user ? (
                  hasReviewed && !editingReviewId ? (
                    <div className="border-t pt-4">
                      <p className="text-sm text-navy-600 mb-2">You've already reviewed this package.</p>
                      <button
                        onClick={() => {
                          const myReview = reviews.find(r => r.id === myReviewId)
                          if (myReview) startEditReview(myReview)
                        }}
                        className="bg-sky-100 text-sky-700 hover:bg-sky-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Edit Your Review
                      </button>
                    </div>
                  ) : !hasReviewed ? (
                    <form onSubmit={submitReview} className="border-t pt-4">
                      <h3 className="font-medium text-navy-900 mb-3">Write a Review</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-navy-600">Your rating:</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                              <Star size={20} className={s <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 hover:text-amber-300'} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Share your experience with this package..."
                        rows={3}
                        className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none mb-3"
                      />
                      {/* Image upload */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {reviewImagePreviews.map((url, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                              <img src={url} alt="" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeReviewImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"><X size={12} /></button>
                            </div>
                          ))}
                        </div>
                        {reviewImages.length < MAX_REVIEW_IMAGES && (
                          <label className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 cursor-pointer">
                            <Camera size={16} /> Add photo ({reviewImages.length}/{MAX_REVIEW_IMAGES})
                            <input ref={reviewFileRef} type="file" accept="image/*" className="hidden" onChange={handleReviewImageSelect} />
                          </label>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview || !reviewForm.comment.trim()}
                        className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : null
                ) : (
                  <p className="text-sm text-navy-500 text-center py-3 border-t">
                    <Link to="/login" className="text-sky-600 hover:underline font-medium">Login</Link> to write a review
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              <div className="bg-white rounded-xl border p-6 sticky top-24 space-y-6">
                <div>
                  <p className="text-sm text-navy-500 mb-1">Starting from</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-sky-600">₹{pkg.startingPrice?.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-navy-500 mt-1">per person</p>
                </div>

                <button onClick={() => user ? setShowEnquiry(true) : alert('Please login to enquire')} className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold transition-colors">
                  Enquire Now
                </button>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in the ${pkg.title} package (${pkg.destination || pkg.state}). Please share more details.`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone size={16} /> Talk to Expert
                </a>

                <button onClick={toggleWishlist} className={`w-full border-2 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${wishlisted ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-200 text-navy-600 hover:bg-navy-50'}`}>
                  <Heart size={16} className={wishlisted ? 'fill-red-500' : ''} />
                  {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>

                <div className="border-t pt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-navy-600"><span>Duration</span><span className="font-medium">{pkg.durationDays}D/{pkg.durationNights}N</span></div>
                  <div className="flex justify-between text-navy-600"><span>Destination</span><span className="font-medium">{pkg.destination || pkg.state}</span></div>
                  {pkg.category && <div className="flex justify-between text-navy-600"><span>Category</span><span className="font-medium capitalize">{pkg.category}</span></div>}
                  <div className="flex justify-between text-navy-600"><span>Rating</span><span className="font-medium flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {avgRating}</span></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {showEnquiry && (
        <EnquiryModal isOpen={true} packageData={pkg} onClose={() => setShowEnquiry(false)} />
      )}
    </div>
  )
}
