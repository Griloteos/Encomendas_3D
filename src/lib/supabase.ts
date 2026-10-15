import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type OrderStatus = 'pendente' | 'imprimindo' | 'pronto' | 'entregue'

export interface Color {
  hex: string
  name?: string
  grams?: number
}

export interface Order {
  id: string
  user_id: string
  title: string
  cost_price: number
  sale_price: number
  filament_grams_total?: number | null
  colors: Color[]
  delivery_date: string
  status: OrderStatus
  customer_name?: string | null
  customer_whatsapp?: string | null
  photo_paths: string[]
  model_3mf_path?: string | null
  model_3mf_name?: string | null
  model_3mf_size?: number | null
  delivered_at?: string | null
  created_at: string
  updated_at: string
}