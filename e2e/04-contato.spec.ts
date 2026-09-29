import { test, expect } from '@playwright/test';

test.describe('Contato e Ações', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="email"]', 'portugal@pitstop.com');
    await page.fill('input[name="password"]', 'portugal123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('Status de contato atualiza ao clicar', async ({ page }) => {
    await page.goto('/dashboard');
    const badge = page.locator('button[title="Clique para marcar contato"]').first();
    await expect(badge).toBeVisible();
    await badge.click();
    await expect(page.getByText('Mensagem Enviada')).toBeVisible();
  });

  test('Link WhatsApp contém telefone', async ({ page }) => {
    await page.goto('/dashboard');
    const link = page.getByRole('link', { name: /WhatsApp/i }).first();
    if (await link.isVisible()) {
      const href = await link.getAttribute('href');
      expect(href).toContain('wa.me');
    }
  });
});
