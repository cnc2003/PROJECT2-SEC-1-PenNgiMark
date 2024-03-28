import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import routers from './router/router.js'
import ModalHistory from './components/ModalHistory.vue'
import ModalConfirm from './components/ModalConfirm.vue'
import Analysis from './components/Analysis.vue'
import Promotion from './components/Promotion.vue'

const app = createApp(App)
app.use(routers)

app.component('Analysis', Analysis)
app.component('Promotion', Promotion)
app.component('ModalHistory', ModalHistory )
app.component('ModalConfirm', ModalConfirm )
app.mount('#app')


