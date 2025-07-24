/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        // Add this new pattern for your S3 bucket
        protocol: 'https',
        hostname: 'wanzami-media-storage-2502.s3.us-east-1.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
