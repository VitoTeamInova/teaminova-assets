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
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    // Use esbuild (default) and drop console/debugger in production-like builds
    esbuild: {
      drop: ["console", "debugger"],
    },
    rollupOptions: {
      output: {
        // Use function form so Vite can apply internal optimizations
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // Rich text editor
          if (id.includes('react-quill')) return 'editor';

          // Supabase SDK
          if (id.includes('@supabase')) return 'supabase';

          // React Query
          if (id.includes('@tanstack/react-query')) return 'query';

          // Router
          if (id.includes('react-router-dom')) return 'router';

          // Charts
          if (id.includes('recharts')) return 'charts';

          // Icons
          if (id.includes('lucide-react')) return 'icons';

          // Radix UI groupings (avoid regex to keep TS happy)
          const radixDialogPkgs = [
            '@radix-ui/react-dialog',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-hover-card',
          ];
          if (radixDialogPkgs.some(p => id.includes(p))) return 'radix-dialog';

          const radixFormPkgs = [
            '@radix-ui/react-select',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch',
            '@radix-ui/react-slider',
            '@radix-ui/react-tabs',
          ];
          if (radixFormPkgs.some(p => id.includes(p))) return 'radix-forms';

          const radixNavPkgs = [
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-accordion',
            '@radix-ui/react-collapsible',
          ];
          if (radixNavPkgs.some(p => id.includes(p))) return 'radix-nav';

          const radixCorePkgs = [
            '@radix-ui/react-slot',
            '@radix-ui/react-primitive',
            '@radix-ui/react-portal',
            '@radix-ui/react-focus-scope',
            '@radix-ui/react-dismissable-layer',
          ];
          if (radixCorePkgs.some(p => id.includes(p))) return 'radix-core';

          // Core React libs
          if (id.includes('react-dom') || id.includes('/react/')) return 'vendor';

          // Fallback vendor bucket
          return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));