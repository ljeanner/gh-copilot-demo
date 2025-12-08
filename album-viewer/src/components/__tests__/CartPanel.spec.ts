import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import CartPanel from '../CartPanel.vue'
import { useCartStore } from '../../stores/cart'
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

describe('CartPanel', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  const mountComponent = (isOpen = true) => {
    wrapper = mount(CartPanel, {
      props: {
        isOpen
      }
    })
  }

  it('should not render when isOpen is false', () => {
    mountComponent(false)
    expect(wrapper.find('.cart-panel-overlay').exists()).toBe(false)
  })

  it('should render when isOpen is true', () => {
    mountComponent(true)
    expect(wrapper.find('.cart-panel-overlay').exists()).toBe(true)
  })

  it('should have proper aria attributes for accessibility', () => {
    mountComponent()
    const aside = wrapper.find('aside')
    expect(aside.attributes('role')).toBe('dialog')
    expect(aside.attributes('aria-modal')).toBe('true')
    expect(aside.attributes('aria-label')).toBe('Shopping cart contents')
  })

  it('should display "Your Cart" header', () => {
    mountComponent()
    expect(wrapper.find('h2').text()).toBe('Your Cart')
  })

  it('should show empty cart message when cart is empty', () => {
    mountComponent()
    expect(wrapper.find('.empty-cart').exists()).toBe(true)
    expect(wrapper.text()).toContain('Your cart is empty')
  })

  it('should display cart items when cart has items', () => {
    const cart = useCartStore()
    cart.addToCart(mockAlbum)
    mountComponent()
    expect(wrapper.find('.cart-item').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Album')
    expect(wrapper.text()).toContain('Test Artist')
    expect(wrapper.text()).toContain('$9.99')
  })

  it('should display correct total price', () => {
    const cart = useCartStore()
    cart.addToCart(mockAlbum)
    cart.addToCart(mockAlbum2)
    mountComponent()
    const totalPrice = 9.99 + 14.99
    expect(wrapper.text()).toContain(`$${totalPrice.toFixed(2)}`)
  })

  it('should emit close event when close button clicked', async () => {
    mountComponent()
    await wrapper.find('.close-btn').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should emit close event when overlay is clicked', async () => {
    mountComponent()
    await wrapper.find('.cart-panel-overlay').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should not emit close when panel content is clicked', async () => {
    mountComponent()
    await wrapper.find('.cart-panel').trigger('click')
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('should emit close event on Escape keypress', async () => {
    mountComponent()
    await wrapper.find('.cart-panel-overlay').trigger('keydown.escape')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should remove item when remove button is clicked', async () => {
    const cart = useCartStore()
    cart.addToCart(mockAlbum)
    mountComponent()
    
    const removeBtn = wrapper.find('.remove-btn')
    expect(removeBtn.attributes('aria-label')).toBe('Remove Test Album from cart')
    
    await removeBtn.trigger('click')
    expect(cart.items).toHaveLength(0)
  })

  it('should not show footer when cart is empty', () => {
    mountComponent()
    expect(wrapper.find('.cart-footer').exists()).toBe(false)
  })

  it('should show footer with total when cart has items', () => {
    const cart = useCartStore()
    cart.addToCart(mockAlbum)
    mountComponent()
    expect(wrapper.find('.cart-footer').exists()).toBe(true)
    expect(wrapper.find('.cart-total').exists()).toBe(true)
  })

  it('should have close button with proper aria-label', () => {
    mountComponent()
    const closeBtn = wrapper.find('.close-btn')
    expect(closeBtn.attributes('aria-label')).toBe('Close cart')
  })

  it('should render list role for cart content', () => {
    mountComponent()
    expect(wrapper.find('.cart-content').attributes('role')).toBe('list')
  })

  it('should render listitem role for cart items', () => {
    const cart = useCartStore()
    cart.addToCart(mockAlbum)
    mountComponent()
    expect(wrapper.find('.cart-item').attributes('role')).toBe('listitem')
  })
})
