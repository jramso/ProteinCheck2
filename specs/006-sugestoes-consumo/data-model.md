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