<script setup>
import { ref } from "vue";
import { getOrderlist } from "../lib/fetch.js"
const orderLists = ref(await getOrderlist())

console.log("Get orderlist :", orderLists.value)

</script>

<template>
    <div v-for="(order, index) in orderLists" :key="index">
        <slot name="Order" :="{ order, index }"></slot>
    </div>
</template>

<style scoped></style>
