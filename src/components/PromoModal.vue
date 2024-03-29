<script setup>
import { ref, computed } from "vue"
import CartCard from "./CartCard.vue"
import JsxIconBase from "./JsxIconBase.vue"
import SearchInput from "./SearchInput.vue"
const emits = defineEmits(["closeModal", "savePromotion"])
const props = defineProps({
  promotion: {
    type: Object,
    default: {
      id: undefined,
      name: "",
      menus: [{ menuName: "", quantity: 1 }],
      discount: 0,
    },
  },
  drinks: { type: Array, required: true },
})

// if (!props.promotion){}

let { id, name, menus, discount } = props.promotion
console.log(menus)

const savePromotion = () => {
  console.log("savePromotion")

  emits("savePromotion", {
    id: id,
    name: name,
    menus: menus,
    discount: discount,
  })
  emits("closeModal", false)
}

const addMenu = () => {
  menus.push({ menuName: "", quantity: 1 })
}

const removeMenu = (index) => {
  if (menus[index].menuName.length > 0) {
    alert("Cannot remove menu")
    return
  }
  menus.splice(index, 1)
}
</script>

<template>
  <div
    class="fixed flex justify-center items-center gap-4 z-10 inset-0 bg-gray-500 bg-opacity-60 w-screen"
    @click="$emit('closeModal', false), $event"
  >
    <div
      class="bg-white w-auto h-auto flex flex-col gap-2 justify-center rounded-3xl p-10 "
      @click="$event.stopPropagation()"
    >
      <div class="mb-3">
        <h1 class="font-bold text-3xl">Update menu easily</h1>
        <p class="text-xl">add or edit items.</p>
      </div>
      <div class="mb-3">
      <div>
        <div class="label">
          <span class="">Promotion Name </span>
        </div>
        <input
          type="text"
          v-model.trim="name"
          class="p-0.5 border border-gray-300 rounded-lg outline-none"
        />
      </div>
      <div
        name="drinks "
        class="w-full flex flex-col"
      >
        <div class="label">
          <span class="">Promotion Name </span>
        </div>
        <div
          name="drinks container"
          class="border border-gray-300 rounded-md p-4"
        >
          <CartCard
            v-for="(menu, index) in menus"
            :key="index"
            class="flex justify-center items-center pb-2"
          >
            <template #drinkName>
              <!-- <input
                type="text"
                v-model.trim="menu.menuName"
                class="p-0.5 border border-gray-300 rounded-lg outline-none"
            /> -->
              <SearchInput
                :drinks="props.drinks"
                :editingMenu="menu"
                class="z-20"
              />
            </template>
            <template #quantity>
              <!-- <button @click="removeMenu(index)">X</button> -->
              <div class="flex flex-row gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 hover:scale-[105%]"
                  @click="menu.quantity <= 1 ? null : menu.quantity--"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <p>{{ menu.quantity }}</p>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 hover:scale-[105%]"
                  @click="menu.quantity++"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </template>
          </CartCard>
          <div
            name="flex"
            class="flex justify-center w-full h-10"
          >
            <button
              @click="addMenu"
              class="btn btn-sm bg-sky-300 hover:bg-sky-200 border-0 rounded-md w-[80%] mt-2"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="label">
          <span>Discount</span>
        </div>
        <input
          type="number"
          v-model.number="discount"
          min="0"
          class="p-0.5 border border-gray-300 rounded-lg outline-none"
        />
      </div>
    </div>
      <div class="flex flex-col gap-2 justify-center items-center">
        <button
          @click="savePromotion"
          class="btn btn-sm btn-success w-[80%]"
        >
          Save
        </button>
        <button
          @click="$emit('closeModal', false)"
          class="btn btn-sm btn-warning btn-outline w-[80%]"
        >
          CloseModal
        </button>
      </div>
      <JsxIconBase
        iconName="Trash"
        color="red"
      />
    </div>
  </div>
</template>

<style scoped>
/* class="bg-white w-1/2 h-1/2 flex flex-col justify-center items-center" */
</style>
