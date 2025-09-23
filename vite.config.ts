import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: true,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true,
    }),
  ],
  base : '/emba2501/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'docs',
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => {
          // Remove underscore prefix from chunk names
          const name = chunkInfo.name?.replace(/^_/, '') || 'chunk';
          return `js/${name}-[hash].js`;
        },
        entryFileNames: (entryInfo) => {
          // Remove underscore prefix from entry names
          const name = entryInfo.name?.replace(/^_/, '') || 'entry';
          return `js/${name}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          // Remove underscore prefix from asset names
          const name = assetInfo.name?.replace(/^_/, '') || 'asset';
          return `assets/${name}-[hash].[ext]`;
        },
      },
    },
  },
})
