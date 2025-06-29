import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    server: {
      host: "::",
      port: 8000,
      ...(isDevelopment && {
        headers: {
          // Allow localhost connections in development
          "Content-Security-Policy":
            "connect-src 'self' http://localhost:5000 https://api.codereviewagent.com wss: https:",
        },
        // Proxy API requests to backend in development
        proxy: {
          "/api": {
            target: "http://localhost:5000",
            changeOrigin: true,
            secure: false,
          },
        },
      }),
    },
    plugins: [react(), isDevelopment && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
