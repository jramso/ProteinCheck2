<!--
  Sync Impact Report:
  - Version change: 0.0.0 → 1.0.0
  - List of modified principles:
    - [PRINCIPLE_1_NAME] → I. Documentação-Primeiro
    - [PRINCIPLE_2_NAME] → II. Gestão de Tarefas Ágil (Kanban/Scrum)
    - [PRINCIPLE_3_NAME] → III. Tipagem TypeScript Estrita
    - [PRINCIPLE_4_NAME] → IV. Componentização e Padrões React 19
    - [PRINCIPLE_5_NAME] → V. Validação e Qualidade de Código
  - Added sections: Pilha Tecnológica e Restrições, Fluxo de Trabalho de Desenvolvimento
  - Templates requiring updates: ✅ Updated (verified generic)
  - Follow-up TODOs: None.
-->

# Proteína Check-in Constitution

## Core Principles

### I. Documentação-Primeiro
Cada funcionalidade ou mudança deve ser documentada detalhadamente antes de qualquer implementação de código. O fluxo segue rigorosamente a ordem: Especificação -> Plano -> Implementação -> Validação. Nenhuma linha de código de produção deve ser escrita sem uma especificação aprovada.

### II. Gestão de Tarefas Ágil (Kanban/Scrum)
O desenvolvimento utiliza as metodologias Kanban e Scrum para o fluxo de tarefas. As atividades são organizadas em sprints com priorização clara (P1, P2, P3). O acompanhamento visual do progresso é essencial para a transparência e eficiência da equipe.

### III. Tipagem TypeScript Estrita
O uso de TypeScript é obrigatório em todo o projeto. É terminantemente proibido o uso do tipo `any`. Todos os dados manipulados (alimentos, refeições, metas, dados de usuários) devem possuir interfaces ou tipos explicitamente definidos para garantir a integridade estrutural.

### IV. Componentização e Padrões React 19
Desenvolva componentes funcionais modulares e reutilizáveis utilizando Hooks nativos. A estilização deve seguir o padrão Tailwind CSS v4 com o compilador nativo. As animações devem utilizar a biblioteca Motion para garantir uma interface fluida e moderna.

### V. Validação e Qualidade de Código
Mudanças só são consideradas completas após validação empírica. Bug fixes exigem a criação de um caso de teste ou script de reprodução antes da correção. O código gerado deve ser pronto para uso, modular e com tratamento de erros estruturado.

## Pilha Tecnológica e Restrições

O projeto utiliza a seguinte stack padrão. Não introduza novas bibliotecas sem verificação prévia de uso ou aprovação expressa.

*   **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React.
*   **Backend**: Node.js, Express (iniciado via `server.ts` com `tsx`).
*   **Serviços**: Firebase (Auth & Firestore), Google Gemini AI SDK (`@google/genai`), FatSecret API.
*   **Ferramentas**: Vite (Middleware), Axios.

## Fluxo de Trabalho de Desenvolvimento

1.  **Pesquisa**: Mapeamento do codebase e validação de suposições via `grep_search` e `read_file`.
2.  **Estratégia**: Formulação de um plano fundamentado e conciso.
3.  **Execução**: Ciclo iterativo de Plano -> Agir -> Validar para cada sub-tarefa.
4.  **Consistência**: Aditamentos à constituição e atualizações em `GEMINI.md` devem ocorrer sempre que novos padrões forem estabelecidos.

## Governance

Esta constituição prevalece sobre todas as outras práticas de desenvolvimento. Emendas requerem documentação, justificativa e atualização do versionamento.

### Regras de Governança
*   Todas as revisões de código devem verificar a conformidade com estes princípios.
*   O arquivo `GEMINI.md` na raiz do projeto é a fonte de verdade para orientações de runtime para a IA.
*   O versionamento da constituição segue o padrão SemVer (MAJOR.MINOR.PATCH).

**Version**: 1.0.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-10
