<script setup>
import { defineProps, ref } from "vue"

const props = defineProps({
    
    Order_menu_list: {
        type: Array,
        required: true
    },
    // Lists: {
    //     type: Array,
    //     // required: true,
    // }
})
console.log("import :", props.Order_menu_list)
</script>

<template>
    <div v-for="(order_ID, index) in props.Order_menu_list" :key="index">
        <slot name="Order_ID" :="{ order_ID, index }"></slot>
    </div>

    <!-- <div v-for="(list, index) in Lists" :key="index">
        <slot name="ListBase" :="list"> </slot>
    </div> -->
</template>

<style scoped></style>
