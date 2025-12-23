<template>
  <button class="cart-button" @click="toggleCart" :class="{ 'has-items': cartItemsCount > 0 }">
    <span class="cart-icon">🛒</span>
    <span v-if="cartItemsCount > 0" class="cart-badge">{{ cartItemsCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { useCart } from '../composables/useCart'

const { cartItemsCount } = useCart()

const emit = defineEmits<{
  toggleCart: []
}>()

const toggleCart = (): void => {
  emit('toggleCart')
}
</script>

<style scoped>
.cart-button {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.cart-button:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cart-button.has-items {
  background: rgba(255, 255, 255, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.cart-icon {
  display: flex;
  align-items: center;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .cart-button {
    padding: 0.6rem 1.2rem;
    font-size: 1.3rem;
  }
  
  .cart-badge {
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
    top: -6px;
    right: -6px;
  }
}
</style>
