import process from "node:process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Defensive proxy target resolution
const getProxyTarget = () => {
  const envProxy = process.env.VITE_DEV_API_PROXY;
  const fallback = "http://localhost:5000";

  if (!envProxy || envProxy.trim() === "") {
    return fallback;
  }

  try {
    // Basic validation to ensure it's a valid URL string for Vite's proxy
    new URL(envProxy.trim());
    return envProxy.trim();
  } catch {
    console.warn(
      `[Vite] Warning: Invalid VITE_DEV_API_PROXY ("${envProxy}"). Using fallback: ${fallback}`,
    );
    return fallback;
  }
};

const proxyTarget = getProxyTarget();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
      "/api/v1": {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
