/**
 * First-visit ink-bleed veil. A tiny inline script decides before paint:
 * returning visitors and reduced-motion readers never see it.
 */
export default function InkReveal() {
  return (
    <div id="ink-veil" aria-hidden="true" suppressHydrationWarning>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('fn-seen')||matchMedia('(prefers-reduced-motion: reduce)').matches){document.getElementById('ink-veil').classList.add('veil-skip')}else{sessionStorage.setItem('fn-seen','1')}}catch(e){}`,
        }}
      />
      <span className="veil-seal">
        field notes<span className="veil-dot">.</span>
      </span>
    </div>
  )
}
