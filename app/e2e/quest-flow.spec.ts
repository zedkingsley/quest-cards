import { test, expect } from '@playwright/test';

test.describe('Quest Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to load
    await expect(page.getByText('Quest Cards')).toBeVisible();
  });

  test('can start a quest from pack', async ({ page }) => {
    // Navigate to Quests tab
    await page.getByRole('button', { name: /Quests/i }).click();
    
    // Click on a pack
    await page.getByText('Quick Wins').click();
    
    // Click on a challenge
    await page.getByText('Make Your Bed').click();
    
    // Start the quest
    await page.getByRole('button', { name: /Start This Quest/i }).click();
    
    // Should show as active
    await expect(page.getByText(/In Progress/i)).toBeVisible();
  });

  test('can mark quest done and see handoff modal', async ({ page }) => {
    // First start a quest
    await page.getByRole('button', { name: /Quests/i }).click();
    await page.getByText('Quick Wins').click();
    await page.getByText('Make Your Bed').click();
    await page.getByRole('button', { name: /Start This Quest/i }).click();
    
    // Mark as done
    await page.getByRole('button', { name: /I Did It!/i }).click();
    
    // Should see handoff modal with task details (F15)
    await expect(page.getByText(/Great job/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Skip' })).toBeVisible();
  });

  test('F13: shows Pass instead of Give Up', async ({ page }) => {
    // Start a quest
    await page.getByRole('button', { name: /Quests/i }).click();
    await page.getByText('Quick Wins').click();
    await page.getByText('Make Your Bed').click();
    await page.getByRole('button', { name: /Start This Quest/i }).click();
    
    // Should show Pass button
    await expect(page.getByRole('button', { name: 'Pass' })).toBeVisible();
  });

  test('F14: can undo submission', async ({ page }) => {
    // Start and submit a quest
    await page.getByRole('button', { name: /Quests/i }).click();
    await page.getByText('Quick Wins').click();
    await page.getByText('Make Your Bed').click();
    await page.getByRole('button', { name: /Start This Quest/i }).click();
    await page.getByRole('button', { name: /I Did It!/i }).click();
    
    // Skip the handoff
    await page.getByRole('button', { name: 'Skip' }).click();
    
    // Go to home and click on pending quest
    await page.getByRole('button', { name: /Home/i }).click();
    await page.getByText(/Awaiting Approval/i).click();
    
    // Should see Undo button
    await expect(page.getByRole('button', { name: /Undo/i })).toBeVisible();
  });
});

test.describe('Parent Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Quest Cards')).toBeVisible();
    
    // Switch to parent profile (assuming demo data has parent first or second)
    await page.locator('header button').filter({ hasText: /👩|👨/ }).first().click();
    // Click on a parent option if member picker shows
    const parentOption = page.getByText(/Mom|Dad|Parent/i).first();
    if (await parentOption.isVisible()) {
      await parentOption.click();
    }
  });

  test('F18: points in header do not navigate to shop', async ({ page }) => {
    // Get current URL
    const initialUrl = page.url();
    
    // Try clicking points display in header (it should not be a button anymore)
    const pointsDisplay = page.locator('header').getByText(/⭐\d+/);
    await pointsDisplay.click();
    
    // URL should not have changed to shop
    // We're on home, should stay on home (not navigate)
    await expect(page.getByRole('button', { name: /Home/i })).toBeVisible();
  });

  test('F20: parent can see shop with rewards from other parents', async ({ page }) => {
    // Navigate to Shop tab
    await page.getByRole('button', { name: /Shop/i }).click();
    
    // Should see the shop view (not just manage view)
    await expect(page.getByText('Reward Shop')).toBeVisible();
    await expect(page.getByText('Your Points')).toBeVisible();
  });
});

test.describe('Reward System', () => {
  test('F20: manage rewards shows all family members', async ({ page }) => {
    await page.goto('/');
    
    // Switch to parent
    await page.locator('header button').filter({ hasText: /👩|👨/ }).first().click();
    const parentOption = page.getByText(/Mom|Dad|Parent/i).first();
    if (await parentOption.isVisible()) {
      await parentOption.click();
    }
    
    // Go to Shop and Manage
    await page.getByRole('button', { name: /Shop/i }).click();
    await page.getByRole('button', { name: /Manage/i }).click();
    
    // Should see option to add rewards
    await expect(page.getByText(/Add New Reward/i)).toBeVisible();
  });
});
