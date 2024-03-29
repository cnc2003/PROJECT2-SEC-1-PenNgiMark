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
                ? 'w-64 h-96 m-3 border-4 border-gray-300 rounded-3xl cursor-pointer hover:scale-105 transition-all'
                : 'flex'
        "
    >
        <slot name="modal">
            
        </slot>
        <slot name="title"></slot>
    </div>
</template>

<style scoped></style>
