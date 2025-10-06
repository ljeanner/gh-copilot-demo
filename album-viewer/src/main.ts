import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useCartStore } from './stores/cart'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Hydrate cart from localStorage after Pinia is initialized
const cartStore = useCartStore()
cartStore.hydrateFromStorage()

app.mount('#app')
