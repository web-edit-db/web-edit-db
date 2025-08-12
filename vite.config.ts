import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import colors from 'tailwindcss/colors'
import { reactRouter } from '@react-router/dev/vite'
import path from 'path'
import { viteStaticCopy} from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __DATE__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    tailwindcss(),
    // Only include React Router plugin when not running Storybook
    ...(process.env.STORYBOOK !== 'true'
      ? [
          reactRouter(),
          VitePWA({
            registerType: 'autoUpdate',
            workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            },
            includeAssets: ['favicon.ico', 'img/icons/*.png', 'img/icons/*.svg'],
            manifest: {
              name: 'Web Edit DB',
              short_name: 'WebEditDB',
              description: 'A web-based database editor',
              theme_color: colors.purple[600],
              background_color: '#ffffff',
              display: 'browser',
              icons: [
                {
                  src: './img/icons/android-chrome-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                },
                {
                  src: './img/icons/android-chrome-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                },
                {
                  src: './img/icons/android-chrome-maskable-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'maskable',
                },
                {
                  src: './img/icons/android-chrome-maskable-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'maskable',
                },
                {
                  src: './img/icons/apple-touch-icon-60x60.png',
                  sizes: '60x60',
                  type: 'image/png',
                },
                {
                  src: './img/icons/apple-touch-icon-76x76.png',
                  sizes: '76x76',
                  type: 'image/png',
                },
                {
                  src: './img/icons/apple-touch-icon-120x120.png',
                  sizes: '120x120',
                  type: 'image/png',
                },
                {
                  src: './img/icons/apple-touch-icon-152x152.png',
                  sizes: '152x152',
                  type: 'image/png',
                },
                {
                  src: './img/icons/apple-touch-icon-180x180.png',
                  sizes: '180x180',
                  type: 'image/png',
                },
                {
                  src: './img/icons/apple-touch-icon.png',
                  sizes: '180x180',
                  type: 'image/png',
                },
                {
                  src: './img/icons/favicon-16x16.png',
                  sizes: '16x16',
                  type: 'image/png',
                },
                {
                  src: './img/icons/favicon-32x32.png',
                  sizes: '32x32',
                  type: 'image/png',
                },
                {
                  src: './img/icons/msapplication-icon-144x144.png',
                  sizes: '144x144',
                  type: 'image/png',
                },
                {
                  src: './img/icons/mstile-150x150.png',
                  sizes: '150x150',
                  type: 'image/png',
                },
              ],
            },
          }),
        ]
      : []),
      viteStaticCopy({
        targets: [
          {
            src: './node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.wasm',
            dest: './',
            rename: 'sqlite3.wasm',
          }
        ]
      })
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm'],
  }
})
