<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

const errorMessage = ref('')
const loading = ref(false)

const login = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan password wajib diisi.'
    return
  }

  try {
    loading.value = true

    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Login gagal.')
    }

    const userData = result.user

    if (!userData) {
      throw new Error('Data user tidak ditemukan.')
    }

    localStorage.setItem(
      'user',
      JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      })
    )

    console.log('USER LOGIN:', localStorage.getItem('user'))

    router.replace('/profile')

  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.message || 'Login gagal.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="min-h-screen bg-[#f7e9e5] flex items-center justify-center px-6 py-16">

    <div
      class="w-full max-w-md bg-white rounded-[32px]
      shadow-lg border border-[#f1d8d0]
      px-9 py-12"
    >

      <!-- HEADER -->
      <div class="text-center mb-10">
        <h1 class="font-serif text-5xl font-bold text-[#9b5b3f] leading-tight">
          Welcome Back
        </h1>

        <p class="text-[#c98778] mt-4 text-base">
          Masuk ke akun Mandora Belle kamu
        </p>
      </div>

      <!-- ERROR -->
      <div
        v-if="errorMessage"
        class="mb-5 bg-red-100 text-red-700
        border border-red-200
        rounded-2xl px-4 py-3 text-sm"
      >
        {{ errorMessage }}
      </div>

      <!-- FORM -->
      <form @submit.prevent="login" class="space-y-7">

        <!-- EMAIL -->
        <div class="space-y-3">
          <label class="text-[#9b5b3f] text-sm font-medium">
            Email
          </label>

          <input
            v-model="email"
            type="email"
            placeholder="Masukkan email"
            class="w-full px-5 py-4 rounded-2xl
            border border-[#e7c7bd]
            focus:outline-none focus:ring-2
            focus:ring-[#c98778]"
          />
        </div>

        <!-- PASSWORD -->
        <div class="space-y-3 pt-3 pb-4">
          <label class="text-[#9b5b3f] text-sm font-medium">
            Password
          </label>

          <input
            v-model="password"
            type="password"
            placeholder="Masukkan password"
            class="w-full px-5 py-4 rounded-2xl
            border border-[#e7c7bd]
            focus:outline-none focus:ring-2
            focus:ring-[#c98778]"
          />
        </div>

        <!-- BUTTON -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-5 bg-[#c98778]
          text-white py-4 rounded-2xl
          font-semibold text-lg
          hover:bg-[#b87667] transition
          disabled:opacity-60"
        >
          {{ loading ? 'Memproses...' : 'Login' }}
        </button>

      </form>

      <!-- FOOTER -->
      <p class="text-center text-sm text-gray-600 mt-10 pt-3">
        Belum punya akun?

        <RouterLink
          to="/register"
          class="text-[#c98778] font-semibold hover:underline"
        >
          Daftar
        </RouterLink>
      </p>

    </div>

  </section>
</template>