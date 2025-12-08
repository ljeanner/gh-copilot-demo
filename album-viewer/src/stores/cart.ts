import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Album } from '../types/album'

const CART_STORAGE_KEY = 'album-viewer-cart'

export const useCartStore = defineStore('cart', () => {
  // Initialize from localStorage
  const loadCart = (): Album[] => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const items = ref<Album[]>(loadCart())

  // Persist to localStorage whenever items change
  watch(
    items,
    (newItems) => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
    },
    { deep: true }
  )

  const itemCount = computed(() => items.value.length)

  const isInCart = (albumId: number): boolean => {
    return items.value.some((item) => item.id === albumId)
  }

  const addToCart = (album: Album): void => {
    if (!isInCart(album.id)) {
      items.value.push(album)
    }
  }

  const removeFromCart = (albumId: number): void => {
    const index = items.value.findIndex((item) => item.id === albumId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  const clearCart = (): void => {
    items.value = []
  }

  return {
    items,
    itemCount,
    isInCart,
    addToCart,
    removeFromCart,
    clearCart
  }
})
