/** One place for identity — swap the placeholder handle and every surface follows. */
export const site = {
  name: 'Hussain Naqvi',
  title: 'Hussain Naqvi — Software Engineer',
  description:
    'Software projects by Hussain Naqvi, with detailed project documentation and an original ghazal.',
  /**
   * Used by RSS, sitemap, and OG images. Resolves in this order so the
   * site is always correct without a code change:
   * 1. NEXT_PUBLIC_SITE_URL — set this in Vercel once huchu.is-a.dev is live.
   * 2. VERCEL_URL — the deployment's own *.vercel.app URL, set automatically by Vercel.
   * 3. localhost, for `next dev`.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  githubUser: 'huchu19',
  email: 'hussainnaqvi2004@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/smhussainnaqvi/',
}

export const githubUrl = `https://github.com/${site.githubUser}`
