'use client'

import { FormEvent, useMemo, useRef, useState } from 'react'

const TOPICS = [
  { label: 'Build something', subject: 'A project for us to discuss', stamp: 'PROJECT' },
  { label: 'Say hello', subject: 'Hello from your portfolio', stamp: 'HELLO' },
  { label: 'Talk poetry', subject: 'A note about Khwabon Ka Bagh', stamp: 'POETRY' },
] as const

export default function ContactGarden({ email }: { email: string }) {
  const [topic, setTopic] = useState(0)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const active = TOPICS[topic]
  const awake = name.length > 0 || message.length > 0

  const mailto = useMemo(() => {
    const greeting = name.trim() ? `Hi Hussain,\n\n${message.trim()}\n\n— ${name.trim()}` : `Hi Hussain,\n\n${message.trim()}`
    return `mailto:${email}?subject=${encodeURIComponent(active.subject)}&body=${encodeURIComponent(greeting)}`
  }, [active.subject, email, message, name])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.location.href = mailto
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const field = document.createElement('textarea')
      field.value = email
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section id="contact" className="contact-garden" aria-labelledby="contact-title">
      <header className="contact-heading">
        <p className="section-hand">A signal above the garden</p>
        <h2 id="contact-title">Let&apos;s make contact.</h2>
        <p>The path ends here, but the conversation does not. Leave a note and open it in your email app.</p>
      </header>

      <div className="contact-workbench" data-awake={awake ? 'true' : 'false'}>
        <div className="contact-scene">
          <div className="contact-moon" aria-hidden />
          <div className="contact-vines" aria-hidden><i /><i /><i /><i /></div>
          <button
            type="button"
            className="contact-mailbox"
            data-tactile
            onClick={() => nameRef.current?.focus()}
            aria-label="Open the contact note"
          >
            <span className="contact-mailbox-flag" aria-hidden />
            <span className="contact-envelope" aria-hidden>
              <i>{active.stamp}</i>
            </span>
          </button>
          <p>Tap the letter to start writing.</p>
        </div>

        <form className="contact-letter" onSubmit={submit}>
          <div className="contact-letter-top">
            <span className="mono-label">To · Hussain Naqvi</span>
            <span className="contact-stamp mono-label">{active.stamp}</span>
          </div>

          <fieldset className="contact-topics">
            <legend className="mono-label">What&apos;s this about?</legend>
            <div>
              {TOPICS.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  data-tactile
                  aria-pressed={topic === index}
                  onClick={() => setTopic(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label>
            <span className="mono-label">Your name</span>
            <input ref={nameRef} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
          </label>

          <label>
            <span className="mono-label">Your note</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, 700))}
              rows={6}
              required
              placeholder="A short note is plenty…"
            />
            <small className="mono-label">{message.length}/700</small>
          </label>

          <div className="contact-actions">
            <button type="submit" className="contact-send" data-tactile data-feedback="strong">
              Open email draft <span aria-hidden>↗</span>
            </button>
            <button type="button" className="contact-copy mono-label" data-tactile onClick={copyEmail}>
              {copied ? 'Address copied ✓' : 'Copy email address'}
            </button>
          </div>
          <a className="contact-address" href={`mailto:${email}`}>{email}</a>
        </form>
      </div>
    </section>
  )
}
