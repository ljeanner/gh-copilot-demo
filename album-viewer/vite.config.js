import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001,
    proxy: {
      '/albums': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
