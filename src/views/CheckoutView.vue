<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const products = ref<any[]>([])
const loading = ref(true)
const showAddressForm = ref(true)

const address = ref({
  nama: "",
  telepon: "",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kodePos: "",
  detail: "",
})

const lokasi = {
  "DI Yogyakarta": {
    Sleman: {
      Gamping: "55294",
      Depok: "55281",
      Mlati: "55284",
      Ngaglik: "55581",
      Kalasan: "55571",
    },
    Bantul: {
      Bantul: "55711",
      Sewon: "55185",
      Kasihan: "55184",
      Banguntapan: "55198",
    },
    "Kota Yogyakarta": {
      Gondokusuman: "55224",
      Danurejan: "55213",
      Kotagede: "55171",
      Umbulharjo: "55161",
    },
  },
  "Jawa Tengah": {
    Semarang: {
      Tembalang: "50275",
      Banyumanik: "50263",
      Pedurungan: "50192",
    },
    Surakarta: {
      Laweyan: "57148",
      Jebres: "57126",
      Banjarsari: "57131",
    },
  },
  "Jawa Barat": {
    Bandung: {
      Coblong: "40132",
      Sukajadi: "40162",
      Cidadap: "40143",
    },
    Bogor: {
      Dramaga: "16680",
      Cibinong: "16911",
      Tajurhalang: "16320",
    },
  },
}

const shippingOptions = [
  { name: "Ekonomi", price: 19000, estimate: "5 - 8 hari" },
  { name: "Reguler", price: 29000, estimate: "3 - 5 hari" },
  { name: "Express", price: 45000, estimate: "1 - 2 hari" },
]

const selectedShipping = ref(shippingOptions[0])
const paymentMethod = ref("Qris")

const provinsiList = computed(() => Object.keys(lokasi))

const kotaList = computed(() => {
  if (!address.value.provinsi) return []
  return Object.keys(lokasi[address.value.provinsi as keyof typeof lokasi])
})

const kecamatanList = computed(() => {
  if (!address.value.provinsi || !address.value.kota) return []
  const provinsi = lokasi[address.value.provinsi as keyof typeof lokasi]
  return Object.keys(provinsi[address.value.kota as keyof typeof provinsi])
})

watch(() => address.value.provinsi, () => {
  address.value.kota = ""
  address.value.kecamatan = ""
  address.value.kodePos = ""
})

watch(() => address.value.kota, () => {
  address.value.kecamatan = ""
  address.value.kodePos = ""
})

watch(() => address.value.kecamatan, () => {
  if (!address.value.provinsi || !address.value.kota || !address.value.kecamatan) {
    address.value.kodePos = ""
    return
  }

  const provinsi = lokasi[address.value.provinsi as keyof typeof lokasi]
  const kota = provinsi[address.value.kota as keyof typeof provinsi]
  address.value.kodePos = kota[address.value.kecamatan as keyof typeof kota]
})

const hasAddress = computed(() => {
  return (
    address.value.nama &&
    address.value.telepon &&
    address.value.provinsi &&
    address.value.kota &&
    address.value.kecamatan &&
    address.value.kodePos &&
    address.value.detail
  )
})

const subtotal = computed(() => {
  return products.value.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 1)
  }, 0)
})

const total = computed(() => subtotal.value + selectedShipping.value.price)

const formatRupiah = (value: number) => {
  return "Rp" + Number(value || 0).toLocaleString("id-ID")
}

const saveAddress = () => {
  if (!hasAddress.value) {
    alert("Alamat masih belum lengkap yaa")
    return
  }

  showAddressForm.value = false
}

const editAddress = () => {
  showAddressForm.value = true
}

const cancelAddress = () => {
  router.back()
}

