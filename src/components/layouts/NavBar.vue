<script setup lang="ts">
import { ref } from "vue"
import { RouterLink, useRouter } from "vue-router"

const router = useRouter()

const mobileMenu = ref(false)
const searchKeyword = ref("")

const searchProduct = () => {
  const keyword = searchKeyword.value.trim()

  if (!keyword) {
    router.push("/shop")
    return
  }

  router.push(`/shop?search=${encodeURIComponent(keyword)}`)
}

const toggleMenu = () => {
  mobileMenu.value = !mobileMenu.value
}
</script>

<template>
  <nav class="sticky top-0 z-50 w-full bg-[#fffafa] px-4 py-2 border-b border-[#f1d8d0]">
    <div class="max-w-7xl mx-auto flex items-center justify-between">

      <!-- LEFT -->
      <div class="flex items-center gap-3">
        <!-- MOBILE BUTTON -->
        <button
          @click="toggleMenu"
          class="md:hidden text-[#9b5b3f] text-3xl"
        >
          <i class="bi bi-list"></i>
        </button>

        <!-- LOGO -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div
            class="w-10 h-10 rounded-full bg-[#ffe1cf]
            flex items-center justify-center"
          >
            <span class="text-[#9b4f2f] font-serif text-sm font-bold">
              MB
            </span>
          </div>

          <div class="leading-[0.85]">
            <h1 class="text-[#b8734f] font-serif text-xl font-semibold">
              Mandora
            </h1>

            <h1 class="text-[#b8734f] font-serif text-lg font-semibold">
              Belle
            </h1>

            <p class="text-[10px] italic text-[#9b4f2f] mt-1">
              dreamy collection
            </p>
          </div>
        </RouterLink>
      </div>

      <!-- DESKTOP MENU -->
      <ul
        class="hidden md:flex items-center gap-10
        text-sm text-[#8b4a2b] font-semibold"
      >
        <li>
          <RouterLink to="/" class="hover:text-[#c47a55]">
            Home
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/shop" class="hover:text-[#c47a55]">
            Shop
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/#about-section" class="hover:text-[#c47a55]">
            About
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/#contact-section" class="hover:text-[#c47a55]">
            Contact
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/pesanan" class="hover:text-[#c47a55]">
            Pesanan
          </RouterLink>
        </li>
      </ul>

      <!-- RIGHT -->
      <div class="flex items-center gap-4">
        <!-- SEARCH -->
        <div
          class="hidden sm:flex items-center
          bg-white border border-[#f1d8d0]
          rounded-full px-4 py-2 w-60
          shadow-sm"
        >

          <!-- ICON -->
          <button
            @click="searchProduct"
            class="text-[#b56a4a] text-sm mr-2"
          >
            <i class="bi bi-search"></i>
          </button>

          <!-- INPUT -->
          <input
            v-model="searchKeyword"
            @keyup.enter="searchProduct"
            type="text"
            placeholder="Search dreamy pieces..."
            class="bg-transparent outline-none
            text-sm text-[#8b4a2b]
            placeholder:text-[#caa79a]
            w-full"
          />

        </div>

        <!-- PROFILE -->
        <RouterLink
          to="/profile"
          class="text-[#9b5b3f] hover:text-[#c98778]"
        >
          <i class="bi bi-person-circle text-2xl"></i>
        </RouterLink>

        <!-- CART -->
        <RouterLink
          to="/cart"
          class="text-[#8b4a2b] text-2xl"
        >
          <i class="bi bi-cart3"></i>
        </RouterLink>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <div
      v-if="mobileMenu"
      class="md:hidden mt-4 bg-white rounded-2xl
      shadow-lg border border-[#f1d8d0] p-5"
    >
      <ul class="flex flex-col gap-5 text-[#9b5b3f] font-medium">
        <li>
          <RouterLink to="/" @click="mobileMenu = false">
            Home
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/shop" @click="mobileMenu = false">
            Shop
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/#about-section" @click="mobileMenu = false">
            About
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/#contact-section" @click="mobileMenu = false">
            Contact
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/pesanan" @click="mobileMenu = false">
            Pesanan
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>