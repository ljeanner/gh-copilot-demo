<template>
  <div 
    v-if="isOpen" 
    class="cart-panel-overlay"
    @click.self="closePanel"
    @keydown.escape="closePanel"
    role="presentation"
  >
    <aside 
      class="cart-panel"
      role="dialog"
      aria-label="Shopping cart contents"
      aria-modal="true"
      ref="panelRef"
    >
      <header class="cart-header">
        <h2 id="cart-title">Your Cart</h2>
        <button 
          class="close-btn"
          @click="closePanel"
          aria-label="Close cart"
          type="button"
          ref="closeButtonRef"
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <div class="cart-content" role="list" aria-labelledby="cart-title">
        <div v-if="cartStore.items.length === 0" class="empty-cart">
          <p>Your cart is empty</p>
          <p class="empty-cart-hint">Browse albums and add them to your cart!</p>
        </div>

        <div 
          v-else 
          v-for="album in cartStore.items" 
          :key="album.id" 
          class="cart-item"
          role="listitem"
        >
          <img 
            :src="album.image_url" 
            :alt="album.title"
            class="cart-item-image"
            @error="handleImageError"
          />
          <div class="cart-item-info">
            <h3 class="cart-item-title">{{ album.title }}</h3>
            <p class="cart-item-artist">{{ album.artist }}</p>
            <p class="cart-item-price">${{ album.price.toFixed(2) }}</p>
          </div>
          <button 
            class="remove-btn"
            @click="removeItem(album.id)"
            :aria-label="`Remove ${album.title} from cart`"
            type="button"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <footer v-if="cartStore.items.length > 0" class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span class="total-price">${{ totalPrice.toFixed(2) }}</span>
        </div>
      </footer>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useCartStore } from '../stores/cart'
import { PLACEHOLDER_ALBUM_THUMBNAIL } from '../constants/images'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const cartStore = useCartStore()
const panelRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)

const totalPrice = computed(() => {
  return cartStore.items.reduce((sum, album) => sum + album.price, 0)
})

const closePanel = () => {
  emit('close')
}

const removeItem = (albumId: number) => {
  cartStore.removeFromCart(albumId)
}

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = PLACEHOLDER_ALBUM_THUMBNAIL
}

// Focus management for accessibility
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      closeButtonRef.value?.focus()
    })
  }
})
</script>

<style scoped>
.cart-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cart-panel {
  width: 100%;
  max-width: 400px;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.close-btn:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  text-align: center;
}

.empty-cart p {
  margin: 0.5rem 0;
}

.empty-cart-hint {
  font-size: 0.9rem;
  opacity: 0.7;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-title {
  margin: 0;
  font-size: 1rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-artist {
  margin: 0.25rem 0;
  font-size: 0.85rem;
  color: #666;
}

.cart-item-price {
  margin: 0;
  font-weight: bold;
  color: #667eea;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #ff6b6b;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #ffe5e5;
}

.remove-btn:focus {
  outline: 2px solid #ff6b6b;
  outline-offset: 2px;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background: #f9f9f9;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
}

.total-price {
  font-weight: bold;
  color: #667eea;
  font-size: 1.5rem;
}

@media (max-width: 480px) {
  .cart-panel {
    max-width: 100%;
  }
}
</style>
