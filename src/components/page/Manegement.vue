<script setup>
import { ref } from "vue"
import menuList from "../../../public/data/menulist.json"
import orderList from "../../../public/data/orderlist.json"

// console.log()
const totalMenu = ref(0)
const totalSold = ref(0)
const totalOrder = ref(orderList.length)

const selectFilter = ref("")
const filterResult = ref(menuList)
function filterCategory(category) {
  if (menuList.hasOwnProperty(category)) {
    filterResult.value = {[category] : menuList[category]}
    console.log(filterResult)
    return console.log(menuList)
  } else {
    return (filterResult = menuList)
  }
}

for (const array in menuList) {
  totalMenu.value += array.length
}

orderList.forEach((order) =>
  order.orders.forEach((item) => {
    totalSold.value += item.quantity
  })
)

const hr = ref("mb-2 border-gray-300 border-1 rounded")
</script>

<template>
  <div class="h-lvh flex flex-col items-center">
    <div
      name="analysis"
      class="my-6 h-2/6 w-11/12 rounded-md p-4 bg-slate-100"
    >
      <h1 class="text-2xl font-mono font-semibold">Analysis</h1>
      <hr :class="hr" />
      <div
        name="Content"
        class="flex"
      >
        <!-- total cup sold -->
        <div class="">
          <h2>Total Sold</h2>
          <h1 v-text="totalSold"></h1>
        </div>
        <!-- total order -->
        <div>
          <h2>Total Order</h2>
          <h1 v-text="totalOrder"></h1>
        </div>
        <!-- total product -->
        <div>
          <h2>Total Menu</h2>
          <h1 v-text="totalMenu"></h1>
        </div>
      </div>
    </div>

    <div
      name="management"
      class="h-3/6 w-11/12 rounded-md p-4 bg-slate-100"
    >
      <div class="h-[10%] mb-2">
        <div class="flex flex-row w-full h-full">
          <h1 class="text-2xl font-mono font-semibold">Management</h1>
          <select v-model="selectFilter" @change="filterCategory(selectFilter)">
            <option
              v-for="(category, key) in menuList"
              :key="key"
            >
              {{ key }}
            </option>
          </select>
        </div>
        <hr :class="hr" />
      </div>
      
      <div
        name="container"
        class="w-full h-[400px] flex flex-wrap gap-4 overflow-auto object-contain"
      >
        <div
          v-for="(itemList, category) in filterResult"
          :name="category"
          :key="category"
          class="flex flex-col w-full h-auto gap-4"
        >
          <h2
            v-text="category"
            class="w-full font-mono text-lg font-semibold"
          ></h2>
          <!-- Menu each category -->
          <div
            name="menuContainer"
            class="flex flex-row gap-4 flex-wrap"
          >
            <div
              v-for="item in itemList"
              :key="item"
              class="w-[23%] h-32 p-4 border border-gray-300 rounded-md"
            >
              <p>{{ item.menuName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      name="promotion"
      class="my-6 h-2/6 w-11/12 rounded-md p-4 bg-slate-100"
    >
      <h1 class="text-2xl font-mono font-semibold">Promotion</h1>
      <hr :class="hr" />
      <div name="content"></div>
    </div>
  </div>
</template>
