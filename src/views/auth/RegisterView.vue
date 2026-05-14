<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

const register = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Semua field wajib diisi.'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password minimal 6 karakter.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi password harus sama dengan password.'
    return
  }

  try {
    loading.value = true

    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const firstError = result.errors
        ? Object.values(result.errors)[0]?.[0]
        : result.message

      throw new Error(firstError || 'Register gagal.')
    }

   const userData = result.user || result.data || null

if (!userData) {
  throw new Error('Data user tidak dikirim dari backend.')
}

localStorage.setItem('user', JSON.stringify({
  id: userData.id,
  name: userData.name,
  email: userData.email,
}))

successMessage.value = 'Register berhasil!'

router.replace('/profile')
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.message || 'Register gagal.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="min-h-screen bg-[#f7e9e5] flex items-center justify-center px-6 py-16">
    <div class="w-full max-w-md bg-white rounded-[32px] shadow-lg border border-[#f1d8d0] px-9 py-12">

      <div class="text-center mb-10">
        <h1 class="font-serif text-5xl font-bold text-[#9b5b3f] leading-tight">
          Create Account
        </h1>

        <p class="text-[#c98778] mt-4 text-base">
          Daftar akun baru Mandora Belle
        </p>
      </div>

      <div
        v-if="errorMessage"
        class="mb-5 bg-red-100 text-red-700 border border-red-200 rounded-2xl px-4 py-3 text-sm"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="successMessage"
        class="mb-5 bg-pink-100 text-[#9b5b3f] border border-pink-200 rounded-2xl px-4 py-3 text-sm"
      >
        {{ successMessage }}
      </div>

      <form @submit.prevent="register" class="space-y-6">

        <div class="space-y-3">
          <label class="text-[#9b5b3f] text-sm font-medium">
            Nama
          </label>

          <input
            v-model="name"
            type="text"
            placeholder="Masukkan nama"
            class="w-full px-5 py-4 rounded-2xl border border-[#e7c7bd]
            focus:outline-none focus:ring-2 focus:ring-[#c98778]"
          />
        </div>

        <div class="space-y-3 pb-3 pt-3">
          <label class="text-[#9b5b3f] text-sm font-medium">
            Email
          </label>

          <input
            v-model="email"
            type="email"
            placeholder="Masukkan email"
            class="w-full px-5 py-4 rounded-2xl border border-[#e7c7bd]
            focus:outline-none focus:ring-2 focus:ring-[#c98778]"
          />
        </div>

        <div class="space-y-3 pb-3">
          <label class="text-[#9b5b3f] text-sm font-medium">
            Password
          </label>

          <input
            v-model="password"
            type="password"
            placeholder="Minimal 6 karakter"
            class="w-full px-5 py-4 rounded-2xl border border-[#e7c7bd]
            focus:outline-none focus:ring-2 focus:ring-[#c98778]"
          />
        </div>

        <div class="space-y-3 pb-4">
          <label class="text-[#9b5b3f] text-sm font-medium">
            Konfirmasi Password
          </label>

          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Ulangi password"
            class="w-full px-5 py-4 rounded-2xl border border-[#e7c7bd]
            focus:outline-none focus:ring-2 focus:ring-[#c98778]"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-5 bg-[#c98778] text-white py-4 rounded-2xl
          font-semibold text-lg hover:bg-[#b87667] transition
          disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Memproses...' : 'Register' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 pt-3">
        Sudah punya akun?

        <RouterLink
          to="/login"
          class="text-[#c98778] font-semibold hover:underline"
        >
          Login
        </RouterLink>
      </p>

    </div>
  </section>
</template>