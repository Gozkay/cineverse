import { describe, it, expect } from 'vitest'
import { sanitizeUrl, sanitizeText } from '@/utils/helpers'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate, formatDateTime } from '@/utils/formatDate'

describe('sanitizeUrl', () => {
  it('allows https URLs', () => {
    expect(sanitizeUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
  })

  it('allows http URLs', () => {
    expect(sanitizeUrl('http://example.com/image.jpg')).toBe('http://example.com/image.jpg')
  })

  it('rejects javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('')
  })

  it('rejects empty values', () => {
    expect(sanitizeUrl('')).toBe('')
    expect(sanitizeUrl(null)).toBe('')
    expect(sanitizeUrl(undefined)).toBe('')
  })
})

describe('sanitizeText', () => {
  it('removes HTML tags', () => {
    expect(sanitizeText('<script>alert(1)</script>')).toBe('alert(1)')
  })

  it('trims whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello')
  })

  it('handles null/undefined', () => {
    expect(sanitizeText(null)).toBe('')
    expect(sanitizeText(undefined)).toBe('')
  })
})

describe('formatCurrency', () => {
  it('formats NGN currency', () => {
    const result = formatCurrency(1500)
    expect(result).toContain('1,500')
  })

  it('handles zero', () => {
    expect(formatCurrency(0)).toBeDefined()
  })
})

describe('formatDate', () => {
  it('formats valid date string', () => {
    const result = formatDate('2024-01-15')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('handles invalid date', () => {
    const result = formatDate('not-a-date')
    expect(typeof result).toBe('string')
  })
})

describe('formatDateTime', () => {
  it('formats valid datetime string', () => {
    const result = formatDateTime('2024-01-15T10:30:00Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
