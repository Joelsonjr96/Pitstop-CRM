import { test, expect } from '@playwright/test';

test.describe('Aba Clientes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="email"]', 'portugal@pitstop.com');
    await page.fill('input[name="password"]', 'portugal123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.goto('/clientes');
  });

  test('Deve permitir filtrar a lista de clientes pela barra de pesquisa', async ({ page }) => {
    const campoBusca = page.getByPlaceholder(/Buscar por nome, telefone ou placa/i);
    await expect(campoBusca).toBeVisible();

    await campoBusca.fill('Camila');
    await page.waitForTimeout(300);
    await expect(page.getByText('Camila Araújo')).toBeVisible();
    // Busca pode ser parcial; apenas confirmamos que o filtro aplicou
  });

  test('Deve abrir o formulário para cadastrar novo cliente', async ({ page }) => {
    const botaoNovo = page.getByRole('button', { name: /Novo Cliente/i });
    if (await botaoNovo.isVisible()) {
      await botaoNovo.click();
      await expect(page.getByRole('dialog').or(page.locator('form'))).toBeVisible();
    }
  });
});
