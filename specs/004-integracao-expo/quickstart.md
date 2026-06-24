# Quickstart Guide: Validando a Integração Mobile (Expo Go)

Este guia descreve os cenários executáveis passo a passo para validar que o espelhamento do aplicativo para Expo Go e o reuso de lógicas compartilhadas funcionam corretamente.

## Pré-requisitos
1. Celular físico com o aplicativo **Expo Go** instalado (Android ou iOS) ou emulador configurado.
2. Dispositivo móvel e computador de desenvolvimento conectados na **mesma rede Wi-Fi**.
3. Credenciais do Firebase configuradas no arquivo `.env` da raiz e mapeadas para o ambiente do Expo.

---

## Passo 1: Inicialização dos Ambientes

### 1. Iniciar o Servidor de API Backend (Proxy)
Na raiz do projeto, execute:
```bash
npm run dev
```
*Isto inicia o Express na porta 3000.*

### 2. Configurar e Instalar Dependências do App Mobile
Abra um novo terminal na pasta `mobile/` e instale as dependências nativas:
```bash
cd mobile
npm install
```

### 3. Iniciar o Servidor de Desenvolvimento do Expo
Dentro da pasta `mobile/`, inicie o bundler Metro:
```bash
npx expo start
```
*Um código QR será exibido no terminal.*

---

## Passo 2: Cenários de Validação

### Cenário 1: Login e Persistência de Sessão (Auth)
1. Abra a câmera do celular e escaneie o código QR (ou use o app Expo Go).
2. O aplicativo deve carregar a tela de login.
3. Insira as credenciais do usuário teste e clique em Entrar.
4. **Resultado Esperado**: O app redireciona para o Dashboard e exibe as informações nutricionais.
5. Feche o app completamente no gerenciador de tarefas do celular e abra-o novamente pelo Expo Go.
6. **Resultado Esperado**: O app deve abrir direto no Dashboard (a autenticação foi persistida via AsyncStorage).

### Cenário 2: Sincronização em Tempo Real (Web ↔ Mobile)
1. No celular (Expo Go), navegue até a tela "Adicionar Refeição".
2. Digite "Shake de Whey" com `30g` de proteína e clique em Salvar.
3. No computador, acesse a versão web do ProteinCheck (`http://localhost:3000`).
4. **Resultado Esperado**: O dashboard da Web deve atualizar de forma automática e instantânea, computando os 30g recém-cadastrados via Mobile (e vice-versa).

### Cenário 3: Busca e Autocompletar (Shared API proxy)
1. No celular, vá em "Adicionar Refeição" e digite "Ovo" no campo de busca.
2. **Resultado Esperado**: A lista deve carregar os resultados vindos da API do FatSecret através do proxy do backend local (provando que o hook `useFoodSearch` e o serviço de consulta HTTP estão funcionando).

### Cenário 4: Isolamento de Componentes (Build Checks)
1. Na raiz do projeto, execute o linting de tipagem e compilação do Vite:
   ```bash
   npm run build
   ```
   *Garante que os imports exclusivos da Web estão intactos.*
2. Na pasta `mobile`, execute a análise estática do TypeScript:
   ```bash
   npx tsc --noEmit
   ```
3. **Resultado Esperado**: Ambos os builds de plataformas compilam e validam sem erro. Não há imports de `react-native` na Web, nem de tags HTML baseadas no DOM na versão Mobile.
