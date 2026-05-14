<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <header class="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md">
    
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      
      <!-- Logo -->
      <h1 class="text-xl font-bold">
        eFurniture
      </h1>

      <!-- Menu Desktop -->
      <nav class="hidden md:flex gap-6">
        <a href="#" class="hover:underline">Home</a>
        <a href="#" class="hover:underline">Cart</a>
        <a href="#" class="hover:underline">Login</a>
        <a href="#" class="hover:underline">Register</a>
      </nav>

      <!-- Hamburger -->
      <button 
        class="md:hidden text-2xl"
        @click="isOpen = !isOpen"
      >
        ☰
      </button>

    </div>

    <!-- Menu Mobile -->
    <div v-if="isOpen" class="md:hidden px-6 pb-4 flex flex-col gap-3 bg-indigo-500">
      <a href="#" class="hover:underline">Home</a>
      <a href="#" class="hover:underline">Cart</a>
      <a href="#" class="hover:underline">Login</a>
      <a href="#" class="hover:underline">Register</a>
    </div>

  </header>
</template>