const createOrder = async () => {
  if (!hasAddress.value) {
    alert("Isi alamat dulu yaa")
    return
  }

  if (products.value.length === 0) {
    alert("Produk checkout masih kosong")
    return
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  if (!user.id) {
    alert("Login dulu yaa")
    router.push("/login")
    return
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({
        user_id: user.id,
        name: user.name,
        email: user.email,

        amount: total.value,

        products: products.value,

        address: {
          ...address.value,
        },

        shipping: {
          name: selectedShipping.value.name,
          price: selectedShipping.value.price,
          estimate: selectedShipping.value.estimate,
        },

        payment: paymentMethod.value,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || result.error || "Gagal membuat pembayaran")
    }

    localStorage.removeItem("checkoutItems")

    // redirect ke halaman pembayaran xendit
    window.location.href = result.invoice_url

  } catch (error: any) {
    console.error(error)
    alert(error.message || "Gagal membuat pembayaran Xendit")
  }
}

onMounted(() => {
  const items = JSON.parse(localStorage.getItem("checkoutItems") || "[]")

  products.value = items.map((item: any) => {
    const product = item.product ?? item

    let image =
      product.image ??
      product.image_url ??
      product.gambar ??
      item.image

    if (image && !image.startsWith("http")) {
      image = image.startsWith("/storage")
        ? `http://127.0.0.1:8000${image}`
        : `http://127.0.0.1:8000/storage/${image}`
    }

    return {
      cart_id: item.cart_id ?? item.id,
      id: item.product_id ?? product.id,
      name: product.nama ?? product.name,
      description: product.deskripsi_produk ?? product.description,
      price: Number(item.price ?? product.harga_produk ?? product.price ?? 0),
      image,
      quantity: Number(item.quantity || 1),
      size: item.size ?? product.size ?? null,
    }
  })

  loading.value = false
})
</script>

<template>
  <section class="min-h-screen bg-[#f7e9e5] px-4 py-14">
    <h1 class="text-center text-3xl font-serif font-bold text-[#a85f3d] pb-5">
      Checkout
    </h1>

    <div v-if="loading" class="text-center text-[#9b5b3f]">
      Memuat produk...
    </div>

    <div v-else class="w-full flex justify-center">
      <div class="w-full max-w-3xl flex flex-col gap-10">
        <!-- ALAMAT -->
        <div class="bg-white rounded-2xl shadow-md p-6 border border-[#f1d8d0]">
          <template v-if="showAddressForm">
            <h2 class="text-xl font-bold text-[#9b5b3f]">Tambahkan Alamat</h2>

            <p class="text-sm text-gray-600 mb-5">
              Untuk membuat pesanan, silakan tambahkan alamat pengiriman
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
              <input v-model="address.nama" type="text" placeholder="Nama Lengkap" class="border px-3 py-2 rounded-lg" />
              <input v-model="address.telepon" type="text" placeholder="Nomor Telepon" class="border px-3 py-2 rounded-lg" />

              <select v-model="address.provinsi" class="border px-3 py-2 rounded-lg">
                <option value="">Pilih Provinsi</option>
                <option v-for="provinsi in provinsiList" :key="provinsi" :value="provinsi">
                  {{ provinsi }}
                </option>
              </select>

              <select v-model="address.kota" class="border px-3 py-2 rounded-lg" :disabled="!address.provinsi">
                <option value="">Pilih Kota / Kabupaten</option>
                <option v-for="kota in kotaList" :key="kota" :value="kota">
                  {{ kota }}
                </option>
              </select>

              <select v-model="address.kecamatan" class="border px-3 py-2 rounded-lg" :disabled="!address.kota">
                <option value="">Pilih Kecamatan</option>
                <option v-for="kecamatan in kecamatanList" :key="kecamatan" :value="kecamatan">
                  {{ kecamatan }}
                </option>
              </select>

              <input v-model="address.kodePos" type="text" placeholder="Kode Pos" readonly class="border px-3 py-2 rounded-lg bg-gray-100" />

              <input
                v-model="address.detail"
                type="text"
                placeholder="Detail lainnya (Cth: Blok / Unit No., Patokan)"
                class="border px-3 py-2 rounded-lg md:col-span-2"
              />
            </div>

            <div class="flex justify-end gap-5 pt-8">
              <button @click="cancelAddress" class="px-5 py-2 border border-[#b56a4a] text-[#b56a4a] rounded-lg">
                Nanti Saja
              </button>

              <button @click="saveAddress" class="px-6 py-2 bg-[#b56a4a] text-white rounded-lg">
                OK
              </button>
            </div>
          </template>

          <template v-else>
            <div class="flex justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold text-[#9b5b3f] mb-2">
                  📍 Alamat Pengiriman
                </h2>

                <p class="font-semibold">
                  {{ address.nama }} ({{ address.telepon }})
                </p>

                <p class="text-sm text-gray-700">
                  {{ address.detail }}, KAB. {{ address.kota.toUpperCase() }} -
                  {{ address.kecamatan.toUpperCase() }},
                  {{ address.provinsi.toUpperCase() }},
                  ID {{ address.kodePos }}
                </p>
              </div>

              <button @click="editAddress" class="h-fit px-5 py-2 border rounded text-sm hover:bg-gray-100">
                Ubah
              </button>
            </div>
          </template>
        </div>

        <!-- PRODUK -->
        <div class="bg-white rounded-2xl shadow-md p-6 border border-[#f1d8d0]">
          <h2 class="text-xl font-bold text-[#9b5b3f] mb-5">
            Produk Dipesan
          </h2>

          <div
            v-for="item in products"
            :key="item.id"
            class="flex gap-5 items-center mb-5 border-b last:border-b-0 pb-5 last:pb-0 pt-6"
          >
            <img :src="item.image" class="w-24 h-24 object-cover rounded-lg" />

            <div class="flex-1">
              <h3 class="text-lg font-semibold">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ item.description }}</p>
            </div>

            <div class="font-semibold">
              {{ item.quantity }} x {{ formatRupiah(item.price) }}
            </div>
          </div>

          <div class="mt-6">
            <label class="text-sm font-semibold text-gray-600 mb-2 block pt-3 h-10">
              Pilih Pengiriman
            </label>

            <select
              v-model="selectedShipping"
              class="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c98778]"
            >
              <option v-for="option in shippingOptions" :key="option.name" :value="option">
                {{ option.name }} - {{ formatRupiah(option.price) }}
                | Estimasi tiba {{ option.estimate }}
              </option>
            </select>
          </div>
        </div>

        <!-- RINGKASAN -->
        <div class="bg-white rounded-2xl shadow-md p-6 border border-[#f1d8d0]">
          <h2 class="text-xl font-bold text-[#9b5b3f] pb-3">
            Ringkasan Pesanan
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p class="font-semibold mb-4">Cek ringkasan transaksimu, yuk</p>

              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-500">Total Harga</span>
                  <span>{{ formatRupiah(subtotal) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">Total Ongkos Kirim</span>
                  <span>{{ formatRupiah(selectedShipping.price) }}</span>
                </div>

                <div class="flex justify-between font-bold pt-3 border-t text-lg">
                  <span>Total Tagihan</span>
                  <span>{{ formatRupiah(total) }}</span>
                </div>
              </div>
            </div>

            <div class="bg-[#fff5f2] border border-[#f1d8d0] rounded-2xl p-4">
              <h3 class="font-bold text-lg text-[#9b5b3f] mb-2">
                Pembayaran
              </h3>

              <p class="text-sm text-gray-600 leading-6">
                Setelah klik tombol <b>Buat Pesanan</b>, kamu akan diarahkan ke halaman pembayaran Xendit.
                Di sana kamu bisa memilih metode pembayaran seperti QRIS, e-wallet, atau bank.
              </p>
            </div>
          </div>

          <div class="pt-8">
            <button
              type="button"
              @click="createOrder"
              class="w-full
              bg-[#b56a4a]
              text-white
              py-4
              rounded-2xl
              hover:bg-[#9f5b40]
              transition"
            >
              Buat Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>