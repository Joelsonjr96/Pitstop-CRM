import { test, expect } from '@playwright/test';

test.describe('Criação de Cliente e Serviço', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="email"]', 'portugal@pitstop.com');
    await page.fill('input[name="password"]', 'portugal123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('Cadastra novo cliente e serviço', async ({ page }) => {
    await page.goto('/clientes');
    await page.getByRole('link', { name: /Novo Cliente/i }).click();
    await expect(page.locator('main form')).toBeVisible();

    await page.goto('/servicos');
    await expect(page.getByRole('heading', { name: /Serviços/i, level: 2 })).toBeVisible();
  });
});
