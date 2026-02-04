'use client'

import Papa, { type ParseResult } from 'papaparse'
import { useEffect, useState } from 'react'
import CheckmarkSVG from '@/app/svgs/checkmark'

// Returns true if the cell contains at least one letter (assume header).
function firstCellLooksLikeHeader(firstCell: unknown): boolean {
  const value = String(firstCell ?? '').trim()
  if (!value) return false
  return /[a-zA-Z]/.test(value)
}

// Preview first row to detect header
async function getPreviewResult(
  fileToParse: File,
): Promise<ParseResult<string[]>> {
  return await new Promise<ParseResult<string[]>>((resolve, reject) => {
    Papa.parse(fileToParse, {
      header: false,
      preview: 2,
      complete: (results: ParseResult<string[]>) => {
        if (results.errors.length > 0 && !results.data?.length) {
          reject(new Error(results.errors[0]?.message ?? 'Parse error'))
        } else {
          resolve(results)
        }
      },
    })
  })
}

export type ParsedCsvResult = {
  data: Record<string, string>[] | string[][]
  hasHeader: boolean
  rowCount: number
}

type CsvProcessorProps = {
  file: File | null
  onParsed?: (result: ParsedCsvResult) => void
  onError?: (message: string) => void
}

type Status = 'idle' | 'detecting' | 'parsing' | 'success' | 'error'

export function CsvProcessor({ file, onParsed, onError }: CsvProcessorProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ParsedCsvResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return

    let cancelled = false
    const fileToParse = file

    async function run() {
      setStatus('detecting')
      setProgress(5)
      setErrorMessage(null)

      try {
        const previewResult = await getPreviewResult(fileToParse)

        if (cancelled) return

        const firstRow = previewResult.data?.[0]
        const firstCell = firstRow?.[0]
        const hasHeader = firstCellLooksLikeHeader(firstCell)

        setStatus('parsing')
        setProgress(10)

        const rows: (Record<string, string> | string[])[] = []
        const fileSize = fileToParse.size

        await new Promise<void>((resolve, reject) => {
          Papa.parse(fileToParse as unknown as any, {
            header: hasHeader,
            skipEmptyLines: true,
            step: (
              stepResult: ParseResult<Record<string, string> | string[]>,
            ) => {
              if (cancelled) return
              // PapaParse step callback passes the single row as result.data )
              if (stepResult.data != null) {
                rows.push(
                  stepResult.data as unknown as
                    | Record<string, string>
                    | string[],
                )
              }
              const cursor = stepResult.meta?.cursor
              if (typeof cursor === 'number' && fileSize > 0) {
                setProgress(Math.min(99, 10 + (cursor / fileSize) * 85))
              }
            },
            complete: (
              completeResult: ParseResult<Record<string, string> | string[]>,
            ) => {
              if (completeResult.errors.length > 0 && rows.length === 0) {
                reject(
                  new Error(completeResult.errors[0]?.message ?? 'Parse error'),
                )
              } else {
                setProgress(100)
                const parsedResult: ParsedCsvResult = {
                  data: rows as Record<string, string>[] | string[][],
                  hasHeader,
                  rowCount: rows.length,
                }
                setResult(parsedResult)
                setStatus('success')
                onParsed?.(parsedResult)
                resolve()
              }
            },
          })
        })
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof Error ? err.message : 'Failed to parse CSV'
        setErrorMessage(message)
        setStatus('error')
        onError?.(message)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [file, onParsed, onError])

  if (!file) return null

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Progress bar */}
      {(status === 'detecting' || status === 'parsing') && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {status === 'detecting'
              ? 'Checking for headers…'
              : 'Processing file…'}
          </p>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Parsing progress">
            <div
              className="h-full rounded-full bg-zinc-600 transition-[width] duration-150 ease-out dark:bg-zinc-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success */}
      {status === 'success' && result && (
        <div
          className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/50"
          role="status"
          aria-live="polite">
          <CheckmarkSVG />
          <div>
            <p className="font-medium text-emerald-800 dark:text-emerald-200">
              File processed successfully
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} parsed
              {result.hasHeader ? ' (header row detected)' : ''}.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
