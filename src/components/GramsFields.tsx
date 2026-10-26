import type { Color } from '../lib/supabase'

interface GramsFieldsProps {
  totalGrams: string
  onTotalChange: (val: string) => void
  colors: Color[]
}

export default function GramsFields({ totalGrams, onTotalChange, colors }: GramsFieldsProps) {
  const sumGrams = colors.reduce((acc, c) => acc + (Number(c.grams) || 0), 0)
  const hasColorGrams = colors.some((c) => c.grams !== undefined && c.grams !== null && c.grams > 0)
  const totalNum = parseFloat(totalGrams) || 0
  const isDifferent = hasColorGrams && Math.abs(sumGrams - totalNum) > 0.01

  function handleUseSum() {
    onTotalChange(sumGrams.toFixed(1))
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="filament_grams_total" className="block text-sm font-medium text-[var(--color-surface-200)] mb-1">
          Gramas de filamento (total)
        </label>
        <div className="flex items-center gap-2">
          <input
            id="filament_grams_total"
            type="number"
            step="0.1"
            min="0"
            value={totalGrams}
            onChange={(e) => onTotalChange(e.target.value)}
            placeholder="Ex: 125.5"
            className="input-field"
          />
          <span className="text-sm font-medium text-[var(--color-surface-300)]">g</span>
        </div>
      </div>

      {hasColorGrams && (
        <div className="p-3 bg-[var(--color-surface-700)] border border-[var(--color-surface-600)] rounded-xl flex items-center justify-between text-sm">
          <span className="text-[var(--color-surface-100)]">
            Soma por cor: <strong className="text-white">{sumGrams.toFixed(1)}g</strong>
          </span>
          {isDifferent && (
            <button
              type="button"
              onClick={handleUseSum}
              className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Usar soma como total
            </button>
          )}
        </div>
      )}
    </div>
  )
}