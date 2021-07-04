import '@fontsource/inter/variable.css'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import store from './store'

registerSW({})

createApp(App).use(store).use(router).mount('#app')
