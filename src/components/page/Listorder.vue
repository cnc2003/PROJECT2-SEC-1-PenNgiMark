<script setup>
import { ref } from "vue"
import BaseList from "../BaseList.vue"
import { AddManement } from "../../lib/fetch.js"

const manement = ref(null)
async function getManement() {
    manement.value = await AddManement()
    console.log("getManement :", manement.value)
}
getManement()

const post = ref([])
function serveOrder(order, index) {
    const order_ID = order.order_id
    // const order_ID = "0012435"
    console.log(order_ID)
    const selectedMenus = order.orders.filter((menu) => menu.selected)
    for (let i = 0; i < manement.value.length; i++) {
        console.log(manement.value[i].order_id, order_ID)
        if (order_ID != manement.value[i].order_id) {
            post.value.push({ order_id: order.order_id })
        } else {
            console.log(manement.value[i].order_id)
            post.value.push(...selectedMenus)
        }
    }
    console.log("After Push Manement :", post.value)
}
</script>

<template>
    <Suspense>
        <BaseList>
            <template #Order="{ order, index }">
                <div
                    class="w-full flex justify-between border-4 border-[#FFF3CF] bg-[#FFF3CF] shadow-lg mt-12 ml-4"
                >
                    <div
                        class="flex flex-col justify-center items-center bg-green-200 w-1/4"
                    >
                        <p class="font-bold">Order_ID</p>
                        <!-- ดึง ordermenu มาแสดง ผ่านตัวแปร Objec order_ID -->
                        <div>{{ order.order_id }}</div>
                    </div>
                    <div class="flex w-full">
                        <div class="flex flex-wrap">
                            <div v-for="order_menu in order.orders">
                                <div class="bg-[#E8C872] p-4 m-2 h-40 w-48">
                                    <div>Menu : {{ order_menu.menu_name }}</div>
                                    <div>
                                        quantity : {{ order_menu.quantity }}
                                    </div>
                                    <div>details :{{ order_menu.details }}</div>
                                    <input
                                        type="checkbox"
                                        v-model="order_menu.selected"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        class="bg-[#5cdb5c] w-1/4"
                        @click="
                            serveOrder(order, index)
                            // deleteOrder(order, index)
                        "
                    >
                        Serve
                    </button>
                </div>
            </template>
        </BaseList>
    </Suspense>
</template>

<style scoped></style>
