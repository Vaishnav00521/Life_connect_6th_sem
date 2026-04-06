import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // ──── Production Build Optimizations ────
  build: {
    // Target modern browsers for smaller bundle
    target: 'es2020',

    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },

    // Enable source maps for debugging prod errors (optional — remove if not needed)
    sourcemap: false,

    // Increase chunk size warning limit (Tailwind + animations are big)
    chunkSizeWarningLimit: 600,
  },

  // ──── Drop console.log in production builds ────
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },

  // ──── Dev server proxy (useful for local development) ────
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws-lifeconnect': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
}))
