import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getUneditedCode } from '@/lib/posts'
import { getRepoFacts } from '@/lib/github'
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const uneditedCode = getUneditedCode(post.slug)

  switch (post.type) {
    case 'project': {
      // A dossier gains its live rows when the post names a repo; a
      // failed lookup returns null and the static rows carry the page.
      const facts = post.repo ? await getRepoFacts(post.repo) : null
      return <ProjectLayout post={post} facts={facts} uneditedCode={uneditedCode} />
    }
    case 'journal':
      return <JournalLayout post={post} uneditedCode={uneditedCode} />
    default:
      return <NoteLayout post={post} uneditedCode={uneditedCode} />
  }
}
