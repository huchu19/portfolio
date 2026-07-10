import type { Post } from '@/lib/posts'
import EssayLayout from '@/components/layouts/EssayLayout'
import ProjectLayout from '@/components/layouts/ProjectLayout'
import PoetryLayout from '@/components/layouts/PoetryLayout'
import JournalLayout from '@/components/layouts/JournalLayout'
import AdventureLayout from '@/components/layouts/AdventureLayout'
import ReadingProgress from '@/components/ReadingProgress'
import PostNav from '@/components/PostNav'
import QuoteStamp from '@/components/QuoteStamp'

const LAYOUTS = {
  essay: EssayLayout,
  project: ProjectLayout,
  poetry: PoetryLayout,
  journal: JournalLayout,
  adventure: AdventureLayout,
} as const

export default function PostLayout({ post }: { post: Post }) {
  const Layout = LAYOUTS[post.type]
  return (
    <>
      {/* poetry stays chromeless — no gauge over the ma */}
      {post.type !== 'poetry' && <ReadingProgress />}
      <Layout post={post} />
      <QuoteStamp title={post.title} />
      <PostNav post={post} />
    </>
  )
}
