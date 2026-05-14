<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const message = ref("Memproses pembayaran...")

onMounted(async () => {
  const externalId = route.query.external_id

  if (!externalId) {
    message.value = "Pembayaran berhasil, tetapi kode order tidak ditemukan."
    loading.value = false
    return
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/payment/paid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        external_id: externalId,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Gagal update status pesanan")
    }

    message.value = "Pembayaran berhasil! Pesanan kamu sudah masuk."
  } catch (error) {
    console.error(error)
    message.value = "Pembayaran berhasil, tetapi status pesanan gagal diperbarui."
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="min-h-screen bg-[#f7e9e5] flex items-center justify-center px-6 py-16">
    <div class="w-full max-w-md bg-white rounded-[32px] shadow-lg border border-[#f1d8d0] px-9 py-12 text-center">
      <div class="w-24 h-24 rounded-full bg-[#ffe1cf] flex items-center justify-center mx-auto mb-6">
        <i class="bi bi-check-circle-fill text-5xl text-[#9b5b3f]"></i>
      </div>

      <h1 class="font-serif text-4xl font-bold text-[#9b5b3f] mb-4">
        Thank You!
      </h1>

      <p class="text-gray-600 leading-6">
        {{ message }}
      </p>

      <button
        @click="router.push('/pesanan')"
        class="w-full mt-8 bg-[#c98778] text-white py-4 rounded-2xl font-semibold hover:bg-[#b87667] transition"
      >
        Lihat Pesanan
      </button>
    </div>
  </section>
</template>