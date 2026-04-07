import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ✅ 【修复空白页核心】强制相对路径，解决本地打开找不到资源
  base: '/',

  server: {
    port: 3000,
    strictPort: false,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },

  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'axios', 
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'html2canvas',
      'react-hot-toast',
      'chart.js',
      'react-chartjs-2',
      'recharts',
      'socket.io-client'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },

  build: {
    target: 'es2020',
    sourcemap: false,
    // ✅ 【修复空白页第二行】指定资源目录，避免路径错乱
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'recharts']
        }
      }
    }
  },

  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
