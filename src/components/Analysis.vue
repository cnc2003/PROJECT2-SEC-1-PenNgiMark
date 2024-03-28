<template>
  <div
    name="analysis"
    class="my-6 h-[20%] w-11/12 shrink-0 rounded-md p-4 bg-slate-100"
  >
    <h1 class="text-2xl font-mono font-semibold">Analysis</h1>
    <hr :class="hr" />
    <div
      name="Content"
      class="flex flex-row gap-4 justify-center items-center"
    >
      <!-- total cup sold -->
      <div :class="infoDiv">
        <h2 :class="header">Total Sold</h2>
        <h1
          v-text="totalSold ? totalSold : NaN"
          :class="number"
        ></h1>
      </div>
      <!-- total order -->
      <div :class="infoDiv">
        <h2 :class="header">Total Order</h2>
        <h1
          v-text="totalOrder ? totalOrder : NaN"
          :class="number"
        ></h1>
      </div>
      <!-- total product -->
      <div :class="infoDiv">
        <h2 :class="header">Total Menu</h2>
        <h1
          v-text="totalMenu ? totalMenu : NaN"
          :class="number"
        ></h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getList } from "../lib/fetch"
import { ref } from "vue"

const infoDiv = ref("w-1/3 h-24 ring flex flex-col gap-0 p-4")
const header = ref("font-medium text-gray-500")
const number = ref("font-bold text-3xl")

const totalOrder = ref(0)
const totalSold = ref(0)
const orderData = ref(null)
const managementData = ref(null)
const props = defineProps({
  totalMenu: Number,
  totalSold: Number,
  hr: String,
})

async function fetchOrderData() {
  orderData.value = await getList("Management")
  totalOrder.value = orderData.value.length
  calTotalOrder()
}

function calTotalOrder() {
  const orderQuantities = managementData.value.map((order) => {
    const totalQuantity = order.orders.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    )
    return totalQuantity
  })
  const totalQuantities = [...orderQuantities]
  totalSold.value = totalQuantities.reduce((acc, curr) => acc + curr, 0)
  //console.log(totalSold.value)
}
async function fetchMenagementData() {
  managementData.value = await getList("Management")
  for (const cate in managementData.value) {
    // cate [ex index = 0,1,2,3,4,5]
    const category = managementData.value[cate] // {id: '236e', takoyaki: Array(1)}
    totalSold.value += category.orders.length
  }
}
fetchMenagementData()
fetchOrderData()
</script>

<style></style>
