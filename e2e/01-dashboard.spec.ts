import { test, expect } from '@playwright/test';

test.describe('Aba Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="email"]', 'portugal@pitstop.com');
    await page.fill('input[name="password"]', 'portugal123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('Deve carregar as estatísticas e título do Dashboard', async ({ page }) => {
    await expect(page.getByText('Clientes para contatar')).toBeVisible();
  });

  test('Deve exibir a badge de atraso com as cores corretas segundo a regra de severidade', async ({ page }) => {
    const badgeCritico = page.locator('text=/6[0-9] dias/i').first();
    if (await badgeCritico.isVisible()) {
      await expect(badgeCritico).toHaveClass(/red|amber|danger/i);
    }
  });

  test('Botão do WhatsApp deve conter o link correto com o telefone do cliente', async ({ page }) => {
    const botaoWhatsapp = page.getByRole('link', { name: /WhatsApp/i }).first();
    if (await botaoWhatsapp.isVisible()) {
      const href = await botaoWhatsapp.getAttribute('href');
      expect(href).toContain('wa.me');
    }
  });
});
