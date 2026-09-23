import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'

if (import.meta.env.DEV) {
  console.log('[TravelVista LOCAL RUNTIME]')
  console.log('Project: atlas-and-route/travelfrontend')
  console.log('API base: /api')
  console.log('Expected proxy target: Railway')
  console.log('Build marker: LOCAL-RUNTIME-VERIFY-2026')
  window.__TRAVELVISTA_RUNTIME__ = {
    apiBase: '/api',
    marker: 'LOCAL-RUNTIME-VERIFY-2026',
  }
}

// Suppress browser extension errors only (share-modal.js, Facebook Pixel, etc.)
window.addEventListener('error', (e) => {
  const src = e.filename || e.srcElement?.src || ''
  const msg = e.message || ''
  if (src.includes('share-modal') || src.includes('read.js') || src.includes('content.js') ||
      msg.includes('message channel closed') || msg.includes('listener indicated')) {
    e.stopImmediatePropagation()
    e.preventDefault()
    return false
  }
}, true)
window.addEventListener('unhandledrejection', (e) => {
  const msg = e.reason?.message || String(e.reason || '')
  if (msg.includes('message channel closed') || msg.includes('listener indicated')) {
    e.preventDefault()
    return false
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <App />
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '10px', padding: '16px' } }} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
