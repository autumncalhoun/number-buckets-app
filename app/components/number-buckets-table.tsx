'use client'

import type { SerialBlock } from '@/app/lib/serial-blocks'

type NumberBucketsTableProps = {
  blocks: SerialBlock[]
}

export function NumberBucketsTable({ blocks }: NumberBucketsTableProps) {
  if (blocks.length === 0) return null

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="w-full min-w-[280px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
            <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
              Start
            </th>
            <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
              End
            </th>
            <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block, index) => (
            <tr
              key={`${block.start}-${block.end}-${index}`}
              className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
              <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                {block.start}
              </td>
              <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                {block.end}
              </td>
              <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                {block.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
