import type { NextConfig } from 'next';
// @ts-ignore — next-pwa ships without bundled types
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(nextConfig);
