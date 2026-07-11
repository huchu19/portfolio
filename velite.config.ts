import { defineCollection, defineConfig, s } from 'velite'

const lang = s.enum(['en', 'ur', 'both']).default('en')

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
      lang,
      coverImage: s.string().optional(),
      // adventure posts: airport/city hops, e.g. ["LHE", "DXB", "LHR"]
      route: s.array(s.string()).optional(),
      // project posts only
      stack: s.array(s.string()).optional(), // mono chips: Next.js · TypeScript · …
      status: s.enum(['live', 'in-progress', 'archived']).optional(),
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

// Fragments: micro-content. Frictionless frontmatter — title optional,
// slug derived from the filename, body is 1–3 sentences.
const fragments = defineCollection({
  name: 'Fragment',
  pattern: 'fragments/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(120).optional(),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      lang,
      media: s.string().optional(), // image/audio path
      link: s.string().url().optional(), // external URL the fragment reacts to
      draft: s.boolean().default(false),
      excerpt: s.excerpt({ length: 280 }), // plain text of the body, for feed panels
      path: s.path(),
      code: s.mdx(),
    })
    .transform((data) => {
      const slug = data.path.split('/').pop()!.replace(/^\d{4}-\d{2}-\d{2}-/, '')
      return {
        ...data,
        type: 'fragment' as const,
        slug,
        permalink: `/fragments/${slug}`,
      }
    }),
})

export default defineConfig({
  root: 'content',
  collections: { posts, fragments },
})
