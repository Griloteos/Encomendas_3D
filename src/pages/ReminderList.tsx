import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getReminders, updateReminder, deleteReminder, getOrders, updateOrder } from '../lib/storage'
import { type Reminder, type ReminderCategory } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { formatDate } from '../utils/format'

const categoryColors: Record<ReminderCategory, { bg: string; text: string }> = {
  Geral: { bg: 'bg-zinc-800', text: 'text-zinc-300 border border-zinc-700' },
  Financeiro: { bg: 'bg-emerald-950/80', text: 'text-emerald-300 border border-emerald-800/60' },
  Cliente: { bg: 'bg-blue-950/80', text: 'text-blue-300 border border-blue-800/60' },
  Manutenção: { bg: 'bg-amber-950/80', text: 'text-amber-300 border border-amber-800/60' }
}

export default function ReminderList() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'pendentes' | 'concluidos'>('pendentes')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')

  useEffect(() => {
    loadReminders()
  }, [])

  async function loadReminders() {
    try {
      setLoading(true)
      const data = await getReminders()
      setReminders(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar lembretes. Verifique se a tabela de lembretes foi criada no Supabase.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleComplete(reminder: Reminder) {
    try {
      const updated = await updateReminder(reminder.id, { completed: !reminder.completed })
      setReminders(reminders.map((r) => (r.id === updated.id ? updated : r)))
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar lembrete')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este lembrete?')) return
    try {
      await deleteReminder(id)
      setReminders(reminders.filter((r) => r.id !== id))
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir lembrete')
    }
  }

  async function handleConvertToProjectNote(reminder: Reminder) {
    if (!reminder.order_id) {
      alert('Este lembrete não está vinculado a nenhuma encomenda. Edite o lembrete e escolha uma encomenda para vincular.')
      return
    }

    try {
      const orders = await getOrders()
      const order = orders.find((o) => o.id === reminder.order_id)
      if (!order) {
        alert('Encomenda vinculada não encontrada.')
        return
      }

      const newTitle = `${order.title} - ${reminder.title}`

      await updateOrder(order.id, { title: newTitle })
      alert(`Lembrete incorporado com sucesso na encomenda "${order.title}"!`)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao converter lembrete')
    }
  }

  const filteredReminders = reminders.filter((r) => {
    if (activeTab === 'pendentes' && r.completed) return false
    if (activeTab === 'concluidos' && !r.completed) return false
    if (selectedCategory !== 'todos' && r.category !== selectedCategory) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#c8cad3] pb-24">
      {/* Header */}
      <header className="bg-[#161822] border-b border-[#282a3a] sticky top-0 z-10 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white tracking-tight m-0">Lembretes & Tarefas</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/relatorio')}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg bg-[#282a3a] border border-[#353849] transition-colors"
            title="Ver relatório de pendências"
          >
            📋 Relatório
          </button>
          <button
            onClick={() => navigate('/notificacoes')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg bg-[#282a3a] border border-[#353849] transition-colors"
            title="Configurar notificações automáticas"
          >
            🔔 Notificações
          </button>
          <button
            onClick={() => signOut()}
            className="text-xs font-medium text-[#c8cad3] hover:text-white px-3 py-1.5 rounded-lg bg-[#282a3a] border border-[#353849] transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Navigation Switcher (Encomendas / Lembretes) */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="flex bg-[#161822] p-1 rounded-xl border border-[#282a3a]">
          <button
            onClick={() => navigate('/pedidos')}
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-[#9ca0b0] hover:text-white transition-all"
          >
            📦 Encomendas
          </button>
          <button
            onClick={() => navigate('/lembretes')}
            className="flex-1 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white shadow-sm transition-all"
          >
            📝 Lembretes
          </button>
        </div>

        {/* Tabs (Pendentes / Concluídos) */}
        <div className="flex border-b border-[#282a3a] mt-4">
          <button
            onClick={() => setActiveTab('pendentes')}
            className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'pendentes'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-[#9ca0b0] hover:text-[#c8cad3]'
            }`}
          >
            Pendentes ({reminders.filter((r) => !r.completed).length})
          </button>
          <button
            onClick={() => setActiveTab('concluidos')}
            className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'concluidos'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-[#9ca0b0] hover:text-[#c8cad3]'
            }`}
          >
            Concluídos ({reminders.filter((r) => r.completed).length})
          </button>
        </div>

        {/* Categories Filter */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['todos', 'Geral', 'Financeiro', 'Cliente', 'Manutenção'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#161822] border border-[#282a3a] text-[#c8cad3] hover:bg-[#1e2030]'
              }`}
            >
              {cat === 'todos' ? 'Todas Categorias' : cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-amber-950/80 border border-amber-800/60 rounded-xl text-sm text-amber-200 space-y-2">
            <p className="font-semibold">⚠️ Nota sobre a Tabela de Lembretes:</p>
            <p>{error}</p>
            <p className="text-xs text-amber-300/80">
              Caso seja o seu primeiro acesso aos lembretes, certifique-se de executar o arquivo de migração SQL (<code className="bg-amber-900/60 px-1 py-0.5 rounded">20261015000001_reminders.sql</code>) no SQL Editor do seu projeto Supabase.
            </p>
          </div>
        )}

        {/* Reminders List */}
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card h-20 skeleton bg-[#161822] border-[#282a3a]" />
              ))}
            </div>
          ) : filteredReminders.length === 0 ? (
            <div className="text-center py-12 bg-[#161822] rounded-xl border border-[#282a3a] p-6">
              <p className="text-[#9ca0b0] text-base">Nenhum lembrete encontrado.</p>
              <button
                onClick={() => navigate('/lembretes/novo')}
                className="mt-4 btn-primary inline-flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700"
              >
                + Criar primeiro lembrete
              </button>
            </div>
          ) : (
            filteredReminders.map((reminder) => {
              const catStyle = categoryColors[reminder.category] || categoryColors.Geral
              return (
                <div
                  key={reminder.id}
                  className={`card bg-[#161822] border border-[#282a3a] rounded-xl p-4 flex items-start justify-between gap-3 transition-opacity ${
                    reminder.completed ? 'opacity-50 bg-[#12141c]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={() => toggleComplete(reminder)}
                      className="w-5 h-5 text-indigo-600 rounded bg-[#1e2030] border-[#353849] focus:ring-indigo-500 mt-1 cursor-pointer"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-semibold text-white text-base truncate ${
                            reminder.completed ? 'line-through text-[#6b6f80]' : ''
                          }`}
                        >
                          {reminder.title}
                        </h3>
                        <span className={`badge ${catStyle.bg} ${catStyle.text} text-[10px]`}>
                          {reminder.category}
                        </span>
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-[#9ca0b0] whitespace-pre-wrap">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-[#6b6f80] pt-1">
                        {reminder.due_date && <span>📅 {formatDate(reminder.due_date)}</span>}
                        {reminder.order_id && (
                          <span className="text-indigo-400 font-medium">🔗 Vinculado a projeto</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {reminder.order_id && !reminder.completed && (
                      <button
                        type="button"
                        onClick={() => handleConvertToProjectNote(reminder)}
                        className="text-xs bg-purple-950/80 text-purple-300 border border-purple-800/60 px-2.5 py-1.5 rounded-lg hover:bg-purple-900/80 transition-colors"
                        title="Converter em nota/observação de projeto"
                      >
                        Converter p/ Projeto
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/lembretes/${reminder.id}/editar`)}
                      className="text-xs text-[#c8cad3] hover:text-white px-2.5 py-1.5 bg-[#282a3a] border border-[#353849] rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2.5 py-1.5 bg-red-950/40 border border-red-900/50 rounded-lg transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button
        onClick={() => navigate('/lembretes/novo')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 transition-transform active:scale-95 z-20"
        title="Novo lembrete"
      >
        +
      </button>
    </div>
  )
}
