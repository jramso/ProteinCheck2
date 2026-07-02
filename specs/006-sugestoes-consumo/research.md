# Research: Sugestoes de Consumo

## Decision 1: Reutilizar fluxo existente de refeicao com extensao por sugestoes
- Decision: Implementar sugestoes aproveitando hooks e views existentes de refeicao, sem criar novo modulo isolado.
- Rationale: Reduz risco de regressao, mantem consistencia UX e acelera entrega.
- Alternatives considered: Criar tela/fluxo independente para sugestoes (rejeitado por aumento de complexidade e retrabalho).

## Decision 2: Deduplicacao por nome normalizado + proteina igual
- Decision: Tratar duplicidade por normalizacao de nome (case-insensitive, sem acentos e sem espacos redundantes) e comparacao de proteina igual.
- Rationale: Evita cadastros duplicados acidentais e preserva diferencas relevantes de macros.
- Alternatives considered: Duplicidade exata de texto (rejeitado por baixa robustez), duplicidade apenas por nome (rejeitado por colisao indevida).

## Decision 3: Uso de sugestao com passo obrigatorio de quantidade
- Decision: Selecionar sugestao abre passo de quantidade antes de confirmar registro.
- Rationale: Mantem agilidade sem perder precisao para porcoes variaveis.
- Alternatives considered: Salvar instantaneamente (rejeitado por risco de erro), sempre abrir formulario completo (rejeitado por reduzir ganho de velocidade).

## Decision 4: Visitante sem persistencia de sugestoes
- Decision: No modo visitante, permitir visualizacao do fluxo, mas exigir conversao para conta autenticada para salvar sugestoes.
- Rationale: Mantem regra de ownership e evita ambiguidades de sincronizacao local/nuvem.
- Alternatives considered: Persistencia local para visitante (rejeitado por comportamento divergente da regra definida na clarificacao).

## Decision 5: Sem novas bibliotecas
- Decision: Implementar normalizacao e validacoes com recursos nativos de TypeScript/JavaScript.
- Rationale: Segue restricao de stack e reduz custo de manutencao.
- Alternatives considered: Introduzir biblioteca de normalizacao/validacao (rejeitado por necessidade baixa).

## Decision 6: Validação estrita no Firestore Rules para a subcoleção de sugestões
- Decision: Validar as escritas de sugestões no lado do servidor (Firestore Rules) exigindo que o usuário seja o dono (`isOwner`) e que todos os campos obrigatórios (`name`, `proteinPerPortion`, `createdAt`, `updatedAt`, `nameNormalized`, `userId`) existam e sejam do tipo correto através de uma função auxiliar `isValidSuggestion(data)` no servidor.
- Rationale: Garante integridade e segurança dos dados no banco de dados, alinhado com o princípio de "Confiança Zero" e em conformidade com o que já é feito para refeições (`isValidMeal`).
- Alternatives considered: Confiar apenas nas validações do cliente (rejeitado por vulnerabilidade de segurança).