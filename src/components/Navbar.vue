<script setup>
import { ref } from "vue"
import JsxIconBase from "./JsxIconBase.vue"

const li = ref(
    "rounded-md w-full p-4 text-gray-500  text-lg font-semibold flex flex-row items-center gap-2"
)
const action = ref(
    "transition ease-in-out duration-300 bg-white text-gray-800 scale-[103%] shadow-md "
)
const svg = ref("size-8")
const isLoading = ref(false)
import routers from "../router/router.js"
function loading() {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
    }, 2000)
}

routers.beforeEach((to, from, next) => {
    loading()
    setTimeout(() => {
        next()
    }, 2000)
    // next()
})
</script>

<template>
    <div v-show="isLoading" 
    class="loader">
            <img src="/public/loader/Coffee.gif" alt="loader" class="loader-bg"/>
            <h1 class="loader-text font-semibold">Loading . . .</h1>
    </div>
    <div
        class="flex flex-col p-4 gap-2 w-full h-screen bg-base-200 text-base-content"
    >
        <!-- Sidebar content here -->
        <div class="avatar">
            <img src="/public/logo/CoolCup Café V1.png" alt="CoolCup Café"
            class="rounded-md">
        </div>
        <router-link
            to="/"
            class="hover:bg-white hover:text-gray-800 hover:shadow-sm"
            :class="li"
            :active-class="action"
            :hover="action"
        >
            <JsxIconBase iconName="AddMenu" :w="10" :h="10" />
            <h1>Order menu</h1>
        </router-link>
        <router-link
            to="/list-order"
            class="hover:bg-gray-200 hover:text-gray-800 hover:shadow-sm"
            :class="li"
            :active-class="action"
        >
            <JsxIconBase iconName="Copy" :w="10" :h="10" />
            <h1>Listorder</h1>
        </router-link>
        <router-link
            to="/manegement"
            class="hover:bg-gray-200 hover:text-gray-800 hover:shadow-sm"
            :class="li"
            :active-class="action"
        >
            <JsxIconBase iconName="Manage" :w="10" :h="10" />
            <h1>Management</h1>
        </router-link>
    </div>
</template>
