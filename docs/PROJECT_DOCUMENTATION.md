# PitStop CRM — Documentação Completa

> Atualizado: 2026-09-29 — Status: build limpo (0 erros TS), banco limpo (TRUNCATE executado), remap concluído.

---

## 1. Visão Geral

PitStop CRM é um sistema operacional de pós-venda para oficinas mecânicas, construído com **Next.js 16.3.6 (App Router)**, **TypeScript strict**, **React 19** (`useActionState`), **Tailwind CSS / shadcn/ui**, **Supabase (PostgreSQL + Auth)** e **Playwright (E2E)**.

Foco: retenção de clientes via registro de serviços, previsão automatizada de manutenção (`calculateNextMaintenance`), contatos WhatsApp (`wa.me`) e dashboard de KPIs.

---

## 2. Arquitetura

```
Client (React 19) → Server Actions (prevState + FormData + Zod) → Domain (manutenção) → Supabase (SQL preparado)
                                ↑
                        useActionState generics
                                ↑
                  DashboardContent / MetricCard / RetentionSummary
```

- **Domínio isolado**: `domain/maintenance/` — sem dependência de React
- **Server Actions**: todo `FormData` passa por `Zod.safeParse()` antes do banco
- **Dados imutáveis**: `service_records` = fato; `maintenance_predictions` = estimativa
- **Autenticação**: apenas chave pública (`ANON_KEY`) exposta; `SERVICE_ROLE_KEY` nunca no código

---

## 3. Stack e Versões

| Componente | Versão / Config |
|---|---|
| Next.js | 16.3.6 (Turbopack, App Router) |
| TypeScript | Strict (`next.config.ts`) |
| React | 19 (`useActionState`) |
| Tailwind | v3 + shadcn/ui |
| Supabase | `@supabase/ssr` + Postgres |
| Zod | v4 (`safeParse`) |
| Playwright | E2E (`08-ui-polish.spec.ts` corrigido) |
| Build | `npm run build` limpo |
| Segurança | `X-Frame-Options: DENY`, `nosniff`, `.env*` no `.gitignore`, `npm audit` = 0 |

---

## 4. Estrutura de Diretórios

```
web/
├── app/                  # App Router
│   ├── (auth)/login/     # Login (useActionState<LoginState>)
│   ├── (dashboard)/      # Dashboard (KPIs, retenção, contatos)
│   ├── clientes/         # Cadastro + lista
│   ├── veiculos/         # Veículos por cliente
│   ├── servicos/         # Tipos de serviço
│   ├── actions/          # Server Actions (auth, customers, service-records, contacts, vehicles)
│   └── ...
├── components/           # UI reutilizável (MetricCard, RetentionSummary, ServiceRegistrationFormClient, ...)
├── domain/               # Lógica de negócio pura (maintenance/calculator, types, service)
├── lib/                  # Supabase (client/server), WhatsApp, validações
├── docs/                 # CODEBASE_MAP.md (remapeado 29/09), checklist-ux.md
├── e2e/                  # Playwright (08-ui-polish corrigido com .first() / filtra)
├── supabase/             # Migrações / schema
├── memory/               # Memórias de projeto (CLAUDE.md, project-summary.md)
└── clean-database.sql    # SQL de limpeza (TRUNCATE sem users)
```

---

## 5. Módulos Principais

### 5.1 Autenticação (`app/actions/auth.ts`, `app/(auth)/login/page.tsx`)
- Tipo: `LoginState = { error: string | null }`
- Padrão: `useActionState<LoginState, FormData>`
- Segurança: `prevState` tipado, `FormData` tipado, `redirect` após sucesso

### 5.2 Clientes (`app/actions/customers/create.ts`, `lib/validations/customer.ts`)
- Schema Zod: `customerSchema` → `safeParse`
- Valida `name`, `phone` (Zod + `customerSchema.safeParse`)
- Retorno: `{ error: ... }` ou `redirect('/clientes')`

### 5.3 Registro de Serviços (`app/actions/service-records/create.ts`)
- Nome: `createServiceRecord(prevState: ActionState, formData: FormData): Promise<ActionState>`
- Validação: `parseInt(odometer)`, `parseFloat(value)`; valida `odometer > last.odometer`
- Atualiza `vehicles.current_km`
- Calcula previsão (`calculateNextMaintenance`) com histórico (`previousServices`)
- Insere `maintenance_predictions` (status `UPCOMING`) e cancela anteriores (`CANCELLED`)
- Revalida: `revalidatePath('/clientes/' + customer_id)`
- **Nota**: não usa `Zod` diretamente aqui (usa `parseInt`/`parseFloat` manual), mas não usa `.raw()` — SDK do Supabase previne SQLi

