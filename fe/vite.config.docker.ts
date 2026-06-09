import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1600,
  },
  server: {
    host: '0.0.0.0',
    port: 80,
  }
})
