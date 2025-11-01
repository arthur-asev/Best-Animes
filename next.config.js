/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,  
    allowedDevOrigins: ['http://localhost:5000'],
    images: {
    // This is the modern way to configure external domains starting from Next.js 13
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
       
      },
    ],
  },
}
export default nextConfig