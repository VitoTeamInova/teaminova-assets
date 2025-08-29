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
          // Core React libraries
          vendor: ['react', 'react-dom'],
          
          // Router chunk
          router: ['react-router-dom'],
          
          // Query and state management
          query: ['@tanstack/react-query'],
          
          // Form libraries
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Date utilities
          dates: ['date-fns', 'react-day-picker'],
          
          // Radix UI Core components
          'radix-core': [
            '@radix-ui/react-slot',
            '@radix-ui/react-primitive',
            '@radix-ui/react-portal',
            '@radix-ui/react-focus-scope',
            '@radix-ui/react-dismissable-layer'
          ],
          
          // Radix UI Dialog components
          'radix-dialog': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-hover-card'
          ],
          
          // Radix UI Form components
          'radix-forms': [
            '@radix-ui/react-select',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch',
            '@radix-ui/react-slider',
            '@radix-ui/react-tabs'
          ],
          
          // Radix UI Navigation
          'radix-nav': [
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-accordion',
            '@radix-ui/react-collapsible'
          ],
          
          // Charts and visualization
          charts: ['recharts'],
          
          // Rich text editor
          editor: ['react-quill'],
          
          // Backend services
          supabase: ['@supabase/supabase-js'],
          
          // Icons and styling
          icons: ['lucide-react'],
          
          // Utility libraries
          utils: [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'cmdk',
            'sonner',
            'vaul',
            'next-themes'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
}));