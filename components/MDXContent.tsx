import * as runtime from 'react/jsx-runtime'
import type { ComponentProps, ReactNode } from 'react'
import Footnote from '@/components/Footnote'

/**
 * Renders Velite-compiled MDX (function-body code) with a shared
 * component map. Layout variants may extend the map via `components`.
 */

const sharedComponents = {
  Footnote,
}

function getMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

export default function MDXContent({
  code,
  components,
}: {
  code: string
  components?: Record<string, (props: ComponentProps<'div'>) => ReactNode>
}) {
  const Component = getMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}