### 5.4 Manutenção / Previsão (`domain/maintenance/`)
- `calculator.ts`: `calculateNextMaintenance({ serviceType, current_km, serviceDate, previousServices })`
- `types.ts`: interfaces de serviço, previsão, histórico
- `test-calculator.ts`: testes de cálculo
- **Correção aplicada**: `current_km` (não `currentKm`) em todos os arquivos

### 5.5 Dashboard (`app/(dashboard)/dashboard/DashboardContent.tsx`)
- Métricas: Atrasados, Hoje (janela), Próximos 7 dias, Clientes, Faturamento em Risco
- Cálculo: `retentionRate = returnsThisMonth / totalCustomers`
- Correção aplicada: `value={Number(revenueAtRisk) || 0}` (tipo `number`)
- Contatos: links WhatsApp com mensagem gerada (`generateMaintenanceMessage`)
- Tilt: `ContactStatusBadge` com status dinâmico

### 5.6 UI / UX (`components/ui/`, `e2e/`)
- Polimento: `MetricCard`, `RetentionSummary`, `ServiceRegistrationFormClient`, `RegisterServiceDialog`
- Playwright: `08-ui-polish.spec.ts` corrigido — `aside.filter({ hasText: 'Retenção' }).first()` + `.first()` em `getByText('Taxa de Retorno')`
- Barra de progresso: `.bg-gradient-to-r` validado (`toHaveCount(1)`)

---

## 6. Segurança — Estado Atual

| Área | Status | Detalhes |
|---|---|---|
| `.env` / `.env.local` | ✅ | `.gitignore`: `.env*`; nenhum arquivo versionado |
| `SERVICE_ROLE_KEY` | ✅ | Não exposta no código ou `.env.local`; apenas `ANON_KEY` pública |
| `npm audit` | ✅ | 0 vulnerabilidades |
| `next.config.ts` | ✅ | Headers: `DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` |
| `Zod` / Server Actions | ✅ | `safeParse` aplicado em `customers`, `services`, `vehicles`, `contacts`; `service-records` sem `.raw()` |
| SQL Injection | ✅ | Apenas SDK Supabase (`.insert()`, `.update()`, `.eq()`); sem concatenação |
| Playwright (E2E) | ✅ | `08-ui-polish` corrigido; 12 pass; 5 falhas por banco vazio (`TRUNCATE`) |
| Tipo / Build | ✅ | `npx tsc --noEmit`: 0 erros; `npm run build`: passa |

---

## 7. Estado da Entrega (29/09/2026)

- **Banco**: limpo (`TRUNCATE` sem `users`; `clean-database.sql` documentado)
- **Código**: `useActionState` aplicado em todos os formulários; `ActionState` tipado
- **Documentação**: `README.md` (profissional, 155 linhas), `CLAUDE.md`, `CODEBASE_MAP.md` (145 arquivos), `TEST_REPORT.md` atualizado, `AGENTS.md` (Next.js rules)
- **Remap**: `docs/CODEBASE_MAP.md` atualizado com timestamp `2026-09-29T23:03:26Z`

---

## 8. Como Executar (Produção / Entrega)

```bash
# 1. Instalar
npm install

# 2. Configurar (.env.local — NÃO versionar!)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# 3. Verificar
npm audit
npx tsc --noEmit
npm run build

# 4. Limpar banco para entrega (opcional / já feito)
# Copiar conteúdo de clean-database.sql para SQL Editor do Supabase

# 5. Testes E2E (esperado: 12 pass; falhas por dados — normal após TRUNCATE)
npx playwright test
```

---

## 9. Referências

- [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md) — Arquitetura detalhada, módulos, data flow
- [CLAUDE.md](CLAUDE.md) — Diretrizes de desenvolvimento, princípios arquiteturais
- [README.md](README.md) — Resumo profissional com status, stack, funcionalidades
- [TEST_REPORT.md](TEST_REPORT.md) — Relatório de testes Playwright
- [AGENTS.md](AGENTS.md) — Regras do agente Next.js
- [clean-database.sql](clean-database.sql) — SQL de limpeza do banco

---

## 10. Atribuição (Git / PR)

Co-Authored-By: Claude Code <noreply@anthropic.com>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
