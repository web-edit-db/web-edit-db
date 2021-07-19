/* eslint-disable */
import { LoadingSystem } from './App.vue'


declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@shopify/draggable/lib/sortable' {
  import { Sortable } from '@shopify/draggable'
  export default Sortable
}



declare global {
  interface Window {
    $loading: LoadingSystem
  }
}
