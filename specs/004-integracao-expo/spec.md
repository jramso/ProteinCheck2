# Feature Specification: Integrando Expo Go (React Native)

**Feature Branch**: `004-integracao-expo`

**Created**: 2026-06-24

**Status**: Draft

**Input**: User description: "Criar uma especificação técnica para espelhar o projeto ProteinCheck (atualmente React 19 Web) para um aplicativo Expo Go utilizando React Native, garantindo o isolamento de componentes web e o reaproveitamento de hooks de serviços e regras de negócio."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acesso ao Dashboard Nutricional via Dispositivo Móvel (Priority: P1)

Como usuário do ProteinCheck, quero acessar o dashboard principal do aplicativo pelo meu celular utilizando o cliente Expo Go, de modo a visualizar minhas metas de proteína de forma rápida e sincronizada com a versão web.

**Why this priority**: É a tela central do aplicativo. Sem ela, o usuário não tem feedback sobre sua meta diária de proteínas e o progresso do dia.

**Independent Test**: Fazer login no aplicativo pelo Expo Go com uma conta existente e verificar se os dados de consumo de proteínas e a meta diária calculada coincidem exatamente com a visualização web para o mesmo usuário.

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado no aplicativo móvel com um perfil configurado (ex: peso de 70kg e plano "Ganho de Massa Leve"), **When** ele visualiza o dashboard no Expo Go, **Then** ele deve ver a meta diária calculada de 112g (70kg * 1.6g/kg) e o gráfico/progresso atualizado correspondente.
2. **Given** que o usuário já consumiu 40g de proteínas hoje, **When** ele carrega o dashboard móvel, **Then** o sistema deve mostrar 40g consumidos, 72g restantes e uma barra de progresso em aproximadamente 35.7%.

---

### User Story 2 - Registro de Refeições no Ambiente Móvel com Compartilhamento de Hooks (Priority: P1)

Como usuário do ProteinCheck, quero cadastrar novas refeições e alimentos pelo meu dispositivo móvel, utilizando a mesma lógica de validação e comunicação com o banco de dados da versão web para garantir a integridade dos dados.

**Why this priority**: É a principal ação do usuário para monitorar o consumo. O reuso dos hooks garante que regras de negócio cruciais e integrações (Firebase/Firestore) permaneçam consistentes entre as plataformas.

**Independent Test**: Adicionar uma nova refeição contendo 30g de proteína no aplicativo móvel e verificar se o progresso diário no dashboard móvel e no dashboard web atualizam em tempo real.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa o formulário de "Adicionar Refeição" no app móvel, **When** ele preenche o nome da refeição (ex: "Shake Proteico") e a quantidade de proteína (30g) e clica em salvar, **Then** o hook `useMeals` (reaproveitado) deve processar a inserção no Firestore e o dashboard deve ser atualizado para refletir o novo total.
2. **Given** que o usuário digita no campo de busca de alimentos, **When** a digitação é concluída, **Then** o hook `useFoodSearch` (reaproveitado) deve realizar a busca na API do FatSecret e exibir a lista de alimentos para seleção diretamente na interface nativa móvel.

---

### User Story 3 - Escaneamento de Refeições com Câmera do Dispositivo Móvel via Gemini AI (Priority: P2)

Como usuário, quero utilizar a câmera do meu celular através do Expo Go para tirar uma foto do meu prato e receber uma estimativa automática da quantidade de proteína presente na refeição.

**Why this priority**: Facilita consideravelmente a entrada de dados do usuário no contexto móvel, aproveitando recursos específicos de hardware de maneira nativa.

**Independent Test**: Acessar a tela de escaneamento de refeição, capturar uma imagem de um alimento real e verificar se o retorno do serviço do Gemini AI apresenta uma estimativa de proteína apropriada.

**Acceptance Scenarios**:

1. **Given** que o usuário clica para escanear uma refeição, **When** ele autoriza o acesso à câmera e tira a foto de um "Peito de Frango", **Then** a imagem deve ser transmitida ao serviço da API Google Gemini AI, retornando a estimativa de proteínas para o usuário confirmar e salvar.

