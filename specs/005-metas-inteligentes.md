# Especificação: Metas Inteligentes de Proteína Baseadas em Atividade Física

## Objetivo
Aprimorar o cálculo da meta diária de proteína, tornando-a dinâmica com base no nível de atividade física do usuário, em vez de um valor fixo estático. O sistema sugerirá automaticamente um ajuste na meta nos dias de treino mais intenso.

## Regras de Negócio
1. O usuário poderá cadastrar seu nível de atividade (Sedentário, Leve, Moderado, Intenso, Extremo).
2. A meta de proteína será calculada usando a fórmula: `Peso (kg) * Fator_Atividade`.
   - Sedentário: 1.2 g/kg
   - Leve: 1.6 g/kg
   - Moderado: 2.0 g/kg
   - Intenso: 2.4 g/kg
   - Extremo: 3.0 g/kg
3. Usuários com objetivo "Ganho Muscular" terão um acréscimo de 10% sobre o fator base.
4. A meta poderá ser sobrescrita manualmente pelo usuário a qualquer momento.
5. O sistema exibirá um selo "Meta Inteligente" quando o valor for sugerido automaticamente.

## Fluxo Principal
1. Usuário acessa a tela de Perfil
2. Seleciona "Nível de Atividade Física"
3. Escolhe uma das 5 opções
4. Sistema recalcula a meta de proteína em tempo real
5. Exibe o novo valor sugerido com um tooltip explicativo
6. Usuário confirma ou ajusta manualmente

## Fluxo Alternativo (Meta Manual)
1. Usuário desativa a opção "Meta Automática"
2. Insere um valor personalizado na calculadora
3. Sistema salva a preferência e utiliza o valor fixo nos dashboards

## Critérios de Aceite
- [ ] O fator de atividade deve influenciar diretamente o cálculo do progresso diário
- [ ] A alteração do nível de atividade deve refletir no dashboard em até 1 segundo
- [ ] O histórico semanal deve armazenar o nível de atividade de cada dia para relatórios futuros
- [ ] Em caso de mudança de objetivo, o sistema deve perguntar se o usuário deseja resetar a meta para o valor sugerido
- [ ] A interface deve exibir um gráfico comparativo: "Sua meta vs. Meta sugerida"

## Tecnologias
- React Context API (para gerenciar estado do perfil do usuário)
- Firebase Firestore (para armazenar o nível de atividade e meta personalizada)
- Tailwind CSS (para estilização dos novos componentes)

## Tarefas
- [ ] Criar serviço `goalCalculator.ts` com as fórmulas e fatores
- [ ] Adicionar campo `activityLevel` no schema do usuário no Firestore
- [ ] Desenvolver componente `ActivityLevelSelector` com ícones para cada nível
- [ ] Integrar o cálculo dinâmico no Dashboard e no Histórico
- [ ] Atualizar os testes unitários para cobrir as novas regras de negócio
