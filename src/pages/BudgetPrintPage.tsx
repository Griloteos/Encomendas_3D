import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  DEFAULT_BUDGET_PARAMS,
  calculateItemCosts,
  type BudgetLineItem,
  type BudgetParameters
} from '../lib/budgetEngine'
import { formatBRL } from '../utils/format'

export default function BudgetPrintPage() {
  const navigate = useNavigate()
  const [clientName, setClientName] = useState('Augusto')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail] = useState('')
  const [validityDays, setValidityDays] = useState(10)
  const [notes, setNotes] = useState('Pagamento: 50% de entrada e 50% na entrega/envio.')

  const [params, setParams] = useState<BudgetParameters>(DEFAULT_BUDGET_PARAMS)

  const [items, setItems] = useState<BudgetLineItem[]>([
    {
      id: '1',
      productName: 'Peça Personalizada 3D',
      printerModel: 'A1',
      materialName: 'PETG',
      weightGrams: 200,
      printHours: 10,
      laborHours: 2,
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
      alert('O orçamento suporta até 8 produtos.')
      return
    }
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productName: `Produto ${items.length + 1}`,
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

  const calculatedItems = items.map(item => ({
    item,
    calc: calculateItemCosts(item, params)
  }))

  const subtotal = calculatedItems.reduce((acc, { calc }) => acc + calc.itemTotal, 0)
  const discountAmount = subtotal * params.manualDiscountPercent
  const totalOrder = subtotal - discountAmount

  function handlePrint() {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-950, #0a0b10)] text-white p-4 md:p-8">
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top bar (No Print) */}
        <div className="flex items-center justify-between bg-[var(--color-surface-800)] p-4 rounded-2xl border border-[var(--color-surface-600)] no-print">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>📄</span> Gerador de Proposta Comercial PDF (AXIOM 3D)
            </h1>
            <p className="text-xs text-[var(--color-surface-300)]">Preencha os dados e clique em Imprimir para gerar a folha única de proposta.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/orcamento')} className="btn-secondary text-xs">
              ← Voltar ao Calculador Completo
            </button>
            <button onClick={handlePrint} className="btn-primary text-xs flex items-center gap-1.5 py-2 px-4">
              <span>🖨️</span> Imprimir / Salvar PDF
            </button>
          </div>
        </div>

        {/* Inputs de Preenchimento Rápido (No Print) */}
        <div className="bg-[var(--color-surface-800)] border border-[var(--color-surface-600)] p-5 rounded-2xl space-y-4 no-print">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">1. Dados do Cliente e Condições</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">WhatsApp / Telefone</label>
              <input
                type="text"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="(63) 99999-9999"
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Validade (Dias)</label>
              <input
                type="number"
                value={validityDays}
                onChange={e => setValidityDays(Number(e.target.value))}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Desconto Pedido (%)</label>
              <input
                type="number"
                value={Math.round(params.manualDiscountPercent * 100)}
                onChange={e => setParams({ ...params, manualDiscountPercent: Number(e.target.value) / 100 })}
                className="input-field text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-surface-300)] mb-1">Observações / Condições de Pagamento</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* Gerenciamento de Itens para a Proposta (No Print) */}
        <div className="bg-[var(--color-surface-800)] border border-[var(--color-surface-600)] p-5 rounded-2xl space-y-4 no-print">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">2. Produtos do Orçamento ({items.length}/8)</h2>
            <button onClick={addItem} className="btn-primary text-xs py-1.5 px-3">➕ Adicionar Produto</button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="flex flex-wrap items-center gap-3 bg-[var(--color-surface-700)] p-3 rounded-xl border border-[var(--color-surface-600)]">
                <span className="text-xs font-bold text-indigo-300">#{idx + 1}</span>
                <input
                  type="text"
                  value={item.productName}
                  onChange={e => updateItem(item.id, 'productName', e.target.value)}
                  placeholder="Nome do produto"
                  className="input-field text-xs flex-1 min-w-[150px]"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[var(--color-surface-300)]">Qtd:</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                    className="input-field text-xs w-16 text-center"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[var(--color-surface-300)]">Peso (g):</span>
                  <input
                    type="number"
                    step="1"
                    value={item.weightGrams}
                    onChange={e => updateItem(item.id, 'weightGrams', Number(e.target.value))}
                    className="input-field text-xs w-20 text-center"
                  />
                </div>
                {items.length > 1 && (
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* ======================================================= */}
        {/* PÁGINA DE PROPOSTA FORMATADA (A4 ÚNICA PARA IMPRESSÃO/PDF) */}
        {/* ======================================================= */}
        <div className="print-container bg-white text-gray-900 p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-200">

          {/* Cabeçalho */}
          <div className="flex justify-between items-start border-b-2 border-indigo-900 pb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-indigo-900">AXIOM 3D</h1>
              <p className="text-xs text-indigo-700 font-semibold uppercase tracking-widest mt-0.5">Impressão 3D Profissional de Alta Precisão</p>
            </div>
            <div className="text-right text-xs text-gray-600 space-y-0.5">
              <p className="font-bold text-gray-800 text-sm">PROPOSTA COMERCIAL</p>
              <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
              <p>Validade: {validityDays} dias</p>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Cliente</p>
              <p className="font-bold text-gray-900 text-base">{clientName || 'Cliente'}</p>
            </div>
            <div className="text-right">
              {clientPhone && <p className="text-sm"><strong>WhatsApp:</strong> {clientPhone}</p>}
              {clientEmail && <p className="text-sm"><strong>E-mail:</strong> {clientEmail}</p>}
            </div>
          </div>

          {/* Tabela de Itens */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Itens do Orçamento</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-xs text-gray-600 uppercase">
                  <th className="py-2.5 px-2">Item / Descrição</th>
                  <th className="py-2.5 px-2 text-center">Qtd</th>
                  <th className="py-2.5 px-2 text-right">Preço Unit.</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {calculatedItems.map(({ item, calc }, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-800">
                      {idx + 1}. {item.productName}
                      <span className="block text-xs text-gray-500">
                        Material: {item.materialName} ({item.weightGrams}g) | Acabamento: {item.finish1}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-gray-700">{item.quantity} un.</td>
                    <td className="py-3 px-2 text-right text-gray-700">{formatBRL(calc.wholesalePriceUnit)}</td>
                    <td className="py-3 px-2 text-right font-bold text-gray-900">{formatBRL(calc.itemTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumo e Totais */}
          <div className="pt-4 border-t-2 border-gray-200 flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="text-xs text-gray-600 space-y-1 w-full md:w-1/2 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="font-bold text-gray-800">Condições Comerciais:</p>
              <p>{notes}</p>
              <p className="text-[11px] text-gray-500 mt-2">Axiom 3D - Tecnologia e Precisão em Cada Camada.</p>
            </div>

            <div className="w-full md:w-auto text-right space-y-1 bg-indigo-50 p-4 rounded-xl border border-indigo-100 min-w-[260px]">
              <div className="flex justify-between text-xs text-gray-600 gap-6">
                <span>Subtotal:</span>
                <span>{formatBRL(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-amber-700 gap-6">
                  <span>Desconto ({Math.round(params.manualDiscountPercent * 100)}%):</span>
                  <span>- {formatBRL(discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-indigo-200 flex justify-between items-center gap-6">
                <span className="text-xs font-bold text-indigo-900 uppercase">Total do Pedido:</span>
                <span className="text-2xl font-black text-indigo-950">{formatBRL(totalOrder)}</span>
              </div>
            </div>
          </div>

          {/* Assinatura */}
          <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs text-gray-500 pt-8">
            <div className="border-t border-gray-400 pt-2">
              Axiom 3D - Responsável Técnico
            </div>
            <div className="border-t border-gray-400 pt-2">
              De acordo do Cliente
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
