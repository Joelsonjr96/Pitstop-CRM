# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04-contato.spec.ts >> Contato e Ações >> Status de contato atualiza ao clicar
- Location: e2e\04-contato.spec.ts:12:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button[title="Clique para marcar contato"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('button[title="Clique para marcar contato"]').first() with timeout 5000ms
  - waiting for locator('button[title="Clique para marcar contato"]').first()

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
  3  | test.describe('Contato e Ações', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.fill('input[name="email"]', 'portugal@pitstop.com');
  7  |     await page.fill('input[name="password"]', 'portugal123');
  8  |     await page.click('button[type="submit"]');
  9  |     await page.waitForLoadState('networkidle');
  10 |   });
  11 | 
  12 |   test('Status de contato atualiza ao clicar', async ({ page }) => {
  13 |     await page.goto('/dashboard');
  14 |     const badge = page.locator('button[title="Clique para marcar contato"]').first();
> 15 |     await expect(badge).toBeVisible();
     |                         ^ Error: expect(locator).toBeVisible() failed
  16 |     await badge.click();
  17 |     await expect(page.getByText('Mensagem Enviada')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('Link WhatsApp contém telefone', async ({ page }) => {
  21 |     await page.goto('/dashboard');
  22 |     const link = page.getByRole('link', { name: /WhatsApp/i }).first();
  23 |     if (await link.isVisible()) {
  24 |       const href = await link.getAttribute('href');
  25 |       expect(href).toContain('wa.me');
  26 |     }
  27 |   });
  28 | });
  29 | 
```