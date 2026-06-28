# Tasks: Atualizações de Gráfico Semanal

**Input**: Design documents from `/specs/007-atualizacoes-grafico-semanal/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md
**Tests**: Inclui validação de reatividade, consistência do gráfico e regressão do fluxo de consumo
**Organization**: Tarefas agrupadas por impacto no fluxo de dados (menor risco → maior impacto)

---

## Format: `[ID] [P?] [Stage] Description`

* **[P]**: Pode executar em paralelo (sem dependência direta de estado mutável)
* **[Stage]**: INFRA, CORE, US1, US2, POLISH
* Todas as tarefas incluem objetivo, arquivos afetados, critérios de aceite, riscos e dependências

---

# Phase 1: Core Infrastructure (Reatividade Base)

**Purpose**: Garantir pipeline reativo entre consumo e gráfico semanal

---

* [ ] **T001 [P] [CORE] Criar função pura de agregação semanal em src/utils/weeklyAggregation.ts**
  Objetivo: calcular total semanal, agrupamento diário e consistência de período.
  Arquivos afetados: src/utils/weeklyAggregation.ts
  Critérios de aceite: função pura, sem efeitos colaterais, cobre filtragem por semana.
  Riscos: erros de cálculo de boundary (domingo/segunda).
  Dependências: nenhuma.

---

* [ ] **T002 [P] [CORE] Criar utilitário de cálculo de intervalo semanal baseado em timestamp**
  Objetivo: padronizar weekStart e weekEnd para todos os registros.
  Arquivos afetados: src/utils/weeklyAggregation.ts
  Critérios de aceite: mesma regra aplicada em todos os registros.
  Riscos: inconsistência de timezone.
  Dependências: T001.

---

* [ ] **T003 [P] [CORE] Definir hook base de consumo em src/hooks/useConsumption.ts**
  Objetivo: centralizar estado de RegistroConsumo reativo.
  Arquivos afetados: src/hooks/useConsumption.ts
  Critérios de aceite: CRUD refletido em estado local/global reativo.
  Riscos: duplicação com useMeals existente.
  Dependências: nenhuma.

---

* [ ] **T004 [P] [CORE] Garantir propagação de mudanças CRUD no estado de consumo**
  Objetivo: assegurar que create/update/delete dispare re-render global.
  Arquivos afetados: src/hooks/useConsumption.ts
  Critérios de aceite: qualquer alteração reflete imediatamente no estado.
  Riscos: loops de re-render ou state inconsistente.
  Dependências: T003.

---

**Checkpoint**: Base reativa pronta (consumo → estado).

---

# Phase 2: Graph Derivation Layer

**Purpose**: Transformar consumo em gráfico semanal derivado

---

* [ ] **T005 [P] [CORE] Criar hook de derivação useWeeklyChart em src/hooks/useWeeklyChart.ts**
  Objetivo: converter RegistroConsumo em estrutura de gráfico semanal.
  Arquivos afetados: src/hooks/useWeeklyChart.ts
  Critérios de aceite: recalcula automaticamente ao mudar consumo.
  Riscos: re-render excessivo.
  Dependências: T001, T003.

---

* [ ] **T006 [P] [CORE] Integrar weeklyAggregation ao useWeeklyChart**
  Objetivo: aplicar função pura de agregação no hook.
  Arquivos afetados: src/hooks/useWeeklyChart.ts
  Critérios de aceite: consistência entre dados brutos e gráfico.
  Riscos: divergência de cálculo entre componentes.
  Dependências: T001, T005.

---

* [ ] **T007 [P] [CORE] Criar modelo de dados do gráfico semanal derivado**
  Objetivo: padronizar shape consumido pela UI.
  Arquivos afetados: src/models/types.ts
  Critérios de aceite: tipo sem any, compatível com dashboard.
  Riscos: acoplamento com UI existente.
  Dependências: T005.

---

**Checkpoint**: Graph derivation layer pronta.

---

# Phase 3: User Story 1 - Auto Update on Create/Edit/Delete (P1)

**Goal**: gráfico atualiza automaticamente em qualquer mudança de consumo

---

## Tests (US1)

* [ ] **T008 [P] [US1] Teste unitário de agregação semanal**
  Objetivo: validar cálculo correto de semana.
  Arquivos afetados: tests/unit/weeklyAggregation.spec.ts
  Critérios de aceite: soma e agrupamento corretos.
  Riscos: erros de boundary de semana.
  Dependências: T001.

---

* [ ] **T009 [P] [US1] Teste de reatividade do hook useWeeklyChart**
  Objetivo: validar atualização automática ao alterar consumo.
  Arquivos afetados: tests/unit/useWeeklyChart.spec.ts
  Critérios de aceite: mudança de estado reflete no gráfico.
  Riscos: falso positivo por mock incompleto.
  Dependências: T005.

---

## Implementation (US1)

* [ ] **T010 [US1] Integrar useWeeklyChart ao DashboardView**
  Objetivo: substituir dados estáticos por derivação reativa.
  Arquivos afetados: src/views/DashboardView.tsx
  Critérios de aceite: gráfico atualiza sem refresh manual.
  Riscos: regressão visual no dashboard.
  Dependências: T005, T006.

---

* [ ] **T011 [US1] Garantir atualização automática após create de RegistroConsumo**
  Objetivo: fluxo create dispara atualização do hook.
  Arquivos afetados: src/services/consumptionService.ts, src/hooks/useConsumption.ts
  Critérios de aceite: novo consumo aparece instantaneamente no gráfico.
  Riscos: atraso de sincronização.
  Dependências: T004.

---

* [ ] **T012 [US1] Garantir atualização após update de RegistroConsumo**
  Objetivo: edição de consumo recalcula gráfico.
  Arquivos afetados: src/hooks/useConsumption.ts
  Critérios de aceite: gráfico reflete valores editados.
  Riscos: inconsistência de referência de objeto.
  Dependências: T004.

---

* [ ] **T013 [US1] Garantir atualização após delete de RegistroConsumo**
  Objetivo: remoção impacta gráfico imediatamente.
  Arquivos afetados: src/hooks/useConsumption.ts
  Critérios de aceite: item removido não aparece mais no gráfico.
  Riscos: estado residual em cache local.
  Dependências: T004.

---

**Checkpoint**: atualização automática ponta a ponta funcionando.

---

# Phase 4: User Story 2 - Empty State & Week Isolation (P2)

**Goal**: garantir isolamento de semanas e estado vazio correto

---

* [ ] **T014 [P] [US2] Implementar filtro de registros por semana ativa**
  Objetivo: garantir que gráfico só use dados da semana atual.
  Arquivos afetados: src/utils/weeklyAggregation.ts
  Critérios de aceite: dados fora da semana não entram no cálculo.
  Riscos: erro de timezone.
  Dependências: T001.

---

* [ ] **T015 [US2] Implementar estado vazio do gráfico semanal**
  Objetivo: exibir mensagem quando não há dados.
  Arquivos afetados: src/components/WeeklyChart.tsx
  Critérios de aceite: UI não mostra gráfico inválido.
  Riscos: conflito com loading state.
  Dependências: T010.

---

* [ ] **T016 [US2] Validar troca de semana sem impacto em dados históricos**
  Objetivo: garantir isolamento temporal.
  Arquivos afetados: src/hooks/useWeeklyChart.ts
  Critérios de aceite: mudança de semana não corrompe dados.
  Riscos: cache de semana anterior.
  Dependências: T005.

---

**Checkpoint**: isolamento semanal e empty state validados.

---

# Phase 5: Polish & Consistency

---

* [ ] **T017 [P] [POLISH] Otimizar re-render do gráfico semanal**
  Objetivo: evitar recomputação excessiva.
  Arquivos afetados: src/hooks/useWeeklyChart.ts
  Critérios de aceite: recalculo apenas quando consumo muda.
  Riscos: memoization incorreta.
  Dependências: T006.

---

* [ ] **T018 [P] [POLISH] Validar consistência entre dashboard e histórico**
  Objetivo: garantir que ambos usam mesma fonte derivada.
  Arquivos afetados: src/views/DashboardView.tsx, src/views/HistoryView.tsx
  Critérios de aceite: sem divergência de valores.
  Riscos: duplicação de lógica em views.
  Dependências: T010.

---

* [ ] **T019 [POLISH] Executar validação final de regressão do fluxo de consumo**
  Objetivo: garantir que CRUD de consumo não quebrou funcionalidades existentes.
  Arquivos afetados: specs/007-atualizacoes-grafico-semanal/quickstart.md
  Critérios de aceite: todos cenários passam manualmente.
  Riscos: regressão silenciosa em UI.
  Dependências: T013, T015.

---

* [ ] **T020 [POLISH] Consolidar documentação de comportamento do gráfico**
  Objetivo: registrar regras finais de derivação.
  Arquivos afetados: specs/007-atualizacoes-grafico-semanal/spec.md
  Critérios de aceite: comportamento totalmente consistente com implementação.
  Riscos: desalinhamento doc vs código.
  Dependências: T019.

---

# Execution Strategy

## MVP Path

1. T001 → T003 → T004
2. T005 → T006 → T010
3. T011 → T012 → T013
4. T014 → T015 → T016

---

## Parallel Opportunities

* T001 / T002
* T008 / T009
* T011 / T012 / T013 (após base pronta)
* T017 / T018

---

## Risk Notes

* Principal risco: inconsistência entre estado de consumo e derivação do gráfico
* Mitigação: manter função pura única (`weeklyAggregation`)
* Evitar: cache manual de gráfico ou duplicação de estado

---

## Definition of Done

* Gráfico atualiza automaticamente após qualquer CRUD de consumo
* Sem refresh manual
* Sem inconsistência entre dados e UI
* Sem estado duplicado de gráfico
