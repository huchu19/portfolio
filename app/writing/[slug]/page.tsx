import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, type Post } from '@/lib/posts'
import PoetryLayout from '@/components/layouts/PoetryLayout'
import ProjectLayout from '@/components/layouts/ProjectLayout'
import EssayLayout from '@/components/layouts/EssayLayout'
import JournalLayout from '@/components/layouts/JournalLayout'
import AdventureLayout from '@/components/layouts/AdventureLayout'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

const LAYOUTS: Record<Post['type'], React.ComponentType<{ post: Post }>> = {
  poetry: PoetryLayout,
  project: ProjectLayout,
  essay: EssayLayout,
  journal: JournalLayout,
  adventure: AdventureLayout,
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()
  const Layout = LAYOUTS[post.type]
  return <Layout post={post} />
}
