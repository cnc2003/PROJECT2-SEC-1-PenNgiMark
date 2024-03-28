<script setup>
// Import necessary modules

import { computed, ref, onMounted, resolveDirective, ssrContextKey } from "vue"
import {
  getList,
  addNewCategory,
  addNewMenu,
  DeleteMenu,
  DeleteCate,
} from "../../lib/fetch.js"

import MenuBaseCard from "../MenuBaseCard.vue"
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
    const category = filterResult.value[cate] // {id: '236e', takoyaki: Array(1)}
    totalMenu.value += category.menus.length
    if (category.menus.length == 0) {
      DeleteCate(category.id)
      filterResult.value = await getList("Menus")
    }
  }
}

onMounted(async () => {
  const [menusRes] = await Promise.all([
    getList("Menus"),
  ])
  fetchMenuData()
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
      //console.log(categorykey.category)

      if (inputCategory === categorykey.category) {
        ////console.log(categorykey)
        afterFilterResult.value = [categorykey]
      }
    }
  }
}

// Menu modal handlerer
let currEditOrigin = {}
function menuModalHandle(input, category) {
  if (input == "clearModal") {
    editingItem.value = ref(null)
    isEditMode.value = false
    isMenuModal.value = false
  } else if (input == "addNewMenu") {
    isEditMode.value = false
    isMenuModal.value = true
  } else if (typeof input == "object") {
    currEditOrigin = { category: category, menu: input }
    editingItem.value = input
    editingItem.value.category = category
    isMenuModal.value = true
    isEditMode.value = true
  }
}

