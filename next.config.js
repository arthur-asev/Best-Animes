/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    async rewrites() {
        return [
            {
                source: '/api/anime/:path*',

                // ... envie para o meu backend (mantendo o resto do path)
                destination: 'http://0.0.0.0:5001/anime/zoro/:path*',
            },
           {
                // SOURCE: Captura o ID do segmento de caminho
                source: '/api/anime/info:id', 
                
                // DESTINATION: Usa o ID capturado (:id) e o insere no formato de query parameter (?id=)
                destination: 'http://0.0.0.0:5001/anime/zoro/info?id=:id',
            },
            {
                // SOURCE: Captura o ID do segmento de caminho
                source: '/api/anime/watch/:id', 
                
                // DESTINATION: Usa o ID capturado (:id) e o insere no formato de query parameter (?id=)
                destination: 'http://0.0.0.0:5001/anime/zoro/watch/:id',
            },
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