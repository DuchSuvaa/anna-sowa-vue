import { createApp } from 'vue'
import './scss/style.scss'
import App from './App.vue'
import { createPinia } from 'pinia'
import { auth } from './firebase/config.js'
import { onAuthStateChanged } from 'firebase/auth'
import router from './router'
import { createI18n, useI18n } from 'vue-i18n'
import en from './locales/en.json'
import pl from './locales/pl.json'

const pinia = createPinia()
let app: object

const i18n = createI18n({
  legacy: false,
  messages: { en, pl },
  locale: 'en',
  fallbackLocale: 'en',
  localeDir: 'locales',
  globalInjection: true
})

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
      .use(pinia)
      .use(router)
      .use(i18n)
      .mount('#app')
  }
})