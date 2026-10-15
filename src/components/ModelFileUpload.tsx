import { useState } from 'react'
import { upload3mf, delete3mf, getSigned3mfUrl } from '../lib/storage'
import { formatFileSize } from '../utils/format'
import { useAuth } from '../lib/auth'

interface ModelFileUploadProps {
  orderId: string
  modelPath?: string | null
  modelName?: string | null
  modelSize?: number | null
  onChange: (path: string | null, name: string | null, size: number | null) => void
}

export default function ModelFileUpload({
  orderId,
  modelPath,
  modelName,
  modelSize,
  onChange
}: ModelFileUploadProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  // Slicer preference stored in localStorage
  const [slicer, setSlicer] = useState<'bambustudio' | 'orcaslicer' | 'prusaslicer'>(
    (localStorage.getItem('preferred_slicer') as any) || 'orcaslicer'
  )

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0 || !user) return
    const file = files[0]

    // Validate extension
    if (!file.name.toLowerCase().endsWith('.3mf')) {
      setError('O arquivo deve ter a extensão .3mf')
      return
    }

    try {
      setUploading(true)
      setProgress(50)
      setError('')

      const result = await upload3mf(file, orderId, user.id)
      setProgress(100)
      onChange(result.path, result.name, result.size)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar arquivo 3MF')
    } finally {
      setUploading(false)
      setProgress(0)
      e.target.value = ''
    }
  }

  async function handleRemove() {
    if (!modelPath) return
    if (!confirm('Deseja remover o arquivo 3MF?')) return

    try {
      await delete3mf(modelPath)
      onChange(null, null, null)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir 3MF')
    }
  }

  async function handleOpenInSlicer() {
    if (!modelPath) return
    try {
      const url = await getSigned3mfUrl(modelPath, 600) // 10 min
      const encodedUrl = encodeURIComponent(url)

      let protocolUrl = ''
      if (slicer === 'bambustudio') {
        protocolUrl = `bambustudio://open?file=${encodedUrl}`
      } else if (slicer === 'orcaslicer') {
        protocolUrl = `orcaslicer://open?file=${encodedUrl}`
      } else if (slicer === 'prusaslicer') {
        protocolUrl = `prusaslicer://open?file=${encodedUrl}`
      }

      // Try opening protocol
      window.location.href = protocolUrl

      // Also provide download fallback option
      setTimeout(() => {
        handleDownload()
      }, 1500)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao abrir no fatiador')
    }
  }

  async function handleDownload() {
    if (!modelPath) return
    try {
      const url = await getSigned3mfUrl(modelPath, 600)
      const a = document.createElement('a')
      a.href = url
      a.download = modelName || 'modelo.3mf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao baixar arquivo')
    }
  }

  function handleSlicerChange(newSlicer: any) {
    setSlicer(newSlicer)
    localStorage.setItem('preferred_slicer', newSlicer)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Arquivo 3MF do Projeto</label>
        {modelPath && (
          <select
            value={slicer}
            onChange={(e) => handleSlicerChange(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value="orcaslicer">OrcaSlicer</option>
            <option value="bambustudio">Bambu Studio</option>
            <option value="prusaslicer">PrusaSlicer</option>
          </select>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {modelPath ? (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{modelName}</p>
              {modelSize && <p className="text-xs text-gray-500">{formatFileSize(modelSize)}</p>}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1"
            >
              Remover
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={handleOpenInSlicer}
              className="flex-1 btn-primary text-xs py-2"
            >
              Abrir no fatiador
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 btn-secondary text-xs py-2"
            >
              Baixar .3mf
            </button>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <span className="text-sm font-medium text-gray-700">
            {uploading ? `Enviando... ${progress}%` : 'Enviar arquivo .3mf'}
          </span>
          <span className="text-xs text-gray-500 mt-1">Selecione o arquivo do modelo 3D</span>
          <input
            type="file"
            accept=".3mf,application/vnd.ms-package.3dmanufacturing-3dmodel+xml"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}