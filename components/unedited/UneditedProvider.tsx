'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const KEY = 'fn-unedited'

type Value = { unedited: boolean; toggle: () => void; ready: boolean }

const UneditedContext = createContext<Value>({
  unedited: false,
  toggle: () => {},
  ready: false,
})

export function useUnedited() {
  return useContext(UneditedContext)
}

/**
 * Site-wide switch between the published prose and the draft underneath.
 * Starts false so the server and the first client render agree, then
 * adopts the stored preference in an effect — `ready` lets consumers
 * avoid flashing the wrong body before that happens.
 */
export default function UneditedProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [unedited, setUnedited] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      setUnedited(window.localStorage.getItem(KEY) === 'true')
    } catch {
      /* private mode — the switch just doesn't persist */
    }
    setReady(true)
  }, [])

  const toggle = useCallback(() => {
    setUnedited((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(KEY, String(next))
      } catch {
        /* as above */
      }
      return next
    })
  }, [])

  return (
    <UneditedContext.Provider value={{ unedited, toggle, ready }}>
      {children}
    </UneditedContext.Provider>
  )
}
