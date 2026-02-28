# GALINHEIRO 2.0 - Planejamento de Melhorias UX/UI 🚀

> **Objetivo**: Modernizar a interface e experiência do usuário mantendo a identidade visual atual (verde #10b981) e melhorando a organização, hierarquia visual e fluxos de navegação.

---

## 📊 Análise do Estado Atual

### Paleta de Cores Atual
```css
--primary: #10b981       /* Verde principal */
--primary-dark: #059669  /* Verde escuro */
--primary-light: #d1fae5 /* Verde claro */
--secondary: #3b82f6     /* Azul */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-900: #111827
--danger: #ef4444
--danger-50: #fef2f2
--warning: #f59e0b
```

### Pontos Fortes Identificados
✅ Sistema de cores bem definido  
✅ Componentes modulares (cards, badges, botões)  
✅ Dashboard com KPIs visuais  
✅ Gráficos interativos (TimeSeriesChart, CalendarHeatmap)  
✅ Widget de status reprodutivo recém-implementado  
✅ Responsividade mobile  

### Oportunidades de Melhoria
❌ **Hierarquia visual confusa** - títulos e seções sem destaque suficiente  
❌ **Densidade de informação** - cards muito densos, difícil leitura rápida  
❌ **Navegação não intuitiva** - usuário não sabe onde clicar  
❌ **Falta de feedback visual** - estados de hover/loading pouco claros  
❌ **Formulários extensos** - páginas de cadastro sem divisão lógica  
❌ **Tabelas/listas básicas** - sem ordenação, busca ou paginação  
❌ **Espaçamento inconsistente** - cards muito próximos  
❌ **CTAs (Call-to-Actions)** - botões de ação não se destacam  

---

## 🎯 ETAPA 1: DASHBOARD (Tela Inicial)

### 1.1 Hero Section (Cabeçalho Principal)
**Problema**: Header simples sem engajamento visual  
**Solução**: Criar hero section com saudação contextual e resumo visual

#### Implementações:
- **Saudação dinâmica** com hora do dia
  ```jsx
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "☀️ Bom dia";
    if (hora < 18) return "🌤️ Boa tarde";
    return "🌙 Boa noite";
  };
  ```

- **Card de Boas-vindas** com resumo executivo
  - Galinhas ativas hoje
  - Ovos coletados hoje
  - Tarefas pendentes (tratamentos vencidos)
  - Link para ação rápida

- **Background gradient sutil** no header
  ```css
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  ```

---

### 1.2 KPIs - Restruturação Visual

**Problema**: Cards KPI muito densos, texto pequeno, difícil leitura rápida  
**Solução**: Simplificar cards, aumentar números, melhorar hierarquia

#### Novo Layout KPI:
```
┌─────────────────────────────────┐
│ 🐔 Galinhas                     │
│                                 │
│     45                          │ ← Número grande
│     Ativas                      │ ← Label clara
│                                 │
│ ──────────────────────────────  │
│ 📊 92% produzindo hoje          │ ← Métrica secundária
│ → Ver plantel                   │ ← CTA visível
└─────────────────────────────────┘
```

#### Melhorias Específicas:
1. **Aumentar tamanho do número principal**
   - De `1.5rem` para `2.5rem`
   - Font-weight: 800

2. **Remover informações detalhadas para hover**
   - Mostrar apenas 1 métrica principal
   - Demais métricas aparecem no hover com animação suave

3. **Ícones maiores e coloridos**
   - Usar emojis `font-size: 2rem`
   - Ou ícones SVG com cores personalizadas

4. **Indicadores visuais de tendência**
   - Setas ↗️↘️ para crescimento/queda
   - Barra de progresso visual para metas

5. **Micro-interações**
   ```css
   .kpi-card {
     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
   }
   .kpi-card:hover {
     transform: translateY(-8px) scale(1.02);
     box-shadow: 0 20px 40px rgba(16, 185, 129, 0.15);
   }
   ```

---

### 1.3 Widget de Status Reprodutivo - Aprimoramento

**Problema**: Widget recém-criado mas pode ter destaque visual melhor  
**Solução**: Torná-lo mais chamativo e informativo

#### Melhorias:
1. **Cards de status com gradiente**
   ```css
   .stat-card.laying {
     background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
     color: white;
   }
   .stat-card.broody {
     background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
     color: white;
   }
   ```

2. **Animação de contador** para os números
   - Números sobem animados quando carrega

3. **Gráfico de pizza pequeno** mostrando distribuição visual

4. **Alertas proativos**
   - "3 galinhas em choco há mais de 21 dias - retorno esperado em breve"

---

### 1.4 Gráficos de Produção

**Problema**: Gráficos funcionais mas visual pode ser modernizado  
**Solução**: Melhorar paleta, interatividade e acessibilidade

#### Melhorias TimeSeriesChart:
1. **Paleta de cores gradiente**
   - Linha com gradiente verde (claro → escuro)
   - Área preenchida com opacidade variável

2. **Tooltip mais rico**
   ```jsx
   <Tooltip>
     <h4>15 de Janeiro</h4>
     <div>🥚 12 ovos</div>
     <div>🐔 Galinhas: Amélia, Bela, Carla</div>
     <div>📈 +3 vs dia anterior</div>
   </Tooltip>
   ```

3. **Anotações em pontos importantes**
   - Marcar dias com produção zero
   - Destacar picos de produção

#### Melhorias CalendarHeatmap:
1. **Legenda mais clara**
   - Barra gradiente contínua em vez de 4 níveis
   - Números de referência (0, 25%, 50%, 75%, 100%)

2. **Tooltip com contexto**
   - Comparação com média do mês
   - Status das galinhas naquele dia

3. **Zoom em dias específicos** (mobile)
   - Tocar no dia abre modal com detalhes

---

### 1.5 Seção "Top Performers"

**Problema**: Cards simples sem engajamento  
**Solução**: Gamificar com ranking visual

#### Melhorias:
1. **Pódio visual** para top 3
   ```
   ┌─────┐
   │  2º │ ┌─────┐ ┌─────┐
   │ 🥈  │ │ 1º  │ │ 3º  │
   │     │ │ 🥇  │ │ 🥉  │
   └─────┘ │     │ └─────┘
           └─────┘
   ```

2. **Badge de conquista** para records
   - "🔥 Record mensal"
   - "⭐ Consistente" (7 dias seguidos)

3. **Sparkline miniatura** da produção da semana

---

### 1.6 Alertas e Notificações

**Problema**: Alertas muito discretos, usuário pode não ver  
**Solução**: Sistema de alertas hierarquizado

#### Níveis de Alerta:
1. **Crítico** (vermelho, topo da página)
   - Tratamentos vencidos
   - Temperatura/clima perigoso
   - Sistema de animação pulsante

2. **Atenção** (amarelo, antes dos KPIs)
   - Tratamentos próximos do vencimento
   - Galinhas em choco há muito tempo
   - Produção abaixo da média

3. **Informativo** (azul, widgets laterais)
   - Dicas do dia
   - Clima favorável

#### Design do Alerta Crítico:
```css
.alert-critical {
  background: linear-gradient(90deg, #fee2e2 0%, #fef2f2 100%);
  border-left: 6px solid #ef4444;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.15);
  animation: alertPulse 2s ease-in-out infinite;
}

@keyframes alertPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

---

### 1.7 FAB (Floating Action Button)

**Problema**: FAB funcional mas pode ser mais intuitivo  
**Solução**: Melhorar feedback e organização

#### Melhorias:
1. **Cores temáticas** por ação
   - Galinha: verde
   - Ovos: amarelo
   - Tratamento: vermelho

2. **Labels sempre visíveis** (não só no hover)

3. **Atalho de teclado** exibido
   - "G" para galinha
   - "O" para ovos
   - "T" para tratamento

4. **Posição inteligente** (não sobrepor conteúdo importante)

---

## 🐔 ETAPA 2: PÁGINA DE GALINHAS

### 2.1 Estrutura da Página

**Problema**: Formulário no topo + lista embaixo = rolagem excessiva  
**Solução**: Tabs ou modal para formulário

#### Nova Estrutura:
```
┌────────────────────────────────────────┐
│ Gerenciamento de Galinhas 🐔          │
│                                        │
│ [📊 Visão Geral] [➕ Adicionar]       │ ← Tabs
└────────────────────────────────────────┘

Tab "Visão Geral":
┌────────────────────────────────────────┐
│ 🔍 Buscar galinhas...    [🔽 Filtros] │
│                                        │
│ Estatísticas Rápidas:                 │
│ ┌───────┐ ┌───────┐ ┌───────┐        │
│ │45 Tot │ │43 Ati │ │2 Inati│        │
│ └───────┘ └───────┘ └───────┘        │
│                                        │
│ Grade de Galinhas                     │
│ [...cards...]                         │
└────────────────────────────────────────┘

Tab "Adicionar":
Modal ou slide-in lateral com formulário
```

---

### 2.2 Barra de Ferramentas

#### Componentes:
1. **Busca Inteligente**
   ```jsx
   <SearchBar
     placeholder="Buscar por nome, raça, idade..."
     onSearch={handleSearch}
     suggestions={galinhasSuggestions}
   />
   ```

2. **Filtros Avançados**
   - Por status (ativa/inativa/choco/muda)
   - Por raça
   - Por idade (jovem/adulta/idosa)
   - Por produtividade (alta/média/baixa)

3. **Ordenação**
   - Nome (A-Z / Z-A)
   - Idade (mais nova / mais velha)
   - Produção (maior / menor)
   - Status reprodutivo

4. **Visualização**
   - [▦] Cards (padrão)
   - [≡] Lista compacta
   - [▦▦▦] Grade densa

---

### 2.3 Cards de Galinha - Redesign

**Problema**: Cards genéricos, informações desorganizadas  
**Solução**: Card tipo "ID Badge" profissional

#### Novo Design:
```
┌───────────────────────────────────────┐
│ ┌────┐  AMÉLIA                   [⋮] │ ← Avatar + Nome + Menu
│ │ A  │  Rhode Island Red         ✅  │   Raça + Status
│ └────┘  2 anos • 156 ovos/ano        │   Métricas inline
│                                       │
│ ─────────────────────────────────────  │
│                                       │
│ 🟢 Em Postura                         │ ← Status reprodutivo
│ 📊 12 ovos (últimos 7 dias)          │   Produção recente
│ 💊 Sem tratamentos ativos             │   Saúde
│                                       │
│ [📝 Editar]  [📊 Histórico]  [🗑️]    │ ← CTAs claros
└───────────────────────────────────────┘
```

#### Features do Card:
1. **Avatar com inicial** ou foto (futuro)
   - Cor de fundo baseada no nome (hash)
   - Borda colorida por status

2. **Badge de status** flutuante
   - Verde: ativa/postura
   - Vermelho: choco
   - Amarelo: muda
   - Cinza: inativa

3. **Métricas visuais**
   - Mini gráfico sparkline de produção
   - Ícones para saúde/tratamentos

4. **Menu de contexto** (⋮)
   - Editar
   - Ver histórico completo
   - Registrar ovos
   - Iniciar tratamento
   - Arquivar/Inativar
   - Excluir

5. **Hover revela mais informações**
   - Data de nascimento completa
   - Peso (se cadastrado)
   - Observações

---

### 2.4 Modal de Cadastro/Edição

**Problema**: Formulário longo e intimidador  
**Solução**: Wizard em etapas ou accordion

#### Estrutura em Etapas:
```
Etapa 1: Informações Básicas
┌─────────────────────────────────────┐
│ [●─○─○] 1 de 3                     │
│                                     │
│ Nome da Galinha *                   │
│ [__________________________]       │
│                                     │
│ Raça                                │
│ [▼ Selecione...]                   │
│                                     │
│ Data de Nascimento                  │
│ [📅 __/__/____]                    │
│                                     │
│ [Cancelar]         [Próximo →]    │
└─────────────────────────────────────┘

Etapa 2: Status e Saúde
┌─────────────────────────────────────┐
│ [○─●─○] 2 de 3                     │
│                                     │
│ Status Reprodutivo                  │
│ ◉ Em Postura                       │
│ ○ Em Choco                         │
│ ○ Em Muda                          │
│                                     │
│ Peso (opcional)                     │
│ [_________] gramas                 │
│                                     │
│ [← Voltar]         [Próximo →]    │
└─────────────────────────────────────┘

Etapa 3: Confirmação
┌─────────────────────────────────────┐
│ [○─○─●] 3 de 3                     │
│                                     │
│ Revisar Informações:                │
│                                     │
│ 🐔 Nome: Amélia                    │
│ 🧬 Raça: Rhode Island Red          │
│ 📅 Nasc: 15/03/2023                │
│ 🟢 Status: Em Postura              │
│                                     │
│ [← Voltar]    [✓ Cadastrar]       │
└─────────────────────────────────────┘
```

#### Validação em Tempo Real:
- Nome: mínimo 2 caracteres
- Raça: sugestões enquanto digita
- Data: não pode ser futura, alerta se muito antiga

---

### 2.5 Visualização Compacta (Lista)

Para usuários com muitas galinhas:

```
┌──────────────────────────────────────────────────────────┐
│ ┌──┐ Amélia      Rhode Island  2 anos  ✅ Postura  [⋮] │
│ │A │ 12 ovos/7d  Sem tratamentos                        │
│ └──┘                                                     │
├──────────────────────────────────────────────────────────┤
│ ┌──┐ Bela        Sussex         1 ano   🔴 Choco   [⋮] │
│ │B │ 0 ovos/7d   Choco há 5 dias                        │
│ └──┘                                                     │
└──────────────────────────────────────────────────────────┘
```

---

### 2.6 Estatísticas da Página

Card fixo no topo ou sidebar:

```
┌─────────────────────────┐
│ Estatísticas do Plantel │
├─────────────────────────┤
│ 📊 Total: 45            │
│ 🟢 Ativas: 43 (96%)    │
│ 🔴 Em Choco: 3         │
│ 🟡 Em Muda: 2          │
│ ⚫ Inativas: 2         │
│                         │
│ 📈 Produção Média      │
│ 2.8 ovos/galinha/dia   │
│                         │
│ 🎂 Idade Média         │
│ 2.5 anos               │
└─────────────────────────┘
```

---

## 🥚 ETAPA 3: PÁGINA DE HISTÓRICO DE POSTURA

### 3.1 Estrutura da Página

**Problema**: Formulário + tabela simples, sem análise visual  
**Solução**: Dashboard de produção com múltiplas visualizações

#### Nova Estrutura:
```
┌─────────────────────────────────────────┐
│ Histórico de Postura 🥚                 │
│ [📊 Visão Geral] [📝 Registrar] [📋]   │
└─────────────────────────────────────────┘

Tab "Visão Geral":
┌─────────────────────────────────────────┐
│ Resumo do Período Selecionado:          │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ │ 324  │ │ 2.8  │ │ 52.3 │ │ 92%  │   │
│ │ovos  │ │média │ │gramas│ │meta  │   │
│ └──────┘ └──────┘ └──────┘ └──────┘   │
│                                         │
│ [‹ Semana Anterior]  Dez 2025  [›]     │
│                                         │
│ 📈 Gráfico de Produção                 │
│ [...TimeSeriesChart...]                │
│                                         │
│ 📅 Calendário Detalhado                │
│ [...CalendarHeatmap...]                │
│                                         │
│ 🏆 Galinhas Mais Produtivas            │
│ [...Top 5 ranking...]                  │
└─────────────────────────────────────────┘

Tab "Registrar":
Formulário otimizado de registro rápido
```

---

### 3.2 Registro Rápido de Ovos

**Problema**: Formulário tradicional demora muito  
**Solução**: Interface de "contador" visual

#### Design de Contador:
```
┌───────────────────────────────────────┐
│ Registro Rápido de Ovos 🥚            │
├───────────────────────────────────────┤
│ Selecione a(s) galinha(s):            │
│                                       │
│ ☑ Amélia     ☑ Bela      ☑ Carla    │
│ □ Diana      □ Eva       □ Fiona     │
│ □ Gisela     □ Helena    □ Iris      │
│                                       │
│ [☑ Todas] [☐ Nenhuma]                │
├───────────────────────────────────────┤
│ Quantidade de ovos por galinha:       │
│                                       │
│ ┌─────────────────────────────────┐  │
│ │        [−]  1  [+]              │  │ ← Contador grande
│ └─────────────────────────────────┘  │
│                                       │
│ Peso médio (opcional):                │
│ [_______] gramas                      │
│                                       │
│ Data: [📅 Hoje ▼]                    │
├───────────────────────────────────────┤
│ Total: 3 galinhas × 1 ovo = 3 ovos   │
│                                       │
│ [Cancelar]  [✓ Registrar (Ctrl+S)]   │
└───────────────────────────────────────┘
```

#### Features:
1. **Multi-seleção visual** de galinhas
   - Avatares clicáveis
   - Checkbox grande com nome

2. **Contador táctil**
   - Botões grandes [−] [+]
   - Input editável no centro
   - Atalhos: setas ↑↓

3. **Pré-sets rápidos**
   - "Coleta matinal" (todas ativas)
   - "Galinha específica"

4. **Validação inteligente**
   - Aviso se galinha está em choco
   - Sugestão se número parece errado

---

### 3.3 Visualização do Histórico

#### Modos de Visualização:

**Modo Calendário** (padrão):
- Heatmap atual melhorado
- Clique em dia abre detalhes

**Modo Timeline**:
```
Dezembro 2025
─────────────────────────────────

15 Dez (Hoje)
┌───────────────────────────────┐
│ 🥚 8 ovos coletados           │
│ 🐔 Amélia (2), Bela (2)...   │
│ ⚖️  Peso médio: 55g          │
│ [Ver detalhes]                │
└───────────────────────────────┘

14 Dez
┌───────────────────────────────┐
│ 🥚 12 ovos coletados          │
│ 🐔 Todas as galinhas          │
│ ⚖️  Peso médio: 58g          │
└───────────────────────────────┘

13 Dez
┌───────────────────────────────┐
│ 🥚 10 ovos coletados          │
│ ...                           │
└───────────────────────────────┘
```

**Modo Tabela** (para análise detalhada):
```
┌─────┬───────┬────────────┬────────┬──────┬────────┐
│ ID  │ Data  │ Galinha    │ Qtd    │ Peso │ Ações  │
├─────┼───────┼────────────┼────────┼──────┼────────┤
│ 234 │15 Dez │ Amélia     │ 2 ovos │ 55g  │ [⋮]   │
│ 233 │15 Dez │ Bela       │ 2 ovos │ 60g  │ [⋮]   │
│ 232 │14 Dez │ Amélia     │ 1 ovo  │ 52g  │ [⋮]   │
│ ... │  ...  │    ...     │  ...   │ ...  │  ...   │
└─────┴───────┴────────────┴────────┴──────┴────────┘

Recursos da tabela:
- Ordenação por coluna (clique no header)
- Busca/filtro rápido
- Exportar para CSV/Excel
- Edição inline (duplo clique)
- Seleção múltipla para ações em lote
```

---

### 3.4 Cards de Resumo do Período

Na parte superior, cards interativos:

```
┌─────────────────────────────────────────────────────────┐
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│ │ 🥚 OVOS     │ │ 📈 MÉDIA    │ │ 🏆 RECORD   │       │
│ │             │ │             │ │             │       │
│ │    324      │ │    2.8      │ │    18       │       │
│ │ este mês    │ │ ovos/dia    │ │ em 05 Dez   │       │
│ │             │ │             │ │             │       │
│ │ +12% vs mês │ │ ↗️ +0.3     │ │ 💪 Melhor   │       │
│ │  anterior   │ │             │ │  do ano!    │       │
│ └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                         │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│ │ ⚖️  PESO    │ │ 🎯 META     │ │ 💰 VALOR    │       │
│ │             │ │             │ │             │       │
│ │   52.3g     │ │    92%      │ │  R$ 97,20   │       │
│ │ médio       │ │ atingida    │ │ (est. R$0.30)      │
│ │             │ │             │ │             │       │
│ │ Ideal ✓     │ │ ████████░░  │ │ +R$8 vs mês│       │
│ │             │ │ 324/350     │ │  passado    │       │
│ └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
```

Cada card clicável para ver drill-down:
- Ovos → gráfico detalhado por dia
- Média → comparação histórica
- Record → timeline de records
- Peso → distribuição de pesos
- Meta → progresso diário
- Valor → calculadora econômica

---

### 3.5 Filtros Avançados

Sidebar ou modal de filtros:

```
┌───────────────────────────┐
│ 🔍 Filtros Avançados      │
├───────────────────────────┤
│ 📅 Período                │
│ ◉ Esta semana             │
│ ○ Este mês                │
│ ○ Últimos 30 dias         │
│ ○ Personalizado           │
│   [__/__] até [__/__]     │
│                           │
│ 🐔 Galinhas               │
│ ☑ Todas                   │
│ □ Amélia                  │
│ □ Bela                    │
│ □ Carla                   │
│ [+ Mais...]               │
│                           │
│ 📊 Quantidade             │
│ [0] ─────●──── [5]        │ ← Slider range
│                           │
│ ⚖️  Peso                  │
│ [40g] ────●──── [70g]     │
│                           │
│ [Limpar] [Aplicar]        │
└───────────────────────────┘
```

---

### 3.6 Análise Preditiva (Futuro)

Card de insights automáticos:

```
┌─────────────────────────────────────────┐
│ 💡 Insights Inteligentes                │
├─────────────────────────────────────────┤
│ • Amélia está 15% abaixo da média.     │
│   Pode estar entrando em muda.          │
│                                         │
│ • Produção cai às terças-feiras (-20%) │
│   Considere ajustar rotina de coleta.  │
│                                         │
│ • Meta de 350 ovos/mês está em risco.  │
│   Faltam 26 ovos para atingir. (8dias) │
│                                         │
│ • Melhor período: 6h-9h (68% dos ovos) │
└─────────────────────────────────────────┘
```

---

## 💊 ETAPA 4: PÁGINA DE TRATAMENTOS

### 4.1 Estrutura da Página

**Problema**: Lista simples de tratamentos, difícil priorizar  
**Solução**: Kanban board por status + cards visuais

#### Nova Estrutura:
```
┌─────────────────────────────────────────┐
│ Gerenciamento de Tratamentos 💊         │
│ [📋 Todos] [🟡 Ativos] [✅ Concluídos] │
└─────────────────────────────────────────┘

Visualização Kanban:
┌───────────────────────────────────────────────────────┐
│ 🚨 CRÍTICO (2)  │ ⚠️ ATENÇÃO (3) │ ✅ EM DIA (5)     │
├──────────────────┼─────────────────┼──────────────────┤
│ ┌──────────────┐ │ ┌─────────────┐│ ┌──────────────┐│
│ │ Amélia      ││ │ │ Bela       ││ │ │ Carla       ││
│ │ Antibiótico ││ │ │ Vitaminas  ││ │ │ Vermífugo   ││
│ │ Venc há 2d  ││ │ │ Vence em 1d││ │ │ Iniciado    ││
│ └──────────────┘ │ └─────────────┘│ │  hoje        ││
│                  │                 │ └──────────────┘│
│ ┌──────────────┐ │ ┌─────────────┐│                  │
│ │ Diana       ││ │ │ Eva        ││ │ [+ Novo]        │
│ │ ...         ││ │ │ ...        ││ │                  │
│ └──────────────┘ │ └─────────────┘│ │                  │
└──────────────────┴─────────────────┴──────────────────┘
```

---

### 4.2 Card de Tratamento - Redesign

**Problema**: Informações importantes perdidas no meio do card  
**Solução**: Hierarquia visual clara com cores e ícones

#### Card Crítico (Vencido):
```
┌─────────────────────────────────────────────┐
│ ────────────── VENCIDO HÁ 2 DIAS ──────────│ ← Banner vermelho
│                                             │
│ 💊 ANTIBIÓTICO - Infecção Respiratória     │ ← Tipo + descrição
│                                             │
│ 🐔 AMÉLIA                                   │ ← Galinha em destaque
│    Rhode Island Red • 2 anos               │
│                                             │
│ ┌──────────────────────────────────────┐   │
│ │ 📅 Início:  10 Dez 2025              │   │
│ │ ⏰ Fim:     13 Dez 2025 (há 2 dias)  │   │ ← Datas com destaque
│ │ 💊 Duração: 3 dias                   │   │
│ └──────────────────────────────────────┘   │
│                                             │
│ 📋 Aplicar 2ml de amoxicilina oral, 2x/dia │
│                                             │
│ [✓ CONCLUIR AGORA]  [📝 Editar]  [⋮]       │ ← CTA crítico
└─────────────────────────────────────────────┘
```

#### Card Ativo (Em Dia):
```
┌─────────────────────────────────────────────┐
│ 💊 Vermífugo Preventivo                     │
│ 🐔 Carla                                    │
│                                             │
│ ╔════════════════════════════════════════╗  │
│ ║ Progresso: 2 de 7 dias ████░░░░░░  29% ║  │ ← Barra progresso
│ ╚════════════════════════════════════════╝  │
│                                             │
│ 📅 Vence em: 5 dias (20 Dez)               │
│ ⏱️  Próxima dose: Hoje às 18h              │
│                                             │
│ [✓ Aplicar Dose]  [Ver Detalhes]  [⋮]     │
└─────────────────────────────────────────────┘
```

#### Card Concluído:
```
┌─────────────────────────────────────────────┐
│ ✅ CONCLUÍDO                                │
│                                             │
│ 💊 Antibiótico - Infecção Respiratória     │
│ 🐔 Amélia                                   │
│                                             │
│ 📅 10 Dez - 13 Dez (3 dias)                │
│ ✅ Concluído em: 15 Dez 2025               │
│                                             │
│ 📝 Resultado: Recuperação completa          │
│    Galinha voltou à produção normal.       │
│                                             │
│ [📊 Ver Histórico]  [📄 Relatório]  [⋮]   │
└─────────────────────────────────────────────┘
```

---

### 4.3 Modal de Conclusão de Tratamento

**Problema**: Conclusão sem contexto ou follow-up  
**Solução**: Modal estruturado com checklist

```
┌──────────────────────────────────────────────┐
│ Concluir Tratamento - Amélia                 │
├──────────────────────────────────────────────┤
│                                              │
│ ✅ Checklist de Verificação:                │
│                                              │
│ ☑ Todas as doses foram aplicadas            │
│ ☑ Galinha está se alimentando normalmente   │
│ ☑ Comportamento voltou ao normal            │
│ ☐ Galinha voltou a botar ovos               │
│                                              │
│ Resultado do Tratamento:                     │
│ ◉ ✅ Sucesso - Recuperação completa         │
│ ○ ⚠️  Parcial - Necessita acompanhamento    │
│ ○ ❌ Sem sucesso - Piorou ou sem melhora    │
│                                              │
│ Observações (opcional):                      │
│ ┌──────────────────────────────────────┐    │
│ │ Galinha se recuperou bem. Voltou a   │    │
│ │ produzir ovos 2 dias após o fim.     │    │
│ └──────────────────────────────────────┘    │
│                                              │
│ ☐ Agendar consulta veterinária de retorno   │
│                                              │
│ [Cancelar]            [✓ Concluir]          │
└──────────────────────────────────────────────┘
```

---

### 4.4 Formulário de Novo Tratamento

Wizard em etapas:

```
Etapa 1: Galinha e Sintomas
┌─────────────────────────────────────┐
│ [●─○─○─○] 1 de 4                   │
│                                     │
│ Qual galinha será tratada?          │
│ [▼ Selecione ou busque...]         │
│                                     │
│ Status da galinha:                  │
│ 🟢 Ativa • Em Postura              │
│ 📊 Produção: 2 ovos/semana         │
│ 💊 Sem tratamentos ativos          │
│                                     │
│ Sintomas observados:                │
│ ☑ Tosse/espirros                   │
│ ☑ Falta de apetite                 │
│ ☐ Diarreia                         │
│ ☐ Penas arrepiadas                 │
│ ☐ Letargia                         │
│ ☐ Outros: [____________]           │
│                                     │
│ [Cancelar]         [Próximo →]    │
└─────────────────────────────────────┘

Etapa 2: Tipo de Tratamento
┌─────────────────────────────────────┐
│ [○─●─○─○] 2 de 4                   │
│                                     │
│ Tipo de tratamento:                 │
│ ◉ Antibiótico                      │
│ ○ Vitaminas/Suplemento             │
│ ○ Vermífugo                        │
│ ○ Antifúngico                      │
│ ○ Outro: [____________]            │
│                                     │
│ Medicamento:                        │
│ [Amoxicilina ▼]                    │
│                                     │
│ ℹ️ Sugestão baseada nos sintomas:  │
│    Antibiótico de amplo espectro   │
│    para infecções respiratórias    │
│                                     │
│ [← Voltar]         [Próximo →]    │
└─────────────────────────────────────┘

Etapa 3: Dosagem e Duração
┌─────────────────────────────────────┐
│ [○─○─●─○] 3 de 4                   │
│                                     │
│ Dose por aplicação:                 │
│ [2] ml  [▼]                        │
│                                     │
│ Frequência:                         │
│ [2] vezes por dia                  │
│ ○ Manhã  ○ Tarde  ○ Noite         │
│                                     │
│ Duração do tratamento:              │
│ [7] dias                           │
│                                     │
│ Data de início:                     │
│ ◉ Hoje (15 Dez)                    │
│ ○ Outra data: [📅 __/__/__]       │
│                                     │
│ 📅 Previsão de término: 22 Dez     │
│                                     │
│ [← Voltar]         [Próximo →]    │
└─────────────────────────────────────┘

Etapa 4: Confirmação
┌─────────────────────────────────────┐
│ [○─○─○─●] 4 de 4                   │
│                                     │
│ Revisar Tratamento:                 │
│                                     │
│ 🐔 Galinha: Amélia                 │
│ 💊 Tipo: Antibiótico               │
│ 💉 Medicamento: Amoxicilina        │
│ 📏 Dose: 2ml, 2x/dia               │
│ 📅 Início: 15 Dez 2025             │
│ ⏰ Término: 22 Dez 2025 (7 dias)   │
│                                     │
│ ☑ Criar lembrete no início do      │
│   tratamento                        │
│ ☑ Notificar 1 dia antes do término │
│                                     │
│ Observações adicionais:             │
│ ┌───────────────────────────────┐  │
│ │ Aplicar junto com a ração     │  │
│ │ matinal e vespertina          │  │
│ └───────────────────────────────┘  │
│                                     │
│ [← Voltar]    [✓ Iniciar]         │
└─────────────────────────────────────┘
```

---

### 4.5 Dashboard de Saúde do Plantel

Card resumo no topo:

```
┌──────────────────────────────────────────────────────┐
│ 📊 Status Geral de Saúde do Galinheiro              │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│ │ 💚 Saudável│ │ 💊 Em Trat │ │ 🚨 Crítico │       │
│ │    40      │ │     5      │ │     2      │       │
│ │  galinhas  │ │  galinhas  │ │  galinhas  │       │
│ └────────────┘ └────────────┘ └────────────┘       │
│                                                      │
│ Estatísticas:                                        │
│ • Taxa de recuperação: 94% (últimos 30 dias)        │
│ • Tratamentos concluídos: 23                         │
│ • Tempo médio de tratamento: 5.2 dias               │
│                                                      │
│ ⚠️ Alertas:                                         │
│ • 2 tratamentos vencidos - requer ação imediata     │
│ • 3 tratamentos vencem em menos de 24h              │
└──────────────────────────────────────────────────────┘
```

---

### 4.6 Histórico e Relatórios

Visualização tipo "medical record":

```
┌─────────────────────────────────────────────┐
│ 📋 Histórico Médico - Amélia                │
├─────────────────────────────────────────────┤
│                                             │
│ 2025                                        │
│ │                                           │
│ ├─ 🟢 Dez: Antibiótico (3 dias) ✅         │
│ │   Recuperação completa                    │
│ │                                           │
│ ├─ 🟡 Nov: Vitaminas (7 dias) ✅           │
│ │   Suplementação preventiva                │
│ │                                           │
│ ├─ 🔴 Out: Vermífugo (5 dias) ✅           │
│ │   Parasitas eliminados                    │
│ │                                           │
│ └─ 🟢 Set: Check-up ✅                     │
│     Tudo normal                             │
│                                             │
│ 2024                                        │
│ │                                           │
│ └─ [Ver mais...]                            │
│                                             │
│ [📊 Gerar Relatório] [📧 Enviar Email]    │
└─────────────────────────────────────────────┘
```

---

## 🎨 MELHORIAS TRANSVERSAIS (Todas as Páginas)

### 1. Sistema de Notificações

Toast/Snackbar no canto superior direito:

```
┌──────────────────────────────────────┐
│ ✅ Galinha cadastrada com sucesso!   │
│ Amélia foi adicionada ao plantel.    │
│                                   [X]│
└──────────────────────────────────────┘
```

Tipos:
- **Sucesso** (verde): operações bem-sucedidas
- **Erro** (vermelho): falhas ou validações
- **Aviso** (amarelo): alertas importantes
- **Info** (azul): informações gerais

---

### 2. Skeleton Loaders

Em vez de "Carregando...", usar skeleton screens:

```
┌────────────────────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░        │ ← Simulação de conteúdo
│                            │   carregando
│ ▓▓▓▓▓░░░░  ▓▓▓▓▓▓▓░░░░   │
│                            │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░   │
└────────────────────────────┘
```

---

### 3. Empty States Ilustrados

Quando não há dados:

```
┌────────────────────────────────────┐
│                                    │
│          🐔                        │
│     (ilustração SVG)               │
│                                    │
│  Nenhuma galinha cadastrada ainda  │
│                                    │
│  Comece adicionando sua primeira   │
│  galinha ao plantel!               │
│                                    │
│  [➕ Cadastrar Primeira Galinha]  │
│                                    │
└────────────────────────────────────┘
```

---

### 4. Breadcrumbs e Navegação

No topo de cada página:

```
🏠 Dashboard › 🐔 Galinhas › Amélia
```

---

### 5. Atalhos de Teclado

Modal de atalhos (abrir com `?`):

```
┌─────────────────────────────────────┐
│ ⌨️ Atalhos de Teclado               │
├─────────────────────────────────────┤
│ Navegação:                          │
│ • G          → Ir para Galinhas     │
│ • H          → Ir para Histórico    │
│ • T          → Ir para Tratamentos  │
│ • /          → Buscar               │
│                                     │
│ Ações:                              │
│ • N          → Novo item            │
│ • Ctrl+S     → Salvar               │
│ • Esc        → Cancelar/Fechar      │
│ • ?          → Este menu            │
└─────────────────────────────────────┘
```

---

### 6. Tema Escuro (Futuro)

Toggle no canto superior direito:

```css
:root[data-theme="dark"] {
  --primary: #34d399;
  --gray-50: #1f2937;
  --gray-900: #f9fafb;
  /* ... inversões */
}
```

---

### 7. Feedback Háptico (Mobile)

Vibrações sutis ao:
- Registrar ovos com sucesso
- Concluir tratamento
- Alertas críticos

```javascript
if ('vibrate' in navigator) {
  navigator.vibrate([50, 30, 50]); // padrão de vibração
}
```

---

## 📱 OTIMIZAÇÕES MOBILE

### 1. Bottom Navigation

Em vez de menu lateral, usar bottom nav no mobile:

```
┌─────────────────────────────────┐
│                                 │
│  (Conteúdo da página)           │
│                                 │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  🏠     🐔      🥚      💊     │ ← Sempre visível
│ Home  Galinhas  Ovos  Tratam.  │
└─────────────────────────────────┘
```

---

### 2. Swipe Gestures

- **Swipe direita**: voltar página
- **Swipe esquerda**: próxima página
- **Swipe down**: atualizar dados
- **Pull to refresh**: reload

---

### 3. Modo Offline

Aviso quando sem conexão:

```
┌─────────────────────────────────┐
│ 📡 Você está offline            │
│ Alterações serão sincronizadas  │
│ quando a conexão retornar.      │
└─────────────────────────────────┘
```

---

## 🚀 CRONOGRAMA DE IMPLEMENTAÇÃO

### Fase 1: Foundation (Semana 1-2)
- [ ] Criar sistema de componentes base (botões, cards, inputs)
- [ ] Implementar skeleton loaders
- [ ] Sistema de notificações toast
- [ ] Empty states

### Fase 2: Dashboard (Semana 3)
- [ ] Hero section com saudação
- [ ] Reestruturar KPIs
- [ ] Melhorar gráficos
- [ ] Alertas hierarquizados

### Fase 3: Galinhas (Semana 4)
- [ ] Barra de ferramentas (busca/filtros)
- [ ] Redesign dos cards
- [ ] Modal de cadastro em wizard
- [ ] Estatísticas da página

### Fase 4: Histórico (Semana 5)
- [ ] Tabs de visualização
- [ ] Contador rápido de ovos
- [ ] Cards de resumo
- [ ] Múltiplas visualizações (calendário/timeline/tabela)

### Fase 5: Tratamentos (Semana 6)
- [ ] Kanban board
- [ ] Redesign dos cards por status
- [ ] Modal de conclusão estruturado
- [ ] Wizard de novo tratamento
- [ ] Dashboard de saúde

### Fase 6: Polish & Testing (Semana 7-8)
- [ ] Otimizações mobile
- [ ] Atalhos de teclado
- [ ] Testes de usabilidade
- [ ] Ajustes finais de acessibilidade
- [ ] Performance optimization

---

## 📏 MÉTRICAS DE SUCESSO

### Quantitativas:
- **Tempo de cadastro**: reduzir de 2min → 30s
- **Cliques para ação**: reduzir de 4-5 → 2-3
- **Taxa de erro**: reduzir validações falhadas em 50%
- **Performance**: manter Lighthouse score > 90

### Qualitativas:
- **Facilidade de uso**: pesquisa com usuários (escala 1-5)
- **Clareza visual**: hierarquia de informação compreensível
- **Satisfação**: NPS > 8

---

## 🎨 GUIA DE ESTILO VISUAL

### Tipografia:
- **Títulos H1**: 2rem (32px), font-weight: 800
- **Títulos H2**: 1.5rem (24px), font-weight: 700
- **Títulos H3**: 1.25rem (20px), font-weight: 600
- **Corpo**: 1rem (16px), font-weight: 400
- **Small**: 0.875rem (14px)

### Espaçamentos (baseado em 8px):
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)

### Bordas:
- **Raio padrão**: 0.75rem (12px)
- **Raio pequeno**: 0.5rem (8px)
- **Raio grande**: 1rem (16px)
- **Circular**: 9999px ou 50%

### Sombras:
- **Baixa**: `0 2px 4px rgba(0,0,0,0.05)`
- **Média**: `0 4px 6px rgba(0,0,0,0.1)`
- **Alta**: `0 10px 15px rgba(0,0,0,0.1)`
- **Muito alta**: `0 20px 40px rgba(0,0,0,0.15)`

### Animações:
- **Duração padrão**: 200-300ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover**: `transform: translateY(-2px)`
- **Active**: `transform: scale(0.98)`

---

## ✅ PRÓXIMOS PASSOS

1. **Revisão do Planejamento**: Aprovar estrutura e prioridades
2. **Criação de Protótipos**: Figma/Sketch dos principais fluxos
3. **Validação com Usuários**: Testes de conceito
4. **Implementação Incremental**: Seguir cronograma por etapas
5. **Testes Contínuos**: A cada etapa completada
6. **Iteração**: Ajustes baseados em feedback

---

**Documento criado em**: 27 de fevereiro de 2026  
**Versão**: 1.0  
**Status**: Planejamento Inicial - Aguardando Aprovação
