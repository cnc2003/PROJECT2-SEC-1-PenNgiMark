<script setup>
import { ref, watch } from "vue"
import BaseList from "../BaseList.vue"
import { getOrderlist, DeleteMenuInOrder, DeleteOrder } from "../../lib/fetch.js"

let datas = ref(null)
let t = ref(null)
let couter = ref(true)
// console.log("Get orderlist :", orderLists)

const reload = async () => {
  datas.value = await getOrderlist()
}
watch(couter, () => {
  reload()
}) // couter change by  DeleteOrder() and DeleteMenuInOrder()
reload()

//ลบ menu ที่เลือกไว้โดยการเอาเมนูที่ไม่ได้เลือก put เข้าไปในdb.js
function serveOrder(order) {
  const order_ID = order.order_id
  let deleteMenu = {}
  console.log(deleteMenu)
  t.value = order.id
  // const deleteMenu = {order_id :order_ID, orders:[JSON.parse(JSON.stringify(notSelectedMenus))], id : order.id}

  const notSelectedMenus = order.orders.filter((menu) => !menu.selected)
  if (notSelectedMenus.length === 0) {
    console.log("เมนูที่เหลือ", notSelectedMenus.length)
    DeleteOrder(t.value).then(() => {
      couter.value = !couter.value
    })
  } else {
    deleteMenu = {
      order_id: order_ID,
      orders: notSelectedMenus,
      id: order.id,
    }
    console.log(notSelectedMenus, order_ID)
    console.log(deleteMenu)

    //ส่งไปที่ fetch.js
    DeleteMenuInOrder(deleteMenu, t.value).then(() => {
      couter.value = !couter.value
    })
  }
}

function tuggleSelection(order_menu) {
  // check menuที่ ถูกเลือกอยู่
  order_menu.selected = !order_menu.selected
  console.log(order_menu.selected)
}
</script>

<template>
  <Suspense>
    <BaseList :orderlist_data="datas">
      <template #Order="{ order }">
        <div
          class="w-full flex justify-between border-2 rounded-md p-4 bg-slate-100 shadow-lg mt-12 ml-4"
        >
          <div class="flex flex-col justify-center items-center w-1/4">
            <p class="font-bold">Order_ID</p>
            <!-- ดึง ordermenu มาแสดง ผ่านตัวแปร Objec order_ID -->
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
                    order_menu.selected ? 'border-[#E5C227] border-4' : ''
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
          <button
            class="bg-[#00E3FE] w-1/4 rounded-lg"
            @click="serveOrder(order, index)"
          >
            Serve
          </button>
        </div>
      </template>
    </BaseList>
  </Suspense>
</template>
<style scoped></style>
