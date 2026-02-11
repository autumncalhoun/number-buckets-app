/**
 * Extracts a numeric value from a CSV row (handles header objects or array rows).
 * For phone numbers, strips non-digits so "555-123-4567" and "5551234567" both work.
 */
function getNumberFromRow(row: Record<string, string> | string[]): number {
  const raw = Array.isArray(row) ? row[0] : (Object.values(row)[0] ?? '')
  const digitsOnly = String(raw ?? '').replace(/\D/g, '')
  const n = parseInt(digitsOnly, 10)
  return Number.isNaN(n) ? NaN : n
}

export type SerialBlock = {
  start: number
  end: number
  count: number
}

/**
 * Takes parsed CSV data (assumed sorted numerically by the number column).
 * Deduplicates numbers, groups consecutive numbers into serial blocks,
 * and returns an array of blocks with start, end, and count.
 */
export function groupIntoSerialBlocks(
  data: Record<string, string>[] | string[][],
): SerialBlock[] {
  const numbers: number[] = []

  for (const row of data) {
    const n = getNumberFromRow(row)
    if (!Number.isNaN(n)) numbers.push(n)
  }

  const unique: number[] = []
  let prev: number | undefined
  for (const n of numbers) {
    if (prev !== undefined && n === prev) continue
    unique.push(n)
    prev = n
  }

  const blocks: SerialBlock[] = []
  if (unique.length === 0) return blocks

  let blockStart = unique[0]
  let blockEnd = unique[0]
  let blockCount = 1

  for (let i = 1; i < unique.length; i++) {
    const current = unique[i]
    if (current === blockEnd + 1) {
      blockEnd = current
      blockCount += 1
    } else {
      blocks.push({ start: blockStart, end: blockEnd, count: blockCount })
      blockStart = current
      blockEnd = current
      blockCount = 1
    }
  }

  blocks.push({ start: blockStart, end: blockEnd, count: blockCount })
  return blocks
}
