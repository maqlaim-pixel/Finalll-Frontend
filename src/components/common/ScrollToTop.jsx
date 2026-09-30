import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    document.documentElement.classList.add('route-changing')
    const scrollContainers = document.querySelectorAll('[data-route-scroll-container]')
    const scrollToPosition = (top, behavior) => {
      window.scrollTo({ top, left: 0, behavior })
      scrollContainers.forEach(container => { container.scrollTop = top })
    }

    let targetId = hash.slice(1)
    try {
      targetId = decodeURIComponent(targetId)
    } catch {
      // Use the raw fragment if it is not percent-encoded correctly.
    }

    const target = hash ? document.getElementById(targetId) : null
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'auto' })
    } else {
      scrollToPosition(0, 'auto')
    }
    requestAnimationFrame(() => document.documentElement.classList.remove('route-changing'))
  }, [pathname, hash])

  return null
}
