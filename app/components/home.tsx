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
    <div className="flex flex-col w-full h-full">
      <CsvFileUpload onFileSelect={handleFileSelect} />
      {file && (
        <CsvProcessor
          key={file.name + file.size}
          file={file}
          onParsed={onParsed}
        />
      )}
      {blocks.length > 0 && (
        <div className="w-full mt-4">
          <NumberBucketsTable blocks={blocks} />
        </div>
      )}
    </div>
  )
}
