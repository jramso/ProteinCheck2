# Contract: Suggestions Feature Boundaries

## Scope
Define os contratos funcionais entre UI, hooks e camada de persistencia para sugestoes de consumo.

## Suggestion Operations

### Create Suggestion
Input:
- userId: string
- name: string
- proteinPerPortion: number

Rules:
- usuario deve estar autenticado
- name e obrigatorio
- proteinPerPortion > 0
- bloquear duplicidade por (nameNormalized, proteinPerPortion)

Output:
- success: true com id da sugestao criada
- ou erro de validacao/duplicidade/autenticacao

### List Suggestions
Input:
- userId: string

Output:
- lista de sugestoes ordenadas por updatedAt desc

### Update Suggestion
Input:
- suggestionId: string
- name?: string
- proteinPerPortion?: number

Rules:
- reaplicar validacoes de create
- reaplicar regra de duplicidade

Output:
- success: true ou erro de validacao/autorizacao

### Delete Suggestion
Input:
- suggestionId: string

Output:
- success: true ou erro de autorizacao

## Consume from Suggestion
Input:
- suggestionId: string
- quantityMultiplier: number

Rules:
- quantityMultiplier > 0
- calcular proteina final por multiplicacao

Output:
- cria RegistroConsumo com referencia opcional a suggestionId

## Error Contract
Erros devem retornar codigo funcional e mensagem amigavel:
- AUTH_REQUIRED
- VALIDATION_ERROR
- DUPLICATE_SUGGESTION
- NOT_FOUND
- PERSISTENCE_ERROR

## Firestore Security Rules Contract
Toda gravação direta na subcoleção `users/{userId}/suggestions/{suggestionId}` deve passar pelas regras de validação do banco:
- **CREATE/UPDATE**:
  - `request.auth.uid == userId`
  - `request.resource.data.name is string && request.resource.data.name.size() > 0 && request.resource.data.name.size() < 100`
  - `request.resource.data.nameNormalized is string && request.resource.data.nameNormalized.size() > 0 && request.resource.data.nameNormalized.size() < 100`
  - `request.resource.data.proteinPerPortion is number && request.resource.data.proteinPerPortion > 0`
  - `request.resource.data.userId == request.auth.uid`
  - `request.resource.data.createdAt is timestamp`
  - `request.resource.data.updatedAt is timestamp`
- **READ/DELETE**:
  - `request.auth.uid == userId`