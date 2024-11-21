/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath : "/calculadora",
    assetPrefix : "/calculadora",
    env: {
      NEXT_PUBLIC_ASSET_PREFIX: '/calculadora', // make assetPrefix available as an environment variable
    },
};

export default nextConfig;
