import { defineCollection, defineConfig, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug('posts'),
      date: s.isodate(),
      type: s.enum(['project', 'essay', 'poetry', 'journal', 'adventure']),
      excerpt: s.string().max(300),
      tags: s.array(s.string()).default([]),
      coverImage: s.string().optional(),
      // adventure posts: airport/city hops, e.g. ["LHE", "DXB", "LHR"]
      route: s.array(s.string()).optional(),
      // project posts only
      projectLinks: s
        .object({
          live: s.string().url().optional(),
          repo: s.string().url().optional(),
        })
        .optional(),
      draft: s.boolean().default(false),
      metadata: s.metadata(), // readingTime (minutes) + wordCount, auto-computed
      code: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/writing/${data.slug}` })),
})

export default defineConfig({
  root: 'content',
  collections: { posts },
})
