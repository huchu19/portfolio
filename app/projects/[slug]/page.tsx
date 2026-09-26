import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/lib/projects'
import ProjectLayout from '@/components/layouts/ProjectLayout'

// Repos created after the last build render on first visit.
export const revalidate = 3600

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
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
  const project = await getProject(slug)
  if (!project) notFound()

  return <ProjectLayout project={project} />
}
