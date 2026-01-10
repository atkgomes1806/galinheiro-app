# Galinheiro App 🐔

Este projeto é uma aplicação React chamada "galinheiro-app", que consome dados do Supabase e segue a Arquitetura Limpa. A aplicação é projetada para gerenciar um galinheiro completo, incluindo galinhas, tratamentos veterinários e registros de produção de ovos.

## ✨ Destaques Recentes

- ✅ **Correções Arquiteturais (Dezembro 2025)**: DashboardService Facade + Domínio enriquecido + Tema centralizado
- ✅ **Gráficos de Séries Temporais (Dezembro 2025)**: Dashboard com visualização de produção mensal/anual
- ✅ **Heatmap Mensal (Dezembro 2025)**: Calendário com cores baseadas em % de galinhas produzindo
- ✅ **Tooltips Interativos (Dezembro 2025)**: Informações ao passar o mouse sobre pontos do gráfico e heatmap
- ✅ **Geolocalização GPS (Novembro 2025)**: Dados climáticos baseados na localização do usuário
- ✅ **Organização Scripts (Novembro 2025)**: Pasta `/scripts/` centralizada com testes e utilitários
- ✅ **Refatoração Completa (Novembro 2025)**: Centralização de CSS e funções utilitárias
- 🌍 **Integração Open-Meteo API**: Dados climáticos em tempo real no dashboard
- 🎨 **Sistema de Design**: Classes CSS reutilizáveis e consistentes
- 📱 **Interface Moderna**: UI responsiva e acessível
- 🏗️ **Arquitetura Limpa**: Separação clara de responsabilidades
- 🚀 **Performance Otimizada**: CSS e JavaScript eficientes

### 📋 Últimas Melhorias Arquiteturais

#### 1. DashboardService Facade
- ✅ Orquestra múltiplos use cases de forma centralizada
- ✅ Desacopla componentes UI da Application Layer
- ✅ Arquivo: `src/application/services/DashboardService.js`

#### 2. Tema Centralizado para Heatmap e Gráficos
- ✅ Fonte única da verdade para cores e thresholds
- ✅ Elimina hardcoding de valores espalhados no código
- ✅ Arquivo: `src/theme/heatmapColorScheme.js`

#### 3. Tokens de Design em Uso
- ✅ Paleta e espaçamentos em JS usados nos gráficos e layout
- ✅ Arquivos: `src/theme/tokens.js`, `src/theme/charts.js`, `src/theme/components.js`

**Para detalhes completos**, consulte:
- 📊 `docs/ARCHITECTURE-ANALYSIS.md` - Análise estratégica completa
- 📋 `docs/CORRECTIONS-SUMMARY.md` - Resumo das 3 correções

## Estrutura do Projeto

A estrutura do projeto é organizada seguindo princípios de Arquitetura Limpa:

