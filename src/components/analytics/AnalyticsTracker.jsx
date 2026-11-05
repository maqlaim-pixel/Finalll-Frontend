import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent, trackPageView } from '../../utils/analytics'

/**
 * Sends one GA4 page_view per client-side route change and delegates phone /
 * WhatsApp click tracking through a single capture-phase listener, so the
 * events are recorded once regardless of how many buttons exist on a page.
 */
export default function AnalyticsTracker() {
  const { pathname } = useLocation()

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  useEffect(() => {
    const onClick = (event) => {
      const target = event.target
      if (!target || typeof target.closest !== 'function') return
      const anchor = target.closest('a[href]')
      if (!anchor) return
      const href = anchor.getAttribute('href') || ''
      if (href.startsWith('tel:')) {
        trackEvent('phone_click', { link_url: href, page_path: pathname })
      } else if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) {
        trackEvent('whatsapp_click', { link_url: href, page_path: pathname })
      }
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname])

  return null
}
