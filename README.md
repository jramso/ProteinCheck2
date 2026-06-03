Aqui está uma proposta de reescrita completa para o arquivo `README.md` do seu projeto. O texto foi reformulado para refletir com precisão todas as funcionalidades reais mapeadas no código do sistema (como rastreamento de proteínas, integração com a API do FatSecret para busca/autocompletar, escaneamento de refeições usando a IA do Gemini e persistência com Firebase/Modo Visitante).

---

# Proteína Check-in

O **Proteína Check-in** é uma aplicação web voltada para o monitoramento personalizado da ingestão diária de proteínas, ajudando entusiastas de atividades físicas e atletas a atingirem suas metas nutricionais com facilidade e precisão.

O sistema combina inteligência artificial para reconhecimento de imagens, integração com bases de dados nutricionais externas e uma interface fluida otimizada para dispositivos móveis.

---

## Funcionalidades Principais

* **Dashboard de Consumo Diário:** Gráfico circular de progresso em tempo real que exibe a quantidade de proteína consumida, o valor restante para atingir a meta e o contador de consistência (*streak*) de dias seguidos no foco.
* **Escaneamento de Refeições com IA:** Integração com o modelo `gemini-3-flash-preview` para identificar alimentos a partir de fotos tiradas pela câmera ou enviadas pelo dispositivo, estimando a quantidade de proteínas automaticamente.
* **Busca Integrada (Base FatSecret):** Sistema de pesquisa e autocompletar conectado diretamente à API oficial do FatSecret (Região Brasil/PT), permitindo localizar alimentos e extrair seus valores nutricionais exatos de forma rápida.
* **Alimentos Rápidos:** Atalhos configurados para inserção instantânea de itens comuns da dieta (como Whey Protein, Ovos, Peito de Frango e Iogurte Grego).
* **Histórico e Visão Semanal:** Tela dedicada com gráficos de barras para acompanhar a média diária e rever o histórico detalhado de refeições adicionadas ao longo dos dias.
* **Cálculo Automatizado de Metas:** Perfil do usuário com suporte a múltiplos objetivos (Manutenção, Ganho Muscular e Performance Elite), cálculo automático do IMC (padrão OMS) e suporte a conversão de unidades (KG / LB).
* **Autenticação Flexível:** Suporte a login social via Google e um **Modo Visitante** completo, que permite testar e usar o aplicativo localmente salvando o progresso diretamente no navegador do usuário.

---

## Tecnologias Utilizadas

### Frontend

* **React 19** & **TypeScript**
* **Tailwind CSS 4** (Estilização nativa e animações de varredura de câmera)
* **Motion** (Animações fluidas de transição entre telas)
* **Lucide React** (Pacote de ícones)

### Backend & Serviços

* **Express** & **Node.js** (Servidor responsável por gerenciar a autenticação OAuth2 e proxies seguros para as APIs externas)
* **Firebase Auth & Firestore** (Persistência em tempo real e segurança de dados dos usuários)
* **Google Gen AI SDK** (Processamento inteligente de imagens de alimentos)
* **Axios** (Comunicação com endpoints e APIs de terceiros)

---

## Como Rodar o Projeto Localmente

### Pré-requisitos

* **Node.js** instalado (versão 18 ou superior recomendada).
* Uma chave de API do **Google Gemini**.
* Credenciais de cliente (**Client ID** e **Client Secret**) obtidas na plataforma de desenvolvedores do **FatSecret**.

### Passo a Passo

1. **Clonar o repositório e instalar as dependências:**
```bash
npm install

```


2. **Configurar as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto baseado no padrão abaixo:
```env
FATSECRET_CLIENT_ID="SEU_CLIENT_ID_DO_FATSECRET"
FATSECRET_CLIENT_SECRET="SEU_CLIENT_SECRET_DO_FATSECRET"
GEMINI_API_KEY="SUA_CHAVE_DE_API_DO_GEMINI"
APP_URL="http://localhost:3000"

```


3. **Configurar o Firebase (Se aplicável):**
Certifique-se de preencher o arquivo `firebase-applet-config.json` com os parâmetros do seu projeto do Firebase Console caso queira utilizar a sincronização em nuvem completa.
4. **Iniciar o Servidor de Desenvolvimento:**
O projeto utiliza um servidor customizado que integra o ecossistema do Vite em modo middleware:
```bash
npm run dev

```


Acesse a aplicação através do endereço: `http://localhost:3000`

---

## Estrutura de Scripts do `package.json`

* `npm run dev`: Inicia o servidor Node/Express rodando com TypeScript e o Vite acoplado em ambiente de desenvolvimento.
* `npm run build`: Compila e gera os arquivos otimizados de produção na pasta `/dist`.
* `npm run preview`: Executa localmente o ambiente com a build de produção já gerada.
* `npm run clean`: Remove os arquivos compilados anteriormente.
* `npm run lint`: Executa a verificação estática de tipos do TypeScript sem gerar arquivos de saída.