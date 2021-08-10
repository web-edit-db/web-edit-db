import '@fontsource/inter/variable.css'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import store from './store'

registerSW({})

const app = createApp(App)
if (import.meta.env.DEV) app.config.globalProperties.$console = console
app.use(store)
app.use(router)
app.mount('#app')
