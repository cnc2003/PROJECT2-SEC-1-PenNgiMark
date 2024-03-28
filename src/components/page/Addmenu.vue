<script setup>
import { ref, watch, computed, onMounted } from "vue"

import { getList } from "../../lib/fetch.js"
import CartList from "../CartList.vue"
import JsxIconBase from "../JsxIconBase.vue"
import MenuBaseCard from "../MenuBaseCard.vue"

const filterResult = ref(null) //default data
const afterFilterResult = ref(null) // default value
const promotions = ref([])
const discount = ref(0)
const subtotalPrice = ref(0)
const isShowOptionMenu = ref(false)
let selectedmenus = []

async function fetchMenuData() {
    filterResult.value = await getList("Menus") // is array
    console.log(filterResult.value)
}
fetchMenuData()

onMounted(async () => {
    const [menusRes, promotionsRes] = await Promise.all([
        getList("Menus"),
        getList("Promotions"),
    ])
    fetchMenuData()
    promotions.value = promotionsRes
    // filterResult.value = menusRes
})

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

const calculateDiscount = () => {
    let totalDiscount = 0

    for (const promotion of promotions.value) {
        if (
            promotion.menus.every((promoItem) => {
                const cartItem = menusInCart.value.find(
                    (item) => item.menu_name === promoItem.menuName
                )
                return cartItem && cartItem.quantity >= promoItem.quantity
            })
        ) {
            const discountAmount = promotion.discount
            totalDiscount += discountAmount
        }
    }
    discount.value = totalDiscount
    // return totalDiscount
}

const getSubtotalPrice = () => {
    let price = 0
    menusInCart.value.forEach((item) => {
        price += item.price * item.quantity
    })
    subtotalPrice.value = price
}
watch(
    () => menusInCart,
    (newCart) => {
        // console.log(newCart.value)
        calculateDiscount()
        getSubtotalPrice()
    },
    { deep: true, immediate: true }
)
const totalPrice = computed(() => {
    return subtotalPrice.value - discount.value
})

const paymentMethod = ref("")

const placeOrder = () => {
    console.log("Place Order")
    if (menusInCart.value.length === 0) {
        alert("Please add some items to cart")
        return
    }
    if (paymentMethod.value === "") {
        alert("Please select payment method")
        return
    }
    const order = {
        orderNumber: Math.floor(Math.random() * 1000000),
        menus: menusInCart.value,
        paymentMethod: paymentMethod.value,
        totalPrice: totalPrice.value,
    }
    console.log(order)
}
function ToggleClick(item) {
    console.log(selectedmenus)
    if (selectedmenus.length > 0) { 
        selectedmenus[0].selected = false
        selectedmenus.shift()
    }
    item.selected = true
    selectedmenus.push(item)

}


function confirmOption(item ,propoty) {
    console.log(propoty.value)
    if (item.sweetnessLevel === undefined || item.sweetnessLevel === '') {
        alert("Please select sweetness level")

    }
    selectedmenus[0].selected = false
    let addToCart = {
        menu_name: item.menu_name,
        price: item.price,
        selected: item.selected,
        sweetnessLevel: item.sweetnessLevel,
        category:propoty.category
       
    }
    // fetchMenuData()
    mocDrinks.push(addToCart)
    console.log("mocDrinks :", mocDrinks)
}
</script>
<template>
    <div class="flex h-full w-full">
        <section class="border-2 border-white w-3/4" @click="closeModal">
            this must be category list
            <div 
            
            class="flex justify-center border-2 w-1/2 rounded-md">
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
            <div >
                <!-- loop category -->

                <div
                    v-for="(propoty, category) in afterFilterResult === null
                        ? filterResult
                        : afterFilterResult"
                    :key="category"
                    class="flex flex-wrap w-full h-auto gap-2"
                >
                    <!-- แสดงชื่อ category -->
                    <h2 class="w-full font-mono text-lg font-semibold mt-10">
                        {{ propoty.category }}
                    </h2>
                    <!-- แสดง menu items ในแต่ละ category -->
                    <div
                        v-for="(item, key) in propoty.menus"
                        :key="key"
                        name="menuContainer"
                        class="flex flex-row gap-4 flex-wrap justify-items-center items-center pl-4"
                    >
                        <div @click="ToggleClick(item)">
                            <MenuBaseCard class="flex flex-col justify-center items-center">
                               
                                <template
                                    #title
                                    v-if="!item.selected"
                                    
                                >
                                    <img
                                        :src="`/images/${item.img_src}`"
                                        alt=""
                                        class="w-40 h-40"
                                    />
                                    <b>{{ item.menu_name }}</b>
                                    <p>{{ item.price }}</p>
                                </template>

                                <template #modal v-if="item.selected">
                                    <div class="flex flex-col justify-center">
                                        <p>Sweetness Level</p>
                                        <br />
                                        <div>
                                            <input
                                                type="radio"
                                                id="light_sweet"
                                                name="sweetLevel"
                                                value="light_sweet"
                                                v-model="item.sweetnessLevel"
                                            />
                                            <label for="light_sweet"
                                                >Light Sweet</label
                                            >
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="sweet"
                                                name="sweetLevel"
                                                value="sweet"
                                                v-model="item.sweetnessLevel"
                                            />
                                            <label for="sweet">Sweet</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="verySweet"
                                                name="sweetLevel"
                                                value="verySweet"
                                                v-model="item.sweetnessLevel"
                                            />
                                            <label for="verySweet"
                                                >Very Sweet</label
                                            >
                                        </div>
                                        <br />
                                        <button @click="confirmOption(item,propoty)">
                                            OK
                                        </button>
                                    </div>
                                </template>
                            </MenuBaseCard>
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
            <div class="border-2 border-black m-2 h-1/5">
                Payment Summary
                <div class="flex justify-between">
                    <p>Subtotal</p>
                    <p>{{ subtotalPrice }}</p>
                </div>
                <div class="flex justify-between">
                    <p>Discount</p>
                    <p>
                        {{ discount }}
                    </p>
                </div>
                <hr class="mx-3" />
                <div class="flex justify-between">
                    <p>Total Price</p>
                    <p>
                        {{ totalPrice }}
                    </p>
                </div>
            </div>
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
            <button
                class="border-2 border-black h-20 m-2 mb-6"
                @click="placeOrder"
            >
                Place Order
            </button>
        </section>
    </div>
</template>
