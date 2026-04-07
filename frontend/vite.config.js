import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ✅ 部署Vercel必须用绝对路径 /，解决线上404空白
  base: '/',
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    // ✅ 本地开发用的proxy代理，部署到Vercel必须注释（不删原代码，本地可恢复）
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path
    //   }
    // }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom'
      // 你原文件里的其他依赖项，直接保留在这里即可
    ]
  }
})
