import type { LoadingSystem } from './App.vue'

declare global {
  interface Window {
    $loading: LoadingSystem
  }
}
