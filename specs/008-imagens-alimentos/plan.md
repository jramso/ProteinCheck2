# Implementation Plan: Imagens Gastronômicas com Pexels API

**Branch**: `008-imagens-alimentos` | **Date**: 2026-07-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-imagens-alimentos/spec.md`

## Summary

Implementar busca automática e exibição de fotos gastronômicas realistas para refeições integrando o aplicativo com a API do Pexels. Para proteger a chave de API e garantir a segurança, as chamadas do cliente serão feitas a uma rota proxy do backend Express (`/api/images/search`), que por sua vez consultará a API do Pexels usando a credencial armazenada nas variáveis de ambiente (`.env`). No sucesso, o card da refeição exibirá a foto culinária e a URL será persistida no campo `imageUrl` no Firestore para carregamentos reativos offline. Se a API estiver indisponível ou retornar zero resultados, um fallback culinário estático agradável será exibido.

## Technical Context

**Language/Version**: TypeScript 5.8+, React 19, Node.js 22+

**Primary Dependencies**: React, Vite, Axios, Express, Firebase SDK, Lucide React

**Storage**: Firestore (campo `imageUrl: string` na subcoleção `meals` do usuário)

**Testing**: Type check via `npm run lint` e validação funcional de busca, proxy de segurança e fallbacks locais

**Target Platform**: Web (SPA React + Node.js Express server)

**Project Type**: Web Application (Vite Frontend + Express Backend proxy)

**Performance Goals**: Tempo de busca e carregamento da foto do Pexels na UI em <1.5s; exibição de fallback estático imediato (<100ms) sob falhas de rede ou cota excedida.

**Constraints**: Proteger a chave da API do Pexels no servidor (sem exposição no cliente); tratar erros de rate limit (429) graciosamente; garantir compatibilidade offline reutilizando URLs de imagem gravadas.

**Scale/Scope**: Limitado a buscas de imagens correspondentes ao nome de refeições e cadastros de novos alimentos no formulário.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Documentação-Primeiro**: PASSOU. Spec validada e aprovada pelo usuário.
- **II. Gestão de Tarefas Ágil**: PASSOU. Tarefas do `tasks.md` subsequente serão estruturadas e priorizadas.
- **III. Tipagem TypeScript Estrita**: PASSOU. Modelagem de payloads e retornos do Pexels sem o uso de `any`.
- **IV. Componentização e Padrões React 19**: PASSOU. Exibição da imagem encapsulada em componentes reutilizáveis (`MealCard`) com carregamento seguro.
- **V. Validação e Qualidade de Código**: PASSOU. Fallbacks estáticos reduzem risco de tela quebrada, mantendo reatividade e isolamento.

## Project Structure

### Documentation (this feature)

```text
specs/008-imagens-alimentos/
├── spec.md              # Feature Specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec checklist
├── contracts/
│   └── pexels.md        # Proxy API contract
└── tasks.md             # Phase 2 output (created by tasks command)
```

### Source Code (repository root)

```text
src/
├── models/
│   └── types.ts          # Definições de tipos do Pexels e Meal
├── services/
│   └── pexelsService.ts  # Consumo do proxy API local pelo frontend
├── hooks/
│   └── useAddMealForm.ts # Busca de imagem ao cadastrar/selecionar
├── views/
│   ├── AddMealView.tsx   # Exibição de imagem prévia no formulário
│   └── DashboardView.tsx
├── components/
│   └── common/
│       └── MealCard.tsx  # Renderização do card com a foto culinária
└── server.ts             # Implementação da rota proxy /api/images/search
```

**Structure Decision**: A integração envolve o backend Express (`server.ts`) para atuar como proxy seguro e expor a rota `/api/images/search`, protegendo a credencial do Pexels. O frontend (`src/services/pexelsService.ts`) chamará essa rota proxy local, mantendo a arquitetura limpa e em conformidade com as diretrizes de segurança da especificação.

## Complexity Tracking

Nenhuma violação de constituição identificada. Nenhuma complexidade excepcional precisa ser justificada.
