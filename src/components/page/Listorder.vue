<script setup>
import { ref, onMounted } from "vue"
import {
    DeleteMenuInOrder,
    deleteItemById,
    addItem,
    getList,
} from "../../lib/fetch.js"
import ModalHistory from "../ModalHistory.vue"
import ModalConfirm from "../ModalConfirm.vue"
import JsxIconBase from "../JsxIconBase.vue"

// define variable
let orderListData = ref([])
let showModalHistory = ref(false)
let showModalConfirm = ref(false)
let ReloadHistory = ref(false)
let orderselects = null
let restMenus = {}
let animetion_transition = ref(false)

onMounted(async () => {
    const resOrderList = await getList("OrderLists")
    orderListData.value = resOrderList.data
})

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
        addItem("HistoryOrder",key )
    }
    // filter UnSelectedMenus
    const UnSelectedMenus = order.menus.filter((menu) => !menu.selected)
    animetion_transition.value = !animetion_transition.value
    

    if (UnSelectedMenus.length === 0) {
        deleteItemById("OrderLists",order.id).then(() => {
            //เปลี่ยน data ใน orderListDataให้ลบ order ที่ select ออก (fontend)
            setTimeout(() => {
                orderListData.value = orderListData.value.filter(
                    (item) => item.id !== order.id              
                )
                animetion_transition.value = !animetion_transition.value
            }, 300)
        })
    } else {
        restMenus = {
            order_number: order_Number,
            menus: UnSelectedMenus,
            id: order.id,
        }
        DeleteMenuInOrder(restMenus, order.id).then(() => {
            const updatedOrderIndex = orderListData.value.findIndex(
                (item) => item.id === order.id
            )
            //เปลี่ยน data ใน orderListDataให้ลบ menu ที่selectออก และเอาmenuที่เหลือใส่แทน (fontend)
            if (updatedOrderIndex !== -1) {
                setTimeout(() => {
                    orderListData.value[updatedOrderIndex].menus = UnSelectedMenus
                    animetion_transition.value = !animetion_transition.value
                }, 500)
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
    orderselects = order
}

function confirmServe(event) {
    if (event === true) {
        serveOrder(orderselects)
    }
}

const col = ref("font-semibold")
</script>
<template>
    <div class="w-full flex flex-col justify-items-center p-8 pt-4">
        <div class="absolute w-[80%] flex flex-row justify-center">
            <div
                class=" w-[96%] h-16 flex flex-row justify-between items-center px-8 rounded-3xl bg-white border-solid border-slate-300 border-4"
            >
                <h1 class="text-4xl font-bold">List Orders</h1>
                <button
                    class="btn btn-error text-xl flex flex-row justify-around items-center gap-4 w-auto rounded-2xl mr-14"
                    @click="showModalHistory = true"
                >
                    <JsxIconBase iconName="Copy" :w="10" :h="10" />
                    <h2 class="text-black text-xl font-semibold">History</h2>
                </button>
                <!-- <hr class="border-2 col-span-2"> -->
            </div>
        </div>
        <!-- ModalHistory -->
        <div v-if="showModalHistory">
            <ModalHistory
                :data="ReloadHistory"
                @close="showModalHistory = $event"
            />
        </div>

        <!-- ModalComfirm -->
        <div v-show="showModalConfirm">
            <ModalConfirm
                action="Serve"
                @close="showModalConfirm = $event"
                @serve="confirmServe"
            />
        </div>

        <!-- main -->
        <div
            v-if="orderListData.length === 0"
            class="h-[20%] w-11/12 shrink-0 p-4 flex justify-center mt-32 ml-12 first-letter:justify-center items-center rounded-3xl bg-white border-solid border-slate-300 border-4 shadow-lg text-3xl"
        >
            <p>No Order ?</p>
        </div>
        <div v-else class="mt-20 w-full">
          <transition name="menu-fade">

        
            <div
                class="flex flex-col flex-wrap w-[96%] gap-4 justify-center ml-[5rem]"
            >
            
                <div
                    v-for="(order, index) in orderListData"
                    :key="index"
                    class=" order-fade h-auto w-11/12 shrink-0 p-4 flex rounded-3xl bg-white border-solid border-slate-300 border-4 shadow-lg"
                    :class="order.menus.length === 0 ? 'order-item':''"
                    >
                    <div
                        class="flex flex-col justify-center items-center w-1/4"
                    >
                        <p class="font-bold">Order Number</p>
                        <!-- ดึง ordermenu มาแสดง -->
                        <div>{{ order.order_number }}</div>
                    </div>
                    <div class="flex w-full">
                        <div class="flex flex-wrap">
                            <div
                                v-for="(order_menu, menuIndex) in order.menus"
                                :key="menuIndex"
                            >
                                <transition name="menu-fade">
                                    <div
                                        v-show="
                                            !order_menu.selected ||
                                            !animetion_transition
                                        "
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
                                                : 'border-[#FCF4F2] border-2'"
                                    >
                                        <div class="pt-2 pb-2">
                                            <span :class="col">Menu :</span>
                                            {{ order_menu.menu_name }}
                                        </div>
                                        <div class="pt-2 pb-2">
                                            <span :class="col">Quantity</span>
                                            :
                                            {{ order_menu.quantity }}
                                        </div>
                                        <div class="pt-2 pb-2">
                                            <span :class="col">Details :</span>
                                            {{ order_menu.sweetnessLevel }}
                                        </div>
                                        <input
                                            type="checkbox"
                                            v-model="order_menu.selected"
                                            hidden
                                        />
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                    <button
                        class="btn btn-square btn-success w-1/6 h-44 rounded-lg text-4xl text-white font-bold"
                        @click="openModalConfirm(order)"
                        :disabled="
                            order.menus.filter((menu) => menu.selected)
                                .length === 0
                        "
                        :class="{
                            'bg-gray-300':
                                order.menus.filter((menu) => menu.selected)
                                    .length === 0,
                            'text-black':
                                order.menus.filter((menu) => menu.selected)
                                    .length === 0,
                        }"
                        title="Prease select a menu"
                    >
                        Serve
                    </button>
                    
                </div>
           
            </div>
          </transition>
        </div>
    </div>
</template>
<style scoped>
</style>
