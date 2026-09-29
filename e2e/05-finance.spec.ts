import { test, expect } from '@playwright/test';

test.describe('Dashboard Completo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="email"]', 'portugal@pitstop.com');
    await page.fill('input[name="password"]', 'portugal123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.goto('/dashboard');
  });

  test('Finance card e retenção visíveis', async ({ page }) => {
    await expect(page.getByText('Faturamento em Risco')).toBeVisible();
    await expect(page.getByText('Retenção')).toBeVisible();
  });

  test('Tabela de contatos com dados reais', async ({ page }) => {
    await expect(page.getByText('Maria Oliveira')).toBeVisible();
    await expect(page.getByText('61 dias')).toBeVisible();
  });

  test('Preventivo 15-30 dias', async ({ page }) => {
    await expect(page.getByText('Próximos Vencimentos')).toBeVisible();
  });
});
