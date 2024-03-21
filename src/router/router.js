import { createRouter, createWebHistory } from "vue-router"
import AddMenu from "../components/page/Addmenu.vue"
import Listorder from "../components/page/Listorder.vue"
import Management from "../components/page/Management.vue"

const routes = [
  {
    path: "/",
    component: AddMenu
  },
  {
    path: "/list-order",
    component: Listorder,
  },
  {
    path: "/manegement",
    component: Management,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
