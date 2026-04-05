import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

function getSupabaseOrigins() {
  const fallbackOrigins = ["https://*.supabase.co", "wss://*.supabase.co"];
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!rawUrl) {
    return fallbackOrigins;
  }

  try {
    const origin = new URL(rawUrl).origin;
    return [origin, origin.replace(/^http/, "ws"), ...fallbackOrigins];
  } catch {
    return fallbackOrigins;
  }
}

const connectSrc = [
  "'self'",
  "https://vercel.live",
  "wss://vercel.live",
  ...getSupabaseOrigins(),
  ...(isDevelopment
    ? [
        "http://127.0.0.1:3000",
        "ws://127.0.0.1:3000",
        "http://127.0.0.1:3100",
        "ws://127.0.0.1:3100",
        "http://localhost:3000",
        "ws://localhost:3000",
        "http://localhost:3100",
        "ws://localhost:3100",
      ]
    : []),
];

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDevelopment ? ["'unsafe-eval'"] : []),
  "https://vercel.live",
];

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src ${connectSrc.join(" ")}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy.replace(/\s{2,}/g, " "),
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-site",
  },
  ...(isDevelopment
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/stats",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
