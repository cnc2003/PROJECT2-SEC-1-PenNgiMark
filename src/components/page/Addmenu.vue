<script setup>
import { ref } from "vue"

import { getList } from "../../lib/fetch.js"
import CartList from "../CartList.vue"
import JsxIconBase from "../JsxIconBase.vue"


const filterResult = ref(null) //default data
const afterFilterResult = ref(null) // default value

async function fetchMenuData() {
    filterResult.value = await getList("Menus") // is array
    for (const key in filterResult.value) {
        console.log(key)
    }
}
fetchMenuData()

function filterCategory(category) {
    if (filterResult.value.hasOwnProperty(category)) {
        afterFilterResult.value = { [category]: filterResult.value[category] }
        console.log(afterFilterResult.value)
    } else {
        afterFilterResult.value = filterResult.value
    }
}

const mocDrinks = [
    {
        menu_name: "Espresso",
        price: 75,
        quantity: 1,
        sweetnessLevel: 0,
        isDineIn: true,
        category: "Drinks",
    },
    {
        menu_name: "Americano",
        price: 75,
        quantity: 3,
        sweetnessLevel: 0,
        isDineIn: false,
        category: "Drinks",
    },
    {
        menu_name: "Cappuccino",
        price: 75,
        quantity: 1,
        sweetnessLevel: 0,
        isDineIn: false,
        category: "Drinks",
    },
]
const menusInCart = ref(mocDrinks)

const paymentMethod = ref("")

</script>
<template>
    <div class="flex h-full w-full">
        <section class="border-2 border-white w-3/4">
            this must be category list
            <div class="flex border-2 w-1/2">
                <div
                    v-for="(category, key) in filterResult"
                    :key="category"
                    class="p-3 rounded-md"
                >
                    <div
                        @click="filterCategory(key)"
                        class="bg-slate-300 p-2 rounded-md"
                    >
                        {{ key }}
                    </div>
                </div>
            </div>

            this must be menus list
            <div>
                <!-- loop category -->

                <div
                    v-for="(category, key) in afterFilterResult === null
                        ? filterResult
                        : afterFilterResult"
                    :key="key"
                    class="p-3 rounded-md"
                >
                    <!-- loop menulist in category  -->
                    <div v-for="menus in category" class="border-2 p-2 m-1">
                        <!-- loop menu in menulist  -->
                        <div v-for="menu in menus">
                            <div>{{ menu }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="flex flex-col border-2 border-black h-dvh w-1/4">
            <div
                class="flex justify-evenly border-2 border-black my-1 mx-2 h-20 p-1"
            >
                <button class="border-2 border-black rounded-md h-full">
                    Dine in
                </button>
                <button class="border-2 border-black rounded-md h-full">
                    Take away
                </button>
            </div>
            <CartList :menusInCart="menusInCart" />
            <div class="border-2 border-black m-2 h-1/5">Payment Summary</div>
            <div
                class="flex flex-col justify-evenly border-2 border-black h-28 mx-2 px-2 pb-2"
            >
                Payment Method
                <div class="flex justify-evenly mt-3 h-12">
                    <button
                        class="flex justify-center items-center border-2 border-black rounded-md h-full w-16"
                        @click="paymentMethod = 'cash'"
                    >
                        <JsxIconBase iconName="Cash"/>
                    </button>
                    <button
                        class="flex justify-center items-center border-2 border-black rounded-md h-full w-16"
                        @click="paymentMethod = 'card'"
                    >
                        <JsxIconBase iconName="Card" />
                    </button>
                    <button
                        class="flex justify-center items-center border-2 border-black rounded-md h-full w-16"
                        @click="paymentMethod = 'QR'"
                    >
                        <JsxIconBase iconName="QR" />
                    </button>
                </div>
            </div>
            <button class="border-2 border-black h-20 m-2 mb-6">
                Place Order
            </button>
        </section>
    </div>
</template>
