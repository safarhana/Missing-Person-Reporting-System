import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.1.11',
    'localhost',
    '127.0.0.1',
    '*.local',
  ],
};

export default nextConfig;
