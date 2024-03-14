<script setup>
import { ref ,defineProps } from "vue"
import BaseList from "../BaseList.vue"
import orderlists from "../../../public/data/orderlist.json"
import sales_data from "../../../public/data/sales_data.json"

const Order_queue_data = ref(orderlists)
const Sales_data = ref(sales_data)


function deleteOrder(order_ID, index) {
    const order_menu = order_ID.orders
    // loop memu in orders
    for (let i = 0; i < order_menu.length; i++) {
        const menu = order_menu[i]
        console.log('Before :',i)
        if (order_menu.length > 0) {
            if (menu.selected === true) {
                // menu = selected ให้ลบออกจาก orders
                order_menu.splice(i, 1)
                console.log("Removed menu:", menu)
                i-- // -i ลดขนาดของ array
                
            }
        }
        console.log('After :',i)
        if (order_menu.length === 0) {
            Order_queue_data.value.splice(index, 1)
            console.log(Order_queue_data)
        }
    }
    console.log("Updated order:", order_menu)
    console.log("Order is empty, deleted:", order_ID)
}

function serveOrder(order_ID, index) {
    console.log("Serve button clicked:", order_ID, "index :", index)
    const order_menu = order_ID.orders
    for (const menu of order_menu) {
        if (menu.selected === true) {
            console.log("push:", menu)
            Sales_data.value.push(menu)
        }
    }
    console.log("Selected menu:", Sales_data.value)
}
</script>

<template>
    <h1 class="text-3xl bg-green-400 w-1/6">This is the List Order page</h1>

    <BaseList :Order_menu_list="Order_queue_data">
        <template
            v-slot:Order_ID="{ order_ID, index }"
        >
            <!-- ดึง ordermenu มาแสดง ผ่านตัวแปร Objec order_ID -->
            <div
                class="w-full flex justify-between border-4 border-[#FFF3CF] bg-[#FFF3CF] shadow-lg mt-12 ml-4"
            >
                <div class="flex">
                    <div class="flex flex-col justify-center bg-sky-200 p-10">
                        <p class="font-bold">Order_ID</p>
                        <div>{{ order_ID.order_id }}</div>
                    </div>
                    <div class="flex flex-wrap ml-2 mr-2 justify-center">
                        <template v-for="order_menu in order_ID.orders">
                            <div class="bg-[#E8C872] p-4 m-2 w-32">
                                <div>{{ order_menu.menu_name }}</div>
                                <div>quantity : {{ order_menu.quantity }}</div>
                                <div>{{ order_menu.details }}</div>
                                <input
                                    type="checkbox"
                                    v-model="order_menu.selected"
                                />
                            </div>
                        </template>
                    </div>
                </div>
                <button
                    class="bg-[#5cdb5c] w-40"
                    @click="
                        serveOrder(order_ID, index),
                            deleteOrder(order_ID, index)
                    "
                >
                    Serve
                </button>
            </div>
        </template>
    </BaseList>
</template>
