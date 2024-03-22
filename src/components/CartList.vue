<script setup>
import { ref, computed } from "vue"
import CartCard from "./CartCard.vue"
const props = defineProps({
    menusInCart: Array,
})
</script>

<template>
    <div class="border-2 border-black m-2 h-full">
        <h2>Total Items ( {{ menusInCart.length }} )</h2>
        <div v-for="(menu, index) in menusInCart">
            <CartCard>
                <template #drinkName>
                    <b>{{ menu.menu_name }}</b>
                </template>
                <template #sweet>
                    <p>{{ menu.sweetnessLevel }}%</p>
                </template>
                <template #quantity>
                    {{ menu.quantity }}
                </template>
            </CartCard>
            <hr v-show="index + 1 !== menusInCart.length" class="mx-3" />
        </div>
    </div>
</template>

<style scoped></style>
