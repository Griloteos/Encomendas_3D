/**
 * Serviço de Notificações e Relatórios
 *
 * Oferece múltiplas formas de notificação sobre pendências:
 * - Email (via Supabase Edge Functions)
 * - WhatsApp (via API Twilio/Evolution API)
 * - PDF gerado localmente
 * - Notificações Push
 */

import { supabase } from '../lib/supabase'
import { getOrders, getReminders } from '../lib/storage'

export type NotificationChannel = 'email' | 'whatsapp' | 'push' | 'pdf'

export interface PendingItem {
  type: 'order' | 'reminder'
  id: string
  title: string
  description?: string
  dueDate?: string
  status?: string
  priority: 'high' | 'medium' | 'low'
  daysUntilDue?: number
}

export interface NotificationReport {
  generatedAt: string
  ordersPending: PendingItem[]
  remindersActive: PendingItem[]
  summary: {
    totalOrders: number
    ordersUrgent: number
    totalReminders: number
    remindersUrgent: number
  }
}

/**
 * Coleta todas as pendências (pedidos e lembretes)
 */
export async function collectPendingItems(): Promise<NotificationReport> {
  const [orders, reminders] = await Promise.all([
    getOrders(),
    getReminders()
  ])

  const now = new Date()

  // Filtrar pedidos não concluídos (status: 'entregue' ou 'pendente', 'imprimindo', 'pronto')
  const pendingOrders = orders
    .filter(o => o.status !== 'entregue')
    .map(order => {
      const dueDate = order.delivery_date ? new Date(order.delivery_date) : null
      const daysUntil = dueDate ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

      let priority: 'high' | 'medium' | 'low' = 'low'
      if (daysUntil !== null) {
        if (daysUntil < 0) priority = 'high' // Atrasado
        else if (daysUntil <= 2) priority = 'high' // Urgente
        else if (daysUntil <= 7) priority = 'medium' // Próximo
      }

      return {
        type: 'order' as const,
        id: order.id,
        title: order.title,
        description: order.customer_name || undefined,
        dueDate: order.delivery_date || undefined,
        status: order.status,
        priority,
        daysUntilDue: daysUntil || undefined
      }
    })
    .sort((a, b) => {
      // Prioridade: high > medium > low, depois por data
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (a.daysUntilDue !== undefined && b.daysUntilDue !== undefined) {
        return a.daysUntilDue - b.daysUntilDue
      }
      return 0
    })

  // Filtrar lembretes não concluídos
  const activeReminders = reminders
    .filter(r => !r.completed)
    .map(reminder => {
      const dueDate = reminder.due_date ? new Date(reminder.due_date) : null
      const daysUntil = dueDate ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

      let priority: 'high' | 'medium' | 'low' = 'low'
      if (daysUntil !== null) {
        if (daysUntil < 0) priority = 'high'
        else if (daysUntil <= 2) priority = 'high'
        else if (daysUntil <= 7) priority = 'medium'
      }

      return {
        type: 'reminder' as const,
        id: reminder.id,
        title: reminder.title,
        description: reminder.description || undefined,
        dueDate: reminder.due_date || undefined,
        priority,
        daysUntilDue: daysUntil || undefined
      }
    })
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (a.daysUntilDue !== undefined && b.daysUntilDue !== undefined) {
        return a.daysUntilDue - b.daysUntilDue
      }
      return 0
    })

  const ordersUrgent = pendingOrders.filter(o => o.priority === 'high').length
  const remindersUrgent = activeReminders.filter(r => r.priority === 'high').length

  return {
    generatedAt: now.toISOString(),
    ordersPending: pendingOrders,
    remindersActive: activeReminders,
    summary: {
      totalOrders: pendingOrders.length,
      ordersUrgent,
      totalReminders: activeReminders.length,
      remindersUrgent
    }
  }
}

/**
 * Gera HTML do relatório para visualização/email/PDF
 */
