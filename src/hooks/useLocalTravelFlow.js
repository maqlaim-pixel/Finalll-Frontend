import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RETURN_KEY = 'tv_local_travel_return'
const draftKey = path => `tv_local_travel_draft:${path}`

export function getLocalTravelReturnPath() {
  const path = sessionStorage.getItem(RETURN_KEY)
  return path && path.startsWith('/local-travel/') && !path.includes('//') ? path : null
}

export function clearLocalTravelReturnPath() {
  sessionStorage.removeItem(RETURN_KEY)
}

export default function useLocalTravelFlow(initialForm) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState(() => {
    try {
      const draft = JSON.parse(sessionStorage.getItem(draftKey(location.pathname)) || 'null')
      return draft && typeof draft === 'object' ? { ...initialForm, ...draft } : initialForm
    } catch {
      return initialForm
    }
  })
  const [authPromptOpen, setAuthPromptOpen] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem(draftKey(location.pathname), JSON.stringify(form)) } catch { /* Keep the form usable if browser storage is unavailable. */ }
  }, [form, location.pathname])

  useEffect(() => {
    const savedPath = getLocalTravelReturnPath()
    if (user && savedPath === location.pathname) {
      clearLocalTravelReturnPath()
      setAuthPromptOpen(false)
    }
  }, [user, location.pathname])

  const requireAuthentication = useCallback(() => {
    try { sessionStorage.setItem(draftKey(location.pathname), JSON.stringify(form)) } catch { /* Navigation still works without draft persistence. */ }
    sessionStorage.setItem(RETURN_KEY, location.pathname)
    setAuthPromptOpen(true)
  }, [form, location.pathname])

  const continueToAuth = useCallback(path => {
    sessionStorage.setItem(RETURN_KEY, location.pathname)
    navigate(path)
  }, [location.pathname, navigate])

  const clearDraft = useCallback(() => {
    sessionStorage.removeItem(draftKey(location.pathname))
  }, [location.pathname])

  return { form, setForm, user, authPromptOpen, setAuthPromptOpen, requireAuthentication, continueToAuth, clearDraft }
}
