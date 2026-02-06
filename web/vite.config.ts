import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  root: 'src',
  cacheDir: "../node_modules/.vite-react",
  server: {
    port: 4444,
    strictPort: true,
    cors: true,
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
    target: "es2022",
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  }
})
