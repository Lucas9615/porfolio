import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Requis pour l'export statique avec export: 'static'
  },
  // Configuration pour supporter les fichiers Markdown, les images et react-pdf
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    
    // Configuration pour react-pdf
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    }
    
    return config
  },
}

export default nextConfig
