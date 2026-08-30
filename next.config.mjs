import rehypePrism from '@mapbox/rehype-prism'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/game-of-life',
          destination: 'https://game-of-life-rho-sandy.vercel.app',
        },
        {
          source: '/game-of-life/:path*',
          destination: 'https://game-of-life-rho-sandy.vercel.app/:path*',
        },
        {
          source: '/automata',
          destination: 'https://game-of-life-rho-sandy.vercel.app',
        },
        {
          source: '/automata/:path*',
          destination: 'https://game-of-life-rho-sandy.vercel.app/:path*',
        },
      ],
      // Catch-all only applies when nothing else — no page, no API/App
      // Router route handler — matches. A plain array here previously
      // intercepted requests to app/api/auth/[...all], silently breaking
      // sign-in.
      fallback: [
        {
          source: '/:path*',
          destination: 'https://game-of-life-rho-sandy.vercel.app/:path*',
        },
      ],
    }
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)
