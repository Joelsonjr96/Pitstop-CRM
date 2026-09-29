# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05-finance.spec.ts >> Dashboard Completo >> Tabela de contatos com dados reais
- Location: e2e\05-finance.spec.ts:18:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Maria Oliveira')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Maria Oliveira') with timeout 5000ms
  - waiting for getByText('Maria Oliveira')

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
  3  | test.describe('Dashboard Completo', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.fill('input[name="email"]', 'portugal@pitstop.com');
  7  |     await page.fill('input[name="password"]', 'portugal123');
  8  |     await page.click('button[type="submit"]');
  9  |     await page.waitForLoadState('networkidle');
  10 |     await page.goto('/dashboard');
  11 |   });
  12 | 
  13 |   test('Finance card e retenção visíveis', async ({ page }) => {
  14 |     await expect(page.getByText('Faturamento em Risco')).toBeVisible();
  15 |     await expect(page.getByText('Retenção')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('Tabela de contatos com dados reais', async ({ page }) => {
> 19 |     await expect(page.getByText('Maria Oliveira')).toBeVisible();
     |                                                    ^ Error: expect(locator).toBeVisible() failed
  20 |     await expect(page.getByText('61 dias')).toBeVisible();
  21 |   });
  22 | 
  23 |   test('Preventivo 15-30 dias', async ({ page }) => {
  24 |     await expect(page.getByText('Próximos Vencimentos')).toBeVisible();
  25 |   });
  26 | });
  27 | 
```