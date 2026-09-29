import { test, expect } from '@playwright/test';

test.describe('Integridade UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="email"]', 'portugal@pitstop.com');
    await page.fill('input[name="password"]', 'portugal123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('Header único e sem hover confuso', async ({ page }) => {
    await page.goto('/clientes');
    await expect(page.getByRole('heading', { name: /Clientes/i, level: 2 })).toBeVisible();
    const row = page.locator('table tbody tr').first();
    await expect(row).not.toHaveClass(/cursor-pointer/);
    await expect(row).not.toHaveClass(/hover:bg-slate-100\/50/);
  });

  test('Dashboard não tem parse literal', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('Faturamento em Risco')).toBeVisible();
  });
});
