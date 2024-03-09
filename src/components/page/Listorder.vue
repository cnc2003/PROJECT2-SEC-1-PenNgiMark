<script>
import BaseList from "../BaseList.vue"
</script>

<template>
  <h1 class="text-3xl bg-green-400 w-1/6">this is page Listorder</h1>

  <BaseList :orders="$orderlist">
    <template #default="{ order }">
      <div class="flex text-gray-800 divide-y divide-slate-100 p-2">
        <div class="w-1/4">{{ order.menu_name }}</div>
        <div class="w-2/4">{{ order.quantity }}</div>
        <div class="w-auto">{{ order.details }}</div>
      </div>
    </template>
  </BaseList>
</template>
