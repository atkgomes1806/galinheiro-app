# Galinheiro App 🐔

Este projeto é uma aplicação React chamada "galinheiro-app", que consome dados do Supabase e segue a Arquitetura Limpa. A aplicação é projetada para gerenciar um galinheiro completo, incluindo galinhas, tratamentos veterinários e registros de produção de ovos.

## ✨ Destaques Recentes

- ✅ **Organização Scripts (Novembro 2025)**: Pasta `/scripts/` centralizada com testes e utilitários
- ✅ **Teste Comparativo OAuth vs Bearer**: Validação completa das credenciais da API Embrapa
- ✅ **Refatoração Completa (Novembro 2025)**: Centralização de CSS e funções utilitárias
- 🌍 **Integração API Embrapa**: Dados climáticos em tempo real no dashboard
- � **Sistema de Design**: Classes CSS reutilizáveis e consistentes
- 📱 **Interface Moderna**: UI responsiva e acessível
- 🏗️ **Arquitetura Limpa**: Separação clara de responsabilidades
- 🚀 **Performance Otimizada**: CSS e JavaScript eficientes

## ⚠️ **IMPORTANTE: Estrutura de Pastas**

**ATENÇÃO**: O projeto está localizado em:
```
C:\Projetos\galinheiro-app\galinheiro-app\
```

**NÃO** em `C:\Projetos\galinheiro-app\` (sem a pasta duplicada).

### 📂 Caminhos Corretos:
- **Projeto**: `C:\Projetos\galinheiro-app\galinheiro-app\`
- **Backend**: `C:\Projetos\galinheiro-app\galinheiro-app\backend\`
- **Scripts**: `C:\Projetos\galinheiro-app\galinheiro-app\scripts\`

### 🔧 Comandos com Caminho Correto:
```bash
# Navegar para o projeto
cd "C:\Projetos\galinheiro-app\galinheiro-app"

# Iniciar frontend
cd "C:\Projetos\galinheiro-app\galinheiro-app"
npm run dev

# Iniciar backend
cd "C:\Projetos\galinheiro-app\galinheiro-app\backend"
npm start

# Executar scripts
cd "C:\Projetos\galinheiro-app\galinheiro-app"
node scripts/test-embrapa-api.js
```

## Estrutura do Projeto

A estrutura do projeto é organizada seguindo princípios de Arquitetura Limpa:

```
galinheiro-app
├── index.html                    # Arquivo HTML principal
├── package.json                  # Dependências e configurações do npm
├── vite.config.js               # Configuração do Vite
├── .gitignore                    # Arquivos e pastas a serem ignorados pelo Git
├── .env.example                  # Exemplo de variáveis de ambiente
├── README.md                     # Documentação do projeto
├── backend/                      # Servidor proxy para API Embrapa
│   ├── server.js                 # Servidor Express
│   ├── package.json              # Dependências do backend
│   ├── .env                      # Variáveis de ambiente do backend
│   └── src/
│       ├── routes/               # Rotas do backend
│       │   └── weather.js        # Endpoints de clima
│       └── services/             # Serviços do backend
│           └── embrapaAuth.js    # Autenticação OAuth 2.0
├── docs/
│   ├── REFACTORING_PLAN.md       # Plano detalhado da refatoração
│   └── TESTES_CLIMAPI_REAL.md    # Log dos testes da API Embrapa
├── scripts/                      # 🆕 Scripts de teste e utilitários
│   ├── README.md                 # Documentação dos scripts
│   ├── test-connection.js        # Teste de conectividade básica
│   ├── test-embrapa-api.js       # Teste comparativo OAuth vs Bearer
│   ├── test-real-api.js          # Teste detalhado com Bearer Token
│   └── start-backend.ps1         # Script PowerShell para iniciar backend
├── public
│   └── robots.txt                # Instruções para motores de busca
└── src
    ├── main.jsx                  # Ponto de entrada da aplicação
    ├── App.jsx                   # Componente principal da aplicação
    ├── styles
    │   ├── globals.css           # Estilos globais e variáveis CSS
    │   └── components.css        # Classes CSS reutilizáveis centralizadas
    ├── utils
    │   └── index.js              # Funções utilitárias centralizadas
    ├── presentation
    │   ├── components            # Componentes da interface
    │   │   ├── GalinhasList.jsx      # Lista de galinhas
    │   │   ├── GalinhaForm.jsx       # Formulário de galinha
    │   │   ├── TratamentosList.jsx   # Lista de tratamentos
    │   │   ├── TratamentoForm.jsx    # Formulário de tratamento
    │   │   ├── RegistroOvoForm.jsx   # Formulário de registro de ovos
    │   │   └── RequireAuth.jsx       # Componente de autenticação
    │   ├── pages                  # Páginas da aplicação
    │   │   ├── DashboardPage.jsx     # Dashboard principal
    │   │   ├── GalinhasPage.jsx      # Gestão de galinhas
    │   │   ├── TratamentosPage.jsx   # Gestão de tratamentos
    │   │   ├── HistoricoPosturaPage.jsx # Histórico de ovos
    │   │   └── LoginPage.jsx         # Página de login
    │   └── routes.jsx              # Definição das rotas
    ├── application
    │   ├── use-cases              # Casos de uso da aplicação
    │   │   ├── listarGalinhas.js
    │   │   ├── criarGalinha.js
    │   │   ├── atualizarGalinha.js
    │   │   ├── removerGalinha.js
    │   │   ├── listarTratamentos.js
    │   │   ├── criarTratamento.js
    │   │   ├── concluirTratamento.js
    │   │   ├── listarRegistrosOvos.js
    │   │   ├── registrarOvo.js
    │   │   └── obterSumarioGalinheiro.js
    │   └── services               # Injeção de dependências
    │       ├── galinhaInjector.js
    │       ├── registroOvoInjector.js
    │       └── tratamentoInjector.js
    ├── domain
    │   ├── entities               # Entidades de domínio
    │   │   └── Galinha.js
    │   └── repositories           # Interfaces de repositório
    │       ├── GalinhaRepository.js
    │       ├── RegistroOvoRepository.js
    │       └── TratamentoRepository.js
    └── infrastructure
        ├── config                 # Configurações de injeção
        │   ├── galinhaInjector.js
        │   ├── registroOvoInjector.js
        │   └── tratamentoInjector.js
        ├── embrapa                # Integração API Embrapa
        │   ├── EmbrapaApiClient.js        # Cliente OAuth 2.0
        │   └── EmbrapaWeatherService.js   # Serviço de clima
        └── supabase               # Implementações de infraestrutura
            ├── client.js
            ├── GalinhaRepositorySupabase.js
            ├── RegistroOvoRepositorySupabase.js
            └── TratamentoRepositorySupabase.js
