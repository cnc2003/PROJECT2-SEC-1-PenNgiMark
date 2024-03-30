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
    selectedmenus[0].selected = false;
    selectedmenus.shift();
  }
  item.selected = true
  selectedmenus.push(item)
}

function confirmOption(item, propoty) {
  console.log(propoty.value);
  if (item.sweetnessLevel === undefined || item.sweetnessLevel === "") {
    alert("Please select sweetness level")
  }
  selectedmenus[0].selected = false;
  let addToCart = {
    menu_name: item.menu_name,
    price: item.price,
    selected: item.selected,
    sweetnessLevel: item.sweetnessLevel,
    category: propoty.category,
  }
  fetchMenuData()
  mocDrinks.push(addToCart)
  console.log("mocDrinks :", mocDrinks)
}
function cancelOption(item) {
  selectedmenus[0].selected = false;
  fetchMenuData();
}
</script>
<template>
  <div
    class="flex h-screen w-full shrink-0 p-4 rounded-3xl bg-white border-solid border-slate-300 border-4"
  >
    <section
      class="border-2 border-white w-3/4"
      @click="closeModal"
    >
      <!-- this must be category list -->
      <div
        class="flex shrink-0 w-12/12 p-4 pt-2 rounded-3xl bg-white border-solid border-slate-300 border-4"
      >
        <div
          class="bg-slate-300 p-4 m-2 rounded-md btn btn-md hover:bg-blue-700 hover: hover:text-white text-gray-700 font-semibold"
          @click="filterCategory('All')"
        >
          <svg
            class="w-5 h-5 text-gray-800 dark:text-grey-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"
              clip-rule="evenodd"
            />
            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z" />
          </svg>

          All
        </div>
        <div
          v-for="propoty in filterResult"
          :key="propoty"
          class="bg-slate-300 p-4 m-2 rounded-md btn btn-md hover:bg-blue-700 hover: hover:text-white text-gray-700 font-semibold"
          @click="filterCategory(propoty.category)"
        >
          <svg
            class="w-6 h-6 text-gray-800 dark:text-grey-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"
              clip-rule="evenodd"
            />
            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z" />
          </svg>
          {{ propoty.category }}
        </div>
      </div>

      <!-- this must be menus list -->
      <div class="h-full overflow-y-scroll">
        <!-- loop category -->

        <div
          v-for="(propoty, category) in afterFilterResult === null
            ? filterResult
            : afterFilterResult"
          :key="category"
          class="flex flex-wrap w-full h-auto gap-2"
        >
          <!-- แสดงชื่อ category -->
          <h2
            class="w-full flex font-mono text-2xl font-semibold mt-10 text-blue-500 ml-11"
          >
            {{ propoty.category }} (
            <p class="text-gray-700">{{ propoty.menus.length }}</p>
            )
          </h2>
          <!-- แสดง menu items ในแต่ละ category -->
          <div
            v-for="(item, key) in propoty.menus"
            :key="key"
            name="menuContainer"
          >
            <div @click="ToggleClick(item)">
              <MenuBaseCard>
                <template
                  #title
                  v-if="!item.selected"
                >
                  <img
                    :src="item.img_src"
                    alt="MenuImage"
                    class="min-h-20 rounded-t-3xl"
                  />
                  <div class="card-body gap-1">
                    <b>
                      <p class="card-title">{{ item.menu_name }}</p></b
                    >
                    <p
                      v-text="item.price + ' ฿'"
                      class="font-bold text-lg"
                    ></p>
                  </div>
                </template>

                <template
                  #modal
                  v-if="item.selected"
                >
                  <div class="flex flex-col items-center justify-center">
                    <p class="text-2xl font-bold text-pink-500 mt-10 mb-5">
                      Sweetness Level
                    </p>
                    <div>
                      <div class="mt-3">
                        <input
                          type="radio"
                          id="light_sweet"
                          name="sweetLevel"
                          value="light_sweet"
                          v-model="item.sweetnessLevel"
                        />
                        <label
                          for="light_sweet"
                          class="text-black cursor-pointer hover:text-pink-400 text-nm font-semibold m-4"
                          >Light Sweet</label
                        >
                      </div>
                      <div class="mt-3">
                        <input
                          type="radio"
                          id="sweet"
                          name="sweetLevel"
                          value="sweet"
                          v-model="item.sweetnessLevel"
                        />
                        <label
                          for="sweet"
                          class="text-black cursor-pointer hover:text-pink-400 text-nm font-semibold m-4"
                          >Sweet</label
                        >
                      </div>
                      <div class="mt-3">
                        <input
                          type="radio"
                          id="verySweet"
                          name="sweetLevel"
                          value="verySweet"
                          v-model="item.sweetnessLevel"
                        />
                        <label
                          for="verySweet"
                          class="text-black cursor-pointer hover:text-pink-400 text-nm font-semibold m-4"
                          >Very Sweet</label
                        >
                      </div>
                    </div>
                    <br />
                    <div class="flex w-full h-32 justify-around items-end">
                      <button
                        class="hover:bg-red-400 cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-8 border border-gray-400 rounded shadow"
                        @click="cancelOption(item)"
                      >
                        Cancel
                      </button>
                      <button
                        class="hover:bg-green-400 cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-10 border border-gray-400 rounded shadow"
                        @click="confirmOption(item, propoty)"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </template>
              </MenuBaseCard>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col border-2 border-black h-dvh w-1/4 ml-2">
      <div class="flex justify-evenly border-2 border-black my-1 mx-2 h-20 p-1">
        <button class="border-2 border-black rounded-md h-full">Dine in</button>
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
