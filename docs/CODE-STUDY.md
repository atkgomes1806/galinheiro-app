# 💻 CODE-STUDY.MD - Guia de Código Detalhado por Linguagem

## 🎯 **VISÃO GERAL - ANÁLISE DE CÓDIGO**

**Objetivo**: Análise linha por linha do código implementado  
**Foco**: Sintaxe, padrões, funções e interações entre linguagens  
**Metodologia**: Do básico ao avançado, com trechos reais do projeto  
**Linguagens**: JavaScript (ES6+), JSX, CSS, JSON, SQL  

---

## 📖 **PARTE I: JAVASCRIPT FUNDAMENTAL**

### 1.1 **Configuração e Imports (ES6 Modules)**

#### **Arquivo: `src/main.jsx`** (Entry Point)
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```
**Conceitos**: ES6 imports, React 18 createRoot, JSX syntax, CSS imports

#### **Arquivo: `vite.config.js`** (Build Configuration)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
```
**Conceitos**: Module exports, function configuration, object destructuring

### 1.2 **Classes e Entidades (OOP)**

#### **Arquivo: `src/domain/entities/Galinha.js`**
```javascript
/**
 * Entidade Galinha - Representa uma galinha no domínio
 */
export class Galinha {
  constructor({ id, nome, raca, dataNascimento, ativa = true, observacoes = '', userId }) {
    this.id = id;
    this.nome = nome;
    this.raca = raca;
    this.dataNascimento = new Date(dataNascimento);
    this.ativa = ativa;
    this.observacoes = observacoes;
    this.userId = userId;
  }

  // Método para calcular idade em dias
  getIdadeEmDias() {
    const hoje = new Date();
    const diffTime = Math.abs(hoje - this.dataNascimento);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Método para verificar se é produtiva (mais de 150 dias)
  isProdutiva() {
    return this.getIdadeEmDias() > 150;
  }

  // Método para formatar para exibição
  toDisplayObject() {
    return {
      id: this.id,
      nome: this.nome,
      raca: this.raca,
      idade: `${this.getIdadeEmDias()} dias`,
      status: this.ativa ? 'Ativa' : 'Inativa',
      produtiva: this.isProdutiva() ? 'Sim' : 'Não'
    };
  }
}
```
**Conceitos**: ES6 Classes, constructor destructuring, Date manipulation, Math operations, object methods, ternary operators

### 1.3 **Repository Pattern (Abstração)**

#### **Arquivo: `src/domain/repositories/GalinhaRepository.js`**
```javascript
/**
 * Contrato do repositório de galinhas
 * Define interface que implementações devem seguir
 */
export class GalinhaRepository {
  async listarTodas(userId) {
    throw new Error('Método listarTodas deve ser implementado');
  }

  async obterPorId(id, userId) {
    throw new Error('Método obterPorId deve ser implementado');
  }

  async criar(galinha) {
    throw new Error('Método criar deve ser implementado');
  }

  async atualizar(id, dados, userId) {
    throw new Error('Método atualizar deve ser implementado');
  }

  async remover(id, userId) {
    throw new Error('Método remover deve ser implementado');
  }
}
```
**Conceitos**: Abstract classes, async/await, Error throwing, interface contracts

---

## 📖 **PARTE II: JAVASCRIPT AVANÇADO**

### 2.1 **Async/Await e Promises (API Integration)**

