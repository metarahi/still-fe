import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "still.dmdev.co.nz", //`${process.env.WORDPRESS_HOSTNAME}`,
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: `${process.env.WORDPRESS_URL}/wp-admin`,
        permanent: true,
      },
      {
        source: "/pages/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/pages/our-team",
        destination: "/our-team",
        permanent: true,
      },
      {
        source: "/pages/still-100",
        destination: "/still-100",
        permanent: true,
      },
      {
        source: "/pages/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
