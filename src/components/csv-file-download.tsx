import Button from '@/src/components/button'
import { useMemo } from 'react'

export default function CsvFileDownload({
  data: parsedData,
  filename,
}: {
  data: string
  filename: string
}) {
  const csvUrl = useMemo(() => {
    return URL.createObjectURL(new Blob([parsedData], { type: 'text/csv' }))
  }, [parsedData])

  const modFileName = useMemo(() => {
    const fileNameWitoutExt = filename.split('.csv')[0]
    return `${fileNameWitoutExt}-number-buckets.csv`
  }, [filename])

  return (
    <a href={csvUrl} download={modFileName} target="_blank">
      <Button onClick={() => {}}>Download CSV</Button>
    </a>
  )
}
