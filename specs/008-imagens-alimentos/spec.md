# Feature Specification: Imagens Gastronômicas com Pexels API

**Feature Branch**: `008-imagens-alimentos`

**Created**: 2026-07-02

**Status**: Draft

**Input**: User description: "crie a Spec 008-imagens-alimentos, nessa spec usaremos imagens da API da Pexels API para colocar as imagens corretamente ao lado dos alimentos no aplicativo, por enquanto as imagens são um tanto aleatórias então o objetivo é usar uma imagem que represente a comida selecionada e ou cadastrada, foque em ser funcional e em imagens gastronomicas para que seja minimamente coerente com o tema do aplicativo, atualmente as imagens são paisagens o que não tem um bom valor real."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exibição de Imagem Gastronômica Baseada no Alimento (Priority: P1)

Como usuário, quero ver uma imagem culinária real e representativa ao lado do nome do alimento para que a interface seja visualmente agradável e condizente com o monitoramento de alimentação.

**Why this priority**: É o valor principal da feature. Substituir imagens de paisagem por fotos de comida de forma dinâmica no dashboard e listas de refeições.

**Independent Test**: Selecionar ou cadastrar um alimento como "Ovo Frito" ou "Salada" e checar se o card do alimento renderiza uma foto gastronômica realista no dashboard, em vez de paisagens genéricas de placeholder.

**Acceptance Scenarios**:

1. **Given** que o aplicativo exibe uma refeição com o nome "Ovo Cozido", **When** o componente renderiza o card da refeição, **Then** o sistema exibe uma imagem gastronômica correspondente retornada pela Pexels API.
2. **Given** que uma refeição tem um nome composto complexo (ex: "Arroz integral com feijão carioca"), **When** a busca no Pexels é acionada, **Then** o sistema simplifica ou normaliza o termo de busca para garantir o retorno de uma imagem gastronômica válida.

---

### User Story 2 - Persistência das URLs de Imagens Gastronômicas (Priority: P2)

Como usuário, quero que as URLs de imagens associadas às minhas refeições fiquem gravadas no banco de dados para economizar minha franquia de internet e acelerar o carregamento em sessões futuras.

**Why this priority**: Evita requisições repetidas à API externa do Pexels para as mesmas refeições já gravadas no histórico.

**Independent Test**: Salvar uma nova refeição com imagem Pexels, ir para outra tela, voltar ou atualizar a página, e validar que o card da refeição no histórico carrega a mesma imagem instantaneamente, consumindo a URL diretamente do banco (Firestore).

**Acceptance Scenarios**:

1. **Given** que selecionei uma imagem do Pexels para uma refeição, **When** eu salvo o alimento, **Then** o campo `imageUrl` contendo a URL da imagem Pexels é persistido no Firestore junto com a refeição.
2. **Given** que carrego o meu histórico semanal de refeições, **When** os cards são renderizados, **Then** as imagens correspondentes são carregadas usando as URLs salvas no Firestore, sem disparar novas chamadas de pesquisa no Pexels.

---

### User Story 3 - Tratamento de Erros e Fallback de Imagens de Comida (Priority: P3)

Como usuário, quero que o aplicativo continue funcionando e exiba imagens culinárias genéricas de alta qualidade mesmo se a API do Pexels falhar, se a cota diária for excedida ou se eu estiver sem internet.

**Why this priority**: Garante resiliência e estabilidade da interface do usuário sob qualquer condição de rede ou cota.

**Independent Test**: Desconectar a internet ou simular um erro HTTP na API do Pexels e verificar se o aplicativo renderiza imagens gastronômicas genéricas agradáveis (fallbacks) de forma instantânea sem quebrar o layout da tela.

**Acceptance Scenarios**:

1. **Given** que a busca na API do Pexels falhou ou retornou zero imagens para o termo buscado, **When** o card da refeição tenta exibir a imagem, **Then** o sistema renderiza uma imagem culinária estática de fallback pré-definida e agradável.

---

### Edge Cases

- **Termos de busca sem fotos correspondentes**: Se o nome do alimento for muito específico ou incomum (ex: "Whey Growth de chocolate com leite de amêndoas"), a busca na Pexels API pode retornar 0 resultados. O sistema deve capturar isso de forma graciosa e usar fallbacks culinários generificados (ex: imagem de whey ou copo com bebida saudável).
- **Consumo de chaves de API expostas**: Chaves de API do Pexels não devem ser vazadas no front-end para evitar roubo de cota ou abusos.
- **Quota rate-limiting**: A API do Pexels possui limites de requisições por hora/dia. A aplicação precisa cachear as URLs consultadas temporariamente e usar fallbacks adequados se receber um erro `429 Too Many Requests`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST realizar buscas dinâmicas de imagens gastronômicas na API do Pexels sempre que um novo alimento for pesquisado ou digitado no formulário.
- **FR-002**: System MUST priorizar e filtrar imagens culinárias agregando termos gastronômicos implícitos (como "food", "healthy meal", "cooking") à query enviada ao Pexels.
- **FR-003**: System MUST persistir a URL da imagem Pexels selecionada no campo `imageUrl` do documento da refeição (`meals`) no Firestore.
- **FR-004**: System MUST possuir um conjunto de imagens culinárias de fallback estáticas e agradáveis para serem exibidas quando a API do Pexels estiver indisponível ou retornar vazio.
- **FR-005**: System MUST proteger a chave de API do Pexels através de um endpoint proxy no backend (`server.ts` na rota `/api/images/search`). O front-end fará requisições locais a esse endpoint e o backend encaminhará a busca à API do Pexels injetando a chave a partir das variáveis de ambiente (`.env`), impedindo a exposição pública da credencial.

### Key Entities *(include if feature involves data)*

- **Refeicao (Meal)**: Atualizada para sempre conter o campo `imageUrl` preenchido com a URL específica da imagem gastronômica da Pexels API (ou fallback), persistido no banco de dados.
- **PexelsImageSearchResult**: Objeto temporário contendo a lista de imagens retornadas pela pesquisa do Pexels, contendo a URL de renderização otimizada (como tamanho `medium` ou `small`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das imagens de refeições renderizadas na aplicação são de cunho gastronômico ou culinário (comida, ingredientes, preparo), eliminando totalmente fotos de paisagens aleatórias.
- **SC-002**: O tempo para buscar e renderizar a imagem do Pexels na tela de adição/card de refeição é menor que 1.5 segundos em conexões de banda larga estáveis.
- **SC-003**: Em caso de falha de conexão ou estouro de cota da API, o sistema exibe a imagem culinária de fallback em menos de 100ms.

## Assumptions

- O usuário terá uma conexão de internet activa para buscar novas imagens do Pexels, mas o histórico lerá imagens cacheadas ou gravadas no banco de forma offline.
- A chave de API do Pexels será obtida gratuitamente pelo desenvolvedor e adicionada às variáveis de ambiente configuradas no projeto.
- Imagens do Pexels fornecidas através de suas URLs públicas são estáveis e de carregamento rápido.
- O escopo limita-se à busca automática e sugestão de imagem a partir do nome do alimento, sem permitir upload manual de arquivos nesta fase.