```

## 🧪 Scripts de Teste e Utilitários

O projeto inclui uma pasta `/scripts/` com ferramentas para desenvolvimento e validação:

### 📂 Arquivos Disponíveis

- **`test-connection.js`**: Teste de conectividade básica do projeto
- **`test-embrapa-api.js`**: � Teste comparativo OAuth 2.0 vs Bearer Token
- **`test-real-api.js`**: Teste detalhado com token Bearer da API Embrapa
- **`start-backend.ps1`**: Script PowerShell para iniciar o backend facilmente
- **`README.md`**: Documentação completa dos scripts

### 🔧 Como Usar os Scripts

```bash
# Testar conectividade básica
node scripts/test-connection.js

# Comparar OAuth vs Bearer Token (recomendado)
node scripts/test-embrapa-api.js

# Teste detalhado da API com Bearer
node scripts/test-real-api.js
```

### 🎯 Resultado dos Testes Recentes

**Teste OAuth vs Bearer Token (9/11/2025)**:
- ✅ **OAuth 2.0**: Funcionando perfeitamente (Status 200)
- ❌ **Bearer Token**: Expirado (Status 401)
- ✅ **API Embrapa**: 19 variáveis disponíveis
- ✅ **Credenciais**: Consumer Key/Secret validados

**Conclusão**: O backend atual com OAuth 2.0 está otimizado e não necessita mudanças.

## 🎨 Padrões de CSS

O projeto utiliza um sistema de CSS centralizado para garantir consistência visual:

### Estrutura de Estilos
- **`src/styles/globals.css`**: Variáveis CSS, resets globais e estilos base
- **`src/styles/components.css`**: Classes reutilizáveis para componentes

### Convenções de Nomenclatura
- **Classes semânticas**: Nomes descritivos (`.card`, `.btn-primary`, `.page-header`)
- **Modificadores**: Sufixos para variações (`.btn-outline`, `.badge-warning`)
- **Estados**: Prefixos para estados (`.nav-item-active`, `.fab-rotate`)

### Classes Principais
```css
/* Layout */
.page-header, .page-title, .page-subtitle
.card, .form-container, .modal-overlay

/* Formulários */
.form-group, .form-label, .form-input, .form-actions
.btn, .btn-primary, .btn-secondary, .btn-danger

