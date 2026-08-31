'use client'

import { useEffect, useRef, useState } from 'react'

const MONITOR_VIEWS = [
  { label: 'Projects', lines: ['JobHunter', 'EduNexus', 'Bamboo', 'TiflToys'] },
  { label: 'Stack', lines: ['Next.js + TypeScript', 'PostgreSQL + Firebase', 'FastAPI + Shopify'] },
  { label: 'Project notes', lines: ['Features', 'Architecture', 'Current status'] },
  { label: 'GitHub', lines: ['github.com/huchu19', 'Source and setup', 'linked per project'] },
] as const

export default function StudioIllustration() {
  const [monitor, setMonitor] = useState(0)
  const [switching, setSwitching] = useState(false)
  const timers = useRef<number[]>([])
  const active = MONITOR_VIEWS[monitor]

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const changeMonitor = () => {
    if (switching) return
    setSwitching(true)
    timers.current.push(window.setTimeout(() => setMonitor((value) => (value + 1) % MONITOR_VIEWS.length), 120))
    timers.current.push(window.setTimeout(() => setSwitching(false), 430))
  }

  return (
    <div className="studio-illustration">
      <div className="illustration-sunwash" aria-hidden />
      <div className="illustration-window" aria-hidden>
        <div className="illustration-sky"><i /><i /></div>
        <div className="illustration-garden">
          <i /><i /><i /><i /><i />
        </div>
        <div className="illustration-path" />
      </div>

      <div className="illustration-wall-print illustration-wall-print--one" aria-hidden><i /><i /><i /></div>
      <div className="illustration-wall-print illustration-wall-print--two" aria-hidden />
      <div className="illustration-shelf" aria-hidden><i /><i /><i /><span /></div>

      <div className="illustration-rug" aria-hidden />
      <div className="illustration-desk">
        <button
          type="button"
          className="illustration-monitor"
          data-tactile
          data-switching={switching ? 'true' : 'false'}
          aria-label={`Studio monitor showing ${active.label}. Click for next screen.`}
          onClick={changeMonitor}
        >
          <small>{active.label}</small>
          {active.lines.map((line) => <span key={line}>{line}</span>)}
          <i aria-hidden>{monitor + 1}/{MONITOR_VIEWS.length}</i>
        </button>
        <button
          type="button"
          className="illustration-lamp"
          data-tactile
          data-feedback="off"
          aria-label="Pull the desk lamp cord to change the time of day"
          onClick={() => window.dispatchEvent(new CustomEvent('studio:toggle-theme'))}
        >
          <span className="illustration-lamp-cord" aria-hidden />
        </button>
        <div className="illustration-plant" aria-hidden><i /><i /><i /><i /></div>
        <div className="illustration-books" aria-hidden><i /><i /><i /></div>
        <div className="illustration-notebook" aria-hidden />
        <div className="illustration-mug" aria-hidden />
      </div>
    </div>
  )
}
