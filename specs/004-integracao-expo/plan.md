# Implementation Plan: Integrando Expo Go (React Native)

**Branch**: `004-integracao-expo` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-integracao-expo/spec.md`

## Summary

O objetivo principal é criar um aplicativo móvel utilizando Expo Go (React Native) que espelhe a aplicação web do ProteinCheck (React 19). As interfaces de usuário móvel serão totalmente isoladas sob uma estrutura dedicada, enquanto a lógica de negócio principal (hooks de autenticação, controle de refeições, busca de alimentos) e os serviços (Firebase, FatSecret) serão compartilhados entre a Web e o Mobile de maneira limpa e sustentável.

## Technical Context

**Language/Version**: TypeScript 5.8+, Node.js 22+, React 19 (Web), React Native (compatível com React 18/19 via Expo SDK 51/52)

**Primary Dependencies**: Expo SDK, React Native, Expo Router (navegação), Tailwind CSS v4 (Web), Tailwind CSS para React Native (ex: `nativewind` v4 ou estilização baseada em StyleSheet nativo para evitar vazamento de CSS Web), Firebase JS SDK / AsyncStorage, Axios

**Storage**: Firebase Firestore (sincronização remota), AsyncStorage (autenticação e persistência local móvel)

**Testing**: Jest + React Native Testing Library (Mobile), Vitest (Web e lógicas compartilhadas)

**Target Platform**: Web (Vite / Express), Mobile iOS & Android (através do cliente Expo Go)

**Project Type**: Multi-platform Web & Mobile App (Estrutura compartilhada)

**Performance Goals**: Tempo de carregamento do app inferior a 3s no Expo Go, renderização de interface suave a 60fps

**Constraints**: Isolamento estrito de componentes baseados em DOM Web (`div`, `span`, CSS puro) para não quebrar o compilador nativo (Metro/Expo), hooks e utilitários compartilhados devem ser 100% agnósticos de plataforma (sem referências a objetos globais da Web como `window` ou `document`)

**Scale/Scope**: 5 telas principais espelhadas (Dashboard, Adicionar Refeição, Histórico, Perfil e Escanear Refeição)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Princípio I: Documentação-Primeiro**: ✅ Aprovado. A especificação técnica foi escrita e validada, e o plano de implementação está sendo elaborado nesta etapa.
- **Princípio II: Gestão de Tarefas Ágil**: ✅ Aprovado. As tarefas serão organizadas e ordenadas por dependência com priorização (P1/P2/P3) no arquivo `tasks.md`.
- **Princípio III: Tipagem TypeScript Estrita**: ✅ Aprovado. O TypeScript estrito está configurado na raiz e será obrigatório no projeto `mobile` sem uso de `any`.
- **Princípio IV: Componentização e Padrões React 19**: ✅ Aprovado. Componentes móveis usarão apenas tags nativas (`View`, `Text`, etc.) e hooks nativos reutilizados.
- **Princípio V: Validação e Qualidade de Código**: ✅ Aprovado. Validação empírica via Expo Go e testes unitários.

*Status do Portão*: **PASSOU**. Nenhuma violação detectada.

## Project Structure

A estrutura do projeto será organizada para isolar completamente o código visual da Web e do Mobile, compartilhando a lógica de negócio na raiz do diretório `src`:

```text
ProteinCheck2/
├── .specify/
├── specs/
│   └── 004-integracao-expo/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       └── quickstart.md
├── src/                     # Core Lógica Compartilhada e Frontend Web
│   ├── hooks/               # Hooks agnósticos e compartilhados
│   │   ├── useAuth.ts
│   │   ├── useMeals.ts
│   │   └── useFoodSearch.ts
│   ├── services/            # Serviços agnósticos e compartilhados
│   │   ├── firebaseService.ts
│   │   └── fatsecretService.ts
│   ├── components/          # Componentes visuais exclusivos da Web (Vite)
│   ├── views/               # Views exclusivas da Web (Vite)
│   └── App.tsx              # Ponto de entrada Web
├── mobile/                  # Frontend Mobile (Expo Go / React Native)
│   ├── App.tsx              # Ponto de entrada Mobile
│   ├── app/                 # Estrutura do Expo Router (Telas/Navegação)
│   ├── components/          # Componentes visuais exclusivos do Mobile
│   ├── package.json         # Dependências do app Expo
│   ├── tsconfig.json        # Configuração do TypeScript Mobile
│   └── metro.config.js      # Configuração para permitir imports do diretório pai (../src)
├── package.json             # Dependências Web e scripts principais
└── server.ts                # Backend Express
```

**Structure Decision**: A opção de criar uma pasta `mobile/` isolada na raiz foi escolhida. Isso garante que o bundler Metro (do Expo) compile apenas código específico de React Native, enquanto o Vite compila apenas código específico de Web. A lógica em `src/hooks` e `src/services` será importada por ambos os projetos através de caminhos relativos ou alias de módulo configurados no Metro.

## Complexity Tracking

> *Não há violações de arquitetura que necessitem de rastreamento de complexidade adicional.*
