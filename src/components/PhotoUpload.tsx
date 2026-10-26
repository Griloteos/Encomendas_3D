import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { uploadPhoto, deletePhoto, getSignedPhotoUrl } from '../lib/storage'

interface PhotoUploadProps {
  orderId: string
  photoPaths: string[]
  onChange: (newPaths: string[]) => void
}

export default function PhotoUpload({ orderId, photoPaths, onChange }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (photoPaths.length + files.length > 2) {
      setError('Máximo de 2 fotos por encomenda.')
      return
    }

    try {
      setUploading(true)
      setError('')
      const newPaths = [...photoPaths]

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Compress image (max 1200px, webp, ~0.8 quality)
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: 'image/webp'
        }

        const compressedFile = await imageCompression(file, options)
        const path = await uploadPhoto(compressedFile, orderId)
        newPaths.push(path)
      }

      onChange(newPaths)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar foto')
    } finally {
      setUploading(false)
      // reset input
      e.target.value = ''
    }
  }

  async function handleRemove(pathToRemove: string) {
    try {
      await deletePhoto(pathToRemove)
      const newPaths = photoPaths.filter((p) => p !== pathToRemove)
      onChange(newPaths)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir foto')
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--color-surface-200)]">
        Fotos do Projeto ({photoPaths.length}/2)
      </label>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-3">
        {photoPaths.map((path) => (
          <PhotoThumb key={path} path={path} onRemove={() => handleRemove(path)} />
        ))}

        {photoPaths.length < 2 && (
          <label className="w-24 h-24 border-2 border-dashed border-[var(--color-surface-500)] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-[var(--color-surface-700)] transition-colors">
            <span className="text-2xl text-[var(--color-surface-300)]">+</span>
            <span className="text-[10px] text-[var(--color-surface-300)] mt-1">
              {uploading ? 'Enviando...' : 'Adicionar'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  )
}

function PhotoThumb({ path, onRemove }: { path: string; onRemove: () => void }) {
  const [url, setUrl] = useState<string>('')

  useState(() => {
    getSignedPhotoUrl(path).then(setUrl).catch(console.error)
  })

  return (
    <div className="relative w-24 h-24 rounded-xl border border-[var(--color-surface-600)] overflow-hidden bg-[var(--color-surface-700)]">
      {url ? (
        <img src={url} alt="Projeto 3D" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-surface-400)]">Carregando...</div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
        title="Remover foto"
      >
        ×
      </button>
    </div>
  )
}