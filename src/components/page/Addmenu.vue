<script setup>
import { ref, watch, computed, onMounted } from "vue"

import { getList, addItem } from "../../lib/fetch.js"
import CartList from "../CartList.vue"
import JsxIconBase from "../JsxIconBase.vue"
import ModalConfirm from "../ModalConfirm.vue"

const filterResult = ref(null) //default data
const afterFilterResult = ref(null) // default value
const promotions = ref([])
const orderNo = ref(0)
const discount = ref(0)
const subtotalPrice = ref(0)
const menusInCart = ref([])
const paymentMethod = ref("")
let selectedmenus = []
const showModalConfirm = ref(false)
const modalAction = ref("")
const allSelected = ref(true)

onMounted(async () => {
    const [menusRes, promotionsRes] = await Promise.all([
        getList("Menus"),
        getList("Promotions"),
    ])
    newOrderNo()
    promotions.value = promotionsRes.data
    filterResult.value = menusRes.data
})

function filterCategory(inputCategory) {
    // console.log(inputCategory)
    if (inputCategory === null || inputCategory === "All") {
        afterFilterResult.value = filterResult.value
    } else {
        for (const data in filterResult.value) {
            const categorykey = filterResult.value[data] // category in menu
            // // console.log(categorykey.category)

            if (inputCategory === categorykey.category) {
                // console.log(categorykey)
                afterFilterResult.value = [categorykey]
            }
        }
    }
}

const newOrderNo = () => {
    orderNo.value = Math.floor(Math.random() * 1000000)
}

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
        // // console.log(newCart.value)
        calculateDiscount()
        getSubtotalPrice()
    },
    { deep: true, immediate: true }
)

const totalPrice = computed(() => {
    return subtotalPrice.value - discount.value
})

const openModal = (action) => {
    if (!showModalConfirm.value) {
        showModalConfirm.value = true
    }
    modalAction.value = action
}

const placeOrder = async () => {
    if (menusInCart.value.length === 0) {
        openModal("EmptyCart")
        return
    }
    if (paymentMethod.value === "") {
        openModal("EmptyPayment")
        return
    }
    let orderMenu = {
        order_number: orderNo.value,
        menus: menusInCart.value,
        paymentMethod: paymentMethod.value,
        totalPrice: totalPrice.value,
    }

    const [resToOrderList, resToManage] = await Promise.all([
        addItem("OrderLists", orderMenu),
        addItem("Management", orderMenu),
    ])

    if (resToOrderList.resCode !== 201 && resToManage.resCode !== 201) {
        alert("Failed to place order")
        return
    }

    menusInCart.value = []
    paymentMethod.value = ""
    newOrderNo()
}

function ToggleClick(item) {
    if (selectedmenus.length > 0) {
        selectedmenus[0].selected = false
        selectedmenus.shift()
    }
    item.selected = true
    selectedmenus.push(item)
}

function confirmOption(item, propoty) {
    if (item.sweetnessLevel === undefined || item.sweetnessLevel === "") {
        // alert("Please select sweetness level")
        openModal("SweetnessLevel")
        return
    }
    selectedmenus[0].selected = false

    let addToCart = {
        menu_name: item.menu_name,
        price: item.price,
        quantity: 1,
        selected: item.selected,
        sweetnessLevel: item.sweetnessLevel,
        category: propoty.category,
    }

    for (const data in menusInCart.value) {
        const cartItem = menusInCart.value[data]
        if (
            cartItem.menu_name === addToCart.menu_name &&
            cartItem.sweetnessLevel === addToCart.sweetnessLevel
        ) {
            cartItem.quantity++
            return
        }
    }
    
    menusInCart.value.push(addToCart)
}
function cancelOption(item) {
    selectedmenus[0].selected = false
}

function selectedCategory(category) {
    for (const data in filterResult.value) {
        const categorykey = filterResult.value[data]
        if (category === "All" || category === categorykey.category) {
            categorykey.selected = true
            allSelected === false
        } else {
            categorykey.selected = false
            allSelected === true
        }
    }
}

function closeOtherButtons() {
    for (const data in filterResult.value) {
        const categorykey = filterResult.value[data]
        categorykey.selected = false
    }
}

