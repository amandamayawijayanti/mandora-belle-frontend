<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCategories } from '@/services/categoryService'
import { useRouter } from 'vue-router'

const router = useRouter() 
const categories = ref<any[]>([])

const goToCategory = (kategoriId: number) => { // ✅ TAMBAH INI
  router.push(`/shop?kategori=${kategoriId}`)
}

onMounted(async () => {
  categories.value = await getCategories()
})
</script>

<template>
  <section 
    class="py-20 bg-cover bg-center"
    style="background-image: url('/image/bg-category.png')"
  >

    <!-- CENTER WRAPPER -->
    <div class="flex justify-center">
      <div class="w-full max-w-[1100px] text-center px-4">

        <!-- Title -->
        <p class="text-[#c98778] text-sm tracking-wide mb-1">
          DISCOVER OUR COLLECTION
        </p>

        <h2 class="text-[#9b5b3f] font-serif text-3xl sm:text-4xl font-semibold mb-16">
          Curated Categories
        </h2>

        <!-- Responsive Grid -->
        <div 
          class="relative top-10 grid 
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
          gap-x-8 gap-y-10 justify-items-center"
        >

         <div
  v-for="category in categories"
  :key="category.id"
  class="group flex flex-col items-center w-full max-w-[220px] cursor-pointer"
  @click="goToCategory(category.id)"
>
            <!-- Image -->
            <div
              class="w-full aspect-square rounded-xl overflow-hidden
              shadow-[0_6px_16px_rgba(0,0,0,0.25)]
              transition duration-300
              group-hover:-translate-y-2
              group-hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
            >
              <img
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-cover transition duration-300 group-hover:scale-110"
              />
            </div>

            <!-- Text Card -->
            <div
              class="bg-[#c98778] text-white rounded-lg px-4 py-2 w-full mt-4
              shadow transition duration-300 group-hover:-translate-y-1"
            >
              <p class="font-serif font-semibold text-base sm:text-lg leading-none">
                {{ category.name }}
              </p>

              <p class="text-xs mt-1 opacity-90">
                {{ category.description }}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>

  </section>
</template>