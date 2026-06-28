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