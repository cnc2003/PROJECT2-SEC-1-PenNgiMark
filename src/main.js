import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import routers from './router/router.js'
import BaseList from './components/BaseList.vue'

const app = createApp(App)
app.use(routers)

app.component('BaseList', BaseList);

app.mount('#app')


