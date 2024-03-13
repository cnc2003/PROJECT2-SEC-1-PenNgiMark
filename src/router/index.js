import { createRouter, createWebHistory } from 'vue-router'
import AddMenu from '../components/page/Addmenu.vue'
import Listorder from '../components/page/Listorder.vue'
import Manegement from '../components/page/Manegement.vue'


const routes = [
    {
        path: '/',
        component: AddMenu
    },
    {
        path: '/list-order',
        component: Listorder
    },
    {
        path: '/manegement',
        component: Manegement
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
  });
    


export default router