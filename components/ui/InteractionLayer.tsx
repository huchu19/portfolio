'use client'

import { useEffect } from 'react'
import type { FeedbackKind, StudioFeedbackDetail } from '@/lib/feedback'

type FeedbackSettings = { sound: boolean; haptics: boolean }

const SETTINGS_KEY = 'studio-feedback'

function readSettings(): FeedbackSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<FeedbackSettings>
    return { sound: saved.sound !== false, haptics: saved.haptics !== false }
  } catch {
    return { sound: true, haptics: true }
  }
}

const VIBRATION: Record<FeedbackKind, number | number[]> = {
  press: 7,
  open: [5, 28, 10],
  success: [6, 22, 6],
  settle: 12,
  error: [16, 45, 16],
  discover: [5, 18, 7, 18, 10],
  strong: [9, 16, 7],
}

const SOUND: Record<FeedbackKind, { start: number; end: number; gain: number; pulses: number[]; wave: OscillatorType }> = {
  press: { start: 360, end: 225, gain: 0.025, pulses: [0], wave: 'triangle' },
  open: { start: 310, end: 190, gain: 0.026, pulses: [0, 0.052], wave: 'triangle' },
  success: { start: 390, end: 510, gain: 0.024, pulses: [0, 0.052], wave: 'sine' },
  settle: { start: 190, end: 122, gain: 0.034, pulses: [0], wave: 'triangle' },
  error: { start: 180, end: 105, gain: 0.038, pulses: [0, 0.095], wave: 'square' },
  discover: { start: 330, end: 610, gain: 0.024, pulses: [0, 0.06, 0.12], wave: 'sine' },
  strong: { start: 210, end: 118, gain: 0.045, pulses: [0, 0.06], wave: 'square' },
}

function playFeedback(context: AudioContext, kind: FeedbackKind) {
  const now = context.currentTime
  const profile = SOUND[kind]
  profile.pulses.forEach((offset, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const start = now + offset
    const pitchStep = kind === 'discover' || kind === 'success' ? 1 + index * 0.12 : 1
    oscillator.type = profile.wave
    oscillator.frequency.setValueAtTime(profile.start * pitchStep, start)
    oscillator.frequency.exponentialRampToValueAtTime(profile.end * pitchStep, start + 0.045)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(profile.gain, start + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.055)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(start)
    oscillator.stop(start + 0.06)
  })

  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.018), context.sampleRate)
  const channel = buffer.getChannelData(0)
  for (let i = 0; i < channel.length; i += 1) channel[i] = (Math.random() * 2 - 1) * (1 - i / channel.length)
  const noise = context.createBufferSource()
  const noiseGain = context.createGain()
  noise.buffer = buffer
  noiseGain.gain.value = kind === 'strong' || kind === 'error' || kind === 'settle' ? 0.032 : 0.016
  noise.connect(noiseGain).connect(context.destination)
  noise.start(now)
}

/**
 * One delegated interaction layer keeps controls tactile without turning
 * every component into its own audio/haptics implementation.
 */
