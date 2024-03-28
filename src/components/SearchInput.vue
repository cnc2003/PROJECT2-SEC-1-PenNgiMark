<script setup>
import { ref, computed, watch } from "vue"
const props = defineProps({
    drinks: { type: Array, required: true },
    editingMenu: { type: Object, required: true },
})

const prevMenu = computed(() => {
    return props.editingMenu
})
const listOption = ref([])
const isInputClicked = ref(false)

const optionClicked = (newName) => {
    isInputClicked.value = false
    prevMenu.value.menuName = newName
}

const listOptiond = computed(() => {
    return props.drinks.map((drink) => {
        return drink.menus.map((menu) => {
            return menu.menu_name
        })
    })
})

const filterOption = (newKeyword) => {
    const filteredOption = []
    let keyword = newKeyword
    for (const category of props.drinks) {
        for (const menu of category.menus) {
            if (menu.menu_name.toUpperCase().includes(keyword.toUpperCase())) {
                filteredOption.push(menu.menu_name)
            }
        }
    }
    listOption.value = filteredOption
}
</script>

<template>
    <div class="flex flex-col">
        <div @blur="isInputClicked = false">
            <input
                type="text"
                class="border border-slate-300 w-96"
                v-model.trim="prevMenu.menuName"
                @input="filterOption(prevMenu.menuName)"
                @focus="isInputClicked = true"
            />
        </div>
        <div
            class=""
            :class="
                isInputClicked
                    ? 'absolute max-h-40 w-96 mt-7 bg-slate-200 overflow-auto'
                    : 'hidden'
            "
        >
            <div
                v-for="(menu, index) in listOption"
                @click="optionClicked(menu)"
            >
                {{ menu }}
            </div>
        </div>
    </div>
</template>
