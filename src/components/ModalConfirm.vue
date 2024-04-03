<script setup>
import JsxIconBase from "./JsxIconBase.vue"

const props = defineProps({
    action: { type: String, require: true },
})

const emits = defineEmits(["close", "serve", "placeOrder", "actionComfirm"])

const cancelConfirmation = () => {
    emits("close", false)
}

const confirmAction = () => {
    if (props.action === "Serve") {
        emits("serve", true)
    } else if (props.action === "placeOrder") {
        emits("placeOrder", true)
    }else if (props.action === 'Delete-Promotion') {
        emits("actionComfirm", props.action, true)
    }else {
        emits("actionComfirm", props.action, true)
    }
    cancelConfirmation()
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
                            v-if="props.action === 'Delete-Promotion'"
                            iconName="Exclamation-triangle"
                            :w="24"
                            :h="24"
                            color="red"
                            class="flex justify-center"
                        />
                        <JsxIconBase
                            v-else
                            iconName="Question-circle"
                            :w="24"
                            :h="24"
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
                                : props.action === "Delete-Promotion"
                                ? "Do you want to delete this Promotion ?"
                                : props.action === 'Save-Promotion' ? "Save this Promotion?":"Confirmation"
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
                            class="btn text-white"
                            :class="
                                props.action === 'Delete-Promotion'
                                    ? 'btn-error'
                                    : 'btn-success'
                            "
                            @click="confirmAction"
                            v-if="
                                props.action === 'Serve' ||
                                props.action === 'placeOrder' ||
                                props.action === 'Delete-Promotion' || 
                                props.action === 'Save-Promotion' 

                            "
                        >
                            {{
                                props.action === "Serve"
                                    ? "serve"
                                    : props.action === "Delete-Promotion"
                                    ? "Delete"
                                    : props.action === 'Save-Promotion' ? "Save" : "place order"
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>