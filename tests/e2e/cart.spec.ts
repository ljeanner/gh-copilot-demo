import { test, expect } from '@playwright/test';

test('add-to-cart + cart screenshot', async ({ page }) => {
  // 1) Open app at http://localhost:3001
  await page.goto('/');
  
  // Verify the page loaded correctly
  await expect(page.locator('h1')).toContainText('Demo App Albums');
  await expect(page.locator('.album-title').first()).toBeVisible();

  // 2) Add first album to cart
  const firstAlbum = page.locator('.add-to-cart').first();
  await expect(firstAlbum).toBeVisible();
  await firstAlbum.click();
  
  // Wait for the "Added!" feedback to appear
  await expect(firstAlbum).toContainText('Added!');
  
  // 3) Open cart
  await page.locator('a[href="/cart"]').click();
  
  // Verify we're on the cart page
  await expect(page.locator('.ui.message')).toContainText('Shopping Cart');
  
  // 4) Assert album present in cart
  await expect(page.locator('.cart-item')).toBeVisible();
  await expect(page.locator('.cart-item .album-title')).toContainText('You, Me and an App Id');
  
  // Check specific meta-info elements by their text content
  await expect(page.locator('.cart-item').getByText('Daprize')).toBeVisible();
  await expect(page.locator('.cart-item').getByText('$10.99')).toBeVisible();
  await expect(page.locator('.cart-item').getByText('Quantity: 1')).toBeVisible();
  
  // Verify total is calculated correctly
  await expect(page.locator('#total-amount')).toContainText('10.99');
  
  // 5) Screenshot cart
  await page.screenshot({ path: 'tests/e2e/screenshots/cart-with-album.png', fullPage: true });
});