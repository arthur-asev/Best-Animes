/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Configuração correta para allowedDevOrigins
    allowedDevOrigins: [
        // Formato correto com protocolo + hostname + porta
        'http://localhost:3000',
        'http://localhost:5000', 
        'http://192.168.0.20:3000',
        'http://192.168.0.20:3001',
        
        // Também tente sem porta
        'http://192.168.0.20',
        'localhost',
        '192.168.0.20'
    ],
    
    // Configuração alternativa experimental
    experimental: {
        allowedDevOrigins: ['192.168.0.20', 'localhost']
    },
    
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.myanimelist.net',
            },
            {
                protocol: 'https',
                hostname: 'animefire.plus',
            }
        ],
    },
}

export default nextConfig