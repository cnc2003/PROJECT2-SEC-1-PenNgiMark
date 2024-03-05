<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>

  <div class="dropdown dropdown-bottom">
  <div tabindex="0" role="button" class="btn m-1">Click</div>
  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div>
</template>

<style scoped>

</style>
