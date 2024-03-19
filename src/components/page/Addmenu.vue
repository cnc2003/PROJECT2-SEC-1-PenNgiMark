<script setup>
import { ref } from "vue"
import { getMenulist } from "../../lib/fetch.js"

const filterResult = ref(null) //default data

async function fetchMenuData() {
    filterResult.value = await getMenulist() // is array
    for (const key in filterResult.value) {
        console.log(key)
    }
}
fetchMenuData()
</script>
<template>
    <div class="flex h-full w-full">
        <div class="border-2 border-white w-3/4">
            this must be category list
            <div class="flex border-2 w-1/2">
                <div v-for="(category, key) in filterResult" :key="category"
                class="p-3 rounded-md">
                    <div class="bg-slate-300 p-2 rounded-md">{{ key }}</div>
                </div>
            </div>


            this must be menus list
            <div>
              <!-- loop category -->
              <div v-for="(category, key) in filterResult" :key="key" 
                class="p-3 rounded-md">

                <!-- loop menulist in category  -->
                <div v-for="menus in category"
                class="border-2 p-2 m-1">
                
                    <!-- loop menu in menulist  -->
                    <div v-for="menu in menus">
                      <div>{{ menu }}</div>
                    </div>
                </div>
                    
                </div>
            </div>
        </div>
        <div class="flex flex-col border-2 border-black h-dvh w-1/4">
            <div class="border-2 border-white m-3 h-16">
                <button class="border-2 border-white">Dine in</button>
                <button class="border-2 border-white">Take away</button>
            </div>
            <div class="border-2 border-white m-3 h-full">Total Items</div>
            <div class="border-2 border-white m-3 h-1/5">Payment Summary</div>
            <div class="border-2 border-white m-3 h-28">
                <button class="border-2 border-white">Cash</button>
                <button class="border-2 border-white">Card</button>
                <button class="border-2 border-white">QR</button>
            </div>
            <button class="border-2 border-white h-20 m-3 mb-6">
                Place Order
            </button>
        </div>
    </div>
</template>
