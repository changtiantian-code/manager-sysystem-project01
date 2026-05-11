import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import importToCDN from 'vite-plugin-cdn-import';

const pathSrc = path.resolve(__dirname, 'src');

export default defineConfig({
  resolve: {
    alias: {
      '@': `${pathSrc}`
    },
  },
  base: "./",
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()]
    }),
    importToCDN({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: 'https://unpkg.com/vue@3.5.13/dist/vue.global.prod.js',
        },
        {
          name: 'vue-router',
          var: 'VueRouter',
          path: 'https://unpkg.com/vue-router@4.4.5/dist/vue-router.global.prod.js',
        },
        {
          name: 'axios',
          var: 'axios',
          path: 'https://unpkg.com/axios@1.7.9/dist/axios.min.js',
        },
        {
          name: 'echarts',
          var: 'echarts',
          path: 'https://unpkg.com/echarts@6.0.0/dist/echarts.min.js',
        },
        {
          name: 'element-plus',
          var: 'ElementPlus',
          path: 'https://unpkg.com/element-plus@2.8.8/dist/index.full.min.js',
          css: 'https://unpkg.com/element-plus@2.8.8/dist/index.css',
        },
      ],
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      external: ['vue', 'vue-router', 'axios', 'echarts', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          axios: 'axios',
          echarts: 'echarts',
          'element-plus': 'ElementPlus',
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('element-plus')) {
              return 'element-plus';
            }
            if (id.includes('echarts')) {
              return 'echarts';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    }
  },
  esbuild: {
    pure: ['console.log', 'debugger'],
  },
  optimizeDeps: {
    include: ["axios"]
  }
})
