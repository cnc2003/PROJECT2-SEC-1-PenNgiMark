<script setup>
// Import necessary modules

import { ref, onMounted } from "vue"
import {
  getList,
  addNewCategory,
  addNewMenu,
  DeleteMenu,
  DeleteCate,
} from "../../lib/fetch.js"

import Analysis from "../Analysis.vue"
import Promotion from "../Promotion.vue"
// Define reactive variables
const totalMenu = ref(0)
// Edit variable - Modal
const editingItem = ref({})
const isMenuModal = ref(false)
const isEditMode = ref(false)
const isAddModal = ref(false)
const isAddComplete = ref(false)
const isConfirming = ref(false)
const isDeleting = ref(false)
// Filter variables
const selectFilter = ref("")
const filterResult = ref(null)
let afterFilterResult = ref(null) // default value

//fetch GET menulist
async function fetchMenuData() {
  filterResult.value = await getList("Menus") // is array
  totalMenu.value = 0
  for (const cate in filterResult.value) {
    // cate [ex index = 0,1,2,3,4,5]
    const category = filterResult.value[cate] ? filterResult.value[cate] : 0 // {id: '236e', takoyaki: Array(1)}
    totalMenu.value += category.menus.length
    if (category.menus.length == 0) {
      DeleteCate(category.id)
      filterResult.value = await getList("Menus")
    }
  }
}

const promotions = ref([])
onMounted(async () => {
  const [menusRes, promotionsRes] = await Promise.all([
    getList("Menus"),
    getList("Promotions"),
  ])
  fetchMenuData()
  promotions.value = promotionsRes
  filterResult.value = menusRes
})

// Function to filter categories
function filterCategory(inputCategory) {
  let t = null
  if (inputCategory === null || inputCategory === "All") {
    afterFilterResult.value = filterResult.value
  } else {
    for (const data in filterResult.value) {
      const categorykey = filterResult.value[data] // category in menu
      ////console.log(categorykey.category)

      if (inputCategory === categorykey.category) {
        //////console.log(categorykey)
        afterFilterResult.value = [categorykey]
      }
    }
  }
}

// Menu modal handlerer
let currEditOrigin = {}
function menuModalHandle(input, category) {
  if (input == "clearModal") {
    editingItem.value = currEditOrigin.menu
    isEditMode.value = false
    isMenuModal.value = false
    fetchMenuData()
  } else if (input == "addNewMenu") {
    //console.log("AAAA");
    editingItem.value = { category: category, menu: {menu_name: "",description: "", img_src: "",price: ""}}
    //console.log(editingItem.value);
    isEditMode.value = false
    isMenuModal.value = true
  } else if (typeof input == "object") {
    currEditOrigin = { category: category, menu: input }
    //console.log(input)
    //console.log(category)
    editingItem.value = input
    editingItem.value.category = category
    //console.log(editingItem.value)
    isMenuModal.value = true
    isEditMode.value = true
  }
}

