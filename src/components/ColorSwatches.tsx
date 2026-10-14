// Standard color palette for 3D printing filaments
export const COLOR_PALETTE = [
  { name: 'Preto', hex: '#000000' },
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Cinza', hex: '#808080' },
  { name: 'Cinza claro', hex: '#C8C8C8' },
  { name: 'Vermelho', hex: '#E53935' },
  { name: 'Laranja', hex: '#FB8C00' },
  { name: 'Amarelo', hex: '#FDD835' },
  { name: 'Verde', hex: '#43A047' },
  { name: 'Verde claro', hex: '#9CCC65' },
  { name: 'Azul', hex: '#1E88E5' },
  { name: 'Azul escuro', hex: '#0D47A1' },
  { name: 'Ciano', hex: '#00ACC1' },
  { name: 'Roxo', hex: '#8E24AA' },
  { name: 'Rosa', hex: '#EC407A' },
  { name: 'Marrom', hex: '#6D4C41' },
  { name: 'Bege', hex: '#D7CCC8' },
  { name: 'Dourado', hex: '#D4AF37' },
  { name: 'Prata', hex: '#B0B7BD' }
]

// Get contrasting text color (black or white) based on background luminance
export function getContrastColor(hex: string): string {
  const cleaned = hex.replace(/^#/, '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)

  // Calculate relative luminance (WCAG formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// Check if color is dark
export function isDarkColor(hex: string): boolean {
  const cleaned = hex.replace(/^#/, '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)

  // Using YIQ formula
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return yiq < 128
}