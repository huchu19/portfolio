import { ogPalette as c } from '@/lib/palette'

/** The share image is now a tiny physical studio, matching the live hero. */

export default function OgCard({
  kicker,
  title,
  seed,
  siteName,
  signatureSrc,
}: {
  kicker: string
  title: string
  seed: string
  siteName: string
  signatureSrc?: string
}) {
  const urdu = /[؀-ۿ]/.test(title)
  void seed

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: c.bg,
        position: 'relative',
        fontFamily: 'Bricolage Grotesque',
      }}
    >
      <div style={{ position: 'absolute', left: 730, top: 0, width: 470, height: 500, display: 'flex', backgroundColor: '#e6d7bf' }} />
      <div style={{ position: 'absolute', left: 730, top: 500, width: 470, height: 130, display: 'flex', backgroundColor: '#b98b64' }} />
      <div style={{ position: 'absolute', left: 810, top: 360, width: 320, height: 24, borderRadius: 5, display: 'flex', backgroundColor: c.wood }} />
      <div style={{ position: 'absolute', left: 920, top: 205, width: 160, height: 108, borderRadius: 10, display: 'flex', border: `10px solid ${c.fg}`, backgroundColor: '#26353c' }} />
      <div style={{ position: 'absolute', left: 973, top: 313, width: 48, height: 48, display: 'flex', backgroundColor: c.fg }} />
      <div style={{ position: 'absolute', left: 885, top: 330, width: 118, height: 178, borderRadius: 52, display: 'flex', backgroundColor: c.accent }} />
      <div style={{ position: 'absolute', left: 918, top: 270, width: 60, height: 60, borderRadius: 999, display: 'flex', backgroundColor: '#bb7959', borderTop: `18px solid ${c.fg}` }} />
      <div style={{ position: 'absolute', left: 785, top: 78, width: 118, height: 88, display: 'flex', rotate: '-3deg', backgroundColor: c.surface, boxShadow: '5px 7px 0 rgb(80 50 30 / 0.12)' }} />
      <div style={{ position: 'absolute', left: 1010, top: 92, width: 132, height: 96, display: 'flex', rotate: '2deg', backgroundColor: '#d7e2d7', boxShadow: '5px 7px 0 rgb(80 50 30 / 0.12)' }} />
      <div style={{ position: 'absolute', left: 837, top: 67, width: 13, height: 13, borderRadius: 999, display: 'flex', backgroundColor: c.accent }} />
      <div style={{ position: 'absolute', left: 1068, top: 82, width: 13, height: 13, borderRadius: 999, display: 'flex', backgroundColor: c.accent }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 730,
          height: '100%',
          padding: 64,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 2,
              color: c.accentDeep,
            }}
          >
            {kicker}
          </div>
          {signatureSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={signatureSrc}
              alt=""
              width={112}
              height={78}
              style={{ objectFit: 'contain' }}
            />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: urdu || title.length > 60 ? 54 : 66,
            lineHeight: 1.08,
            color: c.fg,
          }}
        >
          {urdu ? siteName : title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', width: 89, height: 5, backgroundColor: c.wood, marginRight: 24 }} />
          <div style={{ display: 'flex', fontSize: 26, color: c.fgSoft }}>{urdu ? 'khwabon ka bagh' : siteName}</div>
        </div>
      </div>
    </div>
  )
}
