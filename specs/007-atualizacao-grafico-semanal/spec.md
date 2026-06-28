# Feature Specification: Atualizações de Gráfico Semanal

**Feature Branch**: `007-atualizacoes-grafico-semanal`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "Como usuário, quero que o gráfico semanal seja atualizado automaticamente sempre que eu registrar, editar ou remover um consumo para acompanhar minha evolução em tempo real."

## Clarifications

### Session 2026-06-28

* Q: Quais ações devem atualizar o gráfico? → A: Cadastro, edição e exclusão de registros de consumo.
* Q: O gráfico deve representar qual período? → A: Apenas a semana correspondente à visualização atual.
* Q: O que acontece quando não existem registros na semana? → A: O sistema exibe um estado vazio com uma mensagem informativa.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Atualizar gráfico após novo consumo (Priority: P1)

Como usuário, quero que o gráfico semanal seja atualizado automaticamente após registrar um novo consumo para visualizar imediatamente meu progresso.

**Why this priority**: O principal objetivo da funcionalidade é garantir que os dados apresentados estejam sempre atualizados após um registro.

**Independent Test**: Pode ser testado registrando um novo consumo e verificando que o gráfico é atualizado sem necessidade de recarregar a página.

**Acceptance Scenarios**:

1. **Given** que estou visualizando o gráfico da semana atual, **When** registro um novo consumo, **Then** o gráfico reflete imediatamente o novo valor.
2. **Given** que o novo consumo pertence a outra semana, **When** o registro é salvo, **Then** o gráfico atualmente exibido permanece inalterado.

---

### User Story 2 - Atualizar gráfico após edição de consumo (Priority: P2)

Como usuário, quero que alterações em um registro existente sejam refletidas automaticamente no gráfico para manter as informações corretas.

**Why this priority**: Alterações frequentes nos registros não devem gerar inconsistências entre os dados cadastrados e os apresentados.

**Independent Test**: Pode ser testado editando um registro existente e verificando que os valores do gráfico são recalculados corretamente.

**Acceptance Scenarios**:

1. **Given** um consumo pertencente à semana atual, **When** altero sua quantidade ou valor registrado, **Then** o gráfico apresenta imediatamente os novos valores.
2. **Given** um consumo pertencente a outra semana, **When** ele é editado, **Then** o gráfico da semana atual não sofre alterações.

---

### User Story 3 - Atualizar gráfico após exclusão de consumo (Priority: P3)

Como usuário, quero que o gráfico seja atualizado automaticamente quando excluir um consumo para que apenas os registros existentes sejam considerados.

**Why this priority**: Mantém a consistência entre os dados cadastrados e a visualização do progresso semanal.

**Independent Test**: Pode ser testado removendo um registro da semana atual e verificando que o gráfico deixa de considerar esse consumo.

**Acceptance Scenarios**:

1. **Given** um registro pertencente à semana atual, **When** confirmo sua exclusão, **Then** o gráfico é atualizado removendo sua contribuição.
2. **Given** que o registro removido era o último da semana, **When** a exclusão é concluída, **Then** o sistema apresenta um estado indicando ausência de dados para o período.

---

### Edge Cases

* Registro criado para uma semana diferente da atualmente exibida.
* Exclusão do único consumo existente na semana.
* Semana sem qualquer registro de consumo.
* Alterações consecutivas em curto intervalo de tempo.
* Falha temporária na atualização dos dados após uma operação de consumo.

## Requirements *(mandatory)*

### Functional Requirements

* **FR-001**: System MUST atualizar automaticamente o gráfico semanal após o cadastro de um novo registro de consumo pertencente à semana exibida.
* **FR-002**: System MUST atualizar automaticamente o gráfico semanal após a edição de um registro pertencente à semana exibida.
* **FR-003**: System MUST atualizar automaticamente o gráfico semanal após a exclusão de um registro pertencente à semana exibida.
* **FR-004**: System MUST considerar apenas os registros pertencentes ao período semanal selecionado.
* **FR-005**: System MUST manter os dados históricos de outras semanas inalterados durante as atualizações.
* **FR-006**: System MUST exibir um estado vazio quando não existirem registros para a semana selecionada.
* **FR-007**: System MUST apresentar mensagens claras caso ocorra falha na atualização dos dados do gráfico.
* **FR-008**: System MUST manter consistência entre os valores apresentados no gráfico e os registros de consumo armazenados.

### Key Entities *(include if feature involves data)*

* **RegistroConsumo**: representa um consumo registrado pelo usuário contendo alimento, quantidade, proteína consumida, data e horário do registro.
* **GraficoSemanal**: representa a visualização consolidada dos registros pertencentes a uma semana específica.
* **Usuario**: representa o proprietário dos registros de consumo utilizados para compor o gráfico semanal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

* **SC-001**: 100% dos registros adicionados, editados ou removidos da semana atual são refletidos corretamente no gráfico após a operação.
* **SC-002**: Pelo menos 95% dos usuários conseguem visualizar a atualização do gráfico sem realizar atualização manual da página.
* **SC-003**: Não existem divergências entre os valores apresentados no gráfico e os registros armazenados para a mesma semana.
* **SC-004**: Em pesquisas de usabilidade, pelo menos 85% dos usuários consideram que o acompanhamento semanal ficou mais confiável após a atualização automática.

## Assumptions

* O usuário já possui funcionalidade de registro de consumo disponível.
* Cada registro de consumo está associado a uma data válida.
* O gráfico semanal representa exclusivamente os registros pertencentes ao período semanal selecionado.
* Esta funcionalidade altera apenas o comportamento de atualização dos dados do gráfico, sem modificar seu layout ou suas métricas.
