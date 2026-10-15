import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { deleteOrder, getOrderById, updateOrder } from '../lib/storage'
import { type Order, type OrderStatus } from '../lib/supabase'
import { formatBRL, formatDate, formatWhatsappForDisplay } from '../utils/format'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) loadOrder(id)
  }, [id])

  async function loadOrder(orderId: string) {
    try {
      setLoading(true)
      const data = await getOrderById(orderId)
      setOrder(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar encomenda')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(newStatus: OrderStatus) {
    if (!order) return
    try {
      const updates: Partial<Order> = { status: newStatus }
      if (newStatus === 'entregue' && !order.delivered_at) {
        updates.delivered_at = new Date().toISOString()
      }
      const updated = await updateOrder(order.id, updates)
      setOrder(updated)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar status')
    }
  }

  async function handleDelete() {
    if (!order) return
    if (!confirm('Tem certeza que deseja excluir esta encomenda?')) return

    try {
      await deleteOrder(order.id)
      navigate('/pedidos')
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir encomenda')
    }
  }

  function handleWhatsappClick() {
    if (!order || !order.customer_whatsapp) return
    const phone = order.customer_whatsapp
    const msg = encodeURIComponent(
      `Olá${order.customer_name ? ` ${order.customer_name}` : ''}! Sobre a sua encomenda "${order.title}", previsão de entrega em ${formatDate(order.delivery_date)}.`
    )
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-600 font-medium mb-4">{error || 'Encomenda não encontrada'}</p>
        <button onClick={() => navigate('/pedidos')} className="btn-primary">
          Voltar para lista
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/pedidos')}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-lg font-bold text-gray-800 m-0 truncate max-w-[200px] sm:max-w-md">
            {order.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/pedidos/${order.id}/editar`)}
            className="btn-secondary text-xs py-2 px-3"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="btn-danger text-xs py-2 px-3"
          >
            Excluir
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Status card */}
        <div className="card bg-white p-4 space-y-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status da Encomenda
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'pendente', label: 'Pendente' },
              { key: 'imprimindo', label: 'Imprimindo' },
              { key: 'pronto', label: 'Pronto' },
              { key: 'entregue', label: 'Entregue' }
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => handleStatusChange(s.key as OrderStatus)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors border ${
                  order.status === s.key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Details card */}
        <div className="card bg-white p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-gray-500">Valor de Venda</span>
              <p className="text-2xl font-bold text-gray-900">{formatBRL(order.sale_price)}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">Custo</span>
              <p className="text-lg font-semibold text-gray-600">{formatBRL(order.cost_price)}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-gray-500 block">Data de Entrega</span>
              <strong className="text-gray-800">{formatDate(order.delivery_date)}</strong>
            </div>
            {order.filament_grams_total !== null && order.filament_grams_total !== undefined && (
              <div>
                <span className="text-xs text-gray-500 block">Filamento Total</span>
                <strong className="text-gray-800">{order.filament_grams_total}g</strong>
              </div>
            )}
          </div>

          {/* Colors */}
          {order.colors && order.colors.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <span className="text-xs text-gray-500 block mb-2">Cores Utilizadas</span>
              <div className="flex flex-wrap gap-2">
                {order.colors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="font-medium text-gray-800">
                      {c.name || c.hex}
                    </span>
                    {c.grams && <span className="text-gray-500">({c.grams}g)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer */}
          {(order.customer_name || order.customer_whatsapp) && (
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <span className="text-xs text-gray-500 block">Cliente</span>
              {order.customer_name && <p className="font-medium text-gray-800">{order.customer_name}</p>}
              {order.customer_whatsapp && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    {formatWhatsappForDisplay(order.customer_whatsapp)}
                  </span>
                  <button
                    onClick={handleWhatsappClick}
                    className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Abrir WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}