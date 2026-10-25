import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getOrders } from '../lib/storage'
import { type Order } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { subscribeUserToPush } from '../lib/push'
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
  const [pushLoading, setPushLoading] = useState(false)

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

  async function handleEnablePush() {
    try {
      setPushLoading(true)
      await subscribeUserToPush()
      alert('Lembretes diários ativados com sucesso!')
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao ativar lembretes')
    } finally {
      setPushLoading(false)
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
    <div className="min-h-screen bg-[#0f1117] text-[#c8cad3] pb-24">
      {/* Header */}
      <header className="bg-[#161822] border-b border-[#282a3a] sticky top-0 z-10 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white tracking-tight m-0">Encomendas 3D</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/relatorio')}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-lg bg-[#282a3a] border border-[#353849] transition-colors"
            title="Ver relatório de pendências"
          >
            📋 Relatório
          </button>
          <button
            onClick={handleEnablePush}
            disabled={pushLoading}
            className="text-xs font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 px-2.5 py-1.5 rounded-lg border border-indigo-800/50 transition-colors"
            title="Ativar notificações push diárias às 08:00"
          >
            {pushLoading ? 'Ativando...' : '🔔 Push'}
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
            className="flex-1 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white shadow-sm transition-all"
          >
            📦 Encomendas
          </button>
          <button
            onClick={() => navigate('/lembretes')}
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-[#9ca0b0] hover:text-white transition-all"
          >
            📝 Lembretes ({orders.length > 0 ? '' : ''})
          </button>
        </div>

        {/* Sub-tabs (Ativas / Arquivadas) */}
        <div className="flex border-b border-[#282a3a] mt-4">
          <button
            onClick={() => {
              setActiveTab('ativas')
              setStatusFilter('todos')
            }}
            className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'ativas'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-[#9ca0b0] hover:text-[#c8cad3]'
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
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-[#9ca0b0] hover:text-[#c8cad3]'
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
            className="input-field bg-[#161822] text-white border-[#282a3a] placeholder-[#6b6f80]"
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
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#161822] border border-[#282a3a] text-[#c8cad3] hover:bg-[#1e2030]'
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
          <div className="mt-4 p-3 bg-red-950/80 border border-red-800/60 rounded-lg text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Content list */}
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card h-28 skeleton bg-[#161822] border-[#282a3a]" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-[#161822] rounded-xl border border-[#282a3a] p-6 mt-4">
              <p className="text-[#9ca0b0] text-base">Nenhuma encomenda encontrada.</p>
              {activeTab === 'ativas' && (
                <button
                  onClick={() => navigate('/pedidos/novo')}
                  className="mt-4 btn-primary inline-flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700"
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 transition-transform active:scale-95 z-20"
        title="Nova encomenda"
      >
        +
      </button>
    </div>
  )
}
