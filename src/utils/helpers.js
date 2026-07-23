export function sanitizeUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url
  if (url.startsWith('/')) return url
  return ''
}

export function sanitizeText(text) {
  if (!text) return ''
  return String(text).replace(/<[^>]*>/g, '').trim()
}