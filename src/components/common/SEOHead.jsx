import SEOHead from '../../seo/Seo'

/**
 * Backwards-compatible wrapper. Existing pages import this component and pass
 * title/description/keywords/image; those props now also produce a canonical
 * URL, robots directives, Open Graph/Twitter tags, breadcrumbs and JSON-LD.
 */
export default SEOHead
