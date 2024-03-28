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
                ? 'w-40 h-40 m-6 border border-gray-300 rounded-md pointer hover:scale-105 transition-all'
                : 'flex'
        "
    >
        <slot name="modal">
            
        </slot>
        <slot name="title"></slot>
    </div>
</template>

<style scoped></style>
