import type { LoadingSystem, MessageSystem } from './App.vue'

declare global {
  interface Window {
    $loading: LoadingSystem,
    $message: MessageSystem
  }
}
