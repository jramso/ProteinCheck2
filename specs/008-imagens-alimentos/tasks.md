# Tasks: Imagens Gastronômicas com Pexels API

**Input**: Design documents from `/specs/008-imagens-alimentos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/pexels.md

**Tests**: Testes são manuais e focados em validação funcional dos endpoints do proxy, fallbacks e renderização de cards, documentados em quickstart.md.

**Organization**: Tarefas agrupadas em fases lógicas e histórias de usuário por prioridade para possibilitar entregas incrementais.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (sem dependência direta de outras tarefas não concluídas)
- **[Story]**: US1, US2, US3 (mapeado para as histórias de usuário correspondentes)
- Caminhos exatos de arquivos incluídos nas tarefas.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configuração de credenciais de ambiente e tokens de API com segurança.

- [X] T001 Adicionar chave de API PEXELS_API_KEY no arquivo .env e documentar no arquivo .env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Serviços centrais de proxy no backend, tipos estritos e cliente de consumo no frontend.

- [X] T002 Implementar a rota proxy GET /api/images/search no backend em server.ts para buscar fotos de comida de forma segura via Pexels API
- [X] T003 [P] Atualizar a tipagem de domínio do Meal e PexelsImageSearchResult em src/models/types.ts para tipar o campo imageUrl
- [X] T004 [P] Criar o serviço cliente de consulta e cache de sessão em memória em src/services/pexelsService.ts

**Checkpoint**: Camada de persistência proxy e tipos definidos. O desenvolvimento das histórias pode começar.

---

## Phase 3: User Story 1 - Exibição de Imagem Gastronômica Baseada no Alimento (Priority: P1) 🎯 MVP

**Goal**: Exibir dinamicamente imagens de comida nas telas do formulário e no dashboard principal.

**Independent Test**: Digitar um alimento (ex: ovo) e ver a prévia gastronômica do Pexels carregada no formulário de cadastro e no card após salvar na sessão ativa.

### Implementation for User Story 1

- [X] T005 [US1] Integrar o gatilho de busca do Pexels com debounce de digitação em src/hooks/useAddMealForm.ts
- [X] T006 [US1] Adicionar contêiner de prévia de imagem gastronômica da refeição em src/views/AddMealView.tsx
- [X] T007 [US1] Ajustar o componente de card para renderizar a imagem gastronômica a partir de imageUrl em src/components/common/MealCard.tsx

**Checkpoint**: US1 funcional e testável independentemente na sessão atual.

---

## Phase 4: User Story 2 - Persistência das URLs de Imagens Gastronômicas (Priority: P2)

**Goal**: Gravar as URLs do Pexels no Firestore e carregá-las de forma otimizada sem novas buscas redundantes.

**Independent Test**: Salvar refeição com foto, atualizar página e verificar se o card no histórico carrega a mesma URL Pexels a partir do Firestore.

### Implementation for User Story 2

- [X] T008 [US2] Modificar ações de gravação e edição de refeições para persistir o campo imageUrl no Firestore em src/hooks/useAddMealForm.ts
- [X] T009 [US2] Garantir o carregamento reativo do campo imageUrl do Firestore em src/hooks/useMeals.ts

**Checkpoint**: US1 e US2 integradas. URLs persistidas no Firestore com carregamento offline reativo.

---

## Phase 5: User Story 3 - Tratamento de Erros e Fallback de Imagens de Comida (Priority: P3)

**Goal**: Garantir a resiliência visual exibindo fallbacks culinários estáticos sob limites de cotas ou offline.

**Independent Test**: Simular erro 429 da API ou desconectar rede e validar se o sistema seleciona imagens de fallbacks de comida de forma imediata.

### Implementation for User Story 3

- [X] T010 [P] [US3] Criar utilitário de mapeamento de palavras-chave gastronômicas para fallbacks estáticos em src/utils/imageFallbacks.ts
- [X] T011 [US3] Integrar resolvedor de fallbacks nas falhas da API no frontend em src/services/pexelsService.ts e no proxy do backend em server.ts

**Checkpoint**: Todas as histórias de usuário funcionais, com persistência offline e segurança ativa.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Revisões finais de performance e consistência estática.

- [X] T012 [P] Otimizar largura e qualidade da imagem requisitada no Pexels para telas móveis/web em src/views/AddMealView.tsx e src/components/common/MealCard.tsx
- [X] T013 Rodar verificações de regressão completas usando o guia em specs/008-imagens-alimentos/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Início imediato sem bloqueios.
- **Phase 2 (Foundational)**: Bloqueia todas as histórias (US1, US2, US3).
- **Phase 3 (US1)**: Depende da Phase 2 concluída.
- **Phase 4 (US2)**: Depende de US1 concluída.
- **Phase 5 (US3)**: Depende de US1 e US2 concluídas para proteção de falhas do fluxo ponta a ponta.
- **Phase 6 (Polish)**: Depende de todas as histórias concluídas.

### Ordered Path (Lower Risk -> Higher Impact)
1. T001
2. T002 -> T003/T004 em paralelo
3. T005 -> T006 -> T007 (US1 concluída)
4. T008 -> T009 (US2 concluída)
5. T010 -> T011 (US3 concluída)
6. T012/T013 em paralelo

---

## Parallel Opportunities
- T003 e T004 podem ser implementadas simultaneamente.
- T010 (criação do dicionário de fallbacks) pode iniciar em paralelo a outras tarefas da US2.
- Otimização visual (T012) e validação manual (T013) podem rodar de forma isolada ao final.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Rodar Phase 1 e Phase 2.
2. Implementar e validar a busca e prévia dinâmica no formulário (US1).
3. Testar a renderização visual do card no dashboard local.

### Incremental Delivery
1. Entregar MVP (US1).
2. Estender para persistência das URLs em banco de dados (US2) evitando chamadas repetidas.
3. Adicionar resiliência visual sob falha de cota e offline com mapeamento de fallbacks gastronômicos (US3).
4. Rodar testes de fumaça de regressão e polir largura de renderização de imagens (Polish).
