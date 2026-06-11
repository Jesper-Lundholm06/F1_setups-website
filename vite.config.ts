import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // PDFs can be large; raise the inline asset limit to 0 so they are always
  // emitted as separate files with hashed names (never base64-inlined).
  build: {
    assetsInlineLimit: 0,
  },
})
