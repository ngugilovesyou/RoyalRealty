/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
    remotePatterns: [
      // Unsplash images (common for placeholder/demo images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/photo-*/**', 
      },
      
      // Your production domain
      {
        protocol: 'https',
        hostname: 'royalrealty.co.ke',
        port: '',
        pathname: '/static/uploads/**', // Only allow uploads directory
      },
      
      // Local development
      ...(process.env.NODE_ENV === 'development' ? [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5000',
          pathname: '/static/uploads/**',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '5000',
          pathname: '/static/uploads/**',
        },
      ] : []),
    ]
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://royalrealtyapi.onrender.com/:path*", 
      },
    ];
  },
};

module.exports = nextConfig;