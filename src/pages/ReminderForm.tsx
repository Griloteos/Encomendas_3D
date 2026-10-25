import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { createReminder, getReminderById, updateReminder, getOrders } from '../lib/storage'
import { type Order, type ReminderCategory } from '../lib/supabase'

export default function ReminderForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<Order[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ReminderCategory>('Geral')
  const [dueDate, setDueDate] = useState('')
  const [orderId, setOrderId] = useState<string>('')
  const [notifyAt, setNotifyAt] = useState('')

  useEffect(() => {
    loadOrdersList()
    if (isEditing && id) {
      loadReminder(id)
    }
  }, [id, isEditing])

  async function loadOrdersList() {
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function loadReminder(reminderId: string) {
    try {
      setFetching(true)
      const r = await getReminderById(reminderId)
      setTitle(r.title)
      setDescription(r.description || '')
      setCategory(r.category || 'Geral')
      setDueDate(r.due_date || '')
      setOrderId(r.order_id || '')
      setNotifyAt(r.notify_at ? r.notify_at.slice(0, 16) : '')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar lembrete')
    } finally {
      setFetching(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('O título é obrigatório.')
      return
    }

    try {
      setLoading(true)
      const reminderData = {
        title: title.trim(),
        description: description.trim() || null,
        category,
        due_date: dueDate || null,
        order_id: orderId || null,
        notify_at: notifyAt ? new Date(notifyAt).toISOString() : null
      }

      if (isEditing && id) {
        await updateReminder(id, reminderData)
      } else {
        await createReminder(reminderData)
      }
      navigate('/lembretes')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar lembrete. Verifique se a tabela de lembretes foi criada no Supabase.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#c8cad3] pb-24">
      {/* Header */}
      <header className="bg-[#161822] border-b border-[#282a3a] sticky top-0 z-10 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/lembretes')}
            className="text-[#9ca0b0] hover:text-white font-medium text-sm flex items-center gap-1 transition-colors"
          >
            ← Voltar
          </button>
          <h1 className="text-lg font-bold text-white m-0">
            {isEditing ? 'Editar Lembrete' : 'Novo Lembrete'}
          </h1>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-950/80 border border-red-800/60 rounded-xl text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#c8cad3] mb-1">
              Título / Tarefa *
            </label>
            <input
              id="title"
              type="text"
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Relembrar pagamento do João"
              className="input-field bg-[#161822] text-white border-[#282a3a] placeholder-[#6b6f80]"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#c8cad3] mb-1">
              Categoria *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ReminderCategory)}
              className="input-field bg-[#161822] text-white border-[#282a3a]"
            >
              <option value="Geral">Geral</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Cliente">Cliente</option>
              <option value="Manutenção">Manutenção</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#c8cad3] mb-1">
              Descrição / Observação
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais..."
              className="input-field bg-[#161822] text-white border-[#282a3a] placeholder-[#6b6f80]"
            />
          </div>

          {/* Due date & Notify */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-[#c8cad3] mb-1">
                Data Limite
              </label>
              <input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field bg-[#161822] text-white border-[#282a3a]"
              />
            </div>
            <div>
              <label htmlFor="notify_at" className="block text-sm font-medium text-[#c8cad3] mb-1">
                Data/Hora Notificação
              </label>
              <input
                id="notify_at"
                type="datetime-local"
                value={notifyAt}
                onChange={(e) => setNotifyAt(e.target.value)}
                className="input-field bg-[#161822] text-white border-[#282a3a]"
              />
            </div>
          </div>

          {/* Link to order */}
          <div>
            <label htmlFor="order_id" className="block text-sm font-medium text-[#c8cad3] mb-1">
              Vincular a Encomenda / Projeto (Opcional)
            </label>
            <select
              id="order_id"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="input-field bg-[#161822] text-white border-[#282a3a]"
            >
              <option value="">Nenhuma encomenda vinculada</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title} {o.customer_name ? `(${o.customer_name})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/lembretes')}
              className="flex-1 btn-secondary bg-[#282a3a] border-[#353849] text-[#c8cad3] hover:bg-[#353849] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {loading ? 'Salvando...' : 'Salvar Lembrete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
