import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import routers from './router/index.js'

const app = createApp(App)
app.use(routers)
app.mount('#app')
