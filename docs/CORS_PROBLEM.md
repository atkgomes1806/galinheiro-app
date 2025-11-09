# Problema de CORS com API Embrapa

## 🚫 O Problema

A API Embrapa ClimAPI está retornando erro **CORS (Cross-Origin Resource Sharing)**. Isso significa que o navegador está bloqueando as requisições JavaScript do frontend para a API da Embrapa.

### Por que isso acontece?

- **Segurança do navegador**: Por padrão, navegadores bloqueiam requisições JavaScript para domínios diferentes (cross-origin)
- **API sem CORS habilitado**: A API Embrapa não está configurada para aceitar requisições diretas de aplicações web no navegador
- **OAuth no frontend**: Expor credenciais OAuth (Consumer Key e Secret) no código JavaScript do frontend é um risco de segurança

## ✅ Soluções Possíveis

### 1. **Modo Demonstração (ATIVO AGORA)** ✨

Habilitamos dados simulados enquanto o problema não é resolvido.

**Ativação:**
```bash
# No arquivo .env
VITE_USE_DEMO_WEATHER=true
```

**Características:**
- ✅ Dados realistas que variam ao longo do dia
- ✅ Todos os alertas e avaliações funcionam
- ✅ Interface completa e funcional
- ⚠️ Aviso claro de que são dados simulados

### 2. **Backend Proxy (RECOMENDADO)** 🔧

Criar um servidor backend intermediário que faz as chamadas à API.

**Arquitetura:**
```
Frontend (React)
    ↓
Backend Proxy (Node.js/Express)
    ↓
API Embrapa
```

**Vantagens:**
- ✅ Resolve problema de CORS
- ✅ Credenciais seguras no servidor
- ✅ Cache no servidor
- ✅ Rate limiting

**Exemplo de implementação (Node.js + Express):**

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

// Cache de token
let tokenCache = null;
let tokenExpires = null;

async function getToken() {
  if (tokenCache && Date.now() < tokenExpires) {
    return tokenCache;
  }
  
  const credentials = Buffer.from(
    `${process.env.EMBRAPA_KEY}:${process.env.EMBRAPA_SECRET}`
  ).toString('base64');
  
  const response = await fetch('https://api.cnptia.embrapa.br/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  const data = await response.json();
  tokenCache = data.access_token;
  tokenExpires = Date.now() + (data.expires_in * 1000);
  
  return tokenCache;
}

app.get('/api/weather/:variavel/:data/:lon/:lat', async (req, res) => {
  try {
    const { variavel, data, lon, lat } = req.params;
    const token = await getToken();
    
    const response = await fetch(
      `https://api.cnptia.embrapa.br/climapi/v1/ncep-gfs/${variavel}/${data}/${lon}/${lat}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    const weatherData = await response.json();
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3002, () => {
  console.log('Proxy rodando na porta 3002');
});
```

### 3. **Extensão de Navegador (TEMPORÁRIO)** 🔌

Instalar extensão que desabilita CORS para desenvolvimento.

**Chrome:**
- Extension: "CORS Unblock" ou "Allow CORS"
- ⚠️ **Usar apenas para desenvolvimento**
- ⚠️ **Nunca em produção**

### 4. **Servidor Vite Proxy (DESENVOLVIMENTO)** ⚡

Configurar proxy no Vite para redirecionar requisições.

**vite.config.js:**
```javascript
export default defineConfig({
  // ... outras configurações
  server: {
    proxy: {
      '/api/embrapa': {
        target: 'https://api.cnptia.embrapa.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/embrapa/, ''),
      },
    },
  },
});
```

## 📋 Recomendação Final

**Para Desenvolvimento (AGORA):**
- ✅ Use `VITE_USE_DEMO_WEATHER=true` (dados simulados)
- Teste toda a interface e funcionalidades

**Para Produção (FUTURO):**
- 🔧 Implemente Backend Proxy (Solução 2)
- Opções:
  - Node.js + Express
  - Python + Flask/FastAPI
  - Serverless Function (Vercel, Netlify)

## 🎯 Próximos Passos

1. **Testar com dados simulados** (ativo agora)
2. **Decidir sobre backend proxy**
3. **Implementar proxy se necessário**
4. **Desativar modo demo** (`VITE_USE_DEMO_WEATHER=false`)

## 🔍 Como Identificar o Problema

Abra o Console do navegador (F12 → Console) e procure por:

```
❌ Access to fetch at 'https://api.cnptia.embrapa.br/...' from origin 'http://localhost:3001' 
   has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present...
```

Este erro confirma que é problema de CORS.

## 📚 Referências

- [MDN - CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)
- [API Embrapa](https://api.cnptia.embrapa.br)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
