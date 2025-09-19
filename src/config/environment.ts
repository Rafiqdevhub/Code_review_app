export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  api: {
    baseUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    debug: import.meta.env.VITE_API_DEBUG === "true",
  },

  rateLimit: {
    development: {
      guest: {
        requests: 999999,
        message: "Development Mode - Unlimited Requests",
      },
      authenticated: {
        requests: 999999,
        message: "Development Mode - Unlimited Requests",
      },
    },
    production: {
      guest: {
        requests: 10,
        message: "Guest user limits",
      },
      authenticated: {
        requests: 100,
        message: "Authenticated user limits",
      },
    },
  },

  // Feature Flags
  features: {
    enableRateLimiting: !import.meta.env.DEV, // Disabled in development
    enableAnalytics: import.meta.env.PROD, // Only in production
    enableDebugLogs: import.meta.env.DEV, // Only in development
  },
} as const;

export const getRateLimitConfig = (isAuthenticated: boolean) => {
  const config = ENV.isDevelopment
    ? ENV.rateLimit.development
    : ENV.rateLimit.production;

  return isAuthenticated ? config.authenticated : config.guest;
};

export const shouldSkipRateLimit = () => {
  return ENV.isDevelopment || !ENV.features.enableRateLimiting;
};

export const log = {
  dev: (...args: unknown[]) => {
    if (ENV.features.enableDebugLogs) {
      console.log("🚀 [DEV]", ...args);
    }
  },
  info: (...args: unknown[]) => console.log("ℹ️ [INFO]", ...args),
  warn: (...args: unknown[]) => console.warn("⚠️ [WARN]", ...args),
  error: (...args: unknown[]) => console.error("❌ [ERROR]", ...args),
};
