<template>
  <div class="cart-overlay" @click.self="closeCart">
    <div class="cart-panel">
      <div class="cart-header">
        <h2>🛒 Panier</h2>
        <button class="close-btn" @click="closeCart">✕</button>
      </div>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>Votre panier est vide</p>
        <button @click="closeCart" class="btn-continue">Continuer vos achats</button>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.album.id" class="cart-item">
            <img :src="item.album.image_url" :alt="item.album.title" class="item-image" />
            <div class="item-info">
              <h4>{{ item.album.title }}</h4>
              <p>{{ item.album.artist }}</p>
              <p class="item-price">${{ item.album.price.toFixed(2) }}</p>
            </div>
            <div class="item-actions">
              <div class="quantity-controls">
                <button @click="updateQuantity(item.album.id, item.quantity - 1)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="updateQuantity(item.album.id, item.quantity + 1)">+</button>
              </div>
              <button @click="removeFromCart(item.album.id)" class="remove-btn">🗑️</button>
            </div>
          </div>
        </div>

        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span class="total-amount">${{ cartTotal.toFixed(2) }}</span>
          </div>
          <button @click="clearCart" class="btn-clear">Vider le panier</button>
          <button class="btn-checkout">Passer la commande</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '../composables/useCart'

const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()

const emit = defineEmits<{
  close: []
}>()

const closeCart = (): void => {
  emit('close')
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cart-panel {
  background: white;
  width: 100%;
  max-width: 500px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  transform: rotate(90deg);
}

.cart-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #333;
}

.item-info p {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
}

.item-price {
  font-weight: bold;
  color: #667eea;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border-radius: 20px;
  padding: 0.25rem 0.5rem;
}

.quantity-controls button {
  background: #667eea;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quantity-controls button:hover {
  background: #5a6fd8;
  transform: scale(1.1);
}

.quantity-controls span {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
}

.remove-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.remove-btn:hover {
  transform: scale(1.2);
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  flex: 1;
}

.empty-cart p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.btn-continue {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-continue:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.cart-footer {
  padding: 1.5rem;
  border-top: 2px solid #f0f0f0;
  background: #fafafa;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.total-amount {
  color: #667eea;
}

.btn-clear {
  width: 100%;
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.btn-checkout {
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-checkout:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .cart-panel {
    max-width: 100%;
  }
  
  .cart-header h2 {
    font-size: 1.3rem;
  }
  
  .cart-item {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
  }
  
  .item-actions {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
}
</style>
