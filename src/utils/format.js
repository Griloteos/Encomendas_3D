// Format utilities for Brazilian locale

export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

export function formatDateShort(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  }).format(date)
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Normalize WhatsApp to digits with DDI
export function normalizeWhatsapp(input) {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 0) return ''
  if (digits.length <= 2) return digits
  if (digits.length <= 11 && digits.startsWith('55')) {
    return '55' + digits.slice(2)
  }
  if (digits.length <= 10) {
    return '55' + digits
  }
  return digits.slice(0, 15)
}

// Format WhatsApp for display
export function formatWhatsappForDisplay(whatsapp) {
  if (!whatsapp || whatsapp.length < 10) return ''
  const digits = whatsapp.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 12) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }
  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }
  return whatsapp
}

// Parse grams input (accepts comma or dot as decimal separator)
export function parseGrams(input) {
  if (!input.trim()) return null
  const normalized = input.replace(',', '.')
  const value = parseFloat(normalized)
  return isNaN(value) || value < 0 ? null : value
}

// Validate hex color
export function isValidHex(hex) {
  const cleaned = hex.replace(/^#/, '')
  return /^[0-9A-Fa-f]{6}$/.test(cleaned)
}

// Normalize hex color to uppercase with #
export function normalizeHex(hex) {
  const cleaned = hex.replace(/^#/, '').toUpperCase()
  return `#${cleaned}`
}