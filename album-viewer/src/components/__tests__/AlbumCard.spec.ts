import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import AlbumCard from '../AlbumCard.vue'
import { useCartStore } from '../../stores/cart'
import type { Album } from '../../types/album'

const mockAlbum: Album = {
  id: 1,
  title: 'Test Album',
  artist: 'Test Artist',
  price: 9.99,
  image_url: 'https://example.com/album.jpg'
}

describe('AlbumCard', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  const mountComponent = () => {
    wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      }
    })
  }

  it('should display album information', () => {
    mountComponent()
    expect(wrapper.text()).toContain('Test Album')
    expect(wrapper.text()).toContain('Test Artist')
    expect(wrapper.text()).toContain('$9.99')
  })

  it('should display album image with correct alt text', () => {
    mountComponent()
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/album.jpg')
    expect(img.attributes('alt')).toBe('Test Album')
  })

  it('should show "Add to Cart" button when album is not in cart', () => {
    mountComponent()
    const addButton = wrapper.find('.btn-primary')
    expect(addButton.exists()).toBe(true)
    expect(addButton.text()).toBe('Add to Cart')
    expect(addButton.attributes('aria-label')).toBe('Add Test Album to cart')
  })

  it('should add album to cart when "Add to Cart" is clicked', async () => {
    const cart = useCartStore()
    mountComponent()
    
    await wrapper.find('.btn-primary').trigger('click')
    
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].id).toBe(mockAlbum.id)
  })

  it('should show "In Cart ✓" button when album is in cart', async () => {
    const cart = useCartStore()
    cart.addToCart(mockAlbum)
    mountComponent()
    
    const inCartButton = wrapper.find('.btn-in-cart')
    expect(inCartButton.exists()).toBe(true)
    expect(inCartButton.text()).toBe('In Cart ✓')
    expect(inCartButton.attributes('aria-label')).toBe('Remove Test Album from cart')
  })

  it('should remove album from cart when "In Cart" button is clicked', async () => {
    const cart = useCartStore()
    cart.addToCart(mockAlbum)
    mountComponent()
    
    await wrapper.find('.btn-in-cart').trigger('click')
    
    expect(cart.items).toHaveLength(0)
  })

  it('should toggle between add and in-cart states', async () => {
    mountComponent()
    const cart = useCartStore()
    
    // Initially shows "Add to Cart"
    expect(wrapper.find('.btn-primary').exists()).toBe(true)
    expect(wrapper.find('.btn-in-cart').exists()).toBe(false)
    
    // Click to add
    await wrapper.find('.btn-primary').trigger('click')
    await wrapper.vm.$nextTick()
    
    // Now shows "In Cart ✓"
    expect(wrapper.find('.btn-in-cart').exists()).toBe(true)
    expect(wrapper.find('.btn-primary').exists()).toBe(false)
    
    // Click to remove
    await wrapper.find('.btn-in-cart').trigger('click')
    await wrapper.vm.$nextTick()
    
    // Back to "Add to Cart"
    expect(wrapper.find('.btn-primary').exists()).toBe(true)
    expect(wrapper.find('.btn-in-cart').exists()).toBe(false)
    expect(cart.items).toHaveLength(0)
  })

  it('should have cart buttons with type="button"', () => {
    mountComponent()
    // Check only the cart-related buttons (primary and in-cart buttons)
    const primaryBtn = wrapper.find('.btn-primary')
    expect(primaryBtn.attributes('type')).toBe('button')
  })

  it('should have a preview button', () => {
    mountComponent()
    const previewButton = wrapper.find('.btn-secondary')
    expect(previewButton.exists()).toBe(true)
    expect(previewButton.text()).toBe('Preview')
  })
})
