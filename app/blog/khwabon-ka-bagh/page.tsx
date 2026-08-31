import type { Metadata } from 'next'
import Link from 'next/link'
import GhazalAtmosphere from '@/components/blog/GhazalAtmosphere'

export const metadata: Metadata = {
  title: 'Khwabon Ka Bagh — Ghazal',
  description: 'Khwabon Ka Bagh, an original Urdu ghazal by Syed Muhammad Hussain Naqvi, with an English translation.',
}

const stanzas = [
  {
    urdu: ['کھلنے کے لیے روشنی لازم ہے', 'مگر بیج اندھیرا ہی مانگتا ہے', 'خاک کی تاریکی کے اندر', 'سب سے پہلے خواب ہی سر اٹھاتا ہے'],
    english: ['To bloom, light is necessary', 'But a seed asks for darkness', 'Within the darkness of soil,', 'It is the dream that rises first'],
  },
  {
    urdu: ['بادِ نو بہار کا یہ وقت ہے دیکھو', 'ولولوں کا، امیدوں کا مرکز ہے دیکھو', 'کلی کلی میں شگفتگی ابھر رہی ہے', 'گلوں میں ستا سجتے ہوئے دیکھو'],
    english: ['Look, this is the time of the spring breeze', 'It is the center of passions and hopes', 'Every bud is beginning to bloom', 'See how the gardens are getting ready'],
  },
  {
    urdu: ['ہم ہی رنگریز ہیں اور پھول بھی خود', 'رنگ بھرنا بھی ہمیں ہے، بکھرنا بھی ہمیں', 'جن کی سانسوں میں بسی ہو بہار کی روح', 'انہی ہاتھوں سے گلشن کو سجانا ہے ہم نے'],
    english: ['We are the dyers, and we ourselves are the flowers', 'We must fill the colors, and we must scatter too', 'Those whose breaths carry the spirit of spring,', 'It is by their hands that the garden must be adorned'],
  },
  {
    urdu: ['گلزار ہمارے بیزار ہیں', 'پڑتے ہوئے سورج کی دھوپ بھی ہے تنہا', 'پھر بھول جائیں اگر گلدان میں پانی ڈالنا', 'تو بے جان فصلیں ہی رہ جاتی ہیں۔'],
    english: ['Our gardens have grown weary', 'Even the setting sun’s light feels lonely', 'If we forget to water the vase,', 'Only lifeless harvests remain'],
  },
  {
    urdu: ['تھک کے جب چھاؤں میں تلے بیٹھیں', 'درد آئے تو ہمدم بھی ساتھ پائے', 'دل کے گھر میں جو دبے پیر باتیں ہوئیں', 'وہی رشتے تھے جو سچ میں سمجھ پائے'],
    english: ['When we sit beneath shade after tiring', 'May we find a companion when pain arrives', 'The quiet conversations from the heart', 'Were the relationships that truly understood'],
  },
  {
    urdu: ['وقت کی گردش میں گل پھر سے کھلیں گے دیکھو', 'ہر زوال کے بعد ہی عروج آتا ہے', 'خوابوں کا یہ باغ جلتا بھی رہے تو کیا', 'راکھ سے بھی ایک نیا انقلاب پیدا ہوتا ہے'],
    english: ['In the turning of time, flowers will bloom again', 'After every decline, rise always comes', 'Even if this garden of dreams keeps burning,', 'From ashes too, a new revolution is born'],
  },
] as const

export default function KhwabonKaBaghPage() {
  return (
    <div className="ghazal-page-shell">
      <GhazalAtmosphere />
      <article
        className="ghazal-page mx-auto w-full"
        style={{ maxWidth: 1040, padding: 'calc(var(--u) * 3)', paddingTop: 'calc(var(--u) * 10)' }}
      >
        <nav className="ghazal-breadcrumb mono-label" aria-label="Breadcrumb">
          <Link href="/blog">Blog</Link><span aria-hidden> / </span><span>Khwabon Ka Bagh</span>
        </nav>

        <header className="ghazal-header">
          <div>
            <p className="mono-label ghazal-kicker">Ghazal · Urdu / English</p>
            <h1 className="display">Khwabon Ka Bagh</h1>
            <p className="urdu ghazal-title-urdu" lang="ur" dir="rtl">خوابوں کا باغ</p>
            <p className="ghazal-byline">Syed Muhammad Hussain Naqvi</p>
          </div>
          <a href="/downloads/khwabon-ka-bagh.pdf" download data-tactile className="ghazal-download mono-label">
            <span>Download PDF</span>
            <small>2 pages · original edition</small>
          </a>
        </header>

        <div className="ghazal-stanzas">
          {stanzas.map((stanza, index) => (
            <section
              className="ghazal-stanza"
              key={index}
              aria-labelledby={`stanza-${index + 1}`}
            >
              <span id={`stanza-${index + 1}`} className="ghazal-number mono-label">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="urdu ghazal-urdu" lang="ur" dir="rtl">
                {stanza.urdu.map((line) => <p key={line}>{line}</p>)}
              </div>
              <div className="ghazal-english" lang="en">
                {stanza.english.map((line) => <p key={line}>{line}</p>)}
              </div>
            </section>
          ))}
        </div>

        <footer className="ghazal-end">
          <span className="urdu" lang="ur" dir="rtl">تمام شد</span>
          <a href="/downloads/khwabon-ka-bagh.pdf" download className="mono-label">Download the original PDF ↓</a>
        </footer>
      </article>
    </div>
  )
}
