/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig = {
  /* config options here */
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
}

const withPWAConfig = withPWA({ dest: 'public' })
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withAnalyzer(withPWAConfig(nextConfig))
