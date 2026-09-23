import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, BookMarked, Heart, Star, LogOut, MessageCircle, UserCircle, FileText } from 'lucide-react'
import PublicHeader from '../components/layout/PublicHeader'

const SIDEBAR_LINKS = [
  { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
  { label: 'My Profile', href: '/account/profile', icon: UserCircle },
  { label: 'My Bookings', href: '/account/bookings', icon: BookMarked },
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { label: 'My Reviews', href: '/account/reviews', icon: Star },
  { label: 'My Enquiries', href: '/account/enquiries', icon: MessageCircle },
  { label: 'Invoices', href: '/account/invoices', icon: FileText },
]

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <div className="flex-1 bg-gray-50">
        <div className="container-wide py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-xl border p-4 sticky top-24">
                <Link to="/account/profile" className="flex items-center gap-3 mb-6 pb-4 border-b hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-sky-600 font-bold text-lg">{user?.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">{user?.name}</p>
                    <p className="text-sm text-navy-500">{user?.email}</p>
                  </div>
                </Link>
                <nav className="space-y-1">
                  {SIDEBAR_LINKS.map(link => {
                    const Icon = link.icon
                    const active = location.pathname === link.href
                    return (
                      <Link key={link.href} to={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-sky-50 text-sky-600' : 'text-navy-600 hover:bg-navy-50'}`}>
                        <Icon size={18} /> {link.label}
                      </Link>
                    )
                  })}
                  <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors mt-4 border-t pt-4">
                    <LogOut size={18} /> Sign Out
                  </button>
                </nav>
              </div>
            </aside>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
