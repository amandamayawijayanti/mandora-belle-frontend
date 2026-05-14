<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useProductStore } from "@/stores/productStore"
import ProductCard from "@/components/products/ProductCard.vue"
import { useRoute } from "vue-router"

const productStore = useProductStore()
const route = useRoute()

const selectedCategory = computed(() => Number(route.query.kategori || 0))
const searchQuery = computed(() => String(route.query.search || "").toLowerCase())

const categoryMap: Record<number, string> = {
  8: "dresses",
  9: "accessories",
  10: "bags",
  11: "footwear",
}

const getCategoryName = (id: number) => {
  return categoryMap[id] || ""
}

const categoryTitle = computed(() => {
  if (searchQuery.value) return `Search: ${route.query.search}`

  const id = selectedCategory.value

  if (id === 8) return "Dresses"
  if (id === 9) return "Accessories"
  if (id === 10) return "Bags"
  if (id === 11) return "Footwear"

  return "Shop"
})

const categorySubtitle = computed(() => {
  if (searchQuery.value) return "SEARCH RESULT"

  const id = selectedCategory.value

  if (id === 8) return "ETHEREAL PIECES"
  if (id === 9) return "DELICATE DETAILS"
  if (id === 10) return "SOFT COMPANIONS"
  if (id === 11) return "GRACEFUL STEPS"

  return "MANDORA BELLE COLLECTION"
})

onMounted(async () => {
  try {
    await productStore.fetchProducts()
  } catch (error) {
    console.error("Gagal mengambil products:", error)
  }
})

const filteredProducts = computed(() => {
  let products = productStore.products

  // FILTER CATEGORY
  if (selectedCategory.value) {
    products = products.filter((p: any) =>
      Number(p.kategori_id) === Number(selectedCategory.value)
    )
  }

  // FILTER SEARCH
  if (searchQuery.value) {
    products = products.filter((p: any) => {
      const name = String(p.name || "").toLowerCase()
      const description = String(p.description || "").toLowerCase()
      const categoryName = getCategoryName(Number(p.kategori_id)).toLowerCase()

      return (
        name.includes(searchQuery.value) ||
        description.includes(searchQuery.value) ||
        categoryName.includes(searchQuery.value)
      )
    })
  }

  return products
})
</script>

<template>
  <div class="bg-[#f5ede8] min-h-screen py-10">

    <!-- CENTER -->
    <div class="w-full flex justify-center">

      <div class="w-full max-w-[1350px] px-6">

        <!-- TITLE -->
        <div class="text-center mb-14 h-25">

          <h1 class="text-4xl font-serif font-bold text-[#9b5b3f]">
            {{ categoryTitle }}
          </h1>

          <p class="text-[#c98778] tracking-wide mt-2">
            {{ categorySubtitle }}
          </p>

        </div>

        <!-- LOADING -->
        <div
          v-if="productStore.loading"
          class="text-center text-black"
        >
          Loading...
        </div>

        <!-- EMPTY -->
        <div
          v-else-if="filteredProducts.length === 0"
          class="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500"
        >
          Produk tidak ditemukan.
        </div>

        <!-- PRODUCT GRID -->
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

    </div>

  </div>
</template>