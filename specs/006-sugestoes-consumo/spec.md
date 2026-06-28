# Feature Specification: Sugestoes de Consumo

**Feature Branch**: `006-sugestoes-consumo`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "Como usuario, quero cadastrar meus alimentos frequentes como sugestoes de consumo para agilizar meu dia."

## Clarifications

### Session 2026-06-28

- Q: Como definir duplicidade de sugestao de consumo? → A: Duplicidade normalizada: ignora maiusculas/minusculas, acentos e espacos extras; proteina deve ser igual.
- Q: Ao usar sugestao para registrar consumo, como deve ser o fluxo? → A: Sempre perguntar quantidade em um passo extra antes de salvar.
- Q: Como tratar persistencia de sugestoes no modo visitante? → A: Visitante deve converter para conta para salvar sugestoes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastrar sugestao frequente (Priority: P1)

Como usuario, quero salvar um alimento frequente como sugestao de consumo para adicionar esse item com rapidez no meu fluxo diario.

**Why this priority**: O valor principal da feature e reduzir tempo de registro de refeicoes recorrentes.

**Independent Test**: Pode ser testado de forma independente ao cadastrar uma sugestao e confirmar que ela fica disponivel para uso posterior.

**Acceptance Scenarios**:

1. **Given** que estou na tela de sugestoes, **When** cadastro um alimento com nome e proteina por porcao, **Then** a sugestao e salva e aparece na lista.
2. **Given** que o alimento ja existe como sugestao, **When** tento cadastrar o mesmo item com os mesmos dados, **Then** o sistema informa duplicidade e nao cria um novo registro.
3. **Given** que estou em modo visitante, **When** tento salvar uma sugestao, **Then** o sistema exige conversao para conta antes de persistir.

---

### User Story 2 - Usar sugestao para adicionar consumo (Priority: P2)

Como usuario, quero selecionar uma sugestao cadastrada para registrar consumo rapidamente sem preencher todos os dados novamente.

**Why this priority**: A reutilizacao das sugestoes concretiza o ganho de agilidade prometido pela funcionalidade.

**Independent Test**: Pode ser testado escolhendo uma sugestao existente e registrando um consumo a partir dela em poucos toques.

**Acceptance Scenarios**:

1. **Given** que tenho sugestoes salvas, **When** seleciono uma sugestao para consumo, **Then** o registro e criado com os dados da sugestao.
2. **Given** que nao tenho sugestoes salvas, **When** acesso a lista de sugestoes, **Then** vejo um estado vazio com orientacao para criar a primeira sugestao (ou converter conta, se estiver em modo visitante).

---

### User Story 3 - Gerenciar sugestoes cadastradas (Priority: P3)

Como usuario, quero editar ou remover sugestoes para manter minha lista atualizada com meus habitos atuais.

**Why this priority**: Mantem a qualidade da base de sugestoes e evita informacoes desatualizadas.

**Independent Test**: Pode ser testado editando uma sugestao e removendo outra, validando o reflexo imediato na lista.

**Acceptance Scenarios**:

1. **Given** uma sugestao existente, **When** altero seus dados e salvo, **Then** a lista exibe os dados atualizados.
2. **Given** uma sugestao existente, **When** confirmo a exclusao, **Then** ela deixa de aparecer na lista e nao pode mais ser usada.

---

### Edge Cases

- Cadastro com valor de proteina igual a zero ou negativo deve ser rejeitado com mensagem clara.
- Nome de alimento vazio ou composto apenas por espacos deve ser rejeitado.
- Tentativa de uso de sugestao removida em outra sessao deve falhar com orientacao para atualizar a lista.
- Em falha temporaria de persistencia, o sistema deve informar erro e permitir nova tentativa sem perder os dados digitados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST permitir que o usuario cadastre uma sugestao de consumo com nome do alimento e valor de proteina por porcao.
- **FR-002**: System MUST validar que nome e obrigatorio e que o valor de proteina e maior que zero.
- **FR-003**: System MUST impedir cadastro duplicado da mesma sugestao para o mesmo usuario comparando nome normalizado (sem diferenca de maiusculas/minusculas, acentos e espacos extras) e valor de proteina igual.
- **FR-004**: System MUST listar todas as sugestoes de consumo cadastradas pelo usuario.
- **FR-005**: Users MUST be able to selecionar uma sugestao para iniciar um registro de consumo e informar a quantidade em um passo extra antes da confirmacao.
- **FR-006**: System MUST permitir edicao de uma sugestao existente.
- **FR-007**: System MUST permitir exclusao de uma sugestao existente com confirmacao explicita.
- **FR-008**: System MUST exibir estado vazio quando nao houver sugestoes cadastradas.
- **FR-009**: System MUST exibir mensagens de erro claras para falhas de validacao e falhas de persistencia.
- **FR-010**: System MUST manter as sugestoes separadas por usuario, sem vazamento de dados entre contas.
- **FR-011**: System MUST exigir conversao para conta autenticada antes de permitir persistencia de sugestoes no modo visitante.

### Key Entities *(include if feature involves data)*

- **SugestaoConsumo**: representa um atalho de alimento frequente com atributos de identificador, nome do alimento, proteina por porcao, data de criacao e data de atualizacao.
- **RegistroConsumo**: representa um consumo efetivo gerado a partir de uma sugestao ou de entrada manual, contendo alimento, proteina registrada e referencia opcional a sugestao de origem.
- **Usuario**: representa o titular da lista de sugestoes, determinando ownership e isolamento dos dados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 90% dos usuarios conseguem cadastrar a primeira sugestao em ate 60 segundos.
- **SC-002**: Pelo menos 85% dos registros feitos a partir de sugestoes sao concluidos em ate 10 segundos.
- **SC-003**: Taxa de erro de validacao apos envio de formulario fica abaixo de 5% por semana.
- **SC-004**: Em pesquisa interna, ao menos 80% dos usuarios afirmam que o fluxo de registro diario ficou mais rapido com as sugestoes.

## Assumptions

- Usuarios ja possuem fluxo de registro de consumo ativo no sistema.
- Usuarios em modo visitante podem visualizar o fluxo, mas precisam converter para conta para salvar sugestoes de consumo.
- O valor de proteina informado pelo usuario e considerado confiavel para o objetivo da feature.
- O escopo desta iteracao cobre cadastro, uso e gerenciamento basico de sugestoes, sem recomendacao automatica inteligente.