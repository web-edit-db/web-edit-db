import vue from '@vitejs/plugin-vue'
import path from 'path'
import copy from 'rollup-plugin-copy'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    copy({
      targets: [
        { src: 'node_modules/sql.js/dist/sql-wasm.wasm', dest: 'public/js' }
      ],
      hook: 'buildStart'
    }),
    visualizer()
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  }
})
