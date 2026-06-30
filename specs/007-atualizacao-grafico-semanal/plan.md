# Implementation Plan: Atualizações de Gráfico Semanal

**Branch**: `007-atualizacoes-grafico-semanal` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-atualizacoes-grafico-semanal/spec.md`

---

## Summary

Implementar atualização automática do gráfico semanal do ProteinCheck sempre que houver alterações em registros de consumo (criação, edição ou exclusão), garantindo consistência imediata entre dados persistidos e visualização do gráfico sem necessidade de refresh manual.

A feature atua exclusivamente na camada de sincronização e reatividade de dados já existentes (RegistroConsumo → GraficoSemanal derivado), sem introduzir novas entidades persistidas.

---

## Technical Context

**Language/Version**: TypeScript 5.8+, React 19, Node.js 22+
**Primary Dependencies**: React, hooks de estado existentes (useMeals/useConsumo), Firebase SDK (se aplicável), Vite
**Storage**: Nenhuma alteração estrutural de storage; apenas leitura reativa de RegistroConsumo
**Testing**: Validação manual de reatividade + type-check (`tsc --noEmit`)
**Target Platform**: Web (SPA React)
**Project Type**: Aplicação web reativa (state-driven UI)
**Performance Goals**: Atualização do gráfico em tempo real (<100ms após mudança de estado local)
**Constraints**: Não alterar modelo de dados; não criar cache redundante do gráfico; evitar re-render desnecessário
**Scale/Scope**: Escopo restrito ao dashboard e hook de consumo

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* I. Documentação-Primeiro: PASSOU. Spec completa com cenários e critérios definidos.
* II. Estado Reativo Consistente: PASSOU. A feature depende de sincronização de estado existente.
* III. Tipagem Estrita TypeScript: PASSOU. Nenhuma nova entidade complexa fora de derivação.
* IV. Separação de Responsabilidades: PASSOU. Gráfico permanece como view derivada.
* V. Não Regressão de Fluxo: PASSOU. Fluxo de registro de consumo não será alterado estruturalmente.

---

## Project Structure

### Documentation (this feature)

```text
specs/007-atualizacoes-grafico-semanal/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

---

### Source Code (repository root)

```text
src/
├── models/
│   └── types.ts
├── services/
│   └── consumptionService.ts
├── hooks/
│   ├── useMeals.ts
│   ├── useConsumption.ts
│   ├── useWeeklyChart.ts        # novo hook derivado (ou extensão de useMeals)
│   └── useDashboard.ts
├── views/
│   ├── DashboardView.tsx       # principal impacto da feature
│   ├── AddMealView.tsx
│   └── HistoryView.tsx
├── components/
│   └── WeeklyChart.tsx        # componente reativo ao estado
└── utils/
    └── weeklyAggregation.ts   # lógica de agregação semanal
```

---

## Design Decisions

### 1. Fonte única de verdade

O gráfico semanal NÃO terá estado próprio persistido.

* Fonte: `RegistroConsumo`
* Derivação: cálculo em tempo real via selector/hook

**Decisão**: evitar duplicação de estado entre backend e UI.

---

### 2. Estratégia de atualização

Atualização baseada em reatividade de estado:

* Inserção → update automático do estado global de consumo
* Edição → replace do item no estado
* Remoção → filter do item
* Recalculo → derivação pura do hook `useWeeklyChart`

---

### 3. Camada de agregação

Criar função pura:

```text
weeklyAggregation.ts
```

Responsável por:

* filtrar por semana ativa
* agrupar por dia
* calcular total semanal
* manter consistência entre operações

---

### 4. Hook de derivação

Introduzir ou estender:

```text
useWeeklyChart()
```

Responsabilidades:

* consumir lista de RegistroConsumo
* recalcular automaticamente gráfico
* expor estado pronto para UI

---

### 5. UI reativa

`WeeklyChart.tsx`:

* não mantém estado interno de dados
* apenas consome hook
* re-render automático via React state updates

---

## Data Flow

```text
RegistroConsumo CRUD
        ↓
useConsumption (estado global)
        ↓
useWeeklyChart (derivação)
        ↓
weeklyAggregation (pure function)
        ↓
WeeklyChart UI
```

---

## Complexity Tracking

### Complexity Level: LOW-MEDIUM

**Justification:**

* Não há novas entidades persistidas
* Complexidade está em consistência reativa
* Risco principal: desalinhamento entre estado e visualização
* Mitigação: derivação pura sem cache manual
