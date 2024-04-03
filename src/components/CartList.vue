<script setup>
import { ref, computed } from "vue"
import CartCard from "./CartCard.vue"
const props = defineProps({
  menusInCart: Array,
})

const menuCart = computed(() => props.menusInCart)
</script>

<template>
  <div class="bg-white h-full rounded-2xl p-3">
    <h2 class="font-bold text-2xl">Total Menu {{ menusInCart.length }}</h2>
    <span class="divider my-[1px]"></span>
    <div
      class="overflow-auto w-full h-[92%]"
    >
      <CartCard v-for="(menu, index) in menuCart"
      :key="index">
        <template #drinkName>
          <b>{{ menu.menu_name }}</b>
        </template>
        <template #sweet>
          <p>{{ menu.sweetnessLevel }}</p>
        </template>
        <template #quantity>
          <button
            @click="menu.quantity <= 1 ? null : menu.quantity--"
            class="bg-slate-300 w-8 h-8 mx-2 rounded-lg text-center hover:bg-slate-400 hover:scale-105 transition duration-200"
          >
            -
          </button>
          <p class="text-center font-semibold text-2xl w-[33%]">{{ menu.quantity }}</p>
          <button
            @click="menu.quantity++"
            class="bg-slate-300 w-8 h-8 mx-2 rounded-lg text-center hover:bg-slate-400 hover:scale-105 transition duration-200"
          >
            +
          </button>
        </template>
      </CartCard>
      <div
        v-show="index + 1 !== menusInCart.length"
        class="divider divider-horizontal mx-[2px]"
      ></div>
    </div>
  </div>
</template>

<style scoped></style>
