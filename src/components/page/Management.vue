<script setup>
// Import necessary modules

import { computed, ref, onMounted, resolveDirective, ssrContextKey } from "vue"
import { getList, PostMenu } from "../../lib/fetch.js"
import PromoModal from "../PromoModal.vue"
import MenuBaseCard from "../MenuBaseCard.vue"

// Define reactive variables
const totalMenu = ref(0)
const totalSold = ref(0)
const totalOrder = ref(0)
const orderData = ref(null)
// Edit variable - Modal
const editingItem = ref({})
const isMenuModal = ref(false)
const isEditMode = ref(false)
const isAddModal = ref(false)
const isAddComplete = ref(false)
const isConfirming = ref(false)
// Filter variables
const selectFilter = ref("")
const filterResult = ref(null)

let afterFilterResult = ref(null) // default value
const promotions = ref([])
const isProModalOpen = ref(false)

// Temp data for update
// INPROGRESS
// const tempMenu = {
//     menu_name: editingItem.menu_name,
//     category: editingItem.new_category
//         ? editingItem.new_category
//         : editingItem.category,
//     description: editingItem.description,
//     price: editingItem.price,
//     img_src: editingItem.img_src,
// }

//fetch GET menulist
async function fetchMenuData() {
    filterResult.value = await getList("Menus") // is array

    console.log(filterResult.value)
    for (const cate in filterResult.value) {
        // cate [ex index = 0,1,2,3,4,5]
        const category = filterResult.value[cate] // {id: '236e', takoyaki: Array(1)}
        console.log("category :", category)
        console.log(category.menus.length)
        totalMenu.value += category.menus.length
        console.log(totalMenu.value)
    }
}

async function fetchOrderData() {
    orderData.value = await getList("OrderLists")
    totalOrder.value = orderData.value.length
    console.log(totalSold.value)
    calTotalOrder()
    // console.log("----------")
    // console.log(totalSold.value)
    // console.log(totalOrder.value)
    // console.log(orderData.value)
}

onMounted(async () => {
    const [menusRes, promotionsRes] = await Promise.all([
        getList("Menus"),
        getList("Promotions"),
    ])
    fetchMenuData()
    promotions.value = promotionsRes
    // filterResult.value = menusRes
})

// Function to filter categories

function filterCategory(inputCategory) {
    console.log(inputCategory)
    let t = null
    if (inputCategory === null || inputCategory === "All") {
        afterFilterResult.value = filterResult.value
    } else {
        for (const data in filterResult.value) {
            const categorykey = filterResult.value[data] // category in menu
            console.log(categorykey.category)

            if (inputCategory === categorykey.category) {
                console.log(categorykey)
                afterFilterResult.value = [categorykey]
            }
        }
    }
}

function calTotalOrder() {
    const orderQuantities = orderData.value.map((order) => {
        const totalQuantity = order.orders.reduce(
            (acc, curr) => acc + curr.quantity,
            0
        )
        return totalQuantity
    })
    const totalQuantities = [...orderQuantities]
    totalSold.value = totalQuantities.reduce((acc, curr) => acc + curr, 0)

    console.log(totalSold.value)
}

// Calculate total menu items

// for (const category in filterResult.value) {
//     totalMenu.value += filterResult.value[category].length
// }

// Menu modal handlerer
function menuModalHandle(input) {
    if (input == "clearModal") {
        editingItem.value = ref(null)
        isEditMode.value = false
        isMenuModal.value = false
    } else if (input == "addNewMenu") {
        isMenuModal.value = true
    } else if (typeof input == "object") {
        editingItem.value = input
        isMenuModal.value = true
        isEditMode.value = true
        console.log(editingItem.value)
    }
}

function confirmModalHandle(input) {
    if (input == "confirming") {
        isAddModal.value = true
        isConfirming.value = true
    }
    if (input == "clearmodal") {
        isAddModal.value = false
        if (!isConfirming.value) {
            isMenuModal.value = false
        }
        isConfirming.value = false
        isAddComplete.value = false
    }
    if (input == "addMenu") {
        isConfirming.value = false
        isAddComplete.value = true
    }
}

