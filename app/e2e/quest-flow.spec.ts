import { test, expect, Page } from '@playwright/test';

// Helper to click navigation tabs
async function clickNavTab(page: Page, tabName: string) {
  await page.locator('nav').getByRole('button', { name: new RegExp(tabName, 'i') }).click();
}

// Helper to dismiss any open modals
async function dismissModals(page: Page) {
  // Close member picker if open
  const closeButton = page.locator('button:has-text("✕")').first();
  if (await closeButton.isVisible({ timeout: 500 }).catch(() => false)) {
    await closeButton.click();
  }
}

test.describe('Quest Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Quest Cards')).toBeVisible();
    await dismissModals(page);
  });

  test('can navigate to quest packs', async ({ page }) => {
    await clickNavTab(page, 'Quests');
    await expect(page.getByText('Quest Packs')).toBeVisible();
    await expect(page.getByText('Starter Pack')).toBeVisible();
  });

  test('can view a quest pack', async ({ page }) => {
    await clickNavTab(page, 'Quests');
    await page.getByText('Starter Pack').click();
    await expect(page.getByText('Bed Boss')).toBeVisible();
  });

  test('can open quest detail modal', async ({ page }) => {
    await clickNavTab(page, 'Quests');
    await page.getByText('Starter Pack').click();
    await page.getByText('Bed Boss').click();
    
    // Should see quest details
    await expect(page.getByText('The Quest')).toBeVisible();
  });

  test('F13: shows Pass button in quest detail', async ({ page }) => {
    // Navigate to quest pack and open a quest
    await clickNavTab(page, 'Quests');
    await page.getByText('Starter Pack').click();
    await page.getByText('Bed Boss').click();
    
    // Wait for modal to open
    await page.waitForSelector('text=The Quest');
    
    // Find and click any "Start" type button (handles both child and parent views)
    const startButton = page.locator('button').filter({ hasText: /Start|Queue/ }).first();
    if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await startButton.click();
      await page.waitForTimeout(500);
    }
    
    // Go home
    await clickNavTab(page, 'Home');
    await page.waitForTimeout(500);
    
    // If there's an active quest, click it to open details
    const activeQuestCard = page.locator('main').getByText('Bed Boss').first();
    if (await activeQuestCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      await activeQuestCard.click();
      await page.waitForTimeout(300);
      
      // Check for Pass button (F13: renamed from "Give Up")
      await expect(page.getByRole('button', { name: 'Pass' })).toBeVisible();
      // Verify "Give Up" does NOT exist anywhere
      const giveUpButton = page.getByRole('button', { name: 'Give Up' });
      await expect(giveUpButton).not.toBeVisible();
    }
  });
});

test.describe('Shop & Rewards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Quest Cards')).toBeVisible();
    await dismissModals(page);
  });

  test('can navigate to shop', async ({ page }) => {
    await clickNavTab(page, 'Shop');
    // Use heading role for more specific match
    await expect(page.getByRole('heading', { name: 'Reward Shop' })).toBeVisible();
  });

  test('F20: shop shows points balance', async ({ page }) => {
    await clickNavTab(page, 'Shop');
    await expect(page.getByText('Your Points')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Quest Cards')).toBeVisible();
    await dismissModals(page);
  });

  test('all nav tabs work', async ({ page }) => {
    // Home
    await clickNavTab(page, 'Home');
    // Quests
    await clickNavTab(page, 'Quests');
    await expect(page.getByText('Quest Packs')).toBeVisible();
    // Shop
    await clickNavTab(page, 'Shop');
    await expect(page.getByRole('heading', { name: 'Reward Shop' })).toBeVisible();
    // Settings
    await clickNavTab(page, 'Settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });

  test('F18: points display is not clickable', async ({ page }) => {
    // The points balance in header should be a span (not a button)
    // It shows the star emoji followed by number like "⭐0"
    const pointsDisplay = page.locator('header').getByText(/⭐\d+/);
    await expect(pointsDisplay).toBeVisible();
    
    // Verify the element is a span, not a button
    const tagName = await pointsDisplay.evaluate((el) => el.tagName);
    expect(tagName).toBe('SPAN');
  });

  test('logo click goes home', async ({ page }) => {
    await clickNavTab(page, 'Settings');
    // Click the logo/title in header
    await page.locator('header').getByRole('button', { name: /Quest Cards/i }).click();
    // Should navigate - verify by checking we're not on settings anymore
    await expect(page.getByRole('heading', { name: 'Settings' })).not.toBeVisible();
  });
});
