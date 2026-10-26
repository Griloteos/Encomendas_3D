import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { COLOR_PALETTE, getContrastColor } from './ColorSwatches'
import { isValidHex, normalizeHex } from '../utils/format'
import type { Color } from '../lib/supabase'

interface ColorPickerProps {
  selectedColors: Color[]
  onChange: (colors: Color[]) => void
  recentColors?: string[]
}

export default function ColorPicker({ selectedColors, onChange }: ColorPickerProps) {
  const [customHex, setCustomHex] = useState('#1E88E5')
  const [colorGrams, setColorGrams] = useState('')
  const [showPickerModal, setShowPickerModal] = useState(false)

  function addColor(hex: string, name?: string) {
    if (selectedColors.length >= 8) {
      alert('Máximo de 8 cores por encomenda.')
      return
    }
    const normalized = normalizeHex(hex)
    const newColor: Color = {
      hex: normalized,
      name: name || '',
      grams: colorGrams ? parseFloat(colorGrams) : undefined
    }
    onChange([...selectedColors, newColor])
    setColorGrams('')
  }

  function removeColor(index: number) {
    const updated = selectedColors.filter((_, i) => i !== index)
    onChange(updated)
  }

  function updateColorField(index: number, field: 'name' | 'grams', value: string | number) {
    const updated = [...selectedColors]
    if (field === 'grams') {
      updated[index] = { ...updated[index], grams: value === '' ? undefined : Number(value) }
    } else {
      updated[index] = { ...updated[index], name: String(value) }
    }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-[var(--color-surface-200)]">Cores usadas</label>

      {/* Selected color chips */}
      <div className="flex flex-wrap gap-2">
        {selectedColors.map((color, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-[var(--color-surface-700)] border border-[var(--color-surface-600)] rounded-lg p-2 text-sm text-white"
          >
            <span
              className="w-6 h-6 rounded-full border border-gray-600 shrink-0"
              style={{ backgroundColor: color.hex }}
            />
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Nome (opcional)"
                value={color.name || ''}
                onChange={(e) => updateColorField(index, 'name', e.target.value)}
                className="text-xs border-b border-[var(--color-surface-500)] bg-transparent text-white outline-none pb-0.5 w-24 placeholder-[var(--color-surface-400)]"
              />
              <span className="text-[10px] text-[var(--color-surface-300)] font-mono">{color.hex}</span>
            </div>
            <input
              type="number"
              step="0.1"
              placeholder="g"
              value={color.grams ?? ''}
              onChange={(e) => updateColorField(index, 'grams', e.target.value)}
              className="w-14 text-xs border border-[var(--color-surface-500)] rounded px-1 py-0.5 bg-[var(--color-surface-800)] text-white"
            />
            <button
              type="button"
              onClick={() => removeColor(index)}
              className="text-red-400 hover:text-red-300 font-bold px-1 text-sm"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {selectedColors.length < 8 && (
        <div className="space-y-3 p-3 bg-[var(--color-surface-700)]/60 rounded-xl border border-[var(--color-surface-600)]">
          <p className="text-xs font-medium text-[var(--color-surface-200)]">Adicionar cor da paleta:</p>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-9">
            {COLOR_PALETTE.map((c) => {
              const contrast = getContrastColor(c.hex)
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => addColor(c.hex, c.name)}
                  className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-[10px] shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.hex, color: contrast }}
                  title={`${c.name} (${c.hex})`}
                >
                  ✓
                </button>
              )
            })}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPickerModal(!showPickerModal)}
              className="btn-secondary text-xs py-2 px-3"
            >
              {showPickerModal ? 'Fechar seletor livre' : 'Usar seletor livre de cor'}
            </button>
          </div>

          {showPickerModal && (
            <div className="pt-3 border-t border-gray-200 space-y-3">
              <div className="flex justify-center">
                <HexColorPicker color={customHex} onChange={setCustomHex} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => setCustomHex(e.target.value)}
                  placeholder="#RRGGBB"
                  className="input-field text-sm font-mono py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isValidHex(customHex)) {
                      addColorStop(customHex)
                      setShowPickerModal(false)
                    } else {
                      alert('Código hexadecimal inválido (ex: #FF0000 ou FF0000)')
                    }
                  }}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Adicionar cor
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  function addColorStop(hex: string) {
    addColor(hex, '')
  }
}