function confirmModalHandle(input) {
  let editSpace = null
  let index = null
  function filterCateForEdit(input) {
    for (const cate of filterResult.value) {
      if (cate.category.toLowerCase() == input.toLowerCase()) {
        editSpace = cate
      }
    }
    return editSpace
  }
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
    console.log("add")
    if (!editingItem.value.category) {
      return alert("put si")
    }

    // EDIT MODE CASE MODULE
    if (isEditMode.value) {
      console.log("case1")

      filterCateForEdit(editingItem.value.category)
      findEditIndex(editingItem.value.menu_name)
      //add new category case
      if (editingItem.value.new_category) {
        console.log("case1-A")
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
        console.log(editSpace.id)
        DeleteMenu(editSpace.id, editSpace).then(() => fetchMenuData())
      } else {
        console.log("case1-B")
        //NOT add new category case
        if (editSpace.category == currEditOrigin.category) {
          console.log("//Edit data case ")
          editSpace.menus[index] = {
            menu_name: editingItem.value.menu_name,
            price: editingItem.value.price,
            description: editingItem.value.description,
            img_src: editingItem.value.img_src,
          }
          addNewMenu(editSpace.id, editSpace).then(() => fetchMenuData())
        } else {
          console.log("//change category")
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
          addNewMenu(editSpace.id, editSpace).then(() => fetchMenuData())
        }
      }
    }
    // CREATE NEW MENU MODE
    if (!isEditMode.value) {
      console.log("case2")
      console.log("newMenuuuuu")
      if (editingItem.value.new_category) {
        console.log("case2-A")
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
        console.log("case2-B")
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
    console.log("end")
  }
}

// Set HR style class
const hr = ref("mb-2 border-gray-300 border-1 rounded")
</script>

<template>
  <Suspense>
    <div class="flex flex-col w-full h-lvh items-center">
      <!------------------------ 
        -- Analysis Section --
        ------------------------>
      <Analysis :totalMenu="totalMenu" :hr="hr" />

      <!------------------------ 
        -- Management Section --
        ------------------------>
      <div name="management" class="h-[70%] shrink-0 w-11/12 rounded-md p-4 bg-slate-100">
        <div class="h-[10%] mb-2">
          <div class="flex flex-row justify-between items-center w-full h-full mb-2">
            <h1 class="text-2xl font-mono font-semibold">Management</h1>

            <div class="flex flex-row gap-2 w-2/5 justify-end">
              <button class="btn btn-sm" @click="menuModalHandle(`addNewMenu`)">
                Add new menu
                <img src="/src/assets/icon/plus.svg" alt="plus" class="size-4" />
              </button>
              <!-- Dropdown for filtering -->
              <select class="select select-bordered select-sm w-1/6 max-w-s" v-model="selectFilter"
                @change="filterCategory(selectFilter)">
                <option value="All">All</option>
                <!-- Generate options for each category -->

                <option v-for="(propoty, index) in filterResult" :key="index">
                  {{ propoty.category }}
                </option>
              </select>
            </div>
          </div>
          <hr :class="hr" />
        </div>

        <div name="container" class="w-full h-[85%] flex items-start flex-wrap gap-4 overflow-auto mt-5">
          <!-- Dynamic rendering of menu items based on selected category -->
          <div v-for="(propoty, category) in afterFilterResult === null
        ? filterResult
        : afterFilterResult" :key="category" class="flex flex-wrap w-full h-auto gap-2">
            <!-- แสดงชื่อ category -->
            <h2 class="w-full font-mono text-lg font-semibold">
              {{ propoty.category }}
            </h2>
            <!-- แสดง menu items ในแต่ละ category -->
            <div v-for="(items, key) in propoty.menus" :key="key" name="menuContainer"
              class="flex flex-row gap-4 flex-wrap justify-items-center items-center pl-4">
              <div @click="menuModalHandle(items, propoty.category)">
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
      <div v-show="isMenuModal" class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
        <div class="w-lvw h-lvh bg-black bg-opacity-50" @click="menuModalHandle(`clearModal`)"></div>
        <!-- modal content -->
        <div name="modal"
          class="fixed w-3/4 h-3/4 bg-white rounded-xl flex flex-col items-center justify-center indicator">
          <button class="btn btn-square absolute top-2 right-2" @click="menuModalHandle(`clearModal`)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 name="Header">
            {{ isEditMode ? "Edit Menu" : "Add new Menu" }}
          </h1>
          {{ isEditMode ? editingItem.menu_name : "add new===menu" }}
          <!-- cate, menuname, price, picture, description -->
          <div name="modalcontainer" class="flex flex-row justify-around gap-20 items-center">
            <div name="formfield" class="w-3/6">
              <form>
                <label class="form-control w-full max-w-sm">
                  <div class="flex flex-row gap-4">
                    <div>
                      <div class="label">
                        <span class="label-text">Menu name</span>
                      </div>
                      <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-sm"
                        v-model="editingItem.menu_name" />
                    </div>
                    <div>
                      <div class="label">
                        <span class="label-text">Category</span>
                      </div>
                      <select class="select select-bordered w-full max-w-sm" v-model="editingItem.category">
                        <option disabled>Select category</option>
                        <option v-for="(propoty, index) in filterResult" :key="index">
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
                    <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-sm"
                      v-model="editingItem.new_category" />
                  </div>

                  <div class="label">
                    <span class="label-text">Menu description</span>
                  </div>
                  <textarea type="text" placeholder="Type here"
                    class="textarea textarea-bordered textarea-sm w-full max-w-sm max-h-20"
                    v-model="editingItem.description"></textarea>
                  <div class="label">
                    <span class="label-text">Price</span>
                  </div>
                  <input type="number" placeholder="Type here" class="input input-bordered w-full max-w-xs"
                    v-model="editingItem.price" />
                  <div class="label">
                    <span class="label-text">Image URL</span>
                  </div>
                  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs"
                    v-model="editingItem.img_src" />
                </label>
              </form>
            </div>

            <div name="card">
              <div class="card card-compact w-96 bg-base-100 shadow-xl">
                <figure>
                  <img :src="editingItem.img_src != '/src/assets/menuimage/pain.jpg'
          ? editingItem.img_src
          : '/src/assets/menuimage/pain.jpg'
        " @error="
        editingItem.img_src = '/src/assets/menuimage/pain.jpg'
        " class="max-h-56 object-cover overflow-clip" alt="Menu Image" />
                </figure>
                <div class="card-body">
                  <h2 class="card-title" v-text="editingItem.menu_name"></h2>
                  <span class="badge" v-show="editingItem.category" v-text="editingItem.category == 'Other'
          ? editingItem.new_category
          : editingItem.category
        "></span>
                  <p class="overflow-auto">
                    {{ editingItem.description }}
                  </p>
                  <p v-text="editingItem.price"></p>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute bottom-4 right-4 flex flex-row gap-4">
            <button class="btn btn-outline btn-error" @click="menuModalHandle(`clearModal`)">
              Cancel
            </button>
            <button class="btn btn-success" @click="confirmModalHandle('confirming')">
              {{ isEditMode ? "Update" : "Create" }}
            </button>
          </div>
          <div class="absolute bottom-4 left-4">
            <button class="btn btn-outline btn-error" @click="confirmModalHandle(`deleting`)">
              Delete menu
            </button>
          </div>
        </div>
      </div>

      <div v-show="isAddModal">
        <div v-if="isConfirming" class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
          <div class="w-lvw h-lvh bg-black bg-opacity-50" @click="confirmModalHandle(`clearmodal`)"></div>
          <!-- modal content -->
          <div name="modal"
            class="fixed w-1/4 h-3/6 bg-white rounded-xl flex flex-col items-center justify-center indicator"
            v-if="!isDeleting">
            <h1>Confirmation</h1>
            <p>
              Are you sure to
              {{ isEditMode ? " edit " : " create " }} this menu ?
            </p>
            <div class="flex flex-row gap-4">
              <button class="btn btn-outline btn-warning" @click="confirmModalHandle(`clearmodal`)">
                Back
              </button>
              <button class="btn btn-success" @click="confirmModalHandle(`addMenu`)">
                Success
              </button>
            </div>
          </div>
          <div name="modal"
            class="fixed w-1/4 h-3/6 bg-white rounded-xl flex flex-col items-center justify-center indicator"
            v-if="isDeleting">
            <h1>Confirmation</h1>
            <p>Are you sure to remove this menu ?</p>
            <div class="flex flex-row gap-4">
              <button class="btn btn-outline btn-warning" @click="confirmModalHandle(`clearmodal`)">
                Back
              </button>
              <button class="btn btn-success" @click="confirmModalHandle(`deleteMenu`)">
                Success
              </button>
            </div>
          </div>
        </div>

        <div v-show="isAddComplete" class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
          <div class="w-lvw h-lvh bg-black bg-opacity-50" @click="confirmModalHandle(`clearmodal`)"></div>
          <!-- modal content -->
          <div name="modal"
            class="fixed w-1/4 h-3/6 bg-white rounded-xl flex flex-col items-center justify-center indicator">
            <h1>Complete</h1>
            <div class="flex flex-row gap-4">
              <button class="btn btn-success" @click="confirmModalHandle(`clearmodal`)">
                O K !
              </button>
            </div>
          </div>
        </div>
      </div>
      <!----------------------->
      <!-- Promotion Section -->
      <!----------------------->
      <Promotion />
    </div>
  </Suspense>
</template>
