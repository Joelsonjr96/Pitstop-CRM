# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-clientes.spec.ts >> Aba Clientes >> Deve permitir filtrar a lista de clientes pela barra de pesquisa
- Location: e2e\02-clientes.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Camila Araújo')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Camila Araújo') with timeout 5000ms
  - waiting for getByText('Camila Araújo')

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
  - textbox "Buscar por nome, telefone ou placa...": Camila
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
  3  | test.describe('Aba Clientes', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.fill('input[name="email"]', 'portugal@pitstop.com');
  7  |     await page.fill('input[name="password"]', 'portugal123');
  8  |     await page.click('button[type="submit"]');
  9  |     await page.waitForLoadState('networkidle');
  10 |     await page.goto('/clientes');
  11 |   });
  12 | 
  13 |   test('Deve permitir filtrar a lista de clientes pela barra de pesquisa', async ({ page }) => {
  14 |     const campoBusca = page.getByPlaceholder(/Buscar por nome, telefone ou placa/i);
  15 |     await expect(campoBusca).toBeVisible();
  16 | 
  17 |     await campoBusca.fill('Camila');
  18 |     await page.waitForTimeout(300);
> 19 |     await expect(page.getByText('Camila Araújo')).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  20 |     // Busca pode ser parcial; apenas confirmamos que o filtro aplicou
  21 |   });
  22 | 
  23 |   test('Deve abrir o formulário para cadastrar novo cliente', async ({ page }) => {
  24 |     const botaoNovo = page.getByRole('button', { name: /Novo Cliente/i });
  25 |     if (await botaoNovo.isVisible()) {
  26 |       await botaoNovo.click();
  27 |       await expect(page.getByRole('dialog').or(page.locator('form'))).toBeVisible();
  28 |     }
  29 |   });
  30 | });
  31 | 
```