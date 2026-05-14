<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import type { Product } from "@/types/product"

import ProductCard from "@/components/products/ProductCard.vue"

const products = ref<Product[]>([])
const loading = ref(true)

const limitedProducts = computed(() => {
  return products.value
    .filter(
      (product) =>
        Number(product.stock) > 0 &&
        Number(product.stock) < 5
    )
    .slice(0, 6)
})

onMounted(async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/products")
    const result = await response.json()

    products.value = result.data.map((item: any) => ({
      id: item.id,
      name: item.attributes?.name ?? item.nama,
      description: item.attributes?.description ?? item.deskripsi_produk,
      price: item.attributes?.price ?? item.harga_produk,
      stock: item.attributes?.stock ?? item.stock,
      image: item.attributes?.image_url ?? item.image_url ?? item.gambar,
      kategori_id: item.attributes?.kategori_id ?? item.kategori_id,
    }))
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="bg-[#f7e9e5] px-6 py-16">

    <!-- CENTER -->
    <div class="w-full flex justify-center">

      <div class="w-full max-w-[1220px]">

        <!-- TITLE -->
        <div class="text-center h-30">

          <p class="text-[#c98778] text-sm tracking-wide mb-1">
            ONLY A FEW LEFT
          </p>

          <h2
            class="text-[#9b5b3f]
            font-serif
            text-3xl sm:text-4xl
            font-semibold
            mb-4"
          >
            Limited Treasures
          </h2>

          <p class="text-sm text-[#b98270]">
            Koleksi pilihan dengan stok terbatas, sebelum kehabisan ♡
          </p>

        </div>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="text-center text-[#9b5b3f]"
        >
          Memuat produk limited...
        </div>

        <!-- EMPTY -->
        <div
          v-else-if="limitedProducts.length === 0"
          class="bg-white rounded-3xl shadow-md p-8 text-center text-gray-500"
        >
          Belum ada produk limited.
        </div>

        <!-- GRID -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <ProductCard
            v-for="product in limitedProducts"
            :key="product.id"
            :product="product"
          />
        </div>

      </div>

    </div>
  </section>
</template>