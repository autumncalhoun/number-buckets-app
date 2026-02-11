'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'

type Data = {
  key: number[]
}

const api: {
  getAreaCodes: () => Promise<{ data: Data }>
} = {
  getAreaCodes: async () =>
    await fetch('/api/area-codes', {}).then((resp) => resp.json()),
}

const someFunc = () => {
  const letters = ['a', 'b', 'c', 'd']

  for (let i = 0; i < letters.length; i++) {
    const element = letters[i]
    console.log(element)
  }
}

// fetches the area codes data, client side
// Click a button, start a timer, click the button start the timer over
// Click a button, debounce button clicks for 3 seconds
export default function AreaCodesData({ areaCodesPromise }: any) {
  // const [data, setData] = useState<Data | null>(null)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const apiResp = await api.getAreaCodes()
  //     setData(apiResp.data)
  //     return apiResp
  //   }

  //   fetchData()
  // }, [])
  const timerRef = useRef<null | any>(null)
  const [seconds, setSeconds] = useState(0)

  const [debouncing, setDebouncing] = useState(false)

  const { data } = use(areaCodesPromise)

  const handleButton = useCallback(() => {
    clearInterval(timerRef.current)
    setSeconds(0)
    timerRef.current = setInterval(() => {
      setSeconds((seconds) => seconds + 1)
    }, 1000)
  }, [])

  const debouncedHandleButton = useCallback(() => {
    if (debouncing) return null

    console.log('BUTTON CLICKED')
    setDebouncing(true)
    setTimeout(() => {
      setDebouncing(false)
    }, 3000)
  }, [debouncing])

  if (!data) return null
  return (
    <div>
      <div className="flex gap-4">
        <button onClick={handleButton}>Press me</button>
        <span>Timer: {seconds}</span>
      </div>
      <div className="flex gap-4">
        <button onClick={debouncedHandleButton}>Debounced press effect</button>
        <span>Timer: {seconds}</span>
      </div>
      {Object.entries(data).map(([state, codes]) => (
        <div key={state} className="w-full">
          <div>{state}</div>
          <ul className="list-disc ml-8">
            {codes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
