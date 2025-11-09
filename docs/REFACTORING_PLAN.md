# Plano de Refatoração: Centralização de CSS e Funções

Este documento descreve o plano para centralizar estilos CSS inline e funções utilitárias no projeto Galinheiro App, visando melhorar a manutenção, reduzir duplicação e seguir melhores práticas.

## Objetivos
- Centralizar estilos inline em arquivos CSS separados.
- Mover funções utilitárias para `src/utils/index.js`.
- Melhorar a manutenibilidade e consistência visual.
- Seguir padrões de desenvolvimento (DRY, separação de responsabilidades).

## Status Geral
- **Iniciado em**: 9 de novembro de 2025
- **Progresso**: Em andamento (fase inicial concluída)
- **Responsável**: GitHub Copilot

## Partes do Projeto

### Parte 1: Mapeamento e Análise ✅ Concluído
**Descrição**: Identificar todos os usos de `style={{ ... }}` e funções duplicadas no diretório `src/`.

**Tarefas**:
- [x] Buscar por `style={{` em `src/**` usando grep.
- [x] Listar arquivos afetados e trechos relevantes.
- [x] Identificar funções duplicadas (ex.: `getAvatarColor`, `getInitial`).

**Resultados**:
- Encontrados ~175 usos de `style={{` em vários arquivos.
- Principais arquivos: `DashboardPage.jsx`, `App.jsx`, `LoginPage.jsx`, `TratamentosList.jsx`, `GalinhasList.jsx`, etc.
- Funções duplicadas: `getAvatarColor` e `getInitial` em `DashboardPage.jsx`.

**Arquivos de Evidência**:
- Resultados de busca salvos em logs internos.

### Parte 2: Criação de Estrutura Centralizada ✅ Concluído
**Descrição**: Criar arquivos CSS e mover funções para centralizar.

**Tarefas**:
- [x] Criar `src/styles/components.css` com classes reutilizáveis.
- [x] Importar `components.css` em `src/styles/globals.css`.
- [x] Mover funções para `src/utils/index.js` (exportadas).
- [x] Garantir compatibilidade com ESLint/formatação.

**Classes Criadas**:
- `.app-nav`, `.nav-inner`, `.nav-items`, `.nav-item`, `.nav-item-active` (navegação).
- `.kpi-card`, `.kpi-chip--yellow`, `.kpi-chip--primary`, etc. (KPIs).
- `.avatar` (avatares).
- `.fab-root`, `.fab-actions`, `.fab-action-btn`, `.fab-btn` (FAB).
- `.modal-overlay`, `.modal-content` (modais).
- Utilitários: `.muted`, `.muted-strong`, `.ml-1`.

**Funções Movidas**:
- `getAvatarColor`: Gera cor baseada no nome.
- `getInitial`: Obtém inicial do nome.

**Commit**: `refactor(styles): centralizar componentes CSS e mover helpers de avatar; refatorar Dashboard/App/Login para usar classes` (19de5e5).

### Parte 3: Refatoração de Componentes Principais ✅ Concluído (Prova de Conceito)
**Descrição**: Refatorar arquivos principais para usar classes e funções centralizadas.

**Tarefas**:
- [x] Atualizar `src/App.jsx`: Substituir estilos inline de nav por classes.
- [x] Atualizar `src/presentation/pages/DashboardPage.jsx`: Usar classes para KPI, avatar, FAB.
- [x] Atualizar `src/presentation/pages/LoginPage.jsx`: Usar classes para layout.
- [x] Remover estilos inline desnecessários.
- [x] Usar helpers de `src/utils/index.js`.

**Arquivos Refatorados**:
- `src/App.jsx`: Nav agora usa `.app-nav`, `.nav-item`, etc.
- `src/presentation/pages/DashboardPage.jsx`: KPIs com `.kpi-card`, `.kpi-chip`, avatar com `.avatar`.
- `src/presentation/pages/LoginPage.jsx`: Container com `.auth-container`, form com `.form-grid`.

**Testes**: Commitado e pushado para `origin/main`.

### Parte 4: Refatoração de Componentes Secundários 🔄 Em Andamento
**Descrição**: Refatorar os demais componentes em lotes para evitar regressões.

**Tarefas**:
- [x] Refatorar `src/presentation/components/GalinhasList.jsx`.
- [x] Refatorar `src/presentation/components/GalinhaForm.jsx`.
- [ ] Refatorar `src/presentation/components/TratamentoForm.jsx`.
- [ ] Refatorar `src/presentation/components/RegistroOvoForm.jsx`.
- [x] Refatorar `src/presentation/components/TratamentosList.jsx`.
- [x] Refatorar `src/presentation/pages/HistoricoPosturaPage.jsx`.
- [x] Refatorar `src/presentation/pages/TratamentosPage.jsx`.
- [ ] Refatorar `src/presentation/pages/GalinhasPage.jsx`.
- [ ] Verificar e refatorar `src/presentation/components/RequireAuth.jsx` (se necessário).

**Estratégia**: Lotes de 3-5 arquivos por vez, commitar cada lote.

**Lote 1 Concluído**: GalinhasList.jsx e GalinhaForm.jsx (commit c32172f).
**Lote 2 Concluído**: TratamentoForm.jsx e RegistroOvoForm.jsx (commit 597255c).
**Lote 3 Concluído**: TratamentosList.jsx (commit edaaae7).
**Lote 4 Concluído**: HistoricoPosturaPage.jsx (commit f040329).
**Lote 5 Concluído**: TratamentosPage.jsx (commit pendente).

### Parte 5: Testes e Validação 🔄 Pendente
**Descrição**: Garantir que a refatoração não quebrou nada.

**Tarefas**:
- [ ] Executar `npm run dev` e verificar HMR.
- [ ] Testar navegação e funcionalidades visuais.
- [ ] Corrigir erros menores (se houver).
- [ ] Verificar responsividade e acessibilidade.

### Parte 6: Documentação Final e Próximos Passos 🔄 Pendente
**Descrição**: Finalizar documentação e propor melhorias futuras.

**Tarefas**:
- [ ] Atualizar `README.md` com padrões de estilos.
- [ ] Adicionar comentários em `components.css` explicando classes.
- [ ] Propor migração para CSS Modules ou Tailwind (opcional).
- [ ] Revisar e otimizar classes não utilizadas.

## Próximos Passos Imediatos
1. Refatorar `src/presentation/pages/GalinhasPage.jsx`.
2. Commitar Lote 5 (TratamentosPage.jsx).
3. Testar localmente.
4. Verificar se há mais componentes para refatorar.

## Notas Técnicas
- **Ferramentas Usadas**: grep_search, replace_string_in_file, create_file.
- **Padrões Seguidos**: CSS classes semânticas, helpers exportados.
- **Riscos**: Possíveis regressões visuais; testar incrementalmente.
- **Benefícios**: Menos duplicação, melhor manutenção, consistência.

Última Atualização: 9 de novembro de 2025