function confirmModalHandle(input) {
  let editSpace = null
  let index = null
  //find cate that matched
  function filterCateForEdit(input) {
    for (const cate of filterResult.value) {
      if (cate.category.toLowerCase() == input.toLowerCase()) {
        //console.log(cate);
        editSpace = cate
      }
    }
    //console.log(editSpace);
    return editSpace
  }
  //find index inside that category menus
  function findEditIndex(menuName) {
    index = editSpace.menus.findIndex(
      (menu) => menu.menu_name.toLowerCase() == menuName.toLowerCase()
    )
    return index
  }
  if (input == "confirming") {
    isAddModal.value = true
    isDeleting.value = false
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
  if (input == "deleting") {
    isAddModal.value = true
    isDeleting.value = true
    isConfirming.value = true
  }
  if (input == "deleteMenu") {
    filterCateForEdit(editingItem.value.category)
    findEditIndex(editingItem.value.menu_name)
    editSpace.menus.splice(index, 1)
    DeleteMenu(editSpace.id, editSpace).then(() => fetchMenuData())
    isMenuModal.value = false
    isConfirming.value = false
    isAddComplete.value = true
    editingItem.value = {}
  }
  if (input == "addMenu") {
    //console.log("add")
    if (!editingItem.value.category) {
      return alert("put si")
    }

    // EDIT MODE CASE MODULE
    if (isEditMode.value) {
      //console.log("case1")
      //console.log(editingItem.value)
      //console.log(editingItem.value.category)

      filterCateForEdit(currEditOrigin.category)
      //console.log(editSpace);
      findEditIndex(editingItem.value.menu_name)
      //console.log(editSpace.category)
      //console.log(currEditOrigin.category)
      //add new category case
      if (editingItem.value.new_category) {
        //console.log("case1-A")
        const object = {
          category: editingItem.value.new_category,
          menus: [
            {
              menu_name: editingItem.value.menu_name,
              price: editingItem.value.price,
              description: editingItem.value.description,
              img_src: editingItem.value.img_src,
            },
          ],
        }
        filterCateForEdit(currEditOrigin.category)
        findEditIndex(currEditOrigin.menu.menu_name)
        addNewCategory(object)
        editSpace.menus.splice(index, 1)
        //console.log(editSpace.id)
        DeleteMenu(editSpace.id, editSpace).then(() => fetchMenuData())
      } else {
        //console.log("case1-B")
        //NOT add new category case
        //console.log(editSpace.category)
        //console.log(currEditOrigin.category)
        if (editingItem.value.category == currEditOrigin.category) {
          //console.log("//Edit data case ")
          editSpace.menus[index] = {
            menu_name: editingItem.value.menu_name,
            price: editingItem.value.price,
            description: editingItem.value.description,
            img_src: editingItem.value.img_src,
          }
          addNewMenu(editSpace.id, editSpace).then(() => fetchMenuData())
        } else {
          //console.log("//change category")
          filterCateForEdit(currEditOrigin.category)
          findEditIndex(currEditOrigin.menu.menu_name)
          editSpace.menus.splice(index, 1)
          DeleteMenu(editSpace.id, editSpace)

          filterCateForEdit(editingItem.value.category)
          editSpace.menus.push({
            menu_name: editingItem.value.menu_name,
            price: editingItem.value.price,
            description: editingItem.value.description,
            img_src: editingItem.value.img_src,
          })
          //console.log("dofetch")
          addNewMenu(editSpace.id, editSpace).then(() => fetchMenuData())
        }
      }
    }
    // CREATE NEW MENU MODE
    if (!isEditMode.value) {
      //console.log("case2")
      //console.log("newMenuuuuu")
      if (editingItem.value.new_category) {
        //console.log("case2-A")
        const object = {
          category: editingItem.value.new_category,
          menus: [
            {
              menu_name: editingItem.value.menu_name,
              price: editingItem.value.price,
              description: editingItem.value.description,
              img_src: editingItem.value.img_src,
            },
          ],
        }
        addNewCategory(object).then(() => fetchMenuData())
      }
      if (!editingItem.value.new_category) {
        //console.log("case2-B")
        filterCateForEdit(editingItem.value.category)
        findEditIndex(editingItem.value.menu_name)
        editSpace.menus.push({
          menu_name: editingItem.value.menu_name,
          price: editingItem.value.price,
          description: editingItem.value.description,
          img_src: editingItem.value.img_src,
        })
        addNewMenu(editSpace.id, editSpace).then(() => fetchMenuData())
      }
    }
    fetchMenuData()
    isMenuModal.value = false
    isConfirming.value = false
    isAddComplete.value = true
    editingItem.value = {}
    //console.log("end")
  }
}

// Set HR style class
const hr = ref("mb-2 border-gray-300 border-2 rounded")
</script>

<template>
  <Suspense>
    <div class="flex flex-col w-full h-lvh items-center">
      <!------------------------ 
        -- Analysis Section --
        ------------------------>
      <Analysis
        :totalMenu="totalMenu"
        :hr="hr"
      />

      <!------------------------ 
        -- Management Section --
        ------------------------>
      <div
        name="management"
        class="h-[70%] shrink-0 w-11/12 p-4 pt-2 rounded-3xl bg-white border-solid border-slate-300 border-4"
      >
        <div class="h-[10%] mb-2">
          <div class="flex flex-row justify-between items-center w-full h-full">
            <h1 class="text-2xl font-bold">Management</h1>

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
                <option
                  value=""
                  selected
                >
                  All
                </option>
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
          class="w-full h-[85%] flex items-start flex-wrap gap-4 overflow-auto mt-3"
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
            <h2
              name="cateSet"
              class="w-full font-mono text-xl font-extrabold py-2 divider divider-start pr-4"
              v-text="propoty.category"
            ></h2>
            <!-- แสดง menu items ในแต่ละ category -->
            <div class="flex flex-row gap-5 flex-wrap pl-4">
              <div
                v-for="(items, key) in propoty.menus"
                :key="key"
                name="menuCard"
                class="card card-compact w-80 h-72 bg-base-100 shadow-md transition ease-in-out hover:scale-105 duration-300"
                @click="menuModalHandle(items, propoty.category)"
              >
                <figure class="image-full min-h-40">
                  <img
                    :src="items.img_src"
                    alt="MenuImage"
                    @error="items.img_src = '/src/assets/img/errorImg.png'"
                  />
                </figure>
                <div class="card-body gap-1">
                  <h2
                    class="card-title"
                    v-text="items.menu_name"
                  ></h2>
                  <p
                    v-text="
                      items.description
                        ? items.description.slice(0, 60) + '...'
                        : 'no infomation'
                    "
                  ></p>
                  <p
                    v-text="items.price ? items.price + ' ฿' : 'Nan ฿'"
                    class="font-bold text-lg"
                  ></p>
                </div>
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
          class="fixed w-auto h-auto bg-white rounded-xl flex flex-col items-center justify-center indicator p-10"
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
          <h1
            name="Header"
            class="justify-self-start w-full font-bold text-3xl"
          >
            {{ isEditMode ? "Edit Menu" : "Add new Menu" }}
            <p
              v-text="
                isEditMode
                  ? `Refresh your menu! Edit existing items.`
                  : `Spice up your shop! Create a new menu item.`
              "
              class="font-medium text-lg"
            ></p>
          </h1>

          <!-- cate, menuname, price, picture, description -->
          <div
            name="modalcontainer"
            class="flex flex-row justify-around gap-20 items-center mt-2 mb-12"
          >
            <div
              name="formfield"
              class="w-3/6"
            >
              <form>
                <label class="form-control w-full gap-1 max-w-sm">
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
                        <option disabled>Select category</option>
                        <option
                          v-for="(propoty, index) in filterResult"
                          :key="index"
                        >
                          {{ propoty.category }}
                        </option>
                        <option>Other</option>
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
                  <div>
                    <div class="label">
                      <span class="label-text">Menu description</span>
                    </div>
                    <textarea
                      type="text"
                      placeholder="Type here"
                      class="textarea textarea-bordered textarea-sm w-full max-w-sm max-h-20"
                      v-model="editingItem.description"
                    ></textarea>
                  </div>
                  <div>
                    <div class="label">
                      <span class="label-text">Price</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      placeholder="Type here"
                      class="input input-bordered w-full max-w-xs"
                      v-model="editingItem.price"
                    />
                  </div>
                  <div>
                    <div class="label">
                      <span class="label-text">Image URL</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Type here"
                      class="input input-bordered w-full max-w-xs"
                      v-model="editingItem.img_src"
                    />
                  </div>
                </label>
              </form>
            </div>

            <div name="card">
              <div class="card card-compact w-96 bg-base-100 shadow-xl">
                <figure class="image-full max-h-52">
                  <img
                    :src="
                      editingItem.img_src != '/src/assets/img/errorImg.png'
                        ? editingItem.img_src
                        : '/src/assets/img/errorImg.png'
                    "
                    @error="
                      editingItem.img_src = '/src/assets/img/errorImg.png'
                    "
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
          <div class="absolute bottom-4 left-4">
            <button
              class="btn btn-outline btn-error"
              @click="confirmModalHandle(`deleting`)"
            >
              Delete menu
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
            class="fixed w-auto h-auto bg-white rounded-xl flex flex-col items-center justify-center indicator p-6 pb-10"
            v-if="!isDeleting"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-28 h-28 my-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>

            <h1 class="text-2xl font-semibold mb-4">Confirmation</h1>
            <p class="text-lg mb-4">
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
          <div
            name="modal"
            class="fixed w-1/4 h-3/6 bg-white rounded-xl flex flex-col items-center justify-center indicator"
            v-if="isDeleting"
          >
            <h1 class="text-2xl font-semibold mb-4">Confirmation</h1>
            <p class="text-lg mb-4">Are you sure to remove this menu ?</p>
            <div class="flex flex-row gap-4">
              <button
                class="btn btn-outline btn-warning"
                @click="confirmModalHandle(`clearmodal`)"
              >
                Back
              </button>
              <button
                class="btn btn-success"
                @click="confirmModalHandle(`deleteMenu`)"
              >
                Remove
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-24 h-24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <h1 class="text-2xl font-semibold mb-4">Complete</h1>
            <p class="text-lg mb-4">Have a good day :D</p>
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
      <Promotion
        :promotions="promotions"
        :drinks="filterResult"
        :hr="hr"
      />
    </div>
  </Suspense>
</template>
