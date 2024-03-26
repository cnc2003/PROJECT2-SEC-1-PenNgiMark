<script setup>
import { defineProps, defineEmits, ref, watch } from "vue"
import { getList } from "../lib/fetch.js"

// define variable
let HistoryOrder = ref([])
const emits = defineEmits(["close"])
const props = defineProps({
    data: Boolean,
})
let datas = ref(props.data)
console.log(datas.value)

async function fetchData() {
    HistoryOrder.value = await getList("HistoryOrder")
    HistoryOrder.value = HistoryOrder.value.slice().reverse()
}
fetchData()

watch(
    () => props.data,
    () => {
        fetchData()
        // console.log("HistoryOrder :" ,HistoryOrder.value);
    }
)
</script>

<template>
    <div
        class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
    >
        <div
            class="w-lvw h-lvh bg-black bg-opacity-50"
            @click="emits('close')"
        ></div>

        <!-- modal content -->
        <div
            class="fixed w-2/4 h-auto bg-white rounded-xl flex flex-col items-center"
        >
            <div>
                <div class="flex">
                    <div class="flex justify-start text-xl font-bold mt-4 mb-4 ml-2">
                        History Order
                    </div>
                    <!-- close button -->
                    <img
                        class="h-6 p-1 btn rounded-lg absolute top-2 right-2 hover:cursor-pointer bg-red-500"
                        @click="emits('close')"
                        src="/src/assets/icon/cross.png"
                    />
                </div>
                <table class=" w-full mb-10">
                    <tr class="grid grid-cols-9 border-b-4">
                        <th class="col-span-3">Time</th>
                        <th>OrderID</th>
                        <th class="col-span-2">Menu</th>
                        <th>Quantity</th>
                        <th>Detail</th>
                    </tr>
                    <div
                        v-if="HistoryOrder.length > 0"
                        v-for="(order, index) in HistoryOrder"
                        :key="index"
                        class="mt-4"
                    >
                        <tr class="grid grid-cols-9 ">
                            <td class="col-span-3 flex justify-center">{{ order.Time }}</td>
                            <td class="flex justify-center">{{ order.order_number }}</td>
                            <td class="col-span-2 flex justify-center">{{ order.menu_name }}</td>
                            <td class="flex justify-center">{{ order.quantity }}</td>
                            <td class="flex justify-center">{{ order.details }}</td>
                        </tr>

                        <!-- <p class="pl-3 pr-3">{{ order.Time }}</p>
                    <p class="pl-3 pr-3">{{ order.order_id }}</p>
                    <p class="pl-3 pr-3">{{ order.menu_name }}</p>
                    <p class="pl-3 pr-3">{{ order.quantity }}</p>
                    <p class="pl-3 pr-3">{{ order.details }}</p> -->
                    </div>
                    <div v-else>
                        <p class="flex justify-center text-base mt-48">
                            Don't Have order ??
                        </p>
                    </div>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