```
galinheiro-app
├── index.html                      # Arquivo HTML principal
├── package.json                    # Dependências e configurações do npm
├── vite.config.js                  # Configuração do Vite
├── .gitignore                      # Arquivos e pastas ignorados pelo Git
├── .env.example                    # Exemplo de variáveis de ambiente
├── README.md                       # Documentação do projeto
├── vercel.json                     # Configuração de deploy Vercel
├── docs/                           # 📚 Documentação técnica
│   ├── ARCHITECTURE-ANALYSIS.md    # Análise estratégica completa
│   ├── CORRECTIONS-SUMMARY.md      # Resumo das correções
│   ├── FILES-GUIDE.md              # Guia de arquivos modificados
│   ├── FINAL-REPORT.md             # Relatório final das correções
│   ├── NEXT-STEPS.md               # Roadmap de próximos passos
│   ├── REFACTORING_PLAN.md         # Plano detalhado da refatoração
│   ├── GPS-INTEGRATION.md          # Documentação da funcionalidade GPS
│   ├── ICONS-IMPLEMENTATION.md     # Documentação dos ícones e PWA
│   ├── CODE-STUDY.md               # Estudos e análises do código
│   └── STUDY.md                    # Estudos gerais do projeto
├── scripts/                        # 🛠️ Scripts de teste e utilitários
│   ├── README.md                   # Documentação dos scripts
│   ├── test-connection.js          # Teste de conectividade básica
│   └── test-gps-integration.html   # Teste standalone da funcionalidade GPS
├── public/
│   ├── robots.txt                  # Instruções para motores de busca
│   └── assets/                     # 🎨 Recursos estáticos
│       └── icons/                  # Favicons e ícones PWA
│           ├── favicon.ico
│           ├── favicon-16x16.png
│           ├── favicon-32x32.png
│           ├── apple-touch-icon.png
│           ├── android-chrome-192x192.png
│           ├── android-chrome-512x512.png
│           └── site.webmanifest
└── src/
  ├── main.jsx                    # Ponto de entrada da aplicação
  ├── App.jsx                     # Componente principal
  ├── hooks/                      # Hooks customizados
  │   └── useGeolocation.js       # Geolocalização GPS
  ├── theme/                      # 🎨 Tema centralizado (tokens em JS)
  │   ├── tokens.js               # Paleta base, tipografia, espaçamentos, sombras
  │   ├── charts.js               # Paletas de gráficos (heatmap e séries temporais)
  │   ├── components.js           # Tokens para cards, botões e badges
  │   ├── index.js                # Barrel export dos tokens
  │   └── heatmapColorScheme.js   # Reexport de helpers do heatmap (compatibilidade)
  ├── styles/                     # CSS centralizado
  │   ├── globals.css
  │   ├── components.css
  │   └── calendario.css
  ├── utils/
  │   └── index.js                # Funções utilitárias
  ├── presentation/
  │   ├── components/             # Componentes de UI
  │   │   ├── TimeSeriesChart.jsx
  │   │   ├── CalendarHeatmap.jsx
  │   │   ├── WeatherCard.jsx
  │   │   ├── GalinhasList.jsx
  │   │   ├── GalinhaForm.jsx
  │   │   ├── TratamentosList.jsx
  │   │   ├── TratamentoForm.jsx
  │   │   ├── RegistroOvoForm.jsx
  │   │   └── RequireAuth.jsx
  │   ├── pages/
  │   │   ├── DashboardPage.jsx
  │   │   ├── GalinhasPage.jsx
  │   │   ├── TratamentosPage.jsx
  │   │   ├── HistoricoPosturaPage.jsx
  │   │   └── LoginPage.jsx
  │   └── routes.jsx
  ├── application/
  │   ├── use-cases/              # Casos de uso
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
  │   └── services/               # Serviços e DI
  │       ├── DashboardService.js
  │       ├── galinhaInjector.js
  │       ├── registroOvoInjector.js
  │       └── tratamentoInjector.js
  ├── domain/
  │   ├── entities/
  │   │   └── Galinha.js
  │   └── repositories/
  │       ├── GalinhaRepository.js
  │       ├── RegistroOvoRepository.js
  │       └── TratamentoRepository.js
  └── infrastructure/
    ├── config/
    │   ├── index.js
    │   ├── galinhaInjector.js
    │   ├── registroOvoInjector.js
    │   └── tratamentoInjector.js
    ├── openmeteo/
    │   └── OpenMeteoWeatherService.js
    └── supabase/
      ├── client.js
      ├── GalinhaRepositorySupabase.js
      ├── RegistroOvoRepositorySupabase.js
      └── TratamentoRepositorySupabase.js
```

## 🧪 Scripts de Teste e Utilitários

O projeto inclui uma pasta `/scripts/` com ferramentas para desenvolvimento e validação:

### 📂 Arquivos Disponíveis

- **`test-connection.js`**: Teste de conectividade básica do projeto
- **`test-gps-integration.html`**: 📍 Teste standalone da funcionalidade GPS
- **`README.md`**: Documentação completa dos scripts

### 🔧 Como Usar os Scripts

```bash
# Testar conectividade básica
node scripts/test-connection.js

# Testar GPS (abrir no navegador)
# Abrir scripts/test-gps-integration.html diretamente no browser
```

### 🎯 Funcionalidades dos Scripts

**Teste de Conectividade**:
- ✅ Verifica dependências do projeto
- ✅ Testa configurações básicas
- ✅ Valida estrutura de arquivos

**Teste GPS**:
- ✅ Verifica suporte do navegador para geolocalização
- ✅ Testa solicitação de permissão GPS
- ✅ Valida reverse geocoding
- ✅ Testa cache localStorage

