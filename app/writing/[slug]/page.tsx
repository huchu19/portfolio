import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, type Post } from '@/lib/posts'
import ProjectLayout from '@/components/layouts/ProjectLayout'
import NoteLayout from '@/components/layouts/NoteLayout'
import JournalLayout from '@/components/layouts/JournalLayout'

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
  project: ProjectLayout,
  note: NoteLayout,
  journal: JournalLayout,
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