/* Navegação */
.app-nav, .nav-item, .nav-item-active

/* Componentes específicos */
.kpi-card, .avatar, .badge, .fab-root
```

### Uso Recomendado
```jsx
// ✅ Correto: Usar classes centralizadas
<div className="card page-header">
  <h1 className="page-title">Título</h1>
  <p className="page-subtitle">Subtítulo</p>
</div>

// ❌ Evitar: Estilos inline
<div style={{ marginBottom: '1rem' }}>
  <h1 style={{ margin: 0 }}>Título</h1>
</div>
```

## 🔄 Refatoração de Novembro 2025

### Objetivos Alcançados
- ✅ **Centralização de CSS**: ~175 estilos inline substituídos por classes reutilizáveis
- ✅ **Funções Utilitárias**: `getAvatarColor()` e `getInitial()` movidas para `src/utils/index.js`
- ✅ **Consistência Visual**: Sistema de design unificado
- ✅ **Manutenibilidade**: Código mais organizado e fácil de manter

### Arquivos Refatorados
- **App.jsx**: Navegação com classes CSS
- **DashboardPage.jsx**: KPIs, alertas e métricas
- **LoginPage.jsx**: Formulário de autenticação
- **TratamentosPage.jsx**: Gestão de tratamentos
- **HistoricoPosturaPage.jsx**: Registros de ovos
- **Todos os componentes**: Estilos inline removidos

### Plano Detalhado
Para mais detalhes sobre a refatoração, consulte `docs/REFACTORING_PLAN.md`.

## 🏗️ Arquitetura e Melhores Práticas

### Arquitetura Limpa
O projeto segue os princípios da Clean Architecture:

- **Domain**: Regras de negócio puras
- **Application**: Casos de uso e serviços
- **Infrastructure**: Implementações concretas
- **Presentation**: Interface do usuário

### Padrões Implementados
- **DRY (Don't Repeat Yourself)**: Funções e estilos reutilizáveis
- **Separation of Concerns**: Responsabilidades bem definidas
- **Dependency Injection**: Injeção de dependências configurável
- **Component Composition**: Componentes modulares e reutilizáveis

### Desenvolvimento
- **React Hooks**: Gerenciamento de estado moderno
- **React Router**: Navegação declarativa
- **Supabase**: Backend as a Service
- **Vite**: Build tool rápido e moderno

## Instalação

Para instalar as dependências do projeto, execute:

```
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

### Supabase (Obrigatório)
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### API Embrapa - Dados Climáticos (Opcional)
```bash
VITE_EMBRAPA_API_URL=https://api.cnptia.embrapa.br/climapi/v1
VITE_EMBRAPA_TOKEN_URL=https://api.cnptia.embrapa.br/token
VITE_EMBRAPA_CONSUMER_KEY=your_consumer_key
VITE_EMBRAPA_CONSUMER_SECRET=your_consumer_secret

# Localização do seu galinheiro
VITE_LOCATION_LATITUDE=-23.5505
VITE_LOCATION_LONGITUDE=-46.6333
VITE_LOCATION_NAME=São Paulo
```

**Como obter credenciais Embrapa:**
1. Acesse: https://api.cnptia.embrapa.br
2. Registre-se e crie uma aplicação
3. Obtenha Consumer Key e Consumer Secret
4. Configure as coordenadas do seu galinheiro

## Executando a Aplicação

### ⚠️ **LEMBRETE DE CAMINHO**
Todos os comandos devem ser executados a partir de:
```
C:\Projetos\galinheiro-app\galinheiro-app\
```

### Frontend (React)
```bash
# Navegar para a pasta correta
cd "C:\Projetos\galinheiro-app\galinheiro-app"

# Instalar dependências (primeira vez)
npm install

# Iniciar aplicação
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Backend (Servidor Proxy)
```bash
# Opção 1: Script PowerShell (recomendado)
cd "C:\Projetos\galinheiro-app\galinheiro-app"
PowerShell -ExecutionPolicy Bypass -File "scripts\start-backend.ps1"

# Opção 2: Manual
cd "C:\Projetos\galinheiro-app\galinheiro-app\backend"
npm install  # primeira vez
npm start
```

O servidor backend estará disponível em `http://localhost:3002`.

### 🔧 Ordem de Inicialização
1. **Primeiro**: Abra um terminal e navegue para `C:\Projetos\galinheiro-app\galinheiro-app\backend`
2. **Execute**: `npm start` (backend na porta 3002)
3. **Segundo**: Abra outro terminal e navegue para `C:\Projetos\galinheiro-app\galinheiro-app`
4. **Execute**: `npm run dev` (frontend na porta 3000)
5. **Verificação**: Acesse http://localhost:3000

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Para isso, faça um fork do repositório e envie um pull request.

