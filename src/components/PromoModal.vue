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
    class="fixed flex justify-center items-center z-10 inset-0 bg-gray-500 bg-opacity-60 w-screen"
    @click="$emit('closeModal', false), $event"
  >
    <div
      class="bg-white w-auto h-auto flex flex-col gap-2 justify-center rounded-3xl p-10"
      @click="$event.stopPropagation()"
    >
      <div class="mb-3">
        <h1 class="font-bold text-3xl">Update menu easily</h1>
        <p class="text-xl">add or edit items.</p>
      </div>
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
      <div>
        <div class="label">
          <span class="">Promotion Name </span>
        </div>
        <CartCard
          v-for="(menu, index) in menus"
          :key="index"
          class="border border-gray-300 rounded-md h-8 flex justify-center items-center"
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
            <button @click="menu.quantity <= 1 ? null : menu.quantity--">
              -
            </button>
            <p>{{ menu.quantity }}</p>
            <button @click="menu.quantity++">+</button>
          </template>
        </CartCard>
        <button
          @click="addMenu"
          class="self-center bg-gray-300 rounded-md w-16 h-8"
        >
          +
        </button>
      </div>
      <div>
        <div class="label">
          <span class="">Discount: </span>
        </div>
        <input
          type="number"
          v-model.number="discount"
          min="0"
          class="p-0.5 border border-gray-300 rounded-lg outline-none"
        />
      </div>

      <button @click="savePromotion">Save</button>
      <button
        @click="$emit('closeModal', false)"
        class="border"
      >
        CloseModal
      </button>
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
