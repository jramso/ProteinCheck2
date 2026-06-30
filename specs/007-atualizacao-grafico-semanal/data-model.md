## Entities

### RegistroConsumo

* id: string
* userId: string
* name: string
* protein: number
* quantityMultiplier: number
* timestamp: timestamp

Validation Rules:

* quantityMultiplier > 0
* protein > 0
* timestamp deve representar uma data válida

Derivation:

* Cada registro pertence a exatamente uma semana do calendário.
* Os registros são utilizados para compor o gráfico semanal correspondente ao seu período.

---

### GraficoSemanal

* userId: string
* weekStart: date
* weekEnd: date
* totalProtein: number
* totalConsumptions: number
* dailyValues: collection

Validation Rules:

* Deve representar apenas registros pertencentes ao intervalo semanal.
* Não deve incluir registros de outras semanas.
* Deve permanecer consistente com os registros de consumo existentes.

Derivation:

* totalProtein = soma da proteína de todos os RegistroConsumo da semana.
* totalConsumptions = quantidade de registros pertencentes à semana.
* dailyValues = agrupamento dos registros por dia da semana.

State Transitions:

* empty -> populated -> updated
* populated -> empty (quando o último registro da semana é removido)

---

### Usuario

* uid: string
* modo: autenticado | visitante

Authorization Rules:

* Usuários autenticados podem visualizar seu próprio gráfico semanal.
* Usuários visitantes podem visualizar apenas os dados gerados durante sua sessão.
* Um usuário pode visualizar apenas os registros pertencentes à sua própria conta.

## Relationships

* Usuario 1:N RegistroConsumo
* Usuario 1:N GraficoSemanal (visualização derivada)
* GraficoSemanal é derivado de N RegistroConsumo pertencentes ao mesmo usuário e ao mesmo período semanal.
