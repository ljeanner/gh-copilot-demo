import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import CartIcon from '../CartIcon.vue'
import { useCartStore } from '../../stores/cart'
import type { Album } from '../../types/album'

const mockAlbum: Album = {
  id: 1,
  title: 'Test Album',
  artist: 'Test Artist',
  price: 9.99,
  image_url: 'https://example.com/album.jpg'
}

describe('CartIcon', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  const mountComponent = (isOpen = false) => {
    wrapper = mount(CartIcon, {
      props: {
        isOpen
      }
    })
  }

  it('should render cart button', () => {
    mountComponent()
    expect(wrapper.find('button.cart-icon').exists()).toBe(true)
  })

  it('should have proper aria attributes', () => {
    mountComponent()
    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Shopping cart')
    expect(button.attributes('aria-haspopup')).toBe('dialog')
    expect(button.attributes('type')).toBe('button')
  })

  it('should show aria-expanded based on isOpen prop', async () => {
    mountComponent(false)
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
    
    await wrapper.setProps({ isOpen: true })
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
  })

  it('should not display badge when cart is empty', () => {
    mountComponent()
    expect(wrapper.find('.cart-badge').exists()).toBe(false)
  })

  it('should display badge with count when cart has items', async () => {
    const cart = useCartStore()
    cart.addToCart(mockAlbum)
    mountComponent()
    expect(wrapper.find('.cart-badge').exists()).toBe(true)
    expect(wrapper.find('.cart-badge').text()).toBe('1')
  })

  it('should emit toggle event when clicked', async () => {
    mountComponent()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('should emit toggle on Enter keypress', async () => {
    mountComponent()
    await wrapper.find('button').trigger('keydown.enter')
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })

  it('should emit toggle on Space keypress', async () => {
    mountComponent()
    await wrapper.find('button').trigger('keydown.space')
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })

  it('should contain an svg icon', () => {
    mountComponent()
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })
})
