import { build } from 'velite'

// Run Velite alongside Next (works with both webpack and Turbopack):
// `next dev` watches content/, `next build` does a clean one-shot build.
// NODE_ENV is the reliable signal under Turbopack; argv is the fallback.
const isDev =
  process.env.NODE_ENV === 'development' || process.argv.includes('dev')

if (!process.env.VELITE_STARTED) {
  process.env.VELITE_STARTED = '1'
  await build({ watch: isDev, clean: !isDev })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Project pages used to be hand-written MDX with their own slugs; they now
  // come from GitHub and are named after the repo. Keep the old links alive.
  async redirects() {
    return [
      ['bamboo-investing-marketplace', 'bamboo'],
      ['edunexus-fyp', 'fyp'],
      ['jobhunter-uk-sponsor-finder', 'jobhunter'],
      ['rizqad-eor-platform', 'eor'],
      ['tifltoys-headless-build', 'tifltoysfrontend'],
    ].map(([from, to]) => ({
      source: `/projects/${from}`,
      destination: `/projects/${to}`,
      permanent: true,
    }))
  },
}

export default nextConfig
