import { useEffect, useState } from 'react'

export default function useDebounce(value: string, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState<string>()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  })

  return debouncedValue
}
