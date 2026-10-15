import { supabase } from './supabase'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications não são suportadas neste navegador.')
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Permissão de notificação negada.')
  }

  const registration = await navigator.serviceWorker.ready
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY

  if (!vapidPublicKey || vapidPublicKey === 'placeholder-vapid-key') {
    throw new Error('Chave VAPID pública não configurada no .env')
  }

  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  })

  const json = subscription.toJSON()
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error('Falha ao obter dados da assinatura de push.')
  }

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth
    },
    { onConflict: 'endpoint' }
  )

  if (error) throw error
  return true
}
