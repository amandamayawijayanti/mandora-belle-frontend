<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useToast } from "vue-toastification"

const route = useRoute()
const router = useRouter()

const toast = useToast()

const product = ref<any>(null)
const loading = ref(true)

const quantity = ref(1)
const selectedSize = ref("")

const formatRupiah = (value: number) => {
  return "Rp " + Number(value || 0).toLocaleString("id-ID")
}

const productImage = computed(() => product.value?.image || "")

const isFootwear = computed(() => {
  const id = Number(product.value?.kategori_id)
  return id === 11 || id === 7
})

const isDress = computed(() => {
  const id = Number(product.value?.kategori_id)
  return id === 8 || id === 4
})

const sizeOptions = computed(() => {
  if (isFootwear.value) return ["35", "36", "37", "38", "39", "40", "41", "42"]
  if (isDress.value) return ["S", "M", "L", "XL", "XXL"]
  return []
})

const needSize = computed(() => sizeOptions.value.length > 0)

const increaseQty = () => {
  if (!product.value) return
  if (quantity.value < Number(product.value.stock)) quantity.value++
}

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

const validateBeforeAction = () => {
  if (needSize.value && !selectedSize.value) {
    toast.error("Pilih ukuran dulu yaa")
    return false
  }

  if (quantity.value > Number(product.value.stock)) {
    alert("Jumlah melebihi stok")
    return false
  }

  return true
}

const addToCart = async () => {
  if (!product.value) return
  if (!validateBeforeAction()) return

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  try {
    const response = await fetch("http://127.0.0.1:8000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({
        user_id: user.id,
        product_id: product.value.id,
        quantity: quantity.value,
      }),
    })

    if (!response.ok) {
      throw new Error("Gagal request ke API cart")
    }

    toast.success(`${quantity.value} produk berhasil masuk keranjang!`)

    setTimeout(() => {
      router.push("/cart")
    }, 800)

  } catch (error) {
    console.error(error)
    toast.error("Gagal memasukkan produk ke keranjang")
  }
}
const buyNow = () => {
  if (!product.value) return
  if (!validateBeforeAction()) return

  localStorage.setItem(
    "checkoutItems",
    JSON.stringify([
      {
        product: product.value,
        price: product.value.price,
        quantity: quantity.value,
        size: selectedSize.value,
      },
    ])
  )

  router.push("/checkout")
}

