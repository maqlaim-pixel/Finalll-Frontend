import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Search, Menu, X, ChevronDown, User, Phone, Mail } from 'lucide-react'
import { MAIN_NAV, SECONDARY_NAV, MEGA_MENU_MAP } from '../../data/megaMenuData'
import MegaMenu, { LocalTravelServiceIcon } from '../mega/MegaMenu'

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileMega, setMobileMega] = useState(null)
  const [mobileLocalTravelGuidesOpen, setMobileLocalTravelGuidesOpen] = useState(false)
  const [activeMega, setActiveMega] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)
  const { user } = useAuth()
  const location = useLocation()

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false)
    setMobileMega(null)
    setMobileLocalTravelGuidesOpen(false)
    setActiveMega(null)
  }, [location])

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Click outside to close mega menu
  useEffect(() => {
    if (!activeMega) return
    function handleOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveMega(null)
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setActiveMega(null)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('click', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('click', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [activeMega])

  // Click toggle for mega menu items
  const toggleMega = useCallback((megaKey) => {
    setActiveMega(prev => prev === megaKey ? null : megaKey)
  }, [])

  const closeMega = useCallback(() => setActiveMega(null), [])

  const toggleMobileMega = (key) => {
    setMobileMega(mobileMega === key ? null : key)
  }

  return (
    <div ref={headerRef} className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="bg-navy-900 text-white text-xs hidden md:block">
        <div className="container-wide flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={12} /> +91 98765 43210</span>
            <span className="flex items-center gap-1"><Mail size={12} /> hello@travelvista.com</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold-400 transition-colors">Facebook</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Instagram</a>
            <a href="#" className="hover:text-gold-400 transition-colors">YouTube</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="container-wide flex items-center justify-between h-16 min-[1600px]:h-[68px] min-[1600px]:max-w-[1600px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={closeMega}>
            <img src="https://www.maqlaimtours.com/uploads/0000/1/2023/09/12/logo-tour-1.png" alt="TravelVista" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav — click-based mega menu toggle */}
          <nav className="hidden min-[1280px]:flex items-center gap-0">
            {MAIN_NAV.map(item => {
              const isActive = activeMega === item.megaKey
              return (
                <div key={item.label} className="nav-item-mega">
                  <Link
                    to={item.href}
                    onClick={(e) => {
                      if (item.hasMega) {
                        if (activeMega === item.megaKey) {
                          // 2nd click: close mega menu, allow navigation
                          closeMega()
                        } else {
                          // 1st click: open mega menu, block navigation
                          e.preventDefault()
                          toggleMega(item.megaKey)
                        }
                      } else {
                        closeMega()
                      }
                    }}
                    className={`flex items-center gap-1 px-1 py-2 text-[13px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      (location.pathname.startsWith(item.href) && item.href !== '/') ||
                      item.activePaths?.some(path => location.pathname.startsWith(path)) ||
                      isActive
                        ? 'text-sky-600'
                        : 'text-navy-700 hover:text-sky-600'
                    }`}
                  >
                    <span className="nav-label">
                      {item.label}
                      {item.hasMega && (
                        <ChevronDown size={14} className={`nav-chevron transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
                      )}
                    </span>
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button className="p-2 rounded-lg hover:bg-navy-50 transition-colors text-navy-600" onClick={closeMega}>
              <Search size={20} />
            </button>
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 font-bold text-sm rounded-lg hover:bg-gold-600 transition-colors"
              onClick={closeMega}
            >
              ENQUIRE NOW
            </Link>

            {user ? (
              <Link
                to={user.role === 'super_admin' || user.role === 'admin' ? '/admin' : '/account'}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-50 hover:bg-navy-100 transition-colors"
                onClick={closeMega}
              >
                <div className="w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-navy-700">{user.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 rounded-lg transition-colors" onClick={closeMega}>
                <User size={16} /> Login
              </Link>
            )}

            <button
              onClick={() => { setMobileOpen(!mobileOpen); closeMega() }}
              className="min-[1280px]:hidden p-2 rounded-lg hover:bg-navy-50"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Secondary nav */}
        <div className="hidden min-[1280px]:block border-t border-gray-100">
          <div className="container-wide flex items-center gap-6 h-10">
            {SECONDARY_NAV.map(item => (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeMega}
                className={`text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                  location.pathname.startsWith(item.href)
                    ? 'text-sky-600'
                    : 'text-navy-500 hover:text-sky-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mega Menu Desktop — rendered below header, outside sticky context */}
      {MAIN_NAV.filter(n => n.hasMega).map(navItem => (
        <MegaMenu
          key={navItem.megaKey}
          data={MEGA_MENU_MAP[navItem.megaKey]}
          isOpen={activeMega === navItem.megaKey}
          onClose={closeMega}
        />
      ))}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="min-[1280px]:hidden fixed inset-x-0 top-16 md:top-24 bottom-0 z-40 bg-white overflow-y-auto mobile-mega-panel">
          <nav className="py-4 space-y-1">
            {MAIN_NAV.map(item => (
              <div key={item.label}>
                <div className="flex items-center">
                  <Link
                    to={item.href}
                    className="flex-1 px-4 py-3 rounded-lg text-navy-700 hover:bg-navy-50 font-semibold text-sm"
                    onClick={event => {
                      if (!item.hasMega) {
                        setMobileOpen(false)
                      } else {
                        if (item.megaKey === 'localTravel') event.preventDefault()
                        toggleMobileMega(item.megaKey)
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                  {item.hasMega && (
                    <button
                      onClick={() => toggleMobileMega(item.megaKey)}
                      className="px-4 py-3 text-navy-400"
                    >
                      <ChevronDown size={18} className={`transition-transform ${mobileMega === item.megaKey ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {item.hasMega && mobileMega === item.megaKey && MEGA_MENU_MAP[item.megaKey] && (
                  item.megaKey === 'localTravel' ? (
                    <div className="px-6 pb-3">
                      {MEGA_MENU_MAP[item.megaKey].columns.filter(col => col.type === 'localServices').map(col => (
                        <div key={col.title} className="mb-3">
                          <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider mb-1">{col.title}</div>
                          {col.items.map(link => (
                            <Link key={link.href} to={link.href} className="flex items-center gap-2 py-1.5 text-sm text-navy-600 hover:text-sky-600"
                              onClick={() => setMobileOpen(false)}>
                              <LocalTravelServiceIcon name={link.icon} size={16} className="shrink-0 text-sky-700" />
                              <span className="flex-1">{link.label}</span>
                              <ChevronDown size={14} className="-rotate-90 text-sky-600" />
                            </Link>
                          ))}
                        </div>
                      ))}
                      {MEGA_MENU_MAP[item.megaKey].columns.filter(col => col.type === 'localGuides').map(col => (
                        <div key={col.title} className="border-t border-gray-100 pt-2">
                          <button type="button" onClick={() => setMobileLocalTravelGuidesOpen(open => !open)}
                            className="flex w-full items-center justify-between py-2 text-left text-[11px] font-bold uppercase tracking-wider text-sky-600">
                            {col.title}
                            <ChevronDown size={16} className={`transition-transform ${mobileLocalTravelGuidesOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {mobileLocalTravelGuidesOpen && col.items.map(link => (
                            <Link key={link.href} to={link.href} className="block py-1.5 pl-3 text-sm text-navy-600 hover:text-sky-600"
                              onClick={() => setMobileOpen(false)}>
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 pb-3 space-y-3">
                      {MEGA_MENU_MAP[item.megaKey].columns.map((col, i) => (
                        <div key={i}>
                          <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider mb-1">{col.title}</div>
                          {col.items.slice(0, 6).map((link, j) => (
                            <Link key={j} to={link.href} className="block py-1.5 text-sm text-navy-600 hover:text-sky-600"
                              onClick={() => setMobileOpen(false)}>
                              {link.label}
                            </Link>
                          ))}
                          {col.viewAll && (
                            <Link to={col.viewAll.href} className="block py-1.5 text-xs font-bold text-sky-600"
                              onClick={() => setMobileOpen(false)}>
                              {col.viewAll.label} →
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            ))}
            {SECONDARY_NAV.map(item => (
              <Link key={item.href} to={item.href}
                className="block px-4 py-3 rounded-lg text-navy-700 hover:bg-navy-50 font-semibold text-sm"
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-3 border-t space-y-2">
              <Link to="/contact" className="block w-full text-center btn-gold" onClick={() => setMobileOpen(false)}>
                ENQUIRE NOW
              </Link>
              <Link to="/plan-trip" className="block w-full text-center btn-primary" onClick={() => setMobileOpen(false)}>
                PLAN MY TRIP
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
