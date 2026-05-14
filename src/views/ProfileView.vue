<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref<any>(null)

onMounted(() => {
  const savedUser = localStorage.getItem('user')

  if (!savedUser) {
    router.push('/login')
    return
  }

  user.value = JSON.parse(savedUser)
})

const logout = () => {
  localStorage.removeItem('user')

  router.push('/login')
}
</script>

<template>
  <section class="min-h-screen bg-[#f7e9e5] flex items-center justify-center px-6 py-16">

    <div
      v-if="user"
      class="w-full max-w-md bg-white rounded-[32px]
      shadow-lg border border-[#f1d8d0]
      px-9 py-12"
    >

      <!-- PROFILE ICON -->
      <div class="flex justify-center mb-6">
        <div
          class="w-24 h-24 rounded-full
          bg-[#ffe1cf]
          flex items-center justify-center"
        >
          <i class="bi bi-person-fill text-5xl text-[#9b5b3f]"></i>
        </div>
      </div>

      <!-- INFO -->
      <div class="text-center">
        <h1 class="font-serif text-4xl font-bold text-[#9b5b3f]">
          {{ user.name }}
        </h1>

        <p class="text-[#c98778] mt-3">
          {{ user.email }}
        </p>
      </div>

      <!-- BUTTON -->
      <button
        @click="logout"
        class="w-full mt-10 bg-[#c98778]
        text-white py-4 rounded-2xl
        font-semibold hover:bg-[#b87667]
        transition"
      >
        Logout
      </button>

    </div>

  </section>
</template>