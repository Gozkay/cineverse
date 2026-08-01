import { useState } from 'react'
import { FaUpload, FaCheck, FaTimes } from 'react-icons/fa'

function FileUpload({ bucket, userId, accept, label, onUploaded, value, isImage = false }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    setProgress(10)
    try {
      const { uploadSellerFile, getPublicImageUrl } = await import('@/services/seller')
      const path = await uploadSellerFile(bucket, userId, file, (p) => setProgress(p))
      onUploaded(isImage ? getPublicImageUrl(path) : path)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 px-4 py-6 text-center transition-colors hover:border-violet-500/50 hover:bg-slate-800">
        {uploading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <span className="text-xs text-gray-400">Uploading... {progress}%</span>
          </>
        ) : value ? (
          <>
            <FaCheck className="text-emerald-400" size={20} />
            <span className="text-xs text-gray-300">Uploaded — click to replace</span>
          </>
        ) : (
          <>
            <FaUpload className="text-violet-400" size={20} />
            <span className="text-xs text-gray-400">{label}</span>
          </>
        )}
        <input type="file" accept={accept} className="sr-only" onChange={handleFile} />
      </label>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
          <FaTimes size={10} /> {error}
        </p>
      )}
    </div>
  )
}

export default FileUpload
