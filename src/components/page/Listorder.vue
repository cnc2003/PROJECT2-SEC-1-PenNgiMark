<script setup>
import { ref, onMounted } from "vue"
import {
    getOrderlist,
    DeleteMenuInOrder,
    DeleteOrder,
} from "../../lib/fetch.js"
import ModalHistory from "../ModalHistory.vue"
import ModalConfirm from "../ModalConfirm.vue";

// defind variable
let datas = ref([])
let showModalHistory = ref(false)
let showModalConfirem = ref(false)
let History_data = ref([])

// ReloadFetch
async function fetchData() {
    datas.value = await getOrderlist()
    console.log(datas.value)
}

onMounted(fetchData)

function serveOrder(order) {
    const order_ID = order.order_id
    let restMenu = {}

    //History modal
    const currentDate = new Date()
    const serveTime = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
    const SelectedMenusWithTime = order.orders
        .filter((menu) => menu.selected)
        .map((menu) => ({ ...menu, Time: serveTime ,order_id:order_ID}))
    History_data.value.push(...SelectedMenusWithTime)
    console.log(SelectedMenusWithTime)

    // filter MenusNotSelected
    const notSelectedMenus = order.orders.filter((menu) => !menu.selected)

    if (notSelectedMenus.length === 0) {
        console.log("restMenu :", notSelectedMenus.length)
        DeleteOrder(order.id).then(() => {
            //เปลี่ยน data ในdatasให้ลบ order ที่ select ออก (fontend)
            datas.value = datas.value.filter((item) => item.id !== order.id)
        })
    } else {
        restMenu = {
            order_id: order_ID,
            orders: notSelectedMenus,
            id: order.id,
        }
        console.log(notSelectedMenus, order.id)
        console.log("restMenu :", restMenu)
        DeleteMenuInOrder(restMenu, order.id).then(() => {
            const updatedOrderIndex = datas.value.findIndex(
                (item) => item.id === order.id
            )
            //เปลี่ยน data ใน datas ให้ลบ menu ที่selectออก และเอาmenuที่เหลือใส่แทน (fontend)
            if (updatedOrderIndex !== -1) {
                console.log(updatedOrderIndex)
                datas.value[updatedOrderIndex].orders = notSelectedMenus
            }
        })
    }
}

function tuggleSelection(order_menu) {
    // check menu-Selecked
    order_menu.selected = !order_menu.selected
}
</script>
<template>
    <button @click="showModalHistory = true" class="fixed border-2 w-1/6">
        History
    </button>

    <!-- ModalHistory -->
    <div v-show="showModalHistory">
        <ModalHistory :data="History_data" @close="showModalHistory = false"/>     
    </div>

    <!-- ModalComfirm -->
    <div v-show="showModalConfirem">
        <ModalConfirm @close="showModalHistory = false"/>    
    </div>
    
    <!-- main -->
    <div>
        <div v-for="(order, index) in datas" :key="index">
            <div
                class="w-full flex justify-between border-2 rounded-md p-4 bg-slate-100 shadow-lg mt-12 ml-4"
            >
                <div class="flex flex-col justify-center items-center w-1/4">
                    <p class="font-bold">Order_ID</p>
                    <!-- ดึง ordermenu มาแสดง -->
                    <div>{{ order.order_id }}</div>
                </div>
                <div class="flex w-full">
                    <div class="flex flex-wrap">
                        <div
                            v-for="(order_menu, menuIndex) in order.orders"
                            :key="menuIndex"
                        >
                            <div
                                class="p-4 m-2 h-40 w-48 rounded-lg"
                                @click="tuggleSelection(order_menu)"
                                :style="{
                                    backgroundColor: order_menu.selected
                                        ? '#E6D97E'
                                        : '#D5DDD8',
                                }"
                                :class="
                                    order_menu.selected
                                        ? 'border-[#E5C227] border-4'
                                        : ''
                                "
                            >
                                <div>Menu : {{ order_menu.menu_name }}</div>
                                <div>quantity : {{ order_menu.quantity }}</div>
                                <div>details : {{ order_menu.details }}</div>
                                <input
                                    type="checkbox"
                                    v-model="order_menu.selected"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <button
                    class="bg-[#00E3FE] w-1/4 rounded-lg"
                    @click="serveOrder(order)"
                >
                    Serve
                </button> -->

                <button
                    class="bg-[#00E3FE] w-1/4 rounded-lg"
                    @click="showModalConfirem = true"
                >
                    Serve
                </button>
            </div>
        </div>
    </div>
</template>
<style scoped></style>../ModalHistory.vue/index.js
