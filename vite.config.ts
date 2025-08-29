import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
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
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for core React libraries
          vendor: ['react', 'react-dom'],
          // UI chunk for heavy UI libraries
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-dropdown-menu'],
          // Rich text editor chunk
          editor: ['react-quill'],
          // Supabase chunk
          supabase: ['@supabase/supabase-js'],
          // Query chunk
          query: ['@tanstack/react-query'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
}));