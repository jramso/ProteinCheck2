# Contract: Suggestions Feature Boundaries

## Scope

Define os contratos funcionais entre UI, hooks e camada de persistência para o sistema de **Sugestões de Consumo** no ProteinCheck.

Este contrato garante consistência entre regras de negócio, validações e fluxo de uso da feature.

---

## Suggestion Operations

---

### Create Suggestion

**Input:**

```ts
{
  userId: string
  name: string
  proteinPerPortion: number
}
```

**Rules:**

* Usuário deve estar autenticado
* `name` é obrigatório e não pode conter apenas espaços
* `proteinPerPortion` deve ser > 0
* Bloquear duplicidade por:

  * `userId`
  * `nameNormalized`
  * `proteinPerPortion`

**Behavior:**

* `nameNormalized` deve ser derivado internamente (case-insensitive, sem acentos e sem espaços redundantes)
* A operação deve ser idempotente em caso de retry com os mesmos dados

**Output:**

```ts
{
  success: true
  id: string
}
```

ou

```ts
{
  success: false
  error: SuggestionError
}
```

---

### List Suggestions

**Input:**

```ts
{
  userId: string
}
```

**Rules:**

* Retornar apenas sugestões pertencentes ao `userId`
* Ordenar por `updatedAt DESC`

**Output:**

```ts
{
  success: true
  data: SugestaoConsumo[]
}
```

ou

```ts
{
  success: false
  error: SuggestionError
}
```

---

### Update Suggestion

**Input:**

```ts
{
  suggestionId: string
  userId: string
  name?: string
  proteinPerPortion?: number
}
```

**Rules:**

* Reaplicar todas as validações de Create Suggestion
* Revalidar regra de duplicidade ao alterar campos relevantes
* Usuário deve ser dono da sugestão
* Atualizar `updatedAt` automaticamente

**Behavior:**

* Atualização parcial permitida (patch semantics)
* Campos não enviados permanecem inalterados

**Output:**

```ts
{
  success: true
}
```

ou

```ts
{
  success: false
  error: SuggestionError
}
```

---

### Delete Suggestion

**Input:**

```ts
{
  suggestionId: string
  userId: string
}
```

**Rules:**

* Usuário deve ser dono da sugestão
* Sugestão deve existir

**Output:**

```ts
{
  success: true
}
```

ou

```ts
{
  success: false
  error: SuggestionError
}
```

---

## Consume from Suggestion

### Create Consumption from Suggestion

**Input:**

```ts
{
  suggestionId: string
  userId: string
  quantityMultiplier: number
}
```

**Rules:**

* `quantityMultiplier` deve ser > 0
* Sugestão deve existir e pertencer ao usuário
* Proteína final deve ser calculada como:

```
proteinFinal = proteinPerPortion * quantityMultiplier
```

**Output:**

```ts
{
  success: true
  registroConsumoId: string
}
```

---

## Error Contract

Todos os erros devem seguir um formato padronizado:

```ts
{
  success: false
  error: {
    code:
      | "AUTH_REQUIRED"
      | "VALIDATION_ERROR"
      | "DUPLICATE_SUGGESTION"
      | "NOT_FOUND"
      | "PERSISTENCE_ERROR"
      | "FORBIDDEN"
    message: string
    context?: Record<string, unknown>
  }
}
```

---

## Error Semantics

* **AUTH_REQUIRED** → usuário visitante tentou persistência
* **VALIDATION_ERROR** → campos inválidos ou ausentes
* **DUPLICATE_SUGGESTION** → conflito de nome normalizado + proteína
* **NOT_FOUND** → sugestão inexistente
* **FORBIDDEN** → usuário não é dono do recurso
* **PERSISTENCE_ERROR** → falha de banco ou rede

---

## Consistency Rules

* Todas as operações devem respeitar isolamento por `userId`
* Nenhuma sugestão pode ser acessada fora do escopo do usuário
* Normalização de nome deve ser consistente entre create e update
* Todas as respostas devem ser determinísticas para os mesmos inputs
