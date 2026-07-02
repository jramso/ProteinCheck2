# Tasks: Sugestoes de Consumo

**Input**: Design documents from `/specs/006-sugestoes-consumo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/suggestions.md

**Tests**: Inclui tarefas de testes unitarios e de integracao conforme solicitado.

**Organization**: Tarefas agrupadas por historia de usuario e ordenadas do menor risco para maior impacto.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependencia direta)
- **[Story]**: US1, US2, US3
- Todas as tarefas incluem objetivo, arquivos afetados, criterios de aceite, riscos e dependencias

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de tipos, utilitarios e observabilidade com baixo risco

- [X] **T001 [P] [US1] Criar tipos de dominio para sugestoes e erros funcionais em src/models/types.ts**
  Objetivo: introduzir contratos tipados para SugestaoConsumo, payloads e codigos de erro.
  Arquivos afetados: src/models/types.ts
  Criterios de aceite: tipos exportados, sem any, compativeis com spec e data-model.
  Riscos: quebra de imports existentes por conflito de nomes.
  Dependencias: nenhuma.

- [X] **T002 [P] [US1] Implementar utilitarios de normalizacao e chave de deduplicacao em src/utils/suggestionEngine.ts**
  Objetivo: padronizar nome (case-insensitive, sem acento, sem espacos redundantes) e gerar comparador de duplicidade com proteina.
  Arquivos afetados: src/utils/suggestionEngine.ts
  Criterios de aceite: funcoes puras para normalizacao e comparacao; regras FR-003 refletidas.
  Riscos: normalizacao inconsistente para caracteres especiais.
  Dependencias: T001.

- [X] **T003 [P] [US1] Definir padrao de logs funcionais em src/services/firebaseService.ts**
  Objetivo: criar helper de log util para erros AUTH_REQUIRED, VALIDATION_ERROR, DUPLICATE_SUGGESTION, NOT_FOUND e PERSISTENCE_ERROR.
  Arquivos afetados: src/services/firebaseService.ts
  Criterios de aceite: helper reutilizavel exportado, sem expor dados sensiveis.
  Riscos: ruido excessivo em console se nao houver nivel de log.
  Dependencias: nenhuma.

**Checkpoint**: Base tipada, regras de normalizacao e log disponiveis.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Persistencia e regras de acesso que bloqueiam as historias

- [X] **T004 [US1] Implementar operacoes de persistencia de sugestoes no Firestore em src/services/firebaseService.ts**
  Objetivo: criar create/list/update/delete de sugestoes por usuario autenticado.
  Arquivos afetados: src/services/firebaseService.ts
  Criterios de aceite: CRUD funcional; escopo por userId; contratos de erro mapeados.
  Riscos: consultas sem indice/ordenacao adequada.
  Dependencias: T001, T003.

- [X] **T005 [US1] Aplicar regra de visitante sem persistencia em src/hooks/useAuth.ts e camada de servico**
  Objetivo: bloquear persistencia para visitante e sinalizar fluxo de conversao para conta.
  Arquivos afetados: src/hooks/useAuth.ts, src/services/firebaseService.ts
  Criterios de aceite: tentativa de salvar sugestao como visitante retorna AUTH_REQUIRED.
  Riscos: confusao entre sessao visitante e autenticada apos login.
  Dependencias: T004.

- [X] **T006 [US1] Criar estado compartilhado de sugestoes e integracao de leitura em src/hooks/useMeals.ts**
  Objetivo: disponibilizar lista de sugestoes do usuario para views sem regressao do fluxo atual de refeicoes.
  Arquivos afetados: src/hooks/useMeals.ts
  Criterios de aceite: leitura reativa de sugestoes e refeicoes coexistindo.
  Riscos: listeners extras afetando performance ou limpeza de subscriptions.
  Dependencias: T004, T005.

**Checkpoint**: Persistencia e regras de acesso prontas. Historias podem avancar.

---

## Phase 3: User Story 1 - Cadastrar sugestao frequente (Priority: P1) 🎯 MVP

**Goal**: permitir cadastrar sugestoes validas, sem duplicidade, com erros claros.

**Independent Test**: cadastrar sugestao valida, rejeitar duplicata normalizada e bloquear visitante.

### Tests for User Story 1

- [X] **T007 [P] [US1] Criar testes unitarios de normalizacao/deduplicacao em tests/unit/suggestionEngine.spec.ts**
  Objetivo: cobrir regras de normalizacao e comparacao de duplicidade.
  Arquivos afetados: tests/unit/suggestionEngine.spec.ts, src/utils/suggestionEngine.ts
  Criterios de aceite: casos com acento, caixa e espacos passam; duplicidade detectada corretamente.
  Riscos: ausencia de infraestrutura de testes no projeto.
  Dependencias: T002.

- [X] **T008 [P] [US1] Criar teste de integracao de cadastro de sugestao em tests/integration/suggestions-create.spec.ts**
  Objetivo: validar fluxo ponta a ponta de create com sucesso, duplicidade e visitante bloqueado.
  Arquivos afetados: tests/integration/suggestions-create.spec.ts, src/services/firebaseService.ts, src/hooks/useAddMealForm.ts
  Criterios de aceite: tres cenarios exercitados com as respostas esperadas.
  Riscos: acoplamento com Firestore real em ambiente local.
  Dependencias: T004, T005.

### Implementation for User Story 1

- [X] **T009 [US1] Estender src/hooks/useAddMealForm.ts para cadastro de sugestao com validacoes**
  Objetivo: adicionar handlers para criar sugestao, validar campos e mapear erros funcionais.
  Arquivos afetados: src/hooks/useAddMealForm.ts
  Criterios de aceite: bloqueio de nome vazio/proteina <= 0; mensagens de erro amigaveis.
  Riscos: crescimento excessivo do hook atual.
  Dependencias: T002, T004, T005.

- [X] **T010 [US1] Implementar UI de cadastro de sugestao e estado vazio em src/views/AddMealView.tsx**
  Objetivo: permitir criar sugestoes, exibir lista e feedback de validacao/erro.
  Arquivos afetados: src/views/AddMealView.tsx, src/components/common/Button.tsx, src/components/common/Input.tsx
  Criterios de aceite: usuario autenticado cadastra sugestao; visitante ve CTA de conversao.
  Riscos: conflito visual com bloco atual de Alimentos Rapidos.
  Dependencias: T006, T009.

- [X] **T011 [US1] Integrar telemetria/log de eventos de cadastro e falha**
  Objetivo: registrar sucesso/falha de create suggestion para diagnostico.
  Arquivos afetados: src/hooks/useAddMealForm.ts, src/services/firebaseService.ts
  Criterios de aceite: logs incluem codigo funcional e contexto minimo util.
  Riscos: log redundante em erros esperados de validacao.
  Dependencias: T003, T009.

**Checkpoint**: US1 funcional e testavel isoladamente.

---

## Phase 4: User Story 2 - Usar sugestao para adicionar consumo (Priority: P2)

**Goal**: selecionar sugestao e obrigar passo extra de quantidade antes de confirmar registro.

**Independent Test**: escolher sugestao, informar quantidade valida, salvar refeicao com proteina calculada.

### Tests for User Story 2

- [X] **T012 [P] [US2] Criar testes unitarios de calculo por quantidade em tests/unit/meal-suggestion-flow.spec.ts**
  Objetivo: validar derivacao de proteina final por multiplicador.
  Arquivos afetados: tests/unit/meal-suggestion-flow.spec.ts, src/hooks/useAddMealForm.ts
  Criterios de aceite: quantidade > 0 aplica multiplicacao corretamente.
  Riscos: divergencia de arredondamento em valores decimais.
  Dependencias: T009.

- [X] **T013 [P] [US2] Criar teste de integracao do passo de quantidade em tests/integration/suggestions-consume.spec.ts**
  Objetivo: garantir que o registro nao salva sem quantidade valida.
  Arquivos afetados: tests/integration/suggestions-consume.spec.ts, src/views/AddMealView.tsx
  Criterios de aceite: bloqueia confirmacao sem quantidade e salva com quantidade valida.
  Riscos: testes flakey por interacao de UI.
  Dependencias: T010.

### Implementation for User Story 2

- [X] **T014 [US2] Implementar estado de selecao de sugestao e etapa de quantidade em src/hooks/useAddMealForm.ts**
  Objetivo: separar fluxo de selecao e confirmacao com validacao de quantityMultiplier.
  Arquivos afetados: src/hooks/useAddMealForm.ts
  Criterios de aceite: selecao de sugestao nao salva automaticamente; quantidade obrigatoria.
  Riscos: regressao no salvar refeicao manual.
  Dependencias: T009.

- [X] **T015 [US2] Atualizar UI para etapa obrigatoria de quantidade em src/views/AddMealView.tsx**
  Objetivo: inserir passo extra claro para quantidade antes do salvar.
  Arquivos afetados: src/views/AddMealView.tsx, src/components/common/Input.tsx, src/components/common/Button.tsx
  Criterios de aceite: etapa visivel e intuitiva; erro exibido para quantidade invalida.
  Riscos: aumento de friccao no fluxo se UX nao for clara.
  Dependencias: T014.

- [X] **T016 [US2] Refletir sugestao usada em listagens relevantes**
  Objetivo: expor referencia de origem da refeicao nas views de dashboard/historico quando aplicavel.
  Arquivos afetados: src/views/DashboardView.tsx, src/views/HistoryView.tsx, src/hooks/useMeals.ts
  Criterios de aceite: refeicoes criadas por sugestao podem ser identificadas sem quebrar layout.
  Riscos: ruido visual no historico.
  Dependencias: T006, T014.

**Checkpoint**: US2 funcional e testavel isoladamente.

---

## Phase 5: User Story 3 - Gerenciar sugestoes cadastradas (Priority: P3)

**Goal**: editar e excluir sugestoes com confirmacao e feedback.

**Independent Test**: editar nome/proteina, validar regra de duplicidade e excluir com confirmacao.

### Tests for User Story 3

- [X] **T017 [P] [US3] Criar teste unitario de regra de update com deduplicacao em tests/unit/suggestions-update.spec.ts**
  Objetivo: validar que update reaplica deduplicacao normalizada.
  Arquivos afetados: tests/unit/suggestions-update.spec.ts, src/utils/suggestionEngine.ts
  Criterios de aceite: atualizacao para valor duplicado e rejeitada.
  Riscos: lacuna de casos de normalizacao em update.
  Dependencias: T002, T004.

- [X] **T018 [P] [US3] Criar teste de integracao para edicao/exclusao em tests/integration/suggestions-manage.spec.ts**
  Objetivo: cobrir fluxo completo de editar e remover sugestoes.
  Arquivos afetados: tests/integration/suggestions-manage.spec.ts, src/views/AddMealView.tsx
  Criterios de aceite: edicao persiste; exclusao remove item da lista imediatamente.
  Riscos: sincronizacao assicrona em listeners de lista.
  Dependencias: T010.

### Implementation for User Story 3

- [X] **T019 [US3] Implementar handlers de editar/excluir sugestao em src/hooks/useAddMealForm.ts**
  Objetivo: adicionar operacoes de update/delete com confirmacao e mapeamento de erro.
  Arquivos afetados: src/hooks/useAddMealForm.ts
  Criterios de aceite: operacoes concluem com feedback visual e rollback de loading.
  Riscos: colisao com logica de editar refeicao existente.
  Dependencias: T004, T009.

- [X] **T020 [US3] Implementar UI de gerenciamento (editar/excluir) em src/views/AddMealView.tsx**
  Objetivo: oferecer controles de edicao/exclusao de sugestoes e confirmacao de delete.
  Arquivos afetados: src/views/AddMealView.tsx, src/components/common/Button.tsx
  Criterios de aceite: acoes disponiveis por item; exclusao exige confirmacao.
  Riscos: densidade de interacoes na tela.
  Dependencias: T019.

- [X] **T021 [US3] Ajustar visualizacao complementar em dashboard/historico para consistencia de estado vazio**
  Objetivo: manter mensagens e CTA coerentes quando nao houver sugestoes ou quando usuario for visitante.
  Arquivos afetados: src/views/DashboardView.tsx, src/views/HistoryView.tsx
  Criterios de aceite: estados vazios claros e sem conflito com fluxo atual.
  Riscos: inconsistencias de texto entre telas.
  Dependencias: T020.

**Checkpoint**: US3 funcional e testavel isoladamente.

---

## Phase 6: Polish & Cross-Cutting

**Purpose**: reduzir risco de regressao e validar pronto para entrega

- [X] **T022 [P] [US1] Revisar consistencia de mensagens de erro/CTA de conversao**
  Objetivo: padronizar comunicacao de validacao, autenticacao e persistencia.
  Arquivos afetados: src/views/AddMealView.tsx, src/hooks/useAddMealForm.ts, src/hooks/useAuth.ts
  Criterios de aceite: linguagem consistente e acionavel.
  Riscos: micro-regressoes de UX em cenarios de erro.
  Dependencias: T011, T015, T020.

- [X] **T023 [P] [US2] Executar validacao tecnica e de regressao**
  Objetivo: rodar verificacoes e confirmar que fluxo atual de refeicoes nao regrediu.
  Arquivos afetados: specs/006-sugestoes-consumo/quickstart.md
  Criterios de aceite: npm run lint e npm run build sem erro; cenarios do quickstart validados.
  Riscos: ausencia de suite automatizada pode deixar gap de cobertura.
  Dependencias: T021.

- [X] **T024 [US3] Registrar conclusao e evidencias da feature**
  Objetivo: consolidar resultados da implementacao para handoff.
  Arquivos afetados: specs/006-sugestoes-consumo/tasks.md
  Criterios de aceite: tarefas marcadas, evidencias de teste e riscos residuais anotados.
  Riscos: falta de rastreabilidade para revisao posterior.
  Dependencias: T023.

- [X] **T025 [P] Habilitar persistência offline e cache local multiplas abas em src/services/firebaseService.ts**
  Objetivo: garantir reatividade e acesso offline de dados e sugestões.
  Arquivos afetados: src/services/firebaseService.ts
  Criterios de aceite: initializeFirestore com persistentLocalCache e persistentMultipleTabManager configurados.
  Riscos: incompatibilidade em navegadores antigos (fallback automático de memória resolve).
  Dependencias: nenhuma.

- [X] **T026 [P] [US2] Implementar tratamento resiliente de timestamps pendentes em MealCard, DashboardView e HistoryView**
  Objetivo: evitar RangeError de Invalid Date em atualizações otimistas locais do Firestore.
  Arquivos afetados: src/components/common/MealCard.tsx, src/views/DashboardView.tsx, src/views/HistoryView.tsx
  Criterios de aceite: queda suave (fallback para a data atual) quando o timestamp for nulo ou inválido temporariamente; sem falhas na renderização.
  Riscos: exibição de horário incorreto nos segundos iniciais antes de sincronizar.
  Dependencias: nenhuma.

- [X] **T027 [P] Definir regras de validação estritas para a subcoleção de sugestões no firestore.rules**
  Objetivo: validar permissões (isOwner) e tipos/esquemas de dados no lado do servidor.
  Arquivos afetados: firestore.rules
  Criterios de aceite: nova função isValidSuggestion checando todos os campos obrigatórios e tipos; match /suggestions/{suggestionId} aninhado corretamente.
  Riscos: rejeição de operações legítimas por divergência de tipo.
  Dependencias: nenhuma.

- [X] **T028 [US3] Consolidar relatório final de tarefas adicionadas e modificadas**
  Objetivo: registrar as melhorias de segurança e estabilidade offline.
  Arquivos afetados: specs/006-sugestoes-consumo/tasks.md
  Criterios de aceite: todas as novas tarefas de regras, persistência e timestamp marcadas como concluídas.
  Riscos: nenhum.
  Dependencias: T025, T026, T027.

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): inicio imediato
- Foundational (Phase 2): depende de Phase 1
- US1 (Phase 3): depende de Phase 2
- US2 (Phase 4): depende de US1 base concluida (T009/T010)
- US3 (Phase 5): depende da base de US1 e persistencia pronta
- Polish (Phase 6): depende das historias alvo completas

### Ordered Path (Lower Risk -> Higher Impact)

1. T001 -> T002 -> T003
2. T004 -> T005 -> T006
3. T007/T008 em paralelo -> T009 -> T010 -> T011
4. T012/T013 em paralelo -> T014 -> T015 -> T016
5. T017/T018 em paralelo -> T019 -> T020 -> T021
6. T022/T023 em paralelo -> T024
7. T025/T026/T027 em paralelo -> T028

### Parallel Opportunities

- T001, T002 e T003 podem iniciar em paralelo parcial
- T007 com T008
- T012 com T013
- T017 com T018
- T022 com T023
- T025, T026 e T027 podem rodar em paralelo

---

## Implementation Strategy

### MVP First

1. Concluir Phase 1 e Phase 2
2. Concluir US1 (T007-T011)
3. Validar cenarios de cadastro, duplicidade e visitante
4. Disponibilizar MVP da feature

### Incremental Delivery

1. Entregar US1
2. Acrescentar US2 sem regressao
3. Acrescentar US3 com gestao completa
4. Consolidar Polish e evidencias

### Team Parallel Strategy

1. Dev A: dominio/persistencia (T001-T006)
2. Dev B: UI/fluxo US1-US2 (T010, T015, T016)
3. Dev C: testes e regressao (T007, T008, T012, T013, T017, T018, T023)

## Verification & Evidences

All implementation tasks have been completed and verified successfully.
- **Unit Tests**: 13 unit tests passed (`tests/unit/suggestionEngine.spec.ts`, `tests/unit/meal-suggestion-flow.spec.ts`, `tests/unit/suggestions-update.spec.ts`).
- **Integration Tests**: 12 integration tests passed (`tests/integration/suggestions-create.spec.ts`, `tests/integration/suggestions-consume.spec.ts`, `tests/integration/suggestions-manage.spec.ts`).
- **Total Test Success**: 25 out of 25 tests passing successfully.
- **Production Build**: Verified with `npm run lint` and `npm run build` compiling flawlessly.
