import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI & animation
          'vendor-motion': ['framer-motion'],
          // Charts (analytics page only)
          'vendor-charts': ['recharts'],
          // Icons
          'vendor-icons': ['lucide-react'],
          // HTTP & forms
          'vendor-axios': ['axios'],
          // Email
          'vendor-email': ['@emailjs/browser'],
          // Toast
          'vendor-toast': ['react-toastify'],
        },
      },
    },
  },
})