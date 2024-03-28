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
let orderListData = ref([])
let showModalHistory = ref(false)
let showModalConfirm = ref(false)
let ReloadHistory = ref(false)
let orderselects = null
let restMenus = {}
async function fetchData() {
    orderListData.value = await getList("OrderLists")
    console.log(orderListData.value)
}
onMounted(fetchData)

function serveOrder(order) {
    const order_Number = order.order_number
    //History modal
    const currentDate = new Date()
    const serveTime = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
    const SelectedMenusWithTime = order.menus
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
    // filter UnSelectedMenus
    const UnSelectedMenus = order.menus.filter((menu) => !menu.selected)
    if (UnSelectedMenus.length === 0) {
        console.log("restMenus:", UnSelectedMenus.length)
        DeleteOrder(order.id).then(() => {
            //เปลี่ยน data ใน orderListDataให้ลบ order ที่ select ออก (fontend)
            orderListData.value = orderListData.value.filter(
                (item) => item.id !== order.id
            )
        })
    } else {
        restMenus = {
            order_number: order_Number,
            menus: UnSelectedMenus,
            id: order.id,
        }
        console.log(UnSelectedMenus, order.id)
        console.log("restMenus:", restMenus)
        DeleteMenuInOrder(restMenus, order.id).then(() => {
            const updatedOrderIndex = orderListData.value.findIndex(
                (item) => item.id === order.id
            )
            //เปลี่ยน data ใน orderListDataให้ลบ menu ที่selectออก และเอาmenuที่เหลือใส่แทน (fontend)
            if (updatedOrderIndex !== -1) {
                console.log(updatedOrderIndex)
                orderListData.value[updatedOrderIndex].menus = UnSelectedMenus
            }
        })
    }
}

// check menu-Selecked
function tuggleSelection(order_menu) {
    order_menu.selected = !order_menu.selected
}

function openModalConfirm(order) {
    showModalConfirm.value = true
    console.log(order)
    console.log(showModalConfirm.value)
    orderselects = order
}

function confirmServe(event) {
    if (event === true) {
        serveOrder(orderselects)
    }
}
</script>
<template>

    <div class="fixed flex border-4 rounded-xl w-[12%]">
        <img
            src="https://www.svgrepo.com/show/492596/food.svg"
            alt=""
            class="w-14"
        />
        <button
            @click="
                showModalHistory = true, ReloadHistory = !ReloadHistory
            "
            class="text-lg"
        >
            History
        </button>
    </div>
    <!-- ModalHistory -->
    <div v-show="showModalHistory">
        <ModalHistory
            :data="ReloadHistory"
            @close="showModalHistory = $event"
        />
    </div>

    <!-- ModalComfirm -->
    <div v-show="showModalConfirm">
        <ModalConfirm
            @close="showModalConfirm = $event"
            @serve="confirmServe($event)"
        />
    </div>

    <!-- main -->
    <div
        v-if="orderListData.length === 0"
        class="w-full h-[30%] flex justify-center border-2 rounded-md p-4 bg-slate-100 mt-12 ml-4"
    >
        <p>No Order ?</p>
    </div>
    <div v-else class="mt-10">
        <div v-for="(order, index) in orderListData" :key="index" >
            <div
                class="my-6 h-[20%] w-11/12 shrink-0 p-4 flex mt-8 ml-4 rounded-3xl bg-white border-solid border-slate-300 border-4 shadow-lg"
            >
                <div class="flex flex-col justify-center items-center w-1/4">
                    <p class="font-bold">Order</p>
                    <!-- ดึง ordermenu มาแสดง -->
                    <div>{{ order.order_number }}</div>
                </div>
                <div class="flex w-full">
                    <div class="flex flex-wrap">
                        <div
                            v-for="(order_menu, menuIndex) in order.menus"
                            :key="menuIndex"
                        >
                            <div
                                class="p-4 m-2 h-40 w-48 rounded-lg flex flex-col justify-center"
                                @click="tuggleSelection(order_menu)"
                                :style="{
                                    backgroundColor: order_menu.selected
                                        ? '#f7e2bf'
                                        : '#FCF4F2',
                                }"
                                :class="
                                    order_menu.selected
                                        ? 'border-[#E5C227] border-2'
                                        : 'border-[#FCF4F2] border-2'
                                "
                            >
                                <div class="pt-2 pb-2">
                                    Menu : {{ order_menu.menu_name }}
                                </div>
                                <div class="pt-2 pb-2">
                                    quantity : {{ order_menu.quantity }}
                                </div>
                                <div class="pt-2 pb-2">
                                    details : {{ order_menu.details }}
                                </div>
                                <input
                                    type="checkbox"
                                    v-model="order_menu.selected"
                                    hidden
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    class="bg-[#00E3FE] w-1/4 rounded-lg text-4xl font-bold"
                    @click="openModalConfirm(order)"
                    :disabled="
                        order.menus.filter((menu) => menu.selected).length === 0
                    "
                    :class="{
                        'bg-gray-300':
                            order.menus.filter((menu) => menu.selected)
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
<style scoped>

</style>
