import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react'
import { useProfileStore } from '@/hooks/useProfile'

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function AvatarUpload() {
  const { profile, uploadAvatar } = useProfileStore()
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatar_url || null)
  const [status, setStatus] = useState<'idle' | 'processing' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [progress, setProgress] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile?.avatar_url && status === 'idle') {
      setPreviewUrl(profile.avatar_url)
    }
  }, [profile?.avatar_url, status])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      showError('Invalid file type. Please upload a JPG, PNG, or WebP.')
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    setStatus('processing')
    setErrorMessage('')

    try {
      const croppedAndCompressedFile = await squareCropAndCompress(file)
      
      const objectUrl = URL.createObjectURL(croppedAndCompressedFile)
      setPreviewUrl(objectUrl)
      
      await performUpload(croppedAndCompressedFile)
    } catch (err) {
      console.error('Error processing image:', err)
      showError('Failed to process image. Please try another.')
    }
  }

  const squareCropAndCompress = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        
        const canvas = document.createElement('canvas')
        const size = Math.min(img.width, img.height)
        
        const startX = (img.width - size) / 2
        const startY = (img.height - size) / 2
        
        const outputSize = Math.min(size, 512)
        
        canvas.width = outputSize
        canvas.height = outputSize
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        
        ctx.drawImage(
          img,
          startX, startY, size, size,
          0, 0, outputSize, outputSize
        )
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob failed'))
            return
          }
          const ext = file.name.split('.').pop()?.toLowerCase() || 'webp'
          const newFileName = `avatar_processed.${ext}`
          
          const newFile = new File([blob], newFileName, {
            type: blob.type,
            lastModified: Date.now()
          })
          
          resolve(newFile)
        }, file.type, 0.9)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Failed to load image'))
      }
      
      img.src = objectUrl
    })
  }

  const performUpload = async (file: File) => {
    setStatus('uploading')
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 15, 90))
    }, 200)

    const { error, url } = await uploadAvatar(file)
    
    clearInterval(progressInterval)

    if (error) {
      showError(error.message || 'Failed to upload avatar')
    } else if (url) {
      setProgress(100)
      setStatus('success')
      setPreviewUrl(url)
      
      setTimeout(() => {
        setStatus('idle')
        setProgress(0)
      }, 3000)
    }
  }

  const showError = (msg: string) => {
    setStatus('error')
    setErrorMessage(msg)
    setTimeout(() => {
      setStatus('idle')
      setErrorMessage('')
    }, 5000)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start p-4 bg-background/30 rounded-2xl border border-border/40 relative overflow-hidden">
      <AnimatePresence>
        {status === 'uploading' && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: `${progress}%`, opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 bottom-0 bg-indigo-500 z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 shrink-0">
        <motion.div
          whileHover={{ scale: status === 'idle' ? 1.05 : 1 }}
          whileTap={{ scale: status === 'idle' ? 0.95 : 1 }}
          className={`relative w-28 h-28 rounded-full overflow-hidden border-4 flex items-center justify-center transition-colors cursor-pointer shadow-lg
            ${isDragging ? 'border-indigo-500 bg-indigo-500/20' : 'border-background bg-accent'}
            ${status === 'error' ? 'border-rose-500/50' : ''}
            ${status === 'success' ? 'border-emerald-500' : ''}
          `}
          onClick={() => status === 'idle' && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
              onError={() => setPreviewUrl(null)} 
            />
          ) : (
            <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
          )}

          {status === 'idle' && (
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
              <UploadCloud className="w-8 h-8 text-white" />
            </div>
          )}

          <AnimatePresence>
            {(status === 'processing' || status === 'uploading') && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mb-1" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {status === 'processing' ? 'Processing' : `${progress}%`}
                </span>
              </motion.div>
            )}
            
            {status === 'success' && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center backdrop-blur-sm"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileSelect}
        />
      </div>

      <div className="flex-1 space-y-2 text-center sm:text-left z-10 w-full">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Profile Picture</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Drag and drop or click to upload a new avatar.
          </p>
        </div>
        
        <div className="text-[11px] text-muted-foreground/80 flex items-center justify-center sm:justify-start gap-3">
          <span>Max size: 5MB</span>
          <span>•</span>
          <span>JPG, PNG, WebP</span>
        </div>

        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="flex items-center gap-2 text-rose-400 text-xs font-medium p-2.5 bg-rose-500/10 rounded-lg border border-rose-500/20 w-full"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
