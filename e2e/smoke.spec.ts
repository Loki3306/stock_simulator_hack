import { test, expect } from '@playwright/test';

test('landing loads and navigate', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Algorithmic Trading Made Human')).toBeVisible();
  await page.click('text=Start Building Strategies');
  await expect(page).toHaveURL(/.*dashboard/);
});