```

## 📍 Funcionalidade de Geolocalização GPS

O Galinheiro App agora possui funcionalidade completa de **geolocalização GPS**, permitindo aos usuários obter dados climáticos específicos para sua localização atual.

### ✨ Características da Funcionalidade GPS

#### 🛰️ Hook useGeolocation
- **Localização**: `src/hooks/useGeolocation.js`
- **Solicitação de permissão GPS** automática
- **Cache inteligente** com validade de 24 horas
- **Reverse geocoding** para nomes de localização (BigDataCloud API)
- **Tratamento de erros** e timeout (10 segundos)
- **Estados de carregamento** e permissões
- **Fallback automático** para localização padrão

#### 🌦️ Integração com Dados Climáticos
- **Open-Meteo Weather API** com suporte para coordenadas dinâmicas
- **Dados climáticos personalizados** baseados na localização do usuário
- **Atualização automática** quando localização muda
- **Comparação** entre localização atual e padrão

#### 🎨 Interface do Usuário
- **Botão GPS** integrado no WeatherCard (ícone 📍)
- **Indicadores visuais** de GPS ativo/inativo
- **Estados de carregamento** específicos ("📍 Obtendo localização...")
- **Feedback de erros** intuitivo e ações corretivas
- **Design responsivo** para desktop e mobile

### 🚀 Como Usar a Funcionalidade GPS

#### Para Usuários Finais
1. **Ativar GPS**: Clique no ícone 📍 no card de clima
2. **Permitir Localização**: Aceite a solicitação do navegador
3. **Dados Atualizados**: O clima será automaticamente atualizado para sua localização
4. **Expandir Detalhes**: Clique no card para ver coordenadas e endereço completo
5. **Desativar**: Clique novamente em 📍 para voltar à localização padrão

#### Estados Visuais
- 📍 **Cinza**: GPS inativo (usando localização padrão)
- 📍 **Verde/Ativo**: GPS funcionando com sua localização
- 📍 **Piscando**: Carregando/solicitando localização
- ❌ **Erro**: Falha na obtenção de localização

### 🔧 Implementação Técnica

#### Para Desenvolvedores
```javascript
// Usar o hook de geolocalização
import { useGeolocation } from './hooks/useGeolocation';

const MyComponent = () => {
    const {
        coordinates,       // { latitude, longitude }
        locationName,     // "São Paulo, SP"
        loading,          // Estado de carregamento
        error,           // Mensagens de erro
        hasPermission,   // Permissão concedida
        isLocationCached, // Localização em cache
        requestLocation, // Solicitar GPS
        clearLocation   // Limpar localização
    } = useGeolocation();
    
    return (
        <div>
            {coordinates ? (
                <p>📍 {locationName || `${coordinates.latitude}, ${coordinates.longitude}`}</p>
            ) : (
                <button onClick={requestLocation}>Usar minha localização</button>
            )}
        </div>
    );
};
```

#### Obter Dados Climáticos com GPS
```javascript
import { obterDadosClimaPorGPS } from './application/use-cases/obterDadosClima';

// Com coordenadas específicas
const dadosClima = await obterDadosClimaPorGPS(-23.5505, -46.6333);

