<script setup>
import { ref } from 'vue'

const emits = defineEmits(['close', 'serve'])

const cancelConfirmation = () => {
  showModal.value = false
  emits('close', false)
}

const confirmAction = () => {
  emits('close', false)
  emits('serve', true)
}
  </script>
<template>
    <div @click="emits('close',false)" >
      <!-- ModalConfirm -->
      <div class="fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
        <div class="w-lvw h-lvh bg-black bg-opacity-50"></div>
        <div class="fixed w-1/4 h-[30%] bg-white rounded-xl flex flex-col items-center indicator">
          <div class="flex flex-col">
            <div class="text-xl border-b-4 mt-2 flex justify-center">Confirm Menu</div>
            <!-- modal content -->
            <div class="mb-12 mt-10">Do you confirm to serve Menu?</div>
            <!-- button -->
            <div class="flex justify-center">
              <button class="bg-red-500 rounded-lg btn btn-md mr-10" @click="cancelConfirmation">
                cancel
              </button>
              <button class="bg-sky-500 rounded-lg btn btn-md" @click="confirmAction">
                serve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  </style>
  