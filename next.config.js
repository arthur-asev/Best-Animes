/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/:path*`,
            },

            {
                source: '/proxy/:path*',

                // 2. Para onde o Next.js deve enviar (o 'destination')
                // O :path* garante que o restante da URL, incluindo a query string, seja repassado
                destination: `${process.env.BACKEND_URL || 'http://localhost:5000'}/proxy/:path*`,
            }

        ];
    },
    // Configuração correta para allowedDevOrigins
    allowedDevOrigins: [
        // Formato correto com protocolo + hostname + porta
        'http://localhost:3000',
        'http://localhost:5000',
        'http://0.0.0.0:5001',
        // Também tente sem porta
        'http://192.168.0.20',
        'localhost',
        '192.168.0.20'
    ],

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.myanimelist.net',
            },
            {
                protocol: 'https',
                hostname: 'cdn.noitatnemucod.net',
            }
        ],
    },
}

export default nextConfig
