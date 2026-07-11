import * as runtime from 'react/jsx-runtime'
import Link from 'next/link'
import Footnote from '@/components/typography/Footnote'
import Urdu from '@/components/typography/Urdu'

const sharedComponents = {
  Footnote,
  Urdu,
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
