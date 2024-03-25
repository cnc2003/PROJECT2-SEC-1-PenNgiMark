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
                ? 'w-40 h-32 p-4 border border-gray-300 rounded-md pointer hover:scale-105 transition-all'
                : 'flex'
        "
    >
        <slot name="title">Untitled</slot>
        <slot name="price"></slot>
    </div>
</template>

<style scoped></style>
