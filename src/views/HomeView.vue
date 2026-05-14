<script setup lang="ts">
import ProductView from './products/ProductView.vue'
import CategorySection from '@/components/categories/CategorySection.vue'
import LimitedTreasures from '@/components/products/LimitedTreasures.vue'
import AboutSection from '@/components/AboutSection.vue'
import TestimonialSection from '@/components/TestimonialSection.vue'
</script>

<template>

  <!-- HERO -->
  <section class="bg-[#f7e9e5] py-16 px-10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

      <!-- Left -->
      <div class="relative -top-8">
        <p class="text-[#b98270] text-sm tracking-wide mb-3">
          DREAMY COLLECTION 2026
        </p>

        <h1 class="font-serif text-[#9b5b3f] text-6xl font-bold leading-[1.05]">
          Be Cute,
        </h1>

        <div class="flex items-center gap-3 mt-2">
          <h2 class="font-serif italic text-[#c48778] text-5xl leading-none">
            Be Belle
          </h2>
          <span class="text-4xl">✨</span>
        </div>

        <p class="text-[#c48778] text-sm leading-relaxed mt-5 max-w-md">
          Temukan koleksi fashion dreamy yang memadukan keanggunan natural
          dan sentuhan manis. Setiap piece dirancang dengan detail lembut
          untuk menghadirkan pesona yang selalu memukau dalam setiap momenmu.
        </p>

        <RouterLink
          to="/shop"
          class="relative top-10 inline-flex items-center gap-2 bg-[#c98778] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87667] transition"
        >
          <span>▶</span>
          Explore Collection
        </RouterLink>
      </div>

      <!-- Right Image -->
      <div class="flex justify-center">
        <img
          src="/image/hero-section1.jpg"
          alt="Mandora Belle Collection"
          class="w-[780px] h-[350px] object-cover rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.35)]"
        />
      </div>

    </div>
  </section>

  <!-- 🔥 CATEGORY SECTION -->
  <CategorySection />

  <LimitedTreasures />

  <AboutSection />

  <TestimonialSection />

  <!-- 🔥 PRODUCT SECTION -->
  <!-- <section class="bg-[#f7e9e5] p-10">
    <ProductView />
  </section> -->

</template>