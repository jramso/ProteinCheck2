# Quickstart Validation: Imagens Gastronômicas com Pexels API

## Prerequisites
1. Chave de API do Pexels criada no site oficial do Pexels.
2. Chave de API configurada no arquivo `.env` do servidor:
   `PEXELS_API_KEY=sua_chave_do_pexels_aqui`
3. Executar o servidor backend e frontend:
   `npm run dev`

---

## Scenario 1: Buscar e Visualizar Imagem Gastronômica Dinamicamente
1. Acessar o aplicativo no navegador (geralmente `http://localhost:5173`).
2. Fazer login como visitante ou conta autenticada.
3. Clicar no botão "+" para adicionar refeição.
4. Digitar `"Ovo frito"` no campo de nome da refeição.
5. Aguardar cerca de 1 segundo.

*Expected outcome*:
- A prévia da imagem culinária de um ovo frito realista do Pexels deve aparecer na tela (substituindo a imagem genérica de placeholder).

---

## Scenario 2: Persistir Imagem Pexels no Firestore
1. Seguir os passos do Cenário 1.
2. Definir a proteína e clicar em **Salvar Refeição**.
3. Acessar o painel do Firebase Console -> Firestore Database.
4. Abrir a coleção `users/{userId}/meals/{mealId}` da refeição criada.

*Expected outcome*:
- O campo `imageUrl` do documento no Firestore deve conter a URL exata da imagem do Pexels que foi exibida na tela de prévia.

---

## Scenario 3: Exibição no Histórico e Dashboard sem Novas Chamadas de API
1. Adicionar 2-3 refeições gastronômicas.
2. Navegar para a tela de **Histórico** e voltar para o **Dashboard**.
3. Monitorar a rede (Network Tab no Chrome DevTools).

*Expected outcome*:
- As imagens nos cards de refeição devem carregar instantaneamente usando as URLs salvas.
- Nenhuma chamada adicional ao endpoint local `/api/images/search` deve ocorrer para as refeições já existentes no histórico.

---

## Scenario 4: Validação de Fallbacks Culinários
1. Digitar um nome aleatório e sem fotos culinárias (ex: "xyz123abc").
2. Ou simular offline desativando a internet (Network tab -> Offline).

*Expected outcome*:
- O aplicativo exibe uma imagem culinária genérica de fallback de alta qualidade (como prato de comida saudável).
- O aplicativo não exibe imagens de paisagens nem links quebrados.

---

## Validation Commands
- Executar type-checking e compilação:
  `npm run lint`
  `npm run build`
