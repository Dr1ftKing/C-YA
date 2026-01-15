import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'https://cya-backend-production.up.railway.app',
        changeOrigin: true,
        secure: true
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['.railway.app', 'localhost'],
    proxy: {
      '/api': {
        target: 'https://cya-backend-production.up.railway.app',
        changeOrigin: true,
        secure: true
      }
    }
  }
})