import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || ''
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID') || ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { message, chatId } = await req.json()
    const targetChat = chatId || TELEGRAM_CHAT_ID

    if (!TELEGRAM_BOT_TOKEN || !targetChat) {
      throw new Error('Telegram Bot Token or Chat ID is not configured')
    }

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: targetChat,
          text: message,
          parse_mode: 'Markdown'
        })
      }
    )

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
})
