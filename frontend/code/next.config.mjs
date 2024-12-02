/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath : "/faturamento/calculadora",
    assetPrefix : "/faturamento/calculadora",
    env: {
      NEXT_PUBLIC_ASSET_PREFIX: '/faturamento/calculadora', // make assetPrefix available as an environment variable
    },
};

export default nextConfig;
