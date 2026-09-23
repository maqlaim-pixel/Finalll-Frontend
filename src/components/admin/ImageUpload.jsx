// import { useState, useRef } from 'react'
// import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
// import api from '../../services/api'
//
// export default function ImageUpload({ label, images = [], onChange, maxImages = 3, className = '' }) {
//   const [uploading, setUploading] = useState(false)
//   const [dragActive, setDragActive] = useState(false)
//   const fileInputRef = useRef(null)
//
//   const handleUpload = async (files) => {
//     if (!files || files.length === 0) return
//
//     const remaining = maxImages - images.length
//     const toUpload = Array.from(files).slice(0, remaining)
//
//     if (toUpload.length === 0) {
//       alert(`Maximum ${maxImages} images allowed`)
//       return
//     }
//
//     setUploading(true)
//     const newImages = [...images]
//
//     for (const file of toUpload) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         alert(`${file.name} is not an image`)
//         continue
//       }
//       // Validate file size (5MB max)
//       if (file.size > 5 * 1024 * 1024) {
//         alert(`${file.name} is too large (max 5MB)`)
//         continue
//       }
//
//       try {
//         const formData = new FormData()
//         formData.append('file', file)
//
//         const res = await api.post('/images/upload', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         })
//
//         newImages.push({
//           url: res.data.url,
//           filename: res.data.filename,
//           originalName: res.data.originalName,
//           isUploaded: true,
//         })
//       } catch (err) {
//         console.error('Upload failed:', err)
//         alert(`Failed to upload ${file.name}`)
//       }
//     }
//
//     onChange(newImages)
//     setUploading(false)
//   }
//
//   const handleDrag = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
//     else if (e.type === 'dragleave') setDragActive(false)
//   }
//
//   const handleDrop = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragActive(false)
//     if (e.dataTransfer.files) handleUpload(e.dataTransfer.files)
//   }
//
//   const handleFileChange = (e) => {
//     if (e.target.files) handleUpload(e.target.files)
//     e.target.value = ''
//   }
//
//   const removeImage = (index) => {
//     const updated = images.filter((_, i) => i !== index)
//     onChange(updated)
//   }
//
//   const moveImage = (from, to) => {
//     if (to < 0 || to >= images.length) return
//     const updated = [...images]
//     const [moved] = updated.splice(from, 1)
//     updated.splice(to, 0, moved)
//     onChange(updated)
//   }
//
//   return (
//     <div className={className}>
//       {label && <label className="block text-sm font-medium text-navy-700 mb-2">{label}</label>}
//
//       {/* Upload Zone */}
//       {images.length < maxImages && (
//         <div
//           className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
//             dragActive ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-400 hover:bg-gray-50'
//           }`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//           onClick={() => fileInputRef.current?.click()}
//         >
//           {uploading ? (
//             <div className="flex flex-col items-center gap-2">
//               <Loader2 size={32} className="text-sky-500 animate-spin" />
//               <p className="text-sm text-navy-500">Uploading...</p>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center gap-2">
//               <Upload size={32} className="text-navy-400" />
//               <p className="text-sm text-navy-600 font-medium">Click to upload or drag & drop</p>
//               <p className="text-xs text-navy-400">PNG, JPG, WEBP up to 5MB • {images.length}/{maxImages} images</p>
//             </div>
//           )}
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             multiple={maxImages > 1}
//             onChange={handleFileChange}
//             className="hidden"
//           />
//         </div>
//       )}
//
//       {/* Image Preview Grid */}
//       {images.length > 0 && (
//         <div className="grid grid-cols-3 gap-3 mt-4">
//           {images.map((img, i) => (
//             <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
//               <img
//                 src={img.url || img}
//                 alt={`Upload ${i + 1}`}
//                 className="w-full h-full object-cover"
//               />
//               {/* Overlay */}
//               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
//                 {i > 0 && (
//                   <button
//                     type="button"
//                     onClick={(e) => { e.stopPropagation(); moveImage(i, i - 1) }}
//                     className="bg-white/90 hover:bg-white text-navy-700 p-1.5 rounded-lg text-xs font-medium transition-colors"
//                     title="Move left"
//                   >
//                     ←
//                   </button>
//                 )}
//                 {i < images.length - 1 && (
//                   <button
//                     type="button"
//                     onClick={(e) => { e.stopPropagation(); moveImage(i, i + 1) }}
//                     className="bg-white/90 hover:bg-white text-navy-700 p-1.5 rounded-lg text-xs font-medium transition-colors"
//                     title="Move right"
//                   >
//                     →
//                   </button>
//                 )}
//                 <button
//                   type="button"
//                   onClick={(e) => { e.stopPropagation(); removeImage(i) }}
//                   className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
//                   title="Remove image"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//               {/* Main image badge */}
//               {i === 0 && (
//                 <span className="absolute top-2 left-2 bg-sky-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
//                   Main
//                 </span>
//               )}
//               {/* Image number */}
//               <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
//                 {i + 1}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import api from '../../services/api'

