/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    API_KEY: process.env.API_KEY,
  },
  images: {
    domains: [
      "placeimg.com",
      "www.infomoney.com.br",
      "res.cloudinary.com",
      "ipfs.io",
      "shizmo.infura-ipfs.io",
      "cdn.pixabay.com",
      "www.freeiconspng.com",
      "www.freepnglogos.com",
      "www.linkpicture.com",
      "roulette.cryptogameplace.com",
    ],
  },

  async headers() {
    //     const ContentSecurityPolicy = `
    //   default-src 'self';
    //   script-src 'self';
    //   child-src 'self';
    //   font-src 'self' 'https://fonts.googleapis.com';
    // `;
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
