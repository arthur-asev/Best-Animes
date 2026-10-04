/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',

    async rewrites() {
        return [
            { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
            { source: '/proxy/:path*', destination: `${backendUrl}/proxy/:path*` },
            { source: '/sign', destination: `${backendUrl}/sign` },
            { source: '/stream', destination: `${backendUrl}/stream` },
        ];
    },

    allowedDevOrigins: [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://0.0.0.0:5001',
        'http://192.168.0.20',
        'localhost',
        '192.168.0.20'
    ],

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'cdn.myanimelist.net' },
            { protocol: 'https', hostname: 'cdn.noitatnemucod.net' }
        ],
    },
}

export default nextConfig
