import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react'
import api from '../../services/api'
import SEOHead from '../../components/common/SEOHead'
import { NotFoundPage } from '../common/ComingSoonPage'
import { articleSchema } from '../../seo/schema'

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setNotFound(false)
    setPost(null)
    api.get(`/blogs/slug/${slug}`)
      .then((response) => {
        if (mounted) setPost(response.data)
      })
      .catch(() => {
        if (mounted) setNotFound(true)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (notFound || !post) return <NotFoundPage />

  const published = formatDate(post.publishedAt || post.createdAt)
  const updated = formatDate(post.updatedAt)

  return (
    <div className="bg-gray-50">
      <SEOHead
        title={post.seoTitle || `${post.title} | Maqlaim Tours Travel Blog`}
        description={post.seoDescription || post.excerpt || post.description || `Read ${post.title} on the Maqlaim Tours travel blog.`}
        image={post.ogImage || post.image}
        type="article"
        publishedTime={post.publishedAt || post.createdAt}
        modifiedTime={post.updatedAt}
        jsonLd={articleSchema(post, `/blog/${post.slug || slug}`)}
      />
      <section className="relative h-[40vh] min-h-[300px]">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-900 to-sky-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 container-wide py-10">
          {post.category && <span className="badge-blue mb-3 inline-block">{post.category}</span>}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-white/80">
            {post.author && <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>}
            {published && <span className="flex items-center gap-1"><Calendar size={14} /> {published}</span>}
            {post.readTime && <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>}
          </div>
        </div>
      </section>

      <div className="section-padding">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-6 text-sm">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <article className="bg-white rounded-xl border p-8">
            <div className="prose prose-lg max-w-none">
              {String(post.content || post.excerpt || '').split('\n').map((line, i) => {
                const text = line.trim()
                if (!text) return null
                if (text.startsWith('## ')) return <h2 key={i} className="text-2xl font-display font-bold text-navy-900 mt-8 mb-3">{text.replace('## ', '')}</h2>
                if (/^\d+\.\s/.test(text)) return <h2 key={i} className="text-2xl font-display font-bold text-navy-900 mt-8 mb-3">{text.replace(/^\d+\.\s/, '')}</h2>
                return <p key={i} className="text-navy-600 leading-relaxed mb-4">{text}</p>
              })}
            </div>
            {updated && updated !== published && (
              <p className="mt-8 border-t pt-4 text-xs text-navy-400">Last updated {updated}</p>
            )}
          </article>

          <div className="mt-8 flex gap-4">
            <button className="btn-primary flex items-center gap-2"><Share2 size={16} /> Share Article</button>
          </div>
        </div>
      </div>
    </div>
  )
}
