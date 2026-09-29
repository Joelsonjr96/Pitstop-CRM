import { test, expect } from '@playwright/test';

test.describe('Aba Serviços', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="email"]', 'portugal@pitstop.com');
    await page.fill('input[name="password"]', 'portugal123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.goto('/servicos');
  });

  test('Deve exibir os cards de tipos de serviço cadastrados', async ({ page }) => {

    await expect(page.getByRole('heading', { name: /Serviços/i, level: 2 })).toBeVisible();

    await expect(page.getByText(/Troca de Óleo/i).first()).toBeVisible();
    await expect(page.getByText(/km/i).first()).toBeVisible();
    await expect(page.getByText(/meses/i).first()).toBeVisible();
  });
});
