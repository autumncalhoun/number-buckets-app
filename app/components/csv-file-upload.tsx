'use client'

import { useCallback, useState } from 'react'

import CheckmarkSVG from '@/app/svgs/checkmark'
import UploadSVG from '@/app/svgs/upload'

type CsvFileUploadProps = {
  onFileSelect?: (file: File | null) => void
  accept?: string
  maxSizeBytes?: number
}

export function CsvFileUpload({
  onFileSelect,
  accept = '.csv,text/csv',
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
}: CsvFileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const validateAndSetFile = useCallback(
    (selectedFile: File | null) => {
      setError(null)
      if (!selectedFile) {
        setFile(null)
        return
      }
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a CSV file.')
        setFile(null)
        return
      }
      if (selectedFile.size > maxSizeBytes) {
        setError(
          `File is too large. Maximum size is ${maxSizeBytes / 1024 / 1024}MB.`,
        )
        setFile(null)
        return
      }
      setFile(selectedFile)
      onFileSelect?.(selectedFile)
    },
    [maxSizeBytes, onFileSelect],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] ?? null
      validateAndSetFile(selectedFile)
      e.target.value = ''
    },
    [validateAndSetFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files?.[0] ?? null
      validateAndSetFile(droppedFile)
    },
    [validateAndSetFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const clearFile = useCallback(() => {
    setFile(null)
    setError(null)
    onFileSelect?.(null)
  }, [onFileSelect])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            ;(
              e.currentTarget.querySelector(
                'input[type="file"]',
              ) as HTMLInputElement
            )?.click()
          }
        }}
        className={`
          relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 px-6 py-2 text-center transition-colors
          ${isDragging ? 'border-violet-500 shadow bg-violet-50dark:bg-zinc-800' : 'border-violet-500 dark:border-zinc-600 dark:bg-zinc-900/50'}
          hover:border-violet-700 hover:bg-violet-50   w-full
        `}>
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Upload CSV file"
        />

        {!file && <UploadSVG />}
        <div className="mb-1 font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
          {file ? file.name : 'Select a CSV file'}
        </div>

        {!file && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            (max {maxSizeBytes / 1024 / 1024}mb)
          </p>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {file && (
        <button
          type="button"
          onClick={clearFile}
          className=" text-sm font-medium text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          Start over
        </button>
      )}
    </div>
  )
}
