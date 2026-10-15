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
      className="card hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between gap-3 bg-white border border-gray-200 rounded-lg p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-base">{order.title}</h3>
          {order.customer_name && (
            <p className="text-sm text-gray-600 truncate">Cliente: {order.customer_name}</p>
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
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1.5 flex-wrap">
          {order.colors && order.colors.length > 0 ? (
            order.colors.map((c, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-gray-300 inline-block"
                style={{ backgroundColor: c.hex }}
                title={c.name || c.hex}
              />
            ))
          ) : (
            <span className="text-xs text-gray-400">Sem cores</span>
          )}
          {order.filament_grams_total && (
            <span className="text-xs font-medium text-gray-500 ml-1">
              {order.filament_grams_total}g
            </span>
          )}
        </div>
        <span className="font-semibold text-gray-900">{formatBRL(order.sale_price)}</span>
      </div>

      {/* Delivery date & WhatsApp */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
        <span>Entrega: {formatDate(order.delivery_date)}</span>
        {order.customer_whatsapp && (
          <span className="text-blue-600 font-medium">
            {formatWhatsappForDisplay(order.customer_whatsapp)}
          </span>
        )}
      </div>
    </div>
  )
}