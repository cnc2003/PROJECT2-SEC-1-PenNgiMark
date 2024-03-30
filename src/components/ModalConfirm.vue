<script setup>
import { ref } from "vue"
import JsxIconBase from "./JsxIconBase.vue"

const props = defineProps({
    action: { type: String, require: true },
})

const emits = defineEmits(["close", "serve", "placeOrder"])

const cancelConfirmation = () => {
    emits("close", false)
}

const confirmAction = () => {
    cancelConfirmation()
    if (props.action === "Serve") {
        emits("serve", true)
    } else if (props.action === "placeOrder") {
        emits("placeOrder", true)
    }
}
</script>
<template>
    <div @click="emits('close', false)">
        <!-- ModalConfirm -->
        <div
            class="z-10 fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
        >
            <div class="w-lvw h-lvh bg-black bg-opacity-50"></div>
            <div
                class="fixed w-4/12 h-3/6 bg-white rounded-xl flex flex-col items-center justify-center indicator"
                @click.stop=""
            >
                <div class="flex flex-col justify-center">
                    <!-- modal content -->
                    <JsxIconBase
                        iconName="Question-circle"
                        w="24"
                        h="24"
                        class="flex justify-center"
                    />
                    <div class="text-2xl font-semibold m-4 flex justify-center">
                        {{
                            props.action === "EmptyCart"
                                ? "Cart Is Empty"
                                : props.action === "EmptyPayment"
                                ? "Please select payment method"
                                : props.action === "SweetnessLevel"
                                ? "Please select sweetness level"
                                : "Confirmation"
                        }}
                    </div>
                    <div
                        class="mb-10 mt-1"
                        v-if="
                            props.action === 'Serve' ||
                            props.action === 'placeOrder'
                        "
                    >
                        Do you confirm to
                        {{
                            props.action === "Serve"
                                ? "serve Menu"
                                : "place order"
                        }}?
                    </div>
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
                            v-if="
                                props.action === 'Serve' ||
                                props.action === 'placeOrder'
                            "
                        >
                            {{
                                props.action === "Serve"
                                    ? "serve"
                                    : "place order"
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
