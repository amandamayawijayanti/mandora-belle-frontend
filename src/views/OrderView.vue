<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const orders = ref<any[]>([])
const loading = ref(true)

const formatRupiah = (value: number) => {
  return "Rp " + Number(value || 0).toLocaleString("id-ID")
}

const formatTanggal = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

const formatJam = (date: string) => {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getStatusClass = (status: string) => {
  if (status === "pending") return "bg-yellow-100 text-yellow-700"
  if (status === "paid") return "bg-green-100 text-green-700"
  if (status === "processed") return "bg-blue-100 text-blue-700"
  if (status === "shipped") return "bg-purple-100 text-purple-700"
  if (status === "completed") return "bg-teal-100 text-teal-700"
  if (status === "cancelled") return "bg-red-100 text-red-700"
  if (status === "expired") return "bg-gray-200 text-gray-600"
  if (status === "failed") return "bg-rose-100 text-rose-700"

  return "bg-gray-100 text-gray-600"
}

const formatStatus = (status: string) => {
  if (status === "pending") return "Pending"
  if (status === "paid") return "Paid"
  if (status === "processed") return "Processed"
  if (status === "shipped") return "Shipped"
  if (status === "completed") return "Completed"
  if (status === "cancelled") return "Cancelled"
  if (status === "expired") return "Expired"
  if (status === "failed") return "Failed"

  return status
}

const fetchOrders = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  if (!user.name) {
    router.push("/login")
    return
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/orders?name=${encodeURIComponent(user.name)}`
    )

    const result = await response.json()
    orders.value = result.data ?? result
  } catch (error) {
    console.error(error)
    alert("Gagal memuat pesanan")
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <section class="min-h-screen bg-[#f7e9e5] px-6 py-16">

    <h1 class="text-center text-4xl font-serif font-bold text-[#a85f3d] mb-10">
      Pesanan Saya
    </h1>

    <div v-if="loading" class="text-center text-[#9b5b3f]">
      Memuat pesanan...
    </div>

    <div v-else class="w-full flex justify-center">

      <div class="w-full max-w-5xl space-y-8">

        <div
          v-if="orders.length === 0"
          class="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500"
        >
          Belum ada pesanan.
        </div>

        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-3xl shadow-md border border-[#f1d8d0] p-7"
        >

          <!-- HEADER -->
          <div class="flex justify-between gap-4 border-b pb-5 mb-5">

            <div>
              <h2 class="font-serif text-xl font-bold text-[#9b5b3f]">
                Order #{{ order.external_id || order.id }}
              </h2>

              <p class="text-sm text-gray-500 mt-1">
                {{ formatTanggal(order.created_at) }} • {{ formatJam(order.created_at) }}
              </p>
            </div>

            <!-- STATUS -->
            <span
              class="h-fit px-4 py-1 rounded-full text-sm font-semibold"
              :class="getStatusClass(order.status)"
            >
              {{ formatStatus(order.status) }}
            </span>

          </div>

          <!-- PRODUCTS -->
          <div v-if="order.products && order.products.length" class="space-y-5">

            <div
              v-for="item in order.products"
              :key="item.id"
              class="flex items-center gap-5"
            >

              <img
                :src="item.image"
                :alt="item.name"
                class="w-24 h-24 rounded-2xl object-cover border border-[#f1d8d0]"
              />

              <div class="flex-1">

                <h3 class="text-lg font-semibold text-gray-900">
                  {{ item.name }}
                </h3>

                <p class="text-sm text-gray-500 line-clamp-2">
                  {{ item.description }}
                </p>

                <p v-if="item.size" class="text-sm text-[#9b5b3f] mt-1">
                  Ukuran: {{ item.size }}
                </p>

                <p class="text-sm text-gray-600 mt-1">
                  Jumlah: {{ item.quantity }}
                </p>

              </div>

              <div class="text-right">
                <p class="font-semibold text-[#a85f3d]">
                  {{ formatRupiah(item.price) }}
                </p>
              </div>

            </div>

          </div>

          <div v-else class="text-sm text-gray-500">
            Detail produk belum tersimpan untuk pesanan ini.
          </div>

          <!-- DETAIL -->
          <div class="mt-6 bg-[#fff5f2] rounded-2xl p-5 text-sm space-y-2">

            <p>
              <span class="font-semibold">Nama Pembeli:</span>
              {{ order.nama_pembeli }}
            </p>

            <p v-if="order.address">
              <span class="font-semibold">Alamat:</span>
              {{ order.address.detail }},
              {{ order.address.kecamatan }},
              {{ order.address.kota }},
              {{ order.address.provinsi }},
              {{ order.address.kodePos }}
            </p>

            <p v-if="order.shipping">
              <span class="font-semibold">Pengiriman:</span>
              {{ order.shipping.name }} -
              {{ formatRupiah(order.shipping.price) }}
              ({{ order.shipping.estimate }})
            </p>

            <p>
              <span class="font-semibold">Pembayaran:</span>
              Xendit
            </p>

            <p v-if="order.invoice_url">
              <span class="font-semibold">Invoice:</span>

              <a
                :href="order.invoice_url"
                target="_blank"
                class="text-[#c98778] font-semibold hover:underline"
              >
                Buka Invoice
              </a>
            </p>

          </div>

          <!-- TOTAL -->
          <div class="mt-6 text-right">

            <p class="text-sm text-gray-500">
              Total Tagihan
            </p>

            <p class="text-2xl font-bold text-[#a85f3d]">
              {{ formatRupiah(order.total) }}
            </p>

          </div>

        </div>

      </div>

    </div>

  </section>
</template>