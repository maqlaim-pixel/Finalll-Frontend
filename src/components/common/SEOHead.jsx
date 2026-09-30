import { useEffect } from 'react'

export default function SEOHead({ title, description, keywords, url, image }) {
  useEffect(() => {
    if (title) {
      const brandedTitle = title.replace(/TravelVista/gi, 'MAQLAIM TOURS')
      document.title = brandedTitle
      let og = document.querySelector('meta[property="og:title"]')
      if (!og) { og = document.createElement('meta'); og.setAttribute('property', 'og:title'); document.head.appendChild(og) }
      og.content = brandedTitle
      let siteName = document.querySelector('meta[property="og:site_name"]')
      if (!siteName) { siteName = document.createElement('meta'); siteName.setAttribute('property', 'og:site_name'); document.head.appendChild(siteName) }
      siteName.content = 'MAQLAIM TOURS'
    }
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) { tag = document.createElement('meta'); tag.name = 'description'; document.head.appendChild(tag) }
      tag.content = description.replace(/TravelVista/gi, 'MAQLAIM TOURS')
    }
    if (keywords) {
      let tag = document.querySelector('meta[name="keywords"]')
      if (!tag) { tag = document.createElement('meta'); tag.name = 'keywords'; document.head.appendChild(tag) }
      tag.content = keywords.replace(/TravelVista/gi, 'MAQLAIM TOURS')
    }
    // OG tags
    if (description) {
      let og = document.querySelector('meta[property="og:description"]')
      if (!og) { og = document.createElement('meta'); og.setAttribute('property', 'og:description'); document.head.appendChild(og) }
      og.content = description.replace(/TravelVista/gi, 'MAQLAIM TOURS')
    }
    if (image) {
      let og = document.querySelector('meta[property="og:image"]')
      if (!og) { og = document.createElement('meta'); og.setAttribute('property', 'og:image'); document.head.appendChild(og) }
      og.content = image
    }
    if (url) {
      let og = document.querySelector('meta[property="og:url"]')
      if (!og) { og = document.createElement('meta'); og.setAttribute('property', 'og:url'); document.head.appendChild(og) }
      og.content = url
    }
  }, [title, description, keywords, url, image])

  return null
}
