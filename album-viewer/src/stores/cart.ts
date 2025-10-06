import { defineStore } from 'pinia'
import type { Album } from '@/types/album'

interface CartState {
  items: Record<string, Album>
}

const STORAGE_KEY = 'albumViewer.cart.v1'

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: {}
  }),

  getters: {
    count: (state): number => Object.keys(state.items).length,
    list: (state): Album[] => Object.values(state.items),
    hasItem: (state) => (id: number): boolean => {
      return !!state.items[id.toString()]
    }
  },

  actions: {
    add(album: Album): void {
      if (!album?.id || this.items[album.id.toString()]) return
      this.items[album.id.toString()] = album
      this.persist()
    },

    remove(id: number): void {
      const key = id.toString()
      if (!this.items[key]) return
      delete this.items[key]
      this.persist()
    },

    clear(): void {
      this.items = {}
      this.persist()
    },

    hydrateFromStorage(): void {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed === 'object') {
            this.items = parsed
          }
        }
      } catch (e) {
        console.warn('Cart hydration failed', e)
      }
    },

    persist(): void {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      } catch (e) {
        console.warn('Cart persist failed', e)
      }
    }
  }
})
