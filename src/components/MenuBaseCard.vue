<script setup>
const props = defineProps({
    variant: {
        type: String,
        default: "menuList",
    },
})
</script>

<template>
    <div
        :class="
            variant === 'menuList'
                ? 'text-gray-800 shadow-lg card w-80 h-auto m-3 cursor-pointer hover:scale-105 transition-all'
                : 'flex'
        "
    >
        <slot name="modal"> </slot>
        <slot name="title"></slot>
    </div>
</template>

<style scoped></style>
