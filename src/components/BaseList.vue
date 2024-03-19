<script setup>
import { ref, watch } from "vue"
import { getOrderlist } from "../lib/fetch.js"

const props = defineProps({
  orderlist_data: Array,
  menulist_data: Array,
})

console.log(props.orderlist_data)
console.log(props.menulist_data)
</script>

<template>
  <div
    v-for="(order, index) in orderlist_data"
    :key="index"
  >
    <slot
      name="Order"
      :="{ order }"
    ></slot>
  </div>
  <div
    v-for="(category, index) in menulist_data"
    :key="index"
  >
    <slot
      name="Category"
      :="{ category }"
    ></slot>
  </div>
</template>

<style scoped></style>
