# Quickstart Guide: Validando Atualizações de Gráfico Semanal

Este guia descreve os cenários executáveis passo a passo para validar que o gráfico semanal do ProteinCheck é atualizado corretamente após alterações nos registros de consumo.

## Pré-requisitos

1. Aplicação ProteinCheck em execução.
2. Usuário autenticado.
3. Existência da funcionalidade de registro de consumo.
4. Acesso ao Dashboard contendo o gráfico semanal.

---

## Passo 1: Inicialização da Aplicação

### 1. Iniciar a aplicação

Na raiz do projeto, execute:

```bash
npm install
npm run dev
```

### 2. Acessar o sistema

1. Abra o navegador.
2. Faça login no ProteinCheck.
3. Acesse o Dashboard onde o gráfico semanal é exibido.

---

## Passo 2: Cenários de Validação

### Cenário 1: Atualização após cadastro de consumo

1. No Dashboard, observe os valores atuais do gráfico semanal.
2. Cadastre um novo consumo pertencente à semana atual.
3. Salve o registro.

**Resultado Esperado:**

* O gráfico semanal é atualizado automaticamente.
* Os novos valores refletem o consumo recém-cadastrado.
* Não é necessário atualizar manualmente a página.

---

### Cenário 2: Atualização após edição de consumo

1. Localize um consumo pertencente à semana atual.
2. Altere sua quantidade ou valor de proteína.
3. Salve as alterações.

**Resultado Esperado:**

* O gráfico é atualizado automaticamente.
* Os valores exibidos correspondem às novas informações.

---

### Cenário 3: Atualização após exclusão

1. Selecione um registro da semana atual.
2. Exclua o registro.
3. Confirme a operação.

**Resultado Esperado:**

* O gráfico deixa de considerar o consumo removido.
* Caso seja o último registro da semana, o sistema apresenta um estado indicando ausência de dados.

---

### Cenário 4: Alterações em outra semana

1. Cadastre ou edite um consumo pertencente a uma semana diferente da atualmente visualizada.
2. Retorne ao Dashboard.

**Resultado Esperado:**

* O gráfico da semana atualmente exibida permanece inalterado.
* Apenas o período correspondente ao registro modificado será atualizado quando selecionado.

---

### Cenário 5: Semana sem registros

1. Selecione uma semana sem qualquer consumo registrado.

**Resultado Esperado:**

* O gráfico não apresenta valores incorretos.
* O sistema exibe uma mensagem indicando que não existem dados para o período selecionado.

---

### Cenário 6: Consistência dos dados

1. Registre diversos consumos durante a mesma semana.
2. Edite alguns registros.
3. Exclua outros registros.
4. Compare os registros cadastrados com os valores apresentados no gráfico.

**Resultado Esperado:**

* O gráfico representa exatamente os registros existentes.
* Não existem divergências entre os dados cadastrados e os valores apresentados.
* Todas as operações refletem imediatamente na visualização do progresso semanal.
