import { createApp } from 'vue'
import './scss/style.scss'
import App from './App.vue'
import { createPinia } from 'pinia'
import { auth } from './firebase/config.js'
import { onAuthStateChanged } from 'firebase/auth'
import router from './router'

const pinia = createPinia()
let app: object

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
      .use(pinia)
      .use(router)
      .mount('#app')
  }
})