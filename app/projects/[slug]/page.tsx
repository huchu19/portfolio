import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { getRepoFacts } from '@/lib/github'
import ProjectLayout from '@/components/layouts/ProjectLayout'

export function generateStaticParams() {
  return getAllPosts().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getPostBySlug(slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      type: 'article',
      publishedTime: project.date,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getPostBySlug(slug)
  if (!project || project.type !== 'project') notFound()

  const facts = project.repo ? await getRepoFacts(project.repo) : null
  return <ProjectLayout post={project} facts={facts} />
}
