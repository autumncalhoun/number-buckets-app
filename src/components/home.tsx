'use client'

import {
  groupIntoSerialBlocks,
  type SerialBlock,
} from '@/src/lib/serial-blocks'
import { useCallback, useMemo, useState } from 'react'
import { CsvFileUpload } from './csv-file-upload'
import { CsvProcessor, ParsedCsvResult } from './csv-processor'
import { NumberBucketsTable } from './number-buckets-table'
import CsvFileDownload from '@/src/components/csv-file-download'
import Papa from 'papaparse'
import Search from '@/src/components/search'
import useDebounce from '@/src/hooks/use-debounce'

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

  const blocksCsv = useMemo(() => {
    return Papa.unparse(blocks)
  }, [blocks])

  const [search, setSearch] = useState('')

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    [setSearch],
  )

  const debouncedSearch = useDebounce(search)

  const filteredBlocks = useMemo(() => {
    if (!debouncedSearch) return blocks

    return blocks.filter((block) => {
      return (
        block.start.toString().includes(debouncedSearch) ||
        block.end.toString().includes(debouncedSearch)
      )
    })
  }, [blocks, debouncedSearch])

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
          <div className="flex flex-row gap-2 mb-4 justify-between items-center">
            <CsvFileDownload
              data={blocksCsv}
              filename={file?.name ?? 'input-csv'}
            />
            {filteredBlocks.length !== blocks.length && (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {filteredBlocks.length}{' '}
                {filteredBlocks.length === 1 ? 'match' : 'matches'} found
              </div>
            )}
            {filteredBlocks.length === blocks.length && (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {blocks.length} blocks found
              </div>
            )}
            <Search value={search} onChange={handleSearchChange} />
          </div>
          <NumberBucketsTable blocks={filteredBlocks} />
        </div>
      )}
    </div>
  )
}
