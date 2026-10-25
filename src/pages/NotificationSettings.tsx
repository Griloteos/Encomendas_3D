import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { scheduleRecurringNotification, type NotificationChannel } from '../services/NotificationService'

export default function NotificationSettings() {
  const navigate = useNavigate()
  const [channel, setChannel] = useState<NotificationChannel>('email')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [time, setTime] = useState('09:00')
  const [destination, setDestination] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Carregar configuração salva
    const configStr = localStorage.getItem('notification-schedule')
    if (configStr) {
      const config = JSON.parse(configStr)
      setChannel(config.channel)
      setFrequency(config.frequency)
      setTime(config.time)
      setDestination(config.destination)
      setEnabled(config.enabled)
    }
  }, [])

  async function handleSave() {
    if (!destination.trim()) {
      alert('Por favor, informe um email ou telefone')
      return
    }

    try {
      setSaving(true)
      await scheduleRecurringNotification(channel, frequency, time, destination)
      alert('Configuração salva com sucesso!')
    } catch (error) {
      alert('Erro ao salvar configuração')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  function handleDisable() {
    localStorage.removeItem('notification-schedule')
    setEnabled(false)
    alert('Notificações automáticas desativadas')
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#c8cad3] pb-24">
      <header className="bg-[#161822] border-b border-[#282a3a] sticky top-0 z-10 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-[#9ca0b0] hover:text-white font-medium text-sm flex items-center gap-1 transition-colors"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-white">🔔 Configurar Notificações</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-[#161822] border border-[#282a3a] rounded-xl p-6 space-y-6">

          {/* Info Box */}
          <div className="bg-blue-950/20 border border-blue-800/40 rounded-lg p-4 text-sm text-blue-200">
            <p className="font-semibold mb-2">💡 Como funcionam as notificações?</p>
            <ul className="list-disc list-inside space-y-1 text-blue-200/80">
              <li><strong>Email:</strong> Relatório HTML completo enviado para seu email (requer Supabase Edge Function)</li>
              <li><strong>WhatsApp:</strong> Mensagem resumida via WhatsApp Business API (requer configuração)</li>
              <li><strong>PDF:</strong> Baixe o relatório em HTML e converta localmente</li>
              <li><strong>Push:</strong> Notificação no navegador (em breve)</li>
            </ul>
          </div>

          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-medium text-[#c8cad3] mb-2">
              Canal de Notificação
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'email', label: '📧 Email', available: true },
                { value: 'whatsapp', label: '💬 WhatsApp', available: true },
                { value: 'pdf', label: '📄 PDF', available: false },
                { value: 'push', label: '🔔 Push', available: false }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={!option.available}
                  onClick={() => setChannel(option.value as NotificationChannel)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    channel === option.value
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : option.available
                      ? 'bg-[#1e2030] border-[#282a3a] text-[#c8cad3] hover:border-[#353849]'
                      : 'bg-[#12141c] border-[#1e2030] text-[#6b6f80] cursor-not-allowed'
                  }`}
                >
                  {option.label}
                  {!option.available && <div className="text-[10px] mt-1">(em breve)</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-[#c8cad3] mb-2">
              Frequência
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  frequency === 'daily'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#1e2030] border-[#282a3a] text-[#c8cad3] hover:border-[#353849]'
                }`}
              >
                📅 Diário
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  frequency === 'weekly'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#1e2030] border-[#282a3a] text-[#c8cad3] hover:border-[#353849]'
                }`}
              >
                📆 Semanal
              </button>
            </div>
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-[#c8cad3] mb-2">
              Horário
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field bg-[#1e2030] text-white border-[#282a3a] w-full"
            />
            <p className="text-xs text-[#6b6f80] mt-1">
              Horário em que deseja receber o relatório
            </p>
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-[#c8cad3] mb-2">
              {channel === 'email' ? 'Email de destino' :
               channel === 'whatsapp' ? 'Número do WhatsApp' : 'Destino'}
            </label>
            <input
              id="destination"
              type={channel === 'email' ? 'email' : 'text'}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={
                channel === 'email' ? 'seu@email.com' :
                channel === 'whatsapp' ? '+55 11 99999-9999' : ''
              }
              className="input-field bg-[#1e2030] text-white border-[#282a3a] w-full"
            />
          </div>

          {/* Warning Box */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-4 text-sm text-amber-200">
            <p className="font-semibold mb-2">⚠️ Configuração Necessária</p>
            <p className="text-amber-200/80">
              Para Email e WhatsApp funcionarem, você precisa configurar Supabase Edge Functions.
              Consulte a documentação em <code className="bg-amber-900/40 px-1 rounded">supabase/functions/</code>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {enabled && (
              <button
                type="button"
                onClick={handleDisable}
                className="flex-1 btn-secondary bg-red-950/40 border-red-800/60 text-red-300 hover:bg-red-900/40"
              >
                Desativar Notificações
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 btn-primary bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saving ? 'Salvando...' : 'Salvar Configuração'}
            </button>
          </div>

          {/* Test Report Link */}
          <div className="text-center pt-4 border-t border-[#282a3a]">
            <button
              onClick={() => navigate('/relatorio')}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
            >
              📋 Ver Relatório Agora →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
