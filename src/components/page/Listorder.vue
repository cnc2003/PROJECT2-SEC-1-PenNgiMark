<script setup>
import BaseList from "../BaseList.vue"
import orderlist from "../../../public/data/orderlist.json"
import sales_data from "../../../public/data/sales_data.json"
import { ref } from "vue"

const Orderlist = ref(orderlist)
const Order_menu = ref(orderlist)
const Sales_data = ref(sales_data)

function deleteOrder(order_ID) {
    const orders = order_ID.orders
    for (const menu of orders) {
        if (menu.selected === true) {
            const orderIndex = orders.findIndex(order => order === menu)
                orders.splice(orderIndex, 1)
                console.log("total list :",Order_menu.value)

        }
    }
}

function serveOrder(order_ID) {
    console.log("Serve button clicked:", order_ID)
    const orders = order_ID.orders
    for (const menu of orders) {
        if (menu.selected === true) {
            Sales_data.value.push(menu)
            console.log("Selected menu:", Sales_data.value)
        }
    }
}

</script>

<template class="">
    <h1 class="text-3xl bg-green-400 w-1/6">This is the List Order page</h1>
    <BaseList :Order_menu_list="Orderlist">
        <template v-slot:Order_ID="order_ID">
            <div>{{ order_ID.order_id }}</div>
            <template v-for="(order_menu, orderIndex) in order_ID.orders" :key="orderIndex">
                <div>{{ order_menu.menu_name }}</div>
                <div>{{ order_menu.quantity }}</div>
                <div>{{ order_menu.details }}</div>
                <input type="checkbox" v-model="order_menu.selected" />
            </template>
            <button class="bg-green-600" @click="serveOrder(order_ID), deleteOrder(order_ID)">
                Serve
            </button>
        </template>
    </BaseList>
</template>



