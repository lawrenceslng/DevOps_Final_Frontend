// next.config.js
/** @type {import('next').NextConfig} */
const isExport = process.env.EXPORT_BUILD === 'true';

const nextConfig = {
    ...(isExport && { output: 'export' }),
  };
  
  module.exports = nextConfig;
  