onMounted(async () => {
  const id = route.params.id

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`)
    const result = await response.json()
    const data = result.data

    product.value = {
      id: data.id,
      name: data.attributes?.name ?? data.nama,
      description: data.attributes?.description ?? data.deskripsi_produk,
      price: data.attributes?.price ?? data.harga_produk,
      stock: data.attributes?.stock ?? data.stock,
      image: data.attributes?.image_url ?? data.image_url ?? data.gambar,
      kategori_id: data.attributes?.kategori_id ?? data.kategori_id,
      created_at: data.attributes?.created_at ?? data.created_at,
      updated_at: data.attributes?.updated_at ?? data.updated_at,
    }
  } catch (error) {
    console.error(error)
    alert("Produk gagal dimuat")
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="min-h-screen bg-[#f7e9e5] py-10 px-6 flex justify-center">
    <div class="flex items-start gap-4 w-full max-w-[1120px]">

      <!-- PANAH -->
      <button
        @click="router.back()"
        class="mt-3 shrink-0 flex items-center justify-center
        w-10 h-10 rounded-full bg-white border border-[#f1d8d0]
        text-[#9b5b3f] text-3xl shadow-sm
        hover:bg-[#fff8f6] hover:scale-105 transition"
      >
        ‹
      </button>

      <!-- CONTAINER -->
      <div class="w-full max-w-5xl flex flex-col items-center">

        <div v-if="loading" class="text-center text-[#9b5b3f]">
          Memuat detail produk...
        </div>

        <div
          v-else-if="product"
          class="w-full flex flex-col items-center space-y-6"
        >
          <!-- DETAIL UTAMA -->
          <div
            class="bg-white rounded-2xl p-8 border border-[#f1d8d0] shadow-md w-full"
          >
            <div class="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 items-start">

              <!-- GAMBAR -->
              <div
                class="w-full max-w-[380px] h-[340px] rounded-2xl bg-[#fff8f6] flex items-center justify-center overflow-hidden mx-auto"
              >
                <img
                  :src="productImage"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
              </div>

        <!-- INFO -->
        <div class="w-full -mt-3 space-y-8">

          <!-- TITLE -->
          <div class="space-y-5">
            <h1 class="text-4xl font-serif font-bold text-[#9b5b3f] leading-tight pb-2 pt-0">
              {{ product.name }}
            </h1>

            <p class="text-2xl text-[#e6007e] font-semibold pb-3">
              {{ formatRupiah(product.price) }}
            </p>
          </div>

          <!-- STOCK -->
          <div class="flex items-center gap-5 pb-4">
            <span
              class="text-xs px-4 py-1 rounded-full font-semibold"
              :class="product.stock < 5
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'"
            >
              {{ product.stock < 5 ? 'Segera Order' : 'Tersedia' }}
            </span>

            <span class="text-sm text-gray-600">
              Stok: {{ product.stock }}
            </span>
          </div>

          <!-- UKURAN -->
          <div v-if="needSize" class="space-y-5">
            <p class="text-sm font-medium text-[#9b5b3f]">
              Pilih Ukuran
            </p>

            <div class="flex flex-wrap gap-3 pb-3">
              <button
                v-for="size in sizeOptions"
                :key="size"
                @click="selectedSize = size"
                class="w-11 h-10 rounded-md border text-sm transition"
                :class="selectedSize === size
                  ? 'bg-[#c98778] text-white border-[#c98778]'
                  : 'bg-white text-[#9b5b3f] border-[#c98778] hover:bg-[#f7e9e5]'"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- KUANTITAS -->
          <div class="space-y-5">
            <p class="text-sm font-medium text-[#9b5b3f]">
              Kuantitas
            </p>

            <div class="flex items-center gap-6">
              <button
                @click="decreaseQty"
                class="w-10 h-10 rounded-md border border-[#c98778]
                text-[#9b5b3f] hover:bg-[#f7e9e5]"
              >
                -
              </button>

              <span class="w-8 text-center text-sm font-semibold">
                {{ quantity }}
              </span>

              <button
                @click="increaseQty"
                class="w-10 h-10 rounded-md border border-[#c98778]
                text-[#9b5b3f] hover:bg-[#f7e9e5]"
                :disabled="quantity >= product.stock"
                :class="quantity >= product.stock
                  ? 'opacity-40 cursor-not-allowed'
                  : ''"
              >
                +
              </button>

              <span class="text-xs text-gray-500">
                Maks. {{ product.stock }}
              </span>
            </div>
          </div>

          <!-- BUTTON -->
          <div
            class="flex gap-4 w-full max-w-xl"
            :class="needSize ? 'pt-4' : 'pt-8'"
          >
            <button
              @click="addToCart"
              class="flex-1 border border-[#c98778]
              text-[#9b5b3f] py-4 rounded-xl
              text-sm font-semibold
              hover:bg-[#f7e9e5] transition"
            >
              🛒 Masukkan Keranjang
            </button>

            <button
              @click="buyNow"
              class="flex-1 bg-[#c98778]
              text-white py-4 rounded-xl
              text-sm font-semibold
              hover:bg-[#b56a4a] transition"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>

          <!-- DESKRIPSI -->
          <div
            class="bg-white rounded-2xl shadow-md p-8 border border-[#f1d8d0] w-full"
          >
            <h2 class="text-3xl font-serif font-bold text-[#9b5b3f] mb-4">
              Deskripsi Produk
            </h2>

            <p class="text-sm leading-7 text-gray-700 whitespace-pre-line">
              {{ product.description }}
            </p>

            <div class="mt-5 text-sm leading-7 text-gray-700">
              <p>✅ Produk Mandora Belle original.</p>
              <p>✅ Barang ready stock selama stok masih tersedia.</p>
              <p>✅ Dikemas dengan aman dan rapi.</p>
              <p v-if="isFootwear">✅ Tersedia ukuran 35 sampai 42.</p>
              <p v-if="isDress">✅ Tersedia ukuran S sampai XXL.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>