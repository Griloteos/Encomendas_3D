 async function _asyncOptionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = await fn(value); } else if (op === 'call' || op === 'optionalCall') { value = await fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// API Utilities for Supabase operations

import { supabase, } from './supabase'

// Orders CRUD
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('delivery_date', { ascending: true })

  if (error) throw error
  return data 
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data 
}

export async function createOrder(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()

  if (error) throw error
  return data 
}

export async function updateOrder(id, updates) {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data 
}

export async function deleteOrder(id) {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Reminders CRUD
export async function getReminders() {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('due_date', { ascending: true, nullsFirst: false })

  if (error) throw error
  return data 
}

export async function getReminderById(id) {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data 
}

export async function createReminder(reminder) {
  const { data, error } = await supabase
    .from('reminders')
    .insert(reminder)
    .select()
    .single()

  if (error) throw error
  return data 
}

export async function updateReminder(id, updates) {
  const { data, error } = await supabase
    .from('reminders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data 
}

export async function deleteReminder(id) {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Storage operations
export async function uploadPhoto(file, orderId) {
  const fileName = `${crypto.randomUUID()}.webp`
  const filePath = `${await _asyncOptionalChain([(await supabase.auth.getUser()), 'access', async _ => _.data, 'access', async _2 => _2.user, 'optionalAccess', async _3 => _3.id])}/${orderId}/${fileName}`

  const { data, error } = await supabase.storage
    .from('order-photos')
    .upload(filePath, file, {
      contentType: 'image/webp',
      upsert: false
    })

  if (error) throw error
  return data.path
}

export async function deletePhoto(path) {
  const { error } = await supabase.storage
    .from('order-photos')
    .remove([path])

  if (error) throw error
}

export async function getPhotoUrl(path) {
  const { data } = supabase.storage
    .from('order-photos')
    .getPublicUrl(path, {
      transform: {
        width: 300,
        height: 300,
        resize: 'cover'
      }
    })

  return data.publicUrl
}

export async function upload3mf(file, orderId, userId) {
  // Sanitize file name
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const fileName = `${Date.now()}-${sanitizedName}`
  const filePath = `${userId}/${orderId}/${fileName}`

  const { data, error } = await supabase.storage
    .from('order-models')
    .upload(filePath, file, {
      contentType: 'application/zip',
      upsert: false
    })

  if (error) throw error
  return { path: data.path, name: file.name, size: file.size }
}

export async function delete3mf(path) {
  const { error } = await supabase.storage
    .from('order-models')
    .remove([path])

  if (error) throw error
}

// Get signed URL for 3MF (short-lived for opening in slicer)
export async function getSigned3mfUrl(path, expiresIn = 600) {
  const { data, error } = await supabase.storage
    .from('order-models')
    .createSignedUrl(path, expiresIn)

  if (error) throw error
  return data.signedUrl
}

// Get signed URL for photos (1 hour default)
export async function getSignedPhotoUrl(path, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from('order-photos')
    .createSignedUrl(path, expiresIn)

  if (error) throw error
  return data.signedUrl
}