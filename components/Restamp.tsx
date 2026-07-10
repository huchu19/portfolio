'use client'

import { useState } from 'react'

/** Click the envelope and the office stamps it again. */
export default function Restamp({ children }: { children: React.ReactNode }) {
  const [n, setN] = useState(0)
  return (
    <div
      key={n}
      onClick={() => setN((v) => v + 1)}
      title="Stamp it again"
      className="cursor-pointer"
    >
      {children}
    </div>
  )
}
