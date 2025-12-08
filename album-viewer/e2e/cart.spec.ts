import { test, expect, Page } from '@playwright/test'

// Mock album data to intercept API requests
const mockAlbums = [
  {
    id: 1,
    title: 'Abbey Road',
    artist: 'The Beatles',
    price: 24.99,
    image_url: 'https://via.placeholder.com/300x300/667eea/white?text=Abbey+Road'
  },
  {
    id: 2,
    title: 'Dark Side of the Moon',
    artist: 'Pink Floyd',
    price: 19.99,
    image_url: 'https://via.placeholder.com/300x300/764ba2/white?text=Dark+Side'
  },
  {
    id: 3,
    title: 'Thriller',
    artist: 'Michael Jackson',
    price: 22.99,
    image_url: 'https://via.placeholder.com/300x300/667eea/white?text=Thriller'
  }
]

test.beforeEach(async ({ page }) => {
  // Clear localStorage before each test
  await page.addInitScript(() => {
    window.localStorage.clear()
  })

  // Mock the albums API endpoint
  await page.route('**/albums', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAlbums)
    })
  })
})

test.describe('Cart Management Feature', () => {
  test('should display cart icon in header', async ({ page }) => {
    await page.goto('/')
    
    const cartIcon = page.locator('button[aria-label="Shopping cart"]')
    await expect(cartIcon).toBeVisible()
  })

  test('should not show badge when cart is empty', async ({ page }) => {
    await page.goto('/')
    
    const badge = page.locator('.cart-badge')
    await expect(badge).not.toBeVisible()
  })

  test('should add album to cart and show badge', async ({ page }) => {
    await page.goto('/')
    
    // Wait for albums to load
    await page.waitForSelector('.album-card')
    
    // Click "Add to Cart" on first album
    const addButton = page.locator('.album-card').first().locator('button:has-text("Add to Cart")')
    await addButton.click()
    
    // Verify badge shows 1
    const badge = page.locator('.cart-badge')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('1')
    
    // Verify button changes to "In Cart ✓"
    const inCartButton = page.locator('.album-card').first().locator('button:has-text("In Cart")')
    await expect(inCartButton).toBeVisible()
  })

  test('should open cart panel when cart icon is clicked', async ({ page }) => {
    await page.goto('/')
    
    // Click cart icon
    await page.click('button[aria-label="Shopping cart"]')
    
    // Verify cart panel opens
    const cartPanel = page.locator('aside[role="dialog"]')
    await expect(cartPanel).toBeVisible()
    await expect(page.locator('h2')).toHaveText('Your Cart')
  })

  test('should show empty cart message when cart is empty', async ({ page }) => {
    await page.goto('/')
    
    // Open cart panel
    await page.click('button[aria-label="Shopping cart"]')
    
    // Verify empty cart message
    await expect(page.locator('.empty-cart')).toBeVisible()
    await expect(page.locator('text=Your cart is empty')).toBeVisible()
  })

  test('should display cart items in cart panel', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.album-card')
    
    // Add first album to cart
    await page.locator('.album-card').first().locator('button:has-text("Add to Cart")').click()
    
    // Open cart panel
    await page.click('button[aria-label="Shopping cart"]')
    
    // Verify album is displayed in cart
    const cartItem = page.locator('.cart-item')
    await expect(cartItem).toBeVisible()
    await expect(page.locator('.cart-item-title')).toHaveText('Abbey Road')
    await expect(page.locator('.cart-item-artist')).toHaveText('The Beatles')
    await expect(page.locator('.cart-item-price')).toHaveText('$24.99')
  })

  test('should remove item from cart via cart panel', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.album-card')
    
    // Add first album to cart
    await page.locator('.album-card').first().locator('button:has-text("Add to Cart")').click()
    
    // Open cart panel
    await page.click('button[aria-label="Shopping cart"]')
    
    // Remove item
    await page.click('button[aria-label="Remove Abbey Road from cart"]')
    
    // Verify cart is empty
    await expect(page.locator('.empty-cart')).toBeVisible()
    
    // Close panel and verify badge is gone
    await page.click('button[aria-label="Close cart"]')
    await expect(page.locator('.cart-badge')).not.toBeVisible()
  })

  test('should close cart panel when close button is clicked', async ({ page }) => {
    await page.goto('/')
    
    // Open cart panel
    await page.click('button[aria-label="Shopping cart"]')
    await expect(page.locator('aside[role="dialog"]')).toBeVisible()
    
    // Close cart panel
    await page.click('button[aria-label="Close cart"]')
    await expect(page.locator('aside[role="dialog"]')).not.toBeVisible()
  })

  test('should close cart panel when overlay is clicked', async ({ page }) => {
    await page.goto('/')
    
    // Open cart panel
    await page.click('button[aria-label="Shopping cart"]')
    await expect(page.locator('aside[role="dialog"]')).toBeVisible()
    
    // Click overlay (outside panel)
    await page.locator('.cart-panel-overlay').click({ position: { x: 10, y: 100 } })
    await expect(page.locator('aside[role="dialog"]')).not.toBeVisible()
  })

  test('should close cart panel with Escape key', async ({ page }) => {
    await page.goto('/')
    
    // Open cart panel
    await page.click('button[aria-label="Shopping cart"]')
    await expect(page.locator('aside[role="dialog"]')).toBeVisible()
    
    // Press Escape
    await page.keyboard.press('Escape')
    await expect(page.locator('aside[role="dialog"]')).not.toBeVisible()
  })

  test('should add multiple albums to cart', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.album-card')
    
    // Add multiple albums
    const albumCards = page.locator('.album-card')
    await albumCards.nth(0).locator('button:has-text("Add to Cart")').click()
    await albumCards.nth(1).locator('button:has-text("Add to Cart")').click()
    
    // Verify badge shows 2
    await expect(page.locator('.cart-badge')).toHaveText('2')
    
    // Open cart panel and verify both items
    await page.click('button[aria-label="Shopping cart"]')
    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(2)
  })

  test('should display correct total price', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.album-card')
    
    // Add first album ($24.99)
    await page.locator('.album-card').first().locator('button:has-text("Add to Cart")').click()
    
    // Open cart panel
    await page.click('button[aria-label="Shopping cart"]')
    
    // Verify total
    await expect(page.locator('.total-price')).toHaveText('$24.99')
    
    // Close panel
    await page.click('button[aria-label="Close cart"]')
    
    // Add second album ($19.99)
    await page.locator('.album-card').nth(1).locator('button:has-text("Add to Cart")').click()
    
    // Open cart panel again
    await page.click('button[aria-label="Shopping cart"]')
    
    // Verify updated total ($24.99 + $19.99 = $44.98)
    await expect(page.locator('.total-price')).toHaveText('$44.98')
  })

  test('should toggle add/remove from album card', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.album-card')
    
    const firstCard = page.locator('.album-card').first()
    
    // Add to cart
    await firstCard.locator('button:has-text("Add to Cart")').click()
    await expect(firstCard.locator('button:has-text("In Cart")')).toBeVisible()
    
    // Remove from cart by clicking "In Cart" button
    await firstCard.locator('button:has-text("In Cart")').click()
    await expect(firstCard.locator('button:has-text("Add to Cart")')).toBeVisible()
    await expect(page.locator('.cart-badge')).not.toBeVisible()
  })

  test('should persist cart across page reload', async ({ page, context }) => {
    // For this specific test, we need to NOT clear localStorage on reload
    // We'll navigate first, then add to cart, then reload manually
    
    // Clear the init script effect by creating fresh navigation without it
    await page.goto('/')
    await page.waitForSelector('.album-card')
    
    // Add album to cart
    await page.locator('.album-card').first().locator('button:has-text("Add to Cart")').click()
    await expect(page.locator('.cart-badge')).toHaveText('1')
    
    // Verify localStorage was set
    const cartData = await page.evaluate(() => localStorage.getItem('album-viewer-cart'))
    expect(cartData).toBeTruthy()
    
    // Create a new page in the same context (shares localStorage)
    const newPage = await context.newPage()
    
    // Setup the API mock for the new page
    await newPage.route('**/albums', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAlbums)
      })
    })
    
    await newPage.goto('/')
    await newPage.waitForSelector('.album-card')
    
    // Verify cart state persisted
    await expect(newPage.locator('.cart-badge')).toHaveText('1')
    await expect(newPage.locator('.album-card').first().locator('button:has-text("In Cart")')).toBeVisible()
    
    // Open cart panel and verify item
    await newPage.click('button[aria-label="Shopping cart"]')
    await expect(newPage.locator('.cart-item')).toBeVisible()
    await expect(newPage.locator('.cart-item-title')).toHaveText('Abbey Road')
    
    await newPage.close()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.album-card')
    
    // Verify cart icon accessibility
    const cartIcon = page.locator('button[aria-label="Shopping cart"]')
    await expect(cartIcon).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(cartIcon).toHaveAttribute('aria-expanded', 'false')
    
    // Open cart panel
    await cartIcon.click()
    
    // Verify panel accessibility
    const panel = page.locator('aside[role="dialog"]')
    await expect(panel).toHaveAttribute('aria-modal', 'true')
    await expect(panel).toHaveAttribute('aria-label', 'Shopping cart contents')
    
    // Verify cart icon updates aria-expanded
    await expect(cartIcon).toHaveAttribute('aria-expanded', 'true')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.album-card')
    
    // Click on cart icon to open, then test keyboard closing
    const cartIcon = page.locator('button[aria-label="Shopping cart"]')
    await cartIcon.click()
    await expect(page.locator('aside[role="dialog"]')).toBeVisible()
    
    // Close button should be focused after cart opens
    const closeButton = page.locator('button[aria-label="Close cart"]')
    await expect(closeButton).toBeFocused()
    
    // Press Enter to close
    await page.keyboard.press('Enter')
    await expect(page.locator('aside[role="dialog"]')).not.toBeVisible()
    
    // Press Space on cart icon to open again
    await cartIcon.focus()
    await page.keyboard.press('Space')
    await expect(page.locator('aside[role="dialog"]')).toBeVisible()
    
    // Press Escape to close
    await page.keyboard.press('Escape')
    await expect(page.locator('aside[role="dialog"]')).not.toBeVisible()
  })
})
