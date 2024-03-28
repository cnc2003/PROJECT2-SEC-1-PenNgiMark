<template>
  <div class="h-[70%] shrink-0 w-11/12 rounded-md p-4 bg-slate-100 my-10">
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
                    <p>&nbsp x {{ menu.quantity }}</p>
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
</template>

<script setup>
import { ref ,onMounted} from "vue"
import { getList } from "../lib/fetch";
import PromoModal from "./PromoModal.vue"
import MenuBaseCard from "./MenuBaseCard.vue"
const promotions = ref([])
const isProModalOpen = ref(false)
onMounted(async () => {
  const [promotionsRes] = await Promise.all([getList("Promotions")])
  promotions.value = promotionsRes
})

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
