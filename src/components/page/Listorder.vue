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

const col = ref("font-semibold")
</script>
<template>
  <div class="w-full flex flex-col justify-items-center p-8 pt-4">
    <div class="absolute w-[80%] flex flex-row justify-center">
      <div
        class="w-[96%] h-16 flex flex-row justify-between items-center px-8 rounded-3xl bg-white border-solid border-slate-300 border-4"
      >
        <h1 class="text-4xl font-bold">List Orders</h1>
        <button
          class="btn btn-error text-xl flex flex-row  justify-around items-center gap-4 w-auto rounded-2xl mr-14"
          @click=";(showModalHistory = true), (ReloadHistory = !ReloadHistory)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>

          <h2 class="text-black text-xl font-semibold">History</h2>
        </button>
        <!-- <hr class="border-2 col-span-2"> -->
      </div>
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
      class="h-[20%] w-11/12 shrink-0 p-4 flex justify-center items-center rounded-3xl bg-white border-solid border-slate-300 border-4 shadow-lg text-3xl"
    >
      <p>No Order ?</p>
    </div>
    <div
      v-else
      class="mt-20 w-full"
    >
      <div class="flex flex-col w-[96%] gap-4 justify-center ml-[5rem]">
        <div
          v-for="(order, index) in orderListData"
          :key="index"
          class="h-auto w-11/12 shrink-0 p-4 flex rounded-3xl bg-white border-solid border-slate-300 border-4 shadow-lg"
        >
          <div class="flex flex-col justify-center items-center w-1/4">
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
                    <span :class="col">Menu :</span> {{ order_menu.menu_name }}
                  </div>
                  <div class="pt-2 pb-2">
                    <span :class="col">Quantity</span> :
                    {{ order_menu.quantity }}
                  </div>
                  <div class="pt-2 pb-2">
                    <span :class="col">Details :</span> {{ order_menu.details }}
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
            class="btn btn-square btn-success w-1/6 h-44 rounded-lg text-4xl text-white font-bold"
            @click="openModalConfirm(order)"
            :disabled="order.menus.filter((menu) => menu.selected).length === 0"
            :class="{
              'bg-gray-300':
                order.menus.filter((menu) => menu.selected).length === 0,
              'text-black':
                order.menus.filter((menu) => menu.selected).length === 0,
            }"
            title="Prease select a menu"
          >
            Serve
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
