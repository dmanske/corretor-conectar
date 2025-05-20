import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@landingpage": path.resolve(__dirname, "./landingpage/src"),
      "@landingpage/components": path.resolve(__dirname, "./landingpage/src/components"),
      "@landingpage/pages": path.resolve(__dirname, "./landingpage/src/pages"),
      "@landingpage/hooks": path.resolve(__dirname, "./landingpage/src/hooks"),
      "@landingpage/lib": path.resolve(__dirname, "./landingpage/src/lib"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
}));
