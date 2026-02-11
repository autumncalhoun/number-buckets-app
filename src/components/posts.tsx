'use client'

import { use } from 'react'

export default function Posts({ postsPromise }) {
  const posts = use(postsPromise)
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          {post.title} ({post.date})
        </li>
      ))}
    </ul>
  )
}
