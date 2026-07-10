import Link from 'next/link'
import Restamp from '@/components/Restamp'
import styles from '@/components/DeadLetter.module.css'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <p className="meta-mono text-ink-faint">
        404 · no such address · route unknown
      </p>
      <h1
        className="mt-3 font-display text-4xl tracking-tight md:text-5xl"
        style={{ fontVariationSettings: '"opsz" 144' }}
      >
        The Dead Letter Office
      </h1>
      <p className="prose-fn mt-4 text-ink-soft">
        Whatever you were looking for was posted, stamped, and never
        delivered. It lives here now, with the other letters that lost their
        way.
      </p>

      <div className={styles.scene}>
        <Restamp>
        <div className={styles.envelope}>
          {/* back-flap creases */}
          <svg
            className={styles.flap}
            viewBox="0 0 800 500"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 0 L400 265 L800 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>

          {/* postage stamp */}
          <div className={styles.stamp} aria-hidden="true">
            <div className={styles.stampInner}>
              <span className={styles.stampGlyph}>❦</span>
              <span className={styles.stampClass}>First class</span>
            </div>
          </div>

          {/* circular cancellation + killer bars */}
          <svg
            className={styles.postmark}
            viewBox="0 0 280 92"
            aria-hidden="true"
          >
            <circle
              cx="46"
              cy="46"
              r="38"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <text
              x="46"
              y="40"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="1.5"
              fill="currentColor"
            >
              FIELD NOTES
            </text>
            <text
              x="46"
              y="58"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="1.5"
              fill="currentColor"
            >
              10 · 07 · 26
            </text>
            {[28, 42, 56, 70].map((y) => (
              <path
                key={y}
                d={`M92 ${y} q 12 -7 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* the address that failed */}
          <p className={styles.addr}>
            <span className={styles.addrTo}>To —</span>
            <br />
            <span className={styles.addrGone}>The page you requested</span>
            <br />
            No forwarding address
          </p>

          {/* the verdict */}
          <span className={styles.rts} aria-hidden="true">
            Return to sender
          </span>
        </div>
        </Restamp>
      </div>

      <p className="text-center">
        <Link
          href="/"
          className="meta-mono text-accent-deep transition-colors duration-300 ease-soft hover:text-accent"
        >
          Return to sender → back to the feed
        </Link>
      </p>
    </div>
  )
}
