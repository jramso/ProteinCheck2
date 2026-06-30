# Implementation Plan: Sugestoes de Consumo

**Branch**: `006-sugestoes-consumo` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-sugestoes-consumo/spec.md`

## Summary

Implementar cadastro e gerenciamento de sugestoes de consumo por usuario para acelerar o registro diario de proteina, mantendo as regras definidas na clarificacao: deduplicacao por nome normalizado + proteina igual, selecao de sugestao com passo obrigatorio de quantidade antes da confirmacao e bloqueio de persistencia para visitante ate conversao para conta autenticada.

## Technical Context

**Language/Version**: TypeScript 5.8+, React 19, Node.js 22+

**Primary Dependencies**: React, Firebase SDK (Firestore/Auth), Vite, Express, Lucide React

**Storage**: Firestore para usuarios autenticados; visitante sem persistencia de sugestoes

**Testing**: Type check via `npm run lint` e validacao funcional manual dos fluxos principais

**Target Platform**: Web (SPA React em Vite)

**Project Type**: Aplicacao web fullstack leve (frontend React + backend Express)

**Performance Goals**: Cadastro e uso de sugestao concluiveis em poucos toques, sem regressao perceptivel no fluxo atual de adicionar refeicao

**Constraints**: Nao adicionar bibliotecas novas desnecessarias; manter tipagem estrita sem `any`; preservar comportamento atual de refeicoes

**Scale/Scope**: Funcionalidade limitada a sugestoes de consumo (CRUD + uso no registro de refeicao) para usuarios autenticados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- I. Documentacao-Primeiro: PASSOU. Spec e clarificacoes completas antes da implementacao.
- II. Gestao de Tarefas Agil: PASSOU. O proximo artefato (`tasks.md`) sera organizado por prioridade e dependencia.
- III. Tipagem TypeScript Estrita: PASSOU. Alteracoes previstas em tipos centrais e hooks sem uso de `any`.
- IV. Componentizacao e Padroes React 19: PASSOU. A feature sera aplicada em hooks/views existentes sem acoplamento desnecessario.
- V. Validacao e Qualidade de Codigo: PASSOU. Fluxo inclui validacoes, erros, estado vazio e verificacao de regressao no add-meal.

## Project Structure

### Documentation (this feature)

```text
specs/006-sugestoes-consumo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── suggestions.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── models/
│   └── types.ts
├── services/
│   └── firebaseService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useMeals.ts
│   └── useAddMealForm.ts
├── views/
│   ├── AddMealView.tsx
│   ├── DashboardView.tsx
│   └── HistoryView.tsx
└── utils/
    └── suggestionEngine.ts
```

**Structure Decision**: Manter estrutura atual single-project e evoluir os modulos existentes de hooks/services/views para evitar duplicacao e regressao, introduzindo a logica de sugestoes como extensao do fluxo atual de refeicoes.

## Complexity Tracking

Nenhuma violacao de constituicao identificada. Nenhuma complexidade excepcional precisa ser justificada nesta fase.