#### **Arquivo: `src/infrastructure/supabase/GalinhaRepositorySupabase.js`**
```javascript
import { GalinhaRepository } from '../../domain/repositories/GalinhaRepository.js';
import { Galinha } from '../../domain/entities/Galinha.js';
import { supabase } from './client.js';

export class GalinhaRepositorySupabase extends GalinhaRepository {
  async listarTodas(userId) {
    try {
      const { data, error } = await supabase
        .from('galinhas')
        .select('*')
        .eq('user_id', userId)
        .eq('ativa', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao listar galinhas:', error);
        throw new Error(`Erro do banco: ${error.message}`);
      }

      return data.map(item => new Galinha({
        id: item.id,
        nome: item.nome,
        raca: item.raca,
        dataNascimento: item.data_nascimento,
        ativa: item.ativa,
        observacoes: item.observacoes,
        userId: item.user_id
      }));
    } catch (error) {
      console.error('Erro na operação de listagem:', error);
      throw error;
    }
  }

  async criar(galinha) {
    try {
      const { data, error } = await supabase
        .from('galinhas')
        .insert([
          {
            nome: galinha.nome,
            raca: galinha.raca,
            data_nascimento: galinha.dataNascimento.toISOString().split('T')[0],
            ativa: galinha.ativa,
            observacoes: galinha.observacoes,
            user_id: galinha.userId
          }
        ])
        .select()
        .single();

      if (error) throw new Error(`Erro ao criar galinha: ${error.message}`);

      return new Galinha({
        id: data.id,
        nome: data.nome,
        raca: data.raca,
        dataNascimento: data.data_nascimento,
        ativa: data.ativa,
        observacoes: data.observacoes,
        userId: data.user_id
      });
    } catch (error) {
      console.error('Erro ao criar galinha:', error);
      throw error;
    }
  }
}
```
**Conceitos**: Class inheritance, async/await, try/catch, destructuring, array methods (map), template literals, error handling, object transformation

### 2.2 **Use Cases (Business Logic)**

#### **Arquivo: `src/application/use-cases/criarGalinha.js`**
```javascript
/**
 * Use Case: Criar Galinha
 * Implementa regras de negócio para criação de galinhas
 */
export class CriarGalinha {
  constructor(galinhaRepository) {
    this.galinhaRepository = galinhaRepository;
  }

  async execute({ nome, raca, dataNascimento, observacoes = '', userId }) {
    // Validações de negócio
    if (!nome || nome.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (!raca || raca.trim().length < 2) {
      throw new Error('Raça deve ter pelo menos 2 caracteres');
    }

    const dataValidacao = new Date(dataNascimento);
    const hoje = new Date();
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(hoje.getFullYear() - 1);

    if (dataValidacao > hoje) {
      throw new Error('Data de nascimento não pode ser no futuro');
    }

    if (dataValidacao < umAnoAtras) {
      throw new Error('Data de nascimento muito antiga (máximo 1 ano)');
    }

    // Criar entidade
    const galinha = new Galinha({
      nome: nome.trim(),
      raca: raca.trim(),
      dataNascimento: dataValidacao,
      observacoes: observacoes.trim(),
      userId,
      ativa: true
    });

    // Persistir
    try {
      const galinhaCriada = await this.galinhaRepository.criar(galinha);
      console.log('✅ Galinha criada com sucesso:', galinhaCriada.nome);
      return galinhaCriada;
    } catch (error) {
      console.error('❌ Erro ao criar galinha:', error);
      throw new Error('Não foi possível criar a galinha. Tente novamente.');
    }
  }
}
```
**Conceitos**: Dependency injection, input validation, business rules, Date manipulation, string methods (trim), error propagation, logging

### 2.3 **API Integration com Fallback Strategy**