---

### Edge Cases

- **Sem Conexão com a Internet (Offline)**: O aplicativo deve reter a inserção localmente usando os hooks de serviço adaptados para persistência offline temporária ou exibir um aviso amigável de erro de conexão.
- **Permissão de Câmera Negada**: Se o usuário negar a permissão de câmera ao tentar escanear, o aplicativo deve desabilitar o botão da câmera e instruí-lo a redefinir a permissão nas configurações do sistema operacional, exibindo a opção de digitação manual de refeição como alternativa direta.
- **Incompatibilidade de Pacotes Nativos no Expo Go**: O uso de bibliotecas nativas que exijam "prebuild" ou alteração no código nativo do iOS/Android é restrito. Todas as dependências móveis devem ser compatíveis com o ambiente padrão do Expo Go (Managed Workflow).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer uma aplicação móvel utilizando React Native executável através do cliente Expo Go.
- **FR-002**: O sistema DEVE garantir o isolamento completo de componentes web, estruturando o projeto para evitar imports de tags HTML nativas (como `div`, `span`, `button`) ou CSS Web no código compilado para dispositivos móveis.
- **FR-003**: O sistema DEVE reaproveitar a lógica de negócios e estado contida nos hooks (`src/hooks/useAuth.ts`, `src/hooks/useMeals.ts`, `src/hooks/useFoodSearch.ts`) e serviços (`src/services/firebaseService.ts`, `src/services/fatsecretService.ts`), garantindo compatibilidade multiplataforma (Web e Mobile).
- **FR-004**: O sistema DEVE implementar uma interface de usuário nativa equivalente para cada uma das cinco telas principais da Web: Dashboard, Adicionar Refeição, Histórico, Perfil e Escaneamento de Refeição.
- **FR-005**: O sistema DEVE sincronizar o estado de autenticação e os dados de consumo em tempo real usando Firebase Auth e Firestore, com suporte ao ecossistema nativo do React Native.

### Key Entities *(include if feature involves data)*

- **Shared State (Auth & Meals)**: O estado mantido pelos hooks de autenticação e consulta de refeições, que servem de fonte de verdade unificada para a interface Web (React 19) e a interface Mobile (React Native).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 85% do código de lógica (services, hooks, utils, constantes) do projeto deve ser compartilhado entre Web e Mobile sem qualquer duplicação de regras de negócio.
- **SC-002**: A interface móvel executada no Expo Go deve carregar e responder a interações do usuário (toques, navegação de telas) com latência imperceptível (menos de 100ms para renderizações locais).
- **SC-003**: A sincronização de dados de uma refeição adicionada no celular deve atualizar a versão web em menos de 2 segundos.
- **SC-004**: Nenhum erro de compilação ou importação cruzada de plataforma (ex: import de `react-native` na Web ou `react-dom` no Mobile) deve ocorrer durante a compilação do Vite ou no bundler do Expo (Metro).

## Assumptions

- **A-001**: O projeto adotará uma arquitetura de compartilhamento onde os hooks e serviços em `src/hooks` e `src/services` serão mantidos agnósticos de plataforma (não usarão APIs exclusivas de DOM Web nem APIs nativas de Mobile diretamente, ou usarão abstrações condicionais baseadas em extensões de arquivo `.web.ts`/`.native.ts` ou separação de lógica).
- **A-002**: O design visual do aplicativo React Native e Expo Go seguirá as diretrizes visuais do aplicativo Web, mantendo a consistência de cores, fontes e UX, utilizando bibliotecas compatíveis com Expo para micro-animações (como Motion para Web e algo similar como Reanimated ou Animated nativo para Mobile).
- **A-003**: O usuário utilizará a versão estável do Expo Go disponível nas lojas de aplicativos (Google Play Store e Apple App Store).
- **A-004**: O usuário possui acesso à internet para sincronização dos dados com o Firebase.
