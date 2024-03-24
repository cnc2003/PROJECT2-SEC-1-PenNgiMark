<script setup>
import { ref, computed } from "vue"
import CartCard from "./CartCard.vue"
const props = defineProps({
    menusInCart: Array,
})

const menuCart = computed(() => props.menusInCart)
</script>

<template>
    <div class="border-2 border-black m-2 h-full">
        <h2>Total Items ( {{ menusInCart.length }} )</h2>
        <div v-for="(menu, index) in menuCart">
            <CartCard>
                <template #drinkName>
                    <b>{{ menu.menu_name }}</b>
                </template>
                <template #sweet>
                    <p>{{ menu.sweetnessLevel }}%</p>
                </template>
                <template #quantity>
                    <button
                        @click="menu.quantity <= 1 ? null : menu.quantity--"
                    >
                        -
                    </button>
                    <p>{{ menu.quantity }}</p>
                    <button @click="menu.quantity++">+</button>
                </template>
            </CartCard>
            <hr v-show="index + 1 !== menusInCart.length" class="mx-3" />
        </div>
    </div>
</template>

<style scoped></style>
