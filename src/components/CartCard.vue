<script setup>
import { ref, computed } from "vue"

</script>

<template>
    <div class="flex gap-12 justify-around my-2 overflow-auto text-xl">
        <div class="flex-1">
            <slot name="drinkName">NAME</slot>
            <slot name="sweet"></slot>
        </div>
        <div class="flex flex-row items-center w-[30%]">
            <!-- <button>-</button> -->
            <slot name="quantity">QUANTITY</slot>
            <!-- <button>+</button> -->
        </div>
    </div>
</template>
