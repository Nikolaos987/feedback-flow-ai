// import type { NextConfig } from "next";
// 
// const nextConfig: NextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };
// 
// export default nextConfig;

const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

