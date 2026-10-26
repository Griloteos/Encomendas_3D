import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { formatBRL } from '../utils/format'

interface ProposalData {
  clientName: string
  clientPhone: string
  clientEmail: string
  validityDays: number
  notes: string
  params: any
  items: any[]
  calculatedItems: any[]
  totalPieces: number
  totalProductionCost: number
  subtotal: number
  discountAmount: number
  totalOrder: number
}

export default function BudgetPrintPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<ProposalData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('axiom_proposal_data')
    if (raw) {
      try {
        setData(JSON.parse(raw))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  function handlePrint() {
    window.print()
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-900)] text-white flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-sm text-[var(--color-surface-300)]">Nenhum orçamento carregado. Por favor, volte ao calculador e clique em "Gerar Proposta PDF".</p>
        <button onClick={() => navigate('/orcamento')} className="btn-primary text-xs">
          ← Ir para o Orçamento
        </button>
      </div>
    )
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
              <span>📄</span> Proposta Comercial Pronta (AXIOM 3D)
            </h1>
            <p className="text-xs text-[var(--color-surface-300)]">Os valores foram calculados automaticamente com base na aba de orçamento.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/orcamento')} className="btn-secondary text-xs">
              ← Voltar ao Calculador
            </button>
            <button onClick={handlePrint} className="btn-primary text-xs flex items-center gap-1.5 py-2 px-4">
              <span>🖨️</span> Imprimir / Salvar PDF
            </button>
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
              <p>Validade: {data.validityDays} dias</p>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Cliente</p>
              <p className="font-bold text-gray-900 text-base">{data.clientName || 'Cliente'}</p>
            </div>
            <div className="text-right">
              {data.clientPhone && <p className="text-sm"><strong>WhatsApp:</strong> {data.clientPhone}</p>}
              {data.clientEmail && <p className="text-sm"><strong>E-mail:</strong> {data.clientEmail}</p>}
            </div>
          </div>

          {/* Tabela de Itens */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Itens do Orçamento ({data.totalPieces} peças no total)</h3>
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
                {data.calculatedItems.map(({ item, calc }: any, idx: number) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-800">
                      {idx + 1}. {item.productName}
                      <span className="block text-xs text-gray-500">
                        Impressora: {item.printerModel} | Material: {item.materialName} ({item.weightGrams}g) | Acabamento: {item.finish1}
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
              <p>{data.notes}</p>
              <p className="text-[11px] text-gray-500 mt-2">Axiom 3D - Tecnologia e Precisão em Cada Camada.</p>
            </div>

            <div className="w-full md:w-auto text-right space-y-1 bg-indigo-50 p-4 rounded-xl border border-indigo-100 min-w-[260px]">
              <div className="flex justify-between text-xs text-gray-600 gap-6">
                <span>Subtotal:</span>
                <span>{formatBRL(data.subtotal)}</span>
              </div>
              {data.discountAmount > 0 && (
                <div className="flex justify-between text-xs text-amber-700 gap-6">
                  <span>Desconto ({Math.round(data.params.manualDiscountPercent * 100)}%):</span>
                  <span>- {formatBRL(data.discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-indigo-200 flex justify-between items-center gap-6">
                <span className="text-xs font-bold text-indigo-900 uppercase">Total do Pedido:</span>
                <span className="text-2xl font-black text-indigo-950">{formatBRL(data.totalOrder)}</span>
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
