import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import routers from './router/index.js'
import BaseList from './components/BaseList.vue'
import orderlist from '../public/data/orderlist.json'
import menulist from '../public/data/menulist.json'
import sales_data from '../public/data/sales_data.json'

const app = createApp(App)
app.use(routers)

app.component('BaseList', BaseList);

app.mount('#app')


