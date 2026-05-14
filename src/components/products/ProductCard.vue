<script setup lang="ts">
import type { Product } from "@/types/product"
import { useRouter } from "vue-router"

const props = defineProps<{
  product: Product
}>()

const router = useRouter()

const goToDetail = () => {
  router.push(`/products/${props.product.id}`)
}
</script>

<template>
  <div
    @click="goToDetail"
    class="w-full h-full bg-white rounded-2xl overflow-hidden cursor-pointer
    shadow-[0_8px_24px_rgba(0,0,0,0.12)]
    hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]
    hover:-translate-y-1 transition duration-300"
  >
    <!-- IMAGE -->
    <div class="w-full h-72 overflow-hidden bg-[#f8f3f1]">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition duration-300 hover:scale-105"
      />
    </div>

    <!-- CONTENT -->
    <div class="p-5">

      <!-- BRAND -->
      <p class="text-[#e6007e] text-lg font-medium mb-1">
        {{ product.kategori_id ? 'Mandora Belle' : 'Collection' }}
      </p>

      <!-- NAME -->
      <h2 class="text-xl text-gray-900 font-medium line-clamp-2 min-h-[56px]">
        {{ product.name }}
      </h2>

      <!-- PRICE + BADGE -->
      <div class="mt-3 flex items-center justify-between gap-3">

        <span class="text-[#e6007e] text-2xl font-medium whitespace-nowrap">
          Rp {{ Number(product.price || 0).toLocaleString("id-ID") }}
        </span>

        <span
          class="text-sm px-5 py-2 rounded-full font-medium whitespace-nowrap"
          :class="
            product.stock === 0
              ? 'bg-gray-200 text-gray-600'
              : product.stock < 5
              ? 'bg-red-100 text-red-600'
              : 'bg-pink-100 text-[#c2185b]'
          "
        >
          {{
            product.stock === 0
              ? 'Barang Habis'
              : product.stock < 5
              ? 'Segera Order'
              : 'Tersedia'
          }}
        </span>

      </div>

      <!-- STOCK -->
      <p class="mt-3 text-sm text-gray-500">
        Stok: {{ product.stock }}
      </p>

    </div>
  </div>
</template>