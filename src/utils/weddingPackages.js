function metadataText(value) {
  if (Array.isArray(value)) return value.map(metadataText).join(' ')
  if (value && typeof value === 'object') return Object.values(value).map(metadataText).join(' ')
  return value == null ? '' : String(value)
}

export function isDestinationWeddingPackage(pkg, destinationNames) {
  if (!pkg || typeof pkg !== 'object') return false
  const destinations = Array.isArray(destinationNames) ? destinationNames : [destinationNames]
  const placeMetadata = [pkg.state, pkg.destination, pkg.city, pkg.country].map(metadataText).join(' ')
  const weddingMetadata = [pkg.category, pkg.subcategory, pkg.type, pkg.packageType, pkg.tags]
    .map(metadataText).join(' ')
  const normalizedPlace = ` ${placeMetadata.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `
  const matchesDestination = destinations.some(destination => {
    const normalized = String(destination || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    return normalized && normalizedPlace.includes(` ${normalized} `)
  })
  return matchesDestination && /\bweddings?\b/i.test(weddingMetadata)
}

export function getPublishedDestinationWeddingPackages(packages, destinationNames) {
  if (!Array.isArray(packages)) return []
  return packages.filter(pkg =>
    String(pkg?.status || '').toLowerCase() === 'published' &&
    pkg.isActive !== false &&
    isDestinationWeddingPackage(pkg, destinationNames)
  )
}
