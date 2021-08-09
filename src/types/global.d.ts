import type { LoadingSystem, MessageSystem, DialogSystem } from './App.vue'

declare global {
  interface Window {
    $loading: LoadingSystem,
    $message: MessageSystem,
    $dialog: DialogSystem
  }
}
