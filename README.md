# Proteína Check-in 🥦🥩

O **Proteína Check-in** é uma aplicação web de ponta voltada para o monitoramento personalizado da ingestão diária de proteínas. Desenvolvido para ajudar entusiastas de atividades físicas, atletas e qualquer pessoa em jornada de reeducação alimentar a atingirem suas metas nutricionais com facilidade, precisão e uma interface mobile-first moderna.

O sistema combina Inteligência Artificial para o reconhecimento visual de alimentos, busca integrada em bases de dados nutricionais de referência e persistência em nuvem.

---

## 🌟 Funcionalidades Principais

* **Dashboard de Consumo Diário:** Gráfico circular de progresso reativo que exibe o consumo acumulado, a meta diária e o indicador de consistência (*streak*) de dias seguidos cumprindo a meta.
* **Escaneamento de Refeições com IA:** Integração direta com a API do Google Gemini (`gemini-1.5-flash` ou similar) para identificar alimentos através de fotos (câmera ou galeria) e estimar automaticamente o teor de proteínas.
* **Busca Conectada (Base FatSecret):** Sistema de pesquisa com autocompletar integrado diretamente à API oficial do FatSecret (Região Brasil/PT), retornando valores de proteínas e calorias precisos de forma imediata.
* **Alimentos Rápidos:** Atalhos customizados para inclusão em um clique de itens populares (Whey Protein, Ovos, Peito de Frango, Iogurte Grego, etc.).
* **Histórico e Gráficos Semanais:** Tela analítica contendo histórico de refeições e gráfico semanal de barras indicando a média diária de consumo.
* **Perfil do Usuário Avançado:** Cálculo automático do IMC, taxas metabólicas e metas dinâmicas de proteínas com base em objetivos (Manutenção, Ganho de Massa, Performance Elite), com suporte a conversão de peso (KG / LB).
* **Autenticação Flexível:** Suporte a Login via Google com Firebase Auth ou um prático **Modo Visitante** que armazena os dados localmente no navegador (LocalStorage).

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React 19** & **TypeScript**
* **Tailwind CSS 4** (Estilização de alta performance com animações customizadas)
* **Motion** (Transições fluidas entre telas e feedback tátil simulado)
* **Lucide React** (Ícones vetoriais modernos)

### Backend & Serviços
* **Express** & **Node.js** (Servidor proxy seguro para autenticação de APIs externas e entrega dos arquivos estáticos)
* **Firebase Auth & Firestore** (Banco de dados em nuvem e login social)
* **Google Gemini API** (Inteligência artificial para análise de imagens)
* **Pexels API** (Busca automática de fotos ilustrativas para alimentos)
* **FatSecret Platform API** (Base de dados nutricional oficial para alimentos no Brasil)

---

## 🚀 Como Executar em Outra Máquina (Instalação Tradicional)

Se você deseja clonar o projeto e rodá-lo utilizando Node.js localmente, siga estes passos:

### 1. Pré-requisitos
* **Node.js** instalado (versão 20 ou superior recomendada).
* **Git** instalado para clonar o repositório.

### 2. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto contendo as chaves das APIs externas:
```env
# Configurações do Servidor
PORT=3000

# API FatSecret (Obtidas no portal de desenvolvedores do FatSecret)
FATSECRET_CLIENT_ID="SEU_CLIENT_ID"
FATSECRET_CLIENT_SECRET="SEU_CLIENT_SECRET"

# API Google Gemini
GEMINI_API_KEY="SUA_CHAVE_GEMINI_API"

# API Pexels (Para carregar fotos ilustrativas dos alimentos)
PEXELS_API_KEY="SUA_CHAVE_PEXELS_API"
```

> [!NOTE]
> Caso queira habilitar o sincronismo em nuvem via Firebase, certifique-se de configurar o arquivo `firebase-applet-config.json` na raiz do projeto com as credenciais do seu app Firebase. Se o arquivo não estiver presente ou configurado, o aplicativo funcionará perfeitamente através do **Modo Visitante** local.

