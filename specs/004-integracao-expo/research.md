# Research Report: Portando ProteinCheck para Expo Go

Este documento reúne as decisões arquiteturais e técnicas necessárias para viabilizar o espelhamento do ProteinCheck (React 19 Web) para um aplicativo móvel Expo Go, com reuso máximo de lógica de negócio e isolamento de componentes.

## 1. Configuração do Metro Bundler para Monorepo e Imports Fora da Raiz

### Decisão
Será utilizado o Managed Workflow do Expo com uma pasta `mobile/` na raiz do projeto. O arquivo `mobile/metro.config.js` será configurado para estender seus caminhos de busca (`watchFolders`) e resolução para o diretório raiz (`../src`), permitindo imports diretos.

**Configuração do `metro.config.js`**:
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Permite ao Metro escutar a raiz para achar hooks e services compartilhados
config.watchFolders = [workspaceRoot];

// Garante a resolução dos node_modules do app móvel e depois da raiz
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
```

### Racional
Essa abordagem permite que o aplicativo móvel importe diretamente hooks personalizados (`../src/hooks/...`) e serviços (`../src/services/...`) exatamente do mesmo código em que a Web os consome, sem necessidade de duplicar arquivos ou configurar um build intermediário.

### Alternativas Consideradas
- **Publicação de Pacotes npm**: Separar hooks e services em um pacote npm privado. *Rejeitado* porque adiciona complexidade no ciclo de desenvolvimento local (necessidade de rebuild e links frequentes).
- **Scripts de Cópia Automática**: Copiar os arquivos de `src/hooks` para `mobile/hooks` antes do build. *Rejeitado* por ser propenso a erros de sincronização e poluir o repositório com código duplicado.

---

## 2. Persistência de Autenticação no Firebase JS SDK no Expo Go

### Decisão
Utilizaremos a persistência nativa através do pacote `@react-native-async-storage/async-storage` integrado ao Firebase Authentication JS SDK. O Firebase será inicializado de forma condicional, injetando a persistência nativa apenas no ambiente React Native.

**Inicialização Condicional da Persistência**:
```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  // Configurações do Firebase
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
```

### Racional
Por padrão, o SDK do Firebase para Web assume persistência em memória se executado fora de um browser (no ambiente nativo), o que causaria o deslogamento do usuário toda vez que o app reiniciasse no Expo Go. O uso do `AsyncStorage` garante a retenção da sessão.

### Alternativas Consideradas
- **React Native Firebase (Nativo)**: Usar o SDK nativo completo para iOS/Android. *Rejeitado* porque exige builds nativos personalizados (Prebuilds/Development Builds) e não é suportado no cliente padrão do Expo Go.
- **Persistência manual em memória**: Guardar o token e gerenciar a sessão manualmente. *Rejeitado* por ser complexo e menos seguro que o fluxo nativo do próprio Firebase.

---

## 3. Adaptação de Hooks e Serviços para Multiplataforma

### Decisão
Refatorar levemente os arquivos de hooks (`useAuth`, `useMeals`, `useFoodSearch`) e serviços de modo a torná-los agnósticos. Qualquer referência a APIs exclusivas do navegador (como `window.location`, `localStorage` ou manipulação de DOM) será encapsulada em verificações de plataforma (`typeof window !== 'undefined'` ou `Platform.OS === 'web'`).

### Racional
Isso garante compatibilidade imediata em ambas as plataformas sem a necessidade de manter dois códigos de lógica de negócio separados, preservando a manutenibilidade do projeto.

### Alternativas Consideradas
- **Abstrações Separadas (Ex: useAuth.web.ts e useAuth.native.ts)**: Criar dois arquivos para cada hook. *Rejeitado* porque a maior parte do código (validação, chamadas de API, chamadas de banco do Firestore) é exatamente idêntica, justificando manter um arquivo unificado com pequenos ifs de plataforma.
