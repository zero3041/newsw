/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui'],
    experimental: {
        serverActions: {
            bodySizeLimit: '8mb',
        },
    },
}

export default nextConfig
