<script>
import { ref } from "vue"
import BaseList from "../BaseList.vue"

let test = ref([])

function serveOrder(order) {
    test.value.push(order)
    console.log(order.value)
}
</script>

<template>
    <h1 class="text-3xl bg-green-400 w-1/6">this is page Listorder</h1>

    <BaseList :orders="$orderlist">
        <template #default="{ order }">
            <div class="flex">
                <div class="w-1/4">{{ order.menu_name }}</div>
                <div class="w-2/4">{{ order.quantity }}</div>
                <div class="w-auto">{{ order.details }}</div>
                <button class="bg-green-600" @click="serveOrder(order)">
                    Serve
                </button>

            </div>
        </template>
    </BaseList>
</template>
