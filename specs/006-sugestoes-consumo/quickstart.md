# Quickstart Validation: Sugestoes de Consumo

## Prerequisites
- Node.js instalado
- Dependencias instaladas (`npm install`)
- App em execucao (`npm run dev`)
- Usuario autenticado para testar persistencia de sugestoes

## Scenario 1: Cadastrar sugestao
1. Fazer login com conta autenticada.
2. Acessar fluxo de adicionar refeicao/sugestoes.
3. Criar sugestao com nome e proteina validos.
4. Confirmar que a sugestao aparece na lista.

Expected outcome:
- Sugestao visivel para o usuario logado.
- Sem erro de validacao para entrada valida.

## Scenario 2: Validar duplicidade normalizada
1. Criar sugestao "Frango grelhado" com 30g.
2. Tentar criar "  FRANGO   GRELHADO  " com 30g.

Expected outcome:
- Sistema bloqueia novo cadastro e informa duplicidade.

## Scenario 3: Usar sugestao com quantidade
1. Selecionar sugestao salva.
2. Informar quantidade no passo extra (ex.: 1.5).
3. Confirmar registro de consumo.

Expected outcome:
- Registro criado com proteina ajustada pela quantidade.
- Fluxo conclui sem abrir formulario completo desnecessariamente.

## Scenario 4: Visitante tentando salvar sugestao
1. Entrar em modo visitante.
2. Tentar salvar nova sugestao.

Expected outcome:
- Sistema exige conversao para conta autenticada.
- Nenhuma sugestao e persistida para visitante.

## Regression Checks
- Adicao manual de refeicao continua funcionando.
- Edicao e exclusao de refeicao continuam funcionando.
- Dashboard e historico continuam exibindo dados corretamente.

## Scenario 5: Validar Regras de Segurança no Firestore
1. Executar os testes locais de regras ou simular no Firebase Console / Simulator.
2. Tentar criar uma sugestão usando um payload inválido (ex: `proteinPerPortion` <= 0).
3. Tentar ler ou escrever sugestões de outro usuário (onde `userId` do path difere do `uid` logado).

Expected outcome:
- Gravações inválidas ou de outros usuários são rejeitadas pelo Firestore (`Permission Denied`).

## Validation Commands
- `npm run lint`
- `npm run build`