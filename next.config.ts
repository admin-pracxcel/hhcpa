import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      // The WordPress site folded these into the new information architecture.
      // See the design spec, §3.2. All three are permanent.
      {
        source: "/medical-certificate",
        destination: "/online-doctor/medical-certificates/",
        permanent: true,
      },
      { source: "/home", destination: "/", permanent: true },
      // Screening now precedes booking.
      { source: "/book-consultation", destination: "/quiz/", permanent: true },
    ];
  },
};

export default nextConfig;
