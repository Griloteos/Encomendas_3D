import { type Order } from '../lib/supabase'
import { formatBRL, formatDate, formatWhatsappForDisplay } from '../utils/format'
import DeadlineTag from './DeadlineTag'

interface OrderCardProps {
  order: Order
  onSelect: (order: Order) => void
  onStatusChange?: (order: Order, newStatus: Order['status']) => void
}

const statusColors: Record<Order['status'], { label: string; bg: string; text: string }> = {
  pendente: { label: 'Pendente', bg: 'bg-amber-100', text: 'text-amber-800' },
  imprimindo: { label: 'Imprimindo', bg: 'bg-blue-100', text: 'text-blue-800' },
  pronto: { label: 'Pronto', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  entregue: { label: 'Entregue', bg: 'bg-gray-100', text: 'text-gray-800' }
}

export default function OrderCard({ order, onSelect }: OrderCardProps) {
  const statusInfo = statusColors[order.status] || statusColors.pendente

  return (
    <div
      onClick={() => onSelect(order)}
      className="card hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-between gap-3 bg-[var(--color-surface-800)] border border-[var(--color-surface-600)] rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-base">{order.title}</h3>
          {order.customer_name && (
            <p className="text-sm text-[var(--color-surface-200)] truncate">Cliente: {order.customer_name}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`badge ${statusInfo.bg} ${statusInfo.text}`}>
            {statusInfo.label}
          </span>
          {order.status !== 'entregue' && <DeadlineTag deliveryDate={order.delivery_date} />}
        </div>
      </div>

      {/* Colors & Grams */}
      <div className="flex items-center justify-between text-sm text-[var(--color-surface-300)]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {order.colors && order.colors.length > 0 ? (
            order.colors.map((c, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-gray-600 inline-block shadow-xs"
                style={{ backgroundColor: c.hex }}
                title={c.name || c.hex}
              />
            ))
          ) : (
            <span className="text-xs text-[var(--color-surface-400)]">Sem cores</span>
          )}
          {order.filament_grams_total && (
            <span className="text-xs font-medium text-[var(--color-surface-200)] ml-1">
              {order.filament_grams_total}g
            </span>
          )}
        </div>
        <span className="font-semibold text-white text-base">{formatBRL(order.sale_price)}</span>
      </div>

      {/* Delivery date & WhatsApp */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-surface-700)] text-xs text-[var(--color-surface-300)]">
        <span>Entrega: {formatDate(order.delivery_date)}</span>
        {order.customer_whatsapp && (
          <span className="text-indigo-400 font-medium">
            {formatWhatsappForDisplay(order.customer_whatsapp)}
          </span>
        )}
      </div>
    </div>
  )
}