import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items = [], light = false }) {
  return (
    <nav className={`flex items-center gap-1 text-sm mb-4 flex-wrap ${light ? 'text-white/75' : 'text-navy-500'}`} aria-label="Breadcrumb">
      <Link to="/" className={`flex items-center gap-1 transition-colors ${light ? 'hover:text-white' : 'hover:text-sky-600'}`}>
        <Home size={14} />
        <span>Home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={12} className={light ? 'text-white/40' : 'text-navy-300'} />
          {item.href ? (
            <Link to={item.href} className={`transition-colors ${light ? 'hover:text-white' : 'hover:text-sky-600'}`}>{item.label}</Link>
          ) : (
            <span className={`font-medium ${light ? 'text-white' : 'text-navy-800'}`}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
