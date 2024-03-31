<script setup>
import { ref } from "vue"
import { deleteItemById, editItem } from "../lib/fetch.js"
import PromoModal from "./PromoModal.vue"
const isProModalOpen = ref(false)
const props = defineProps({
    promotions: { type: Array, require: false },
    drinks: { type: Array, require: false },
    hr: String,
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

const actionPromotion = async (action, body) => {
    if (action === "Delete-Promotion") {
        const deleteRes = await deleteItemById("Promotions", body)
        if (deleteRes === 200) {
            const idx = props.promotions.findIndex((pro) => pro.id === body)
            props.promotions.splice(idx, 1)
        }
    }
    if (action === "Save-Promotion") {
        const updateRes = await editItem("Promotions", body.id, body)
        if (updateRes){
            const idx = props.promotions.findIndex((pro) => pro.id === updateRes.id)
            props.promotions[idx] = updateRes
        }
    }
}
</script>

<template>
    <div
        class="h-[70%] shrink-0 w-11/12 p-4 my-10 rounded-3xl bg-white border-solid border-slate-300 border-4 flex flex-col justify-start items-start"
    >
        <div class="flex justify-between w-full">
            <div class="flex gap-2">
                <h1 class="text-2xl font-bold">Promotion</h1>
                <span
                    class="flex justify-center content-center bg-slate-200 rounded-full size-8"
                >
                    <p class="text-2xl font-bold">{{ promotions.length }}</p>
                </span>
            </div>
            <h1 class="btn btn-sm" @click="openPromoModal()">
                Add New Promotion
                <img
                    src="/src/assets/icon/plus.svg"
                    alt="plus"
                    class="size-4"
                />
            </h1>
        </div>
        <hr :class="hr" class="z-0 my-6 w-full" />
        <div class="w-full">
            <table class="table w-full table-zebra">
                <thead class="text-2xl">
                    <tr class="w-full">
                        <th></th>
                        <th class="w-[30%]">Name</th>
                        <th class="w-[30%]">Drinks</th>
                        <th class="w-[30%]">Discount Price</th>
                    </tr>
                </thead>
                <tbody class="text-xl">
                    <tr
                        v-for="pro in promotions"
                        :key="pro.id"
                        class="hover hover:scale-[101%] hover:rounded-xl"
                        @click="openPromoModal(pro)"
                    >
                        <td class="text-center font-bold">{{ pro.id }}</td>
                        <td>
                            {{ pro.name }}
                        </td>
                        <td class="">
                            <ul class="list-disc pl-4">
                                <li
                                    v-for="(menu, index) in pro.menus"
                                    :key="index"
                                >
                                    {{ menu.menuName }} x
                                    {{ menu.quantity }}
                                </li>
                            </ul>
                        </td>
                        <td class="text-lg font-semibold">
                            {{ pro.discount + " ฿" }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-if="isProModalOpen">
        <PromoModal
            @closeModal="colsePromoModal"
            @savePromotion="updatePromo"
            @actionComfirm="actionPromotion"
            :drinks="drinks"
            :promotion="editingPromo"
        />
    </div>
</template>