#### **Arquivo: `api/weather/data-real.js`** (Serverless Function)
```javascript
import fetch from 'node-fetch';

// Cache global (mantido enquanto function estiver "quente")
let tokenCache = { token: null, expiresAt: null };

const CONFIG = {
  tokenURL: process.env.EMBRAPA_TOKEN_URL || 'https://api.cnptia.embrapa.br/token',
  apiURL: process.env.EMBRAPA_API_URL || 'https://api.cnptia.embrapa.br/climapi/v1',
  consumerKey: process.env.EMBRAPA_CONSUMER_KEY,
  consumerSecret: process.env.EMBRAPA_CONSUMER_SECRET,
};

async function getOAuthToken() {
  // Verificar cache
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  try {
    const credentials = Buffer.from(`${CONFIG.consumerKey}:${CONFIG.consumerSecret}`).toString('base64');
    
    const response = await fetch(CONFIG.tokenURL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`OAuth failed: ${response.status}`);
    }

    const tokenData = await response.json();
    
    // Atualizar cache
    tokenCache = {
      token: tokenData.access_token,
      expiresAt: Date.now() + (55 * 60 * 1000) // 55 minutos
    };

    return tokenCache.token;
  } catch (error) {
    console.error('🔴 Erro OAuth:', error);
    throw error;
  }
}

async function fetchWithFallback(url) {
  const bearerToken = '724ecc90-70b1-36c1-b573-c5b01d6173ea';
  
  // 1. Tentar Bearer Token primeiro
  try {
    console.log('🔑 Tentando Bearer Token...');
    const bearerResponse = await fetch(url, {
      headers: { 'Authorization': `Bearer ${bearerToken}` }
    });
    
    if (bearerResponse.ok) {
      console.log('✅ Bearer Token funcionou!');
      return bearerResponse;
    }
  } catch (error) {
    console.log('⚠️ Bearer Token falhou, tentando OAuth...');
  }

  // 2. Fallback para OAuth
  try {
    const oauthToken = await getOAuthToken();
    const oauthResponse = await fetch(url, {
      headers: { 'Authorization': `Bearer ${oauthToken}` }
    });
    
    if (oauthResponse.ok) {
      console.log('✅ OAuth funcionou!');
      return oauthResponse;
    }
  } catch (error) {
    console.error('🔴 Fallback OAuth falhou:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const lat = req.query.lat || '-23.5505';
    const lon = req.query.lon || '-46.6333';
    const date = new Date().toISOString().split('T')[0];

    const [tempData, humidityData] = await Promise.all([
      fetchTemperature(lat, lon, date),
      fetchHumidity(lat, lon, date)
    ]);

    const result = processWeatherData(tempData, humidityData);
    return res.status(200).json(result);

  } catch (error) {
    console.error('🔴 Erro na API:', error);
    const fallbackData = generateFallbackData();
    return res.status(200).json(fallbackData);
  }
}
```
**Conceitos**: Module-level variables, environment variables, Buffer encoding, base64, HTTP headers, Promise.all(), query parameters, error recovery, conditional logic

---

## 📖 **PARTE III: REACT/JSX FUNDAMENTALS**

### 3.1 **Functional Components e Hooks**

#### **Arquivo: `src/presentation/components/GalinhaForm.jsx`**
```jsx
import React, { useState, useEffect } from 'react';

export function GalinhaForm({ onSubmit, initialData = null, loading = false }) {
  // Estados do componente
  const [formData, setFormData] = useState({
    nome: '',
    raca: '',
    dataNascimento: '',
    observacoes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect para popular formulário quando editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        raca: initialData.raca || '',
        dataNascimento: initialData.dataNascimento 
          ? new Date(initialData.dataNascimento).toISOString().split('T')[0] 
          : '',
        observacoes: initialData.observacoes || ''
      });
    }
  }, [initialData]);

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.raca.trim()) {
      newErrors.raca = 'Raça é obrigatória';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      const data = new Date(formData.dataNascimento);
      const hoje = new Date();
      if (data > hoje) {
        newErrors.dataNascimento = 'Data não pode ser no futuro';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler para mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handler para submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // Limpar formulário após sucesso
      if (!initialData) {
        setFormData({
          nome: '',
          raca: '',
          dataNascimento: '',
          observacoes: ''
        });
      }
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="galinha-form">
      <div className="form-group">
        <label htmlFor="nome">Nome da Galinha *</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          className={errors.nome ? 'error' : ''}
          placeholder="Ex: Galinha 001"
          disabled={isSubmitting || loading}
        />
        {errors.nome && <span className="error-message">{errors.nome}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="raca">Raça *</label>
        <select
          id="raca"
          name="raca"
          value={formData.raca}
          onChange={handleInputChange}
          className={errors.raca ? 'error' : ''}
          disabled={isSubmitting || loading}
        >
          <option value="">Selecione uma raça</option>
          <option value="Rhode Island Red">Rhode Island Red</option>
          <option value="Leghorn">Leghorn</option>
          <option value="Plymouth Rock">Plymouth Rock</option>
          <option value="Sussex">Sussex</option>
          <option value="Caipira">Caipira</option>
        </select>
        {errors.raca && <span className="error-message">{errors.raca}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="dataNascimento">Data de Nascimento *</label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleInputChange}
          className={errors.dataNascimento ? 'error' : ''}
          disabled={isSubmitting || loading}
        />
        {errors.dataNascimento && <span className="error-message">{errors.dataNascimento}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="observacoes">Observações</label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleInputChange}
          placeholder="Observações adicionais..."
          rows="3"
          disabled={isSubmitting || loading}
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={isSubmitting || loading}
          className="submit-button"
        >
          {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar' : 'Cadastrar')}
        </button>
      </div>
    </form>
  );
}
```
**Conceitos**: useState hook, useEffect hook, event handlers, form validation, controlled components, conditional rendering, spread operator, destructuring assignment, async event handlers

