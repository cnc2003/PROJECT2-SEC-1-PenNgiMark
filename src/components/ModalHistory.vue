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
// console.log(datas.value)

async function fetchData() {
    HistoryOrder.value = await getList("HistoryOrder")
    HistoryOrder.value = HistoryOrder.value.slice().reverse()
}
fetchData()

watch(
    () => props.data,
    () => {
        fetchData()
        // // console.log("HistoryOrder :" ,HistoryOrder.value);
    }
)
</script>

<template>
    <div
        class="fixed w-full h-full top-0 left-0 flex justify-center items-center"
    >
        <div
            class="w-lvw h-lvh bg-black bg-opacity-50"
            @click="emits('close')"
        ></div>

        <!-- modal content -->
        <div
            class="fixed w-[50%] h-[70%] bg-white rounded-xl flex flex-col items-center"
        >
            <img
                class="p-1 btn btn-error rounded-lg absolute top-2 right-2 hover:cursor-pointer"
                @click="emits('close', false)"
                src="/src/assets/icon/cross.png"
            />

            <div
                class="text-3xl font-bold w-[80%] h-28 text-center flex items-center"
            >
                History Order
            </div>
            <!-- close button -->

            <table
                class="table table-auto table-zebra w-[80%] h-[10%] max-h-10"
            >
                <thead class="text-xl">
                    <tr>
                        <th>Time</th>
                        <th>Order_Number</th>
                        <th>Menu</th>
                        <th>Quantity</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody class="text-base" style="overflow-y: auto">
                    <tr
                        v-show="HistoryOrder.length > 0"
                        v-for="(order, index) in HistoryOrder"
                        :key="index"
                    >
                        <td>{{ order.Time }}</td>
                        <td>{{ order.order_number }}</td>
                        <td>{{ order.menu_name }}</td>
                        <td>{{ order.quantity }}</td>
                        <td>{{ order.sweetnessLevel }}</td>
                    </tr>
                </tbody>
                <tbody v-show="HistoryOrder.length == 0" class="mt">
                    <tr>
                        <td>Don't Have order ??</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped></style>
