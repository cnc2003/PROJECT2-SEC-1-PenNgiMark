<template>
  <div
    class="h-[70%] shrink-0 w-11/12 p-4 my-10 rounded-3xl bg-white border-solid border-slate-300 border-4"
  >
    <div class="flex justify-between">
      <div class="flex gap-2">
        <h1 class="text-2xl font-bold">Promotion</h1>
        <span class=" flex justify-center content-center bg-slate-200 rounded-full size-8"> <p class="text-2xl font-bold">{{ promotions.length }}</p> </span>
      </div>
      <h1
        class="btn btn-sm"
        @click="openPromoModal()"
      >
        Add New Promotion
        <img
                  src="/src/assets/icon/plus.svg"
                  alt="plus"
                  class="size-4"
                />
      </h1>
    </div>
    <hr :class="hr" class="my-2" />
    <div class="flex flex-col justify-center ">
      <div class="flex flex-row justify-around ">
        <h2>Name</h2>
        <h2>Drinks</h2>
        <h2>Discount</h2>
      </div>
      
        <div
          v-for="pro in promotions"
          :key="pro.id"
          class="flex flex-row justify-around items-center border w-full h-12 border-gray-300 rounded-md pointer hover:scale-105 transition-all "
          @click="openPromoModal(pro)"
        >
          <div class="justify-self-center w-[33%] pl-28">
            {{ pro.name }}
          </div>
          <div class="w-[33%]">
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
                    <p>&nbsp; x {{ menu.quantity }}</p>
                  </template>
                </MenuBaseCard>
              </li>
            </ul>
          </div>
          <div class="w-1/3 justify-self-center">
            {{ pro.discount }}
          </div>
        </div>
      
    </div>
  </div>
  <div v-if="isProModalOpen">
    <PromoModal
      @closeModal="colsePromoModal"
      @savePromotion="updatePromo"
      :drinks="drinks"
      :promotion="editingPromo"
    />
  </div>
</template>

<script setup>
import { ref} from "vue"
import PromoModal from "./PromoModal.vue"
import MenuBaseCard from "./MenuBaseCard.vue"
const isProModalOpen = ref(false)
const props = defineProps({
  promotions: { type: Array, require: false },
  drinks: { type: Array, require: false },
  hr: String,
})

// onMounted(async () => {
//   const [promotionsRes] = await Promise.all([])
//   promotions.value = promotionsRes
// })

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
  ////console.log(newPromo)
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
</script>

<style></style>