### 3.2 **Context API e State Management**

#### **Arquivo: `src/presentation/pages/GalinhasPage.jsx`**
```jsx
import React, { useState, useEffect, useCallback } from 'react';
import { GalinhaForm } from '../components/GalinhaForm.jsx';
import { GalinhasList } from '../components/GalinhasList.jsx';
import { listarGalinhas } from '../../application/use-cases/listarGalinhas.js';
import { criarGalinha } from '../../application/use-cases/criarGalinha.js';
import { removerGalinha } from '../../application/use-cases/removerGalinha.js';

export function GalinhasPage() {
  // Estados da página
  const [galinhas, setGalinhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Carregar galinhas ao montar componente
  const carregarGalinhas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const listaGalinhas = await listarGalinhas.execute();
      setGalinhas(listaGalinhas);
    } catch (err) {
      console.error('Erro ao carregar galinhas:', err);
      setError('Não foi possível carregar as galinhas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarGalinhas();
  }, [carregarGalinhas]);

  // Handler para criar nova galinha
  const handleCriarGalinha = async (dadosGalinha) => {
    try {
      await criarGalinha.execute(dadosGalinha);
      
      // Recarregar lista
      await carregarGalinhas();
      
      // Esconder formulário
      setShowForm(false);
      
      // Feedback para usuário
      alert('Galinha cadastrada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar galinha:', error);
      alert(`Erro: ${error.message}`);
    }
  };

  // Handler para remover galinha
  const handleRemoverGalinha = async (id) => {
    if (!confirm('Tem certeza que deseja remover esta galinha?')) {
      return;
    }

    try {
      await removerGalinha.execute(id);
      await carregarGalinhas();
      alert('Galinha removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover galinha:', error);
      alert(`Erro: ${error.message}`);
    }
  };

  // Renderização condicional baseada no estado
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <p>🐔 Carregando galinhas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={carregarGalinhas}>Tentar Novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>🐔 Gerenciar Galinhas</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="primary-button"
        >
          {showForm ? 'Cancelar' : '+ Nova Galinha'}
        </button>
      </header>

      {showForm && (
        <section className="form-section">
          <h2>Cadastrar Nova Galinha</h2>
          <GalinhaForm 
            onSubmit={handleCriarGalinha}
            loading={loading}
          />
        </section>
      )}

      <section className="list-section">
        <h2>Galinhas Cadastradas ({galinhas.length})</h2>
        {galinhas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma galinha cadastrada ainda.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="secondary-button"
            >
              Cadastrar Primeira Galinha
            </button>
          </div>
        ) : (
          <GalinhasList 
            galinhas={galinhas}
            onRemover={handleRemoverGalinha}
            loading={loading}
          />
        )}
      </section>
    </div>
  );
}
```
**Conceitos**: useCallback hook, dependency arrays, conditional rendering, event handling, async/await in components, state updates, component composition

---

## 📖 **PARTE IV: CSS E STYLING**

### 4.1 **CSS Global e Variables**

#### **Arquivo: `src/styles/globals.css`**
```css
/* CSS Custom Properties (Variáveis) */
:root {
  /* Cores principais */
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --secondary-color: #64748b;
  --background-color: #f8fafc;
  --surface-color: #ffffff;
  --text-color: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  --error-color: #dc2626;
  --success-color: #16a34a;
  --warning-color: #d97706;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Typography */
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--text-color);
  background-color: var(--background-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Utilitários de Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.page-container {
  min-height: 100vh;
  padding: var(--spacing-xl);
}

.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

/* Componentes de UI */
.card {
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-primary {
  background-color: var(--primary-color);
  color: white;
}

.button-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

/* Form Styles */
.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease-in-out;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: var(--error-color);
}

.error-message {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--error-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: var(--spacing-md);
  }
  
  .container {
    padding: 0 var(--spacing-md);
  }
  
  .button {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-sm);
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #0f172a;
    --surface-color: #1e293b;
    --text-color: #f1f5f9;
    --text-muted: #94a3b8;
    --border-color: #334155;
  }
}
```
**Conceitos**: CSS custom properties, CSS reset, responsive design, media queries, pseudo-classes, CSS Grid, Flexbox, transitions, transforms, dark mode