const editingPromo = ref({
    id: undefined,
    name: "",
    menus: [],
    discount: 0,
})

const colsePromoModal = () => {
    isProModalOpen.value = false
    editingPromo.value = {
        id: undefined,
        name: "",
        menus: [],
        discount: 0,
    }
}

const openPromoModal = (promo) => {
    editingPromo.value = promo
    // editingPromo.value = {
    //     id: promo.id,
    //     name: promo.name,
    //     menus: promo.menus,
    //     discount: promo.discount,
    // }
    isProModalOpen.value = true
}

const updatePromo = (newPromo) => {
    console.log(newPromo)
    if (newPromo.id === undefined) {
        newPromo.id = promotions.value.length
        promotions.value.push(newPromo)
    } else {
        const index = promotions.value.findIndex(
            (promo) => promo.id === newPromo.id
        )
        promotions.value[index] = newPromo
    }
}

// Set HR style class
const hr = ref("mb-2 border-gray-300 border-1 rounded")
</script>

<template>
    <Suspense>
        <div class="flex flex-col w-full h-lvh items-center">
            <!---->
            <div
                name="analysis"
                class="my-6 h-[20%] w-11/12 shrink-0 rounded-md p-4 bg-slate-100"
            >
                <h1 class="text-2xl font-mono font-semibold">Analysis</h1>
                <hr :class="hr" />
                <div name="Content" class="flex">
                    <!-- total cup sold -->
                    <div>
                        <h2>Total Sold</h2>
                        <h1 v-text="totalSold ? totalSold : NaN"></h1>
                    </div>
                    <!-- total order -->
                    <div>
                        <h2>Total Order</h2>
                        <h1 v-text="totalOrder ? totalOrder : NaN"></h1>
                    </div>
                    <!-- total product -->
                    <div>
                        <h2>Total Menu</h2>
                        <h1 v-text="totalMenu ? totalMenu : NaN"></h1>
                    </div>
                </div>
            </div>

            <!------------------------>
            <!-- Management Section -->
            <!------------------------>
            <div
                name="management"
                class="h-[70%] shrink-0 w-11/12 rounded-md p-4 bg-slate-100"
            >
                <div class="h-[10%] mb-2">
                    <div
                        class="flex flex-row justify-between items-center w-full h-full mb-2"
                    >
                        <h1 class="text-2xl font-mono font-semibold">
                            Management
                        </h1>

                        <div class="flex flex-row gap-2 w-2/5 justify-end">
                            <button
                                class="btn btn-sm"
                                @click="menuModalHandle(`addNewMenu`)"
                            >
                                Add new menu
                                <img
                                    src="/src/assets/icon/plus.svg"
                                    alt="plus"
                                    class="size-4"
                                />
                            </button>
                            <!-- Dropdown for filtering -->
                            <select
                                class="select select-bordered select-sm w-1/6 max-w-s"
                                v-model="selectFilter"
                                @change="filterCategory(selectFilter)"
                            >
                                <option value="All">All</option>
                                <!-- Generate options for each category -->

                                <option
                                    v-for="(propoty, index) in filterResult"
                                    :key="index"
                                >
                                    {{ propoty.category }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <hr :class="hr" />
                </div>

                <div
                    name="container"
                    class="w-full h-[70%] flex items-start flex-wrap gap-4 overflow-auto"
                >
                    <!-- Dynamic rendering of menu items based on selected category -->
                    <div
                        v-for="(propoty, category) in afterFilterResult === null
                            ? filterResult
                            : afterFilterResult"
                        :key="category"
                        class="flex flex-wrap w-full h-auto gap-2"
                    >
                        <!-- แสดงชื่อ category -->
                        <h2 class="w-full font-mono text-lg font-semibold">
                            {{ propoty.category }}
                        </h2>
                        <!-- แสดง menu items ในแต่ละ category -->
                        <div
                            v-for="(items, key) in propoty.menus"
                            :key="key"
                            name="menuContainer"
                            class="flex flex-row gap-4 flex-wrap justify-items-center items-center pl-4"
                        >
                            <div @click="menuModalHandle(items)">
                                <MenuBaseCard variant="menuList">
                                    <template #title>
                                        <b>{{ items.menu_name }}</b>
                                    </template>
                                    <template #price>
                                        <p>{{ items.price }}</p>
                                    </template>
                                </MenuBaseCard>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Management Modal -->
            <div
                v-show="isMenuModal"
                class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
            >
                <div
                    class="w-lvw h-lvh bg-black bg-opacity-50"
                    @click="menuModalHandle(`clearModal`)"
                ></div>
                <!-- modal content -->
                <div
                    name="modal"
                    class="fixed w-3/4 h-3/4 bg-white rounded-xl flex flex-col items-center justify-center indicator"
                >
                    <button
                        class="btn btn-square absolute top-2 right-2"
                        @click="menuModalHandle(`clearModal`)"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <h1 name="Header">
                        {{ isEditMode ? "Edit Menu" : "Add new Menu" }}
                    </h1>
                    {{ isEditMode ? editingItem.menu_name : "add new===menu" }}
                    <!-- cate, menuname, price, picture, description -->
                    <div
                        name="modalcontainer"
                        class="flex flex-row justify-around gap-20 items-center"
                    >
                        <div name="formfield" class="w-3/6">
                            <form>
                                <label class="form-control w-full max-w-sm">
                                    <div class="flex flex-row gap-4">
                                        <div>
                                            <div class="label">
                                                <span class="label-text"
                                                    >Menu name</span
                                                >
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Type here"
                                                class="input input-bordered w-full max-w-sm"
                                                v-model="editingItem.menu_name"
                                            />
                                        </div>
                                        <div>
                                            <div class="label">
                                                <span class="label-text"
                                                    >Category</span
                                                >
                                            </div>
                                            <select
                                                class="select select-bordered w-full max-w-sm"
                                                v-model="editingItem.category"
                                            >
                                                <option disabled selected>
                                                    Select category
                                                </option>
                                                <option
                                                    v-for="(
                                                        propoty, index
                                                    ) in filterResult"
                                                    :key="index"
                                                >
                                                    {{ propoty.category }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div v-if="editingItem.category == 'Other'">
                                        <div class="label">
                                            <span class="label-text"
                                                >New category</span
                                            >
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Type here"
                                            class="input input-bordered w-full max-w-sm"
                                            v-model="editingItem.new_category"
                                        />
                                    </div>

                                    <div class="label">
                                        <span class="label-text"
                                            >Menu description</span
                                        >
                                    </div>
                                    <textarea
                                        type="text"
                                        placeholder="Type here"
                                        class="textarea textarea-bordered textarea-sm w-full max-w-sm max-h-20"
                                        v-model="editingItem.description"
                                    ></textarea>
                                    <div class="label">
                                        <span class="label-text">Price</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Type here"
                                        class="input input-bordered w-full max-w-xs"
                                        v-model="editingItem.price"
                                    />
                                    <div class="label">
                                        <span class="label-text"
                                            >Image URL</span
                                        >
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        class="input input-bordered w-full max-w-xs"
                                        v-model="editingItem.img_src"
                                    />
                                </label>
                            </form>
                        </div>

                        <div name="card">
                            <div
                                class="card card-compact w-96 bg-base-100 shadow-xl"
                            >
                                <figure>
                                    <img
                                        :src="
                                            editingItem.img_src !=
                                            '/src/assets/menuimage/pain.jpg'
                                                ? editingItem.img_src
                                                : '/src/assets/menuimage/pain.jpg'
                                        "
                                        @error="
                                            editingItem.img_src =
                                                '/src/assets/menuimage/pain.jpg'
                                        "
                                        class="max-h-56 object-cover overflow-clip"
                                        alt="Menu Image"
                                    />
                                </figure>
                                <div class="card-body">
                                    <h2
                                        class="card-title"
                                        v-text="editingItem.menu_name"
                                    ></h2>
                                    <span
                                        class="badge"
                                        v-show="editingItem.category"
                                        v-text="
                                            editingItem.category == 'Other'
                                                ? editingItem.new_category
                                                : editingItem.category
                                        "
                                    ></span>
                                    <p class="overflow-auto">
                                        {{ editingItem.description }}
                                    </p>
                                    <p v-text="editingItem.price"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="absolute bottom-4 right-4 flex flex-row gap-4">
                        <button
                            class="btn btn-outline btn-error"
                            @click="menuModalHandle(`clearModal`)"
                        >
                            Cancel
                        </button>
                        <button
                            class="btn btn-success"
                            @click="confirmModalHandle('confirming')"
                        >
                            {{ isEditMode ? "Update" : "Create" }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-show="isAddModal">
                <div
                    v-if="isConfirming"
                    class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
                >
                    <div
                        class="w-lvw h-lvh bg-black bg-opacity-50"
                        @click="confirmModalHandle(`clearmodal`)"
                    ></div>
                    <!-- modal content -->
                    <div
                        name="modal"
                        class="fixed w-1/4 h-3/6 bg-white rounded-xl flex flex-col items-center justify-center indicator"
                    >
                        <h1>Confirmation</h1>
                        <p>
                            Are you sure to
                            {{ isEditMode ? " edit " : " create " }} this menu ?
                        </p>
                        <div class="flex flex-row gap-4">
                            <button
                                class="btn btn-outline btn-warning"
                                @click="confirmModalHandle(`clearmodal`)"
                            >
                                Back
                            </button>
                            <button
                                class="btn btn-success"
                                @click="confirmModalHandle(`addMenu`)"
                            >
                                Success
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    v-show="isAddComplete"
                    class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
                >
                    <div
                        class="w-lvw h-lvh bg-black bg-opacity-50"
                        @click="confirmModalHandle(`clearmodal`)"
                    ></div>
                    <!-- modal content -->
                    <div
                        name="modal"
                        class="fixed w-1/4 h-3/6 bg-white rounded-xl flex flex-col items-center justify-center indicator"
                    >
                        <h1>Complete</h1>
                        <p>Are you</p>
                        <div class="flex flex-row gap-4">
                            <button
                                class="btn btn-success"
                                @click="confirmModalHandle(`clearmodal`)"
                            >
                                O K !
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!----------------------->
            <!-- Promotion Section -->
            <!----------------------->
            <div
                class="h-[70%] shrink-0 w-11/12 rounded-md p-4 bg-slate-100 my-10"
            >
                <div class="flex justify-between">
                    <div class="flex text-2xl font-mono">
                        <h1 class="font-semibold">Promotion</h1>
                        <span>({{ promotions.length }})</span>
                    </div>
                    <h1
                        class="text-2xl font-mono font-semibold"
                        @click="openPromoModal()"
                    >
                        Add New Promotion
                    </h1>
                </div>
                <div>
                    <div class="grid grid-cols-3 justify-items-center">
                        <h2>Name</h2>
                        <h2>Drinks</h2>
                        <h2>Discount</h2>
                    </div>
                    <div>
                        <div
                            v-for="pro in promotions"
                            :key="pro.id"
                            class="grid grid-cols-3 border border-gray-300 m-3 rounded-md pointer hover:scale-105 transition-all"
                            @click="openPromoModal(pro)"
                        >
                            <div class="col-span-1 justify-self-center">
                                {{ pro.name }}
                            </div>
                            <div class="col-span-1 pl-20">
                                <ul class="list-disc">
                                    <li
                                        v-for="(menu, index) in pro.menus"
                                        :key="index"
                                    >
                                        <MenuBaseCard variant="promotion">
                                            <template #title>
                                                <b>{{ menu.menuName }}</b>
                                            </template>
                                            <template #price>
                                                <p>
                                                    &nbsp x {{ menu.quantity }}
                                                </p>
                                            </template>
                                        </MenuBaseCard>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-span-1 justify-self-center">
                                {{ pro.discount }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isProModalOpen">
                <PromoModal
                    @closeModal="colsePromoModal"
                    @savePromotion="updatePromo"
                    :drinks="filterResult"
                    :promotion="editingPromo"
                />
            </div>
        </div>
    </Suspense>
</template>
