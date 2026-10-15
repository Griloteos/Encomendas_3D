import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getReminders, updateReminder, deleteReminder, getOrders, updateOrder } from '../lib/storage'
import { type Reminder, type ReminderCategory } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { formatDate } from '../utils/format'

const categoryColors: Record<ReminderCategory, { bg: string; text: string }> = {
  Geral: { bg: 'bg-gray-100', text: 'text-gray-800' },
  Financeiro: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  Cliente: { bg: 'bg-blue-100', text: 'text-blue-800' },
  Manutenção: { bg: 'bg-amber-100', text: 'text-amber-800' }
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
      setError(err instanceof Error ? err.message : 'Erro ao carregar lembretes')
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 m-0">Lembretes</h1>
          <nav className="flex gap-2">
            <button
              onClick={() => navigate('/pedidos')}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Encomendas
            </button>
          </nav>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200"
        >
          Sair
        </button>
      </header>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pendentes')}
            className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'pendentes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pendentes ({reminders.filter((r) => !r.completed).length})
          </button>
          <button
            onClick={() => setActiveTab('concluidos')}
            className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'concluidos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat === 'todos' ? 'Todas Categorias' : cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Reminders List */}
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card h-20 skeleton bg-white" />
              ))}
            </div>
          ) : filteredReminders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500 text-base">Nenhum lembrete encontrado.</p>
              <button
                onClick={() => navigate('/lembretes/novo')}
                className="mt-4 btn-primary inline-flex items-center gap-2 text-sm"
              >
                Criar primeiro lembrete
              </button>
            </div>
          ) : (
            filteredReminders.map((reminder) => {
              const catStyle = categoryColors[reminder.category] || categoryColors.Geral
              return (
                <div
                  key={reminder.id}
                  className={`card bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-3 transition-opacity ${
                    reminder.completed ? 'opacity-60 bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={() => toggleComplete(reminder)}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1 cursor-pointer"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-semibold text-gray-900 text-base truncate ${
                            reminder.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {reminder.title}
                        </h3>
                        <span className={`badge ${catStyle.bg} ${catStyle.text} text-[10px]`}>
                          {reminder.category}
                        </span>
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                        {reminder.due_date && <span>📅 {formatDate(reminder.due_date)}</span>}
                        {reminder.order_id && (
                          <span className="text-blue-600 font-medium">🔗 Vinculado a projeto</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {reminder.order_id && !reminder.completed && (
                      <button
                        type="button"
                        onClick={() => handleConvertToProjectNote(reminder)}
                        className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1.5 rounded hover:bg-purple-100 transition-colors"
                        title="Converter em nota/observação de projeto"
                      >
                        Converter p/ Projeto
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/lembretes/${reminder.id}/editar`)}
                      className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 border border-gray-200 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="text-xs text-red-600 hover:text-red-800 px-2 py-1 border border-red-200 rounded"
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-transform active:scale-95 z-20"
        title="Novo lembrete"
      >
        +
      </button>
    </div>
  )
}