// Usando o hook
const { coordinates } = useGeolocation();
if (coordinates) {
    const dadosClima = await obterDadosClimaPorGPS(
        coordinates.latitude, 
        coordinates.longitude
    );
}
```

### ⚙️ Configurações e APIs

#### Parâmetros GPS
- **Precisão alta** habilitada (`enableHighAccuracy: true`)
- **Timeout**: 10 segundos máximo
- **Cache**: 5 minutos para coordenadas, 24h para dados completos

#### APIs Utilizadas
- **Open-Meteo**: Dados meteorológicos baseados em coordenadas
- **BigDataCloud**: Reverse geocoding gratuito para nomes de localização
- **Browser Geolocation API**: Acesso ao GPS do dispositivo

#### Cache Local
- **Localização**: `localStorage.getItem('galinheiro_user_location')`
- **Permissões**: `localStorage.getItem('galinheiro_location_permission')`
- **Validade**: 24 horas com verificação automática

### 🛡️ Tratamento de Erros e Fallbacks

#### Tipos de Erro
1. **PERMISSION_DENIED**: Usuário negou permissão → Usar localização padrão
2. **POSITION_UNAVAILABLE**: GPS indisponível → Tentar novamente ou usar padrão
3. **TIMEOUT**: Demorou mais que 10s → Fallback automático
4. **NETWORK_ERROR**: Erro de rede → Cache local ou padrão

#### Estratégias de Fallback
- ❌ **GPS falhou** → Automaticamente usa localização padrão
- ❌ **Reverse geocoding falhou** → Exibe coordenadas numéricas
- ❌ **Cache inválido** → Nova solicitação transparente
- ❌ **API indisponível** → Dados em cache ou mensagem de erro

### 🧪 Testes e Validação

#### Arquivo de Teste Standalone
- **Local**: `scripts/test-gps-integration.html`
- **Funcionalidades**: Teste completo sem dependências do app
- **Verificações**:
  - ✅ Suporte do navegador para geolocalização
  - ✅ Solicitação e recebimento de coordenadas
  - ✅ Reverse geocoding funcionando
  - ✅ Cache localStorage operacional
  - ✅ Tratamento de erros

#### Como Testar
1. **Abra** `scripts/test-gps-integration.html` no navegador
2. **Clique** em "🧭 Solicitar Localização"
3. **Aceite** a permissão do navegador
4. **Verifique** se todos os testes passaram
5. **Teste cenários** de erro negando permissão

### 📚 Documentação Completa

Para documentação técnica detalhada, consulte:
- **`docs/GPS-INTEGRATION.md`**: Guia completo de implementação
- **`scripts/test-gps-integration.html`**: Teste standalone
- **`src/hooks/useGeolocation.js`**: Código fonte documentado

### 🔮 Futuras Melhorias GPS

- [ ] **Múltiplas localizações salvas** pelo usuário
- [ ] **Histórico de localizações** utilizadas
- [ ] **Comparação climática** entre diferentes localizações
- [ ] **Notificações baseadas em localização** (alertas por região)
- [ ] **Integração com mapas** visuais
- [ ] **Precisão configurável** (alta vs economizar bateria)

## 🎨 Ícones e Progressive Web App (PWA)

O Galinheiro App possui um **conjunto completo de favicons** e configuração **PWA** para uma experiência nativa em todos os dispositivos.

### ✨ Características dos Ícones

#### 🖼️ Conjunto Completo de Favicons
- **favicon.ico**: Ícone principal multi-tamanho (16x16, 32x32, 48x48)
- **PNG Favicons**: Versões otimizadas para navegadores modernos
- **Apple Touch Icon**: Ícone 180x180 para dispositivos iOS
- **Android Chrome Icons**: 192x192 e 512x512 para Android
- **Web App Manifest**: Configuração PWA completa

#### 📱 Progressive Web App
- **Instalável**: Pode ser instalado como app nativo no dispositivo
- **Standalone**: Funciona como aplicação independente
- **Responsive**: Interface otimizada para desktop e mobile
- **Theme Color**: Cores personalizadas (#10b981 - verde primary)
- **Offline Ready**: Preparado para funcionalidades offline futuras

### 🚀 Como Instalar como PWA

#### Desktop (Chrome/Edge)
1. Abra o Galinheiro App no navegador
2. Clique no ícone de "Instalar" na barra de endereços
3. Confirme a instalação
4. O app será adicionado ao menu iniciar/aplicativos

#### Mobile (Android/iOS)
1. Acesse o app no navegador mobile
2. **Android**: Toque "Adicionar à tela inicial" no menu
3. **iOS**: Toque "Compartilhar" → "Adicionar à Tela de Início"
4. O ícone aparecerá na tela inicial como um app nativo

### 🔍 Localizações dos Ícones
```
public/assets/icons/
├── favicon.ico              # Favicon principal
├── favicon-16x16.png        # Navegadores (16x16)
├── favicon-32x32.png        # Navegadores (32x32)
├── apple-touch-icon.png     # iOS Safari (180x180)
├── android-chrome-192x192.png  # Android (192x192)
├── android-chrome-512x512.png  # Android HD (512x512)
└── site.webmanifest         # Configuração PWA
```

### 📚 Documentação Completa
Para detalhes técnicos sobre implementação, formatos e configuração PWA, consulte:
- **`docs/ICONS-IMPLEMENTATION.md`**: Guia completo de ícones e PWA
- **`public/assets/icons/site.webmanifest`**: Configuração PWA

## Padrões de CSS

O projeto utiliza um sistema de CSS centralizado para garantir consistência visual:

### Tema (Design Tokens em JS)
- **Local**: `src/theme/` (`tokens.js`, `charts.js`, `components.js`, `index.js`)
- **Uso**: importa tokens em JS para gráficos e UI, evitando hardcode de cores/espacamentos
- **Compat**: `heatmapColorScheme.js` reexporta helpers para manter caminhos legados
- **CSS alinhado**: variáveis `--primary`, `--gray-*`, `--danger-50` refletem os mesmos valores do tema

### Estrutura de Estilos
- **`src/styles/globals.css`**: Variáveis CSS, resets globais, estilos base e componentes gráficos
- **`src/styles/components.css`**: Classes reutilizáveis para componentes

### Novos Estilos para Gráficos (Dezembro 2025)

#### Time Series Chart
```css
.timeseries-chart          /* Container com overflow-x */
.timeseries-point-hit      /* Cursor pointer nos pontos */
.timeseries-tooltip        /* Tooltip com dark theme */
.timeseries-point-label    /* Labels dos valores */
.timeseries-x-label        /* Labels do eixo X */
```

**Funcionalidades**:
- ✨ Gráfico com série temporal anual/mensal
- 🎯 Pontos interativos com hover
- 💬 Tooltips com data, valor e nomes de galinhas
- 📊 Linha com área preenchida
- 🎨 Cores tema verde primary

#### Calendar Heatmap
```css
.heatmap-card              /* Container do heatmap */
.heatmap-legend            /* Legenda com escala 0-100% */
.heatmap-cell.level-0/1/2/3 /* 4 níveis de intensidade */
.legend-stop               /* Indicadores de cor na legenda */
```

**Funcionalidades**:
- 📅 Calendário mensal com 7 dias por semana
- 🎯 Cores baseadas em % de galinhas produzindo (0%, 25%, 50%, 100%)
- 💬 Tooltips com dia, total de ovos, % participação e nomes de galinhas
- 🖱️ Cursor pointer e visual interativo
- 🌿 Paleta de cores verde em 4 intensidades

### Convenções de Nomenclatura
- **Classes semânticas**: Nomes descritivos (`.card`, `.btn-primary`, `.page-header`)
- **Modificadores**: Sufixos para variações (`.btn-outline`, `.badge-warning`)
- **Estados**: Prefixos para estados (`.nav-item-active`, `.fab-rotate`)
- **Componentes específicos**: Prefixo do componente (`.timeseries-*`, `.heatmap-*`)

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

/* Gráficos (Novo) */
.timeseries-chart, .timeseries-tooltip
.heatmap-card, .heatmap-cell, .heatmap-legend

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

## 📊 Melhorias do Dashboard - Dezembro 2025

### Gráficos de Série Temporal
O dashboard agora exibe a **evolução da postura das galinhas** com dois modos de visualização:

#### Visão Anual (Gráfico de Linha)
- 📈 **Produção por mês** ao longo do ano
- 📊 Linha com preenchimento de área (visual agradável)
- 🎯 Pontos interativos com valores
- 💬 **Tooltips ao passar o mouse** mostrando:
  - Mês
  - Total de ovos
  - Nomes das galinhas que produziram

#### Visão Mensal (Heatmap)
- 📅 **Calendário mensal** com células coloridas
- 🎨 **4 cores** representando % de galinhas produzindo:
  - Cinza claro: 0% (nenhuma galinha produziu)
  - Verde claro: <25% (poucas galinhas)
  - Verde médio: 25-50% (metade do plantel)
  - Verde escuro: >50% (maioria produzindo)
- 💬 **Tooltips com informações detalhadas**:
  - Data do dia
  - Total de ovos
  - Percentual de galinhas do plantel que participaram
  - Nomes das galinhas que produziram

### Filtros Disponíveis
- **Galinha**: Selecione uma galinha específica ou "Todas"
- **Ano**: Escolha o ano para análise
- **Período**: Visualize ano inteiro ou mês específico

### Resumo de Dados
- **Total no período**: Soma de todos os ovos
- **Média diária**: Ovos por dia (calculada automaticamente)

### Componentes Utilizados
- **TimeSeriesChart**: Gráfico de série temporal customizado em SVG
- **CalendarHeatmap**: Calendário mensal com cores dinâmicas
- **DashboardPage**: Lógica de cálculo e agregação de dados

### Funcionamento Técnico

#### Cálculo da Série Temporal
```javascript
// Anual: 12 meses
const serie = [
  { label: "01", value: 45 },  // Janeiro: 45 ovos
  { label: "02", value: 52 },  // Fevereiro: 52 ovos
  // ...
]

