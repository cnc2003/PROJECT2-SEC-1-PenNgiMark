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
            class="fixed w-[50%] h-[50%] bg-white rounded-xl flex flex-col items-center"
        >
            <div>
                <div class="flex flex-col justify-end items-center">
                    <div class="text-xl font-bold mt-4 mb-8">History Order</div>
                    <!-- close button -->
                    <img
                        class="p-1 btn btn-error rounded-lg absolute top-2 right-2 hover:cursor-pointer "
                        @click="emits('close', false)"
                        src="/src/assets/icon/cross.png"
                    />
                </div>

                <table class="table">
                    <thead >
                        <tr class="grid grid-cols-9 mr-4"> 
                            <th class="flex justify-center col-span-2 ">Time</th>
                            <th class="flex justify-center col-span-2">Order_Number</th>
                            <th class=" flex justify-center col-span-2">Menu</th>
                            <th class=" flex justify-center col-span-1">Quantity</th>
                            <th class=" flex justify-center col-span-2">Detail</th>
                        </tr>
                    </thead>
                    <tbody class="flex justify-center overflow-y-scroll">
                        <div
                            v-if="HistoryOrder.length > 0"
                            class="mt-3 h-60 flex flex-col "
                        >
                            <tr
                                v-for="(order, index) in HistoryOrder"
                                :key="index"
                                class="grid grid-cols-9 mt-4 "
                            >
                            
                                <td class="col-span-2 flex justify-center">
                                    {{ order.Time }}
                                </td>
                                <td class="col-span-2 flex justify-center">
                                    {{ order.order_number }}
                                </td>
                                <td class="col-span-2 flex justify-center">
                                    {{ order.menu_name }}
                                </td>
                                <td class=" col-span-1  flex justify-center">
                                    {{ order.quantity }}
                                </td>
                                <td class="col-span-2 flex justify-center">
                                    {{ order.details }}
                                </td>
                            </tr>
                        </div>

                        <div v-else>
                            <p class="flex justify-center text-base mt-48">
                                Don't Have order ??
                            </p>
                        </div>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