### Padrões de Desenvolvimento

#### CSS
- **Evite estilos inline**: Use sempre classes de `src/styles/components.css`
- **Classes semânticas**: Nomes descritivos que representam o propósito
- **Consistência**: Siga os padrões estabelecidos na refatoração

#### JavaScript/React
- **Funções utilitárias**: Adicione em `src/utils/index.js` se reutilizáveis
- **Componentes**: Mantenha a separação de responsabilidades
- **Arquitetura Limpa**: Respeite as camadas (Domain, Application, Infrastructure, Presentation)

#### Commits
- **Mensagens descritivas**: Use prefixos como `feat:`, `fix:`, `refactor:`
- **Commits pequenos**: Alterações focadas e testáveis
- **Documentação**: Atualize o README quando necessário

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Testes
Antes de enviar um PR, certifique-se de que:
- ✅ A aplicação roda sem erros (`npm run dev`)
- ✅ Não há erros de linting
- ✅ Os estilos seguem os padrões estabelecidos
- ✅ A funcionalidade foi testada manualmente

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 com Hooks
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **APIs Externas**: Embrapa ClimAPI (dados agrometeorológicos)
- **Autenticação**: OAuth 2.0 Client Credentials
- **Estilização**: CSS Modules + CSS Custom Properties
- **Roteamento**: React Router v6
- **Gerenciamento de Estado**: React Hooks (useState, useEffect)
- **Arquitetura**: Clean Architecture
- **Versionamento**: Git

## 🌤️ Integração com API Embrapa ClimAPI

O dashboard exibe dados climáticos em tempo real obtidos da **API ClimAPI da Embrapa** (Empresa Brasileira de Pesquisa Agropecuária).

### Por que monitorar o clima?

O clima tem impacto direto na saúde e produtividade das galinhas:
- **Temperatura ideal**: 18-25°C (fora dessa faixa afeta a postura e bem-estar)
- **Umidade ideal**: 50-70% (muito baixa ou alta causa problemas respiratórios)
- **Alertas automáticos**: O sistema avisa quando condições estão inadequadas

### O que é exibido

- 🌡️ **Temperatura atual** em tempo real
- 💧 **Umidade relativa** do ar
- ✅ **Avaliação automática** das condições (Ideal, Frio, Quente, Crítico)
- ⚠️ **Alertas inteligentes** quando condições exigem ação
- � **Recomendações práticas** para correção

### Funcionamento Técnico

1. **Autenticação OAuth 2.0**: Client Credentials Grant
2. **Modelo GFS**: Dados de previsão numérica do tempo
3. **Variáveis utilizadas**:
   - `tmp2m`: Temperatura a 2 metros do solo (°C)
   - `rh2m`: Umidade relativa a 2 metros (%)
4. **Cache inteligente**: Dados atualizados a cada 30 minutos
5. **Token automático**: Renovação transparente a cada hora

### Arquitetura da Integração

```
EmbrapaWeatherCard (Presentation)
    ↓
obterDadosClimaEmbrapa (Application/Use Case)
    ↓
EmbrapaWeatherService (Infrastructure)
    ↓
EmbrapaApiClient (Infrastructure - OAuth 2.0)
    ↓
API ClimAPI Embrapa
```

### Configuração

Veja a seção [Configuração](#configuração) acima para obter e configurar suas credenciais.

### Tratamento de Erros

- Se a API estiver indisponível, o card exibe mensagem de erro
- Botão "Tentar Novamente" permite forçar atualização
- Cache local evita múltiplas requisições desnecessárias

### Referências

- **Documentação da API**: https://api.cnptia.embrapa.br/docs
- **Registrar aplicação**: https://api.cnptia.embrapa.br
- **Modelo GFS**: NCEP Global Forecast System

##  Próximos Passos

- [ ] Implementar testes automatizados (Jest + React Testing Library)
- [ ] Adicionar TypeScript para melhor type safety
- [ ] Criar sistema de notificações em tempo real
- [ ] Implementar PWA (Progressive Web App)
- [ ] Adicionar gráficos e dashboards avançados
- [ ] Otimizar performance com lazy loading
- [ ] Histórico de dados climáticos (gráficos de temperatura/umidade)
- [ ] Expandir testes automatizados para API Embrapa
- [ ] Implementar monitoramento de uptime da API
- [ ] Adicionar alertas por email/SMS para condições críticas