// Mensal: dias do mês
const serie = [
  { label: "01", value: 3 },   // 1º: 3 ovos
  { label: "02", value: 4 },   // 2º: 4 ovos
  // ...
]
```

#### Cálculo do Heatmap
```javascript
// Para cada dia do mês:
{
  label: 15,                    // Número do dia
  value: 8,                     // Total de ovos
  percent: 66,                  // % de galinhas que produziram
  galinhas: ["Amelinha", "Marisol"], // Nomes das galinhas
  date: "2025-12-15"           // Data formatada
}
```

**Lógica de Percentual**:
- Conta quantas galinhas diferentes produziram naquele dia
- Divide pelo total de galinhas ativas no periodo
- Multiplica por 100 para obter percentual
- Resultado de 0-100% mapeia para cores level-0 até level-3

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

### Localização Padrão (Opcional)
```bash
# Coordenadas padrão para dados climáticos
VITE_DEFAULT_LATITUDE=-23.5505
VITE_DEFAULT_LONGITUDE=-46.6333
VITE_DEFAULT_LOCATION_NAME=São Paulo
```

**Nota**: A funcionalidade GPS permite obter dados climáticos para qualquer localização, mas você pode configurar coordenadas padrão como fallback.

## Executando a Aplicação

### Frontend (React)
```bash
# Instalar dependências (primeira vez)
npm install

