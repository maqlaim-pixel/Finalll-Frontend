// ══════════════════════════════════════════════════════════════════════
// MegaMenu — Reusable dropdown for all 7 menu systems
// ══════════════════════════════════════════════════════════════════════
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Building2, Globe2, Camera, Compass, Mountain, TreePine,
  Ship, Plane, Heart, Users, Baby, Tent, Waves, Church, Sparkles,
  BadgeCheck, Phone, Mail, Clock, ChevronRight, Star, Shield,
  PlaneTakeoff, HandHelping, Mic2, PartyPopper, Stethoscope,
  TrainFront, CarFront, Sun, Route, KeyRound, BusFront, UsersRound, ClipboardList,
  CircleDot, ArrowRight,
} from 'lucide-react'

// Icon map for section headers
const ICON_MAP = {
  state: <Building2 size={18} />,
  city: <Building2 size={18} />,
  country: <Globe2 size={18} />,
  destination: <MapPin size={18} />,
  place: <Camera size={18} />,
  activity: <Compass size={18} />,
  experience: <Sparkles size={18} />,
  park: <TreePine size={18} />,
  guide: <BookIcon size={18} />,
  domestic: <MapPin size={18} />,
  international: <Globe2 size={18} />,
  honeymoon: <Heart size={18} />,
  family: <Users size={18} />,
  adventure: <Mountain size={18} />,
  beach: <Waves size={18} />,
  spiritual: <Church size={18} />,
  luxury: <Star size={18} />,
  budget: <BadgeCheck size={18} />,
  weekend: <Tent size={18} />,
  group: <Users size={18} />,
  solo: <Compass size={18} />,
  festival: <PartyPopper size={18} />,
  all: <Globe2 size={18} />,
  meeting: <Mic2 size={18} />,
  incentive: <HandHelping size={18} />,
  conference: <Building2 size={18} />,
  exhibition: <PartyPopper size={18} />,
  travel: <PlaneTakeoff size={18} />,
  support: <Phone size={18} />,
  india: <MapPin size={18} />,
  venue: <Building2 size={18} />,
  theme: <Sparkles size={18} />,
  treatment: <Stethoscope size={18} />,
  hospital: <Building2 size={18} />,
  patient: <Shield size={18} />,
}

function BookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}

function MenuIcon({ name, size = 18 }) {
  return ICON_MAP[name] || <CircleDot size={size} />
}

const LOCAL_TRAVEL_SERVICE_ICONS = {
  airport: Plane,
  railway: TrainFront,
  taxi: CarFront,
  city: Building2,
  halfDay: Sun,
  outstation: Route,
  rental: KeyRound,
  bus: BusFront,
  corporate: UsersRound,
  custom: ClipboardList,
}

export function LocalTravelServiceIcon({ name, size = 16, className = '' }) {
  const Icon = LOCAL_TRAVEL_SERVICE_ICONS[name] || CircleDot
  return <Icon size={size} className={className} aria-hidden="true" />
}

