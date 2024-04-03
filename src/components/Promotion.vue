<script setup>
import { ref } from "vue"
import { addItem, deleteItemById, editItem } from "../lib/fetch.js"
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
        if (updateRes) {
            const idx = props.promotions.findIndex(
                (pro) => pro.id === updateRes.id
            )
            props.promotions[idx] = updateRes
        }
    }
    if (action === "Add-Promotion") {
        const addRes = await addItem("Promotions", body)
        console.log(addRes)
        if (addRes.resCode === 201) {
            props.promotions.push(addRes.data)
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
        <hr class="my-6 w-full border-2 border-slate" />
        <div class="w-full overflow-auto">
            <table class="w-full">
                <thead class="text-2xl">
                    <tr class="w-full">
                        <th></th>
                        <th class="w-[30%] text-start">Name</th>
                        <th class="w-[30%] text-start">Drinks</th>
                        <th class="w-[30%] text-start">Discount Price</th>
                    </tr>
                </thead>
                <tbody class="text-xl">
                    <tr
                        v-for="(pro, index) in promotions"
                        :key="pro.id"
                        :class="index % 2 === 0 ? 'bg-slate-200' : ''"
                        class="border h-10 cursor-pointer hover:scale-[102%] transition-all duration-300 ease-in-out"
                        @click="openPromoModal(pro)"
                    >
                        <td class="text-center font-bold">{{ index + 1 }}</td>
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
