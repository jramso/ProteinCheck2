# Research: Imagens Gastronômicas com Pexels API

## Decision 1: Requisições de Busca via Proxy no Backend
- **Decision**: Implementar a rota proxy `/api/images/search` no servidor Express (`server.ts`) para lidar com a comunicação direta com o Pexels.
- **Rationale**: Protege a chave privada `PEXELS_API_KEY` do Pexels, mantendo-a apenas no ambiente seguro do servidor (`.env`). Evita que a chave seja visível nas requisições HTTP públicas do navegador do usuário.
- **Alternatives considered**: Requisição direta do frontend (rejeitado por vazar a credencial e violar o requisito FR-005).

## Decision 2: Normalização do Termo de Busca Culinária
- **Decision**: No backend, o termo de busca enviado ao Pexels será higienizado: removendo caracteres especiais, retirando preposições ou conectivos em português (ex: "de", "com", "e", "para") e concatenando o sufixo gastronômico `"food"` ou `"comida"` à pesquisa.
- **Rationale**: Aumenta significativamente a relevância das imagens retornadas pelo Pexels, garantindo o foco culinário/gastronômico mesmo para pratos compostos em português.
- **Alternatives considered**: Enviar o nome bruto do alimento (rejeitado pelo risco alto de retornar paisagens ou nenhum resultado).

## Decision 3: Estratégia de Fallback Culinário
- **Decision**: Criar um dicionário de mapeamento local com 5-6 imagens gastronômicas estáticas de alta qualidade e genéricas (como salada, frango, ovos, bebidas saudáveis) hospedadas publicamente.
- **Rationale**: Garante resiliência e estética da interface caso a API externa falhe, a internet caia ou a cota do Pexels seja excedida. Evita que o app exiba placeholders vazios ou quebrados.
- **Alternatives considered**: Exibir um ícone cinza ou quebrado (rejeitado por prejudicar a experiência visual e valor estético do app).

## Decision 4: Cache de Sessão em Memória no Frontend
- **Decision**: Implementar um objeto simples de cache em memória dentro do [pexelsService.ts](file:///C:/Users/josue/OneDrive/Documentos/Jramso/Node/Ts/ProteinCheck2/src/services/pexelsService.ts) para mapear `nomeAlimento -> urlImagem`.
- **Rationale**: Reduz a latência de carregamento e evita o consumo desnecessário da cota da API do Pexels quando o usuário pesquisa ou alterna entre sugestões com o mesmo nome repetidas vezes na mesma sessão.
- **Alternatives considered**: Fazer requisição ao proxy em toda mudança do formulário (rejeitado por ineficiência de cota).