# Iniciar aplicação
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

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
- **APIs Climáticas**: Open-Meteo Weather API (dados meteorológicos globais)
- **Geolocalização**: Browser Geolocation API + BigDataCloud (reverse geocoding)
- **Autenticação**: OAuth 2.0 Client Credentials
- **Estilização**: CSS Modules + CSS Custom Properties
- **Roteamento**: React Router v6
- **Gerenciamento de Estado**: React Hooks (useState, useEffect, custom hooks)
- **Arquitetura**: Clean Architecture
- **Versionamento**: Git
- **Cache**: localStorage para geolocalização e dados climáticos

## 🌤️ Integração com Open-Meteo Weather API

O dashboard exibe dados climáticos em tempo real obtidos da **Open-Meteo Weather API**, uma API meteorológica gratuita e de código aberto com cobertura global.

### 🆕 Funcionalidade GPS Integrada

O sistema agora permite usar **sua localização atual** para dados climáticos personalizados:
- 📍 **Clique no ícone GPS** no card de clima
- 🌍 **Permita acesso à localização** no navegador  
- 🌦️ **Dados atualizados automaticamente** para sua região
- 🔄 **Alterne entre localização atual e padrão** a qualquer momento

### Por que monitorar o clima?

O clima tem impacto direto na saúde e produtividade das galinhas:
- **Temperatura ideal**: 18-25°C (fora dessa faixa afeta a postura e bem-estar)
- **Umidade ideal**: 50-70% (muito baixa ou alta causa problemas respiratórios)
- **Alertas automáticos**: O sistema avisa quando condições estão inadequadas

### O que é exibido

- 🌡️ **Temperatura atual** e sensação térmica
- 💧 **Umidade relativa** do ar
- 💨 **Velocidade e direção do vento**
- 🕒 **Previsão próximas horas** (3 horas seguintes)
- 📅 **Previsão próximos dias** (até 7 dias)
- ✅ **Avaliação automática** das condições (Ideal, Atenção, Crítico)
- ⚠️ **Alertas inteligentes** quando condições exigem ação
- 💡 **Recomendações práticas** para manejo do galinheiro

### Funcionamento Técnico

1. **API Gratuita**: Sem necessidade de chaves ou autenticação
2. **Cobertura Global**: Dados para qualquer localização mundial
3. **Modelos Meteorológicos**: GFS, ECMWF, GEM (alta precisão)
4. **Variáveis utilizadas**:
   - Temperatura e sensação térmica (°C)
   - Umidade relativa (%)
   - Velocidade do vento (km/h)
   - Direção do vento e precipitação
