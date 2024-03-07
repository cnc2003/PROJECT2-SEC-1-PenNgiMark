
<template>
  <h1 class="text-3xl font-bold underline flex justify-center">
    Header Najaaaaaaa
  </h1>
  <div class="flex justify-center">
    <router-link to="/add-menu" class="pr-1 pl-1" active-class="text-blue-500">Addmenu</router-link> |
    <router-link to="/list-order" class="pr-1 pl-1" active-class="text-blue-500">Listorder</router-link>|
    <router-link to="/manegement" class="pr-1 pl-1" active-class="text-blue-500">Listorder</router-link>
  </div>
  <router-view/>
</template>