### 3. Instalar Dependências e Executar
Abra um terminal na pasta do projeto e execute:
```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar em modo de desenvolvimento (Vite + Express Proxy)
npm run dev
```
Acesse a aplicação no navegador em: [http://localhost:3000](http://localhost:3000).

---

## 🐳 Executando com Docker (Praticidade Máxima)

Você pode optar por rodar a aplicação encapsulada em containers Docker, isolando a instalação de dependências locais.

### 🖥️ Método A: Build Local (Para Desenvolvimento/Modificações)
Use este método se você clonou o código fonte completo e deseja gerar a imagem Docker localmente.

1. Garanta que o arquivo `.env` foi criado na raiz com suas chaves de API.
2. Inicie os containers usando o arquivo de compose padrão:
   ```bash
   docker compose up -d --build
   ```
   * O container será construído a partir do `Dockerfile` local.
   * A porta exposta na máquina local será a **3000** (mapeada para a porta interna 8080 do container).
3. Acesse em: [http://localhost:3000](http://localhost:3000).

---

### 🌐 Método B: Imagem Pronta do Docker Hub (Para Produção / Deploy Rápido)
Você pode executar o app em qualquer máquina sem precisar clonar ou baixar o código-fonte inteiro, apenas baixando a imagem oficial compilada e publicada no Docker Hub:
👉 **[Repositório Oficial no Docker Hub](https://hub.docker.com/r/jramsodocker/proteincheck-app)**

Para fazer isso, siga o passo a passo:

1. Baixe ou crie um arquivo chamado `docker-compose.deploy.yml` na sua máquina com o seguinte conteúdo:
   ```yaml
   version: '3.8'

   services:
     app:
       image: seuUsuario/proteincheck-app:latest
       container_name: proteincheck-app-prod
       restart: unless-stopped
       ports:
         - "8085:8080"
       env_file:
         - .env
   ```
2. Crie un arquivo `.env` na **mesma pasta** do arquivo yaml acima, inserindo suas credenciais de API (Gemini, FatSecret, Pexels).
3. Execute o comando para baixar a imagem pronta e subir o serviço:
   ```bash
   docker compose -f docker-compose.deploy.yml up -d
   ```
4. A aplicação estará rodando na porta padrão de produção: [http://localhost:8085](http://localhost:8085).

---

## 🛠️ Publicando Novas Versões no Docker Hub (Desenvolvedores)

Se você fez alterações no código e deseja enviar uma nova imagem estável para o Docker Hub sob a sua conta `seuUsuario`, siga os comandos a seguir no PowerShell ou terminal de sua preferência:

1. Faça login na sua conta do Docker Hub:
   ```bash
   docker login
   ```
2. Construa a imagem local rotulando a versão (ex: 1.0):
   ```bash
   docker build -t proteincheck-app:1.0 .
   ```
3. Crie as tags apontando para o repositório correto:
   ```bash
   docker tag proteincheck-app:1.0 seuUsuario/proteincheck-app:1.0
   docker tag proteincheck-app:1.0 seuUsuario/proteincheck-app:latest
   ```
4. Envie as imagens para o Docker Hub:
   ```bash
   docker push seuUsuario/proteincheck-app:1.0
   docker push seuUsuario/proteincheck-app:latest
   ```

---

## 📝 Scripts Disponíveis no `package.json`

* `npm run dev`: Executa o servidor de desenvolvimento Express e integra o middleware do Vite para o frontend.
* `npm run build`: Compila o frontend React (TypeScript) gerando os arquivos de produção otimizados na pasta `/dist`.
* `npm run preview`: Inicia localmente a aplicação simulando o ambiente final de produção.
* `npm run lint`: Executa a verificação estática de tipos do TypeScript.
* `npm run clean`: Limpa compilações anteriores excluindo as pastas de saída.