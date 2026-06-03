## Funcionalidade: Aceite do Termo de Responsabilidade (User Consent & Liability Disclaimer)

### 1. Visão Geral (Overview)

Como o aplicativo realiza estimativas de ingestão de proteínas e cálculos de metas baseados em fórmulas genéricas (como o IMC e multiplicadores de taxa metabólica/intensidade de treino), torna-se juridicamente e operacionalmente necessário que o usuário declare ciência de que o sistema **não substitui o acompanhamento de um profissional de nutrição ou medicina**.

Esta funcionalidade visa bloquear o acesso aos recursos do sistema (Dashboard, Histórico, Scan) até que o usuário leia e dê o aceite explícito ao Termo de Responsabilidade.

---

### 2. Impacto no Modelo de Dados (Data Model)

Para registrar o consentimento, a entidade `User` no Firestore será estendida para incluir metadados sobre o aceite.

#### 2.1. Alteração no `firebase-blueprint.json`

Modificar a entidade `User` adicionando as propriedades `termsAccepted`, `termsAcceptedAt` e `termsVersion`:

```json
"User": {
  "title": "User Profile",
  "description": "Stores user settings and goals.",
  "type": "object",
  "properties": {
    "uid": { "type": "string", "description": "Firebase Auth UID" },
    "displayName": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "photoURL": { "type": "string", "format": "uri" },
    "weight": { "type": "number" },
    "height": { "type": "number" },
    "proteinGoal": { "type": "number" },
    "multiplier": { "type": "number" },
    "autoCalculate": { "type": "boolean" },
    "weightUnit": { "type": "string", "enum": ["kg", "lb"] },
    "createdAt": { "type": "string", "format": "date-time" },
    "termsAccepted": { "type": "boolean", "description": "Indica se o usuário aceitou o termo vigente" },
    "termsAcceptedAt": { "type": "string", "format": "date-time", "description": "Timestamp do momento do aceite" },
    "termsVersion": { "type": "string", "description": "Versão do termo aceito (ex: 'v1.0')" }
  },
  "required": ["uid", "email", "termsAccepted"]
}

```

#### 2.2. Atualização das Regras de Segurança (`firestore.rules`)

A função de validação do usuário deve exigir a presença lógica do campo `termsAccepted`:

```javascript
function isValidUser(data) {
  return data.keys().hasAll(['uid', 'email', 'termsAccepted']) &&
         data.uid == request.auth.uid &&
         data.termsAccepted is bool &&
         (!('termsVersion' in data) || data.termsVersion is string) &&
         // ... outras regras existentes
}

```

---

### 3. Regras de Negócio & Fluxo do Usuário (Business Rules & User Flow)

1. **Usuários Autenticados (Google Auth):** Ao realizar o login, o sistema verifica a flag `termsAccepted` no documento do Firestore. Se `false` ou inexistente, redireciona compulsoriamente para a tela do termo.
2. **Usuários Visitantes (Guest Mode):** O estado da sessão persistido no `localStorage` sob a chave `protein-check-guest-user` deve também armazenar a flag de aceite do termo.
3. **Bloqueio de Navegação:** Enquanto o termo não for aceito, o cabeçalho (`header`) e o menu inferior (`nav`) do `Layout.tsx` devem permanecer ocultos ou desativados para evitar desvios no fluxo.
4. **Armazenamento de Versão:** O sistema deve verificar uma constante global (ex: `const CURRENT_TERMS_VERSION = '1.0'`). Se o usuário tiver `termsAccepted: true`, mas a versão salva for menor do que a vigente, ele deverá aceitar o termo novamente.

---

### 4. Design de Interface & Componentes (UI/UX)

Será criada uma nova View chamada `TermsView.tsx` e um modal/componente de texto longo com scroll para o conteúdo jurídico.

```
+------------------------------------------+
|            PROTEÍNA CHECK-IN             |
+------------------------------------------+
|                                          |
|         Termo de Responsabilidade        |
|                  v1.0                    |
|                                          |
|  [ Caixa de texto com scroll contendo ]  |
|  [ as cláusulas legais informando que ]  |
|  [ o app é apenas uma ferramenta de   ]  |
|  [ apoio e não substitui um nutricio- ]  |
|  [ nista qualificado.                 ]  |
|                                          |
|  [X] Li e concordo com os termos acima.  |
|                                          |
|  +------------------------------------+  |
|  |       CONTINUAR (Desabilitado)     |  |
|  +------------------------------------+  |
+------------------------------------------+

```

---

### 5. Arquitetura de Implementação Técnica

#### 5.1. Adaptação no Hook de Autenticação (`src/hooks/useAuth.ts`)

O hook precisa expor e gerenciar a atualização do aceite em nível local e global.

```typescript
// Adicionar dentro do useAuth() ou criar uma função específica exposta por ele:
const acceptTerms = async (userId: string, isGuest: boolean) => {
  const timestamp = new Date().toISOString();
  const version = "1.0";

  if (isGuest) {
    const savedGuest = localStorage.getItem('protein-check-guest-user');
    if (savedGuest) {
      const guestData = JSON.parse(savedGuest);
      guestData.termsAccepted = true;
      guestData.termsAcceptedAt = timestamp;
      guestData.termsVersion = version;
      localStorage.setItem('protein-check-guest-user', JSON.stringify(guestData));
      setUser(guestData);
    }
  } else {
    await updateDoc(doc(db, 'users', userId), {
      termsAccepted: true,
      termsAcceptedAt: serverTimestamp(),
      termsVersion: version
    });
    // Atualiza o estado local do usuário após a gravação
    setUser(prev => prev ? { ...prev, termsAccepted: true, termsVersion: version } : null);
  }
};

```

#### 5.2. Controle de Roteamento no Componente Principal (`src/App.tsx`)

Injetar a lógica de barreira logo após o usuário se identificar (seja via Google ou Visitante):

```typescript
// Dentro do componente App() em src/App.tsx:

if (!user) {
  return <LoginView /> // Renderiza a tela de login existente
}

// Barreira do Termo de Responsabilidade
if (!user.termsAccepted || user.termsVersion !== "1.0") {
  return (
    <TermsView 
      user={user} 
      onAccept={() => handleAcceptTerms(user.uid, user.uid.startsWith('guest-'))} 
    />
  );
}

// Fluxo normal do sistema se o termo estiver aceito
return (
  <Layout currentScreen={currentScreen} onNavigate={setCurrentScreen}>
    {renderScreen()}
  </Layout>
);

```

---

### 6. Plano de Testes (Test Cases)

* **CT01 - Primeiro Acesso de Novo Usuário:** O usuário entra via Google, a conta é criada no banco com `termsAccepted: false`. O sistema deve exibir imediatamente a tela do termo, impedindo o clique no menu ou dashboard.
* **CT02 - Validação do Botão de Continuar:** O botão "Continuar" deve iniciar desabilitado e só se tornar ativo quando a checkbox `[ ] Li e concordo` for marcada.
* **CT03 - Persistência do Visitante:** Um usuário entra como visitante, aceita os termos e fecha o navegador. Ao reabrir, o estado do localStorage deve validar que os termos já foram aceitos e direcionar direto para o Dashboard.
* **CT04 - Atualização de Versão (Futuro):** Se o banco possuir um registro com `termsVersion: "0.9"` e o sistema rodar a versão atualizada `"1.0"`, a barreira deve reaparecer na inicialização do app requisitando um novo aceite.