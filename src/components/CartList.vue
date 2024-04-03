<script setup>
import { ref, computed } from "vue"
import CartCard from "./CartCard.vue"
import JsxIconBase from "./JsxIconBase.vue"
const props = defineProps({
    menusInCart: Array,
})

const menuCart = computed(() => props.menusInCart)

const totalDrinks = computed(() => {
    return menuCart.value.reduce((acc, curr) => acc + curr.quantity, 0)
})
</script>

<template>
    <div class="bg-white h-full rounded-2xl p-3">
        <h2 class="font-bold text-2xl">Total Menu ({{ totalDrinks }})</h2>
        <span class="divider my-[1px]"></span>
        <div class="overflow-auto w-full h-[92%]">
            <div v-for="(menu, index) in menuCart" :key="index">
                <CartCard>
                    <template #drinkName>
                        <b>{{ menu.menu_name }}</b>
                    </template>
                    <template #sweet>
                        <p>{{ menu.sweetnessLevel }}</p>
                    </template>
                    <template #quantity>
                        <JsxIconBase
                            iconName="Minus-circle"
                            class="hover:scale-[105%] w-6 h-6"
                            @click="menu.quantity <= 1 ? null : menu.quantity--"
                        />
                        <p class="text-center font-semibold text-2xl w-[33%]">
                            {{ menu.quantity }}
                        </p>
                        <JsxIconBase
                            iconName="Plus-circle"
                            class="hover:scale-[105%] w-6 h-6"
                            @click="menu.quantity++"
                        />
                    </template>
                </CartCard>
                <hr v-show="index + 1 !== menuCart.length" />
            </div>
            <!-- <div
        v-show="index + 1 !== menusInCart.length"
        class="divider divider-horizontal mx-[2px]"
      ></div> -->
        </div>
    </div>
</template>

<style scoped></style>
