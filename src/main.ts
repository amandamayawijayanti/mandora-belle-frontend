// import CSS library Tailwind CSS
import './assets/main.css'

// Vue
import { createApp } from 'vue'

// 🔥 Tambahin ini
import { createPinia } from 'pinia'

// Router 🔥
import router from './router'

// App
import App from './App.vue'

const app = createApp(App)

import 'bootstrap-icons/font/bootstrap-icons.css'

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

app.use(Toast)

// 🔥 WAJIB BANGET INI
app.use(createPinia())

app.use(router)

app.mount('#app')