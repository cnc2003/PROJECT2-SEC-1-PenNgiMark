<script setup>
import { ref } from "vue"

const li = ref("rounded-md w-full p-4 text-gray-500 font-semibold")
const action = ref("bg-gray-200 text-gray-800 ")
</script>

<template>
  <div class="flex flex-col p-4 gap-2 w-full h-screen bg-base-200 text-base-content">
    <!-- Sidebar content here -->

    <router-link
      to="/"
      class="hover:bg-gray-200 hover:text-gray-800"
      :class="li"
      :active-class="action"
      :hover="action"
    >
      Addmenu
    </router-link>
    <router-link
      to="/list-order"
      class="hover:bg-gray-200 hover:text-gray-800"
      :class="li"
      :active-class="action"
    >
      Listorder
    </router-link>
    <router-link
      to="/manegement"
      class="hover:bg-gray-200 hover:text-gray-800"
      :class="li"
      :active-class="action"
    >
      Management
    </router-link>
  </div>
</template>
