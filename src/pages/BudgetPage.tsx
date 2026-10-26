import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  DEFAULT_BUDGET_PARAMS,
  DEFAULT_PRINTERS,
  DEFAULT_MATERIALS,
  DEFAULT_FINISHES,
  DEFAULT_PACKAGING,
  calculateItemCosts,
  type BudgetLineItem,
  type BudgetParameters
} from '../lib/budgetEngine'
import { formatBRL } from '../utils/format'

export default function BudgetPage() {
  const navigate = useNavigate()
  const [clientName, setClientName] = useState('Augusto')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [params, setParams] = useState<BudgetParameters>(DEFAULT_BUDGET_PARAMS)

  const [items, setItems] = useState<BudgetLineItem[]>([
    {
      id: '1',
      productName: 'Projeto Peça 3D',
      printerModel: 'A1',
      materialName: 'PETG',
      weightGrams: 377.1,
      printHours: 20,
      laborHours: 3,
      finish1: 'Lixamento',
      finish2: 'Nenhum',
      packaging: 'Saco plástico',
      quantity: 1,
      accessory1: 'Nenhum',
      accessory2: 'Nenhum'
    }
  ])

  function addItem() {
    if (items.length >= 8) {
      alert('O orçamento suporta até 8 produtos por pedido.')
      return
    }
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productName: `Novo Produto ${items.length + 1}`,
        printerModel: 'A1',
        materialName: 'PLA',
        weightGrams: 100,
        printHours: 5,
        laborHours: 1,
        finish1: 'Nenhum',
        finish2: 'Nenhum',
        packaging: 'Nenhuma',
        quantity: 1,
        accessory1: 'Nenhum',
        accessory2: 'Nenhum'
      }
    ])
  }

  function removeItem(id: string) {
    if (items.length === 1) {
      alert('O orçamento precisa ter pelo menos 1 item.')
      return
    }
    setItems(items.filter(i => i.id !== id))
  }

  function updateItem(id: string, field: keyof BudgetLineItem, value: any) {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  // Cálculos consolidados
  const calculatedItems = items.map(item => ({
    item,
    calc: calculateItemCosts(item, params)
  }))

  const totalPieces = items.reduce((acc, i) => acc + Number(i.quantity || 0), 0)
  const totalProductionCost = calculatedItems.reduce((acc, { item, calc }) => acc + (calc.productionCostUnit * item.quantity), 0)
  const subtotal = calculatedItems.reduce((acc, { calc }) => acc + calc.itemTotal, 0)
  const discountAmount = subtotal * params.manualDiscountPercent
  const totalOrder = subtotal - discountAmount
  const estimatedTax = totalOrder * params.taxPercent
  const estimatedProfit = totalOrder - totalProductionCost - estimatedTax

  function handlePrintProposal() {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-900)] text-[var(--color-surface-150)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-surface-800)] border border-[var(--color-surface-600)] p-6 rounded-2xl shadow-xl no-print">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              <span>📐</span> Orçamento & Precificação AXIOM 3D
            </h1>
            <p className="text-sm text-[var(--color-surface-300)] mt-1">
              Gere propostas profissionais com cálculo exato de custos, descontos de atacado e margem.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/pedidos')}
              className="btn-secondary text-sm"
            >
              ← Voltar aos Pedidos
            </button>
            <button
              onClick={() => navigate('/orcamento/proposta')}
              className="btn-primary flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-500"
            >
              <span>📄</span> Ver Proposta Pronta para Cliente
            </button>
          </div>
        </div>

        {/* Cliente & Parâmetros Financeiros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
          <div className="bg-[var(--color-surface-800)] border border-[var(--color-surface-600)] p-5 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>👤</span> Dados do Cliente
            </h2>
            <div>
              <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Nome do Cliente</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="(63) 99999-9999"
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">E-mail</label>
              <input
                type="email"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="input-field text-sm"
              />
            </div>
          </div>

          <div className="bg-[var(--color-surface-800)] border border-[var(--color-surface-600)] p-5 rounded-2xl space-y-4 md:col-span-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚙️</span> Parâmetros Financeiros do Orçamento
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Tarifa Energia (R$/kWh)</label>
                <input
                  type="number"
                  step="0.01"
                  value={params.electricityTariff}
                  onChange={e => setParams({ ...params, electricityTariff: Number(e.target.value) })}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Mão de Obra (R$/h)</label>
                <input
                  type="number"
                  step="1"
                  value={params.laborCostPerHour}
                  onChange={e => setParams({ ...params, laborCostPerHour: Number(e.target.value) })}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Impostos (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={params.taxPercent * 100}
                  onChange={e => setParams({ ...params, taxPercent: Number(e.target.value) / 100 })}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Margem Lucro (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={params.marginPercent * 100}
                  onChange={e => setParams({ ...params, marginPercent: Number(e.target.value) / 100 })}
                  className="input-field text-sm"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-[var(--color-surface-700)] flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-[var(--color-surface-200)]">Desconto Manual do Pedido (%):</span>
              </div>
              <div className="w-32">
                <input
                  type="number"
                  step="1"
                  value={Math.round(params.manualDiscountPercent * 100)}
                  onChange={e => setParams({ ...params, manualDiscountPercent: Number(e.target.value) / 100 })}
                  className="input-field text-sm text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Itens (Até 8 produtos) */}
        <div className="bg-[var(--color-surface-800)] border border-[var(--color-surface-600)] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📦</span> Itens do Orçamento ({items.length}/8 produtos)
            </h2>
            <button
              onClick={addItem}
              className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3"
            >
              <span>➕</span> Adicionar Produto
            </button>
          </div>

          <div className="space-y-6">
            {calculatedItems.map(({ item, calc }, index) => (
              <div key={item.id} className="bg-[var(--color-surface-700)]/60 border border-[var(--color-surface-600)] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-surface-600)] pb-3">
                  <span className="font-bold text-indigo-400 text-sm">Produto #{index + 1}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 rounded bg-red-950/40 border border-red-900/50"
                    >
                      Remover Item
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Nome do Produto</label>
                    <input
                      type="text"
                      value={item.productName}
                      onChange={e => updateItem(item.id, 'productName', e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Quantidade (Qtd)</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Impressora</label>
                    <select
                      value={item.printerModel}
                      onChange={e => updateItem(item.id, 'printerModel', e.target.value)}
                      className="input-field text-sm bg-[var(--color-surface-700)]"
                    >
                      {DEFAULT_PRINTERS.map(p => (
                        <option key={p.model} value={p.model}>{p.model}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Material</label>
                    <select
                      value={item.materialName}
                      onChange={e => updateItem(item.id, 'materialName', e.target.value)}
                      className="input-field text-sm bg-[var(--color-surface-700)]"
                    >
                      {DEFAULT_MATERIALS.map(m => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Peso (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.weightGrams}
                      onChange={e => updateItem(item.id, 'weightGrams', Number(e.target.value))}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Tempo Impressão (h)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.printHours}
                      onChange={e => updateItem(item.id, 'printHours', Number(e.target.value))}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Mão de Obra (h)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.laborHours}
                      onChange={e => updateItem(item.id, 'laborHours', Number(e.target.value))}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Acabamento 1</label>
                    <select
                      value={item.finish1}
                      onChange={e => updateItem(item.id, 'finish1', e.target.value)}
                      className="input-field text-sm bg-[var(--color-surface-700)]"
                    >
                      {DEFAULT_FINISHES.map(f => (
                        <option key={f.name} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Embalagem</label>
                    <select
                      value={item.packaging}
                      onChange={e => updateItem(item.id, 'packaging', e.target.value)}
                      className="input-field text-sm bg-[var(--color-surface-700)]"
                    >
                      {DEFAULT_PACKAGING.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resumo do Item Calculado */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[var(--color-surface-600)] text-xs text-[var(--color-surface-200)] gap-2 bg-[var(--color-surface-800)] p-3 rounded-xl">
                  <div>Custo Prod./un: <strong className="text-white">{formatBRL(calc.productionCostUnit)}</strong></div>
                  <div>Desconto Atacado: <strong className="text-indigo-400">{(calc.wholesaleDiscount * 100).toFixed(0)}%</strong></div>
                  <div>Preço Unitário: <strong className="text-white">{formatBRL(calc.wholesalePriceUnit)}</strong></div>
                  <div className="text-sm font-extrabold text-emerald-400">Total Item: {formatBRL(calc.itemTotal)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totais do Orçamento */}
        <div className="bg-[var(--color-surface-800)] border border-[var(--color-surface-600)] rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>💰</span> Resumo Financeiro do Pedido
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-[var(--color-surface-700)] p-4 rounded-xl border border-[var(--color-surface-600)]">
              <div className="text-xs text-[var(--color-surface-300)] mb-1">Qtd. Total de Peças</div>
              <div className="text-xl font-bold text-white">{totalPieces}</div>
            </div>
            <div className="bg-[var(--color-surface-700)] p-4 rounded-xl border border-[var(--color-surface-600)]">
              <div className="text-xs text-[var(--color-surface-300)] mb-1">Custo Total Produção</div>
              <div className="text-xl font-bold text-amber-400">{formatBRL(totalProductionCost)}</div>
            </div>
            <div className="bg-[var(--color-surface-700)] p-4 rounded-xl border border-[var(--color-surface-600)]">
              <div className="text-xs text-[var(--color-surface-300)] mb-1">Subtotal (c/ Atacado)</div>
              <div className="text-xl font-bold text-white">{formatBRL(subtotal)}</div>
            </div>
            <div className="bg-indigo-950/80 p-4 rounded-xl border border-indigo-800/60">
              <div className="text-xs text-indigo-300 mb-1">TOTAL DO PEDIDO</div>
              <div className="text-2xl font-black text-indigo-400">{formatBRL(totalOrder)}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[var(--color-surface-700)] text-sm text-[var(--color-surface-200)]">
            <div>Impostos Estimados: <strong className="text-white">{formatBRL(estimatedTax)}</strong></div>
            <div>Lucro Total Estimado: <strong className="text-emerald-400 font-bold">{formatBRL(estimatedProfit)}</strong></div>
            <button
              onClick={handlePrintProposal}
              className="btn-primary text-sm px-6"
            >
              Gerar Proposta PDF para Cliente 📄
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