export default function MegaMenu({ data, isOpen, onClose }) {
  const ref = useRef(null)

  if (!isOpen || !data) return null

  const hasBottomCards = data.bottomCards?.length > 0
  const hasBottomSections = data.bottomSections?.length > 0
  const hasTrustBar = data.trustBar?.length > 0
  const hasTrustBadges = data.trustBadges?.length > 0

  return (
    <div ref={ref} className="mega-menu-backdrop" onClick={onClose}>
      <div className="mega-menu-container" onClick={e => e.stopPropagation()}>
        <div className="mega-menu-inner">
          {/* Left panel — title + description + image */}
          <div className="mega-menu-left">
            <div className="mega-menu-icon-wrap">
              <MenuIcon name={data.columns?.[0]?.icon || 'destination'} size={24} />
            </div>
            <h3 className="mega-menu-title">{data.title}</h3>
            <p className="mega-menu-desc">{data.description}</p>
            {data.cta && (
              <Link to={data.cta.href} onClick={onClose} className="mega-menu-cta">
                {data.cta.label} <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {/* Center — columns */}
          <div className="mega-menu-columns">
            {data.columns.map((col, i) => (
              <div key={i} className="mega-menu-col">
                <div className="mega-menu-col-header">
                  <span className="mega-menu-col-icon">
                    <MenuIcon name={col.icon} size={16} />
                  </span>
                  <span className="mega-menu-col-title">{col.title}</span>
                </div>
                <ul className="mega-menu-col-list">
                  {col.items.map((item, j) => (
                    <li key={j}>
                      <Link to={item.href} onClick={onClose} className="mega-menu-link">
                        {data.variant === 'localTravel' && col.type === 'localServices' ? (
                          <>
                            <LocalTravelServiceIcon name={item.icon} className="shrink-0 text-sky-700" />
                            <span>{item.label}</span>
                            <ChevronRight size={14} className="mega-menu-chevron ml-auto" />
                          </>
                        ) : (
                          <>
                            <ChevronRight size={12} className="mega-menu-chevron" />
                            {item.label}
                          </>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                {col.viewAll && (
                  <Link to={col.viewAll.href} onClick={onClose} className="mega-menu-viewall">
                    {col.viewAll.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right side image for weddings/medical */}
          {data.sideCta && (
            <div className="mega-menu-side-cta">
              <div className="mega-menu-side-cta-inner">
                <Heart size={24} className="text-yellow-400 mb-3" />
                <h4 className="font-bold text-navy-900 mb-2">{data.sideCta.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{data.sideCta.text}</p>
                <Link to={data.sideCta.cta.href} onClick={onClose} className="mega-menu-enquire-btn">
                  {data.sideCta.cta.label} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bottom sections — Experiences / National Parks / Travel Guides */}
        {hasBottomSections && (
          <div className="mega-menu-bottom-sections">
            {data.bottomSections.map((sec, i) => (
              <div key={i} className="mega-menu-bottom-section">
                <div className="mega-menu-bottom-header">
                  <span className="mega-menu-col-icon">
                    <MenuIcon name={sec.icon} size={16} />
                  </span>
                  <span className="mega-menu-col-title">{sec.title}</span>
                </div>
                <div className="mega-menu-bottom-grid">
                  {sec.items.map((item, j) => (
                    <Link key={j} to={item.href} onClick={onClose} className="mega-menu-bottom-link">
                      <ChevronRight size={12} className="mega-menu-chevron" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom cards — Packages / Holidays style */}
        {hasBottomCards && (
          <div className="mega-menu-bottom-cards">
            {data.bottomCards.map((card, i) => (
              <Link key={i} to={card.href} onClick={onClose} className="mega-menu-bottom-card">
                <div className="mega-menu-bottom-card-icon">
                  <MenuIcon name={card.icon} size={20} />
                </div>
                <div>
                  <div className="mega-menu-bottom-card-title">{card.title}</div>
                  <div className="mega-menu-bottom-card-desc">{card.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Trust badges — Medical / Wedding style */}
        {hasTrustBadges && (
          <div className="mega-menu-trust-badges">
            {data.trustBadges.map((badge, i) => (
              <div key={i} className="mega-menu-trust-badge">
                <div className="mega-menu-trust-badge-icon">
                  <MenuIcon name={badge.icon} size={18} />
                </div>
                <div>
                  <div className="mega-menu-trust-badge-label">{badge.label}</div>
                  <div className="mega-menu-trust-badge-desc">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust bar — International style */}
        {hasTrustBar && (
          <div className="mega-menu-trust-bar">
            {data.trustBar.map((item, i) => (
              <div key={i} className="mega-menu-trust-item">
                <Shield size={16} className="text-sky-600" />
                <div>
                  <div className="mega-menu-trust-label">{item.label}</div>
                  <div className="mega-menu-trust-desc">{item.desc}</div>
                </div>
              </div>
            ))}
            <Link to="/international" onClick={onClose} className="mega-menu-explore-btn">
              EXPLORE THE WORLD <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Banner text — Holidays / India / Medical style */}
        {data.bannerText && (
          <div className="mega-menu-banner">
            <div className="mega-menu-banner-inner">
              <span className="mega-menu-banner-icon">💡</span>
              <span className="mega-menu-banner-text">{data.bannerText}</span>
            </div>
            {data.cta && (
              <Link to={data.cta.href} onClick={onClose} className="mega-menu-banner-cta">
                {data.cta.label} <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}

        {/* MICE banner style */}
        {data.banner && (
          <div className="mega-menu-mice-banner">
            <div className="mega-menu-mice-banner-left">
              <h4 className="font-bold text-white text-lg">{data.banner.title}</h4>
              <p className="text-white/80 text-sm">{data.banner.text}</p>
            </div>
            <div className="mega-menu-mice-banner-right">
              <div className="mega-menu-mice-help">
                <Phone size={20} className="text-sky-400" />
                <div>
                  <div className="text-white font-semibold text-sm">Need Help Planning Your Event?</div>
                  <div className="text-white/70 text-xs">Our MICE experts are here to help you plan the perfect event.</div>
                </div>
              </div>
              <Link to={data.banner.cta.href} onClick={onClose} className="mega-menu-enquire-btn">
                {data.banner.cta.label} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Contact bar — Packages style */}
        {data.contactBar && (
          <div className="mega-menu-contact-bar">
            <div className="mega-menu-contact-info">
              <div className="font-semibold text-white">{data.contactBar.title}</div>
              <div className="text-white/70 text-sm">{data.contactBar.subtitle}</div>
            </div>
            <div className="mega-menu-contact-details">
              <span className="flex items-center gap-1.5 text-white/80 text-sm"><Phone size={14} /> {data.contactBar.phone}</span>
              <span className="flex items-center gap-1.5 text-white/80 text-sm"><Mail size={14} /> {data.contactBar.email}</span>
              <span className="flex items-center gap-1.5 text-white/80 text-sm"><Clock size={14} /> {data.contactBar.hours}</span>
            </div>
            <Link to={data.contactBar.cta.href} onClick={onClose} className="mega-menu-enquire-btn">
              {data.contactBar.cta.label} <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
