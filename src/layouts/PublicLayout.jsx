import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import PublicFooter from '../components/layout/PublicFooter'
import AnalyticsTracker from '../components/analytics/AnalyticsTracker'
import AnalyticsConsent from '../components/analytics/AnalyticsConsent'

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
            </div>
          }
        >
          {children || <Outlet />}
        </Suspense>
      </main>
      <PublicFooter />
      <AnalyticsTracker />
      <AnalyticsConsent />
    </div>
  )
}
