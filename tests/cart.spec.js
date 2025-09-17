// Basic cart functionality tests
// This file demonstrates the cart functionality that was implemented

const { test, expect } = require('@playwright/test');

test.describe('Shopping Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page before each test
    await page.goto('http://localhost:3001');
  });

  test('should display cart icon in header', async ({ page }) => {
    // Verify cart icon is present in the header
    const cartIcon = page.locator('#cart-icon');
    await expect(cartIcon).toBeVisible();
  });

  test('should add album to cart', async ({ page }) => {
    // Click the first "Add to Cart" button
    await page.locator('.add-to-cart').first().click();
    
    // Verify cart counter appears and shows 1
    const cartCount = page.locator('#cart-count');
    await expect(cartCount).toBeVisible();
    await expect(cartCount).toHaveText('1');
    
    // Verify notification appears
    const notification = page.locator('.ui.success.message');
    await expect(notification).toBeVisible();
  });

  test('should navigate to cart page and display items', async ({ page }) => {
    // Add an album to cart first
    await page.locator('.add-to-cart').first().click();
    
    // Click on cart icon to navigate to cart page
    await page.locator('#cart-icon').click();
    
    // Verify we're on the cart page
    await expect(page).toHaveURL('http://localhost:3001/cart');
    
    // Verify cart contains the added item
    const cartItems = page.locator('#cart-items');
    await expect(cartItems).toBeVisible();
    
    // Verify total is displayed
    const cartTotal = page.locator('#cart-total');
    await expect(cartTotal).toBeVisible();
    await expect(cartTotal).toContainText('Total: $');
  });

  test('should remove item from cart', async ({ page }) => {
    // Add an album to cart first
    await page.locator('.add-to-cart').first().click();
    
    // Navigate to cart page
    await page.locator('#cart-icon').click();
    
    // Click remove button
    await page.locator('.remove-from-cart').first().click();
    
    // Verify cart is empty
    const emptyMessage = page.locator('text=Your cart is empty');
    await expect(emptyMessage).toBeVisible();
    
    // Verify total is $0.00
    const cartTotal = page.locator('#cart-total');
    await expect(cartTotal).toContainText('Total: $0.00');
  });

  test('should clear entire cart', async ({ page }) => {
    // Add multiple albums to cart
    await page.locator('.add-to-cart').first().click();
    await page.locator('.add-to-cart').nth(1).click();
    
    // Navigate to cart page
    await page.locator('#cart-icon').click();
    
    // Click clear cart button
    await page.locator('#clear-cart').click();
    
    // Verify cart is empty
    const emptyMessage = page.locator('text=Your cart is empty');
    await expect(emptyMessage).toBeVisible();
  });

  test('should persist cart data across page reloads', async ({ page }) => {
    // Add an album to cart
    await page.locator('.add-to-cart').first().click();
    
    // Reload the page
    await page.reload();
    
    // Verify cart counter is still visible
    const cartCount = page.locator('#cart-count');
    await expect(cartCount).toBeVisible();
    await expect(cartCount).toHaveText('1');
  });
});