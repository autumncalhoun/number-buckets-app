'use client'

import AreaCodesData from '@/src/components/area-codes'
import Posts from '@/src/components/posts'
import { Suspense } from 'react'

const Loading = '...loading'

// type Post = {
//   id: number
//   title: string
//   content: string
//   author: string
//   date: string // "2023-08-01"
//   category: string
// }

// const delay = () =>
//   new Promise<void>((resolve, _reject) => setTimeout(() => resolve(), 1000))

// const fetchPosts = async () => {
//   const data = await fetch('https://api.vercel.app/blog')

//   const json: Post[] = await data.json()
//   json.sort((a, b) => {
//     return a.date > b.date ? 1 : -1
//   })
//   console.log('json', json)
//   await delay()
//   return json
// }

// export default function Posts() {
//   const posts = fetchPosts()

//   return (
//     <div
//       className="flex w-full h-full min-h-screen items-center justify-center  font-sans dark:bg-black p-4 pb-16"
//       style={{
//         background: 'linear-gradient(130deg, #f96986 0%, #7b3ffb 100%)',
//       }}>
//       <main className="flex w-full h-full min-h-96 max-w-3xl flex-col items-center justify-center p-8 bg-white dark:bg-black rounded-2xl shadow">
//         <Suspense fallback={Loading}>
//           <Posts postsPromise={posts} />
//         </Suspense>
//       </main>
//     </div>
//   )
// }

type Data = {
  key: number[]
}

const api: {
  getAreaCodes: () => Promise<{ data: Data }>
} = {
  getAreaCodes: async () =>
    await fetch('/api/area-codes', {}).then((resp) => resp.json()),
}

const getAreaCodesPromise = api.getAreaCodes()

export default function AreaCodes() {
  return (
    <div
      className="flex w-full h-full min-h-screen items-center justify-center  font-sans dark:bg-black p-4 pb-16"
      style={{
        background: 'linear-gradient(130deg, #f96986 0%, #7b3ffb 100%)',
      }}>
      <main className="flex w-full h-full min-h-96 max-w-3xl flex-col items-center justify-center p-8 bg-white dark:bg-black rounded-2xl shadow">
        <AreaCodesData areaCodesPromise={getAreaCodesPromise} />
      </main>
    </div>
  )
}