export function generateReportHTML(report: NotificationReport): string {
  const { ordersPending, remindersActive, summary } = report

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Sem data'
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  const getPriorityEmoji = (priority: string) => {
    if (priority === 'high') return '🔴'
    if (priority === 'medium') return '🟡'
    return '🟢'
  }

  const getDaysText = (days?: number) => {
    if (days === undefined) return ''
    if (days < 0) return `⚠️ ${Math.abs(days)} dia(s) atrasado`
    if (days === 0) return '⚠️ Vence hoje!'
    if (days === 1) return '⚠️ Vence amanhã'
    return `${days} dias restantes`
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Pendências - Encomendas 3D</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      padding: 30px;
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
    }
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .summary-card .number {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
      margin: 0;
    }
    .summary-card .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-top: 5px;
    }
    .summary-card.urgent .number {
      color: #ef4444;
    }
    .section {
      padding: 30px;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin: 0 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }
    .item {
      background: #f8f9fa;
      padding: 15px;
      margin-bottom: 12px;
      border-radius: 8px;
      border-left: 4px solid #ccc;
    }
    .item.high {
      border-left-color: #ef4444;
      background: #fef2f2;
    }
    .item.medium {
      border-left-color: #f59e0b;
      background: #fffbeb;
    }
    .item.low {
      border-left-color: #10b981;
      background: #f0fdf4;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .item-title {
      font-weight: 600;
      font-size: 16px;
      color: #1f2937;
    }
    .item-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-order {
      background: #dbeafe;
      color: #1e40af;
    }
    .badge-reminder {
      background: #fce7f3;
      color: #9f1239;
    }
    .item-meta {
      font-size: 13px;
      color: #6b7280;
      margin-top: 5px;
    }
    .item-days {
      margin-top: 8px;
      font-size: 13px;
      font-weight: 600;
    }
    .empty {
      text-align: center;
      padding: 40px;
      color: #9ca3af;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Relatório de Pendências</h1>
      <p>Gerado em ${new Date(report.generatedAt).toLocaleString('pt-BR')}</p>
    </div>

    <div class="summary">
      <div class="summary-card">
        <div class="number">${summary.totalOrders}</div>
        <div class="label">Pedidos Ativos</div>
      </div>
      <div class="summary-card urgent">
        <div class="number">${summary.ordersUrgent}</div>
        <div class="label">Pedidos Urgentes</div>
      </div>
      <div class="summary-card">
        <div class="number">${summary.totalReminders}</div>
        <div class="label">Lembretes Ativos</div>
      </div>
      <div class="summary-card urgent">
        <div class="number">${summary.remindersUrgent}</div>
        <div class="label">Lembretes Urgentes</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">📦 Encomendas Pendentes</h2>
      ${ordersPending.length === 0 ? '<div class="empty">✅ Nenhuma encomenda pendente</div>' :
        ordersPending.map(order => `
          <div class="item ${order.priority}">
            <div class="item-header">
              <div class="item-title">${getPriorityEmoji(order.priority)} ${order.title}</div>
              <span class="item-badge badge-order">Pedido</span>
            </div>
            ${order.description ? `<div class="item-meta">Cliente: ${order.description}</div>` : ''}
            ${order.status ? `<div class="item-meta">Status: ${order.status}</div>` : ''}
            ${order.dueDate ? `<div class="item-meta">Entrega: ${formatDate(order.dueDate)}</div>` : ''}
            ${order.daysUntilDue !== undefined ? `<div class="item-days">${getDaysText(order.daysUntilDue)}</div>` : ''}
          </div>
        `).join('')
      }
    </div>

    <div class="section">
      <h2 class="section-title">📝 Lembretes Ativos</h2>
      ${remindersActive.length === 0 ? '<div class="empty">✅ Nenhum lembrete ativo</div>' :
        remindersActive.map(reminder => `
          <div class="item ${reminder.priority}">
            <div class="item-header">
              <div class="item-title">${getPriorityEmoji(reminder.priority)} ${reminder.title}</div>
              <span class="item-badge badge-reminder">Lembrete</span>
            </div>
            ${reminder.description ? `<div class="item-meta">${reminder.description}</div>` : ''}
            ${reminder.dueDate ? `<div class="item-meta">Data limite: ${formatDate(reminder.dueDate)}</div>` : ''}
            ${reminder.daysUntilDue !== undefined ? `<div class="item-days">${getDaysText(reminder.daysUntilDue)}</div>` : ''}
          </div>
        `).join('')
      }
    </div>

    <div class="footer">
      Sistema de Encomendas 3D • ${new Date().getFullYear()}
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Envia relatório por email via Supabase Edge Function
 */
export async function sendEmailReport(email: string, report: NotificationReport): Promise<void> {
  const html = generateReportHTML(report)

  const { error } = await supabase.functions.invoke('send-email', {
    body: {
      to: email,
      subject: `Relatório de Pendências - ${new Date().toLocaleDateString('pt-BR')}`,
      html
    }
  })

  if (error) throw new Error(`Erro ao enviar email: ${error.message}`)
}

/**
 * Envia relatório por WhatsApp via Evolution API ou Twilio
 */
export async function sendWhatsAppReport(phoneNumber: string, report: NotificationReport): Promise<void> {
  const { summary } = report

  // Mensagem resumida para WhatsApp
  let message = `📋 *Relatório de Pendências*\n\n`
  message += `📦 *Pedidos:* ${summary.totalOrders} ativos`
  if (summary.ordersUrgent > 0) {
    message += ` (${summary.ordersUrgent} urgentes 🔴)`
  }
  message += `\n`

  message += `📝 *Lembretes:* ${summary.totalReminders} ativos`
  if (summary.remindersUrgent > 0) {
    message += ` (${summary.remindersUrgent} urgentes 🔴)`
  }
  message += `\n\n`

  if (summary.ordersUrgent > 0) {
    message += `*🔴 Pedidos Urgentes:*\n`
    report.ordersPending
      .filter(o => o.priority === 'high')
      .slice(0, 5)
      .forEach(order => {
        message += `• ${order.title}`
        if (order.daysUntilDue !== undefined && order.daysUntilDue < 0) {
          message += ` (${Math.abs(order.daysUntilDue)} dias atrasado)`
        } else if (order.daysUntilDue === 0) {
          message += ` (vence hoje!)`
        }
        message += `\n`
      })
    message += `\n`
  }

  if (summary.remindersUrgent > 0) {
    message += `*🔴 Lembretes Urgentes:*\n`
    report.remindersActive
      .filter(r => r.priority === 'high')
      .slice(0, 5)
      .forEach(reminder => {
        message += `• ${reminder.title}\n`
      })
    message += `\n`
  }

  message += `_Gerado em ${new Date().toLocaleString('pt-BR')}_`

  // Chamar Supabase Edge Function para WhatsApp
  const { error } = await supabase.functions.invoke('send-whatsapp', {
    body: {
      to: phoneNumber,
      message
    }
  })

  if (error) throw new Error(`Erro ao enviar WhatsApp: ${error.message}`)
}

/**
 * Baixa relatório como HTML para conversão local em PDF
 */
export function downloadReportHTML(report: NotificationReport): void {
  const html = generateReportHTML(report)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio-pendencias-${new Date().toISOString().split('T')[0]}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Agenda notificação recorrente (diária, semanal, etc)
 */
export async function scheduleRecurringNotification(
  channel: NotificationChannel,
  frequency: 'daily' | 'weekly',
  time: string, // formato HH:MM
  destination: string // email ou telefone
): Promise<void> {
  // Salvar configuração no localStorage ou banco
  const config = {
    channel,
    frequency,
    time,
    destination,
    enabled: true,
    createdAt: new Date().toISOString()
  }

  localStorage.setItem('notification-schedule', JSON.stringify(config))

  // Registrar service worker para agendamento
  if ('serviceWorker' in navigator && channel === 'push') {
    await navigator.serviceWorker.ready
  }
}

/**
 * Verifica e envia notificações agendadas
 */
export async function checkAndSendScheduledNotifications(): Promise<void> {
  const configStr = localStorage.getItem('notification-schedule')
  if (!configStr) return

  const config = JSON.parse(configStr)
  if (!config.enabled) return

  const now = new Date()
  const [hours, minutes] = config.time.split(':').map(Number)

  const scheduledTime = new Date()
  scheduledTime.setHours(hours, minutes, 0, 0)

  // Verificar se é hora de enviar (com margem de 5 minutos)
  const diff = Math.abs(now.getTime() - scheduledTime.getTime())
  if (diff > 5 * 60 * 1000) return

  // Verificar frequência
  const lastSent = localStorage.getItem('notification-last-sent')
  if (lastSent) {
    const lastSentDate = new Date(lastSent)
    const daysSinceLastSent = Math.floor((now.getTime() - lastSentDate.getTime()) / (1000 * 60 * 60 * 24))

    if (config.frequency === 'daily' && daysSinceLastSent < 1) return
    if (config.frequency === 'weekly' && daysSinceLastSent < 7) return
  }

  // Gerar e enviar relatório
  const report = await collectPendingItems()

  try {
    if (config.channel === 'email') {
      await sendEmailReport(config.destination, report)
    } else if (config.channel === 'whatsapp') {
      await sendWhatsAppReport(config.destination, report)
    }

    localStorage.setItem('notification-last-sent', now.toISOString())
  } catch (error) {
    console.error('Erro ao enviar notificação agendada:', error)
  }
}
