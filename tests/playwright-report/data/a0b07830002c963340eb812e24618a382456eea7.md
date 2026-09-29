# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 07-integridade.spec.ts >> Integridade UI >> Header único e sem hover confuso
- Location: e2e\07-integridade.spec.ts:12:7

# Error details

```
Error: expect(locator).not.toHaveClass(expected) failed

Locator: locator('table tbody tr').first()
Expected pattern: not /cursor-pointer/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "not toHaveClass" locator('table tbody tr').first() with timeout 5000ms
  - waiting for locator('table tbody tr').first()

```

```yaml
- complementary:
  - img "Pitstop"
  - text: Pitstop
  - navigation:
    - heading "Principal" [level=3]
    - link "Dashboard":
      - /url: /dashboard
    - link "Clientes":
      - /url: /clientes
    - link "Serviços":
      - /url: /servicos
  - text: A Anderson Administrador
  - button "Sair"
- banner:
  - heading "Clientes" [level=2]
  - paragraph: Gerencie os clientes cadastrados.
  - paragraph: Pitstop
- main:
  - textbox "Buscar por nome, telefone ou placa..."
  - button
  - link "Novo Cliente":
    - /url: /clientes/novo
  - heading "Nenhum cliente encontrado" [level=3]
  - paragraph: Tente ajustar sua busca ou adicione um novo cliente.
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Integridade UI', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.fill('input[name="email"]', 'portugal@pitstop.com');
  7  |     await page.fill('input[name="password"]', 'portugal123');
  8  |     await page.click('button[type="submit"]');
  9  |     await page.waitForLoadState('networkidle');
  10 |   });
  11 | 
  12 |   test('Header único e sem hover confuso', async ({ page }) => {
  13 |     await page.goto('/clientes');
  14 |     await expect(page.getByRole('heading', { name: /Clientes/i, level: 2 })).toBeVisible();
  15 |     const row = page.locator('table tbody tr').first();
> 16 |     await expect(row).not.toHaveClass(/cursor-pointer/);
     |                           ^ Error: expect(locator).not.toHaveClass(expected) failed
  17 |     await expect(row).not.toHaveClass(/hover:bg-slate-100\/50/);
  18 |   });
  19 | 
  20 |   test('Dashboard não tem parse literal', async ({ page }) => {
  21 |     await page.goto('/dashboard');
  22 |     await expect(page.getByText('Faturamento em Risco')).toBeVisible();
  23 |   });
  24 | });
  25 | 
```