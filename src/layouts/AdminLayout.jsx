import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, MapPin, Package, Building, Compass, FileText,
  BookMarked, Users, MessageSquare, Star, CheckCircle, Settings,
  Menu, X, LogOut, ChevronDown, Bell, Search, Shield, Heart
} from 'lucide-react'

const SIDEBAR_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Destinations', href: '/admin/destinations', icon: MapPin },
      { label: 'Packages', href: '/admin/packages', icon: Package },
      { label: 'Hotels', href: '/admin/hotels', icon: Building },
      { label: 'Activities', href: '/admin/activities', icon: Compass },
      { label: 'Blogs', href: '/admin/blogs', icon: FileText },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Bookings', href: '/admin/bookings', icon: BookMarked },
      { label: 'Invoices', href: '/admin/invoices', icon: FileText },
      { label: 'Leads & Enquiries', href: '/admin/leads', icon: MessageSquare },
      { label: 'Client Interests', href: '/admin/client-interests', icon: Heart },
      { label: 'Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    title: 'Workflow',
    items: [
      { label: 'Approval Center', href: '/admin/approvals', icon: CheckCircle },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-700 rounded-lg flex items-center justify-center">
          <Shield size={16} className="text-white" />
        </div>
        {sidebarOpen && <span className="text-lg font-bold text-navy-900 font-display">Admin</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {SIDEBAR_SECTIONS.map(section => (
          <div key={section.title}>
            {sidebarOpen && <p className="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{section.title}</p>}
            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon
                const active = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href))
                return (
                  <Link key={item.href} to={item.href} onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'bg-sky-50 text-sky-600' : 'text-navy-600 hover:bg-navy-50'
                    } ${!sidebarOpen ? 'justify-center' : ''}`} title={item.label}>
                    <Icon size={18} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t p-4 shrink-0">
        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="w-9 h-9 bg-navy-100 rounded-full flex items-center justify-center text-sm font-bold text-navy-600">
            {user?.name?.charAt(0)}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy-900 truncate">{user?.name}</p>
              <p className="text-xs text-navy-500 truncate">{user?.role}</p>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={logout} className="p-1.5 text-navy-400 hover:text-red-600 transition-colors">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-white shadow-xl"><SidebarContent /></div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-navy-50">
              <Menu size={20} />
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 rounded-lg hover:bg-navy-50">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
              <Search size={16} className="text-gray-400 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm focus:outline-none w-full" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-navy-500 hover:text-sky-600 transition-colors hidden sm:block">View Website</Link>
            <button className="relative p-2 rounded-lg hover:bg-navy-50">
              <Bell size={20} className="text-navy-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
