<script setup>
import { defineProps, defineEmits, ref } from "vue"
// let menuConfirm = ref([])
// const emits = defineEmits(["close"])

// const props = defineProps({
//     data: Array,
// })
// console.log(props.data)

// menuConfirm.value.push(...props.data) //reactive objects
// menuConfirm.value = menuConfirm.value.slice().reverse()
</script>

<template>
    <div
        class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
    >
        <div
            class="w-lvw h-lvh bg-black bg-opacity-50"
            @click="emits('close')"
        ></div>

        <!-- modal content -->
        <div
            class="fixed w-2/4 h-auto bg-white rounded-xl flex justify-center text-xl p-4"
        >
            <div>
                <p class="text-xl border-b-4 mb-4">This is History Order</p>

            <!-- close button -->
            <img
                class="flex items-startw-4 h-4 hover:cursor-pointer"
                @click="emits('close')"
                src="/src/assets/icon/cross.svg"
            />
        </div>
    </div>
    </div>
</template>

<style scoped></style>
