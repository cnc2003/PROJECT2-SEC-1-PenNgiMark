<script setup>
import { defineProps, ref } from "vue"


const props = defineProps({
    lists: {
        type: Array,
        // required: true,
    },
    Order_menu_list: {
        type: Array,
        required: true,
    },
})
console.log("import :", props.Order_menu_list)



</script>

<template>
    <div v-for="(order_ID, index) in props.Order_menu_list" :key="index">
        <div class="p-5">
            <p class="font-bold">Order_ID</p>
            <slot name="Order_ID" :="order_ID"></slot>
        </div>

        <div v-for="(order_menu, orderIndex) in order_ID.orders" :key="orderIndex" >
            <!-- pass data to parent component -->
            <slot name="Order_menu" :="order_menu"></slot>
        </div>

        <!-- <button class="bg-green-600" @click="serveOrder(order_ID),deleteorder(order_ID)">
            Serve
        </button> -->
    </div>
    <div v-for="(list, index) in lists" :key="index">
        <slot name="list" :="list"> </slot>
    </div>
</template>

<style scoped></style>
