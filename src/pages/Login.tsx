import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { signIn, session } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect to /pedidos
  useEffect(() => {
    if (session) {
      navigate('/pedidos', { replace: true })
    }
  }, [session, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/pedidos', { replace: true })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4 text-[#c8cad3]">
      <div className="w-full max-w-sm bg-[#161822] border border-[#282a3a] rounded-2xl p-6 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl">
            🖨️
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Encomendas 3D</h1>
          <p className="text-[#9ca0b0] text-sm mt-1">Gerencie suas impressões 3D</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#c8cad3] mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#1e2030] border border-[#353849] rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-[#6b6f80]"
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#c8cad3] mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#1e2030] border border-[#353849] rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-[#6b6f80]"
              placeholder="Sua senha"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800/60 rounded-xl">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
