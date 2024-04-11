import rehypePrism from '@mapbox/rehype-prism'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  async rewrites() {
    return [
      {
        source: '/game-of-life',
        destination: 'https://game-of-life-rho-sandy.vercel.app',
        // destination: 'http://localhost:4200',
      },
      {
        source: '/game-of-life/:path*',
        destination: 'https://game-of-life-rho-sandy.vercel.app/:path*',
        // destination: 'http://localhost:4200/:path*',
      },
      {
        source: '/automata',
        destination: 'https://game-of-life-rho-sandy.vercel.app',
        // destination: 'http://localhost:4200',
      },
      {
        source: '/automata/:path*',
        destination: 'https://game-of-life-rho-sandy.vercel.app/:path*',
        // destination: 'http://localhost:4200/:path*',
      },
      {
        source: '/:path*',
        destination: 'https://game-of-life-rho-sandy.vercel.app/:path*',
        // destination: 'http://localhost:4200/:path*',
      },
    ]
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
