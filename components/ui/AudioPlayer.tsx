'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { goldenSplit } from '@/lib/golden'

/**
 * Recitation player — a native <audio> driven by a custom surface:
 * ember play ring (echoing the cursor), mono tabular time, a hairline
 * seek split at the golden ratio against a 21-bar ember visualizer
 * (AnalyserNode). The WebAudio graph is built lazily on first play
 * (Safari needs resume() inside the gesture) and exactly once per
 * element — createMediaElementSource throws on a second call. The
 * analyser must reconnect to destination or the audio goes silent.
 * Reduced motion: no dancing bars, just the filling line. Dormant
 * until a post or fragment carries an audio `media` path.
 */

const BARS = 21 // fibonacci, why not

function fmt(t: number) {
  if (!Number.isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function AudioPlayer({ src, label }: { src: string; label?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const graphRef = useRef<{ ctx: AudioContext; analyser: AnalyserNode } | null>(null)
  const rafRef = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const reduced = useReducedMotion() ?? false

  const stopDrawing = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const canvas = canvasRef.current
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const graph = graphRef.current
    if (!canvas || !graph) return
    const g = canvas.getContext('2d')
    if (!g) return
    // token, not hex — re-read per play so theme flips are honored
    const ember = getComputedStyle(canvas).getPropertyValue('--color-ember').trim()
    const data = new Uint8Array(graph.analyser.frequencyBinCount)
    const step = () => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(step)
        return
      }
      graph.analyser.getByteFrequencyData(data)
      g.clearRect(0, 0, canvas.width, canvas.height)
      g.fillStyle = ember
      const bw = canvas.width / BARS
      for (let i = 0; i < BARS; i++) {
        const v = data[Math.floor((i / BARS) * data.length)] / 255
        const h = Math.max(2, v * canvas.height)
        g.globalAlpha = 0.35 + v * 0.65
        g.fillRect(i * bw, canvas.height - h, bw * 0.55, h)
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [])

  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      return
    }
    if (!graphRef.current && !reduced) {
      const ctx = new AudioContext()
      const source = ctx.createMediaElementSource(audio)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)
      analyser.connect(ctx.destination)
      graphRef.current = { ctx, analyser }
    }
    await graphRef.current?.ctx.resume()
    await audio.play()
  }, [playing, reduced])

  useEffect(() => stopDrawing, [stopDrawing])

  const [seekMajor] = goldenSplit(100)

  return (
    <div
      className="flex items-center"
      style={{
        gap: 'calc(var(--u) * 2)',
        padding: 'calc(var(--u) * 2)',
        border: '1px solid var(--color-void-line)',
        borderRadius: 8,
        background: 'var(--color-void-raised)',
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => {
          setPlaying(true)
          if (!reduced) draw()
        }}
        onPause={() => {
          setPlaying(false)
          stopDrawing()
        }}
        onEnded={() => {
          setPlaying(false)
          stopDrawing()
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause recitation' : `Play recitation${label ? ` — ${label}` : ''}`}
        className="flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
        style={{
          width: 40,
          height: 40,
          border: '1.5px solid var(--color-ember)',
          color: 'var(--color-ember-bright)',
        }}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <rect x="2" y="1" width="3" height="10" fill="currentColor" />
            <rect x="7" y="1" width="3" height="10" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden style={{ marginLeft: 2 }}>
            <path d="M2 1 L11 6 L2 11 Z" fill="currentColor" />
          </svg>
        )}
      </button>
      <span
        className="mono-label shrink-0"
        style={{ fontVariantNumeric: 'tabular-nums', fontSize: 11 }}
      >
        {fmt(time)} / {fmt(duration)}
      </span>
      <input
        type="range"
        className="audio-seek"
        aria-label="Seek"
        min={0}
        max={duration || 0}
        step={0.1}
        value={time}
        onChange={(e) => {
          const audio = audioRef.current
          if (audio) audio.currentTime = Number(e.target.value)
        }}
        style={{ width: `${seekMajor}%`, minWidth: 60 }}
      />
      {!reduced && (
        <canvas
          ref={canvasRef}
          width={89}
          height={28}
          aria-hidden
          style={{ width: 89, height: 28, flexShrink: 0 }}
        />
      )}
    </div>
  )
}