const sweetBtn = ref(
    "py-2 w-[25%] text-black rounded-2xl border border-1 cursor-pointer text-sm text-center font-semibold hover:scale-105 transition duration-300 hover:bg-pink-100 hover:border-pink-500"
)
</script>
<template>
    <div class="flex h-full w-full shrink-0">
        <section
            class="border-2 border-white w-3/4 h-full p-4"
            @click="closeModal"
        >
            <!-- this must be category list -->
            <div name="category" class="flex flex-col w-full p-4">
                <h1 class="text-3xl font-bold mb-4">Categories</h1>
                <div name="categoryContainer" class="flex flex-row flex-wrap">
                    <div
                        :class="{
                            'bg-blue-700 text-white': allSelected,
                            'bg-slate-300 text-gray-700': !allSelected,
                        }"
                        class="p-6 px-8 m-2 rounded-xl btn btn-md font-semibold text-lg flex content-center"
                        @click="
                            () => {
                                filterCategory('All')
                                selectedCategory('All')
                                allSelected = true
                                closeOtherButtons()
                            }
                        "
                    >
                        All
                    </div>
                    <div
                        v-for="propoty in filterResult"
                        :key="propoty"
                        class="p-4 px-6 m-2 rounded-xl btn btn-md font-semibold text-lg flex content-center"
                        @click="
                            () => {
                                filterCategory(propoty.category)
                                selectedCategory(propoty.category)
                                allSelected = false
                            }
                        "
                        :style="
                            propoty.selected
                                ? 'background-color: blue; color: white'
                                : 'background-color: slate-300; color: gray'
                        "
                    >
                        {{ propoty.category }}
                    </div>
                </div>
                <h1 class="text-2xl font-bold mt-8 divider divider-start">
                    Select Drink Menu
                </h1>
            </div>

            <!-- this must be menus list -->
            <div class="h-[78%] w-full overflow-y-scroll">
                <!-- loop category -->

                <div
                    v-for="(propoty, category) in afterFilterResult === null
                        ? filterResult
                        : afterFilterResult"
                    :key="category"
                    class="flex flex-wrap w-full h-auto gap-2 px-4 mb-4"
                >
                    <!-- แสดงชื่อ category -->
                    <hr
                        v-show="category !== 0"
                        class="w-full h-px bg-gray-200 border-2"
                    />
                    <!-- แสดง menu items ในแต่ละ category -->
                    <div v-for="(item, key) in propoty.menus" :key="key">
                        <div @click="ToggleClick(item)">
                            <div
                                class="text-gray-800 shadow-lg card w-80 h-auto m-3 cursor-pointer hover:scale-105 transition-all"
                            >
                                <div v-if="!item.selected">
                                    <figure
                                        class="image-full min-h-44 max-h-32 w-70"
                                    >
                                        <img
                                            :src="item.img_src"
                                            alt="MenuImage"
                                            class="min-h-43 w-70 rounded-t-3xl"
                                        />
                                    </figure>
                                    <div class="card-body gap-1 h-48">
                                        <div class="card-title w-full">
                                            <p class="text-2xl font-bold">
                                                {{ item.menu_name }}
                                            </p>
                                            <p
                                                v-text="item.price + ' ฿'"
                                                class="font-bold text-end"
                                            ></p>
                                        </div>

                                        <p
                                            class="card-description h-auto overflow-hidden"
                                        >
                                            {{ item.description }}
                                        </p>
                                    </div>
                                </div>

                                <div v-if="item.selected">
                                    <div
                                        class="flex flex-col items-center justify-center card w-80 h-96 bg-[url(item.img_src)]"
                                    >
                                        <!-- <img :src="item.img_src" alt="img" class="absolute opacity-80"> -->

                                        <img
                                            src="/src/assets/icon/sugar-pink.png"
                                            alt="sugar"
                                            class="size-20"
                                        />
                                        <div class="flex justify-center w-full">
                                            <p
                                                class="text-2xl font-bold text-pink-500 my-4 divider divider-secondary w-[90%]"
                                            >
                                                Sugar Level
                                            </p>
                                        </div>
                                        <div
                                            class="text-xl w-full border-opacity-50 flex flex-row gap-2 justify-center my-4"
                                        >
                                            <input
                                                type="radio"
                                                id="no_sugar"
                                                name="sweetLevel"
                                                value="No sugar"
                                                v-model="item.sweetnessLevel"
                                                class="hidden peer/no_sugar"
                                            /><label
                                                for="no_sugar"
                                                class="peer-checked/no_sugar:bg-pink-200 hover:text-pink-400"
                                                :class="sweetBtn"
                                            >
                                                No Sugar</label
                                            >
                                            <input
                                                type="radio"
                                                id="low_sugar"
                                                name="sweetLevel"
                                                value="Low sugar"
                                                v-model="item.sweetnessLevel"
                                                class="hidden peer/low_sugar"
                                            />
                                            <label
                                                for="low_sugar"
                                                class="peer-checked/low_sugar:bg-pink-400 hover:text-pink-600"
                                                :class="sweetBtn"
                                                >low Sugar</label
                                            >

                                            <input
                                                type="radio"
                                                id="normal"
                                                name="sweetLevel"
                                                value="normal"
                                                v-model="item.sweetnessLevel"
                                                class="hidden peer/normal"
                                            />
                                            <label
                                                for="normal"
                                                class="peer-checked/normal:bg-pink-600 hover:text-pink-800"
                                                :class="sweetBtn"
                                                >Normal</label
                                            >
                                        </div>
                                        <br />
                                        <div
                                            class="flex w-full h-auto justify-center items-end gap-2"
                                        >
                                            <button
                                                class="hover:bg-yellow-400 cursor-pointer bg-yellow-100 text-slate-900 font-semibold py-2 px-8 border border-yellow-500 rounded-xl shadow hover:underline hover:transition hover:duration-300 underline-offset-4"
                                                @click.stop="cancelOption(item)"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                class="hover:bg-green-400 hover:border-green-400 cursor-pointer bg-green-500 text-slate-900 font-semibold py-2 px-10 border border-green-400 rounded-xl shadow hover:underline hover:transition hover:duration-300 underline-offset-4"
                                                @click.stop="
                                                    confirmOption(item, propoty)
                                                "
                                            >
                                                OK
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-----------------------------------
     ---------- Cart section ------------
     ------------------------------------>
        <section
            class="flex flex-col gap-2 bg-base-200 h-full w-1/4 p-4 justify-center"
        >
            <div class="bg-white h-[8%] w-full p-2 rounded-2xl">
                <span class="font-bold text-md">Order No.</span>
                <span class="text-blue-600 text-4xl ml-12">{{ orderNo }}</span>
            </div>
            <CartList :menusInCart="menusInCart" class="h-[60%]" />
            <div
                class="bg-white h-[16%] min-h-[150px] w-full py-2 px-2 rounded-2xl text-lg"
            >
                <span class="font-semibold">Payment Summary</span>
                <div class="flex justify-between">
                    <p>Subtotal</p>
                    <p>{{ subtotalPrice }} ฿</p>
                </div>
                <div class="flex justify-between">
                    <p>Discount</p>
                    <p>{{ discount }} ฿</p>
                </div>
                <span class="divider my-[1px]"></span>
                <div class="flex justify-between">
                    <b>Total Price</b>
                    <b>{{ totalPrice }} ฿</b>
                </div>
            </div>
            <div
                class="flex flex-col justify-evenly h-[10%] p-2 bg-white w-full rounded-2xl text-lg"
            >
                <span class="font-semibold pb-2"> Payment Method </span>
                <div class="flex justify-evenly h-12">
                    <input
                        type="radio"
                        id="cash"
                        value="cash"
                        v-model="paymentMethod"
                        class="hidden peer/cash"
                    />

                    <label
                        for="cash"
                        class="peer-checked/cash:bg-blue-600 peer-checked/cash:text-white transition duration-300 ease-linear hover:text-pink-800 flex justify-center gap-2 items-center rounded-md h-full w-[28%] px-4"
                        :class="sweetBtn"
                    >
                        <JsxIconBase iconName="Cash" />
                        Cash
                    </label>
                    <input
                        type="radio"
                        id="card"
                        value="card"
                        v-model="paymentMethod"
                        class="hidden peer/card"
                    />

                    <label
                        for="card"
                        class="peer-checked/card:bg-blue-600 peer-checked/card:text-white hover:text-pink-800 flex justify-center gap-2 items-center rounded-md h-full w-[28%] px-4"
                        :class="sweetBtn"
                    >
                        <JsxIconBase iconName="Card" />
                        Card
                    </label>
                    <input
                        type="radio"
                        id="QR"
                        value="QR"
                        v-model="paymentMethod"
                        class="hidden peer/QR"
                    />

                    <label
                        for="QR"
                        class="peer-checked/QR:bg-blue-600 peer-checked/QR:text-white transition duration-300 ease-linear hover:text-pink-800 flex justify-center gap-2 items-center rounded-md h-full w-[28%] px-4"
                        :class="sweetBtn"
                    >
                        <JsxIconBase iconName="QR" />
                        QR
                    </label>
                </div>
            </div>

            <button
                class="h-[10%] w-full bg-blue-600 text-white rounded-2xl font-semibold text-xl hover:bg-blue-500 hover:scale-95 transition duration-300 ease-linear"
                @click="openModal('placeOrder')"
            >
                Place Order
            </button>
            <div v-show="showModalConfirm">
                <ModalConfirm
                    :action="modalAction"
                    @close="showModalConfirm = $event"
                    @placeOrder="placeOrder"
                />
            </div>
        </section>
    </div>
</template>

<style>
.selected {
    background-color: blue;
    color: white;
}

.nuero {
    border-radius: 1rem;
    background: #ffffff;
    box-shadow: inset 6px 6px 11px #ebebeb, inset -6px -6px 11px #ffffff;
}
</style>
