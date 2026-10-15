import { type Order } from '../lib/supabase'
import { getDeadlineInfo } from '../utils/deadline'

interface AlertsBannerProps {
  orders: Order[]
  onSelectOrder: (order: Order) => void
}

export default function AlertsBanner({ orders, onSelectOrder }: AlertsBannerProps) {
  // Filter active orders that have delivery date today, overdue, or tomorrow
  const alertOrders = orders
    .filter((o) => o.status !== 'entregue')
    .map((o) => ({ order: o, info: getDeadlineInfo(o.delivery_date) }))
    .filter((item) => item.info.days <= 1)
    .sort((a, b) => a.info.days - b.info.days)

  if (alertOrders.length === 0) return null

  const overdueCount = alertOrders.filter((i) => i.info.days < 0).length
  const todayCount = alertOrders.filter((i) => i.info.days === 0).length
  const tomorrowCount = alertOrders.filter((i) => i.info.days === 1).length

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-amber-900">
          ⚠️ Alertas de Prazo ({alertOrders.length})
        </h3>
        <span className="text-xs text-amber-700">
          {[
            overdueCount > 0 ? `${overdueCount} atrasada(s)` : '',
            todayCount > 0 ? `${todayCount} hoje` : '',
            tomorrowCount > 0 ? `${tomorrowCount} amanhã` : ''
          ]
            .filter(Boolean)
            .join(' • ')}
        </span>
      </div>

      <div className="space-y-2">
        {alertOrders.map(({ order, info }) => (
          <div
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className="flex items-center justify-between bg-white border border-amber-200 rounded-md p-2.5 cursor-pointer hover:bg-amber-50 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  info.days < 0 ? 'bg-red-600' : info.days === 0 ? 'bg-orange-500' : 'bg-yellow-500'
                }`}
              />
              <span className="text-sm font-medium text-gray-800 truncate">{order.title}</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${
                info.days < 0
                  ? 'bg-red-100 text-red-800'
                  : info.days === 0
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {info.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}