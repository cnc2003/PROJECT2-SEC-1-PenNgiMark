<script setup>
import { ref, computed } from "vue"
const props = defineProps({ drinks: { type: Array, required: true } })
const isInputClicked = ref(false)
const menuName = ref("")

const optionClicked = (newName) => {
    isInputClicked.value = false
    menuName.value = newName
}

const filterdDrinks = computed(() => {
    return props.drinks.filter((drink) => {
        return drink.menuName
            .toUpperCase()
            .includes(menuName.value.toUpperCase())
    })
})
</script>

<template>
    <div
        class="max-w-60 border border-slate-300"
        @blur="isInputClicked = false"
    >
        <slot name="default">
            <input
                type="text"
                class="border border-slate-300 w-full"
                v-model.trim="menuName"
                @focus="isInputClicked = true"
            />
        </slot>
        <div class="w-full z-30" :class="isInputClicked ? '' : 'hidden'">
            <button
                v-for="(drink, index) in filterdDrinks"
                :key="index"
                class="block w-full text-left"
                @click="optionClicked(drink.menuName)"
            >
                {{ drink.menuName }}
            </button>
        </div>
    </div>
</template>
