/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   webpack(config) {
//     config.experiments = { ...config.experiments, topLevelAwait: true };
//     return config;
//   },
// };
// next.config.json
const nextConfig = {
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
      ...config.experiments,
      topLevelAwait: true,
    };

    return config;
  },
};
module.exports = nextConfig;
