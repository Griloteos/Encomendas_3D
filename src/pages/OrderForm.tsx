import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { createOrder, getOrderById, updateOrder } from '../lib/storage'
import { type Color, type OrderStatus } from '../lib/supabase'
import ColorPicker from '../components/ColorPicker'
import GramsFields from '../components/GramsFields'
import PhotoUpload from '../components/PhotoUpload'
import ModelFileUpload from '../components/ModelFileUpload'
import { normalizeWhatsapp, parseGrams } from '../utils/format'

export default function OrderForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [error, setError] = useState('')

  // Form fields
  const [title, setTitle] = useState('')
  const [costPrice, setCostPrice] = useState('0,00')
  const [salePrice, setSalePrice] = useState('0,00')
  const [filamentGramsTotal, setFilamentGramsTotal] = useState('')
  const [colors, setColors] = useState<Color[]>([])
  const [photoPaths, setPhotoPaths] = useState<string[]>([])
  const [model3mfPath, setModel3mfPath] = useState<string | null>(null)
  const [model3mfName, setModel3mfName] = useState<string | null>(null)
  const [model3mfSize, setModel3mfSize] = useState<number | null>(null)

  // Default delivery date: today + 7 days
  const defaultDelivery = new Date()
  defaultDelivery.setDate(defaultDelivery.getDate() + 7)
  const [deliveryDate, setDeliveryDate] = useState(defaultDelivery.toISOString().split('T')[0])

  const [status, setStatus] = useState<OrderStatus>('pendente')
  const [customerName, setCustomerName] = useState('')
  const [customerWhatsapp, setCustomerWhatsapp] = useState('')

  useEffect(() => {
    if (isEditing && id) {
      loadOrder(id)
    }
  }, [id, isEditing])

  async function loadOrder(orderId: string) {
    try {
      setFetching(true)
      const order = await getOrderById(orderId)
      setTitle(order.title)
      setCostPrice(order.cost_price.toFixed(2).replace('.', ','))
      setSalePrice(order.sale_price.toFixed(2).replace('.', ','))
      setFilamentGramsTotal(order.filament_grams_total !== null && order.filament_grams_total !== undefined ? String(order.filament_grams_total) : '')
      setColors(order.colors || [])
      setPhotoPaths(order.photo_paths || [])
      setModel3mfPath(order.model_3mf_path || null)
      setModel3mfName(order.model_3mf_name || null)
      setModel3mfSize(order.model_3mf_size || null)
      setDeliveryDate(order.delivery_date)
      setStatus(order.status)
      setCustomerName(order.customer_name || '')
      setCustomerWhatsapp(order.customer_whatsapp ? formatWhatsappInput(order.customer_whatsapp) : '')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar encomenda')
    } finally {
      setFetching(false)
    }
  }

  function formatWhatsappInput(input: string): string {
    const digits = normalizeWhatsapp(input)
    if (!digits) return ''
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('O título é obrigatório.')
      return
    }

    const costNum = parseFloat(costPrice.replace(/\./g, '').replace(',', '.')) || 0
    const saleNum = parseFloat(salePrice.replace(/\./g, '').replace(',', '.')) || 0

    if (costNum < 0 || saleNum < 0) {
      setError('Os valores não podem ser negativos.')
      return
    }

    try {
      setLoading(true)

      const orderData = {
        title: title.trim(),
        cost_price: costNum,
        sale_price: saleNum,
        filament_grams_total: parseGrams(filamentGramsTotal),
        colors,
        photo_paths: photoPaths,
        model_3mf_path: model3mfPath,
        model_3mf_name: model3mfName,
        model_3mf_size: model3mfSize,
        delivery_date: deliveryDate,
        status,
        customer_name: customerName.trim() || null,
        customer_whatsapp: customerWhatsapp ? normalizeWhatsapp(customerWhatsapp) : null
      }

      if (isEditing && id) {
        await updateOrder(id, orderData)
        navigate(`/pedidos/${id}`)
      } else {
        const newOrder = await createOrder(orderData)
        navigate(`/pedidos/${newOrder.id}`)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar encomenda')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-lg font-bold text-gray-800 m-0">
            {isEditing ? 'Editar Encomenda' : 'Nova Encomenda'}
          </h1>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título da Encomenda * (máx. 120 caracteres)
            </label>
            <input
              id="title"
              type="text"
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Suporte para Headset RGB"
              className="input-field"
              required
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 mb-1">
                Valor de Custo (R$) *
              </label>
              <input
                id="cost_price"
                type="text"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0,00"
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-1">
                Valor de Venda (R$) *
              </label>
              <input
                id="sale_price"
                type="text"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="0,00"
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Colors */}
          <ColorPicker selectedColors={colors} onChange={setColors} />

          {/* Grams */}
          <GramsFields
            totalGrams={filamentGramsTotal}
            onTotalChange={setFilamentGramsTotal}
            colors={colors}
          />

          {/* Photos & 3MF (if editing or temporary order id for new) */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <PhotoUpload
              orderId={id || 'temp'}
              photoPaths={photoPaths}
              onChange={setPhotoPaths}
            />

            <ModelFileUpload
              orderId={id || 'temp'}
              modelPath={model3mfPath}
              modelName={model3mfName}
              modelSize={model3mfSize}
              onChange={(path, name, size) => {
                setModel3mfPath(path)
                setModel3mfName(name)
                setModel3mfSize(size)
              }}
            />
          </div>

          {/* Delivery Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="delivery_date" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Entrega *
              </label>
              <input
                id="delivery_date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="input-field bg-white"
              >
                <option value="pendente">Pendente</option>
                <option value="imprimindo">Imprimindo</option>
                <option value="pronto">Pronto</option>
                <option value="entregue">Entregue</option>
              </select>
            </div>
          </div>

          {/* Customer info */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 text-sm">Dados do Cliente (Opcional)</h3>
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Cliente
              </label>
              <input
                id="customer_name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: João Silva"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="customer_whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                id="customer_whatsapp"
                type="text"
                value={customerWhatsapp}
                onChange={(e) => setCustomerWhatsapp(formatWhatsappInput(e.target.value))}
                placeholder="(63) 99123-4567"
                className="input-field"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Salvando...' : 'Salvar Encomenda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}