<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  orders: {
    type: Array,
    required: true
  }
})
console.log(props.orders)
</script>

<template>
  <div class="border-red-600 border-2">
    <slot v-for="(order, index) in orders" :key="index" :order="order" ></slot>
  </div>
</template>

<style scoped></style>
