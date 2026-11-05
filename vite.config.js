import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildSitemapXml } from './src/seo/sitemap.js'

/** Serve the dynamic sitemap locally (dev + preview) exactly as Vercel does. */
function sitemapPlugin() {
  const serveSitemap = async (req, res, next) => {
    const pathname = (req.url || '').split('?')[0]
    if (pathname !== '/sitemap.xml') return next()
    try {
      const xml = await buildSitemapXml()
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.end(xml)
    } catch (error) {
      next(error)
    }
  }

  return {
    name: 'maqlaim-sitemap',
    configureServer(server) {
      server.middlewares.use(serveSitemap)
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveSitemap)
    },
  }
}

/** Inject the optional Search Console verification token into the built HTML. */
function searchConsoleVerificationPlugin() {
  return {
    name: 'maqlaim-search-console-verification',
    transformIndexHtml(html) {
      const token = String(process.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim()
      if (!token) return html
      return html.replace(
        '</head>',
        `    <meta name="google-site-verification" content="${token}" />\n  </head>`,
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), sitemapPlugin(), searchConsoleVerificationPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://final-backend-production-7276.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react-vendor'
          if (/node_modules[\\/](react-router|react-router-dom|@remix-run)[\\/]/.test(id)) return 'router'
          if (/node_modules[\\/](axios|date-fns|clsx|react-hook-form|react-hot-toast|lucide-react)[\\/]/.test(id)) return 'ui-vendor'
          return undefined
        },
      },
    },
  },
})
