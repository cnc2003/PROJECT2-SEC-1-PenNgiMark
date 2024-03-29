<script setup>
import { ref } from "vue"

const emits = defineEmits(["close", "serve"])

const cancelConfirmation = () => {
    showModal.value = false
    emits("close", false)
}

const confirmAction = () => {
    emits("close", false)
    emits("serve", true)
}
</script>
<template>
    <div @click="emits('close', false)">
        <!-- ModalConfirm -->
        <div
            class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
        >
            <div class="w-lvw h-lvh bg-black bg-opacity-50"></div>
            <div
                class="fixed w-1/5 h-3/6 bg-white rounded-xl flex flex-col items-center justify-center indicator"
            >
                <div class="flex flex-col justify-center">
                    <!-- modal content -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="flex justify-centerw-20 h-20"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                        />
                    </svg>
                    <div class="text-2xl font-semibold mb-4 flex justify-center">
                        Confirmation
                    </div>
                    <div class="mb-10 mt-1">Do you confirm to serve Menu?</div>
                    <!-- button -->
                    <div class="flex justify-around">
                        <button
                            class="btn btn-outline btn-warning"
                            @click="cancelConfirmation"
                        >
                            cancel
                        </button>
                        <button
                            class="btn btn-success"
                            @click="confirmAction"
                        >
                            serve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