---

## 📖 **PARTE V: CONFIGURAÇÃO E BUILD**

### 5.1 **Package.json (Dependencies Management)**

#### **Arquivo: `package.json`**
```json
{
  "name": "galinheiro-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.38.4",
    "@vercel/speed-insights": "^1.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.1.1",
    "eslint": "^8.53.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "vite": "^4.5.0"
  }
}
```
**Conceitos**: npm scripts, dependency vs devDependency, semantic versioning, module type

### 5.2 **Environment Variables**

#### **Arquivo: `.env.example`**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Proxy - URL do servidor backend
VITE_BACKEND_PROXY_URL=http://localhost:3002

# Localização do galinheiro (ajuste para sua localização real)
VITE_LOCATION_LATITUDE=-23.5505
VITE_LOCATION_LONGITUDE=-46.6333
VITE_LOCATION_NAME=São Paulo

# Modo demonstração (desativar agora que temos o proxy)
VITE_USE_DEMO_WEATHER=false
```
**Conceitos**: Environment variables, VITE_ prefix, configuration management

---

## 📖 **PARTE VI: INTERAÇÃO ENTRE LINGUAGENS**

### 6.1 **JavaScript ↔ JSX Integration**

#### **Exemplo: Weather Card Component**
```jsx
// src/presentation/components/EmbrapaWeatherCard.jsx
import React, { useState, useEffect } from 'react';
import { obterDadosClimaEmbrapa } from '../../application/use-cases/obterDadosClimaEmbrapa.js';

