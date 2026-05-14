<script setup lang="ts">
const testimonials = [
  {
    name: "Sari Dewi",
    city: "Jakarta",
    image: "/image/testi1.jpg",
    review:
      "Mandora Belle benar-benar menghadirkan fashion yang dreamy dan elegan. Setiap piece yang saya beli selalu membuat saya merasa puas!",
  },
  {
    name: "Maya Putri",
    city: "Yogyakarta",
    image: "/image/testi2.jpg",
    review:
      "Kualitas material sangat soft dan nyaman dipakai. Warna-warna pastelnya juga cantik banget, cocok untuk daily outfit yang tetap stylish!",
  },
  {
    name: "Kheyla Azizah",
    city: "Surabaya",
    image: "/image/testi3.jpg",
    review:
      "Pelayanan cepat dan sangat ramah. Produknya datang sesuai ekspektasi, bahkan terlihat lebih cantik saat langsung dipakai!",
  },
]
</script>

<template>
  <section class="bg-[#f7e9e5] px-6 py-20">

    <!-- CENTER -->
    <div class="w-full flex justify-center">
      <div class="w-full max-w-6xl">

        <!-- TITLE -->
        <div class="text-center h-20 mb-12">

          <p class="text-[#c98778] text-sm tracking-wide mb-1 uppercase">
            What Our Souls Say
          </p>

          <h2
            class="text-[#9b5b3f]
            font-serif
            text-3xl sm:text-4xl
            font-semibold"
          >
            Love Stories
          </h2>

        </div>

        <!-- GRID -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <!-- CARD -->
          <div
            v-for="(item, index) in testimonials"
            :key="index"
            class="bg-white rounded-3xl p-7
            shadow-[0_6px_18px_rgba(0,0,0,0.08)]
            border border-[#f1d8d0]"
          >

            <!-- PROFILE -->
            <div class="flex items-center gap-4 mb-5">

              <img
                :src="item.image"
                :alt="item.name"
                class="w-14 h-14 rounded-full object-cover"
              />

              <div>
                <h3 class="text-[#9b5b3f] font-semibold text-lg">
                  {{ item.name }}
                </h3>

                <p class="text-[#c98778] text-sm">
                  {{ item.city }}
                </p>
              </div>
            </div>

            <!-- REVIEW -->
            <p class="text-[#b98270] leading-7 text-sm">
              “{{ item.review }}”
            </p>

            <!-- STARS -->
            <div class="flex gap-1 mt-6 text-yellow-400 text-lg">
              ★ ★ ★ ★ ★
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>