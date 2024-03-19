import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import routers from './router/router.js'
import Notification from './components/Notification.vue'

const app = createApp(App)
app.use(routers)

app.component('Notification', Notification);

app.mount('#app')


