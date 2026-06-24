# Feature Specification: Protein Macro Dashboard

**Feature Branch**: `003-protein-macro-dashboard`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "O projeto é um aplicativo para gerenciamento de macros onde o foco é o macro de Proteina como principal, a ideia é inserir alimentos e ele calcular e exibir um dashboard de meta diária se ele atingiu ou não a meta diaria de acordo com o plano de manutenção de peso, ganho de massa leve e ganho de massa de alto desempenho, futuramente um plano de emagrecimento também, o projeto ja está parcialmente implementado"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Goal Configuration & Dashboard (Priority: P1)

As a user, I want to set my nutritional objective (Maintenance, Lean Gain, or Performance) so that I can see a customized protein goal on my dashboard.

**Why this priority**: Core functionality of the app. Without a goal, the dashboard has no context.

**Independent Test**: Configure a "Lean Gain" goal and verify the dashboard displays the correct calculated target.

**Acceptance Scenarios**:

1. **Given** a user weight of 70kg and "Maintenance" plan, **When** they view the dashboard, **Then** the protein goal should be 84g (1.2g/kg).
2. **Given** a user weight of 70kg and "High Performance" plan, **When** they view the dashboard, **Then** the protein goal should be 140g (2.0g/kg).

---

### User Story 2 - Food Entry & Progress Tracking (Priority: P1)

As a user, I want to log foods I've eaten so that I can track my progress towards my daily protein goal.

**Why this priority**: Essential for tracking progress.

**Independent Test**: Add 30g of protein and verify the progress bar/chart updates to show 30g consumed.

**Acceptance Scenarios**:

1. **Given** a current consumption of 0g, **When** a food with 25g protein is added, **Then** the dashboard shows 25g consumed and the remaining amount decreases accordingly.
2. **Given** the user is close to their goal, **When** they exceed the goal, **Then** the dashboard should clearly indicate that the goal was surpassed (e.g., color change or overflow indicator).

---

### User Story 3 - Switching Nutritional Plans (Priority: P2)

As a user, I want to change my current plan (e.g., from Lean Gain to Maintenance) so that my daily goals adjust to my new lifestyle or training phase.

**Why this priority**: Allows for long-term use and adaptation to training cycles.

**Independent Test**: Change plan and verify that existing food entries for the day are retained but measured against the new goal.

**Acceptance Scenarios**:

1. **Given** 50g of protein already logged, **When** the user switches from "Maintenance" to "High Performance", **Then** the "consumed" value remains 50g but the "remaining" value increases.

---

### Edge Cases

- **Zero or Negative Weight**: System should prevent or handle invalid body weight inputs for goal calculation.
- **Overlapping Days**: How does the system handle "late night" meals? (Default assumption: meals belong to the calendar day they are logged).
- **Incomplete Food Data**: Handling foods where protein data is missing from the search results.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to select from three plans: "Manutenção", "Ganho de Massa Leve", and "Ganho de Massa de Alto Desempenho".
- **FR-002**: System MUST calculate the daily protein goal based on the selected plan and user's body weight.
- **FR-003**: System MUST provide a "Food Entry" interface where users can search for foods or enter protein values manually.
- **FR-004**: System MUST display a real-time dashboard with: Total protein consumed, Daily goal, Remaining amount, and Progress percentage.
- **FR-005**: System MUST persist the selected plan and daily food logs (using Firestore/Local Storage as per project context).
- **FR-006**: System MUST use the following multipliers for protein calculation:
  - **Manutenção**: 1.2g per kg of body weight.
  - **Ganho de Massa Leve**: 1.6g per kg of body weight.
  - **Ganho de Massa de Alto Desempenho**: 2.0g per kg of body weight.

### Key Entities *(include if feature involves data)*

- **User Profile**: Stores weight and selected nutritional plan.
- **Meal Log**: Records the food item, time, and protein amount consumed.
- **Nutritional Plan**: Definition of the multiplier used for goal calculation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can log a food item in under 10 seconds from the dashboard.
- **SC-002**: Dashboard updates within 1 second of a food entry being saved.
- **SC-003**: Goal calculations match the defined nutritional formulas with 100% accuracy.
- **SC-004**: Users can switch plans and see updated dashboard metrics instantly.

## Assumptions

- **A-001**: "Emagrecimento" plan is out of scope for the current implementation (future phase).
- **A-002**: User weight is provided in Kilograms (KG).
- **A-003**: Daily goals reset at midnight (local time).
- **A-004**: The project will use the existing FatSecret integration for food searches where possible.
