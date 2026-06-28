# Research: Atualizações de Gráfico Semanal

## Decision 1: Gráfico como derivação reativa (sem estado persistido)

* **Decision**: O gráfico semanal será sempre derivado diretamente dos `RegistroConsumo`, sem armazenamento separado ou cache persistente.
* **Rationale**: Evita inconsistências entre dados persistidos e visualização, reduz complexidade de sincronização e elimina necessidade de invalidação manual de cache.
* **Alternatives considered**: Persistir `GraficoSemanal` como entidade separada (rejeitado por risco elevado de desatualização e duplicação de dados).

---

## Decision 2: Atualização baseada em reatividade do estado global

* **Decision**: A atualização do gráfico será disparada automaticamente por mudanças no estado global de `RegistroConsumo` (CRUD).
* **Rationale**: Aproveita o ciclo natural de re-render do React, garantindo atualização imediata sem lógica adicional de sincronização.
* **Alternatives considered**: Polling periódico de dados (rejeitado por ineficiência e atraso), refresh manual do usuário (rejeitado por má UX).

---

## Decision 3: Cálculo de gráfico via função pura

* **Decision**: Toda agregação semanal será feita por uma função pura (`weeklyAggregation`), sem efeitos colaterais.
* **Rationale**: Facilita testes, previsibilidade e evita divergências entre execuções.
* **Alternatives considered**: Cálculo dentro do componente de UI (rejeitado por acoplamento excessivo), cálculo em serviço com cache (rejeitado por risco de inconsistência).

---

## Decision 4: Escopo semanal baseado em data do registro

* **Decision**: A semana será derivada a partir do timestamp de cada `RegistroConsumo`, utilizando regra consistente de agrupamento por calendário.
* **Rationale**: Garante consistência entre visualização e armazenamento sem necessidade de metadados adicionais.
* **Alternatives considered**: Armazenar explicitamente `weekId` no registro (rejeitado por redundância e risco de dessincronização).

---

## Decision 5: Atualização imediata após operações CRUD

* **Decision**: O gráfico deve refletir imediatamente operações de criação, edição e exclusão de registros de consumo.
* **Rationale**: A feature depende de feedback visual em tempo real para reforçar confiabilidade do sistema.
* **Alternatives considered**: Atualização em lote (rejeitado por latência perceptível), atualização sob navegação de tela (rejeitado por inconsistência de UX).

---

## Decision 6: Não introduzir nova entidade persistida para gráfico

* **Decision**: `GraficoSemanal` será tratado apenas como entidade derivada (view model), não persistida no banco.
* **Rationale**: Evita duplicação de dados e reduz complexidade de sincronização entre backend e frontend.
* **Alternatives considered**: Persistência de snapshots semanais (rejeitado por aumento de complexidade e risco de inconsistência histórica).

---

## Decision 7: Reutilização do fluxo existente de consumo

* **Decision**: A atualização do gráfico será integrada diretamente ao fluxo existente de `RegistroConsumo`, sem criar pipeline separado.
* **Rationale**: Minimiza impacto no sistema atual e garante compatibilidade com funcionalidades já existentes.
* **Alternatives considered**: Criar pipeline separado de analytics (rejeitado por excesso de engenharia para o escopo da feature).
