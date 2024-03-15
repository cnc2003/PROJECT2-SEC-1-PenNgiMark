<script setup>
import { ref } from "vue"

const li = ref("rounded-md w-full p-4 my-4")
const active = ref("rounded-md p-4 bg-gray-300")
const hover = ref("")
</script>

<template>
  <div
    class="flex flex-col gap-4 p-4 w-full h-screen bg-base-200 text-base-content"
  >
    <!-- Sidebar content here -->
    <p
      :class="li"
      :active-class="active"
    >
      <router-link to="/">Addmenu</router-link>
    </p>
    <p
      :class="li"
      :active-class="active"
    >
      <router-link to="/list-order">Listorder</router-link>
    </p>
    <p
      :class="li"
      :active-class="active"
    >
      <router-link to="/manegement">manegement</router-link>
    </p>
  </div>
</template>
