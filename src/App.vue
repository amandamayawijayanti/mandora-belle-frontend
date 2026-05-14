<script setup lang="ts">
import NavBar from '@/components/layouts/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
</script>

<template>
  <NavBar/>
  <router-view />

  <FooterSection />
</template>
