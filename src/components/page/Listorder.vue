<script setup>
import { ref, onMounted } from "vue"
import {
    DeleteMenuInOrder,
    DeleteOrder,
    PostHistoryOrder,
    getList
} from "../../lib/fetch.js"
import ModalHistory from "../ModalHistory.vue"

// define variable
let orderListBefore = ref([])
let showModalHistory = ref(false)
let showModalConfirm = ref(false)
let confirmStatus = ref(false)
let ReloadHistory = ref(false)

async function fetchData() {
    orderListBefore.value = await getList("OrderLists")
    console.log(orderListBefore.value)
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
        .map((menu) => ({ ...menu, Time: serveTime, order_id: order_ID }))
    PostHistoryOrder(...SelectedMenusWithTime,"HistoryOrder")
    // console.log(...SelectedMenusWithTime)

    // filter MenusNotSelected
    const notSelectedMenus = order.orders.filter((menu) => !menu.selected)

    if (notSelectedMenus.length === 0) {
        console.log("restMenu :", notSelectedMenus.length)
        DeleteOrder(order.id).then(() => {
            //เปลี่ยน data ในorderListBeforeให้ลบ order ที่ select ออก (fontend)
            orderListBefore.value = orderListBefore.value.filter(
                (item) => item.id !== order.id
            )
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
            const updatedOrderIndex = orderListBefore.value.findIndex(
                (item) => item.id === order.id
            )
            //เปลี่ยน data ใน orderListBefore ให้ลบ menu ที่selectออก และเอาmenuที่เหลือใส่แทน (fontend)
            if (updatedOrderIndex !== -1) {
                console.log(updatedOrderIndex)
                orderListBefore.value[updatedOrderIndex].orders =
                    notSelectedMenus
            }
        })
    }
}

function tuggleSelection(order_menu) {
    // check menu-Selecked
    order_menu.selected = !order_menu.selected
}

function opernModalConfirm(order) {
    showModalConfirm.value = true
    console.log(order)

    if (confirmStatus.value === false) {
        // รอจนกว่าค่า confirm จะเป็น true
        const interval = setInterval(() => {
            if (confirmStatus.value === true) {
                clearInterval(interval) // stop setInterval
                serveOrder(order)
                confirmStatus.value = false 
                console.log(confirmStatus.value)
            }
        }, 100) // ตรวจสอบทุก 100 milliseconds
    }
}

</script>
<template>
    <button @click="showModalHistory = true ,ReloadHistory = !ReloadHistory" class="fixed border-2 w-1/6">
        History
    </button>

    <!-- ModalHistory -->
    <div v-show="showModalHistory">
        <ModalHistory :data="ReloadHistory" @close="showModalHistory = false" />
    </div>

    <!-- ModalComfirm -->
    <div v-show="showModalConfirm">
        <div
            class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
        >
            <div class="w-lvw h-lvh bg-black bg-opacity-50"></div>
            <div
                class="fixed w-1/4 h-1/4 bg-white rounded-xl flex flex-col items-center indicator"
            >
                <div class="flex flex-col">
                    <div class="text-xl border-b-4 mt-4 mb-3 flex justify-center">Confirm Menu</div>
                    <!-- modal content -->
                    <div class="mb-12 mt-10">Do you confirm to serve Menu?</div>
                    <!-- button -->
                    <div
                    
                    class="flex justify-center">
                        <button
                            class="bg-red-500 rounded-lg btn btn-md mr-10"
                            @click="showModalConfirm = false"
                        >
                            cancle
                        </button>
                        <button
                            class="bg-sky-500 rounded-lg btn btn-md"
                            @click="
                                ;(showModalConfirm = false),
                                    (confirmStatus = true)
                            "
                        >
                            serve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- main -->
    <div>
        <div v-for="(order, index) in orderListBefore" :key="index">
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
                    @click="opernModalConfirm(order)"
                >
                    Serve
                </button> -->
                <button
    class="bg-[#00E3FE] w-1/4 rounded-lg"
    @click="opernModalConfirm(order)"
    :disabled="order.orders.filter(menu => menu.selected).length === 0"
    :class="{ 'bg-gray-300': order.orders.filter(menu => menu.selected).length === 0 }"
    title="Prease select a menu"
>
    Serve
</button>

                
            </div>
        </div>
    </div>
</template>
<style scoped></style>
