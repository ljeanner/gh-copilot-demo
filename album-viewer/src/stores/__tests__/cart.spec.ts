import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'
import type { Album } from '../../types/album'

const mockAlbum: Album = {
  id: 1,
  title: 'Test Album',
  artist: 'Test Artist',
  price: 9.99,
  image_url: 'https://example.com/album.jpg'
}

const mockAlbum2: Album = {
  id: 2,
  title: 'Another Album',
  artist: 'Another Artist',
  price: 14.99,
  image_url: 'https://example.com/album2.jpg'
}

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should start with an empty cart', () => {
      const cart = useCartStore()
      expect(cart.items).toEqual([])
      expect(cart.itemCount).toBe(0)
    })

    it('should load cart from localStorage on initialization', () => {
      localStorage.setItem('album-viewer-cart', JSON.stringify([mockAlbum]))
      setActivePinia(createPinia())
      const cart = useCartStore()
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].title).toBe('Test Album')
    })

    it('should handle invalid localStorage data gracefully', () => {
      localStorage.setItem('album-viewer-cart', 'invalid json')
      setActivePinia(createPinia())
      const cart = useCartStore()
      expect(cart.items).toEqual([])
    })
  })

  describe('addToCart', () => {
    it('should add an album to the cart', () => {
      const cart = useCartStore()
      cart.addToCart(mockAlbum)
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0]).toEqual(mockAlbum)
      expect(cart.itemCount).toBe(1)
    })

    it('should not add duplicate albums', () => {
      const cart = useCartStore()
      cart.addToCart(mockAlbum)
      cart.addToCart(mockAlbum)
      expect(cart.items).toHaveLength(1)
      expect(cart.itemCount).toBe(1)
    })

    it('should add multiple different albums', () => {
      const cart = useCartStore()
      cart.addToCart(mockAlbum)
      cart.addToCart(mockAlbum2)
      expect(cart.items).toHaveLength(2)
      expect(cart.itemCount).toBe(2)
    })
  })

  describe('removeFromCart', () => {
    it('should remove an album from the cart', () => {
      const cart = useCartStore()
      cart.addToCart(mockAlbum)
      cart.removeFromCart(mockAlbum.id)
      expect(cart.items).toHaveLength(0)
      expect(cart.itemCount).toBe(0)
    })

    it('should do nothing when removing a non-existent album', () => {
      const cart = useCartStore()
      cart.addToCart(mockAlbum)
      cart.removeFromCart(999)
      expect(cart.items).toHaveLength(1)
    })

    it('should only remove the specified album', () => {
      const cart = useCartStore()
      cart.addToCart(mockAlbum)
      cart.addToCart(mockAlbum2)
      cart.removeFromCart(mockAlbum.id)
      expect(cart.items).toHaveLength(1)
      expect(cart.items[0].id).toBe(mockAlbum2.id)
    })
  })

  describe('isInCart', () => {
    it('should return true for albums in cart', () => {
      const cart = useCartStore()
      cart.addToCart(mockAlbum)
      expect(cart.isInCart(mockAlbum.id)).toBe(true)
    })

    it('should return false for albums not in cart', () => {
      const cart = useCartStore()
      expect(cart.isInCart(mockAlbum.id)).toBe(false)
    })
  })

  describe('clearCart', () => {
    it('should remove all items from the cart', () => {
      const cart = useCartStore()
      cart.addToCart(mockAlbum)
      cart.addToCart(mockAlbum2)
      cart.clearCart()
      expect(cart.items).toHaveLength(0)
      expect(cart.itemCount).toBe(0)
    })
  })

  describe('localStorage persistence', () => {
    it('should persist cart to localStorage when items change', async () => {
      const cart = useCartStore()
      cart.addToCart(mockAlbum)
      
      // Wait for Vue's watch to trigger
      await new Promise(resolve => setTimeout(resolve, 0))
      
      const stored = localStorage.getItem('album-viewer-cart')
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].id).toBe(mockAlbum.id)
    })
  })
})
