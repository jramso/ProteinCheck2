# Data Model: Sugestoes de Consumo

## Entities

### SugestaoConsumo
- id: string
- userId: string
- name: string
- nameNormalized: string
- proteinPerPortion: number
- createdAt: timestamp
- updatedAt: timestamp

Validation Rules:
- name obrigatorio, sem apenas espacos
- proteinPerPortion > 0
- unicidade por (userId, nameNormalized, proteinPerPortion)

State Transitions:
- created -> updated -> deleted

### RegistroConsumo
- id: string
- userId: string
- name: string
- protein: number
- quantityMultiplier: number
- suggestionId: string | null
- timestamp: timestamp

Validation Rules:
- quantityMultiplier > 0
- protein final > 0

Derivation:
- protein final = proteinPerPortion * quantityMultiplier

### Usuario
- uid: string
- modo: autenticado | visitante

Authorization Rules:
- somente autenticado pode persistir SugestaoConsumo
- visitante pode registrar refeicao, mas nao salvar sugestoes

## Relationships
- Usuario 1:N SugestaoConsumo
- Usuario 1:N RegistroConsumo
- SugestaoConsumo 1:N RegistroConsumo (referencia opcional)

## Authorization & Security Rules (Firestore)
- **Path**: `users/{userId}/suggestions/{suggestionId}`
- **Operations & Validation**:
  - `read`/`delete`: Permitido se `isOwner(userId)` (usuário logado é dono dos dados).
  - `create`/`update`: Permitido se `isOwner(userId)` e a payload passar na validação `isValidSuggestion(request.resource.data)` no servidor, que checa:
    - Campos obrigatórios presentes: `name`, `proteinPerPortion`, `createdAt`, `updatedAt`, `nameNormalized`, `userId`.
    - Tipos de dados corretos: strings para nomes, número positivo para proteína, timestamps para datas.
    - O campo `userId` do payload deve bater com a credencial autenticada do usuário.