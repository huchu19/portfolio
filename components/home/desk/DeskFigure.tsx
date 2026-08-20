import { phyllotaxis, seededRng } from '@/lib/generative'

/**
 * The one hand-authored piece of the desk scene: a line-art figure seen
 * from behind, never the face — the point of the metaphor. Two poses share
 * one desk footprint (the standing-desk raises the whole assembly, it
 * doesn't become a different desk), so switching between them reads as the
 * desk moving, not a scene cut.
 *
 * Pure and server-safe — no hooks, no client JS of its own. The client
 * wrapper (DeskFigureScene) owns the crossfade between the two poses.
 */

export const VIEW_W = 1600
export const VIEW_H = 900

type Pose = 'seated' | 'standing'

type Rect = { x: number; y: number; w: number; h: number }

const GEOMETRY: Record<
  Pose,
  {
    deskY: number
    shoulderTopY: number
    shoulderTopX: [number, number]
    shoulderBottomX: [number, number]
    head: { cx: number; cy: number; r: number }
    monitor: Rect
    arm: { x1: number; y1: number; x2: number; y2: number }
  }
> = {
  seated: {
    deskY: 820,
    shoulderTopY: 640,
    shoulderTopX: [620, 980],
    shoulderBottomX: [500, 1100],
    head: { cx: 800, cy: 562, r: 66 },
    monitor: { x: 670, y: 300, w: 260, h: 178 },
    arm: { x1: 655, y1: 660, x2: 598, y2: 782 },
  },
  standing: {
    deskY: 760,
    shoulderTopY: 555,
    shoulderTopX: [640, 960],
    shoulderBottomX: [560, 1040],
    head: { cx: 800, cy: 478, r: 66 },
    monitor: { x: 670, y: 225, w: 260, h: 178 },
    arm: { x1: 648, y1: 590, x2: 604, y2: 738 },
  },
}

/** Where DeskScreen should sit, in percentages of the scene container. */
function screenRect(pose: Pose) {
  const m = GEOMETRY[pose].monitor
  const inset = 14
  return {
    xPct: ((m.x + inset) / VIEW_W) * 100,
    yPct: ((m.y + inset) / VIEW_H) * 100,
    wPct: ((m.w - inset * 2) / VIEW_W) * 100,
    hPct: ((m.h - inset * 2) / VIEW_H) * 100,
  }
}

export const SCREEN_RECT_SEATED = screenRect('seated')
export const SCREEN_RECT_STANDING = screenRect('standing')

export default function DeskFigure({ pose }: { pose: Pose }) {
  const g = GEOMETRY[pose]
  const [shTopX1, shTopX2] = g.shoulderTopX
  const [shBotX1, shBotX2] = g.shoulderBottomX

  // a low scatter of dots around the desk, in CoverArt's own visual
  // language — fixed seed, since this element isn't tied to any one post
  const dots = phyllotaxis(seededRng('desk-figure'), 60)

  const torsoPath = [
    `M ${shTopX1} ${g.shoulderTopY}`,
    `Q ${g.head.cx} ${g.shoulderTopY - 30} ${shTopX2} ${g.shoulderTopY}`,
    `L ${shBotX2} ${g.deskY}`,
    `L ${shBotX1} ${g.deskY}`,
    'Z',
  ].join(' ')

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax meet"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      {/* a whisper of the site's phyllotaxis dot language, low and quiet */}
      <g opacity={0.35}>
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={g.head.cx + d.x * 420}
            cy={g.deskY + 40 + d.y * 60}
            r={d.r * 90}
            fill="var(--color-fg-faint)"
          />
        ))}
      </g>

      {/* the desk lamp, off to one side */}
      <g fill="none" stroke="var(--color-fg-faint)" strokeWidth={5} strokeLinecap="round">
        <path d={`M 340 ${g.deskY} L 380 ${g.deskY - 140} L 470 ${g.deskY - 170}`} />
        <circle cx={470} cy={g.deskY - 170} r={22} fill="var(--color-surface)" />
      </g>

      {/* the monitor — an engraved plate, same idiom as DebossStamp */}
      <rect
        x={g.monitor.x}
        y={g.monitor.y}
        width={g.monitor.w}
        height={g.monitor.h}
        rx={10}
        fill="var(--color-raised)"
        stroke="var(--color-accent)"
        strokeWidth={3}
      />
      <line
        x1={g.monitor.x + g.monitor.w / 2}
        y1={g.monitor.y + g.monitor.h}
        x2={g.monitor.x + g.monitor.w / 2}
        y2={g.deskY}
        stroke="var(--color-fg-faint)"
        strokeWidth={6}
      />

      {/* the figure — a filled cutout so it naturally occludes the stand */}
      <path
        d={torsoPath}
        fill="var(--color-bg)"
        stroke="var(--color-fg-soft)"
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <line
        x1={g.arm.x1}
        y1={g.arm.y1}
        x2={g.arm.x2}
        y2={g.arm.y2}
        stroke="var(--color-fg-soft)"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <circle
        cx={g.head.cx}
        cy={g.head.cy}
        r={g.head.r}
        fill="var(--color-bg)"
        stroke="var(--color-fg-soft)"
        strokeWidth={6}
      />

      {/* the desk edge — nearest the viewer, drawn last */}
      <line
        x1={260}
        y1={g.deskY}
        x2={1340}
        y2={g.deskY}
        stroke="var(--color-line)"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  )
}
