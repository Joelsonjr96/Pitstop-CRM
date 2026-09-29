# CLAUDE.md

Este documento contém as diretrizes e regras para o desenvolvimento do projeto CRM de pós-venda para oficinas mecânicas.

## Codebase Overview

Este é um CRM operacional para oficinas mecânicas, focado na gestão de histórico e retenção de clientes.

**Stack**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase.
**Estrutura**: Separação clara entre Lógica de Domínio (`web/domain/`), Server Actions (`web/app/actions/`), UI (`web/components/`) e Banco de Dados (`web/supabase/`).

Para arquitetura detalhada, consulte [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).

Para arquitetura detalhada, consulte [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).

## Princípios Arquiteturais
1. **Não complicar:** Evitar abstrações desnecessárias.
2. **Regras de negócio isoladas:** Manter regras de cálculo (ex: previsão de manutenção) fora dos componentes React. Utilizar `Server Actions` e domínios.
3. **Histórico imutável:** Serviços realizados são fatos.
4. **Previsões são estimativas:** Nunca tratar como certeza.
5. **Simplicidade:** Não antecipar necessidades (ex: não implementar multi-tenancy, microserviços, filas, IA agora).

## Modelo de Implantação
1 cliente = 1 aplicação = 1 banco de dados = 1 conjunto de dados.
Sem multi-tenancy agora.

## Ordem de Implementação (MVP)
1. Autenticação
2. Clientes
3. Veículos
4. Tipos de serviço
5. Registro de serviços
6. Histórico
7. Motor de previsão
8. Status de manutenção
9. CRM
10. WhatsApp (wa.me)
11. Dashboard
...

## Regras de Desenvolvimento
* Antes de alterar código: entender o contexto, verificar arquivos relevantes.
* Tarefas pequenas: escopo claro, alterar apenas o necessário.
* Validações no backend com Zod.
* Respeitar as diretrizes de LGPD (minimização de dados).
* **CHECKLIST UX OBRIGATÓRIO:** Antes de concluir qualquer tarefa de interface, consulte `docs/checklist-ux.md` e valide a tela contra os pontos de hierarquia, estados de erro/vazio e semântica de cores. Não realizar apenas alterações cosméticas.
