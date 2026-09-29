# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-ui-polish.spec.ts >> Polimento Visual >> Score de retenção com barra de progresso
- Location: e2e\08-ui-polish.spec.ts:19:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('aside').filter({ hasText: 'Retenção' }).first().getByText('Taxa de Retorno').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('aside').filter({ hasText: 'Retenção' }).first().getByText('Taxa de Retorno').first() with timeout 5000ms
  - waiting for locator('aside').filter({ hasText: 'Retenção' }).first().getByText('Taxa de Retorno').first()

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
  - heading "Bom dia, Anderson terça-feira, 29 de setembro" [level=2]
  - paragraph: Veja quais clientes precisam da sua atenção hoje.
- main:
  - text: Atrasados 0
  - paragraph: Clientes precisam de contato
  - text: Hoje 0
  - paragraph: Contatos programados para hoje
  - text: Próximos 0
  - paragraph: Clientes nos próximos 7 dias
  - text: Clientes 0
  - paragraph: Ativos no sistema
  - text: Faturamento em Risco 0
  - paragraph: Valor acumulado em revisões vencidas
  - heading "Clientes para contatar" [level=2]
  - paragraph: Nenhum cliente para contatar agora.
  - complementary:
    - heading "Retenção" [level=2]
    - paragraph: Nenhum dado registrado este mês.
    - heading "Próximos Vencimentos (15-30 dias)" [level=3]
    - paragraph: Nenhuma revisão preventiva nos próximos 30 dias.
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Polimento Visual', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.fill('input[name="email"]', 'portugal@pitstop.com');
  7  |     await page.fill('input[name="password"]', 'portugal123');
  8  |     await page.click('button[type="submit"]');
  9  |     await page.waitForLoadState('networkidle');
  10 |   });
  11 | 
  12 |   test('Breadcrumb duplicado removido', async ({ page }) => {
  13 |     await page.goto('/clientes');
  14 |     await expect(page.getByText('Pitstop').first()).toBeVisible();
  15 |     const breadcrumbs = page.locator('[aria-label="Breadcrumb"]');
  16 |     await expect(breadcrumbs).toHaveCount(0);
  17 |   });
  18 | 
  19 |   test('Score de retenção com barra de progresso', async ({ page }) => {
  20 |     await page.goto('/dashboard');
  21 |     const retention = page.locator('aside').filter({ hasText: 'Retenção' }).first();
> 22 |     await expect(retention.getByText('Taxa de Retorno').first()).toBeVisible();
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  23 |     await expect(retention.locator('.bg-gradient-to-r')).toHaveCount(1);
  24 |   });
  25 | });
  26 | 
```