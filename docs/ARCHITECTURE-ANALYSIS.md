# Análise Estratégica da Arquitetura - Galinheiro App

**Data**: Dezembro 2025  
**Perspectiva**: Senior Software Engineer + MLOps Focus  
**Escopo**: Clean Architecture, Padrões, Melhores Práticas, Testabilidade, Escalabilidade

---

## 📋 Índice

1. [Adesão à Regra de Dependência](#adesão-à-regra-de-dependência)
2. [Inversão de Dependência & Dependency Injection](#inversão-de-dependência--dependency-injection)
3. [Qualidade da Camada de Domínio](#qualidade-da-camada-de-domínio)
4. [Princípio DRY e Reutilização de Código](#princípio-dry-e-reutilização-de-código)
5. [Qualidade dos Custom Hooks](#qualidade-dos-custom-hooks)
6. [Segurança e Gerenciamento de Variáveis](#segurança-e-gerenciamento-de-variáveis)
7. [Maturidade de Testes, CI/CD e MLOps](#maturidade-de-testes-cicd-e-mlops)
8. [Estratégias de Cache e Performance](#estratégias-de-cache-e-performance)
9. [Visualização e Renderização de Componentes](#visualização-e-renderização-de-componentes)

---

## 1. Adesão à Regra de Dependência

### Status: ✅ BEM-IMPLEMENTADO (com 1 exceção notável)

A **Regra de Dependência** em Clean Architecture estipula: *as dependências devem sempre apontar para dentro (em direção ao núcleo)*. Em outras palavras:
- Domain → não depende de nada
- Application → depende apenas de Domain
- Infrastructure → depende de Application e Domain
- Presentation → depende de Application

### Análise do Projeto

#### ✅ Layers bem separadas
```
Domain (puro):
├── entities/Galinha.js
└── repositories/ (interfaces abstratas)

Application (use cases):
├── use-cases/ (business logic)
└── services/ (injetores de DI)

Infrastructure (concreto):
├── supabase/ (implementações)
└── openmeteo/ (integrações externas)

Presentation (UI):
├── components/
├── pages/
└── routes.jsx
```

#### ⚠️ Exceção Encontrada: Acoplamento em DashboardPage.jsx

```javascript
// ❌ PROBLEMA: Imports diretos da Application Layer
import { obterSumarioGalinheiro } from '../../application/use-cases/obterSumarioGalinheiro';
import { listarRegistrosOvos } from '../../application/use-cases/listarRegistrosOvos';
import { listarGalinhas } from '../../application/use-cases/listarGalinhas';

export default function DashboardPage() {
  // Cada mudança em um Use Case quebra o componente
  const [sumario, setSumario] = useState(null);
  
  useEffect(() => {
    const load = async () => {
      const data = await obterSumarioGalinheiro(galinhaRepository);
      setSumario(data);
    };
    load();
  }, []);
}
```

**Impacto**:
- 🔴 Tight coupling entre Presentation e Application
- 🔴 Componente não é testável sem mocking de imports
- 🔴 Mudanças em use cases quebram a página
- 🔴 Impossível trocar implementação de use cases em tempo de execução

### Recomendação: Implementar Service Facade

```javascript
// ✅ SOLUÇÃO: Criar DashboardService
class DashboardService {
  constructor(
    galinhaRepository,
    registroOvoRepository,
    tratamentoRepository
  ) {
    this.galinhaRepository = galinhaRepository;
    this.registroOvoRepository = registroOvoRepository;
    this.tratamentoRepository = tratamentoRepository;
  }

  async carregarDadosDashboard(filtros) {
    const sumario = await obterSumarioGalinheiro(this.galinhaRepository);
    const registros = await listarRegistrosOvos(this.registroOvoRepository);
    const galinhas = await listarGalinhas(this.galinhaRepository);
    
    return { sumario, registros, galinhas };
  }
}

// Na Presentation Layer:
export default function DashboardPage() {
  const dashboardService = useMemo(
    () => new DashboardService(
      galinhaRepository,
      registroOvoRepository,
      tratamentoRepository
    ),
    [galinhaRepository, registroOvoRepository, tratamentoRepository]
  );

  useEffect(() => {
    const load = async () => {
      const data = await dashboardService.carregarDadosDashboard({});
      setData(data);
    };
    load();
  }, [dashboardService]);
}
```

**Benefícios**:
- ✅ Separa orquestração de múltiplos use cases
- ✅ Testável isoladamente
- ✅ Fácil de mockar em testes
- ✅ Permite trocar implementação sem afetar UI

---

## 2. Inversão de Dependência & Dependency Injection

### Status: ✅ BEM-IMPLEMENTADO

O projeto utiliza **Factory Pattern** para injeção de dependências via `src/infrastructure/config/`.

### Padrão Implementado

#### Domain Layer: Interfaces Abstratas
```javascript
// src/domain/repositories/GalinhaRepository.js
export class GalinhaRepository {
  async listar() {
    throw new Error('Must implement listar()');
  }

  async criar(galinha) {
    throw new Error('Must implement criar()');
  }

  async atualizar(id, galinha) {
    throw new Error('Must implement atualizar()');
  }

  async remover(id) {
    throw new Error('Must implement remover()');
  }
}
```

#### Infrastructure Layer: Implementações Concretas
```javascript
// src/infrastructure/supabase/GalinhaRepositorySupabase.js
import { GalinhaRepository } from '../../domain/repositories/GalinhaRepository';

export class GalinhaRepositorySupabase extends GalinhaRepository {
  constructor(supabaseClient) {
    super();
    this.supabaseClient = supabaseClient;
  }

  async listar() {
    const { data, error } = await this.supabaseClient
      .from('galinhas')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async criar(galinha) {
    const { data, error } = await this.supabaseClient
      .from('galinhas')
      .insert([galinha]);
    
    if (error) throw error;
    return data[0];
  }
}
```

#### Application Layer: Casos de Uso
```javascript
// src/application/use-cases/listarGalinhas.js
export async function listarGalinhas(galinhaRepository) {
  // galinhaRepository é injetado como parâmetro
  // Não há dependência hardcoded
  return await galinhaRepository.listar();
}
```

#### Config: Injetor de Dependências
```javascript
// src/infrastructure/config/index.js
import { supabaseClient } from '../supabase/client';
import { GalinhaRepositorySupabase } from '../supabase/GalinhaRepositorySupabase';

const galinhaRepository = new GalinhaRepositorySupabase(supabaseClient);

export const galinhaInjector = {
  getRepository: () => galinhaRepository,
  listarGalinhas: () => listarGalinhas(galinhaRepository),
  criarGalinha: (galinha) => criarGalinha(galinhaRepository, galinha),
};
```

### Vantagens Observadas

✅ **Testabilidade**: Fácil mockar repositórios em testes  
✅ **Flexibilidade**: Trocar Supabase por outro backend sem afetar use cases  
✅ **Manutenibilidade**: Dependências claras e explícitas  
✅ **Escalabilidade**: Adicionar novos repositórios é simples  

### Oportunidades de Melhoria

⚠️ **Falta de Singleton/Service Locator Pattern**: Múltiplas instâncias podem ser criadas  
⚠️ **Sem contenedor IoC global**: Difícil gerenciar dependências complexas  

---

## 3. Qualidade da Camada de Domínio

### Status: 🔴 CRÍTICO - Camada de Domínio Vazia

A camada de domínio é o **coração** de uma arquitetura limpa, mas está praticamente vazia.

### Problema Atual

#### Galinha.js: DTO puro, sem lógica de negócio
```javascript
// src/domain/entities/Galinha.js
export class Galinha {
  constructor({
    id,
    nome,
    idade,
    raca,
    dataAquisicao,
    statusProducao,
    dataMorte
  }) {
    this.id = id;
    this.nome = nome;
    this.idade = idade;
    this.raca = raca;
    this.dataAquisicao = dataAquisicao;
    this.statusProducao = statusProducao;
    this.dataMorte = dataMorte;
  }
}
```

**Problemas**:
- 🔴 Nenhuma validação de dados
- 🔴 Nenhuma regra de negócio
- 🔴 Nenhum método de comportamento
- 🔴 É apenas uma transferência de dados (DTO), não uma entidade de domínio

### O que Deveria Estar Aqui

```javascript
// ✅ SOLUÇÃO: Galinha com Lógica de Negócio
export class Galinha {
  static readonly IDADE_MAXIMA = 15;
  static readonly IDADE_PRODUCAO_MINIMA = 6;
  static readonly IDADE_PRODUCAO_MAXIMA = 12;

  constructor({
    id,
    nome,
    idade,
    raca,
    dataAquisicao,
    statusProducao,
    dataMorte
  }) {
    // Validação na construção
    this.validarIdade(idade);
    this.validarNome(nome);

    this.id = id;
    this.nome = nome;
    this.idade = idade;
    this.raca = raca;
    this.dataAquisicao = dataAquisicao;
    this.statusProducao = statusProducao;
    this.dataMorte = dataMorte;
  }

  // Validações
  validarIdade(idade) {
    if (idade < 0 || idade > Galinha.IDADE_MAXIMA) {
      throw new Error(`Idade deve estar entre 0 e ${Galinha.IDADE_MAXIMA}`);
    }
  }

  validarNome(nome) {
    if (!nome || nome.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
  }

  // Métodos de Ciclo de Vida
  static criar(nome, raca, dataAquisicao) {
    return new Galinha({
      id: null, // será atribuído pelo repositório
      nome,
      idade: 0,
      raca,
      dataAquisicao,
      statusProducao: 'filhote',
      dataMorte: null
    });
  }

  // Métodos de Negócio
  isProducao() {
    return this.idade >= Galinha.IDADE_PRODUCAO_MINIMA &&
           this.idade < Galinha.IDADE_PRODUCAO_MAXIMA &&
           !this.dataMorte &&
           this.statusProducao === 'ativa';
  }

  getEstagio() {
    if (this.idade < 6) return 'filhote';
    if (this.idade < 12) return 'producao';
    if (this.idade < 15) return 'poedeira_velha';
    return 'apos_vida_util';
  }

  canReceiveTreatment() {
    return !this.dataMorte && this.statusProducao !== 'quarentena';
  }

  envelhecer() {
    this.idade += 1;
    if (this.idade > Galinha.IDADE_MAXIMA) {
      this.statusProducao = 'morta';
      this.dataMorte = new Date();
    }
  }

  marcarComoMorta() {
    this.statusProducao = 'morta';
    this.dataMorte = new Date();
  }

  marcarQuarentena() {
    this.statusProducao = 'quarentena';
  }

  recuperarDeQuarentena() {
    if (this.statusProducao === 'quarentena') {
      this.statusProducao = 'ativa';
    }
  }

  // Métodos de Validação
  isViva() {
    return !this.dataMorte && this.statusProducao !== 'morta';
  }

  isProntoParaProducao() {
    return this.isProducao() && !this.dataMorte;
  }
}
```

### Impacto da Solução

**Benefícios**:
- ✅ Lógica de negócio centralizada
- ✅ Regras validadas em todas as alterações
- ✅ Impossível criar estados inválidos
- ✅ Testes mais fáceis (testar domínio, não implementação)
- ✅ Documentação clara via código
- ✅ Facilita MLOps: features extraídas das entidades

**Estimativa de Implementação**: 2-3 dias

---

## 4. Princípio DRY e Reutilização de Código

### Status: ✅ BEM-IMPLEMENTADO

O projeto centraliza funções utilitárias e estilos, evitando repetição.

### Funções Utilitárias Centralizadas

```javascript
// src/utils/index.js
export function getAvatarColor(name) {
  // Implementação centralizada
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
  const hash = name.charCodeAt(0) + name.charCodeAt(1);
  return colors[hash % colors.length];
}

export function getInitial(name) {
  // Implementação centralizada
  return name.charAt(0).toUpperCase();
}

export function toDateLocalNoTZ(date) {
  // Implementação centralizada - evita problemas de timezone
  if (!date) return null;
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
}
```

### Estilos CSS Centralizados

```
src/styles/
├── globals.css       (variáveis, resets, componentes base)
├── components.css    (classes reutilizáveis)
└── calendario.css    (agora em src/styles, não em presentation)
```

#### Exemplo de Reutilização CSS

```css
/* src/styles/globals.css */
:root {
  --primary: #10b981;
  --secondary: #6b7280;
  --danger: #ef4444;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
}

.card {
  border-radius: 0.5rem;
  background: white;
  padding: var(--spacing-md);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}
```

#### Uso em Componentes

```jsx
// ✅ Correto: Classes reutilizáveis
<div className="card">
  <h1 className="page-title">Dashboard</h1>
  <button className="btn btn-primary">Ação</button>
</div>

// ❌ Evitar: Estilos inline
<div style={{ padding: '1rem', borderRadius: '0.5rem' }}>
  <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Dashboard</h1>
</div>
```

### Oportunidades de Melhoria

⚠️ **Cores do Heatmap espalhadas**: Thresholds hardcoded em `CalendarHeatmap.jsx` e `globals.css`

**Solução Recomendada**:
```javascript
// src/theme/heatmapColorScheme.js
export const HEATMAP_THRESHOLDS = {
  LEVEL_0: { min: 0, max: 0, label: '0%' },     // Cinza
  LEVEL_1: { min: 0, max: 25, label: '<25%' },  // Verde claro
  LEVEL_2: { min: 25, max: 50, label: '25-50%' }, // Verde médio
  LEVEL_3: { min: 50, max: 100, label: '>50%' }  // Verde escuro
};

export const HEATMAP_COLORS = {
  LEVEL_0: '#d1d5db', // cinza
  LEVEL_1: '#a7f3d0', // verde claro
  LEVEL_2: '#6ee7b7', // verde médio
  LEVEL_3: '#10b981'  // verde escuro
};

export function getHeatmapLevel(percentage) {
  if (percentage === 0) return 0;
  if (percentage < 25) return 1;
  if (percentage < 50) return 2;
  return 3;
}

export function getHeatmapColor(percentage) {
  const level = getHeatmapLevel(percentage);
  return Object.values(HEATMAP_COLORS)[level];
}
```

---

## 5. Qualidade dos Custom Hooks

### Status: ✅ EXCELENTE - Implementação Production-Ready

O hook `useGeolocation` é um exemplo de hook bem-estruturado, complexo e production-ready.

### Análise do useGeolocation Hook

```javascript
// src/hooks/useGeolocation.js (291 linhas)
export function useGeolocation() {
  const [coordinates, setCoordinates] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLocationCached, setIsLocationCached] = useState(false);
  
  // Implementação com:
  // ✅ Cache com timestamp de validade (24h)
  // ✅ Tratamento granular de erros (PERMISSION_DENIED, TIMEOUT, etc)
  // ✅ Reverse geocoding via BigDataCloud
  // ✅ Fallback automático para localização padrão
  // ✅ Limpeza de timeouts
  // ✅ Métodos públicos: requestLocation(), clearLocation()
}
```

### Pontos Fortes

✅ **Gerenciamento de Permissões**: Rastreia se o usuário concedeu permissão  
✅ **Cache Inteligente**: 24h TTL com validação de timestamp  
✅ **Tratamento de Erros**: Diferencia TIMEOUT, PERMISSION_DENIED, POSITION_UNAVAILABLE  
✅ **Limpeza de Recursos**: Remove timeouts na desmontagem  
✅ **Reverse Geocoding**: Integra BigDataCloud para nomes de localização  
✅ **Fallback Automático**: Usa coordenadas padrão se GPS falhar  
✅ **TypeScript-Ready**: Bem estruturado para migração futura  

### Oportunidade de Melhoria

⚠️ **Reverse Geocoding acoplado ao hook**: BigDataCloud API integrada diretamente

**Solução Recomendada**: Extrair para GeocodingService

```javascript
// src/infrastructure/services/GeocodingService.js
export class GeocodingService {
  static async reverseGeocode(latitude, longitude) {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding falhou');
    }
    
    const data = await response.json();
    return data.localityLanguage?.pt || `${latitude}, ${longitude}`;
  }
}

// No hook:
import { GeocodingService } from '../infrastructure/services/GeocodingService';

useEffect(() => {
  const fetchLocationName = async () => {
    try {
      const name = await GeocodingService.reverseGeocode(
        coordinates.latitude,
        coordinates.longitude
      );
      setLocationName(name);
    } catch (err) {
      setLocationName(`${coordinates.latitude}, ${coordinates.longitude}`);
    }
  };
  
  if (coordinates) {
    fetchLocationName();
  }
}, [coordinates]);
```

**Benefícios**:
- ✅ Hook mais simples e focado
- ✅ GeocodingService testável isoladamente
- ✅ Fácil trocar provider de geocoding
- ✅ Melhor separação de responsabilidades

---

## 6. Segurança e Gerenciamento de Variáveis

### Status: ✅ BEM-IMPLEMENTADO

Variáveis de ambiente protegidas com prefixo `VITE_` para exposição segura ao frontend.

### Configuração Segura

```bash
# .env (não versionado, apenas .env.example)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEFAULT_LATITUDE=-23.5505
VITE_DEFAULT_LONGITUDE=-46.6333
VITE_DEFAULT_LOCATION_NAME=São Paulo
```

### Acesso Seguro no Código

```javascript
// ✅ Correto: Acesso via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const defaultLat = import.meta.env.VITE_DEFAULT_LATITUDE;

// ❌ Evitar: process.env (Node.js, não funciona em Vite)
// ❌ Evitar: hardcoding de valores
```

### Proteções Observadas

✅ **RLS no Supabase**: Row-Level Security implementado  
✅ **Anonimato de chaves**: ANON_KEY com permissões restritas  
✅ **Sem logs sensíveis**: Código não expõe dados privados em console  
✅ **CORS configurado**: API responde apenas de origem confiável  

### Oportunidades de Melhoria

⚠️ **Sem rate limiting no frontend**: APIs externas (Open-Meteo, BigDataCloud) sem proteção  
⚠️ **Sem validação de entrada**: Inputs de GPS não validados antes de usar em API  

**Recomendações**:
```javascript
// Validação de coordenadas
function validarCoordenadas(latitude, longitude) {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Coordenadas inválidas');
  }
  
  if (lat < -90 || lat > 90) {
    throw new Error('Latitude fora do intervalo [-90, 90]');
  }
  
  if (lng < -180 || lng > 180) {
    throw new Error('Longitude fora do intervalo [-180, 180]');
  }
  
  return { latitude: lat, longitude: lng };
}

// Rate limiting simples
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  isAllowed() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}
```

---

## 7. Maturidade de Testes, CI/CD e MLOps

### Status: 🔴 CRÍTICO - Nenhum Framework de Testes

Este é o **bloqueador mais crítico** para produção.

### Problema Atual

```
✅ Desenvolvimento local funciona
❌ Sem testes automatizados (Jest, Vitest, RTL)
❌ Sem CI/CD pipeline
❌ Sem coverage reports
❌ Sem pre-commit hooks
❌ Sem documentação de teste
❌ Sem testes de integração
```

### Roadmap Recomendado: 3 Meses (4 Sprints)

#### Sprint 1: Setup de Testes (2 semanas)
```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom
npm install --save-dev jsdom
```

**Deliverables**:
- [ ] Configurar Vitest + jsdom
- [ ] Criar estrutura `src/__tests__/`
- [ ] Setup de coverage reporting
- [ ] Pre-commit hook com Husky
- [ ] Scripts em package.json:
  ```json
  {
    "scripts": {
      "test": "vitest",
      "test:ui": "vitest --ui",
      "test:coverage": "vitest --coverage"
    }
  }
  ```

#### Sprint 2: Testes de Unidade (2 semanas)
```javascript
// src/__tests__/domain/entities/Galinha.test.js
import { describe, it, expect } from 'vitest';
import { Galinha } from '../../../domain/entities/Galinha';

describe('Galinha Entity', () => {
  it('deve criar galinha com valores válidos', () => {
    const galinha = Galinha.criar('Amarelinha', 'Poedeira', new Date());
    expect(galinha.nome).toBe('Amarelinha');
    expect(galinha.idade).toBe(0);
  });

  it('deve lançar erro com idade inválida', () => {
    expect(() => {
      new Galinha({
        nome: 'Test',
        idade: 20, // > IDADE_MAXIMA
        raca: 'Poedeira'
      });
    }).toThrow();
  });

  it('deve identificar galinha em produção corretamente', () => {
    const galinha = new Galinha({
      idade: 8,
      statusProducao: 'ativa',
      dataMorte: null
    });
    expect(galinha.isProducao()).toBe(true);
  });
});
```

**Targets**:
- [ ] 10+ testes de Use Cases
- [ ] 5+ testes de Entities
- [ ] 80%+ coverage de Domain Layer

#### Sprint 3: Testes de Integração + Componentes (2 semanas)
```javascript
// src/__tests__/presentation/components/GalinhasList.test.jsx
import { render, screen } from '@testing-library/react';
import { GalinhasList } from '../../../presentation/components/GalinhasList';

describe('GalinhasList Component', () => {
  it('deve renderizar lista de galinhas', () => {
    const galinhas = [
      { id: 1, nome: 'Amarelinha' },
      { id: 2, nome: 'Marisol' }
    ];
    
    render(<GalinhasList galinhas={galinhas} />);
    
    expect(screen.getByText('Amarelinha')).toBeInTheDocument();
    expect(screen.getByText('Marisol')).toBeInTheDocument();
  });
});
```

**Targets**:
- [ ] Testes de componentes puros (TimeSeriesChart, CalendarHeatmap)
- [ ] Testes de hooks (useGeolocation)
- [ ] Testes de integração de páginas
- [ ] 60%+ coverage de Presentation Layer

#### Sprint 4: CI/CD Pipeline (1 semana)
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run build
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

**Targets**:
- [ ] GitHub Actions pipeline
- [ ] Codecov integration
- [ ] Build verification
- [ ] Pre-release checks

### Estimativa Total: 8-10 semanas

---

## 8. Estratégias de Cache e Performance

### Status: ✅ BEM-IMPLEMENTADO (com oportunidades)

O projeto implementa caching em múltiplos níveis.

### Cache Implementado

#### 1. Browser Cache (useGeolocation)
```javascript
// localStorage com 24h TTL
const CACHE_KEY = 'galinheiro_user_location';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

function saveToCache(location) {
  const cached = {
    data: location,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
}

function getFromCache() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  const age = Date.now() - timestamp;
  
  if (age > CACHE_TTL) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  
  return data;
}
```

#### 2. Dados Climáticos
Open-Meteo API cacheada implicitamente (API de leitura é stateless)

#### 3. Lazy Loading
Componentes poderiam usar React.lazy para divisão de código

### Oportunidades de Melhoria

⚠️ **Sem cache de listagens (galinhas, tratamentos)**
⚠️ **Sem estratégia de invalidação de cache**
⚠️ **Sem service worker para offline**

**Solução Recomendada**: Cache Manager

```javascript
// src/infrastructure/cache/CacheManager.js
export class CacheManager {
  constructor(ttlMs = 5 * 60 * 1000) {
    this.cache = new Map();
    this.ttl = ttlMs;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.value;
  }

  invalidate(key) {
    this.cache.delete(key);
  }

  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

// Uso:
const cacheManager = new CacheManager(5 * 60 * 1000); // 5 minutos

// Em um use case:
export async function listarGalinhas(galinhaRepository) {
  const cached = cacheManager.get('galinhas:list');
  if (cached) return cached;
  
  const galinhas = await galinhaRepository.listar();
  cacheManager.set('galinhas:list', galinhas);
  return galinhas;
}

// Invalidar ao criar nova galinha:
export async function criarGalinha(galinhaRepository, dados) {
  const result = await galinhaRepository.criar(dados);
  cacheManager.invalidatePattern('galinhas:.*');
  return result;
}
```

---

## 9. Visualização e Renderização de Componentes

### Status: ✅ BEM-IMPLEMENTADO

Componentes de visualização (TimeSeriesChart, CalendarHeatmap) são puros, eficientes e baseados em SVG.

### TimeSeriesChart Analysis

```javascript
// src/presentation/components/TimeSeriesChart.jsx
export default function TimeSeriesChart({
  data,          // Array de { label, value }
  title,
  tooltip,
  height = 300
}) {
  // ✅ Componente puro: sem side effects
  // ✅ Renderização via SVG: escalável e eficiente
  // ✅ Tooltips interativos: UX melhorada
  // ✅ Responsivo: calcula largura dinamicamente
  
  return (
    <svg className="timeseries-chart" height={height}>
      {/* Linha com área preenchida */}
      <path d={calculatePath(data)} stroke="var(--primary)" />
      
      {/* Pontos interativos */}
      {data.map((point, i) => (
        <circle key={i} cx={x(i)} cy={y(point.value)} r={4} />
      ))}
      
      {/* Tooltips */}
      {hoveredIndex !== null && (
        <foreignObject x={tooltipX} y={tooltipY} width={200} height={100}>
          <div className="timeseries-tooltip">
            {tooltip(data[hoveredIndex])}
          </div>
        </foreignObject>
      )}
    </svg>
  );
}
```

### CalendarHeatmap Analysis

```javascript
// src/presentation/components/CalendarHeatmap.jsx
export default function CalendarHeatmap({
  days,      // Array de { label, value, percent, galinhas, date }
  selectedDay,
  onSelectDay
}) {
  // ✅ Componente puro
  // ✅ Cores dinâmicas baseadas em % threshold
  // ✅ Tooltips com informações detalhadas
  // ✅ Grid layout limpo (7 colunas = dias da semana)
  
  return (
    <div className="heatmap-card">
      <div className="heatmap-grid">
        {days.map(day => (
          <div
            key={day.date}
            className={`heatmap-cell level-${getLevel(day.percent)}`}
            onClick={() => onSelectDay(day)}
          >
            {day.label}
            <div className="heatmap-tooltip">
              {/* Tooltip com data, total, %, galinhas */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Oportunidades de Melhoria

⚠️ **Cores hardcoded**: Thresholds em múltiplos locais  
⚠️ **Sem memoization**: Componentes podem re-renderizar desnecessariamente  
⚠️ **Sem responsividade forte**: Pode quebrar em telas muito pequenas  

**Solução**: Usar useMemo + tema centralizado

```javascript
import { useMemo } from 'react';
import { HEATMAP_COLORS, HEATMAP_THRESHOLDS } from '../../theme/heatmapColorScheme';

export default function CalendarHeatmap({ days, selectedDay, onSelectDay }) {
  const cellsByWeek = useMemo(() => {
    return days.reduce((acc, day, i) => {
      const weekIndex = Math.floor(i / 7);
      if (!acc[weekIndex]) acc[weekIndex] = [];
      acc[weekIndex].push(day);
      return acc;
    }, []);
  }, [days]);

  return (
    <div className="heatmap-card">
      {cellsByWeek.map((week, weekIndex) => (
        <div key={weekIndex} className="heatmap-week">
          {week.map(day => {
            const level = getHeatmapLevel(day.percent);
            const color = Object.values(HEATMAP_COLORS)[level];
            
            return (
              <div
                key={day.date}
                className={`heatmap-cell level-${level}`}
                style={{ backgroundColor: color }}
                onClick={() => onSelectDay(day)}
              >
                {day.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Resumo Executivo

### 3 Pontos Fortes ✅

1. **Clean Architecture bem implementada**: Domain, Application, Infrastructure, Presentation claramente separadas
2. **Componentes puros e eficientes**: TimeSeriesChart e CalendarHeatmap são bem desenhados e performáticos
3. **Custom hook robusto**: useGeolocation é production-ready com tratamento de erros, cache e fallbacks

### 3 Áreas Críticas 🔴

1. **SEM TESTES AUTOMATIZADOS**: Bloqueador para produção. Roadmap de 8-10 semanas proposto
2. **Domínio vazio de lógica**: Entidades são DTOs. Necessário enriquecer com validações e regras de negócio (2-3 dias)
3. **Tight coupling em DashboardPage**: Imports diretos de use cases quebram a regra de dependência. Solução: DashboardService Facade (3-5 dias)

### Roadmap Proposto

#### Próximas 2 Semanas
- ✅ Criar arquivo de tema (`src/theme/heatmapColorScheme.js`)
- ✅ Extrair GeocodingService do useGeolocation hook
- ✅ Implementar DashboardService Facade

#### Próximas 4 Semanas
- ✅ Enriquecer entidade Galinha com validações e métodos
- ✅ Setup de testes (Vitest + RTL)
- ✅ Primeiros 10+ testes de use cases

#### Próximos 3 Meses
- ✅ Implementar 80%+ coverage de Domain Layer
- ✅ CI/CD pipeline com GitHub Actions
- ✅ Service Locator pattern para DI global

---

## 🎯 Conclusão

O Galinheiro App possui uma **arquitetura sólida** com boas separações de responsabilidades, mas precisa de:

1. **Testes automatizados** (CRÍTICO)
2. **Domínio enriquecido** com lógica de negócio
3. **Redução de acoplamento** na camada de Presentation

Com essas melhorias, o projeto estará **production-ready** e facilitará evolução futura, especialmente para MLOps (features extraídas de entidades bem-estruturadas).

---

**Preparado em**: Dezembro 2025  
**Próxima Revisão**: Após implementação de testes (Sprint 2)
