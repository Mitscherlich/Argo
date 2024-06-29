import { resolve } from 'path'
import { defineConfig } from 'vite'
import autoImport from 'unplugin-auto-import/vite'
import react from '@vitejs/plugin-react'

const r = (...path) => resolve(__dirname, ...path)

const prefix = 'monaco-editor/esm/vs'

export default defineConfig({
  root: r('./client'),
  resolve: {
    alias: {
      '~bootstrap': r('node_modules/bootstrap'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/proxy': {
        target: 'http://127.0.0.1:3000/',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    autoImport({
      imports: [
        'react',
        'ahooks',
      ],
      dts: true,
    }),
  ],
  optimizeDeps: {
    include: [
      `${prefix}/language/json/json.worker`,
      `${prefix}/language/css/css.worker`,
      `${prefix}/language/html/html.worker`,
      `${prefix}/language/typescript/ts.worker`,
      `${prefix}/editor/editor.worker`,
      `${prefix}/editor/common/services/editorSimpleWorker`,
    ],
  },
})