5. **Cache inteligente**: Dados atualizados conforme necessário
6. **Geolocalização**: Coordenadas GPS para dados locais precisos

### Arquitetura da Integração

```
WeatherCard (Presentation) + useGeolocation Hook
    ↓
obterDadosClima / obterDadosClimaPorGPS (Application/Use Cases)
    ↓
OpenMeteoWeatherService (Infrastructure)
    ↓
Open-Meteo Weather API (Externa - GPS ou coordenadas padrão)
    ↓
BigDataCloud API (Reverse Geocoding - opcional)
```

### Vantagens da Open-Meteo

- ✅ **Gratuita**: Sem limites de requisições
- ✅ **Precisão**: Múltiplos modelos meteorológicos
- ✅ **Cobertura**: Dados globais em tempo real
- ✅ **Performance**: API rápida e confiável
- ✅ **Código Aberto**: Transparente e documentada
- ✅ **GPS**: Suporte nativo para coordenadas dinâmicas

### Tratamento de Erros

- Se a API estiver indisponível, o card exibe mensagem de erro
- Botão "Tentar Novamente" permite forçar atualização
- Sistema de fallback automático para localização padrão
- Cache local evita múltiplas requisições desnecessárias
- Timeout configurável para requisições GPS

### Referências

- **API Open-Meteo**: https://open-meteo.com/
- **Documentação**: https://open-meteo.com/en/docs
- **BigDataCloud (Geocoding)**: https://bigdatacloud.com/

##  Próximos Passos

### 🧪 Funcionalidades Gerais
- [ ] Implementar testes automatizados (Jest + React Testing Library)
- [ ] Adicionar TypeScript para melhor type safety
- [ ] Criar sistema de notificações em tempo real
- [ ] Otimizar performance com lazy loading

### 📊 Melhorias nos Gráficos
- [ ] **Comparação anual**: Visualizar múltiplos anos lado a lado
- [ ] **Filtros por raça de galinha**: Análise por tipo de galinha
- [ ] **Gráficos adicionais**: Pizza (top produtoras), barras (semanal)
- [ ] **Export de dados**: Baixar gráficos em PDF/PNG
- [ ] **Análise de tendências**: Linha de tendência no gráfico temporal

### 📍 Melhorias GPS e Clima
- [ ] **Histórico de localizações** utilizadas pelo usuário
- [ ] **Múltiplas localizações salvas** com nomes personalizados
- [ ] **Comparação climática** entre diferentes regiões
- [ ] **Notificações baseadas em localização** (alertas específicos por região)
- [ ] **Integração com mapas** visuais (Google Maps/OpenStreetMap)
- [ ] **Precisão configurável** (alta precisão vs economia de bateria)
- [ ] **Histórico de dados climáticos** com gráficos temporais
- [ ] **Previsão estendida** (até 15 dias)
- [ ] **Alertas climáticos avançados** (geadas, tempestades, etc.)

### 🔧 Infraestrutura
- [ ] Expandir testes automatizados para APIs climáticas
- [ ] Implementar monitoramento de uptime das APIs
- [ ] Adicionar alertas por email/SMS para condições críticas
- [ ] Cache inteligente com sincronização offline
- [ ] Compressão e otimização de dados meteorológicos

- [ ] **Histórico de localizações** utilizadas pelo usuário
- [ ] **Múltiplas localizações salvas** com nomes personalizados
- [ ] **Comparação climática** entre diferentes regiões
- [ ] **Notificações baseadas em localização** (alertas específicos por região)
- [ ] **Integração com mapas** visuais (Google Maps/OpenStreetMap)
- [ ] **Precisão configurável** (alta precisão vs economia de bateria)
- [ ] **Histórico de dados climáticos** com gráficos temporais
- [ ] **Previsão estendida** (até 15 dias)
- [ ] **Alertas climáticos avançados** (geadas, tempestades, etc.)

### 🔧 Infraestrutura
- [ ] Expandir testes automatizados para APIs climáticas
- [ ] Implementar monitoramento de uptime das APIs
- [ ] Adicionar alertas por email/SMS para condições críticas
- [ ] Cache inteligente com sincronização offline
- [ ] Compressão e otimização de dados meteorológicos