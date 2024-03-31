<template>
    <div
        name="analysis"
        class="my-6 h-[20%] w-11/12 shrink-0 p-4 rounded-3xl bg-white border-solid border-slate-300 border-4"
    >
        <div class="flex flex-col h-[20%] mb-2">
            <h1 class="text-2xl font-bold pb-2">Analysis</h1>
            <hr :class="hr" />
        </div>
        <div
            name="Content"
            class="flex flex-row gap-4 justify-center content-center items-center h-[70%] mt-5"
        >
            <!-- total cup sold -->
            <div :class="partBox">
                <JsxIconBase iconName="Store" :w="16" :h="16" />
                <div class="flex flex-col">
                    <h2 :class="header">Total Cups Sold</h2>
                    <h1
                        v-text="totalSold ? totalSold : NaN"
                        :class="number"
                    ></h1>
                </div>
            </div>
            <!-- total order -->
            <div :class="partBox">
                <JsxIconBase iconName="Calculator" :w="16" :h="16" />

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
                <JsxIconBase iconName="Copy" :w="16" :h="16" />

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
import JsxIconBase from "./JsxIconBase.vue"

const partBox = ref("w-1/3 h-24  flex flex-row gap-4 p-4 items-center")
const header = ref("font-medium text-gray-500 text-lg")
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
