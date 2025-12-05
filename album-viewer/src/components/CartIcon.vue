<template>
  <button 
    class="cart-icon"
    @click="toggleCart"
    @keydown.enter="toggleCart"
    @keydown.space.prevent="toggleCart"
    aria-label="Shopping cart"
    :aria-expanded="isOpen"
    aria-haspopup="dialog"
    type="button"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    <span 
      v-if="cartStore.itemCount > 0" 
      class="cart-badge"
      aria-live="polite"
    >
      {{ cartStore.itemCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const cartStore = useCartStore()

const toggleCart = () => {
  emit('toggle')
}
</script>

<style scoped>
.cart-icon {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 50%;
  padding: 0.75rem;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.cart-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.cart-icon:focus {
  outline: 3px solid white;
  outline-offset: 2px;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  min-width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0 4px;
}
</style>
