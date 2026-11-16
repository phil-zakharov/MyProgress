import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  sassOptions: {
    additionalData: `@use "@/src/styles/variables.module.scss" as *;`,
    includePaths: [path.join(__dirname, 'app')],
  },
};

export default nextConfig;
