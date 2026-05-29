import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// FIX: compatibilidad con librerías legacy (sockjs / stomp)
export default defineConfig({
  plugins: [react()],

  define: {
    global: 'window'
  },

  optimizeDeps: {
    include: [
      'sockjs-client',
      '@stomp/stompjs'
    ]
  }
})