export function EmbrapaWeatherCard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWeatherData() {
      try {
        setLoading(true);
        setError(null);
        
        // Chamada para Use Case (JavaScript puro)
        const data = await obterDadosClimaEmbrapa.execute();
        
        // Atualização do estado React
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWeatherData();
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(loadWeatherData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Função JavaScript pura para determinar ícone
  const getWeatherIcon = (temperatura, umidade) => {
    if (temperatura > 25 && umidade < 60) return '☀️';
    if (temperatura < 15) return '🌡️';
    if (umidade > 80) return '💧';
    return '🌤️';
  };

  // Função JavaScript pura para determinar cor de alerta
  const getAlertColor = (temperatura, umidade) => {
    if (temperatura > 30 || temperatura < 10) return 'error';
    if (umidade > 85 || umidade < 40) return 'warning';
    return 'success';
  };

  // JSX com lógica JavaScript integrada
  return (
    <div className="weather-card">
      <div className="weather-header">
        <h3>🌤️ Condições Climáticas</h3>
        {loading && <span className="loading-indicator">Atualizando...</span>}
      </div>

      {error ? (
        <div className="weather-error">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>
            Tentar Novamente
          </button>
        </div>
      ) : weatherData ? (
        <div className="weather-content">
          <div className="weather-main">
            <div className="weather-icon">
              {getWeatherIcon(weatherData.temperatura, weatherData.umidade)}
            </div>
            <div className="weather-values">
              <div className="temperature">
                <span className="value">{weatherData.temperatura}°C</span>
                <span className="label">Temperatura</span>
              </div>
              <div className="humidity">
                <span className="value">{weatherData.umidade}%</span>
                <span className="label">Umidade</span>
              </div>
            </div>
          </div>

          <div className={`weather-status ${getAlertColor(weatherData.temperatura, weatherData.umidade)}`}>
            <p>{weatherData.recomendacao || 'Condições normais'}</p>
          </div>

          <div className="weather-meta">
            <small>
              Fonte: {weatherData.fonte} | 
              Atualizado: {new Date(weatherData.atualizadoEm).toLocaleTimeString('pt-BR')}
            </small>
          </div>
        </div>
      ) : (
        <div className="weather-loading">
          <p>🔄 Carregando dados climáticos...</p>
        </div>
      )}
    </div>
  );
}
```
**Conceitos**: React hooks, async/await in useEffect, cleanup functions, conditional rendering, template literals, Date formatting, CSS class binding

### 6.2 **Frontend ↔ Backend Communication**

#### **Exemplo: Service Integration**
```javascript
// src/infrastructure/embrapa/EmbrapaWeatherService.js
class EmbrapaWeatherService {
  constructor() {
    // Detecção automática de ambiente (JavaScript)
    const isProduction = window.location.hostname !== 'localhost';
    const baseURL = isProduction 
      ? window.location.origin  // Vercel: usar próprio domínio
      : 'http://localhost:3002'; // Local: backend separado
    
    this.proxyURL = import.meta.env.VITE_BACKEND_PROXY_URL || baseURL;
  }

  async obterDadosReais() {
    try {
      // HTTP Request para backend/serverless
      const response = await fetch(`${this.proxyURL}/api/weather/data-real`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Credentials para CORS
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse JSON response
      const data = await response.json();
      
      // Validação de dados
      if (!data.temperatura || !data.umidade) {
        throw new Error('Dados climáticos incompletos');
      }

      // Transformação de dados para o frontend
      return {
        temperatura: Number(data.temperatura),
        umidade: Number(data.umidade),
        fonte: data.fonte || 'API Embrapa',
        atualizadoEm: data.timestamp || new Date().toISOString(),
        recomendacao: this.avaliarCondicoes(data.temperatura, data.umidade)
      };

    } catch (error) {
      console.error('Erro ao obter dados do backend:', error);
      
      // Fallback para dados simulados
      return this.getDemoData();
    }
  }

  // Lógica de negócio (JavaScript puro)
  avaliarCondicoes(temperatura, umidade) {
    if (temperatura > 30) {
      return '🔥 Muito quente! Aumente a ventilação do galinheiro.';
    }
    if (temperatura < 10) {
      return '🥶 Muito frio! Considere aquecimento para as galinhas.';
    }
    if (umidade > 85) {
      return '💧 Umidade alta! Verifique ventilação.';
    }
    if (umidade < 40) {
      return '🌵 Ar seco! Considere umidificação.';
    }
    return '✅ Condições ideais para as galinhas!';
  }
}
```
**Conceitos**: Environment detection, fetch API, HTTP methods/headers, error handling, data transformation, business logic

---

## 🎯 **TÓPICOS PARA ANÁLISE DETALHADA**

### **JavaScript ES6+ Features**
- Destructuring assignment
- Spread/rest operators  
- Template literals
- Arrow functions
- Async/await
- Promises
- Modules (import/export)
- Classes and inheritance

### **React Patterns**
- Functional components
- Hooks (useState, useEffect, useCallback)
- Event handling
- Conditional rendering
- Component composition
- Props and state management
- Effect cleanup
- Custom hooks

### **CSS Modern Features**
- CSS Custom Properties
- Grid and Flexbox
- Media queries
- Pseudo-classes and pseudo-elements
- Transitions and transforms
- CSS naming conventions (BEM-like)

### **Build Tool Integration**
- Vite configuration
- Environment variables
- Hot module replacement
- Code splitting
- Tree shaking

### **API Integration Patterns**
- RESTful API calls
- Error handling strategies
- Caching mechanisms
- Fallback systems
- CORS handling

---

## 📚 **ARQUIVOS PARA ANÁLISE LINHA POR LINHA**

### **Básico (Sintaxe e Fundamentos)**
1. `src/main.jsx` - Entry point e imports
2. `src/domain/entities/Galinha.js` - Classes e métodos
3. `src/presentation/components/GalinhaForm.jsx` - Forms e hooks básicos
4. `package.json` - Configuração de projeto

### **Intermediário (Padrões e Integração)**
1. `src/infrastructure/supabase/GalinhaRepositorySupabase.js` - Async/await e APIs
2. `src/application/use-cases/criarGalinha.js` - Business logic
3. `src/presentation/pages/GalinhasPage.jsx` - State management
4. `src/styles/globals.css` - CSS avançado

### **Avançado (Arquitetura e Performance)**
1. `api/weather/data-real.js` - Serverless functions
2. `backend/src/routes/weather.js` - Express middleware
3. `src/infrastructure/embrapa/EmbrapaWeatherService.js` - Service integration
4. `vite.config.js` - Build configuration

Cada arquivo representa diferentes aspectos e complexidades da linguagem, permitindo análise progressiva do código.