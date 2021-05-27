import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './assets/tailwind.css'
import '@fontsource/inter/variable.css'
import router from './router'
import initSqlJs from 'sql.js'

const app = createApp(App)
app.use(router)
initSqlJs().then((SQL) => {
  app.provide('sqlite3', SQL)
  app.mount('#app')
})
