/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'

const nextConfig = {
  /* config options here */
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
}

// export default nextConfig
export default withPWA({ dest: 'public' })(nextConfig)
