<template>
  <Teleport to="body">
    <div v-if="isOpen" class="cart-overlay" @click="closeCart">
      <div 
        class="cart-panel" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="cart-title"
        @click.stop
      >
        <div class="cart-header">
          <h2 id="cart-title">Shopping Cart</h2>
          <button 
            class="close-btn" 
            @click="closeCart"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div v-if="cartItems.length === 0" class="cart-empty">
          <p>Your cart is empty</p>
          <p class="cart-empty-hint">Add some albums to get started!</p>
        </div>

        <div v-else class="cart-content">
          <div 
            v-for="album in cartItems" 
            :key="album.id" 
            class="cart-item"
          >
            <img 
              :src="album.image_url" 
              :alt="album.title"
              class="cart-item-image"
            />
            <div class="cart-item-info">
              <h3 class="cart-item-title">{{ album.title }}</h3>
              <p class="cart-item-artist">{{ album.artist }}</p>
              <p class="cart-item-price">${{ album.price.toFixed(2) }}</p>
            </div>
            <button 
              class="remove-btn"
              @click="removeFromCart(album.id)"
              aria-label="Remove from cart"
            >
              Remove
            </button>
          </div>
        </div>

        <div v-if="cartItems.length > 0" class="cart-footer">
          <div class="cart-total">
            <span>Total Items:</span>
            <span class="total-count">{{ cartItems.length }}</span>
          </div>
          <button class="clear-btn" @click="clearCart">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.list)

const closeCart = (): void => {
  emit('close')
}

const removeFromCart = (id: number): void => {
  cartStore.remove(id)
}

const clearCart = (): void => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clear()
  }
}

// Handle Escape key to close cart
const handleEscape = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && props.isOpen) {
    closeCart()
  }
}

// Watch for open state and manage body scroll
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.cart-panel {
  background: white;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.cart-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

.cart-empty {
  padding: 3rem 1.5rem;
  text-align: center;
  color: #666;
}

.cart-empty p {
  margin: 0.5rem 0;
}

.cart-empty-hint {
  font-size: 0.9rem;
  color: #999;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 1rem;
  align-items: center;
  transition: background 0.2s;
}

.cart-item:hover {
  background: #f0f0f0;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item-artist {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item-price {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #667eea;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #e84118;
  transform: translateY(-1px);
}

.cart-footer {
  padding: 1.5rem;
  border-top: 2px solid #f0f0f0;
  background: #f9f9f9;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.total-count {
  color: #667eea;
  font-size: 1.3rem;
}

.clear-btn {
  width: 100%;
  background: transparent;
  color: #ff4757;
  border: 2px solid #ff4757;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #ff4757;
  color: white;
}

@media (max-width: 768px) {
  .cart-panel {
    max-width: 100%;
    max-height: 90vh;
  }
  
  .cart-item {
    flex-wrap: wrap;
  }
  
  .remove-btn {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
