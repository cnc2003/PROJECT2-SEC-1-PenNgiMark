<script setup>
import { ref } from "vue"

import { getList } from "../../lib/fetch.js"
import CartList from "../CartList.vue"
import JsxIconBase from "../JsxIconBase.vue"

const filterResult = ref(null) //default data
const afterFilterResult = ref(null) // default value

async function fetchMenuData() {
    filterResult.value = await getList("Menus") // is array
    console.log(filterResult.value)
}

fetchMenuData()

function filterCategory(inputCategory) {
    console.log(inputCategory)
    let t = null
    if (inputCategory === null || inputCategory === "All") {
        afterFilterResult.value = filterResult.value
    } else {
        for (const data in filterResult.value) {
            const categorykey = filterResult.value[data] // category in menu
            // console.log(categorykey.category)

            if (inputCategory === categorykey.category) {
                console.log(categorykey)
                afterFilterResult.value = [categorykey]
            }
        }
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
            <div class="flex justify-center border-2 w-1/2 rounded-md">
                <div
                    class="bg-slate-300 p-4 m-2 rounded-md btn btn-md"
                    @click="filterCategory('All')"
                >
                    All
                </div>
                <div
                    v-for="propoty in filterResult"
                    class="bg-slate-300 p-2 m-2 rounded-md btn btn-md"
                    @click="filterCategory(propoty.category)"
                >
                    {{ propoty.category }}
                </div>
            </div>

            this must be menus list
            <div>
                <!-- loop category -->

                <div
                    v-for="(itemList, category) in afterFilterResult === null
                        ? filterResult
                        : afterFilterResult"
                    :key="category"
                    class="flex flex-wrap w-full h-auto gap-2"
                >
                    <!-- แสดงชื่อ category -->
                    <h2 class="w-full font-mono text-lg font-semibold">
                        {{ itemList.category }}
                    </h2>
                    <!-- แสดง menu items ในแต่ละ category -->
                    <div
                        v-for="(items, key) in itemList.menus"
                        :key="key"
                        name="menuContainer"
                        class="flex flex-row gap-4 flex-wrap justify-items-center items-center pl-4"
                    >
                        <div
                            class="w-40 h-32 p-4 border border-gray-300 rounded-md pointer hover:scale-105 transition-all"
                        >
                            <p>{{ items.menu_name }}</p>
                            <p>{{ items.price }}</p>
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
                        <JsxIconBase iconName="Cash" />
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
