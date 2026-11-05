import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applyRouteMetadata } from './Seo'

/**
 * Applies route-level SEO defaults for pages that do not render their own
 * <SEOHead /> (including noindex for admin and account areas). The zero-delay
 * task lets page-level metadata effects run first.
 */
export default function SeoRouteWatcher() {
  const { pathname } = useLocation()

  useEffect(() => {
    const timer = window.setTimeout(() => applyRouteMetadata(pathname), 0)
    return () => window.clearTimeout(timer)
  }, [pathname])

  return null
}
