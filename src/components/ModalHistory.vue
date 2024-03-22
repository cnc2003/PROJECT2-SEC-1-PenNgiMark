<script setup>
import { defineProps, defineEmits, ref,watch } from "vue"
import {getList} from '../lib/fetch.js'

// define variable
let HistoryOrder =ref([])
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


watch(() => props.data, () => {
    fetchData()
    // console.log("HistoryOrder :" ,HistoryOrder.value);
})


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
            class="fixed w-2/4 h-3/4 bg-white rounded-xl flex flex-col items-center"
        >
            <div>
                <div class="flex">
                    <div class="text-xl border-b-4 m-4">
                        This is History Order
                    </div>
                    <!-- close button -->
                    <img
                    class=" h-6 p-1 btn rounded-lg absolute top-2 right-2 hover:cursor-pointer bg-red-500"
                        @click="emits('close')"
                        src="/src/assets/icon/cross.png"
                    />
                </div>
                <div
                    v-if="HistoryOrder.length > 0"
                    v-for="(order, index) in HistoryOrder"
                    :key="index"
                    class="flex border-2 shadow-lg m-3 w-auto"
                >
                    <p class="pl-3 pr-3">{{ order.Time }}</p>
                    <p class="pl-3 pr-3">{{ order.order_id }}</p>
                    <p class="pl-3 pr-3">{{ order.menu_name }}</p>
                    <p class="pl-3 pr-3">{{ order.quantity }}</p>
                    <p class="pl-3 pr-3">{{ order.details }}</p>
                </div>
                <div v-else>
                    <p class="flex justify-center text-base mt-48">
                        Don't Have order ??
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
