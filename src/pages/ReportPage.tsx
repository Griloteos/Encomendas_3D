import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { collectPendingItems, downloadReportHTML, type NotificationReport } from '../services/NotificationService'
import { formatDate } from '../utils/format'

export default function ReportPage() {
  const navigate = useNavigate()
  const [report, setReport] = useState<NotificationReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReport()
  }, [])

  async function loadReport() {
    try {
      setLoading(true)
      const data = await collectPendingItems()
      setReport(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório')
    } finally {
      setLoading(false)
    }
  }

  function handleDownloadHTML() {
    if (report) {
      downloadReportHTML(report)
    }
  }

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-[#c8cad3]">Gerando relatório...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
        <div className="bg-red-950/80 border border-red-800/60 rounded-xl p-6 max-w-md">
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => navigate('/pedidos')}
            className="mt-4 btn-secondary w-full"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  if (!report) return null

  const getPriorityEmoji = (priority: string) => {
    if (priority === 'high') return '🔴'
    if (priority === 'medium') return '🟡'
    return '🟢'
  }

  const getDaysText = (days?: number) => {
    if (days === undefined) return ''
    if (days < 0) return `⚠️ ${Math.abs(days)} dia(s) atrasado`
    if (days === 0) return '⚠️ Vence hoje!'
    if (days === 1) return '⚠️ Vence amanhã'
    return `${days} dias restantes`
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#c8cad3] pb-24">
      {/* Header */}
      <header className="bg-[#161822] border-b border-[#282a3a] sticky top-0 z-10 px-4 py-3 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-[#9ca0b0] hover:text-white font-medium text-sm flex items-center gap-1 transition-colors"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-white">📋 Relatório de Pendências</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadHTML}
              className="text-xs px-3 py-1.5 bg-[#282a3a] border border-[#353849] text-[#c8cad3] hover:text-white rounded-lg transition-colors"
            >
              💾 Baixar HTML
            </button>
            <button
              onClick={handlePrint}
              className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              🖨️ Imprimir/PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#161822] border border-[#282a3a] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-indigo-400">{report.summary.totalOrders}</div>
            <div className="text-xs text-[#9ca0b0] uppercase mt-1">Pedidos Ativos</div>
          </div>
          <div className="bg-[#161822] border border-[#282a3a] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-400">{report.summary.ordersUrgent}</div>
            <div className="text-xs text-[#9ca0b0] uppercase mt-1">Pedidos Urgentes</div>
          </div>
          <div className="bg-[#161822] border border-[#282a3a] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-indigo-400">{report.summary.totalReminders}</div>
            <div className="text-xs text-[#9ca0b0] uppercase mt-1">Lembretes Ativos</div>
          </div>
          <div className="bg-[#161822] border border-[#282a3a] rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-400">{report.summary.remindersUrgent}</div>
            <div className="text-xs text-[#9ca0b0] uppercase mt-1">Lembretes Urgentes</div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-[#161822] border border-[#282a3a] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-[#282a3a]">
            📦 Encomendas Pendentes
          </h2>
          {report.ordersPending.length === 0 ? (
            <div className="text-center py-8 text-[#9ca0b0]">
              ✅ Nenhuma encomenda pendente
            </div>
          ) : (
            <div className="space-y-3">
              {report.ordersPending.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    order.priority === 'high'
                      ? 'bg-red-950/20 border-red-500'
                      : order.priority === 'medium'
                      ? 'bg-amber-950/20 border-amber-500'
                      : 'bg-emerald-950/20 border-emerald-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-white flex items-center gap-2">
                      {getPriorityEmoji(order.priority)} {order.title}
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-950/60 text-blue-300 border border-blue-800/60 rounded">
                      Pedido
                    </span>
                  </div>
                  {order.description && (
                    <div className="text-sm text-[#9ca0b0] mb-1">Cliente: {order.description}</div>
                  )}
                  {order.status && (
                    <div className="text-sm text-[#9ca0b0] mb-1">Status: {order.status}</div>
                  )}
                  {order.dueDate && (
                    <div className="text-sm text-[#9ca0b0] mb-1">
                      Entrega: {formatDate(order.dueDate)}
                    </div>
                  )}
                  {order.daysUntilDue !== undefined && (
                    <div className="text-sm font-semibold mt-2">{getDaysText(order.daysUntilDue)}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reminders Section */}
        <div className="bg-[#161822] border border-[#282a3a] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-[#282a3a]">
            📝 Lembretes Ativos
          </h2>
          {report.remindersActive.length === 0 ? (
            <div className="text-center py-8 text-[#9ca0b0]">
              ✅ Nenhum lembrete ativo
            </div>
          ) : (
            <div className="space-y-3">
              {report.remindersActive.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    reminder.priority === 'high'
                      ? 'bg-red-950/20 border-red-500'
                      : reminder.priority === 'medium'
                      ? 'bg-amber-950/20 border-amber-500'
                      : 'bg-emerald-950/20 border-emerald-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-white flex items-center gap-2">
                      {getPriorityEmoji(reminder.priority)} {reminder.title}
                    </div>
                    <span className="text-xs px-2 py-1 bg-pink-950/60 text-pink-300 border border-pink-800/60 rounded">
                      Lembrete
                    </span>
                  </div>
                  {reminder.description && (
                    <div className="text-sm text-[#9ca0b0] mb-1">{reminder.description}</div>
                  )}
                  {reminder.dueDate && (
                    <div className="text-sm text-[#9ca0b0] mb-1">
                      Data limite: {formatDate(reminder.dueDate)}
                    </div>
                  )}
                  {reminder.daysUntilDue !== undefined && (
                    <div className="text-sm font-semibold mt-2">{getDaysText(reminder.daysUntilDue)}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-[#6b6f80] print:mt-12">
          <p>Gerado em {new Date(report.generatedAt).toLocaleString('pt-BR')}</p>
          <p className="mt-1">Sistema de Encomendas 3D • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
