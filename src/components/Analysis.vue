<template>
  <div
    name="analysis"
    class="my-6 h-[20%] w-11/12 shrink-0 rounded-md p-4 bg-slate-100"
  >
    <div class="flex flex-col h-[20%]">
      <h1 class="text-2xl font-mono font-semibold">Analysis</h1>
      <hr :class="hr" />
    </div>
    <div
      name="Content"
      class="flex flex-row gap-4 justify-center items-center h-[80%] mt-2"
    >
      <!-- total cup sold -->
      <div :class="partBox">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
          />
        </svg>

        <div class="flex flex-col">
          <h2 :class="header">Total Sold</h2>
          <h1
            v-text="totalSold ? totalSold : NaN"
            :class="number"
          ></h1>
        </div>
      </div>
      <!-- total order -->
      <div :class="partBox">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
          />
        </svg>

        <div class="flex flex-col">
          <h2 :class="header">Total Order</h2>
          <h1
            v-text="totalOrder ? totalOrder : NaN"
            :class="number"
          ></h1>
        </div>
      </div>
      <!-- total product -->
      <div :class="partBox">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>

        <div class="flex flex-col">
          <h2 :class="header">Total Menu</h2>
          <h1
            v-text="totalMenu ? totalMenu : NaN"
            :class="number"
          ></h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getList } from "../lib/fetch"
import { ref } from "vue"

const partBox = ref("w-1/3 h-24  flex flex-row gap-4 p-4 items-center")
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
