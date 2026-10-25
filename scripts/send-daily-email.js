/**
 * Script executado via GitHub Actions para enviar relatório diário por e-mail (SendGrid/Resend)
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const resendApiKey = process.env.RESEND_API_KEY
const adminEmail = process.env.ADMIN_EMAIL

if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !adminEmail) {
  console.error('❌ Missing required environment variables for daily report script')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function run() {
  console.log('🔄 Coletando pedidos e lembretes pendentes...')

  const { data: orders, error: ordersErr } = await supabase.from('orders').select('*')
  if (ordersErr) throw ordersErr

  const { data: reminders, error: remErr } = await supabase.from('reminders').select('*')
  if (remErr) throw remErr

  const pendingOrders = (orders || []).filter(o => o.status !== 'entregue')
  const activeReminders = (reminders || []).filter(r => !r.completed)

  const urgentOrders = pendingOrders.filter(o => {
    if (!o.delivery_date) return false
    const diff = Math.ceil((new Date(o.delivery_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff <= 2
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background: #0f1117; color: #c8cad3; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #161822; border-radius: 12px; padding: 24px; border: 1px solid #282a3a; }
        h1 { color: #818cf8; font-size: 24px; margin-bottom: 8px; }
        .stats { display: flex; gap: 12px; margin: 20px 0; }
        .stat-card { background: #1e2030; padding: 12px 16px; border-radius: 8px; flex: 1; border: 1px solid #353849; }
        .stat-value { font-size: 20px; font-weight: bold; color: #fff; }
        .item { background: #1e2030; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #6366f1; }
        .urgent { border-left-color: #ef4444; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📊 Relatório Diário - Encomendas 3D</h1>
        <p>Gerado em ${new Date().toLocaleString('pt-BR')}</p>

        <div class="stats">
          <div class="stat-card">
            <div>Pedidos Pendentes</div>
            <div class="stat-value">${pendingOrders.length}</div>
          </div>
          <div class="stat-card">
            <div>Urgentes 🔴</div>
            <div class="stat-value">${urgentOrders.length}</div>
          </div>
          <div class="stat-card">
            <div>Lembretes Ativos</div>
            <div class="stat-value">${activeReminders.length}</div>
          </div>
        </div>

        <h2>📦 Pedidos Ativos</h2>
        ${pendingOrders.length === 0 ? '<p>Nenhum pedido pendente 🎉</p>' : pendingOrders.map(o => `
          <div class="item ${o.delivery_date && new Date(o.delivery_date).getTime() - Date.now() <= 86400000 ? 'urgent' : ''}">
            <strong>${o.title}</strong> - Cliente: ${o.customer_name || 'N/D'}<br>
            Status: ${o.status} | Entrega: ${o.delivery_date ? new Date(o.delivery_date).toLocaleDateString('pt-BR') : 'Sem data'}
          </div>
        `).join('')}

        <h2>🔔 Lembretes</h2>
        ${activeReminders.length === 0 ? '<p>Nenhum lembrete pendente ✨</p>' : activeReminders.map(r => `
          <div class="item">
            <strong>${r.title}</strong> (${r.category})<br>
            ${r.description || ''}
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `

  console.log('📤 Enviando e-mail via Resend para:', adminEmail)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendApiKey}`
    },
    body: JSON.stringify({
      from: 'Encomendas 3D <noreply@encomendas3d.app>',
      to: [adminEmail],
      subject: `Relatório Diário de Pendências - ${new Date().toLocaleDateString('pt-BR')}`,
      html
    })
  })

  const resData = await res.json()
  if (!res.ok) {
    throw new Error(`Erro ao enviar email: ${JSON.stringify(resData)}`)
  }

  console.log('✅ Relatório diário enviado com sucesso!', resData)
}

run().catch(err => {
  console.error('❌ Erro no script de relatório:', err)
  process.exit(1)
})
