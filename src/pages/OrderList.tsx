import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getOrders } from '../lib/storage'
import { type Order } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import OrderCard from '../components/OrderCard'
import AlertsBanner from '../components/AlertsBanner'

export default function OrderList() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'ativas' | 'arquivadas'>('ativas')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      setLoading(true)
      const data = await getOrders()
      setOrders(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar encomendas')
    } finally {
      setLoading(false)
    }
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const isArchived = order.status === 'entregue'
    if (activeTab === 'ativas' && isArchived) return false
    if (activeTab === 'arquivadas' && !isArchived) return false

    if (activeTab === 'ativas' && statusFilter !== 'todos' && order.status !== statusFilter) {
      return false
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = order.title.toLowerCase().includes(q)
      const matchCustomer = order.customer_name?.toLowerCase().includes(q) || false
      if (!matchTitle && !matchCustomer) return false
    }

    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 m-0">Encomendas 3D</h1>
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
            onClick={() => {
              setActiveTab('ativas')
              setStatusFilter('todos')
            }}
            className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'ativas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Ativas ({orders.filter((o) => o.status !== 'entregue').length})
          </button>
          <button
            onClick={() => {
              setActiveTab('arquivadas')
              setStatusFilter('todos')
            }}
            className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'arquivadas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Arquivadas ({orders.filter((o) => o.status === 'entregue').length})
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título ou cliente..."
            className="input-field bg-white"
          />

          {activeTab === 'ativas' && (
            <>
              <AlertsBanner orders={orders} onSelectOrder={(o) => navigate(`/pedidos/${o.id}`)} />
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { key: 'todos', label: 'Todas' },
                  { key: 'pendente', label: 'Pendente' },
                  { key: 'imprimindo', label: 'Imprimindo' },
                  { key: 'pronto', label: 'Pronto' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      statusFilter === filter.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Content list */}
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card h-28 skeleton bg-white" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 p-6 mt-4">
              <p className="text-gray-500 text-base">Nenhuma encomenda encontrada.</p>
              {activeTab === 'ativas' && (
                <button
                  onClick={() => navigate('/pedidos/novo')}
                  className="mt-4 btn-primary inline-flex items-center gap-2 text-sm"
                >
                  Criar primeira encomenda
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={(o) => navigate(`/pedidos/${o.id}`)}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button
        onClick={() => navigate('/pedidos/novo')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-transform active:scale-95 z-20"
        title="Nova encomenda"
      >
        +
      </button>
    </div>
  )
}