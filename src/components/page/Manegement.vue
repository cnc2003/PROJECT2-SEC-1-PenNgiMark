<script setup>
// Import necessary modules
import { ref, ssrContextKey } from "vue"
import orderList from "../../../public/data/orderlist.json"
import { getMenulist } from "../../lib/fetch.js"

// Define reactive variables
const totalMenu = ref(0)
const totalSold = ref(0)
const totalOrder = ref(orderList.length)
// Filter variables
const selectFilter = ref("")
const filterResult = ref(null)
const afterFilterResult = ref(null) // default value

async function fetchMenuData() {
  filterResult.value = await getMenulist() // is array
  for (const key in filterResult.value) {
    console.log(key)
  }
  
}

// Function to filter categories
function filterCategory(category) {
  if (filterResult.value.hasOwnProperty(category)) {
    afterFilterResult.value = { [category]: filterResult.value[category] }
    console.log(afterFilterResult.value)
  } else {
    afterFilterResult.value = filterResult.value
  }
}

// Calculate total sold items
orderList.forEach((order) =>
  order.orders.forEach((item) => {
    totalSold.value += item.quantity
  })
)

fetchMenuData()
// Calculate total menu items
console.log("ssssss");
for (const category in filterResult.value) {
  totalMenu.value += filterResult.value[category].length
  console.log(filterResult.value['Coffee']);
}

// Set HR style class
const hr = ref("mb-2 border-gray-300 border-1 rounded")
</script>

<template>
  <Suspense>
    <div class="flex flex-col w-full h-lvh items-center">
    <!-- Analysis Section -->
    <div
      name="analysis"
      class="my-6 h-[20%] w-11/12 shrink-0 rounded-md p-4 bg-slate-100"
    >
      <h1 class="text-2xl font-mono font-semibold">Analysis</h1>
      <hr :class="hr" />
      <div
        name="Content"
        class="flex"
      >
        <!-- total cup sold -->
        <div>
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

    <!-- Management Section -->
    <div
      name="management"
      class="h-[40%] shrink-0 w-11/12 rounded-md p-4 bg-slate-100"
    >
      <div class="h-[10%] mb-2">
        <div class="flex flex-row w-full h-full">
          <h1 class="text-2xl font-mono font-semibold">Management</h1>
          <!-- Dropdown for filtering -->
          <select
            v-model="selectFilter"
            @change="filterCategory(selectFilter)"
          >
            <option value="">All</option>
            <!-- Generate options for each category -->
            <option
              v-for="(category,key) in filterResult"
              :key="category"
            >
              {{ key }}
            </option>
          </select>
        </div>
        <hr :class="hr" />
      </div>

      <div
        name="container"
        class="w-full h-[90%] flex flex-wrap gap-4 overflow-auto"
      >
        <!-- Dynamic rendering of menu items based on selected category -->
        <div
          v-for="(itemList, category) in afterFilterResult === null ? filterResult : afterFilterResult"
          :name="category"
          :key="category"
          class="flex flex-col w-full h-auto gap-4"
        >
          <h2
            v-text="category"
            class="w-full font-mono text-lg font-semibold"
          ></h2>
          <!-- Menu items within each category -->
          <div
            name="menuContainer"
            class="flex flex-row gap-4 flex-wrap"
          >
            <div
              v-for="item in itemList"
              :key="item"
              class="w-[23%] h-32 p-4 border border-gray-300 rounded-md"
            >
              <p>{{ item.menu_name }}</p>
              <p>{{ item.price }}</p>
              <p>{{ category }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Promotion Section -->
    <div
      name="promotion"
      class="my-6 p-4 h-[40%] shrink w-11/12 rounded-md bg-slate-100 overflow-hidden"
    >
      <div class="h-[10%]">
        <h1 class="text-2xl font-mono font-semibold">Promotion</h1>
        <hr :class="hr" />
      </div>

      <div
        name="container"
        class="w-full h-[90%] mt-2 flex flex-wrap gap-4 overflow-auto"
      >
        <!-- Dynamic rendering of menu items based on selected category (filterResult) -->
        <div
          v-for="(itemList, category) in afterFilterResult === null ? filterResult : afterFilterResult"
          :name="category"
          :key="category"
          class="flex flex-col w-full gap-4"
        >
          <h2
            v-text="category"
            class="w-full font-mono text-lg font-semibold"
          ></h2>
          <!-- Menu items within each category -->
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
  </div>
  </Suspense>

  </template>