export default function ImageUpload({
                                      label,
                                      images = [],
                                      onChange,
                                      maxImages = 3,
                                      className = '',
                                    }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return

    const remaining = maxImages - images.length
    const toUpload = Array.from(files).slice(0, remaining)

    if (toUpload.length === 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)

    const newImages = [...images]

    for (const file of toUpload) {
      // Validate image type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image`)
        continue
      }

      // Validate file size - 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`)
        continue
      }

      try {
        const formData = new FormData()

        // IMPORTANT:
        // Backend should receive multipart field named "file"
        formData.append('file', file)

        console.log('[ImageUpload] Uploading:', {
          name: file.name,
          type: file.type,
          size: file.size,
        })

        const res = await api.post('/images/upload', formData)

        console.log('[ImageUpload] Upload response:', res.data)

        newImages.push({
          url: res.data.url,
          filename: res.data.filename,
          originalName: res.data.originalName,
          isUploaded: true,
        })
      } catch (err) {
        console.error('[ImageUpload] Upload failed:', err)

        const message =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.response?.data ||
            `Failed to upload ${file.name}`

        alert(message)
      }
    }

    onChange(newImages)
    setUploading(false)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setDragActive(false)

    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      handleUpload(e.target.files)
    }

    // Allow selecting same file again
    e.target.value = ''
  }

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  const moveImage = (from, to) => {
    if (to < 0 || to >= images.length) return

    const updated = [...images]
    const [moved] = updated.splice(from, 1)

    updated.splice(to, 0, moved)

    onChange(updated)
  }

  return (
      <div className={className}>
        {/* Label */}
        {label && (
            <label className="block text-sm font-medium text-navy-700 mb-2">
              {label}
            </label>
        )}

        {/* Upload Zone */}
        {images.length < maxImages && (
            <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    dragActive
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 hover:border-sky-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2
                        size={32}
                        className="text-sky-500 animate-spin"
                    />

                    <p className="text-sm text-navy-500">
                      Uploading...
                    </p>
                  </div>
              ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload
                        size={32}
                        className="text-navy-400"
                    />

                    <p className="text-sm text-navy-600 font-medium">
                      Click to upload or drag & drop
                    </p>

                    <p className="text-xs text-navy-400">
                      PNG, JPG, WEBP up to 5MB • {images.length}/{maxImages} images
                    </p>
                  </div>
              )}

              <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple={maxImages > 1}
                  onChange={handleFileChange}
                  className="hidden"
              />
            </div>
        )}

        {/* Image Preview Grid */}
        {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {images.map((img, i) => {
                const imageUrl =
                    typeof img === 'string'
                        ? img
                        : img?.url

                return (
                    <div
                        key={`${imageUrl || i}-${i}`}
                        className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square"
                    >
                      <img
                          src={imageUrl}
                          alt={`Upload ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(
                                '[ImageUpload] Image failed to load:',
                                imageUrl
                            )

                            e.currentTarget.style.display = 'none'
                          }}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        {/* Move Left */}
                        {i > 0 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveImage(i, i - 1)
                                }}
                                className="bg-white/90 hover:bg-white text-navy-700 p-1.5 rounded-lg text-xs font-medium transition-colors"
                                title="Move left"
                            >
                              ←
                            </button>
                        )}

                        {/* Move Right */}
                        {i < images.length - 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveImage(i, i + 1)
                                }}
                                className="bg-white/90 hover:bg-white text-navy-700 p-1.5 rounded-lg text-xs font-medium transition-colors"
                                title="Move right"
                            >
                              →
                            </button>
                        )}

                        {/* Remove */}
                        <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage(i)
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                            title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Main Image */}
                      {i === 0 && (
                          <span className="absolute top-2 left-2 bg-sky-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                    Main
                  </span>
                      )}

                      {/* Image Number */}
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  {i + 1}
                </span>
                    </div>
                )
              })}
            </div>
        )}
      </div>
  )
}