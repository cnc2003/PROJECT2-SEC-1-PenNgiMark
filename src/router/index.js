import { createRouter, createWebHistory } from 'vue-router'
import AddMenu from '../components/Addmenu.vue'
import Listorder from '../components/Listorder.vue'
import Manegement from '../components/Manegement.vue'


const routes = [
    {
        path: '/add-Menu',
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