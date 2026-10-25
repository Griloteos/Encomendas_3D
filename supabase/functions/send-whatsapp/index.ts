import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL') || ''
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY') || ''
const EVOLUTION_INSTANCE = Deno.env.get('EVOLUTION_INSTANCE') || ''

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
    const { to, message } = await req.json()

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE) {
      throw new Error('Evolution API credentials are not fully configured in Supabase secrets')
    }

    const response = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY
        },
        body: JSON.stringify({
          number: to.replace(/\D/g, ''),
          text: message
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
