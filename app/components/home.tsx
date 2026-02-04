'use client'

import {
  groupIntoSerialBlocks,
  type SerialBlock,
} from '@/app/lib/serial-blocks'
import { useCallback, useState } from 'react'
import { CsvFileUpload } from './csv-file-upload'
import { CsvProcessor, ParsedCsvResult } from './csv-processor'
import { NumberBucketsTable } from './number-buckets-table'

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [blocks, setBlocks] = useState<SerialBlock[]>([])

  const handleFileSelect = useCallback((f: File | null) => {
    setFile(f)
    setBlocks([])
  }, [])

  const onParsed = useCallback((result: ParsedCsvResult) => {
    setBlocks(groupIntoSerialBlocks(result.data))
  }, [])

  return (
    <div className="flex flex-col items-start gap-6">
      <CsvFileUpload onFileSelect={handleFileSelect} />
      {file && (
        <CsvProcessor
          key={file.name + file.size}
          file={file}
          onParsed={onParsed}
        />
      )}
      {blocks.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Number blocks
          </h2>
          <NumberBucketsTable blocks={blocks} />
        </div>
      )}
    </div>
  )
}
