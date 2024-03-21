<script setup>
// Import necessary modules
import { computed, ref, resolveDirective, ssrContextKey } from "vue"
import orderList from "../../../public/data/orderlist.json"
import { getMenulist, getOrderlist } from "../../lib/fetch.js"

// Define reactive variables
const totalMenu = ref(0)
const totalSold = ref(0)
const totalOrder = ref(orderList.length)

// Edit variable
const isMenuModal = ref(false)
const isEditMode = ref(false)
const isAddModal = ref(false)
const editingItem = ref({})

// Filter variables
const selectFilter = ref("")
const filterResult = ref(null)
const afterFilterResult = ref(null) // default value

//fetch GET menulist
async function fetchMenuData() {
  filterResult.value = await getMenulist() // is array
  // console.log(filterResult.value)
  for (const cate in filterResult.value) {
    totalMenu.value += cate.length
  }
  console.log(filterResult.value)
}

fetchMenuData()

// Function to filter categories
function filterCategory(category) {
  if (filterResult.value.hasOwnProperty(category)) {
    afterFilterResult.value = { [category]: filterResult.value[category] }
    console.log(afterFilterResult.value)
  } else {
    afterFilterResult.value = filterResult.value
  }
}

// Calculate total sold items
orderList.forEach((order) =>
  order.orders.forEach((item) => {
    totalSold.value += item.quantity
  })
)

// Calculate total menu items
for (const category in filterResult.value) {
  totalMenu.value += filterResult.value[category].length
  console.log(filterResult.value)
}

// Menu modal handlerer
function menuModalHandle(input) {
  if (input == "clearModal") {
    editingItem.value = ref(null)
    isEditMode.value = false
    isMenuModal.value = false
    console.log(editingItem)
    console.log("CLEARRRRRR")
  } else if (input == "addNewMenu") {
    isMenuModal.value = true
    console.log("ADDDDDDDDDD")
  } else if (typeof input == "object") {
    editingItem.value = input
    isMenuModal.value = true
    isEditMode.value = true
    // console.log(`work`)
    console.log(editingItem.value)
    console.log("EDITTTTTTTTTTTTT")
  }
}

function confirmModalHandle(input) {
  console.log(editingItem.value);
  if(input == "confirming") {
    isAddModal.value = true
  }
  if(input == "clearmodal") [
    isAddModal.value = false
  ]
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
        <div
          name="Content"
          class="flex"
        >
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
            <h1 class="text-2xl font-mono font-semibold">Management</h1>
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
                <option value="">All</option>
                <!-- Generate options for each category -->
                <option
                  v-for="(category, key) in filterResult"
                  :key="category"
                >
                  {{ key }}
                </option>
              </select>
            </div>
          </div>
          <hr :class="hr" />
        </div>

        <div
          name="container"
          class="w-full h-[90%] flex flex-wrap gap-4 overflow-auto"
        >
          <!-- Dynamic rendering of menu items based on selected category -->
          <div
            v-for="(itemList, category) in afterFilterResult === null
              ? filterResult
              : afterFilterResult"
            :name="category"
            :key="category"
            class="flex flex-col w-full h-auto gap-2"
          >
            <h2
              v-text="category"
              class="w-full font-mono text-lg font-semibold"
            ></h2>
            <!-- Menu items within each category -->
            <div
              name="menuContainer"
              class="flex flex-row gap-4 flex-wrap "
            >
              <div
                v-for="item in itemList"
                :key="item"
                class="w-[23%] h-32 p-4 border border-gray-300 rounded-md pointer hover:scale-105 transition-all"
                @click="menuModalHandle(item)"
              >
                <p>{{ item.menu_name }}</p>
                <p>{{ item.price }}</p>
                <p>{{ category }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Management Modal -->
      <div
        v-if="isMenuModal"
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
          <h1 name="Header">{{ isEditMode ? "Edit Menu" : "Add new Menu" }}</h1>
          {{ isEditMode ? editingItem.menu_name : "add new===menu" }}
          <!-- cate, menuname, price, picture, description -->
          <div
            name="modalcontainer"
            class="flex flex-row justify-around gap-20 items-center"
          >
            <div
              name="formfield"
              class="w-3/6"
            >
              <form>
              <label class="form-control w-full max-w-sm">
                <div class="flex flex-row gap-4">
                  <div>
                    <div class="label">
                      <span class="label-text">Menu name</span>
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
                      <span class="label-text">Category</span>
                    </div>
                    <select
                      class="select select-bordered w-full max-w-sm"
                      v-model="editingItem.category"
                    >
                      <option
                        disabled
                        selected
                      >
                        Select category
                      </option>
                      <option
                        v-for="(object, category) in filterResult"
                        :key="object"
                      >
                        {{ category }}
                      </option>
                    </select>
                  </div>
                </div>
                <div v-if="editingItem.category == 'Other'">
                  <div class="label">
                    <span class="label-text">New category</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    class="input input-bordered w-full max-w-sm"
                    v-model="editingItem.new_category"
                  />
                </div>

                <div class="label">
                  <span class="label-text">Menu description</span>
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
                  <span class="label-text">Image URL</span>
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
              <div class="card card-compact w-96 bg-base-100 shadow-xl">
                <figure>
                  <img
                    :src="
                      editingItem.img_src != '/src/assets/menuimage/pain.jpg'
                        ? editingItem.img_src
                        : '/src/assets/menuimage/pain.jpg'
                    "
                    @error="
                      editingItem.img_src = '/src/assets/menuimage/pain.jpg'
                    "
                    class="max-h-56 object-cover"
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
                    v-text="editingItem.category"
                  ></span>
                  <p class="overflow-auto">{{ editingItem.description }}</p>
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

      <div
        v-if="isAddModal"
        class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center"
      >
        <div
          class="w-lvw h-lvh bg-black bg-opacity-50"
          @click="confirmModalHandle(`clearmodal`)"
        ></div>
        <!-- modal content -->
        <div
          name="modal"
          class="fixed w-2/6 h-3/6 bg-white rounded-xl flex flex-col items-center justify-center indicator"
        >
          <h1>Confirmation</h1>
          <p>Are you sure to {{ isEditMode ? " edit " : " create " }} this menu ?</p>
        </div>
      </div>
      <!----------------------->
      <!-- Promotion Section -->
      <!----------------------->
    </div>
  </Suspense>
</template>
