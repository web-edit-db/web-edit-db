import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./app/vitest.setup.ts'],
  },
  define: {
    __DATE__: JSON.stringify(new Date().toISOString()),
  },
})
