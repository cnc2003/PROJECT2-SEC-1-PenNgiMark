<script setup>
import { ref, computed } from "vue"

// const props = defineProps({
//     menu_name: String,
//     price: Number,
//     quantity: Number,
//     sweetnessLevel: {
//         type: String,
//         validator: (value) => ["0", "25", "50", "100"].includes(value),
//     },
//     // isDineIn: Boolean,
//     // category: String,
// })

// const totalQuantity = computed(() => {
//     return props.cart.reduce((acc, item) => acc + item.quantity, 0)
// })
</script>

<template>
    <div class="flex gap-12 justify-around">
        <div class="flex-1">
            <slot name="drinkName">NAME</slot>
            <slot name="sweet"></slot>
        </div>
        <div class="flex flex-none items-center mr-6">
            <!-- <button>-</button> -->
            <slot name="quantity">QUANTITY</slot>
            <!-- <button>+</button> -->
        </div>
    </div>
</template>
