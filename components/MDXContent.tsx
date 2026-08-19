import * as runtime from 'react/jsx-runtime'
import Link from 'next/link'
import Footnote from '@/components/typography/Footnote'
import Urdu from '@/components/typography/Urdu'
import RouteStrip from '@/components/layouts/RouteStrip'
import RouteArc from '@/components/layouts/RouteArc'

/**
 * Route treatments are no longer fixtures of a travel-only layout — any
 * note can reach for the hop strip or the drawing flight path mid-body.
 */
const sharedComponents = {
  Footnote,
  Urdu,
  RouteStrip,
  RouteArc,
  a: ({ href = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    href.startsWith('/') ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} rel="noopener" {...props} />
    ),
}

function useMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

export default function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return <Component components={sharedComponents} />
}
