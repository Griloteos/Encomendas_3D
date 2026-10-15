// Supabase Edge Function: daily-alerts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.6'

serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    const cronSecret = Deno.env.get('CRON_SECRET')

    // Verify secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!
    const vapidEmail = Deno.env.get('VAPID_EMAIL') || 'mailto:admin@encomendas3d.app'

    webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Fetch active push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')

    if (subError) throw subError
    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscriptions found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Group by user_id
    const userIds = [...new Set(subscriptions.map((s) => s.user_id))]

    for (const userId of userIds) {
      // Get pending orders for user
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .neq('status', 'entregue')

      if (orderError || !orders || orders.length === 0) continue

      const today = new Date().toISOString().split('T')[0]
      let overdue = 0
      let todayDeliveries = 0
      let tomorrowDeliveries = 0

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      for (const order of orders) {
        if (order.delivery_date < today) overdue++
        else if (order.delivery_date === today) todayDeliveries++
        else if (order.delivery_date === tomorrowStr) tomorrowDeliveries++
      }

      if (overdue === 0 && todayDeliveries === 0 && tomorrowDeliveries === 0) continue

      const bodyParts = []
      if (overdue > 0) bodyParts.push(`${overdue} atrasada(s)`)
      if (todayDeliveries > 0) bodyParts.push(`${todayDeliveries} hoje`)
      if (tomorrowDeliveries > 0) bodyParts.push(`${tomorrowDeliveries} amanhã`)

      const payload = JSON.stringify({
        title: `📦 ${orders.length} entrega(s) pendente(s)`,
        body: bodyParts.join(', '),
        url: '/'
      })

      const userSubs = subscriptions.filter((s) => s.user_id === userId)
      for (const sub of userSubs) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth }
            },
            payload
          )
        } catch (err: any) {
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Remove expired subscription
            await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})