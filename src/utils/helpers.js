// Format price in Indian number system
export const formatPrice = (num) => {
  if (!num) return '—'
  if (num >= 1_00_00_000) return `₹${(num / 1_00_00_000).toFixed(2)} Cr`
  if (num >= 1_00_000) return `₹${(num / 1_00_000).toFixed(2)} L`
  return `₹${num.toLocaleString('en-IN')}`
}

// Format possession date
export const formatPossession = (possession) => {
  if (!possession || !possession.month || !possession.year) return '—'
  return `${possession.month} ${possession.year}`
}

// Format area in sqft
export const formatArea = (sqft) => {
  if (!sqft) return '—'
  return `${sqft.toLocaleString('en-IN')} sq.ft`
}

// Get primary image URL
export const getPrimaryImage = (images) => {
  if (!images || images.length === 0) return null
  return images[0].url
}

// Truncate text
export const truncate = (str, n) => {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

// BHK variant color
export const bhkColor = (type) => {
  const map = {
    '1 BHK': 'badge-neutral',
    '2 BHK': 'badge-teal',
    '3 BHK': 'badge-navy',
    '4 BHK': 'badge-gold',
    '5 BHK': 'badge-coral',
  }
  return map[type] || 'badge-neutral'
}

// Price range from variants
export const getPriceRange = (variants) => {
  if (!variants || variants.length === 0) return null
  const prices = variants
    .flatMap(v => v.carpet || [])
    .map(c => c.price)
    .filter(Boolean)
  if (prices.length === 0) return null
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return formatPrice(min)
  return `${formatPrice(min)} – ${formatPrice(max)}`
}
