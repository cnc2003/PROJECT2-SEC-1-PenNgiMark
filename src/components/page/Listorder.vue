<script setup>
import { ref, onMounted } from "vue"
import {
    DeleteMenuInOrder,
    DeleteOrder,
    AddHistoryOrder,
    getList,
} from "../../lib/fetch.js"
import ModalHistory from "../ModalHistory.vue"
import ModalConfirm from "../ModalConfirm.vue"

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
    const order_Number = order.order_number
    let restMenu = {}

    //History modal
    const currentDate = new Date()
    const serveTime = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
    const SelectedMenusWithTime = order.orders
        .filter((menu) => menu.selected)
        .map((menu) => ({
            ...menu,
            Time: serveTime,
            order_number: order_Number,
        }))
        for (const key of SelectedMenusWithTime) {
            console.log("AddMenuHistory:", key)
            AddHistoryOrder(key, "HistoryOrder")
        }
    
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
            order_number: order_Number,
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

function openModalConfirm(order) {
    showModalConfirm.value = true
    console.log(order)
    console.log(showModalConfirm.value);

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

// เมื่อได้รับการยืนยันการทำงานจาก ModalConfirm.vue

</script>
<template>
    <button
        @click=";(showModalHistory = true), (ReloadHistory = !ReloadHistory)"
        class="fixed border-2 w-1/6"
    >
        History
    </button>

    <!-- ModalHistory -->
    <div v-show="showModalHistory">
        <ModalHistory :data="ReloadHistory" @close="showModalHistory = $event" />
    </div>

    <!-- ModalComfirm -->
    <div v-show="showModalConfirm">
        <!-- <ModalConfirm @close="showModalConfirm = $event" @serve="confirmStatus = $event"/> -->
        <ModalConfirm @close="showModalConfirm = $event" @serve="confirmStatus = $event" />
    </div>
    

    <!-- main -->
    <div
        v-if="orderListBefore.length === 0"
        class="w-full h-[30%] flex justify-center border-2 rounded-md p-4 bg-slate-100 shadow-lg mt-12 ml-4"
    >
        <p>No Order ?</p>
    </div>
    <div v-else>
        <div v-for="(order, index) in orderListBefore" :key="index">
            <div
                class="w-full flex justify-between border-2 rounded-md p-4 bg-slate-100 shadow-lg mt-12 ml-4"
            >
                <div class="flex flex-col justify-center items-center w-1/4">
                    <p class="font-bold">Order</p>
                    <!-- ดึง ordermenu มาแสดง -->
                    <div>{{ order.order_number }}</div>
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
                    @click="openModalConfirm(order)"
                >
                    Serve
                </button> -->
                <button
                    class="bg-[#00E3FE] w-1/4 rounded-lg"
                    @click="openModalConfirm(order)"
                    :disabled="
                        order.orders.filter((menu) => menu.selected).length ===
                        0
                    "
                    :class="{
                        'bg-gray-300':
                            order.orders.filter((menu) => menu.selected)
                                .length === 0,
                    }"
                    title="Prease select a menu"
                >
                    Serve
                </button>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
