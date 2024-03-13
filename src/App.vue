<script setup >
import Navbar from './components/Navbar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex h-screen">
    <div class="w-1/6">
      <Navbar/>
    </div>
    <div class="flex flex-col w-full">
      <router-view/>
    </div>
  </div>
</template>