export default function InteractionLayer() {
  useEffect(() => {
    let settings = readSettings()
    let context: AudioContext | null = null

    const updateSettings = (event: Event) => {
      settings = (event as CustomEvent<FeedbackSettings>).detail
    }

    const feedback = (target: HTMLElement | null, kind: FeedbackKind = 'press', x?: number, y?: number, quiet = false) => {
      if (target?.dataset.feedback === 'off') return
      if (settings.haptics && 'vibrate' in navigator) navigator.vibrate(VIBRATION[kind])
      if (settings.sound && !quiet) {
        context ??= new AudioContext()
        void context.resume().then(() => context && playFeedback(context, kind))
      }

      if (!target) return
      const rect = target.getBoundingClientRect()
      const ripple = document.createElement('i')
      ripple.className = 'tactile-ripple'
      ripple.style.left = `${(x ?? rect.left + rect.width / 2) - rect.left}px`
      ripple.style.top = `${(y ?? rect.top + rect.height / 2) - rect.top}px`
      target.appendChild(ripple)
      window.setTimeout(() => ripple.remove(), 360)
    }

    const findControl = (target: EventTarget | null) =>
      (target as Element | null)?.closest<HTMLElement>('button, [role="button"], a[data-tactile], .studio-project-pin, .project-sheet a') ?? null

    const onPointerDown = (event: PointerEvent) => {
      const target = findControl(event.target)
      if (!target || target.matches(':disabled') || target.getAttribute('aria-disabled') === 'true') return
      target.dataset.pressed = 'true'
      const kind = target.dataset.feedback === 'strong' ? 'strong' : 'press'
      feedback(target, kind, event.clientX, event.clientY)
    }

    const release = () => document.querySelectorAll<HTMLElement>('[data-pressed="true"]').forEach((el) => delete el.dataset.pressed)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return
      const target = findControl(event.target)
      if (target && !target.matches(':disabled') && target.getAttribute('aria-disabled') !== 'true') {
        feedback(target, target.dataset.feedback === 'strong' ? 'strong' : 'press')
      }
    }

    const onStudioFeedback = (event: Event) => {
      const detail = (event as CustomEvent<StudioFeedbackDetail>).detail
      if (!detail?.kind) return
      feedback(null, detail.kind, undefined, undefined, detail.quiet)
    }

    const onPointerMove = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-magnetic]')
      if (!target) return
      const rect = target.getBoundingClientRect()
      target.style.setProperty('--press-x', `${((event.clientX - rect.left) / rect.width - 0.5) * 5}px`)
      target.style.setProperty('--press-y', `${((event.clientY - rect.top) / rect.height - 0.5) * 4}px`)
    }

    const onPointerOut = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-magnetic]')
      if (!target || target.contains(event.relatedTarget as Node | null)) return
      target.style.removeProperty('--press-x')
      target.style.removeProperty('--press-y')
    }

    let projectSettled = false
    const visible = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          element.dataset.inView = 'true'
          if (!projectSettled && element.matches('.project-shelf .project-sheet')) {
            projectSettled = true
            feedback(null, 'settle', undefined, undefined, true)
          }
          visible.unobserve(entry.target)
        }
      }
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 })

    // Keep observer bookkeeping local to this effect. React intentionally
    // mounts, cleans up, and remounts effects in development; a data attribute
    // used as the bookkeeping flag survived that cycle while the observer did
    // not, leaving every reveal permanently transparent.
    const observedElements = new WeakSet<HTMLElement>()

    const enhance = (root: ParentNode) => {
      const candidates = [
        ...(root instanceof HTMLElement && root.matches('.paper-arrival, .prose img, .project-cover') ? [root] : []),
        ...root.querySelectorAll<HTMLElement>('.paper-arrival, .prose img, .project-cover'),
      ]
      candidates.forEach((element) => {
        if (observedElements.has(element)) return
        observedElements.add(element)
        if (element.matches('.prose img, .project-cover')) element.classList.add('developing-media')
        visible.observe(element)
      })

      const copySurfaces = [
        ...(root instanceof HTMLElement && root.matches('.prose blockquote, .prose pre, .prose .urdu') ? [root] : []),
        ...root.querySelectorAll<HTMLElement>('.prose blockquote, .prose pre, .prose .urdu'),
      ]
      copySurfaces.forEach((surface) => {
        if (surface.querySelector(':scope > .copy-action')) return
        surface.classList.add('copy-surface')
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'copy-action'
        button.dataset.copy = 'true'
        button.setAttribute('aria-label', 'Copy this passage')
        button.textContent = 'copy'
        surface.appendChild(button)
      })

      const proseLinks = [
        ...(root instanceof HTMLAnchorElement && root.matches('.prose a') ? [root] : []),
        ...root.querySelectorAll<HTMLAnchorElement>('.prose a'),
      ]
      proseLinks.forEach((link) => {
        link.dataset.copyHint = 'true'
        if (!link.title) link.title = 'Alt-click to copy this link'
      })
    }

    const stamp = (label = 'COPIED') => {
      const mark = document.createElement('div')
      mark.className = 'copy-stamp'
      mark.setAttribute('role', 'status')
      mark.textContent = label
      document.body.appendChild(mark)
      requestAnimationFrame(() => mark.dataset.visible = 'true')
      feedback(null, 'success')
      window.setTimeout(() => mark.remove(), 1150)
    }

    const surfaceText = (surface: HTMLElement) => {
      const clone = surface.cloneNode(true) as HTMLElement
      clone.querySelectorAll('.copy-action').forEach((button) => button.remove())
      return clone.innerText.trim()
    }

    let copyingInternally = false
    const copyText = async (value: string) => {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value)
          return
        } catch {
          // Permission can be denied even when the modern API exists.
        }
      }
      const field = document.createElement('textarea')
      field.value = value
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      copyingInternally = true
      try {
        document.execCommand('copy')
      } finally {
        copyingInternally = false
        field.remove()
      }
    }

    const onCopyClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest<HTMLElement>('[data-copy="true"]')
      if (button) {
        const surface = button.closest<HTMLElement>('.copy-surface')
        if (!surface) return
        event.preventDefault()
        void copyText(surfaceText(surface)).then(() => stamp('COPIED · INK DRY'))
        return
      }
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('.prose a[data-copy-hint]')
      if (link && event.altKey) {
        event.preventDefault()
        void copyText(link.href).then(() => stamp('LINK STAMPED'))
      }
    }

    const onCopy = () => {
      if (!copyingInternally) window.setTimeout(() => stamp('COPIED · INK DRY'), 0)
    }

    enhance(document)
    // A final post-hydration pass covers server-rendered MDX nodes that React
    // may reconcile after this global client layer first mounts.
    const hydrationFrame = requestAnimationFrame(() => enhance(document))
    const hydrationTimer = window.setTimeout(() => enhance(document), 250)
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) enhance(node.matches('.page-enter') ? node : node)
        })
      }
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('studio-feedback-settings', updateSettings)
    window.addEventListener('studio:feedback', onStudioFeedback)
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('pointerup', release, true)
    document.addEventListener('pointercancel', release, true)
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('click', onCopyClick)
    document.addEventListener('copy', onCopy)
    return () => {
      window.removeEventListener('studio-feedback-settings', updateSettings)
      window.removeEventListener('studio:feedback', onStudioFeedback)
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('pointerup', release, true)
      document.removeEventListener('pointercancel', release, true)
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('click', onCopyClick)
      document.removeEventListener('copy', onCopy)
      mutations.disconnect()
      visible.disconnect()
      cancelAnimationFrame(hydrationFrame)
      window.clearTimeout(hydrationTimer)
      void context?.close()
    }
  }, [])

  return null
}
