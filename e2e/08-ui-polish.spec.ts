import { test, expect } from '@playwright/test';

test.describe('Polimento Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="email"]', 'portugal@pitstop.com');
    await page.fill('input[name="password"]', 'portugal123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('Breadcrumb duplicado removido', async ({ page }) => {
    await page.goto('/clientes');
    await expect(page.getByText('Pitstop').first()).toBeVisible();
    const breadcrumbs = page.locator('[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toHaveCount(0);
  });

  test('Score de retenção com barra de progresso', async ({ page }) => {
    await page.goto('/dashboard');
    const retention = page.locator('aside').filter({ hasText: 'Retenção' }).first();
    await expect(retention.getByText('Taxa de Retorno').first()).toBeVisible();
    await expect(retention.locator('.bg-gradient-to-r')).toHaveCount(1);
  });
});
