<script setup>
import { defineProps, defineEmits, ref } from "vue"
let dataH = ref([])
const emits = defineEmits(["close"])

const props = defineProps({
    data: Array,
})
console.log(props.data)

dataH.value.push(...props.data) //reactive objects
dataH.value = dataH.value.slice().reverse()
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
                class="fixed w-2/4 h-auto bg-white rounded-xl flex justify-center text-xl p-4"
            >
                <div>
                    <p class="text-xl border-b-4 mb-4">This is History Order</p>

                    <div
                        v-if="dataH.length > 0"
                        v-for="(order, index) in dataH"
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
                        <p class="flex justify-center text-base">
                            Don't Have order ??
                        </p>
                    </div>
                </div>
                <!-- close button -->
                <img
                    class="flex items-startw-4 h-4 hover:cursor-pointer"
                    @click="emits('close')"
                    src="/src/assets/icon/cross.svg"
                />         
            </div>
    </div>
</template>

<style scoped></style>
