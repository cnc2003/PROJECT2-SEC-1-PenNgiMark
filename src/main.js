import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import routers from './router/router.js'
import ModalHistory from './components/ModalHistory.vue'
import ModalComfirm from './components/ModalConfirm.vue'

const app = createApp(App)
app.use(routers)

app.component('ModalHistory', ModalHistory ) ;
app.component('ModalComfirm',ModalComfirm) ;

app.mount('#app')


