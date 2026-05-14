<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const carts = ref<any[]>([])
const selectedItems = ref<number[]>([])
const loading = ref(true)

const formatRupiah = (value: number) => {
  return "Rp" + Number(value || 0).toLocaleString("id-ID")
}

const getProduct = (cart: any) => {
  return cart.product
}

const getProductName = (cart: any) => {
  return getProduct(cart)?.nama ?? getProduct(cart)?.name ?? "-"
}

const getProductDescription = (cart: any) => {
  return getProduct(cart)?.deskripsi_produk ?? getProduct(cart)?.description ?? "-"
}

const getProductImage = (cart: any) => {
  const image =
    getProduct(cart)?.gambar ??
    getProduct(cart)?.image_url ??
    getProduct(cart)?.image

  if (!image) return ""

  if (image.startsWith("http")) return image
  if (image.startsWith("/storage")) return `http://127.0.0.1:8000${image}`

  return `http://127.0.0.1:8000/storage/${image}`
}

const getProductPrice = (cart: any) => {
  return Number(cart.price ?? getProduct(cart)?.harga_produk ?? getProduct(cart)?.price ?? 0)
}

const selectedCarts = computed(() => {
  return carts.value.filter((cart) => selectedItems.value.includes(cart.id))
})

const totalPrice = computed(() => {
  return selectedCarts.value.reduce((total, cart) => {
    return total + getProductPrice(cart) * Number(cart.quantity || 1)
  }, 0)
})

const allSelected = computed(() => {
  return carts.value.length > 0 &&
    selectedItems.value.length === carts.value.length
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = carts.value.map((cart) => cart.id)
  }
}

const fetchCarts = async () => {
  loading.value = true

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (!user.id) {
    alert("Login dulu yaa")
    router.push("/login")
    return
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/cart?user_id=${user.id}`)
    const result = await response.json()

    carts.value = result.data ?? result
  } catch (error) {
    console.error(error)
    alert("Gagal memuat cart")
  } finally {
    loading.value = false
  }
}

const deleteCart = async (id: number) => {
  await fetch(`http://127.0.0.1:8000/api/cart/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  })

  carts.value = carts.value.filter((cart) => cart.id !== id)
  selectedItems.value = selectedItems.value.filter((itemId) => itemId !== id)
}

const increaseQty = (cart: any) => {
  cart.quantity++
}

const decreaseQty = (cart: any) => {
  if (cart.quantity > 1) {
    cart.quantity--
  }
}

const checkoutSelected = () => {
  if (selectedCarts.value.length === 0) {
    alert("Pilih produk dulu yaa")
    return
  }

  // simpan semua cart yang dipilih
  localStorage.setItem(
    "checkoutItems",
    JSON.stringify(selectedCarts.value)
  )

  router.push("/checkout")
}

onMounted(() => {
  fetchCarts()
})
</script>

<template>
  <section class="min-h-screen bg-[#f7e9e5] px-4 py-14">

    <!-- TITLE -->
    <h1 class="text-center text-4xl font-serif font-bold text-[#a85f3d] h-15">
      Keranjang Belanja
    </h1>

    <div v-if="loading" class="text-center text-[#9b5b3f]">
      Memuat keranjang...
    </div>

    <!-- CENTER CONTAINER -->
    <div v-else class="w-full flex justify-center">
      <div class="w-full max-w-5xl">

        <!-- EMPTY -->
        <div
          v-if="carts.length === 0"
          class="bg-white rounded-3xl shadow-md p-10 text-center text-gray-500"
        >
          Keranjang masih kosong.
        </div>

        <!-- CONTENT -->
        <div v-else class="space-y-6">

          <!-- SELECT ALL -->
          <div
            class="bg-white rounded-3xl shadow-md border border-[#f1d8d0]
            px-7 py-5 flex items-center justify-between"
          >

            <label
              class="flex items-center gap-3
              text-[#9b5b3f] font-medium cursor-pointer"
            >

              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="w-5 h-5 accent-[#b56a4a]"
              />

              Pilih Semua Produk

            </label>

            <p class="text-sm text-gray-500">
              {{ selectedItems.length }} dari {{ carts.length }} dipilih
            </p>

          </div>

          <!-- CART ITEM -->
          <div
            v-for="cart in carts"
            :key="cart.id"
            class="bg-white rounded-3xl shadow-md border border-[#f1d8d0]
            px-7 py-6 flex items-center gap-6"
          >

            <!-- CHECKBOX -->
            <input
              type="checkbox"
              :value="cart.id"
              v-model="selectedItems"
              class="w-5 h-5 accent-[#b56a4a]"
            />

            <!-- IMAGE -->
            <img
              :src="getProductImage(cart)"
              :alt="getProductName(cart)"
              class="w-32 h-32 object-cover rounded-2xl border border-[#f1d8d0]"
            />

            <!-- INFO -->
            <div class="flex-1">

              <h2 class="text-2xl font-semibold text-gray-900">
                {{ getProductName(cart) }}
              </h2>

              <p class="text-sm text-gray-500 mt-2">
                {{ getProductDescription(cart) }}
              </p>

              <p
                v-if="cart.size"
                class="text-sm text-[#9b5b3f] mt-2"
              >
                Ukuran: {{ cart.size }}
              </p>

            </div>

            <!-- PRICE -->
            <div class="text-right">

              <p class="font-semibold text-xl text-[#a85f3d] mb-5">
                {{ formatRupiah(getProductPrice(cart)) }}
              </p>

              <div
                class="flex items-center justify-end gap-3 text-[#b56a4a]"
              >

                <!-- DELETE -->
                <button
                  @click="deleteCart(cart.id)"
                  class="hover:text-red-600 transition"
                >
                  <i class="bi bi-trash text-lg"></i>
                </button>

                <!-- MINUS -->
                <button
                  @click="decreaseQty(cart)"
                  class="w-8 h-8 border rounded-lg hover:bg-[#f7e9e5]"
                >
                  -
                </button>

                <!-- QTY -->
                <span class="text-base font-medium min-w-[20px] text-center">
                  {{ cart.quantity }}
                </span>

                <!-- PLUS -->
                <button
                  @click="increaseQty(cart)"
                  class="w-8 h-8 border rounded-lg hover:bg-[#f7e9e5]"
                >
                  +
                </button>

              </div>
            </div>
          </div>

          <!-- SUMMARY -->
          <div
            style="margin-top: 45px;"
            class="bg-white rounded-3xl shadow-md border border-[#f1d8d0]
            p-8 flex flex-col items-center"
          >

            <h2 class="font-bold text-2xl text-[#9b5b3f] mb-5">
              Ringkasan Belanja
            </h2>

            <p class="text-lg mb-6">
              Total ({{ selectedCarts.length }} produk):
              <span class="font-bold text-[#a85f3d]">
                {{ formatRupiah(totalPrice) }}
              </span>
            </p>

            <button
              @click="checkoutSelected"
              class="bg-[#c98778]
              text-white px-10 py-4 rounded-2xl
              font-semibold text-lg
              hover:bg-[#b56a4a] transition"
            >
              Beli Sekarang
            </button>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>