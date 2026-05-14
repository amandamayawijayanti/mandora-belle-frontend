<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useProductStore } from "@/stores/productStore"
import ProductCard from "@/components/products/ProductCard.vue"
import { useRoute } from "vue-router"

const productStore = useProductStore()
const route = useRoute()

// ambil kategori dari URL
const selectedCategory = computed(() => route.query.kategori)

// mapping nama kategori → id
const categoryMap: any = {
  Dresses: 8,
  Accessories: 9,
  Bags: 10,
  Footwear: 11,
}

onMounted(async () => {
  try {
    console.log("FETCH MULAI")
    await productStore.fetchProducts()
    console.log("DATA:", productStore.products)
  } catch (error) {
    console.error("ERROR FETCH:", error)
  }
})

// 🔥 FILTER YANG SUDAH DIPERBAIKI
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return productStore.products

  const selectedCategoryId = categoryMap[String(selectedCategory.value)]

  return productStore.products.filter((p: any) =>
    p.attributes?.kategori_id === selectedCategoryId
  )
})
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">

    <div v-if="productStore.loading" class="text-center text-black">
      Loading...
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>

  </div>
</template>