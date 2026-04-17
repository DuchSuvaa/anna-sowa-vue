import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/scss/_variables.scss"; @import "@/scss/_mixins.scss";`,
        quietDeps: true
      }
    }
  },
  plugins: [vue()],
  base: './',
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', 
  },
})