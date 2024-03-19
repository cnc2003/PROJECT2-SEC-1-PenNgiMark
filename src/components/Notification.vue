<script setup>
import { defineProps, defineEmits, ref } from "vue"

const emits = defineEmits(["close"])
const props = defineProps({
    data: Array,
})
console.log(props.data)
let dataH = ref([])
dataH.value.push(...props.data)
</script>

<template>
    <div
        class="fixed flex flex-col items-center bg-slate-100 shadow-lg h-1/2 w-1/2 ml-80 z-0"
    >
        <p class="text-xl">this is History Order</p>
        <div class="flex flex-col justify-center items-center text-xl">
            <div
                v-for="(order, index) in dataH.slice().reverse()"
                :key="index"
                class="flex border-2 shadow-lg m-3"
            >
                <p class="pl-3 pr-3">{{ order.Time }}</p>
                <p class="pl-3 pr-3">{{ order.menu_name }}</p>
                <p class="pl-3 pr-3">{{ order.quantity }}</p>
                <p class="pl-3 pr-3">{{ order.details }}</p>
            </div>
            
            <button class="bg-red-600 w-auto rounded-md p-1" @click="emits('close')">
                Close
            </button>
            <slot name="HistoryOrder"></slot>
        </div>
    </div>
</template>

<style scoped></style>
